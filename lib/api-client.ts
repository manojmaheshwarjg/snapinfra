/**
 * API Client for snapinfra Backend
 * Handles all communication with the Express backend (AWS DynamoDB)
 */

import type { Project, DatabaseSchema, User } from './app-context'

// Get backend URL from environment variable or default to localhost
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'

// Helper to get user ID for dev authentication
const getDevUserId = (): string => {
  // In development, use a consistent user ID
  // In production, this would come from Clerk or your auth provider
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

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BACKEND_URL}${endpoint}`
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    'x-dev-user-id': getDevUserId(), // Dev authentication
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new ApiError(
          `HTTP ${response.status}: ${response.statusText}`,
          response.status
        )
      }
      return {} as T
    }

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.error || data.message || 'Request failed',
        response.status,
        data.details
      )
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    // Network or other errors
    if (error instanceof Error) {
      throw new ApiError(
        `Network error: ${error.message}`,
        0,
        { originalError: error.message }
      )
    }
    
    throw new ApiError('Unknown error occurred', 0)
  }
}

// ============================================================================
// PROJECT API METHODS
// ============================================================================

export interface CreateProjectPayload {
  name: string
  description?: string
  schema: {
    name: string
    tables: any[]
    relationships?: any[]
  }
}

export interface UpdateProjectPayload {
  name?: string
  description?: string
  status?: 'draft' | 'building' | 'deployed' | 'error'
  schema?: any
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
  timestamp: string
}

/**
 * Create a new project in the backend
 */
export async function createProject(
  payload: CreateProjectPayload
): Promise<Project> {
  const response = await apiRequest<ApiResponse<Project>>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!response.success || !response.data) {
    throw new ApiError('Failed to create project', 500, response)
  }

  // Convert date strings to Date objects
  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt),
    updatedAt: new Date(response.data.updatedAt),
  }
}

/**
 * Get all projects for the current user
 */
export async function getProjects(
  limit?: number,
  search?: string
): Promise<Project[]> {
  const params = new URLSearchParams()
  if (limit) params.append('limit', limit.toString())
  if (search) params.append('search', search)

  const queryString = params.toString()
  const endpoint = `/api/projects${queryString ? `?${queryString}` : ''}`

  const response = await apiRequest<ApiResponse<Project[]>>(endpoint, {
    method: 'GET',
  })

  if (!response.success || !response.data) {
    throw new ApiError('Failed to fetch projects', 500, response)
  }

  // Convert date strings to Date objects
  return response.data.map(project => ({
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  }))
}

/**
 * Get a specific project by ID
 */
export async function getProjectById(projectId: string): Promise<Project> {
  const response = await apiRequest<ApiResponse<Project>>(
    `/api/projects/${projectId}`,
    {
      method: 'GET',
    }
  )

  if (!response.success || !response.data) {
    throw new ApiError('Failed to fetch project', 404, response)
  }

  // Convert date strings to Date objects
  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt),
    updatedAt: new Date(response.data.updatedAt),
  }
}

/**
 * Update an existing project
 */
export async function updateProject(
  projectId: string,
  updates: UpdateProjectPayload
): Promise<Project> {
  const response = await apiRequest<ApiResponse<Project>>(
    `/api/projects/${projectId}`,
    {
      method: 'PUT',
      body: JSON.stringify(updates),
    }
  )

  if (!response.success || !response.data) {
    throw new ApiError('Failed to update project', 500, response)
  }

  // Convert date strings to Date objects
  return {
    ...response.data,
    createdAt: new Date(response.data.createdAt),
    updatedAt: new Date(response.data.updatedAt),
  }
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<void> {
  const response = await apiRequest<ApiResponse<void>>(
    `/api/projects/${projectId}`,
    {
      method: 'DELETE',
    }
  )

  if (!response.success) {
    throw new ApiError('Failed to delete project', 500, response)
  }
}

/**
 * Batch get multiple projects by IDs
 */
export async function batchGetProjects(
  projectIds: string[]
): Promise<Project[]> {
  const response = await apiRequest<ApiResponse<Project[]>>(
    '/api/projects/batch',
    {
      method: 'POST',
      body: JSON.stringify({ projectIds }),
    }
  )

  if (!response.success || !response.data) {
    throw new ApiError('Failed to fetch projects', 500, response)
  }

  // Convert date strings to Date objects
  return response.data.map(project => ({
    ...project,
    createdAt: new Date(project.createdAt),
    updatedAt: new Date(project.updatedAt),
  }))
}

// ============================================================================
// HEALTH CHECK
// ============================================================================

export interface HealthCheckResponse {
  status: string
  timestamp: string
  uptime: number
  environment: string
  services: {
    dynamodb: { status: string; latency?: number }
    s3: { status: string; latency?: number }
  }
}

/**
 * Check backend health status
 */
export async function checkHealth(): Promise<HealthCheckResponse> {
  try {
    const response = await apiRequest<HealthCheckResponse>('/api/health', {
      method: 'GET',
    })
    return response
  } catch (error) {
    throw new ApiError('Backend is not reachable', 0, error)
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if backend is available
 */
export async function isBackendAvailable(): Promise<boolean> {
  try {
    await checkHealth()
    return true
  } catch {
    return false
  }
}

/**
 * Get the current backend URL
 */
export function getBackendUrl(): string {
  return BACKEND_URL
}

/**
 * Get the current dev user ID
 */
export function getCurrentUserId(): string {
  return getDevUserId()
}
