import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

const clientConfig: any = {
  region: AWS_REGION
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  };
}

export const dynamodbClient = new DynamoDBClient(clientConfig);
export const docClient = DynamoDBDocumentClient.from(dynamodbClient);
export const s3Client = new S3Client(clientConfig);

export const TABLES = {
  PROJECTS: process.env.DYNAMODB_PROJECTS_TABLE || 'snapinfra-projects',
  USERS: process.env.DYNAMODB_USERS_TABLE || 'snapinfra-users',
  SCHEMAS: process.env.DYNAMODB_SCHEMAS_TABLE || 'snapinfra-schemas',
  ARCHITECTURES: process.env.DYNAMODB_ARCHITECTURES_TABLE || 'snapinfra-architectures',
  CODE_GENERATIONS: process.env.DYNAMODB_CODE_GENERATIONS_TABLE || 'snapinfra-code-generations',
  DEPLOYMENTS: process.env.DYNAMODB_DEPLOYMENTS_TABLE || 'snapinfra-deployments',
  ANALYTICS: process.env.DYNAMODB_ANALYTICS_TABLE || 'snapinfra-analytics',
  ACTIVITY: process.env.DYNAMODB_ACTIVITY_TABLE || 'snapinfra-activity',
  DOCUMENTATION: process.env.DYNAMODB_DOCUMENTATION_TABLE || 'snapinfra-documentation',
  TEAMS: process.env.DYNAMODB_TEAMS_TABLE || 'snapinfra-teams',
  SETTINGS: process.env.DYNAMODB_SETTINGS_TABLE || 'snapinfra-settings',
  INTEGRATIONS: process.env.DYNAMODB_INTEGRATIONS_TABLE || 'snapinfra-integrations'
};

export const S3_CONFIG = {
  BUCKET_NAME: process.env.S3_BUCKET_NAME || 'snapinfra-storage',
  BUCKET_REGION: process.env.S3_BUCKET_REGION || AWS_REGION
};
