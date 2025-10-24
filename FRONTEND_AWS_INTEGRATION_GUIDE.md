# Frontend AWS Integration Guide

## Status: API Client Ready - Frontend Pages Need Connection

The API client (`lib/api-client.ts`) has been **fully extended** with all AWS-integrated endpoints. Now each frontend page needs to be updated to use these APIs instead of static data.

## API Client Functions Available

### All AWS Services are Ready:
- ✅ DynamoDB - All data operations
- ✅ S3 - File uploads (diagrams, attachments, profile pictures)
- ✅ SQS - Async processing (code generation, deployments)
- ✅ SNS - Notifications (activities, team invites)

## Pages That Need AWS Connection

### 1. Home Page (`/app/page.tsx`)
**Current:** Static data  
**Needs:** Dynamic data from DynamoDB

```typescript
import { useEffect, useState } from 'react'
import { getHomeData } from '@/lib/api-client'

// Replace static data with:
useEffect(() => {
  getHomeData().then(data => {
    setRecentProjects(data.recentProjects)
    setRecentActivity(data.recentActivity)
  })
}, [])
```

### 2. Dashboard Page (`/app/dashboard/page.tsx`)
**Current:** Static metrics  
**Needs:** Real-time metrics from DynamoDB

```typescript
import { getDashboardOverview, getDashboardMetrics, getRecentActivity } from '@/lib/api-client'

useEffect(() => {
  Promise.all([
    getDashboardOverview(),
    getDashboardMetrics(),
    getRecentActivity(20)
  ]).then(([overview, metrics, activity]) => {
    setOverview(overview)
    setMetrics(metrics)
    setActivities(activity.activities)
  })
}, [])
```

### 3. Projects Page (`/app/projects/page.tsx`)
**Current:** Context API with static data  
**Needs:** Full CRUD with DynamoDB

```typescript
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/api-client'

// Load projects
useEffect(() => {
  getProjects().then(response => {
    setProjects(response.data)
  })
}, [])

// Create project - AWS synced immediately
const handleCreate = async (data) => {
  const project = await createProject(data)
  // Automatically saved to DynamoDB
  setProjects([...projects, project])
}
```

### 4. Schema Page (`/app/schema/page.tsx`)
**Current:** Static schema examples  
**Needs:** Dynamic schemas from DynamoDB

```typescript
import { getAllSchemas, createSchema, updateSchema, deleteSchema } from '@/lib/api-client'

useEffect(() => {
  getAllSchemas().then(response => {
    setSchemas(response.schemas)
  })
}, [])
```

### 5. Architecture Page (`/app/architecture/page.tsx`)
**Current:** Static components array  
**Needs:** DynamoDB + S3 for diagrams

```typescript
import { getArchitecturesByProject, uploadArchitectureDiagram, getArchitectureDiagramUrl } from '@/lib/api-client'

// Load architectures
useEffect(() => {
  if (projectId) {
    getArchitecturesByProject(projectId).then(response => {
      setArchitectures(response.data)
    })
  }
}, [projectId])

// Upload diagram - goes to S3
const handleUploadDiagram = async (file: File) => {
  const result = await uploadArchitectureDiagram(architectureId, file, projectId)
  // File uploaded to S3, URL saved in DynamoDB
  
  // Get presigned URL for viewing
  const urlResponse = await getArchitectureDiagramUrl(architectureId, projectId)
  setDiagramUrl(urlResponse.data.url)
}
```

### 6. Code Generation Page (`/app/code-generation/page.tsx`)
**Current:** Mock generation  
**Needs:** SQS queue + S3 downloads

```typescript
import { getAllCodeGenerations, generateCode, getCodeDownloadUrl } from '@/lib/api-client'

// Generate code - queued to SQS
const handleGenerate = async (data) => {
  const result = await generateCode(data)
  // Job queued, worker will process and upload to S3
  setGenerationId(result.data.id)
}

// Download from S3
const handleDownload = async (id) => {
  const urlResponse = await getCodeDownloadUrl(id)
  window.open(urlResponse.data.url, '_blank')
}
```

### 7. Deployments Page (`/app/deployments/page.tsx`)
**Current:** Static deployment list  
**Needs:** SQS queue + real-time status

```typescript
import { getAllDeployments, createDeployment, getDeploymentStatus, getDeploymentLogs } from '@/lib/api-client'

// Create deployment - queued to SQS
const handleDeploy = async (data) => {
  const deployment = await createDeployment(data)
  // Job queued, worker will process, SNS will notify
  
  // Poll for status
  const interval = setInterval(async () => {
    const status = await getDeploymentStatus(deployment.data.id)
    setDeploymentStatus(status)
    if (status.status === 'success' || status.status === 'failed') {
      clearInterval(interval)
    }
  }, 5000)
}
```

### 8. Analytics Page (`/app/analytics/page.tsx`)
**Current:** Static chart data  
**Needs:** Real-time chart data from DynamoDB

