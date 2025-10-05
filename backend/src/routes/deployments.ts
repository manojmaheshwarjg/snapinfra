import { Router, Request, Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { DynamoService } from '@/services/database/dynamoService';
import { getCurrentUserId } from '@/middleware/authMiddleware';
import { DeploymentStatus, DeploymentPlatform } from '@/types';
import Joi from 'joi';

const router = Router();

// Validation schemas
const createDeploymentSchema = Joi.object({
  projectId: Joi.string().required(),
  platform: Joi.string().valid(...Object.values(DeploymentPlatform)).required(),
  config: Joi.object({
    environmentVariables: Joi.object().pattern(Joi.string(), Joi.string()).default({}),
    buildCommand: Joi.string().optional(),
    startCommand: Joi.string().optional(),
    nodeVersion: Joi.string().optional(),
    region: Joi.string().optional()
  }).required()
});

const updateDeploymentSchema = Joi.object({
  status: Joi.string().valid(...Object.values(DeploymentStatus)).optional(),
  url: Joi.string().uri().optional(),
  logs: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    timestamp: Joi.string().required(),
    level: Joi.string().valid('info', 'warn', 'error').required(),
    message: Joi.string().required(),
    metadata: Joi.object().optional()
  })).optional()
});

// Create new deployment
router.post('/', asyncHandler(async (req: Request, res: Response) => {
  const userId = getCurrentUserId(req);
  const { error, value } = createDeploymentSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(d => d.message),
      timestamp: new Date().toISOString()
    });
  }

  try {
    const deployment = await DynamoService.createDeployment({
      projectId: value.projectId,
      userId,
      platform: value.platform,
      config: value.config
    });

    res.status(201).json({
      success: true,
      data: deployment,
      message: 'Deployment created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create deployment',
      timestamp: new Date().toISOString()
    });
  }
}));

// Get deployment by ID
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = getCurrentUserId(req);

  try {
    // Get deployment - need projectId to fetch from DynamoDB
    // For now, return 501 as we need to enhance the DynamoService
    res.status(501).json({
      success: false,
      message: 'Get deployment by ID requires composite key enhancement',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch deployment',
      timestamp: new Date().toISOString()
    });
  }
}));

// Get deployments for a project
router.get('/project/:projectId', asyncHandler(async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const deployments = await DynamoService.getProjectDeployments(projectId);

    res.json({
      success: true,
      data: deployments,
      count: deployments.length,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch deployments',
      timestamp: new Date().toISOString()
    });
  }
}));

// Update deployment
router.put('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { projectId } = req.body; // Need projectId for composite key
  const { error, value } = updateDeploymentSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: error.details.map(d => d.message),
      timestamp: new Date().toISOString()
    });
  }

  if (!projectId) {
    return res.status(400).json({
      success: false,
      error: 'projectId is required for deployment updates',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const deployment = await DynamoService.updateDeployment(id, projectId, value);

    res.json({
      success: true,
      data: deployment,
      message: 'Deployment updated successfully',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update deployment',
      timestamp: new Date().toISOString()
    });
  }
}));

// Get deployment status
router.get('/:id/status', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      error: 'projectId query parameter is required',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const deployment = await DynamoService.getDeploymentById(id, projectId as string);

    if (!deployment) {
      return res.status(404).json({
        success: false,
        error: 'Deployment not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: {
        id: deployment.id,
        status: deployment.status,
        url: deployment.url,
        updatedAt: deployment.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch deployment status',
      timestamp: new Date().toISOString()
    });
  }
}));

// Get deployment logs
router.get('/:id/logs', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { projectId } = req.query;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      error: 'projectId query parameter is required',
      timestamp: new Date().toISOString()
    });
  }

  try {
    const deployment = await DynamoService.getDeploymentById(id, projectId as string);

    if (!deployment) {
      return res.status(404).json({
        success: false,
        error: 'Deployment not found',
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      data: deployment.logs || [],
      count: deployment.logs?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch deployment logs',
      timestamp: new Date().toISOString()
    });
  }
}));

export default router;
