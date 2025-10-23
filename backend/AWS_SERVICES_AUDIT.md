# AWS Services Usage Audit

## Date: 2025-10-22

## Executive Summary

**Configured AWS Services:** 4 (DynamoDB, S3, SQS, SNS)  
**Actually Used AWS Services:** 1 (DynamoDB only)  
**Unused Services:** 3 (S3, SQS, SNS)

---

## Configured AWS Services

### From `src/utils/awsConfig.ts`

```typescript
// ✅ DynamoDB - ACTIVELY USED
export const dynamodbClient = new DynamoDBClient(clientConfig);
export const docClient = DynamoDBDocumentClient.from(dynamodbClient);

// ❌ S3 - CONFIGURED BUT NOT USED
export const s3Client = new S3Client(clientConfig);

// ❌ SQS - CONFIGURED BUT NOT USED
export const sqsClient = new SQSClient(clientConfig);

// ❌ SNS - CONFIGURED BUT NOT USED
export const snsClient = new SNSClient(clientConfig);
```

---

## Service-by-Service Analysis

### 1. DynamoDB ✅ ACTIVELY USED

**Status:** Production-ready, fully implemented

**Tables Deployed:**
- snapinfra-projects
- snapinfra-users
- snapinfra-schemas
- snapinfra-architectures
- snapinfra-code-generations
- snapinfra-deployments
- snapinfra-analytics (includes rate limiting)
- snapinfra-activity
- snapinfra-documentation
- snapinfra-teams
- snapinfra-settings
- snapinfra-integrations

**Usage:**
- All CRUD operations
- User data storage
- Project management
- Code generation tracking
- Analytics and activity logs
- Rate limiting (newly implemented)

**Files Using DynamoDB:**
- `src/services/database/dynamoService.ts`
- `src/services/database/dynamoDBService.ts`
- `src/middleware/rateLimiter.ts`
- All controllers (projects, schemas, deployments, etc.)

---

### 2. S3 ❌ NOT USED

**Status:** Configured but never used in code

**Configuration:**
```typescript
export const s3Client = new S3Client(clientConfig);
export const S3_CONFIG = {
  BUCKET_NAME: process.env.S3_BUCKET_NAME || 'snapinfra-storage',
  BUCKET_REGION: process.env.S3_BUCKET_REGION || AWS_REGION
};
```

**No Usage Found:**
- No `PutObjectCommand` imports
- No `GetObjectCommand` imports
- No S3 operations anywhere in codebase
- No file uploads/downloads
- No bucket operations

**Potential Use Cases (Not Implemented):**
- Store generated code ZIP files
- Store project assets (images, diagrams)
- Store architecture diagrams
- Store deployment artifacts
- Store user uploads
- Store backup data

**Current Alternative:**
- Generated code is stored in DynamoDB as JSON
- No file storage mechanism exists

---

### 3. SQS ❌ NOT USED

**Status:** Configured but never used in code

**Configuration:**
```typescript
export const sqsClient = new SQSClient(clientConfig);
export const QUEUES = {
  CODE_GENERATION: process.env.SQS_CODE_GENERATION_QUEUE || 'snapinfra-code-generation',
  DEPLOYMENT: process.env.SQS_DEPLOYMENT_QUEUE || 'snapinfra-deployments'
};
```

**No Usage Found:**
- No `SendMessageCommand` imports
- No `ReceiveMessageCommand` imports
- No queue operations
- No message processing
- No async job queues

**Potential Use Cases (Not Implemented):**
- Async code generation processing
- Deployment job queuing
- Background task processing
- Deferred operations
- Event-driven workflows

**Current Alternative:**
- Code generation runs synchronously in API requests
- No background job processing
- All operations are blocking/synchronous

---

### 4. SNS ❌ NOT USED

**Status:** Configured but never used in code

