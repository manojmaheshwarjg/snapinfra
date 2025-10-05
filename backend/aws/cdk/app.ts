#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SnapinfraStack } from './snapinfra-stack';

const app = new cdk.App();

new SnapinfraStack(app, 'SnapinfraStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.AWS_REGION || 'us-east-1',
  },
  
  // Stack description
  description: 'Snapinfra - AI-powered backend generation platform infrastructure',
  
  // Tags for all resources
  tags: {
    Project: 'Snapinfra',
    Environment: process.env.NODE_ENV || 'development',
    ManagedBy: 'CDK'
  }
});
