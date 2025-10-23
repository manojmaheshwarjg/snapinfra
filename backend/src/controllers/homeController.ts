import { Request, Response } from 'express';
import { DynamoDBService } from '@/services/database/dynamoDBService';

const dynamoDB = new DynamoDBService();

export const getHome = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    
    const recentProjects = await dynamoDB.query({
      TableName: 'Projects',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      Limit: 5,
      ScanIndexForward: false
    });

    const recentActivity = await dynamoDB.query({
      TableName: 'Activity',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      Limit: 10,
      ScanIndexForward: false
    });

    res.json({
      user: {
        id: userId,
        name: req.userName
      },
      recentProjects: recentProjects.Items || [],
      recentActivity: recentActivity.Items || []
    });
  } catch (error) {
    console.error('Error in getHome:', error);
    res.status(500).json({ error: 'Failed to fetch home data' });
  }
};
