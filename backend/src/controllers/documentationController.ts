import { Request, Response } from 'express';
import { DynamoDBService } from '@/services/database/dynamoDBService';
import { S3Service } from '@/services/storage/s3Service';
import { documentationSchema } from '@/validation/schemas';
import { v4 as uuidv4 } from 'uuid';
import { Documentation } from '@/models';

const dynamoDB = new DynamoDBService();
const s3Service = new S3Service();

export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const documents = await dynamoDB.query({
      TableName: 'Documentation',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    });
    res.json({ documents: documents.Items || [] });
  } catch (error) {
    console.error('Error in getAllDocuments:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const document = await dynamoDB.get('Documentation', { id, userId });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json({ document });
  } catch (error) {
    console.error('Error in getDocumentById:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
  }
};

export const getProjectDocuments = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const documents = await dynamoDB.query({
      TableName: 'Documentation',
      IndexName: 'ProjectIdIndex',
      KeyConditionExpression: 'projectId = :projectId AND userId = :userId',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':userId': userId
      }
    });
    res.json({ documents: documents.Items || [] });
  } catch (error) {
    console.error('Error in getProjectDocuments:', error);
    res.status(500).json({ error: 'Failed to fetch project documents' });
  }
};

export const getDocumentsByCategory = async (req: Request, res: Response) => {
  try {
    const { projectId, category } = req.params;
    const userId = req.userId;

    const documents = await dynamoDB.query({
      TableName: 'Documentation',
      IndexName: 'ProjectIdCategoryIndex',
      KeyConditionExpression: 'projectId = :projectId AND category = :category',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':category': category
      },
      FilterExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':category': category,
        ':userId': userId
      }
    });
    res.json({ documents: documents.Items || [] });
  } catch (error) {
    console.error('Error in getDocumentsByCategory:', error);
    res.status(500).json({ error: 'Failed to fetch documents by category' });
  }
};

export const createDocument = async (req: Request, res: Response) => {
  try {
    const { error, value } = documentationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.userId;
    const document: Documentation = {
      id: uuidv4(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...value
    };

    await dynamoDB.put('Documentation', document);
    res.status(201).json({ document });
  } catch (error) {
    console.error('Error in createDocument:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const existingDoc = await dynamoDB.get('Documentation', { id, userId });
    if (!existingDoc) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const { error, value } = documentationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedDocument = {
      ...existingDoc,
      ...value,
      updatedAt: new Date().toISOString()
    };

    await dynamoDB.put('Documentation', updatedDocument);
    res.json({ document: updatedDocument });
  } catch (error) {
    console.error('Error in updateDocument:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await dynamoDB.delete('Documentation', { id, userId });
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error in deleteDocument:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};

export const searchDocuments = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { query, projectId } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const filterExpression = projectId 
      ? 'userId = :userId AND projectId = :projectId AND (contains(title, :query) OR contains(content, :query))'
      : 'userId = :userId AND (contains(title, :query) OR contains(content, :query))';

    const expressionValues: any = {
      ':userId': userId,
      ':query': query
    };

    if (projectId) {
      expressionValues[':projectId'] = projectId;
    }

    const documents = await dynamoDB.scan({
      TableName: 'Documentation',
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionValues
    });

    res.json({ documents: documents.Items || [] });
  } catch (error) {
    console.error('Error in searchDocuments:', error);
    res.status(500).json({ error: 'Failed to search documents' });
  }
};

export const uploadAttachment = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const userId = req.userId;
    const { fileName, fileData, contentType } = req.body;

    if (!fileName || !fileData) {
      return res.status(400).json({ error: 'fileName and fileData are required' });
    }

    const document = await dynamoDB.get('Documentation', { id: documentId, userId });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const buffer = Buffer.from(fileData, 'base64');
    const key = `documentation/${document.projectId}/${documentId}/${fileName}`;
    
    const fileMetadata = await s3Service.uploadFile(key, buffer, {
      contentType: contentType || 'application/octet-stream',
      metadata: {
        userId,
        documentId,
        projectId: document.projectId
      }
    });

    document.attachments = document.attachments || [];
    document.attachments.push({
      id: uuidv4(),
      fileName,
      fileKey: fileMetadata.key,
      fileUrl: fileMetadata.url,
      fileSize: fileMetadata.size,
      contentType,
      uploadedAt: new Date().toISOString()
    });
    document.updatedAt = new Date().toISOString();

    await dynamoDB.put('Documentation', document);

    res.json({ 
      message: 'Attachment uploaded successfully',
      attachment: document.attachments[document.attachments.length - 1]
    });
  } catch (error) {
    console.error('Error in uploadAttachment:', error);
    res.status(500).json({ error: 'Failed to upload attachment' });
  }
};

export const getAttachmentUrl = async (req: Request, res: Response) => {
  try {
    const { documentId, attachmentId } = req.params;
    const userId = req.userId;

    const document = await dynamoDB.get('Documentation', { id: documentId, userId });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const attachment = document.attachments?.find((a: any) => a.id === attachmentId);
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    const presignedUrl = await s3Service.generatePresignedUrl(attachment.fileKey, 3600);

    res.json({ url: presignedUrl });
  } catch (error) {
    console.error('Error in getAttachmentUrl:', error);
    res.status(500).json({ error: 'Failed to get attachment URL' });
  }
};

export const deleteAttachment = async (req: Request, res: Response) => {
  try {
    const { documentId, attachmentId } = req.params;
    const userId = req.userId;

    const document = await dynamoDB.get('Documentation', { id: documentId, userId });
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    const attachment = document.attachments?.find((a: any) => a.id === attachmentId);
    if (!attachment) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    await s3Service.deleteFile(attachment.fileKey);

    document.attachments = document.attachments?.filter((a: any) => a.id !== attachmentId) || [];
    document.updatedAt = new Date().toISOString();

    await dynamoDB.put('Documentation', document);

    res.json({ message: 'Attachment deleted successfully' });
  } catch (error) {
    console.error('Error in deleteAttachment:', error);
    res.status(500).json({ error: 'Failed to delete attachment' });
  }
};
