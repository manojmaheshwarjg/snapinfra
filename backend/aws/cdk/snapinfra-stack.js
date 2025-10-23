"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapinfraStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const dynamodb = __importStar(require("aws-cdk-lib/aws-dynamodb"));
const s3 = __importStar(require("aws-cdk-lib/aws-s3"));
const sqs = __importStar(require("aws-cdk-lib/aws-sqs"));
const sns = __importStar(require("aws-cdk-lib/aws-sns"));
const iam = __importStar(require("aws-cdk-lib/aws-iam"));
class SnapinfraStack extends cdk.Stack {
    constructor(scope, id, props) {
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
exports.SnapinfraStack = SnapinfraStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic25hcGluZnJhLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic25hcGluZnJhLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGlEQUFtQztBQUNuQyxtRUFBcUQ7QUFDckQsdURBQXlDO0FBQ3pDLHlEQUEyQztBQUMzQyx5REFBMkM7QUFDM0MseURBQTJDO0FBRzNDLE1BQWEsY0FBZSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQzNDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDOUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsa0JBQWtCO1FBQ2xCLE1BQU0sYUFBYSxHQUFHLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQzlELFNBQVMsRUFBRSxvQkFBb0I7WUFDL0IsWUFBWSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDakUsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDaEUsV0FBVyxFQUFFLFFBQVEsQ0FBQyxXQUFXLENBQUMsZUFBZTtZQUNqRCxhQUFhLEVBQUUsR0FBRyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsa0JBQWtCO1lBQzVELG1CQUFtQixFQUFFLElBQUk7U0FDMUIsQ0FBQyxDQUFDO1FBRUgsMENBQTBDO1FBQzFDLGFBQWEsQ0FBQyx1QkFBdUIsQ0FBQztZQUNwQyxTQUFTLEVBQUUsYUFBYTtZQUN4QixZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRTtZQUNyRSxPQUFP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Qzt5QkFDOUMsQ0FBQztxQkFDSDtpQkFDRixDQUFDO2FBQ0g7U0FDRixDQUFDLENBQUM7UUFFSCxVQUFVO1FBQ1YsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxjQUFjLEVBQUU7WUFDdEMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxVQUFVO1lBQy9CLFdBQVcsRUFBRSx3QkFBd0I7U0FDdEMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxtQkFBbUIsRUFBRTtZQUMzQyxLQUFLLEVBQUUsYUFBYSxDQUFDLFNBQVM7WUFDOUIsV0FBVyxFQUFFLDhCQUE4QjtTQUM1QyxDQUFDLENBQUM7UUFFSCxJQUFJLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQ3hDLEtBQUssRUFBRSxXQUFXLENBQUMsT0FBTztZQUMxQixXQUFXLEVBQUUsa0NBQWtDO1NBQ2hELENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXRNRCx3Q0FzTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xyXG5pbXBvcnQgKiBhcyBkeW5hbW9kYiBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGInO1xyXG5pbXBvcnQgKiBhcyBzMyBmcm9tICdhd3MtY2RrLWxpYi9hd3MtczMnO1xyXG5pbXBvcnQgKiBhcyBzcXMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXNxcyc7XHJcbmltcG9ydCAqIGFzIHNucyBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtc25zJztcclxuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xyXG5pbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTbmFwaW5mcmFTdGFjayBleHRlbmRzIGNkay5TdGFjayB7XHJcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgLy8gRHluYW1vREIgVGFibGVzXHJcbiAgICBjb25zdCBwcm9qZWN0c1RhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICdQcm9qZWN0c1RhYmxlJywge1xyXG4gICAgICB0YWJsZU5hbWU6ICdTbmFwaW5mcmEtcHJvamVjdHMnLFxyXG4gICAgICBwYXJ0aXRpb25LZXk6IHsgbmFtZTogJ2lkJywgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcclxuICAgICAgc29ydEtleTogeyBuYW1lOiAndXNlcklkJywgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcclxuICAgICAgYmlsbGluZ01vZGU6IGR5bmFtb2RiLkJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCxcclxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSwgLy8gRm9yIGRldmVsb3BtZW50XHJcbiAgICAgIHBvaW50SW5UaW1lUmVjb3Zlcnk6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEFkZCBHU0kgZm9yIHF1ZXJ5aW5nIHByb2plY3RzIGJ5IHVzZXJJZFxyXG4gICAgcHJvamVjdHNUYWJsZS5hZGRHbG9iYWxTZWNvbmRhcnlJbmRleCh7XHJcbiAgICAgIGluZGV4TmFtZTogJ1VzZXJJZEluZGV4JyxcclxuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6ICd1c2VySWQnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxyXG4gICAgICBzb3J0S2V5OiB7IG5hbWU6ICdjcmVhdGVkQXQnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxyXG4gICAgICBwcm9qZWN0aW9uVHlwZTogZHluYW1vZGIuUHJvamVjdGlvblR5cGUuQUxMXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCB1c2Vyc1RhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICdVc2Vyc1RhYmxlJywge1xyXG4gICAgICB0YWJsZU5hbWU6ICdTbmFwaW5mcmEtdXNlcnMnLFxyXG4gICAgICBwYXJ0aXRpb25LZXk6IHsgbmFtZTogJ2lkJywgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcclxuICAgICAgYmlsbGluZ01vZGU6IGR5bmFtb2RiLkJpbGxpbmdNb2RlLlBBWV9QRVJfUkVRVUVTVCxcclxuICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcclxuICAgICAgcG9pbnRJblRpbWVSZWNvdmVyeTogdHJ1ZVxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3Qgc2NoZW1hc1RhYmxlID0gbmV3IGR5bmFtb2RiLlRhYmxlKHRoaXMsICdTY2hlbWFzVGFibGUnLCB7XHJcbiAgICAgIHRhYmxlTmFtZTogJ1NuYXBpbmZyYS1zY2hlbWFzJyxcclxuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6ICdpZCcsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXHJcbiAgICAgIHNvcnRLZXk6IHsgbmFtZTogJ3Byb2plY3RJZCcsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXHJcbiAgICAgIGJpbGxpbmdNb2RlOiBkeW5hbW9kYi5CaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsXHJcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgIHBvaW50SW5UaW1lUmVjb3Zlcnk6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEFkZCBHU0kgZm9yIHF1ZXJ5aW5nIHNjaGVtYXMgYnkgcHJvamVjdElkXHJcbiAgICBzY2hlbWFzVGFibGUuYWRkR2xvYmFsU2Vjb25kYXJ5SW5kZXgoe1xyXG4gICAgICBpbmRleE5hbWU6ICdQcm9qZWN0SWRJbmRleCcsXHJcbiAgICAgIHBhcnRpdGlvbktleTogeyBuYW1lOiAncHJvamVjdElkJywgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcclxuICAgICAgc29ydEtleTogeyBuYW1lOiAnY3JlYXRlZEF0JywgdHlwZTogZHluYW1vZGIuQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcclxuICAgICAgcHJvamVjdGlvblR5cGU6IGR5bmFtb2RiLlByb2plY3Rpb25UeXBlLkFMTFxyXG4gICAgfSk7XHJcblxyXG4gICAgY29uc3QgZGVwbG95bWVudHNUYWJsZSA9IG5ldyBkeW5hbW9kYi5UYWJsZSh0aGlzLCAnRGVwbG95bWVudHNUYWJsZScsIHtcclxuICAgICAgdGFibGVOYW1lOiAnU25hcGluZnJhLWRlcGxveW1lbnRzJyxcclxuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6ICdpZCcsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXHJcbiAgICAgIHNvcnRLZXk6IHsgbmFtZTogJ3Byb2plY3RJZCcsIHR5cGU6IGR5bmFtb2RiLkF0dHJpYnV0ZVR5cGUuU1RSSU5HIH0sXHJcbiAgICAgIGJpbGxpbmdNb2RlOiBkeW5hbW9kYi5CaWxsaW5nTW9kZS5QQVlfUEVSX1JFUVVFU1QsXHJcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgIHBvaW50SW5UaW1lUmVjb3Zlcnk6IHRydWVcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIEFkZCBHU0kgZm9yIHF1ZXJ5aW5nIGRlcGxveW1lbnRzIGJ5IHByb2plY3RJZFxyXG4gICAgZGVwbG95bWVudHNUYWJsZS5hZGRHbG9iYWxTZWNvbmRhcnlJbmRleCh7XHJcbiAgICAgIGluZGV4TmFtZTogJ1Byb2plY3RJZEluZGV4JyxcclxuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6ICdwcm9qZWN0SWQnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxyXG4gICAgICBzb3J0S2V5OiB7IG5hbWU6ICdjcmVhdGVkQXQnLCB0eXBlOiBkeW5hbW9kYi5BdHRyaWJ1dGVUeXBlLlNUUklORyB9LFxyXG4gICAgICBwcm9qZWN0aW9uVHlwZTogZHluYW1vZGIuUHJvamVjdGlvblR5cGUuQUxMXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBTMyBCdWNrZXQgZm9yIGZpbGUgc3RvcmFnZVxyXG4gICAgY29uc3Qgc3RvcmFnZUJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgJ1N0b3JhZ2VCdWNrZXQnLCB7XHJcbiAgICAgIGJ1Y2tldE5hbWU6IGBTbmFwaW5mcmEtc3RvcmFnZS0ke3RoaXMuYWNjb3VudH0tJHt0aGlzLnJlZ2lvbn1gLFxyXG4gICAgICB2ZXJzaW9uZWQ6IHRydWUsXHJcbiAgICAgIHJlbW92YWxQb2xpY3k6IGNkay5SZW1vdmFsUG9saWN5LkRFU1RST1ksXHJcbiAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLCAvLyBGb3IgZGV2ZWxvcG1lbnRcclxuICAgICAgY29yczogW3tcclxuICAgICAgICBhbGxvd2VkTWV0aG9kczogW3MzLkh0dHBNZXRob2RzLkdFVCwgczMuSHR0cE1ldGhvZHMuUE9TVCwgczMuSHR0cE1ldGhvZHMuUFVULCBzMy5IdHRwTWV0aG9kcy5ERUxFVEVdLFxyXG4gICAgICAgIGFsbG93ZWRPcmlnaW5zOiBbJyonXSwgLy8gUmVzdHJpY3QgaW4gcHJvZHVjdGlvblxyXG4gICAgICAgIGFsbG93ZWRIZWFkZXJzOiBbJyonXSxcclxuICAgICAgICBtYXhBZ2U6IDMwMDBcclxuICAgICAgfV1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIENvZ25pdG8gcmVtb3ZlZCAtIHVzaW5nIGN1c3RvbSBhdXRoIGluc3RlYWRcclxuXHJcbiAgICAvLyBTUVMgUXVldWVzXHJcbiAgICBjb25zdCBjb2RlR2VuZXJhdGlvblF1ZXVlID0gbmV3IHNxcy5RdWV1ZSh0aGlzLCAnQ29kZUdlbmVyYXRpb25RdWV1ZScsIHtcclxuICAgICAgcXVldWVOYW1lOiAnU25hcGluZnJhLWNvZGUtZ2VuZXJhdGlvbicsXHJcbiAgICAgIHZpc2liaWxpdHlUaW1lb3V0OiBjZGsuRHVyYXRpb24ubWludXRlcygxNSksIC8vIExvbmcgdGltZW91dCBmb3IgQUkgcHJvY2Vzc2luZ1xyXG4gICAgICByZXRlbnRpb25QZXJpb2Q6IGNkay5EdXJhdGlvbi5kYXlzKDE0KSxcclxuICAgICAgZGVhZExldHRlclF1ZXVlOiB7XHJcbiAgICAgICAgcXVldWU6IG5ldyBzcXMuUXVldWUodGhpcywgJ0NvZGVHZW5lcmF0aW9uRExRJywge1xyXG4gICAgICAgICAgcXVldWVOYW1lOiAnU25hcGluZnJhLWNvZGUtZ2VuZXJhdGlvbi1kbHEnXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgbWF4UmVjZWl2ZUNvdW50OiAzXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGRlcGxveW1lbnRRdWV1ZSA9IG5ldyBzcXMuUXVldWUodGhpcywgJ0RlcGxveW1lbnRRdWV1ZScsIHtcclxuICAgICAgcXVldWVOYW1lOiAnU25hcGluZnJhLWRlcGxveW1lbnRzJyxcclxuICAgICAgdmlzaWJpbGl0eVRpbWVvdXQ6IGNkay5EdXJhdGlvbi5taW51dGVzKDMwKSwgLy8gTG9uZyB0aW1lb3V0IGZvciBkZXBsb3ltZW50c1xyXG4gICAgICByZXRlbnRpb25QZXJpb2Q6IGNkay5EdXJhdGlvbi5kYXlzKDE0KVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gU05TIFRvcGljc1xyXG4gICAgY29uc3QgZGVwbG95bWVudE5vdGlmaWNhdGlvbnMgPSBuZXcgc25zLlRvcGljKHRoaXMsICdEZXBsb3ltZW50Tm90aWZpY2F0aW9ucycsIHtcclxuICAgICAgdG9waWNOYW1lOiAnU25hcGluZnJhLWRlcGxveW1lbnQtbm90aWZpY2F0aW9ucycsXHJcbiAgICAgIGRpc3BsYXlOYW1lOiAnU25hcGluZnJhIERlcGxveW1lbnQgTm90aWZpY2F0aW9ucydcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIElBTSBSb2xlIGZvciBiYWNrZW5kIGFwcGxpY2F0aW9uXHJcbiAgICBjb25zdCBiYWNrZW5kUm9sZSA9IG5ldyBpYW0uUm9sZSh0aGlzLCAnQmFja2VuZFJvbGUnLCB7XHJcbiAgICAgIHJvbGVOYW1lOiAnU25hcGluZnJhQmFja2VuZFJvbGUnLFxyXG4gICAgICBhc3N1bWVkQnk6IG5ldyBpYW0uU2VydmljZVByaW5jaXBhbCgnZWMyLmFtYXpvbmF3cy5jb20nKSwgLy8gQ2FuIGJlIGNoYW5nZWQgZm9yIEVDU1xyXG4gICAgICBpbmxpbmVQb2xpY2llczoge1xyXG4gICAgICAgIER5bmFtb0RCQWNjZXNzOiBuZXcgaWFtLlBvbGljeURvY3VtZW50KHtcclxuICAgICAgICAgIHN0YXRlbWVudHM6IFtcclxuICAgICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgICBhY3Rpb25zOiBbXHJcbiAgICAgICAgICAgICAgICAnZHluYW1vZGI6R2V0SXRlbScsXHJcbiAgICAgICAgICAgICAgICAnZHluYW1vZGI6UHV0SXRlbScsXHJcbiAgICAgICAgICAgICAgICAnZHluYW1vZGI6VXBkYXRlSXRlbScsXHJcbiAgICAgICAgICAgICAgICAnZHluYW1vZGI6RGVsZXRlSXRlbScsXHJcbiAgICAgICAgICAgICAgICAnZHluYW1vZGI6UXVlcnknLFxyXG4gICAgICAgICAgICAgICAgJ2R5bmFtb2RiOlNjYW4nXHJcbiAgICAgICAgICAgICAgXSxcclxuICAgICAgICAgICAgICByZXNvdXJjZXM6IFtcclxuICAgICAgICAgICAgICAgIHByb2plY3RzVGFibGUudGFibGVBcm4sXHJcbiAgICAgICAgICAgICAgICBgJHtwcm9qZWN0c1RhYmxlLnRhYmxlQXJufS9pbmRleC8qYCxcclxuICAgICAgICAgICAgICAgIHVzZXJzVGFibGUudGFibGVBcm4sXHJcbiAgICAgICAgICAgICAgICBzY2hlbWFzVGFibGUudGFibGVBcm4sXHJcbiAgICAgICAgICAgICAgICBgJHtzY2hlbWFzVGFibGUudGFibGVBcm59L2luZGV4LypgLFxyXG4gICAgICAgICAgICAgICAgZGVwbG95bWVudHNUYWJsZS50YWJsZUFybixcclxuICAgICAgICAgICAgICAgIGAke2RlcGxveW1lbnRzVGFibGUudGFibGVBcm59L2luZGV4LypgXHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIFMzQWNjZXNzOiBuZXcgaWFtLlBvbGljeURvY3VtZW50KHtcclxuICAgICAgICAgIHN0YXRlbWVudHM6IFtcclxuICAgICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgICBhY3Rpb25zOiBbXHJcbiAgICAgICAgICAgICAgICAnczM6R2V0T2JqZWN0JyxcclxuICAgICAgICAgICAgICAgICdzMzpQdXRPYmplY3QnLFxyXG4gICAgICAgICAgICAgICAgJ3MzOkRlbGV0ZU9iamVjdCcsXHJcbiAgICAgICAgICAgICAgICAnczM6TGlzdEJ1Y2tldCdcclxuICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgIHJlc291cmNlczogW1xyXG4gICAgICAgICAgICAgICAgc3RvcmFnZUJ1Y2tldC5idWNrZXRBcm4sXHJcbiAgICAgICAgICAgICAgICBgJHtzdG9yYWdlQnVja2V0LmJ1Y2tldEFybn0vKmBcclxuICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgU1FTQWNjZXNzOiBuZXcgaWFtLlBvbGljeURvY3VtZW50KHtcclxuICAgICAgICAgIHN0YXRlbWVudHM6IFtcclxuICAgICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xyXG4gICAgICAgICAgICAgIGVmZmVjdDogaWFtLkVmZmVjdC5BTExPVyxcclxuICAgICAgICAgICAgICBhY3Rpb25zOiBbXHJcbiAgICAgICAgICAgICAgICAnc3FzOlNlbmRNZXNzYWdlJyxcclxuICAgICAgICAgICAgICAgICdzcXM6UmVjZWl2ZU1lc3NhZ2UnLFxyXG4gICAgICAgICAgICAgICAgJ3NxczpEZWxldGVNZXNzYWdlJyxcclxuICAgICAgICAgICAgICAgICdzcXM6R2V0UXVldWVBdHRyaWJ1dGVzJ1xyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgcmVzb3VyY2VzOiBbXHJcbiAgICAgICAgICAgICAgICBjb2RlR2VuZXJhdGlvblF1ZXVlLnF1ZXVlQXJuLFxyXG4gICAgICAgICAgICAgICAgZGVwbG95bWVudFF1ZXVlLnF1ZXVlQXJuXHJcbiAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIFNOU0FjY2VzczogbmV3IGlhbS5Qb2xpY3lEb2N1bWVudCh7XHJcbiAgICAgICAgICBzdGF0ZW1lbnRzOiBbXHJcbiAgICAgICAgICAgIG5ldyBpYW0uUG9saWN5U3RhdGVtZW50KHtcclxuICAgICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXHJcbiAgICAgICAgICAgICAgYWN0aW9uczogW1xyXG4gICAgICAgICAgICAgICAgJ3NuczpQdWJsaXNoJ1xyXG4gICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgcmVzb3VyY2VzOiBbZGVwbG95bWVudE5vdGlmaWNhdGlvbnMudG9waWNBcm5dXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gT3V0cHV0c1xyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1MzQnVja2V0TmFtZScsIHtcclxuICAgICAgdmFsdWU6IHN0b3JhZ2VCdWNrZXQuYnVja2V0TmFtZSxcclxuICAgICAgZGVzY3JpcHRpb246ICdTMyBTdG9yYWdlIEJ1Y2tldCBOYW1lJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ1Byb2plY3RzVGFibGVOYW1lJywge1xyXG4gICAgICB2YWx1ZTogcHJvamVjdHNUYWJsZS50YWJsZU5hbWUsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnRHluYW1vREIgUHJvamVjdHMgVGFibGUgTmFtZSdcclxuICAgIH0pO1xyXG5cclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsICdCYWNrZW5kUm9sZUFybicsIHtcclxuICAgICAgdmFsdWU6IGJhY2tlbmRSb2xlLnJvbGVBcm4sXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnQmFja2VuZCBBcHBsaWNhdGlvbiBJQU0gUm9sZSBBUk4nXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19