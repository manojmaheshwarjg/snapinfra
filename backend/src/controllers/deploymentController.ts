import { Request, Response } from 'express';
import { DynamoDBService } from '@/services/database/dynamoDBService';
import { SQSService } from '@/services/queue/sqsService';
import { SNSService } from '@/services/notifications/snsService';
import { v4 as uuidv4 } from 'uuid';

const dynamoDB = new DynamoDBService();
const sqsService = new SQSService();
const snsService = new SNSService();

export const getAllDeployments = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const deployments = await dynamoDB.query({
      TableName: 'Deployments',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    });
    res.json({ deployments: deployments.Items || [] });
  } catch (error) {
    console.error('Error in getAllDeployments:', error);
    res.status(500).json({ error: 'Failed to fetch deployments' });
  }
};

export const getDeploymentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const deployment = await dynamoDB.get('Deployments', { id, userId });
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' });
    }
    res.json({ deployment });
  } catch (error) {
    console.error('Error in getDeploymentById:', error);
    res.status(500).json({ error: 'Failed to fetch deployment' });
  }
};

export const createDeployment = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId, environment, config } = req.body;

    if (!projectId || !environment) {
      return res.status(400).json({ error: 'Project ID and environment are required' });
    }

    const deployment = {
      id: uuidv4(),
      userId,
      projectId,
      environment,
      config: config || {},
      status: 'queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dynamoDB.put('Deployments', deployment);

    // Enqueue to SQS for background processing
    await sqsService.enqueueDeployment({
      deploymentId: deployment.id,
      projectId,
      userId,
      environment,
      config: deployment.config
    });

    // Send notification
    await snsService.notifyDeployment(userId, {
      deploymentId: deployment.id,
      projectId,
      environment,
      status: 'queued'
    });

    res.status(202).json({ 
      deployment,
      message: 'Deployment queued for processing' 
    });
  } catch (error) {
    console.error('Error in createDeployment:', error);
    res.status(500).json({ error: 'Failed to create deployment' });
  }
};

export const deleteDeployment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await dynamoDB.delete('Deployments', { id, userId });
    res.json({ message: 'Deployment deleted successfully' });
  } catch (error) {
    console.error('Error in deleteDeployment:', error);
    res.status(500).json({ error: 'Failed to delete deployment' });
  }
};
