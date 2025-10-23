import { Request, Response } from 'express';
import { DynamoDBService } from '@/services/database/dynamoDBService';
import { AnalyticsService } from '@/services/analyticsService';

const dynamoDB = new DynamoDBService();
const analyticsService = new AnalyticsService();

export const getOverview = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const projectsCount = await dynamoDB.count('Projects', 'UserIdIndex', userId);
    const deploymentsCount = await dynamoDB.count('Deployments', 'UserIdIndex', userId);
    const activeDeployments = await dynamoDB.query({
      TableName: 'Deployments',
      IndexName: 'UserIdStatusIndex',
      KeyConditionExpression: 'userId = :userId AND #status = :status',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':status': 'success'
      }
    });

    res.json({
      totalProjects: projectsCount,
      totalDeployments: deploymentsCount,
      activeDeployments: activeDeployments.Items?.length || 0,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in getOverview:', error);
    res.status(500).json({ error: 'Failed to fetch overview' });
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const stats = await analyticsService.getUserStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 20;

    const activities = await dynamoDB.query({
      TableName: 'Activity',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      Limit: limit,
      ScanIndexForward: false
    });

    res.json({ activities: activities.Items || [] });
  } catch (error) {
    console.error('Error in getRecentActivity:', error);
    res.status(500).json({ error: 'Failed to fetch recent activity' });
  }
};

export const getRecentProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 10;

    const projects = await dynamoDB.query({
      TableName: 'Projects',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      Limit: limit,
      ScanIndexForward: false
    });

    res.json({ projects: projects.Items || [] });
  } catch (error) {
    console.error('Error in getRecentProjects:', error);
    res.status(500).json({ error: 'Failed to fetch recent projects' });
  }
};

export const getRecentDeployments = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit as string) || 10;

    const deployments = await dynamoDB.query({
      TableName: 'Deployments',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      Limit: limit,
      ScanIndexForward: false
    });

    res.json({ deployments: deployments.Items || [] });
  } catch (error) {
    console.error('Error in getRecentDeployments:', error);
    res.status(500).json({ error: 'Failed to fetch recent deployments' });
  }
};
