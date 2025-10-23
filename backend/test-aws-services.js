// Test script for S3, SQS, and SNS integration
// Run after deploying AWS infrastructure: node test-aws-services.js

require('dotenv').config();
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { SQSClient, SendMessageCommand, ReceiveMessageCommand } = require('@aws-sdk/client-sqs');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const S3_BUCKET = process.env.S3_BUCKET_NAME || 'snapinfra-storage';
const SQS_QUEUE_URL = process.env.SQS_CODE_GENERATION_QUEUE;
const SNS_TOPIC_ARN = process.env.SNS_DEPLOYMENT_NOTIFICATIONS;

const s3Client = new S3Client({ region: AWS_REGION });
const sqsClient = new SQSClient({ region: AWS_REGION });
const snsClient = new SNSClient({ region: AWS_REGION });

async function testS3() {
  console.log('\n📦 Testing S3...');
  
  try {
    // Test upload
    const testKey = `test/test-file-${Date.now()}.txt`;
    const testContent = 'Hello from Snapinfra test!';
    
    console.log(`  Uploading file to s3://${S3_BUCKET}/${testKey}...`);
    await s3Client.send(new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain'
    }));
    console.log('  ✅ Upload successful');
    
    // Test download
    console.log('  Downloading file...');
    const response = await s3Client.send(new GetObjectCommand({
      Bucket: S3_BUCKET,
      Key: testKey
    }));
    const downloaded = await response.Body.transformToString();
    
    if (downloaded === testContent) {
      console.log('  ✅ Download successful and content matches');
    } else {
      console.log('  ❌ Downloaded content does not match');
    }
    
    return true;
  } catch (error) {
    console.error('  ❌ S3 test failed:', error.message);
    return false;
  }
}

async function testSQS() {
  console.log('\n📨 Testing SQS...');
  
  try {
    if (!SQS_QUEUE_URL) {
      console.log('  ⚠️  SQS_CODE_GENERATION_QUEUE not configured');
      return false;
    }
    
    // Test send message
    const testMessage = {
      id: `test-${Date.now()}`,
      type: 'test',
      data: { message: 'Test message from Snapinfra' },
      timestamp: Date.now()
    };
    
    console.log('  Sending message to queue...');
    const sendResult = await sqsClient.send(new SendMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      MessageBody: JSON.stringify(testMessage)
    }));
    console.log(`  ✅ Message sent: ${sendResult.MessageId}`);
    
    // Test receive message
    console.log('  Receiving messages from queue...');
    const receiveResult = await sqsClient.send(new ReceiveMessageCommand({
      QueueUrl: SQS_QUEUE_URL,
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5
    }));
    
    if (receiveResult.Messages && receiveResult.Messages.length > 0) {
      console.log(`  ✅ Received ${receiveResult.Messages.length} message(s)`);
      const received = JSON.parse(receiveResult.Messages[0].Body);
      console.log(`  Message ID: ${received.id}`);
    } else {
      console.log('  ℹ️  No messages in queue (this is okay)');
    }
    
    return true;
  } catch (error) {
    console.error('  ❌ SQS test failed:', error.message);
    return false;
  }
}

async function testSNS() {
  console.log('\n📢 Testing SNS...');
  
  try {
    if (!SNS_TOPIC_ARN) {
      console.log('  ⚠️  SNS_DEPLOYMENT_NOTIFICATIONS not configured');
      return false;
    }
    
    // Test publish message
    const testNotification = {
      type: 'test',
      message: 'Test notification from Snapinfra',
      timestamp: Date.now()
    };
    
    console.log('  Publishing test notification...');
    const result = await snsClient.send(new PublishCommand({
      TopicArn: SNS_TOPIC_ARN,
      Message: JSON.stringify(testNotification),
      Subject: 'Snapinfra Test Notification',
      MessageAttributes: {
        notificationType: {
          DataType: 'String',
          StringValue: 'test'
        }
      }
    }));
    
    console.log(`  ✅ Notification sent: ${result.MessageId}`);
    console.log('  ℹ️  Check your subscribed endpoints for the notification');
    
    return true;
  } catch (error) {
    console.error('  ❌ SNS test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Snapinfra AWS Services Integration Test\n');
  console.log('Configuration:');
  console.log(`  Region: ${AWS_REGION}`);
  console.log(`  S3 Bucket: ${S3_BUCKET}`);
  console.log(`  SQS Queue: ${SQS_QUEUE_URL || 'Not configured'}`);
  console.log(`  SNS Topic: ${SNS_TOPIC_ARN || 'Not configured'}`);
  
  const results = {
    s3: await testS3(),
    sqs: await testSQS(),
    sns: await testSNS()
  };
  
  console.log('\n📊 Test Results:');
  console.log(`  S3:  ${results.s3 ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  SQS: ${results.sqs ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`  SNS: ${results.sns ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(r => r === true);
  
  if (allPassed) {
    console.log('\n✅ All AWS services are working correctly!');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some services failed. Check the logs above.');
    console.log('\nTroubleshooting:');
    console.log('  1. Make sure AWS infrastructure is deployed: cd aws/cdk && cdk deploy --all');
    console.log('  2. Check your .env file has correct AWS credentials and regions');
    console.log('  3. Verify IAM permissions for S3, SQS, and SNS');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('\n💥 Test script failed:', error);
  process.exit(1);
});