**Configuration:**
```typescript
export const snsClient = new SNSClient(clientConfig);
export const TOPICS = {
  DEPLOYMENT_NOTIFICATIONS: process.env.SNS_DEPLOYMENT_NOTIFICATIONS || 'snapinfra-deployment-notifications'
};
```

**No Usage Found:**
- No `PublishCommand` imports
- No SNS publish operations
- No topic subscriptions
- No notifications
- No pub/sub messaging

**Potential Use Cases (Not Implemented):**
- Deployment status notifications
- Email alerts for errors
- Real-time event notifications
- System health alerts
- User notifications
- Team collaboration alerts

**Current Alternative:**
- No notification system
- Users must poll API for status updates
- No real-time alerts

---

## Why Were These Configured?

Looking at the configuration, it appears:

1. **S3** - Intended for file storage (generated code, assets)
2. **SQS** - Intended for async processing (code gen, deployments)
3. **SNS** - Intended for notifications (deployment status)

These were likely planned features that were never implemented.

---

## Cost Analysis

### Current Monthly Cost (Estimated)

**DynamoDB:**
- 12 tables with Pay-Per-Request pricing
- Estimated cost: $5-50/month (depending on usage)

**S3, SQS, SNS:**
- $0/month (not being used, no resources created)

**Total:** ~$5-50/month (DynamoDB only)

### If All Services Were Used (Estimated)

**DynamoDB:** $5-50/month  
**S3:** $1-10/month (depends on storage)  
**SQS:** $0.50-5/month (depends on messages)  
**SNS:** $0.50-5/month (depends on notifications)  

**Total:** ~$7-70/month

---

## Recommendations

### Priority 1: Clean Up Unused Configurations

#### Option A: Remove Unused Services (Recommended)
Remove S3, SQS, and SNS configurations since they're not being used:

```typescript
// Remove from src/utils/awsConfig.ts
- import { S3Client } from '@aws-sdk/client-s3';
- import { SQSClient } from '@aws-sdk/client-sqs';
- import { SNSClient } from '@aws-sdk/client-sns';
- export const s3Client = new S3Client(clientConfig);
- export const sqsClient = new SQSClient(clientConfig);
- export const snsClient = new SNSClient(clientConfig);
- export const S3_CONFIG = {...};
- export const QUEUES = {...};
- export const TOPICS = {...};
```

**Pros:**
- Cleaner codebase
- Less confusion
- Faster initialization
- Smaller bundle size

**Cons:**
- Need to add back if features are implemented later

#### Option B: Keep Configurations (For Future Use)
Keep the configurations but document that they're not used:

```typescript
// Configured but not yet implemented
// TODO: Implement S3 file storage
export const s3Client = new S3Client(clientConfig);
```

**Pros:**
- Easy to enable features later
- Shows future roadmap

**Cons:**
- Confusing for developers
- Unused code

### Priority 2: Implement Missing Features (Optional)

#### Feature 1: S3 File Storage
**Use case:** Store large generated code files

```typescript
// New file: src/services/storage/s3Service.ts
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, S3_CONFIG } from '@/utils/awsConfig';

export class S3Service {
  async uploadFile(key: string, content: Buffer): Promise<string> {
    await s3Client.send(new PutObjectCommand({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: key,
      Body: content
    }));
    return `s3://${S3_CONFIG.BUCKET_NAME}/${key}`;
  }
  
  async downloadFile(key: string): Promise<Buffer> {
    const response = await s3Client.send(new GetObjectCommand({
      Bucket: S3_CONFIG.BUCKET_NAME,
      Key: key
    }));
    return Buffer.from(await response.Body.transformToByteArray());
  }
}
```

**Benefits:**
- Store large files efficiently
- Offload DynamoDB (400KB item limit)
- Cost-effective for large files
- Enable file downloads

**When to implement:**
- If generated code > 100KB
- If storing images/diagrams
- If users upload files

#### Feature 2: SQS Background Processing
**Use case:** Async code generation

```typescript
// New file: src/services/queue/sqsService.ts
import { SendMessageCommand, ReceiveMessageCommand } from '@aws-sdk/client-sqs';
import { sqsClient, QUEUES } from '@/utils/awsConfig';

