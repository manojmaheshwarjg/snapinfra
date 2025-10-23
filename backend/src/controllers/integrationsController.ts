import { Request, Response } from 'express';
import { DynamoDBService } from '@/services/database/dynamoDBService';
import { IntegrationService } from '@/services/integrationService';
import { integrationSchema } from '@/validation/schemas';
import { v4 as uuidv4 } from 'uuid';
import { Integration } from '@/models';

const dynamoDB = new DynamoDBService();
const integrationService = new IntegrationService();

export const getAllIntegrations = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const integrations = await dynamoDB.query({
      TableName: 'Integrations',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    });
    res.json({ integrations: integrations.Items || [] });
  } catch (error) {
    console.error('Error in getAllIntegrations:', error);
    res.status(500).json({ error: 'Failed to fetch integrations' });
  }
};

export const getIntegrationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const integration = await dynamoDB.get('Integrations', { id, userId });
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }
    res.json({ integration });
  } catch (error) {
    console.error('Error in getIntegrationById:', error);
    res.status(500).json({ error: 'Failed to fetch integration' });
  }
};

export const getProjectIntegrations = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const integrations = await dynamoDB.query({
      TableName: 'Integrations',
      IndexName: 'ProjectIdIndex',
      KeyConditionExpression: 'projectId = :projectId AND userId = :userId',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':userId': userId
      }
    });
    res.json({ integrations: integrations.Items || [] });
  } catch (error) {
    console.error('Error in getProjectIntegrations:', error);
    res.status(500).json({ error: 'Failed to fetch project integrations' });
  }
};

export const createIntegration = async (req: Request, res: Response) => {
  try {
    const { error, value } = integrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.userId;
    const integration: Integration = {
      id: uuidv4(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...value
    };

    await dynamoDB.put('Integrations', integration);
    res.status(201).json({ integration });
  } catch (error) {
    console.error('Error in createIntegration:', error);
    res.status(500).json({ error: 'Failed to create integration' });
  }
};

export const updateIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const existingIntegration = await dynamoDB.get('Integrations', { id, userId });
    if (!existingIntegration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    const { error, value } = integrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedIntegration = {
      ...existingIntegration,
      ...value,
      updatedAt: new Date().toISOString()
    };

    await dynamoDB.put('Integrations', updatedIntegration);
    res.json({ integration: updatedIntegration });
  } catch (error) {
    console.error('Error in updateIntegration:', error);
    res.status(500).json({ error: 'Failed to update integration' });
  }
};

export const deleteIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await dynamoDB.delete('Integrations', { id, userId });
    res.json({ message: 'Integration deleted successfully' });
  } catch (error) {
    console.error('Error in deleteIntegration:', error);
    res.status(500).json({ error: 'Failed to delete integration' });
  }
};

export const enableIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const integration = await dynamoDB.get('Integrations', { id, userId });
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    integration.enabled = true;
    integration.updatedAt = new Date().toISOString();

    await dynamoDB.put('Integrations', integration);
    res.json({ integration, message: 'Integration enabled successfully' });
  } catch (error) {
    console.error('Error in enableIntegration:', error);
    res.status(500).json({ error: 'Failed to enable integration' });
  }
};

export const disableIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const integration = await dynamoDB.get('Integrations', { id, userId });
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    integration.enabled = false;
    integration.updatedAt = new Date().toISOString();

    await dynamoDB.put('Integrations', integration);
    res.json({ integration, message: 'Integration disabled successfully' });
  } catch (error) {
    console.error('Error in disableIntegration:', error);
    res.status(500).json({ error: 'Failed to disable integration' });
  }
};

export const syncIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const integration = await dynamoDB.get('Integrations', { id, userId });
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    if (!integration.enabled) {
      return res.status(400).json({ error: 'Integration is not enabled' });
    }

    const result = await integrationService.syncIntegration(integration);
    
    integration.lastSyncedAt = new Date().toISOString();
    integration.updatedAt = new Date().toISOString();
    await dynamoDB.put('Integrations', integration);

    res.json({ message: 'Integration synced successfully', result });
  } catch (error) {
    console.error('Error in syncIntegration:', error);
    res.status(500).json({ error: 'Failed to sync integration' });
  }
};

export const testIntegration = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const integration = await dynamoDB.get('Integrations', { id, userId });
    if (!integration) {
      return res.status(404).json({ error: 'Integration not found' });
    }

    const testResult = await integrationService.testIntegration(integration);
    res.json({ success: testResult.success, message: testResult.message });
  } catch (error) {
    console.error('Error in testIntegration:', error);
    res.status(500).json({ error: 'Failed to test integration' });
  }
};
