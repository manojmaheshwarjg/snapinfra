import { DynamoDBService } from './database/dynamoDBService';
import { Analytics } from '@/models';
import { v4 as uuidv4 } from 'uuid';

export class AnalyticsService {
  private dynamoDB: DynamoDBService;

  constructor() {
    this.dynamoDB = new DynamoDBService();
  }

  async getDashboardMetrics(userId: string) {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const metrics = await this.dynamoDB.query({
      TableName: 'Analytics',
      IndexName: 'UserIdTimestampIndex',
      KeyConditionExpression: 'userId = :userId AND #timestamp > :startTime',
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp'
      },
      ExpressionAttributeValues: {
        ':userId': userId,
        ':startTime': last30Days.toISOString()
      }
    });

    return this.aggregateMetrics(metrics.Items || []);
  }

  async getProjectAnalytics(projectId: string, userId: string) {
    const metrics = await this.dynamoDB.query({
      TableName: 'Analytics',
      IndexName: 'ProjectIdIndex',
      KeyConditionExpression: 'projectId = :projectId AND userId = :userId',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':userId': userId
      }
    });

    return this.aggregateMetrics(metrics.Items || []);
  }

  async getProjectMetrics(projectId: string, userId: string) {
    const deployments = await this.dynamoDB.query({
      TableName: 'Deployments',
      IndexName: 'ProjectIdIndex',
      KeyConditionExpression: 'projectId = :projectId AND userId = :userId',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':userId': userId
      }
    });

    const codeGenerations = await this.dynamoDB.query({
      TableName: 'CodeGenerations',
      IndexName: 'ProjectIdIndex',
      KeyConditionExpression: 'projectId = :projectId AND userId = :userId',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':userId': userId
      }
    });

    return {
      totalDeployments: deployments.Items?.length || 0,
      successfulDeployments: deployments.Items?.filter((d: any) => d.status === 'success').length || 0,
      failedDeployments: deployments.Items?.filter((d: any) => d.status === 'failed').length || 0,
      totalCodeGenerations: codeGenerations.Items?.length || 0,
      completedCodeGenerations: codeGenerations.Items?.filter((c: any) => c.status === 'completed').length || 0
    };
  }

  async trackEvent(event: Partial<Analytics>) {
    const analytics: Analytics = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: event.userId!,
      projectId: event.projectId!,
      metric: event.metric!,
      value: event.value!,
      dimensions: event.dimensions,
      timestamp: event.timestamp || new Date().toISOString()
    };

    await this.dynamoDB.put('Analytics', analytics);
    return analytics;
  }

  async getTrends(userId: string, period: string, metric?: string) {
    const now = new Date();
    let startTime: Date;

    switch (period) {
      case '24h':
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startTime = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    let filterExpression = 'userId = :userId AND #timestamp > :startTime';
    const expressionValues: any = {
      ':userId': userId,
      ':startTime': startTime.toISOString()
    };

    if (metric) {
      filterExpression += ' AND metric = :metric';
      expressionValues[':metric'] = metric;
    }

    const metrics = await this.dynamoDB.query({
      TableName: 'Analytics',
      IndexName: 'UserIdTimestampIndex',
      KeyConditionExpression: filterExpression,
      ExpressionAttributeNames: {
        '#timestamp': 'timestamp'
      },
      ExpressionAttributeValues: expressionValues
    });

    return this.calculateTrends(metrics.Items || [], period);
  }

  async getUsageStats(userId: string) {
    const projectsCount = await this.dynamoDB.count('Projects', 'UserIdIndex', userId);
    const deploymentsCount = await this.dynamoDB.count('Deployments', 'UserIdIndex', userId);
    const codeGenerationsCount = await this.dynamoDB.count('CodeGenerations', 'UserIdIndex', userId);
    const schemasCount = await this.dynamoDB.count('Schemas', 'UserIdIndex', userId);

    return {
      projects: projectsCount,
      deployments: deploymentsCount,
      codeGenerations: codeGenerationsCount,
      schemas: schemasCount
    };
  }

  async getUserStats(userId: string) {
    const [projects, deployments, codeGens, activities] = await Promise.all([
      this.dynamoDB.count('Projects', 'UserIdIndex', userId),
      this.dynamoDB.count('Deployments', 'UserIdIndex', userId),
      this.dynamoDB.count('CodeGenerations', 'UserIdIndex', userId),
      this.dynamoDB.count('Activity', 'UserIdIndex', userId)
    ]);

    return {
      totalProjects: projects,
      totalDeployments: deployments,
      totalCodeGenerations: codeGens,
      totalActivities: activities
    };
  }

  private aggregateMetrics(metrics: any[]) {
    const aggregated: Record<string, { total: number; count: number; avg: number }> = {};

    metrics.forEach(metric => {
      if (!aggregated[metric.metric]) {
        aggregated[metric.metric] = { total: 0, count: 0, avg: 0 };
      }
      aggregated[metric.metric].total += metric.value;
      aggregated[metric.metric].count += 1;
    });

    Object.keys(aggregated).forEach(key => {
      aggregated[key].avg = aggregated[key].total / aggregated[key].count;
    });

    return aggregated;
  }

  private calculateTrends(metrics: any[], period: string) {
    const timeGroups: Record<string, number[]> = {};

    metrics.forEach(metric => {
      const timestamp = new Date(metric.timestamp);
      const key = this.getTimeGroupKey(timestamp, period);
      
      if (!timeGroups[key]) {
        timeGroups[key] = [];
      }
      timeGroups[key].push(metric.value);
    });

    const trends = Object.entries(timeGroups).map(([key, values]) => ({
      period: key,
      average: values.reduce((a, b) => a + b, 0) / values.length,
      count: values.length,
      total: values.reduce((a, b) => a + b, 0)
    }));

    return trends.sort((a, b) => a.period.localeCompare(b.period));
  }

  private getTimeGroupKey(date: Date, period: string): string {
    if (period === '24h') {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
    } else {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
  }
}