```typescript
import { getAnalyticsChartData, getRealtimeAnalytics } from '@/lib/api-client'

// Real-time data
useEffect(() => {
  const loadAnalytics = async () => {
    const chartData = await getAnalyticsChartData('deployments', timeRange)
    const realtime = await getRealtimeAnalytics(projectId)
    
    setChartData(chartData.chartData)
    setRealtimeMetrics(realtime.metrics)
  }
  
  loadAnalytics()
  
  // Refresh every 30 seconds
  const interval = setInterval(loadAnalytics, 30000)
  return () => clearInterval(interval)
}, [timeRange, projectId])
```

### 9. Activity Page (`/app/activity/page.tsx`)
**Current:** Static activity feed  
**Needs:** Real-time activities from DynamoDB

```typescript
import { getAllActivities, getProjectActivities } from '@/lib/api-client'

useEffect(() => {
  getAllActivities(50).then(response => {
    setActivities(response.activities)
  })
}, [])

// Auto-refresh for real-time updates
useEffect(() => {
  const interval = setInterval(() => {
    getAllActivities(50).then(response => {
      setActivities(response.activities)
    })
  }, 10000) // Every 10 seconds
  return () => clearInterval(interval)
}, [])
```

### 10. Documentation Page (`/app/docs/page.tsx`)
**Current:** Static docs  
**Needs:** DynamoDB + S3 attachments

```typescript
import { getAllDocumentation, uploadDocumentAttachment, getDocumentAttachmentUrl } from '@/lib/api-client'

// Upload attachment to S3
const handleUploadAttachment = async (file: File) => {
  const result = await uploadDocumentAttachment(documentId, file)
  // File uploaded to S3, metadata saved in DynamoDB
  
  // Get presigned URL
  const urlResponse = await getDocumentAttachmentUrl(documentId, result.attachment.id)
  window.open(urlResponse.url, '_blank')
}
```

### 11. Team Page (`/app/team/page.tsx`)
**Current:** Static team list  
**Needs:** DynamoDB + SNS notifications

```typescript
import { getProjectTeam, inviteTeamMember, updateTeamMemberRole } from '@/lib/api-client'

// Invite member - SNS notification sent
const handleInvite = async (email, role) => {
  await inviteTeamMember(projectId, { email, role })
  // Invitation saved in DynamoDB, SNS notification sent
}

// Update role - SNS notification sent
const handleUpdateRole = async (userId, newRole) => {
  await updateTeamMemberRole(projectId, userId, newRole)
  // Role updated in DynamoDB, SNS notification sent
}
```

### 12. Settings Page (`/app/settings/page.tsx`)
**Current:** Clerk user data only  
**Needs:** DynamoDB + S3 profile pictures

```typescript
import { getSettings, updateSettings, uploadProfilePicture, getProfilePictureUrl } from '@/lib/api-client'

// Load settings
useEffect(() => {
  getSettings().then(response => {
    setSettings(response.settings)
  })
  
  // Load profile picture
  getProfilePictureUrl().then(response => {
    setProfilePictureUrl(response.url)
  }).catch(() => {
    // No profile picture yet
  })
}, [])

// Upload profile picture to S3
const handleUploadPicture = async (file: File) => {
  const result = await uploadProfilePicture(file)
  // Image uploaded to S3, URL saved in DynamoDB
  setProfilePictureUrl(result.profilePictureUrl)
}
```

## Key Implementation Patterns

### Pattern 1: Load Data on Mount
```typescript
useEffect(() => {
  loadData()
}, [])
```

### Pattern 2: Real-time Polling
```typescript
useEffect(() => {
  const interval = setInterval(loadData, 30000) // 30 seconds
  return () => clearInterval(interval)
}, [])
```

### Pattern 3: File Upload to S3
```typescript
const handleUpload = async (file: File) => {
  const result = await uploadFunction(id, file, ...params)
  // File automatically converted to base64 and uploaded to S3
  // Presigned URL returned for immediate viewing
}
```

### Pattern 4: Create with Auto-sync
```typescript
const handleCreate = async (data) => {
  const result = await createFunction(data)
  // Data immediately saved to DynamoDB
  // State updated locally
  setItems([...items, result.data])
}
```

## Environment Variables Needed

Create `.env.local` in the root directory:

```bash
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

# Auth mode (development uses x-dev-user-id header)
NEXT_PUBLIC_AUTH_MODE=development

# For production, use Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
```

## Testing the Integration

### 1. Start Backend
```powershell
cd backend
npm run dev
npm run worker  # In separate terminal
```

### 2. Start Frontend
```powershell
# From root
npm run dev
```

### 3. Test Each Page
- Data should load from AWS DynamoDB
- File uploads should go to S3
- Code generation/deployments should queue to SQS
- Notifications should trigger SNS
- Everything should be real-time and persistent

## Next Steps

1. Update each page one by one
2. Replace static data with API calls
3. Add loading states
4. Add error handling
5. Test AWS sync
6. Verify S3 uploads work
7. Check SNS notifications trigger

All APIs are ready - just need to connect the frontend!
