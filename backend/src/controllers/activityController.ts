import { Request, Response } from 'express';
import { DynamoDBService } from '@/services/database/dynamoDBService';
import { SNSService } from '@/services/notifications/snsService';
import { activitySchema } from '@/validation/schemas';
import { v4 as uuidv4 } from 'uuid';
import { Activity } from '@/models';

const dynamoDB = new DynamoDBService();
const snsService = new SNSService();

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    const activities = await dynamoDB.query({
      TableName: 'Activity',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
      Limit: limit,
      ScanIndexForward: false
    });
    res.json({ activities: activities.Items || [] });
  } catch (error) {
    console.error('Error in getAllActivities:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

export const getProjectActivities = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    const activities = await dynamoDB.query({
      TableName: 'Activity',
      IndexName: 'ProjectIdIndex',
      KeyConditionExpression: 'projectId = :projectId AND userId = :userId',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':userId': userId
      },
      Limit: limit,
      ScanIndexForward: false
    });
    res.json({ activities: activities.Items || [] });
  } catch (error) {
    console.error('Error in getProjectActivities:', error);
    res.status(500).json({ error: 'Failed to fetch project activities' });
  }
};

export const getUserActivities = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 50;

    const activities = await dynamoDB.query({
      TableName: 'Activity',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId },
      Limit: limit,
      ScanIndexForward: false
    });
    res.json({ activities: activities.Items || [] });
  } catch (error) {
    console.error('Error in getUserActivities:', error);
    res.status(500).json({ error: 'Failed to fetch user activities' });
  }
};

export const logActivity = async (req: Request, res: Response) => {
  try {
    const { error, value } = activitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.userId;
    const activity: Activity = {
      id: uuidv4(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ipAddress: req.ip,
      ...value
    };

    await dynamoDB.put('Activity', activity);

    const criticalActions = [
      'deployment_failed',
      'deployment_success',
      'project_deleted',
      'team_member_added',
      'team_member_removed',
      'security_alert'
    ];

    if (criticalActions.includes(activity.action)) {
      await snsService.sendNotification({
        subject: `Activity Alert: ${activity.action}`,
        message: JSON.stringify({
          userId,
          action: activity.action,
          resourceType: activity.resourceType,
          resourceId: activity.resourceId,
          timestamp: activity.createdAt,
          metadata: activity.metadata
        }, null, 2)
      });
    }

    res.status(201).json({ activity });
  } catch (error) {
    console.error('Error in logActivity:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
};

export const deleteActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await dynamoDB.delete('Activity', { id, userId });
    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error in deleteActivity:', error);
    res.status(500).json({ error: 'Failed to delete activity' });
  }
};
