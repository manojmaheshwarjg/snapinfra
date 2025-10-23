# Snapinfra AWS DynamoDB Deployment Guide

Complete guide to delete old tables and deploy new enterprise-grade infrastructure.

## Prerequisites

1. AWS CLI configured with credentials
2. AWS CDK CLI installed: `npm install -g aws-cdk`
3. Node.js 18+ installed

## Step 1: Delete Old Tables

Run the deletion script to remove old rhinoback tables:

```bash
cd backend/aws
npx tsx delete-old-tables.ts
```

Or manually delete from AWS Console:
- rhinoback-deployments
- rhinoback-projects
- rhinoback-schemas
- rhinoback-users

## Step 2: Set Up CDK

```bash
cd backend/aws/cdk
npm install
```

## Step 3: Bootstrap CDK (First Time Only)

If you haven't used CDK in this AWS account/region before:

```bash
npm run bootstrap
```

## Step 4: Review Changes

Review what will be deployed:

```bash
npm run diff
```

## Step 5: Deploy Infrastructure

Deploy all DynamoDB tables:

```bash
npm run deploy
```

This will create:
- 12 DynamoDB tables with proper indexes
- Point-in-time recovery enabled
- AWS-managed encryption
- Auto-scaling with PAY_PER_REQUEST billing
- Proper TTL attributes for temporary data

## New Tables Created

### Core Tables
1. **snapinfra-projects** - Project management
2. **snapinfra-schemas** - Database schema definitions
3. **snapinfra-architectures** - System architecture diagrams
4. **snapinfra-code-generations** - Generated code storage
5. **snapinfra-deployments** - Deployment tracking

### Analytics & Monitoring
6. **snapinfra-analytics** - Metrics and analytics data
7. **snapinfra-activity** - Activity logs and audit trail

### Collaboration
8. **snapinfra-teams** - Team management
9. **snapinfra-documentation** - Project documentation
10. **snapinfra-integrations** - External integrations

### User Management
11. **snapinfra-users** - User profiles
12. **snapinfra-settings** - User preferences

## Table Features

### Enterprise Features Enabled:
- Point-in-time recovery for disaster recovery
- AWS-managed encryption at rest
- DynamoDB Streams for real-time processing
- TTL for automatic data expiration (analytics, activity logs)
- Comprehensive GSIs for efficient querying
- Pay-per-request billing (cost-effective for variable workloads)

### Global Secondary Indexes (GSIs):

**Projects Table:**
- UserIdIndex (userId + createdAt)
- StatusIndex (status + updatedAt)

**Schemas Table:**
- UserIdIndex (userId + createdAt)
- ProjectIdIndex (projectId + version)
- ProjectIdNameIndex (projectId + name)

**Architectures Table:**
- UserIdIndex (userId + createdAt)
- ProjectIdIndex (projectId + updatedAt)

**CodeGenerations Table:**
- UserIdIndex (userId + createdAt)
- ProjectIdIndex (projectId + createdAt)
- StatusIndex (status + updatedAt)

**Deployments Table:**
- UserIdIndex (userId + createdAt)
- ProjectIdIndex (projectId + createdAt)
- UserIdStatusIndex (userId + status)
- EnvironmentIndex (environment + createdAt)

**Analytics Table:**
- UserIdTimestampIndex (userId + timestamp)
- ProjectIdIndex (projectId + timestamp)
- MetricIndex (metric + timestamp)

**Activity Table:**
- UserIdIndex (userId + createdAt)
- ProjectIdIndex (projectId + createdAt)
- EntityTypeIndex (entityType + createdAt)

**Documentation Table:**
- UserIdIndex (userId + createdAt)
- ProjectIdIndex (projectId + order)
- ProjectIdCategoryIndex (projectId + category)

**Teams Table:**
- UserIdIndex (userId + createdAt)

**Integrations Table:**
- UserIdIndex (userId + createdAt)
- ProjectIdIndex (projectId + type)
- TypeIndex (type + enabled)

**Users Table:**
- EmailIndex (email)

## Step 6: Update Backend Configuration

Update your backend `.env` file with new table names:

```env
# DynamoDB Tables
DYNAMODB_PROJECTS_TABLE=snapinfra-projects
DYNAMODB_SCHEMAS_TABLE=snapinfra-schemas
DYNAMODB_ARCHITECTURES_TABLE=snapinfra-architectures
DYNAMODB_CODE_GENERATIONS_TABLE=snapinfra-code-generations
DYNAMODB_DEPLOYMENTS_TABLE=snapinfra-deployments
DYNAMODB_ANALYTICS_TABLE=snapinfra-analytics
DYNAMODB_ACTIVITY_TABLE=snapinfra-activity
DYNAMODB_DOCUMENTATION_TABLE=snapinfra-documentation
DYNAMODB_TEAMS_TABLE=snapinfra-teams
DYNAMODB_SETTINGS_TABLE=snapinfra-settings
DYNAMODB_INTEGRATIONS_TABLE=snapinfra-integrations
DYNAMODB_USERS_TABLE=snapinfra-users

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

## Step 7: Update DynamoDB Service

The DynamoDB service will automatically use the new table names from environment variables.

## Step 8: Test the Deployment

Run a health check:

```bash
cd ../..
npm run dev
```

Then test an endpoint:
```bash
curl http://localhost:5000/api/health
```

## Cleanup (If Needed)

To destroy all tables:

```bash
cd backend/aws/cdk
npm run destroy
```

## Cost Optimization

The infrastructure uses:
- **PAY_PER_REQUEST** billing - You only pay for what you use
- No minimum costs
- Automatically scales up/down with demand
- Estimated cost: ~$0.25 per million read/write requests

## Monitoring

Monitor your tables in AWS Console:
1. Go to DynamoDB → Tables
2. Check metrics, alarms, and usage
3. Set up CloudWatch alarms for capacity issues

## Backup & Recovery

- **Point-in-time recovery**: Enabled on all tables
- Can restore to any point in the last 35 days
- Automatic continuous backups

## Security

- All tables encrypted at rest with AWS-managed keys
- IAM policies control access
- VPC endpoints available for private access
- Audit logging via CloudTrail

## Best Practices Implemented

✓ Single-table design alternatives avoided for clarity
✓ Proper partition key selection for even distribution
✓ GSIs for access patterns
✓ TTL for automatic cleanup
✓ Streams for event-driven architectures
✓ Encryption at rest
✓ Point-in-time recovery
✓ Tag-based organization
