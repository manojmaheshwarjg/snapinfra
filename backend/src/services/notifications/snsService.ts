import { 
  PublishCommand, 
  SubscribeCommand,
  UnsubscribeCommand,
  ListSubscriptionsByTopicCommand
} from '@aws-sdk/client-sns';
import { snsClient, TOPICS } from '@/utils/awsConfig';

export interface NotificationData {
  [key: string]: any;
}

export interface CodeGenerationNotification extends NotificationData {
  codeGenId: string;
  projectId: string;
  status: 'queued' | 'generating' | 'completed' | 'failed';
  downloadUrl?: string;
  error?: string;
}

export interface DeploymentNotification extends NotificationData {
  deploymentId: string;
  projectId: string;
  environment: string;
  status: 'queued' | 'deploying' | 'deployed' | 'failed';
  error?: string;
}

export interface SystemAlert extends NotificationData {
  level: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  service?: string;
  timestamp: number;
}

export class SNSService {
  async notifyCodeGeneration(
    userId: string, 
    data: CodeGenerationNotification
  ): Promise<string> {
    const message = {
      type: 'code-generation',
      userId,
      ...data,
      timestamp: Date.now()
    };

    const command = new PublishCommand({
      TopicArn: TOPICS.DEPLOYMENT_NOTIFICATIONS,
      Message: JSON.stringify(message),
      Subject: `Code Generation ${data.status}`,
      MessageAttributes: {
        notificationType: {
          DataType: 'String',
          StringValue: 'code-generation'
        },
        userId: {
          DataType: 'String',
          StringValue: userId
        },
        projectId: {
          DataType: 'String',
          StringValue: data.projectId
        },
        status: {
          DataType: 'String',
          StringValue: data.status
        }
      }
    });

    const response = await snsClient.send(command);
    return response.MessageId || '';
  }

  async notifyDeployment(
    userId: string,
    data: DeploymentNotification
  ): Promise<string> {
    const message = {
      type: 'deployment',
      userId,
      ...data,
      timestamp: Date.now()
    };

    const command = new PublishCommand({
      TopicArn: TOPICS.DEPLOYMENT_NOTIFICATIONS,
      Message: JSON.stringify(message),
      Subject: `Deployment ${data.status} - ${data.environment}`,
      MessageAttributes: {
        notificationType: {
          DataType: 'String',
          StringValue: 'deployment'
        },
        userId: {
          DataType: 'String',
          StringValue: userId
        },
        projectId: {
          DataType: 'String',
          StringValue: data.projectId
        },
        environment: {
          DataType: 'String',
          StringValue: data.environment
        },
        status: {
          DataType: 'String',
          StringValue: data.status
        }
      }
    });

    const response = await snsClient.send(command);
    return response.MessageId || '';
  }

  async sendSystemAlert(alert: SystemAlert): Promise<string> {
    const message = {
      type: 'system-alert',
      ...alert,
      timestamp: alert.timestamp || Date.now()
    };

    const command = new PublishCommand({
      TopicArn: TOPICS.DEPLOYMENT_NOTIFICATIONS,
      Message: JSON.stringify(message),
      Subject: `System Alert: ${alert.level.toUpperCase()} - ${alert.message}`,
      MessageAttributes: {
        notificationType: {
          DataType: 'String',
          StringValue: 'system-alert'
        },
        level: {
          DataType: 'String',
          StringValue: alert.level
        }
      }
    });

    const response = await snsClient.send(command);
    return response.MessageId || '';
  }

  async subscribeEmail(email: string): Promise<string> {
    const command = new SubscribeCommand({
      TopicArn: TOPICS.DEPLOYMENT_NOTIFICATIONS,
      Protocol: 'email',
      Endpoint: email,
      Attributes: {
        FilterPolicy: JSON.stringify({
          notificationType: ['deployment', 'code-generation', 'system-alert']
        })
      }
    });

    const response = await snsClient.send(command);
    return response.SubscriptionArn || '';
  }

  async subscribeSMS(phoneNumber: string): Promise<string> {
    const command = new SubscribeCommand({
      TopicArn: TOPICS.DEPLOYMENT_NOTIFICATIONS,
      Protocol: 'sms',
      Endpoint: phoneNumber,
      Attributes: {
        FilterPolicy: JSON.stringify({
          notificationType: ['deployment'],
          status: ['deployed', 'failed']
        })
      }
    });

    const response = await snsClient.send(command);
    return response.SubscriptionArn || '';
  }

  async subscribeWebhook(webhookUrl: string): Promise<string> {
    const command = new SubscribeCommand({
      TopicArn: TOPICS.DEPLOYMENT_NOTIFICATIONS,
      Protocol: 'https',
      Endpoint: webhookUrl,
      Attributes: {
        FilterPolicy: JSON.stringify({
          notificationType: ['deployment', 'code-generation']
        })
      }
    });

    const response = await snsClient.send(command);
    return response.SubscriptionArn || '';
  }

  async unsubscribe(subscriptionArn: string): Promise<void> {
    const command = new UnsubscribeCommand({
      SubscriptionArn: subscriptionArn
    });

    await snsClient.send(command);
  }

  async listSubscriptions(): Promise<any[]> {
    const command = new ListSubscriptionsByTopicCommand({
      TopicArn: TOPICS.DEPLOYMENT_NOTIFICATIONS
    });

    const response = await snsClient.send(command);
    return response.Subscriptions || [];
  }

  async notifyProjectCreated(userId: string, projectId: string, projectName: string): Promise<string> {
    return await this.sendSystemAlert({
      level: 'info',
      message: `New project created: ${projectName}`,
      service: 'projects',
      userId,
      projectId,
      timestamp: Date.now()
    });
  }

  async notifyError(error: Error, context: any): Promise<string> {
    return await this.sendSystemAlert({
      level: 'error',
      message: error.message,
      service: context.service || 'unknown',
      error: error.stack,
      context,
      timestamp: Date.now()
    });
  }
}