export class SQSService {
  async enqueueCodeGeneration(data: any): Promise<void> {
    await sqsClient.send(new SendMessageCommand({
      QueueUrl: QUEUES.CODE_GENERATION,
      MessageBody: JSON.stringify(data)
    }));
  }
  
  async processCodeGenerations(): Promise<void> {
    // Worker to process messages
    const response = await sqsClient.send(new ReceiveMessageCommand({
      QueueUrl: QUEUES.CODE_GENERATION,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20
    }));
    // Process messages...
  }
}
```

**Benefits:**
- Non-blocking API responses
- Better user experience
- Scalable processing
- Retry failed jobs

**When to implement:**
- If code generation takes >5 seconds
- If deploying to serverless (Lambda timeouts)
- If expecting high concurrent load

#### Feature 3: SNS Notifications
**Use case:** Real-time deployment alerts

```typescript
// New file: src/services/notifications/snsService.ts
import { PublishCommand } from '@aws-sdk/client-sns';
import { snsClient, TOPICS } from '@/utils/awsConfig';

export class SNSService {
  async notifyDeployment(status: string, details: any): Promise<void> {
    await snsClient.send(new PublishCommand({
      TopicArn: TOPICS.DEPLOYMENT_NOTIFICATIONS,
      Message: JSON.stringify({ status, details }),
      Subject: `Deployment ${status}`
    }));
  }
}
```

**Benefits:**
- Real-time notifications
- Email/SMS alerts
- Webhook integrations
- Better monitoring

**When to implement:**
- If users want email notifications
- If implementing webhooks
- If adding real-time features

---

## Current Architecture Reality

### What Actually Works

```
User Request → Express API → DynamoDB → Response
                    ↓
              Rate Limiter
                    ↓
              DynamoDB (Analytics)
```

### What's Configured But Unused

```
S3 Client ────────────> ❌ Never called
SQS Client ───────────> ❌ Never called  
SNS Client ───────────> ❌ Never called
```

---

## Action Plan

### Immediate Actions (Recommended)

**Option 1: Minimal Cleanup (Recommended)**
1. Add comments to unused services
2. Document in README that S3/SQS/SNS are not yet implemented
3. Keep configurations for future use

**Option 2: Full Cleanup**
1. Remove unused S3/SQS/SNS imports and configurations
2. Remove from package.json dependencies
3. Update documentation

### Future Roadmap (Optional)

**Phase 1: File Storage (S3)**
- Implement when code files exceed 100KB
- Add file upload/download endpoints
- Store architecture diagrams

**Phase 2: Background Jobs (SQS)**
- Implement when code generation becomes slow
- Add worker processes
- Queue deployment tasks

**Phase 3: Notifications (SNS)**
- Implement when users request alerts
- Add email notifications
- Add webhook support

---

## Summary

### Current State
- ✅ DynamoDB: Fully implemented and production-ready
- ❌ S3: Configured but completely unused
- ❌ SQS: Configured but completely unused  
- ❌ SNS: Configured but completely unused

### Recommendation
**Clean up unused services** to avoid confusion. They can be added back when needed.

### Impact
- **Cost:** No impact (unused services cost nothing)
- **Performance:** Minor improvement (less initialization)
- **Clarity:** Major improvement (clearer codebase)

### Next Steps
1. Decide: Keep or remove unused services?
2. Document decision in README
3. Update architecture diagrams if needed

---

## Conclusion

Your backend is currently a **DynamoDB-only application**. The S3, SQS, and SNS clients are initialized but never used. This is fine for now, but should be documented or removed to avoid confusion.

**Grade:**
- Implementation: A+ (DynamoDB works perfectly)
- Architecture: B (Unused services clutter the code)
- Documentation: C (Doesn't mention S3/SQS/SNS are unused)
