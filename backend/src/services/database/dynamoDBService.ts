import { 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand, 
  ScanCommand 
} from '@aws-sdk/lib-dynamodb';
import { docClient, TABLES } from '@/utils/awsConfig';

export class DynamoDBService {
  async get(tableName: string, key: Record<string, any>): Promise<any> {
    const tableMapping: Record<string, string> = {
      'Projects': TABLES.PROJECTS,
      'Schemas': TABLES.SCHEMAS,
      'Architectures': TABLES.ARCHITECTURES,
      'CodeGenerations': TABLES.CODE_GENERATIONS,
      'Deployments': TABLES.DEPLOYMENTS,
      'Analytics': TABLES.ANALYTICS,
      'Activity': TABLES.ACTIVITY,
      'Documentation': TABLES.DOCUMENTATION,
      'Teams': TABLES.TEAMS,
      'Settings': TABLES.SETTINGS,
      'Integrations': TABLES.INTEGRATIONS,
      'Users': TABLES.USERS
    };

    const command = new GetCommand({
      TableName: tableMapping[tableName] || tableName,
      Key: key
    });

    const result = await docClient.send(command);
    return result.Item;
  }

  async put(tableName: string, item: Record<string, any>): Promise<void> {
    const tableMapping: Record<string, string> = {
      'Projects': TABLES.PROJECTS,
      'Schemas': TABLES.SCHEMAS,
      'Architectures': TABLES.ARCHITECTURES,
      'CodeGenerations': TABLES.CODE_GENERATIONS,
      'Deployments': TABLES.DEPLOYMENTS,
      'Analytics': TABLES.ANALYTICS,
      'Activity': TABLES.ACTIVITY,
      'Documentation': TABLES.DOCUMENTATION,
      'Teams': TABLES.TEAMS,
      'Settings': TABLES.SETTINGS,
      'Integrations': TABLES.INTEGRATIONS,
      'Users': TABLES.USERS
    };

    const command = new PutCommand({
      TableName: tableMapping[tableName] || tableName,
      Item: item
    });

    await docClient.send(command);
  }

  async update(
    tableName: string, 
    key: Record<string, any>, 
    updates: Record<string, any>
  ): Promise<any> {
    const tableMapping: Record<string, string> = {
      'Projects': TABLES.PROJECTS,
      'Schemas': TABLES.SCHEMAS,
      'Architectures': TABLES.ARCHITECTURES,
      'CodeGenerations': TABLES.CODE_GENERATIONS,
      'Deployments': TABLES.DEPLOYMENTS,
      'Analytics': TABLES.ANALYTICS,
      'Activity': TABLES.ACTIVITY,
      'Documentation': TABLES.DOCUMENTATION,
      'Teams': TABLES.TEAMS,
      'Settings': TABLES.SETTINGS,
      'Integrations': TABLES.INTEGRATIONS,
      'Users': TABLES.USERS
    };

    let updateExpression = 'SET ';
    const expressionAttributeValues: Record<string, any> = {};
    const expressionAttributeNames: Record<string, string> = {};

    const updateFields = Object.keys(updates);
    const reservedKeywords = [
      'name', 'status', 'data', 'timestamp', 'value', 'type', 'schema',
      'description', 'size', 'date', 'time', 'year', 'month', 'day',
      'percent', 'order', 'count', 'index', 'table', 'format', 'version',
      'environment', 'enabled', 'content', 'category'
    ];

    updateFields.forEach((field, index) => {
      if (index > 0) updateExpression += ', ';
      
      if (reservedKeywords.includes(field.toLowerCase())) {
        const alias = `#${field}`;
        updateExpression += `${alias} = :${field}`;
        expressionAttributeNames[alias] = field;
      } else {
        updateExpression += `${field} = :${field}`;
      }
      expressionAttributeValues[`:${field}`] = updates[field];
    });

    const command = new UpdateCommand({
      TableName: tableMapping[tableName] || tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ...(Object.keys(expressionAttributeNames).length > 0 && { 
        ExpressionAttributeNames: expressionAttributeNames 
      }),
      ReturnValues: 'ALL_NEW'
    });

    const result = await docClient.send(command);
    return result.Attributes;
  }

  async delete(tableName: string, key: Record<string, any>): Promise<void> {
    const tableMapping: Record<string, string> = {
      'Projects': TABLES.PROJECTS,
      'Schemas': TABLES.SCHEMAS,
      'Architectures': TABLES.ARCHITECTURES,
      'CodeGenerations': TABLES.CODE_GENERATIONS,
      'Deployments': TABLES.DEPLOYMENTS,
      'Analytics': TABLES.ANALYTICS,
      'Activity': TABLES.ACTIVITY,
      'Documentation': TABLES.DOCUMENTATION,
      'Teams': TABLES.TEAMS,
      'Settings': TABLES.SETTINGS,
      'Integrations': TABLES.INTEGRATIONS,
      'Users': TABLES.USERS
    };

    const command = new DeleteCommand({
      TableName: tableMapping[tableName] || tableName,
      Key: key
    });

    await docClient.send(command);
  }

  async query(params: any): Promise<any> {
    const command = new QueryCommand(params);
    return await docClient.send(command);
  }

  async scan(params: any): Promise<any> {
    const command = new ScanCommand(params);
    return await docClient.send(command);
  }

  async count(tableName: string, indexName: string, partitionKeyValue: string): Promise<number> {
    const tableMapping: Record<string, string> = {
      'Projects': TABLES.PROJECTS,
      'Schemas': TABLES.SCHEMAS,
      'Architectures': TABLES.ARCHITECTURES,
      'CodeGenerations': TABLES.CODE_GENERATIONS,
      'Deployments': TABLES.DEPLOYMENTS,
      'Analytics': TABLES.ANALYTICS,
      'Activity': TABLES.ACTIVITY,
      'Documentation': TABLES.DOCUMENTATION,
      'Teams': TABLES.TEAMS,
      'Settings': TABLES.SETTINGS,
      'Integrations': TABLES.INTEGRATIONS,
      'Users': TABLES.USERS
    };

    const command = new QueryCommand({
      TableName: tableMapping[tableName] || tableName,
      IndexName: indexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': partitionKeyValue
      },
      Select: 'COUNT'
    });

    const result = await docClient.send(command);
    return result.Count || 0;
  }
}
