import { Request, Response } from 'express';
import { DynamoDBService } from '@/services/database/dynamoDBService';
import { schemaSchema } from '@/validation/schemas';
import { v4 as uuidv4 } from 'uuid';
import { Schema } from '@/models';

const dynamoDB = new DynamoDBService();

export const getAllSchemas = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const schemas = await dynamoDB.query({
      TableName: 'Schemas',
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: { ':userId': userId }
    });
    res.json({ schemas: schemas.Items || [] });
  } catch (error) {
    console.error('Error in getAllSchemas:', error);
    res.status(500).json({ error: 'Failed to fetch schemas' });
  }
};

export const getSchemaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    const schema = await dynamoDB.get('Schemas', { id, userId });
    if (!schema) {
      return res.status(404).json({ error: 'Schema not found' });
    }
    res.json({ schema });
  } catch (error) {
    console.error('Error in getSchemaById:', error);
    res.status(500).json({ error: 'Failed to fetch schema' });
  }
};

export const getSchemasByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const schemas = await dynamoDB.query({
      TableName: 'Schemas',
      IndexName: 'ProjectIdIndex',
      KeyConditionExpression: 'projectId = :projectId AND userId = :userId',
      ExpressionAttributeValues: {
        ':projectId': projectId,
        ':userId': userId
      }
    });
    res.json({ schemas: schemas.Items || [] });
  } catch (error) {
    console.error('Error in getSchemasByProject:', error);
    res.status(500).json({ error: 'Failed to fetch project schemas' });
  }
};

export const createSchema = async (req: Request, res: Response) => {
  try {
    const { error, value } = schemaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.userId;
    const schema: Schema = {
      id: uuidv4(),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...value
    };

    await dynamoDB.put('Schemas', schema);
    res.status(201).json({ schema });
  } catch (error) {
    console.error('Error in createSchema:', error);
    res.status(500).json({ error: 'Failed to create schema' });
  }
};

export const updateSchema = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const existingSchema = await dynamoDB.get('Schemas', { id, userId });
    if (!existingSchema) {
      return res.status(404).json({ error: 'Schema not found' });
    }

    const { error, value } = schemaSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedSchema = {
      ...existingSchema,
      ...value,
      updatedAt: new Date().toISOString()
    };

    await dynamoDB.put('Schemas', updatedSchema);
    res.json({ schema: updatedSchema });
  } catch (error) {
    console.error('Error in updateSchema:', error);
    res.status(500).json({ error: 'Failed to update schema' });
  }
};

export const deleteSchema = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await dynamoDB.delete('Schemas', { id, userId });
    res.json({ message: 'Schema deleted successfully' });
  } catch (error) {
    console.error('Error in deleteSchema:', error);
    res.status(500).json({ error: 'Failed to delete schema' });
  }
};

export const createSchemaVersion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const schema = await dynamoDB.get('Schemas', { id, userId });
    if (!schema) {
      return res.status(404).json({ error: 'Schema not found' });
    }

    const newVersion: Schema = {
      ...schema,
      id: uuidv4(),
      version: schema.version + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dynamoDB.put('Schemas', newVersion);
    res.status(201).json({ schema: newVersion });
  } catch (error) {
    console.error('Error in createSchemaVersion:', error);
    res.status(500).json({ error: 'Failed to create schema version' });
  }
};

export const getSchemaVersions = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const schema = await dynamoDB.get('Schemas', { id, userId });
    if (!schema) {
      return res.status(404).json({ error: 'Schema not found' });
    }

    const versions = await dynamoDB.query({
      TableName: 'Schemas',
      IndexName: 'ProjectIdNameIndex',
      KeyConditionExpression: 'projectId = :projectId AND #name = :name',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':projectId': schema.projectId,
        ':name': schema.name
      },
      ScanIndexForward: false
    });

    res.json({ versions: versions.Items || [] });
  } catch (error) {
    console.error('Error in getSchemaVersions:', error);
    res.status(500).json({ error: 'Failed to fetch schema versions' });
  }
};
