import { 
  SendMessageCommand, 
  ReceiveMessageCommand,
  DeleteMessageCommand,
  GetQueueAttributesCommand,
  Message
} from '@aws-sdk/client-sqs';
import { sqsClient, QUEUES } from '@/utils/awsConfig';

export interface JobMessage<T = any> {
  id: string;
  type: string;
  data: T;
  timestamp: number;
  retryCount?: number;
}

export interface CodeGenerationJob {
  codeGenId: string;
  projectId: string;
  userId: string;
  type: 'api' | 'model' | 'controller' | 'service' | 'full-stack';
  prompt: string;
}

export interface DeploymentJob {
  deploymentId: string;
  projectId: string;
  userId: string;
  environment: string;
  config: any;
}

export class SQSService {
  async enqueueCodeGeneration(job: CodeGenerationJob): Promise<string> {
    const message: JobMessage<CodeGenerationJob> = {
      id: job.codeGenId,
      type: 'code-generation',
      data: job,
      timestamp: Date.now()
    };

    const command = new SendMessageCommand({
      QueueUrl: QUEUES.CODE_GENERATION,
      MessageBody: JSON.stringify(message),
      MessageAttributes: {
        jobType: {
          DataType: 'String',
          StringValue: 'code-generation'
        },
        projectId: {
          DataType: 'String',
          StringValue: job.projectId
        },
        userId: {
          DataType: 'String',
          StringValue: job.userId
        }
      }
    });

    const response = await sqsClient.send(command);
    return response.MessageId || message.id;
  }

  async enqueueDeployment(job: DeploymentJob): Promise<string> {
    const message: JobMessage<DeploymentJob> = {
      id: job.deploymentId,
      type: 'deployment',
      data: job,
      timestamp: Date.now()
    };

    const command = new SendMessageCommand({
      QueueUrl: QUEUES.DEPLOYMENT,
      MessageBody: JSON.stringify(message),
      MessageAttributes: {
        jobType: {
          DataType: 'String',
          StringValue: 'deployment'
        },
        projectId: {
          DataType: 'String',
          StringValue: job.projectId
        },
        environment: {
          DataType: 'String',
          StringValue: job.environment
        }
      }
    });

    const response = await sqsClient.send(command);
    return response.MessageId || message.id;
  }

  async receiveCodeGenerationJobs(maxMessages: number = 1): Promise<Message[]> {
    const command = new ReceiveMessageCommand({
      QueueUrl: QUEUES.CODE_GENERATION,
      MaxNumberOfMessages: maxMessages,
      WaitTimeSeconds: 20,
      MessageAttributeNames: ['All'],
      AttributeNames: ['All']
    });

    const response = await sqsClient.send(command);
    return response.Messages || [];
  }

  async receiveDeploymentJobs(maxMessages: number = 1): Promise<Message[]> {
    const command = new ReceiveMessageCommand({
      QueueUrl: QUEUES.DEPLOYMENT,
      MaxNumberOfMessages: maxMessages,
      WaitTimeSeconds: 20,
      MessageAttributeNames: ['All'],
      AttributeNames: ['All']
    });

    const response = await sqsClient.send(command);
    return response.Messages || [];
  }

  async deleteMessage(queueUrl: string, receiptHandle: string): Promise<void> {
    const command = new DeleteMessageCommand({
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle
    });

    await sqsClient.send(command);
  }

  async getQueueDepth(queueUrl: string): Promise<number> {
    const command = new GetQueueAttributesCommand({
      QueueUrl: queueUrl,
      AttributeNames: ['ApproximateNumberOfMessages']
    });

    const response = await sqsClient.send(command);
    const count = response.Attributes?.ApproximateNumberOfMessages;
    return count ? parseInt(count) : 0;
  }

  async getCodeGenerationQueueDepth(): Promise<number> {
    return await this.getQueueDepth(QUEUES.CODE_GENERATION);
  }

  async getDeploymentQueueDepth(): Promise<number> {
    return await this.getQueueDepth(QUEUES.DEPLOYMENT);
  }

  parseMessage<T = any>(message: Message): JobMessage<T> | null {
    if (!message.Body) {
      return null;
    }

    try {
      return JSON.parse(message.Body) as JobMessage<T>;
    } catch (error) {
      console.error('Failed to parse SQS message:', error);
      return null;
    }
  }
}
