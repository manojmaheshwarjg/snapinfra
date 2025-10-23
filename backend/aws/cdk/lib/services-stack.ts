import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export class SnapinfraServicesStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly codeGenerationQueue: sqs.Queue;
  public readonly deploymentQueue: sqs.Queue;
  public readonly notificationTopic: sns.Topic;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for file storage
    this.bucket = new s3.Bucket(this, 'SnapinfraStorageBucket', {
      bucketName: 'snapinfra-storage',
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE
          ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag'],
          maxAge: 3000
        }
      ],
      lifecycleRules: [
        {
          id: 'DeleteOldCodeGenerations',
          enabled: true,
          prefix: 'code-generations/',
          expiration: cdk.Duration.days(90),
          transitions: [
            {
              storageClass: s3.StorageClass.INTELLIGENT_TIERING,
              transitionAfter: cdk.Duration.days(30)
            }
          ]
        },
        {
          id: 'DeleteOldArchitectures',
          enabled: true,
          prefix: 'architectures/',
          expiration: cdk.Duration.days(365)
        }
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false
    });

    // Dead Letter Queue for failed messages
    const deadLetterQueue = new sqs.Queue(this, 'DeadLetterQueue', {
      queueName: 'snapinfra-dlq',
      retentionPeriod: cdk.Duration.days(14),
      encryption: sqs.QueueEncryption.KMS_MANAGED
    });

    // SQS Queue for Code Generation
    this.codeGenerationQueue = new sqs.Queue(this, 'CodeGenerationQueue', {
      queueName: 'snapinfra-code-generation',
      visibilityTimeout: cdk.Duration.minutes(15),
      receiveMessageWaitTime: cdk.Duration.seconds(20),
      retentionPeriod: cdk.Duration.days(4),
      encryption: sqs.QueueEncryption.KMS_MANAGED,
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: 3
      }
    });

    // SQS Queue for Deployments
    this.deploymentQueue = new sqs.Queue(this, 'DeploymentQueue', {
      queueName: 'snapinfra-deployments',
      visibilityTimeout: cdk.Duration.minutes(30),
      receiveMessageWaitTime: cdk.Duration.seconds(20),
      retentionPeriod: cdk.Duration.days(4),
      encryption: sqs.QueueEncryption.KMS_MANAGED,
      deadLetterQueue: {
        queue: deadLetterQueue,
        maxReceiveCount: 3
      }
    });

    // SNS Topic for Notifications
    this.notificationTopic = new sns.Topic(this, 'NotificationTopic', {
      topicName: 'snapinfra-deployment-notifications',
      displayName: 'Snapinfra Notifications',
      fifo: false
    });

    // Optional: Add email subscription (uncomment and set email)
    // this.notificationTopic.addSubscription(
    //   new subscriptions.EmailSubscription('your-email@example.com')
    // );

    // CloudFormation Outputs
    new cdk.CfnOutput(this, 'S3BucketName', {
      value: this.bucket.bucketName,
      description: 'S3 Bucket for file storage',
      exportName: 'SnapinfraS3BucketName'
    });

    new cdk.CfnOutput(this, 'S3BucketArn', {
      value: this.bucket.bucketArn,
      description: 'S3 Bucket ARN',
      exportName: 'SnapinfraS3BucketArn'
    });

    new cdk.CfnOutput(this, 'CodeGenerationQueueUrl', {
      value: this.codeGenerationQueue.queueUrl,
      description: 'SQS Queue URL for code generation',
      exportName: 'SnapinfraCodeGenerationQueueUrl'
    });

    new cdk.CfnOutput(this, 'CodeGenerationQueueArn', {
      value: this.codeGenerationQueue.queueArn,
      description: 'SQS Queue ARN for code generation',
      exportName: 'SnapinfraCodeGenerationQueueArn'
    });

    new cdk.CfnOutput(this, 'DeploymentQueueUrl', {
      value: this.deploymentQueue.queueUrl,
      description: 'SQS Queue URL for deployments',
      exportName: 'SnapinfraDeploymentQueueUrl'
    });

    new cdk.CfnOutput(this, 'DeploymentQueueArn', {
      value: this.deploymentQueue.queueArn,
      description: 'SQS Queue ARN for deployments',
      exportName: 'SnapinfraDeploymentQueueArn'
    });

    new cdk.CfnOutput(this, 'NotificationTopicArn', {
      value: this.notificationTopic.topicArn,
      description: 'SNS Topic ARN for notifications',
      exportName: 'SnapinfraNotificationTopicArn'
    });

    new cdk.CfnOutput(this, 'DeadLetterQueueUrl', {
      value: deadLetterQueue.queueUrl,
      description: 'Dead Letter Queue URL',
      exportName: 'SnapinfraDeadLetterQueueUrl'
    });
  }
}
