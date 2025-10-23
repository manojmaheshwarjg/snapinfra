import { SQSService, CodeGenerationJob, DeploymentJob } from '@/services/queue/sqsService';
import { CodeGenerationService } from '@/services/codeGenerationService';
import { DynamoDBService } from '@/services/database/dynamoDBService';
import { S3Service } from '@/services/storage/s3Service';
import { SNSService } from '@/services/notifications/snsService';
import { QUEUES } from '@/utils/awsConfig';

export class QueueWorker {
  private sqsService: SQSService;
  private codeGenService: CodeGenerationService;
  private dynamoDB: DynamoDBService;
  private s3Service: S3Service;
  private snsService: SNSService;
  private isRunning: boolean = false;

  constructor() {
    this.sqsService = new SQSService();
    this.codeGenService = new CodeGenerationService();
    this.dynamoDB = new DynamoDBService();
    this.s3Service = new S3Service();
    this.snsService = new SNSService();
  }

  async start(): Promise<void> {
    this.isRunning = true;
    console.log('🚀 Queue worker started');

    await Promise.all([
      this.processCodeGenerationQueue(),
      this.processDeploymentQueue()
    ]);
  }

  stop(): void {
    this.isRunning = false;
    console.log('⏹️  Queue worker stopped');
  }

  private async processCodeGenerationQueue(): Promise<void> {
    while (this.isRunning) {
      try {
        const messages = await this.sqsService.receiveCodeGenerationJobs(5);

        for (const message of messages) {
          if (!message.ReceiptHandle) continue;

          const job = this.sqsService.parseMessage<CodeGenerationJob>(message);
          if (!job) {
            await this.sqsService.deleteMessage(QUEUES.CODE_GENERATION, message.ReceiptHandle);
            continue;
          }

          console.log(`Processing code generation job: ${job.id}`);

          try {
            await this.processCodeGenerationJob(job.data);
            await this.sqsService.deleteMessage(QUEUES.CODE_GENERATION, message.ReceiptHandle);
            console.log(`✅ Code generation job completed: ${job.id}`);
          } catch (error) {
            console.error(`❌ Code generation job failed: ${job.id}`, error);
            // Message will return to queue for retry
          }
        }

        if (messages.length === 0) {
          await this.sleep(1000);
        }
      } catch (error) {
        console.error('Error processing code generation queue:', error);
        await this.sleep(5000);
      }
    }
  }

  private async processDeploymentQueue(): Promise<void> {
    while (this.isRunning) {
      try {
        const messages = await this.sqsService.receiveDeploymentJobs(5);

        for (const message of messages) {
          if (!message.ReceiptHandle) continue;

          const job = this.sqsService.parseMessage<DeploymentJob>(message);
          if (!job) {
            await this.sqsService.deleteMessage(QUEUES.DEPLOYMENT, message.ReceiptHandle);
            continue;
          }

          console.log(`Processing deployment job: ${job.id}`);

          try {
            await this.processDeploymentJob(job.data);
            await this.sqsService.deleteMessage(QUEUES.DEPLOYMENT, message.ReceiptHandle);
            console.log(`✅ Deployment job completed: ${job.id}`);
          } catch (error) {
            console.error(`❌ Deployment job failed: ${job.id}`, error);
            // Message will return to queue for retry
          }
        }

        if (messages.length === 0) {
          await this.sleep(1000);
        }
      } catch (error) {
        console.error('Error processing deployment queue:', error);
        await this.sleep(5000);
      }
    }
  }

  private async processCodeGenerationJob(job: CodeGenerationJob): Promise<void> {
    const codeGeneration = await this.dynamoDB.get('CodeGenerations', {
      id: job.codeGenId,
      userId: job.userId
    });

    if (!codeGeneration) {
      throw new Error(`Code generation not found: ${job.codeGenId}`);
    }

    await this.dynamoDB.update('CodeGenerations', 
      { id: job.codeGenId, userId: job.userId },
      { status: 'generating', updatedAt: new Date().toISOString() }
    );

    await this.codeGenService.generateCodeAsync(codeGeneration);

    const updatedCodeGen = await this.dynamoDB.get('CodeGenerations', {
      id: job.codeGenId,
      userId: job.userId
    });

    if (updatedCodeGen && updatedCodeGen.generatedCode) {
      const zipBuffer = await this.codeGenService.createZipArchive(updatedCodeGen.generatedCode);
      
      const fileMetadata = await this.s3Service.uploadCodeArchive(
        job.projectId,
        job.codeGenId,
        zipBuffer
      );

      await this.dynamoDB.update('CodeGenerations',
        { id: job.codeGenId, userId: job.userId },
        { 
          s3Key: fileMetadata.key,
          s3Url: fileMetadata.url,
          fileSize: fileMetadata.size,
          updatedAt: new Date().toISOString()
        }
      );

      await this.snsService.notifyCodeGeneration(job.userId, {
        codeGenId: job.codeGenId,
        projectId: job.projectId,
        status: 'completed',
        downloadUrl: fileMetadata.url
      });
    }
  }

  private async processDeploymentJob(job: DeploymentJob): Promise<void> {
    await this.dynamoDB.update('Deployments',
      { id: job.deploymentId, userId: job.userId },
      { status: 'deploying', updatedAt: new Date().toISOString() }
    );

    await this.snsService.notifyDeployment(job.userId, {
      deploymentId: job.deploymentId,
      projectId: job.projectId,
      environment: job.environment,
      status: 'deploying'
    });

    try {
      await this.sleep(5000);

      await this.dynamoDB.update('Deployments',
        { id: job.deploymentId, userId: job.userId },
        { 
          status: 'deployed',
          deployedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      );

      await this.snsService.notifyDeployment(job.userId, {
        deploymentId: job.deploymentId,
        projectId: job.projectId,
        environment: job.environment,
        status: 'deployed'
      });
    } catch (error) {
      await this.dynamoDB.update('Deployments',
        { id: job.deploymentId, userId: job.userId },
        { 
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          updatedAt: new Date().toISOString()
        }
      );

      await this.snsService.notifyDeployment(job.userId, {
        deploymentId: job.deploymentId,
        projectId: job.projectId,
        environment: job.environment,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

if (require.main === module) {
  const worker = new QueueWorker();
  
  worker.start().catch(error => {
    console.error('Worker failed to start:', error);
    process.exit(1);
  });

  process.on('SIGINT', () => {
    console.log('\nReceived SIGINT, stopping worker...');
    worker.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\nReceived SIGTERM, stopping worker...');
    worker.stop();
    process.exit(0);
  });
}
