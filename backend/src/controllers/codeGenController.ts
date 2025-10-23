import { Request, Response } from 'express';
import { DynamoDBService } from '@/services/database/dynamoDBService';
import { CodeGenerationService } from '@/services/codeGenerationService';
import { S3Service } from '@/services/storage/s3Service';
import { SQSService } from '@/services/queue/sqsService';
import { SNSService } from '@/services/notifications/snsService';
import { codeGenerationSchema } from '@/validation/schemas';
import { v4 as uuidv4 } from 'uuid';
import { CodeGeneration } from '@/models';

const dynamoDB = new DynamoDBService();
const codeGenService = new CodeGenerationService();
const s3Service = new S3Service();
const sqsService = new SQSService();
const snsService = new SNSService();

export const getAllCodeGenerations = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const codeGenerations = await dynamoDB.query({
      TableName: 'CodeGenerations',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    });
    res.json({ codeGenerations: codeGenerations.Items || [] });
  } catch (error) {
    console.error('Error in getAllCodeGenerations:', error);
    res.status(500).json({ error: 'Failed to fetch code generations' });
  }
};

export const getCodeGenerationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const codeGen = await dynamoDB.get('CodeGenerations', { id, userId });
    if (!codeGen) {
      return res.status(404).json({ error: 'Code generation not found' });
    }
    res.json({ codeGeneration: codeGen });
  } catch (error) {
    console.error('Error in getCodeGenerationById:', error);
    res.status(500).json({ error: 'Failed to fetch code generation' });
  }
};

export const getCodeGenerationsByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const codeGenerations = await dynamoDB.query({
      TableName: 'CodeGenerations',
      IndexName: 'ProjectIdIndex',
      KeyConditionExpression: 'projectId = :projectId AND userId = :userId',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':userId': userId
      }
    });
    res.json({ codeGenerations: codeGenerations.Items || [] });
  } catch (error) {
    console.error('Error in getCodeGenerationsByProject:', error);
    res.status(500).json({ error: 'Failed to fetch project code generations' });
  }
};

export const generateCode = async (req: Request, res: Response) => {
  try {
    const { error, value } = codeGenerationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.userId;
    const codeGeneration: CodeGeneration = {
      id: uuidv4(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'queued',
      generatedCode: [],
      ...value
    };

    await dynamoDB.put('CodeGenerations', codeGeneration);

    // Enqueue to SQS for background processing
    await sqsService.enqueueCodeGeneration({
      codeGenId: codeGeneration.id,
      projectId: codeGeneration.projectId,
      userId,
      type: codeGeneration.type,
      prompt: codeGeneration.prompt
    });

    // Send notification
    await snsService.notifyCodeGeneration(userId, {
      codeGenId: codeGeneration.id,
      projectId: codeGeneration.projectId,
      status: 'queued'
    });

    res.status(202).json({ 
      codeGeneration,
      message: 'Code generation queued for processing' 
    });
  } catch (error) {
    console.error('Error in generateCode:', error);
    res.status(500).json({ error: 'Failed to queue code generation' });
  }
};


export const getDownloadUrl = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const codeGen = await dynamoDB.get('CodeGenerations', { id, userId });
    if (!codeGen) {
      return res.status(404).json({ error: 'Code generation not found' });
    }

    if (codeGen.status !== 'completed') {
      return res.status(400).json({ error: 'Code generation not completed yet' });
    }

    if (!codeGen.s3Key) {
      return res.status(404).json({ error: 'Generated code file not found in storage' });
    }

    // Generate presigned URL valid for 1 hour
    const downloadUrl = await s3Service.generatePresignedUrl(codeGen.s3Key, 3600);
    
    res.json({ 
      downloadUrl,
      expiresIn: 3600,
      fileName: `generated-code-${id}.zip`
    });
  } catch (error) {
    console.error('Error in getDownloadUrl:', error);
    res.status(500).json({ error: 'Failed to generate download URL' });
  }
};

export const downloadGeneratedCode = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const codeGen = await dynamoDB.get('CodeGenerations', { id, userId });
    if (!codeGen) {
      return res.status(404).json({ error: 'Code generation not found' });
    }

    if (codeGen.status !== 'completed') {
      return res.status(400).json({ error: 'Code generation not completed yet' });
    }

    let zipBuffer: Buffer;

    // Try S3 first, fallback to DynamoDB
    if (codeGen.s3Key) {
      try {
        zipBuffer = await s3Service.downloadFile(codeGen.s3Key);
      } catch (s3Error) {
        console.warn('Failed to download from S3, falling back to DynamoDB:', s3Error);
        zipBuffer = await codeGenService.createZipArchive(codeGen.generatedCode);
      }
    } else {
      zipBuffer = await codeGenService.createZipArchive(codeGen.generatedCode);
    }
    
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=generated-code-${id}.zip`);
    res.send(zipBuffer);
  } catch (error) {
    console.error('Error in downloadGeneratedCode:', error);
    res.status(500).json({ error: 'Failed to download generated code' });
  }
};

export const deleteCodeGeneration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const codeGen = await dynamoDB.get('CodeGenerations', { id, userId });
    
    // Delete from S3 if exists
    if (codeGen && codeGen.s3Key) {
      try {
        await s3Service.deleteFile(codeGen.s3Key);
      } catch (s3Error) {
        console.warn('Failed to delete S3 file:', s3Error);
      }
    }

    await dynamoDB.delete('CodeGenerations', { id, userId });
    res.json({ message: 'Code generation deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCodeGeneration:', error);
    res.status(500).json({ error: 'Failed to delete code generation' });
  }
};
