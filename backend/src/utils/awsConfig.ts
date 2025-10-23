import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import { SQSClient } from '@aws-sdk/client-sqs';
import { SNSClient } from '@aws-sdk/client-sns';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import * as dotenv from 'dotenv';

// Load environment variables FIRST before any configuration
dotenv.config();

// AWS Region configuration
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';

// Common AWS client configuration
// Only include credentials if they are defined
const clientConfig: any = {
  region: AWS_REGION
};

// Add credentials only if both are available
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  clientConfig.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  };
}

// DynamoDB Client
export const dynamodbClient = new DynamoDBClient(clientConfig);
export const docClient = DynamoDBDocumentClient.from(dynamodbClient);

// S3 Client
export const s3Client = new S3Client(clientConfig);

// SQS Client
export const sqsClient = new SQSClient(clientConfig);

// SNS Client
export const snsClient = new SNSClient(clientConfig);

// Table names
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

// Log AWS configuration on startup
console.log('📍 AWS Configuration:');
console.log('  Region:', AWS_REGION);
console.log('  Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? '✓ Set' : '✗ Not set');
console.log('  Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? '✓ Set' : '✗ Not set');
console.log('  DynamoDB Tables:');
console.log('    Projects:', TABLES.PROJECTS);
console.log('    Users:', TABLES.USERS);
console.log('    Schemas:', TABLES.SCHEMAS);
console.log('    Deployments:', TABLES.DEPLOYMENTS);

// S3 Configuration
export const S3_CONFIG = {
  BUCKET_NAME: process.env.S3_BUCKET_NAME || 'snapinfra-storage',
  BUCKET_REGION: process.env.S3_BUCKET_REGION || AWS_REGION
};

// SQS Queue URLs (can be queue name or full URL)
export const QUEUES = {
  CODE_GENERATION: process.env.SQS_CODE_GENERATION_QUEUE || `https://sqs.${AWS_REGION}.amazonaws.com/${process.env.CDK_DEFAULT_ACCOUNT || '000000000000'}/snapinfra-code-generation`,
  DEPLOYMENT: process.env.SQS_DEPLOYMENT_QUEUE || `https://sqs.${AWS_REGION}.amazonaws.com/${process.env.CDK_DEFAULT_ACCOUNT || '000000000000'}/snapinfra-deployments`
};

// SNS Topics (can be topic name or full ARN)
export const TOPICS = {
  DEPLOYMENT_NOTIFICATIONS: process.env.SNS_DEPLOYMENT_NOTIFICATIONS || `arn:aws:sns:${AWS_REGION}:${process.env.CDK_DEFAULT_ACCOUNT || '000000000000'}:snapinfra-deployment-notifications`
};
