# Frontend AWS Integration - Implementation Script

## Current Status

✅ **Backend:** Fully AWS integrated (DynamoDB, S3, SQS, SNS)  
✅ **API Client:** Extended with all AWS functions (`lib/api-client.ts`)  
⏳ **Frontend:** Still using static data / Context API

## Implementation Overview

Your frontend pages currently use:
1. **Context API** (`lib/app-context`) - Local state management
2. **LocalStorage** (`lib/storage`) - Browser storage
3. **Static data** - Hardcoded arrays and mock data

**Goal:** Replace with direct AWS backend calls so data persists in DynamoDB and files go to S3.

## Critical Decision

You have TWO options:

### Option A: Keep Context API + Add Backend Sync
- Modify Context API to sync with backend
- Keep existing page structure
- Add backend calls inside context actions
- **Pros:** Minimal page changes
- **Cons:** More complex, duplicate state management

### Option B: Remove Context API + Direct Backend Calls  
- Remove Context API entirely
- Pages call backend directly via API client
- Use React Query or SWR for caching
- **Pros:** Simpler, single source of truth (AWS)
- **Cons:** More page refactoring needed

**RECOMMENDATION:** **Option B** - Direct backend calls with React Query

## Step-by-Step Implementation Plan

### Phase 1: Install Dependencies

```bash
npm install @tanstack/react-query
```

### Phase 2: Setup React Query Provider

Create `app/providers.tsx`:
```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

Wrap your app in `app/layout.tsx`:
```typescript
import { Providers } from './providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ClerkProvider>
          <Providers>
            {children}
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  )
}
```

### Phase 3: Create Custom Hooks

Create `hooks/use-projects.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjects, createProject, updateProject, deleteProject } from '@/lib/api-client'

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(),
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })
}
```

Create similar hooks for:
- `hooks/use-dashboard.ts`
- `hooks/use-schemas.ts`
- `hooks/use-architectures.ts`
- `hooks/use-code-gen.ts`
- `hooks/use-deployments.ts`
- `hooks/use-analytics.ts`
- `hooks/use-activity.ts`
- `hooks/use-documentation.ts`
- `hooks/use-team.ts`
- `hooks/use-settings.ts`

### Phase 4: Update Pages One by One

#### Example: Dashboard Page

**BEFORE** (current):
```typescript
const { state } = useAppContext()
const { currentProject } = state
// Uses local state
```

**AFTER** (AWS-synced):
```typescript
import { useDashboard, useRecentActivity } from '@/hooks/use-dashboard'

export default function Dashboard() {
  const { data: overview, isLoading: overviewLoading } = useDashboard()
  const { data: activity } = useRecentActivity(20)
  
  if (overviewLoading) return <LoadingSpinner />
  
  return (
    <div>
      <h1>Projects: {overview.totalProjects}</h1>
      <h1>Deployments: {overview.totalDeployments}</h1>
      {/* Real-time data from DynamoDB */}
    </div>
  )
}
```

#### Example: Projects Page

**BEFORE**:
```typescript
const { state, dispatch } = useAppContext()
dispatch({ type: 'ADD_PROJECT', payload: project })
```

**AFTER**:
```typescript
import { useProjects, useCreateProject } from '@/hooks/use-projects'

