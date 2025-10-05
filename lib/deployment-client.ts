/**
 * API Client for Deployment Management
 * Handles deployment creation, updates, and monitoring
 */

// Use the apiRequest helper from api-client
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'
  const url = `${BACKEND_URL}${endpoint}`
  
  const getDevUserId = (): string => {
    if (typeof window !== 'undefined') {
      let userId = localStorage.getItem('dev-user-id')
      if (!userId) {
        userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('dev-user-id', userId)
      }
      return userId
    }
    return 'anonymous'
  }
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'x-dev-user-id': getDevUserId(),
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  const response = await fetch(url, config)
  const contentType = response.headers.get('content-type')
  
  if (!contentType || !contentType.includes('application/json')) {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return {} as T
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed')
  }

  return data
}

export interface Deployment {
  id: string
  projectId: string
  userId: string
  platform: 'vercel' | 'railway' | 'render' | 'heroku' | 'aws_ecs'
  status: 'pending' | 'building' | 'deploying' | 'success' | 'failed'
  url?: string
  logs: DeploymentLog[]
  config: DeploymentConfig
  createdAt: Date
  updatedAt: Date
}

export interface DeploymentLog {
  id: string
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
  metadata?: Record<string, any>
}

export interface DeploymentConfig {
  environmentVariables: Record<string, string>
  buildCommand?: string
  startCommand?: string
  nodeVersion?: string
  region?: string
}

export interface CreateDeploymentPayload {
  projectId: string
  platform: Deployment['platform']
  config: DeploymentConfig
}

export interface UpdateDeploymentPayload {
  projectId: string  // Required for composite key
  status?: Deployment['status']
  url?: string
  logs?: DeploymentLog[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

/**
 * Create a new deployment
 */
export async function createDeployment(
  payload: CreateDeploymentPayload
): Promise<Deployment> {
  const response = await apiRequest<ApiResponse<Deployment>>('/api/deployments', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to create deployment')
  }

  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt),
    updatedAt: new Date(response.data.updatedAt),
  }
}

/**
 * Get all deployments for a project
 */
export async function getProjectDeployments(
  projectId: string
): Promise<Deployment[]> {
  const response = await apiRequest<ApiResponse<Deployment[]>>(
    `/api/deployments/project/${projectId}`,
    {
      method: 'GET',
    }
  )

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch deployments')
  }

  return response.data.map(deployment => ({
    ...deployment,
    createdAt: new Date(deployment.createdAt),
    updatedAt: new Date(deployment.updatedAt),
  }))
}

/**
 * Update a deployment
 */
export async function updateDeployment(
  deploymentId: string,
  updates: UpdateDeploymentPayload
): Promise<Deployment> {
  const response = await apiRequest<ApiResponse<Deployment>>(
    `/api/deployments/${deploymentId}`,
    {
      method: 'PUT',
      body: JSON.stringify(updates),
    }
  )

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to update deployment')
  }

  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt),
    updatedAt: new Date(response.data.updatedAt),
  }
}

/**
 * Get deployment status
 */
export async function getDeploymentStatus(
  deploymentId: string,
  projectId: string
): Promise<{
  id: string
  status: Deployment['status']
  url?: string
  updatedAt: string
}> {
  const response = await apiRequest<ApiResponse<any>>(
    `/api/deployments/${deploymentId}/status?projectId=${projectId}`,
    {
      method: 'GET',
    }
  )

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch deployment status')
  }

  return response.data
}

/**
 * Get deployment logs
 */
export async function getDeploymentLogs(
  deploymentId: string,
  projectId: string
): Promise<DeploymentLog[]> {
  const response = await apiRequest<ApiResponse<DeploymentLog[]>>(
    `/api/deployments/${deploymentId}/logs?projectId=${projectId}`,
    {
      method: 'GET',
    }
  )

  if (!response.success || !response.data) {
    throw new Error(response.error || 'Failed to fetch deployment logs')
  }

  return response.data
}

/**
 * Poll deployment status until complete
 */
export async function pollDeploymentStatus(
  deploymentId: string,
  projectId: string,
  onUpdate?: (status: Deployment['status']) => void,
  intervalMs: number = 5000
): Promise<Deployment['status']> {
  return new Promise((resolve, reject) => {
    const poll = async () => {
      try {
        const { status } = await getDeploymentStatus(deploymentId, projectId)
        
        if (onUpdate) {
          onUpdate(status)
        }

        // Check if deployment is complete
        if (status === 'success' || status === 'failed') {
          resolve(status)
          return
        }

        // Continue polling
        setTimeout(poll, intervalMs)
      } catch (error) {
        reject(error)
      }
    }

    poll()
  })
}
