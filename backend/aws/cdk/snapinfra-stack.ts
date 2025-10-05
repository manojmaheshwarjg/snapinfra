import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class SnapinfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB Tables
    const projectsTable = new dynamodb.Table(this, 'ProjectsTable', {
      tableName: 'Snapinfra-projects',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // For development
      pointInTimeRecovery: true
    });

    // Add GSI for querying projects by userId
    projectsTable.addGlobalSecondaryIndex({
      indexName: 'UserIdIndex',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL
    });

    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'Snapinfra-users',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true
    });

    const schemasTable = new dynamodb.Table(this, 'SchemasTable', {
      tableName: 'Snapinfra-schemas',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true
    });

    // Add GSI for querying schemas by projectId
    schemasTable.addGlobalSecondaryIndex({
      indexName: 'ProjectIdIndex',
      partitionKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL
    });

    const deploymentsTable = new dynamodb.Table(this, 'DeploymentsTable', {
      tableName: 'Snapinfra-deployments',
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: true
    });

    // Add GSI for querying deployments by projectId
    deploymentsTable.addGlobalSecondaryIndex({
      indexName: 'ProjectIdIndex',
      partitionKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL
    });

    // S3 Bucket for file storage
    const storageBucket = new s3.Bucket(this, 'StorageBucket', {
      bucketName: `Snapinfra-storage-${this.account}-${this.region}`,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true, // For development
      cors: [{
        allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.POST, s3.HttpMethods.PUT, s3.HttpMethods.DELETE],
        allowedOrigins: ['*'], // Restrict in production
        allowedHeaders: ['*'],
        maxAge: 3000
      }]
    });

    // Cognito removed - using custom auth instead

    // SQS Queues
    const codeGenerationQueue = new sqs.Queue(this, 'CodeGenerationQueue', {
      queueName: 'Snapinfra-code-generation',
      visibilityTimeout: cdk.Duration.minutes(15), // Long timeout for AI processing
      retentionPeriod: cdk.Duration.days(14),
      deadLetterQueue: {
        queue: new sqs.Queue(this, 'CodeGenerationDLQ', {
          queueName: 'Snapinfra-code-generation-dlq'
        }),
        maxReceiveCount: 3
      }
    });

    const deploymentQueue = new sqs.Queue(this, 'DeploymentQueue', {
      queueName: 'Snapinfra-deployments',
      visibilityTimeout: cdk.Duration.minutes(30), // Long timeout for deployments
      retentionPeriod: cdk.Duration.days(14)
    });

    // SNS Topics
    const deploymentNotifications = new sns.Topic(this, 'DeploymentNotifications', {
      topicName: 'Snapinfra-deployment-notifications',
      displayName: 'Snapinfra Deployment Notifications'
    });

    // IAM Role for backend application
    const backendRole = new iam.Role(this, 'BackendRole', {
      roleName: 'SnapinfraBackendRole',
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'), // Can be changed for ECS
      inlinePolicies: {
        DynamoDBAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'dynamodb:GetItem',
                'dynamodb:PutItem',
                'dynamodb:UpdateItem',
                'dynamodb:DeleteItem',
                'dynamodb:Query',
                'dynamodb:Scan'
              ],
              resources: [
                projectsTable.tableArn,
                `${projectsTable.tableArn}/index/*`,
                usersTable.tableArn,
                schemasTable.tableArn,
                `${schemasTable.tableArn}/index/*`,
                deploymentsTable.tableArn,
                `${deploymentsTable.tableArn}/index/*`
              ]
            })
          ]
        }),
        S3Access: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                's3:GetObject',
                's3:PutObject',
                's3:DeleteObject',
                's3:ListBucket'
              ],
              resources: [
                storageBucket.bucketArn,
                `${storageBucket.bucketArn}/*`
              ]
            })
          ]
        }),
        SQSAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'sqs:SendMessage',
                'sqs:ReceiveMessage',
                'sqs:DeleteMessage',
                'sqs:GetQueueAttributes'
              ],
              resources: [
                codeGenerationQueue.queueArn,
                deploymentQueue.queueArn
              ]
            })
          ]
        }),
        SNSAccess: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'sns:Publish'
              ],
              resources: [deploymentNotifications.topicArn]
            })
          ]
        })
      }
    });

    // Outputs
    new cdk.CfnOutput(this, 'S3BucketName', {
      value: storageBucket.bucketName,
      description: 'S3 Storage Bucket Name'
    });

    new cdk.CfnOutput(this, 'ProjectsTableName', {
      value: projectsTable.tableName,
      description: 'DynamoDB Projects Table Name'
    });

    new cdk.CfnOutput(this, 'BackendRoleArn', {
      value: backendRole.roleArn,
      description: 'Backend Application IAM Role ARN'
    });
  }
}