export default function ProjectsPage() {
  const { data: projects, isLoading } = useProjects()
  const createMutation = useCreateProject()
  
  const handleCreate = async (data) => {
    await createMutation.mutateAsync(data)
    // Automatically saved to DynamoDB and UI updates
  }
  
  return (
    <div>
      {projects?.data?.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
}
```

#### Example: Architecture with S3

**BEFORE**:
```typescript
const [architectures, setArchitectures] = useState([])
// Static data
```

**AFTER**:
```typescript
import { useArchitectures, useUploadDiagram } from '@/hooks/use-architectures'

export default function ArchitecturePage() {
  const { data: architectures } = useArchitectures(projectId)
  const uploadMutation = useUploadDiagram()
  
  const handleUploadDiagram = async (file: File) => {
    const result = await uploadMutation.mutateAsync({ 
      id: architectureId, 
      file, 
      projectId 
    })
    // File uploaded to S3, URL in DynamoDB
    toast.success('Diagram uploaded to S3!')
  }
  
  return (
    <div>
      <input type="file" onChange={(e) => {
        if (e.target.files?.[0]) {
          handleUploadDiagram(e.target.files[0])
        }
      }} />
    </div>
  )
}
```

#### Example: Analytics with Real-time Data

**BEFORE**:
```typescript
const apiUsageData = [
  { name: 'Jan', requests: 45000 },
  // Static array
]
```

**AFTER**:
```typescript
import { useAnalyticsChart, useRealtimeMetrics } from '@/hooks/use-analytics'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const { data: chartData } = useAnalyticsChart('deployments', timeRange)
  const { data: realtime } = useRealtimeMetrics(projectId, {
    refetchInterval: 30000 // Refresh every 30 seconds
  })
  
  return (
    <div>
      <h1>Total Events: {realtime?.metrics.totalEvents}</h1>
      <Chart data={chartData?.chartData} />
      {/* Real-time data from DynamoDB, auto-refreshing */}
    </div>
  )
}
```

### Phase 5: Update Specific Features

#### Settings with Profile Picture Upload

```typescript
import { useSettings, useUploadProfilePicture, useProfilePictureUrl } from '@/hooks/use-settings'

export default function SettingsPage() {
  const { data: settings } = useSettings()
  const { data: profileUrl } = useProfilePictureUrl()
  const uploadMutation = useUploadProfilePicture()
  
  const handleUpload = async (file: File) => {
    const result = await uploadMutation.mutateAsync(file)
    // Uploaded to S3, presigned URL returned
    toast.success('Profile picture updated!')
  }
  
  return (
    <div>
      <Avatar src={profileUrl?.url} />
      <input type="file" accept="image/*" onChange={(e) => {
        if (e.target.files?.[0]) handleUpload(e.target.files[0])
      }} />
    </div>
  )
}
```

#### Code Generation with SQS Queue

```typescript
import { useGenerateCode, useCodeDownloadUrl } from '@/hooks/use-code-gen'

export default function CodeGenPage() {
  const generateMutation = useGenerateCode()
  
  const handleGenerate = async () => {
    const result = await generateMutation.mutateAsync({
      projectId,
      framework: 'express',
      language: 'typescript'
    })
    // Job queued to SQS
    // Worker will process and upload to S3
    // SNS notification when complete
    
    // Poll for completion
    const checkStatus = setInterval(async () => {
      const status = await getCodeGenerationById(result.data.id)
      if (status.status === 'completed') {
        clearInterval(checkStatus)
        toast.success('Code generated!')
      }
    }, 5000)
  }
  
  return <Button onClick={handleGenerate}>Generate Code</Button>
}
```

### Phase 6: Remove Old Code

After all pages are updated:

1. **Delete or deprecate:**
   - `lib/app-context.tsx` (if not used elsewhere)
   - `lib/storage.ts` (browser storage)
   - All static data arrays

2. **Keep:**
   - `lib/api-client.ts` ✅
   - Backend API routes ✅
   - AWS services ✅

### Phase 7: Testing Checklist

```bash
# Start backend
cd backend
npm run dev
npm run worker  # In separate terminal

# Start frontend
cd ..
npm run dev
```

Test each page:
- [ ] Dashboard loads data from DynamoDB
- [ ] Projects CRUD syncs to DynamoDB
- [ ] Architecture diagram uploads to S3
- [ ] Code generation queues to SQS
- [ ] Deployments queue to SQS
- [ ] Analytics shows real-time data
- [ ] Activity auto-refreshes
- [ ] Documentation attachments go to S3
- [ ] Team invitations send SNS
- [ ] Settings profile picture uploads to S3

## Quick Start Commands

```bash
# Install React Query
npm install @tanstack/react-query

# Create providers file
# Create hooks directory with custom hooks
# Update each page to use hooks
# Test with backend running
```

## Summary

**Before:** Static data, Context API, LocalStorage  
**After:** AWS DynamoDB, S3, SQS, SNS - Real-time, persistent, scalable

**All backend APIs are ready!** Just need to:
1. Add React Query
2. Create custom hooks
3. Update pages to use hooks instead of Context API
4. Everything automatically syncs with AWS

Would you like me to implement this step-by-step?
