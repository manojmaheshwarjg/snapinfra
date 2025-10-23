#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SnapinfraDynamoDBStack } from '../lib/dynamodb-stack';
import { SnapinfraServicesStack } from '../lib/services-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

const commonTags = {
  Project: 'Snapinfra',
  Environment: 'Production',
  ManagedBy: 'CDK',
};

// DynamoDB Stack
new SnapinfraDynamoDBStack(app, 'SnapinfraDynamoDBStack', {
  env,
  description: 'Snapinfra DynamoDB Tables Infrastructure',
  tags: commonTags,
});

// Services Stack (S3, SQS, SNS)
new SnapinfraServicesStack(app, 'SnapinfraServicesStack', {
  env,
  description: 'Snapinfra S3, SQS, and SNS Infrastructure',
  tags: commonTags,
});

app.synth();
