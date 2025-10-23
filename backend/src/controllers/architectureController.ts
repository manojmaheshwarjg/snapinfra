import { Response } from 'express';
import { DynamoService } from '@/services/database/dynamoService';
import { getCurrentUserId, AuthenticatedRequest } from '@/middleware/authMiddleware';
import { S3Service } from '@/services/storage/s3Service';
import Joi from 'joi';

const s3Service = new S3Service();

const architectureSchema = Joi.object({
  projectId: Joi.string().required(),
  name: Joi.string().required(),
  data: Joi.object().required(),
  type: Joi.string().optional().default('diagram'),
  description: Joi.string().optional()
});

export const getAllArchitectures = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = getCurrentUserId(req);
    res.json({ 
      success: true,
      data: [],
      message: 'User-level architecture query requires GSI setup'
    });
  } catch (error) {
    console.error('Error in getAllArchitectures:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch architectures' 
    });
  }
};

export const getArchitectureById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const projectId = req.query.projectId as string;
    
    if (!projectId) {
      return res.status(400).json({ 
        success: false,
        error: 'projectId query parameter is required' 
      });
    }
    
    const architecture = await DynamoService.getArchitectureById(id, projectId);
    
    if (!architecture) {
      return res.status(404).json({ 
        success: false,
        error: 'Architecture not found' 
      });
    }
    
    res.json({ 
      success: true,
      data: architecture 
    });
  } catch (error) {
    console.error('Error in getArchitectureById:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch architecture' 
    });
  }
};

export const getArchitecturesByProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.params;
    const architectures = await DynamoService.getProjectArchitectures(projectId);
    
    res.json({ 
      success: true,
      data: architectures,
      count: architectures.length
    });
  } catch (error) {
    console.error('Error in getArchitecturesByProject:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch project architectures' 
    });
  }
};

export const createArchitecture = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { error, value } = architectureSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => d.message)
      });
    }

    const userId = getCurrentUserId(req);
    const architecture = await DynamoService.createArchitecture({
      ...value,
      userId
    });
    
    await DynamoService.logActivity({
      userId,
      projectId: value.projectId,
      action: 'architecture_created',
      resourceType: 'architecture',
      resourceId: architecture.id,
      metadata: { name: value.name }
    });
    
    res.status(201).json({ 
      success: true,
      data: architecture,
      message: 'Architecture created successfully'
    });
  } catch (error) {
    console.error('Error in createArchitecture:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create architecture' 
    });
  }
};

export const updateArchitecture = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const projectId = req.body.projectId;
    
    if (!projectId) {
      return res.status(400).json({ 
        success: false,
        error: 'projectId is required in request body' 
      });
    }

    const existingArch = await DynamoService.getArchitectureById(id, projectId);
    if (!existingArch) {
      return res.status(404).json({ 
        success: false,
        error: 'Architecture not found' 
      });
    }

    const updatedArchitecture = await DynamoService.updateArchitecture(id, projectId, req.body);
    
    const userId = getCurrentUserId(req);
    await DynamoService.logActivity({
      userId,
      projectId,
      action: 'architecture_updated',
      resourceType: 'architecture',
      resourceId: id,
      metadata: { name: updatedArchitecture.name }
    });
    
    res.json({ 
      success: true,
      data: updatedArchitecture,
      message: 'Architecture updated successfully'
    });
  } catch (error) {
    console.error('Error in updateArchitecture:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update architecture' 
    });
  }
};

export const deleteArchitecture = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const projectId = req.query.projectId as string;
    
    if (!projectId) {
      return res.status(400).json({ 
        success: false,
        error: 'projectId query parameter is required' 
      });
    }

    await DynamoService.deleteArchitecture(id, projectId);
    
    const userId = getCurrentUserId(req);
    await DynamoService.logActivity({
      userId,
      projectId,
      action: 'architecture_deleted',
      resourceType: 'architecture',
      resourceId: id
    });
    
    res.json({ 
      success: true,
      message: 'Architecture deleted successfully' 
    });
  } catch (error) {
    console.error('Error in deleteArchitecture:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete architecture' 
    });
  }
};

export const exportArchitecture = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const projectId = req.body.projectId;
    const format = req.body.format || 'json';

    if (!projectId) {
      return res.status(400).json({ 
        success: false,
        error: 'projectId is required in request body' 
      });
    }

    const architecture = await DynamoService.getArchitectureById(id, projectId);
    if (!architecture) {
      return res.status(404).json({ 
        success: false,
        error: 'Architecture not found' 
      });
    }

    if (format === 'json') {
      res.json({ 
        success: true,
        data: architecture 
      });
    } else {
      res.status(400).json({ 
        success: false,
        error: 'Unsupported export format. Only json is supported.' 
      });
    }
  } catch (error) {
    console.error('Error in exportArchitecture:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export architecture' 
    });
  }
};

export const uploadDiagram = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const projectId = req.body.projectId;
    const diagramData = req.body.diagramData;
    const contentType = req.body.contentType || 'image/png';

    if (!projectId || !diagramData) {
      return res.status(400).json({ 
        success: false,
        error: 'projectId and diagramData are required' 
      });
    }

    const architecture = await DynamoService.getArchitectureById(id, projectId);
    if (!architecture) {
      return res.status(404).json({ 
        success: false,
        error: 'Architecture not found' 
      });
    }

    const buffer = Buffer.from(diagramData, 'base64');
    const fileMetadata = await s3Service.uploadArchitectureDiagram(
      projectId,
      id,
      buffer,
      contentType
    );

    await DynamoService.updateArchitecture(id, projectId, {
      diagramUrl: fileMetadata.url,
      diagramKey: fileMetadata.key
    });

    const userId = getCurrentUserId(req);
    await DynamoService.logActivity({
      userId,
      projectId,
      action: 'diagram_uploaded',
      resourceType: 'architecture',
      resourceId: id,
      metadata: { diagramUrl: fileMetadata.url }
    });

    res.json({ 
      success: true,
      data: fileMetadata,
      message: 'Diagram uploaded successfully'
    });
  } catch (error) {
    console.error('Error in uploadDiagram:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload diagram' 
    });
  }
};

export const getDiagramUrl = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const projectId = req.query.projectId as string;

    if (!projectId) {
      return res.status(400).json({ 
        success: false,
        error: 'projectId query parameter is required' 
      });
    }

    const architecture = await DynamoService.getArchitectureById(id, projectId);
    if (!architecture || !architecture.diagramKey) {
      return res.status(404).json({ 
        success: false,
        error: 'Diagram not found' 
      });
    }

    const presignedUrl = await s3Service.generatePresignedUrl(architecture.diagramKey, 3600);

    res.json({ 
      success: true,
      data: { url: presignedUrl },
      message: 'Presigned URL generated successfully'
    });
  } catch (error) {
    console.error('Error in getDiagramUrl:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate diagram URL' 
    });
  }
};
