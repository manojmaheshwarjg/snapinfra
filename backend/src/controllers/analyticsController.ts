import { Request, Response } from 'express';
import { AnalyticsService } from '@/services/analyticsService';
import { DynamoDBService } from '@/services/database/dynamoDBService';
import { analyticsSchema } from '@/validation/schemas';
import { v4 as uuidv4 } from 'uuid';

const analyticsService = new AnalyticsService();
const dynamoDB = new DynamoDBService();

export const getDashboardMetrics = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const metrics = await analyticsService.getDashboardMetrics(userId);
    res.json({ metrics });
  } catch (error) {
    console.error('Error in getDashboardMetrics:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
};

export const getProjectAnalytics = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;
    const analytics = await analyticsService.getProjectAnalytics(projectId, userId);
    res.json({ analytics });
  } catch (error) {
    console.error('Error in getProjectAnalytics:', error);
    res.status(500).json({ error: 'Failed to fetch project analytics' });
  }
};

export const getProjectMetrics = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;
    const metrics = await analyticsService.getProjectMetrics(projectId, userId);
    res.json({ metrics });
  } catch (error) {
    console.error('Error in getProjectMetrics:', error);
    res.status(500).json({ error: 'Failed to fetch project metrics' });
  }
};

export const trackEvent = async (req: Request, res: Response) => {
  try {
    const { error, value } = analyticsSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.userId;
    await analyticsService.trackEvent({
      ...value,
      userId,
      timestamp: value.timestamp || new Date().toISOString()
    });

    res.status(201).json({ message: 'Event tracked successfully' });
  } catch (error) {
    console.error('Error in trackEvent:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
};

export const getTrends = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { period = '7d', metric } = req.query;
    
    const trends = await analyticsService.getTrends(
      userId,
      period as string,
      metric as string
    );
    res.json({ trends });
  } catch (error) {
    console.error('Error in getTrends:', error);
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
};

export const getUsageStats = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const stats = await analyticsService.getUsageStats(userId);
    res.json({ stats });
  } catch (error) {
    console.error('Error in getUsageStats:', error);
    res.status(500).json({ error: 'Failed to fetch usage stats' });
  }
};

export const getChartData = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { chartType, period = '7d' } = req.query;

    if (!chartType) {
      return res.status(400).json({ error: 'chartType is required' });
    }

    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '24h':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const analytics = await dynamoDB.query({
      TableName: 'Analytics',
      IndexName: 'UserIdTimestampIndex',
      KeyConditionExpression: 'userId = :userId AND #timestamp BETWEEN :start AND :end',
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp'
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':start': startDate.toISOString(),
        ':end': endDate.toISOString()
      }
    });

    const aggregatedData = aggregateAnalyticsData(
      analytics.Items || [],
      chartType as string,
      period as string
    );

    res.json({ chartData: aggregatedData });
  } catch (error) {
    console.error('Error in getChartData:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
};

export const getRealtimeMetrics = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const { projectId } = req.query;

    const last24Hours = new Date();
    last24Hours.setHours(last24Hours.getHours() - 24);

    const queryParams: any = {
      TableName: 'Analytics',
      IndexName: 'UserIdTimestampIndex',
      KeyConditionExpression: 'userId = :userId AND #timestamp >= :start',
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp'
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':start': last24Hours.toISOString()
      }
    };

    if (projectId) {
      queryParams.FilterExpression = 'projectId = :projectId';
      queryParams.ExpressionAttributeValues[':projectId'] = projectId;
    }

    const analytics = await dynamoDB.query(queryParams);

    const metrics = {
      totalEvents: analytics.Items?.length || 0,
      uniqueProjects: new Set(analytics.Items?.map((item: any) => item.projectId)).size,
      eventTypes: analytics.Items?.reduce((acc: any, item: any) => {
        acc[item.eventType] = (acc[item.eventType] || 0) + 1;
        return acc;
      }, {}),
      lastUpdated: new Date().toISOString()
    };

    res.json({ metrics });
  } catch (error) {
    console.error('Error in getRealtimeMetrics:', error);
    res.status(500).json({ error: 'Failed to fetch realtime metrics' });
  }
};

function aggregateAnalyticsData(data: any[], chartType: string, period: string) {
  const grouped: Record<string, number> = {};

  data.forEach(item => {
    const date = new Date(item.timestamp);
    let key: string;

    if (period === '24h') {
      key = `${date.getHours()}:00`;
    } else {
      key = date.toISOString().split('T')[0];
    }

    if (!grouped[key]) {
      grouped[key] = 0;
    }

    switch (chartType) {
      case 'deployments':
        if (item.eventType === 'deployment') grouped[key]++;
        break;
      case 'projects':
        if (item.eventType === 'project_created') grouped[key]++;
        break;
      case 'codeGen':
        if (item.eventType === 'code_generation') grouped[key]++;
        break;
      default:
        grouped[key]++;
    }
  });

  return Object.entries(grouped).map(([label, value]) => ({ label, value }));
}
