import { ApiError } from './api-client'

// Circuit breaker implementation
class CircuitBreaker {
  private failureCount = 0
  private successCount = 0
  private lastFailureTime: number | null = null
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED'
  
  private readonly threshold = 5 // Open circuit after 5 failures
  private readonly timeout = 60000 // Try again after 60 seconds
  private readonly successThreshold = 2 // Close circuit after 2 successes

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.lastFailureTime && Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN'
        this.successCount = 0
      } else {
        throw new ApiError('Service temporarily unavailable (Circuit Open)', 503)
      }
    }

    try {
      const result = await fn()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess() {
    this.failureCount = 0
    
    if (this.state === 'HALF_OPEN') {
      this.successCount++
      if (this.successCount >= this.successThreshold) {
        this.state = 'CLOSED'
        this.successCount = 0
      }
    }
  }

  private onFailure() {
    this.failureCount++
    this.lastFailureTime = Date.now()
    
    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN'
    }
  }

  getState() {
    return this.state
  }
}

// Request timeout handler
function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new ApiError('Request timeout', 408)), timeoutMs)
    ),
  ])
}

// Rate limiter
class RateLimiter {
  private requests: number[] = []
  private readonly maxRequests = 100 // Max 100 requests
  private readonly windowMs = 60000 // Per 60 seconds

  canMakeRequest(): boolean {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    
    if (this.requests.length >= this.maxRequests) {
      return false
    }
    
    this.requests.push(now)
    return true
  }

  getRemainingRequests(): number {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.windowMs)
    return this.maxRequests - this.requests.length
  }
}

// Request queue for handling concurrent requests
class RequestQueue {
  private queue: Array<() => Promise<any>> = []
  private processing = 0
  private readonly maxConcurrent = 10

  async add<T>(fn: () => Promise<T>): Promise<T> {
    if (this.processing >= this.maxConcurrent) {
      await new Promise(resolve => {
        this.queue.push(resolve as any)
      })
    }

    this.processing++
    try {
      return await fn()
    } finally {
      this.processing--
      const next = this.queue.shift()
      if (next) next()
    }
  }
}

// Global instances
const circuitBreaker = new CircuitBreaker()
const rateLimiter = new RateLimiter()
const requestQueue = new RequestQueue()

// Enhanced API request with all enterprise features
export async function enterpriseApiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  config?: {
    timeout?: number
    skipCircuitBreaker?: boolean
    skipRateLimit?: boolean
    skipQueue?: boolean
  }
): Promise<T> {
  const {
    timeout = 30000,
    skipCircuitBreaker = false,
    skipRateLimit = false,
    skipQueue = false,
  } = config || {}

  // Rate limiting
  if (!skipRateLimit && !rateLimiter.canMakeRequest()) {
    throw new ApiError(
      `Rate limit exceeded. ${rateLimiter.getRemainingRequests()} requests remaining.`,
      429
    )
  }

  // Request execution function
  const executeRequest = async () => {
    const { apiRequest } = await import('./api-client')
    
    // Wrap in timeout
    return withTimeout(
      apiRequest<T>(endpoint, options),
      timeout
    )
  }

  // Execute with circuit breaker
  const execute = skipCircuitBreaker
    ? executeRequest
    : () => circuitBreaker.execute(executeRequest)

  // Execute with queue
  if (skipQueue) {
    return execute()
  }

  return requestQueue.add(execute)
}

// Health check utility
export async function checkBackendHealth(): Promise<{
  healthy: boolean
  latency: number
  services: {
    dynamodb: boolean
    s3: boolean
    sqs: boolean
    sns: boolean
  }
}> {
  const start = Date.now()
  
  try {
    const { checkHealth } = await import('./api-client')
    const health = await withTimeout(checkHealth(), 5000)
    
    return {
      healthy: health.status === 'healthy',
      latency: Date.now() - start,
      services: {
        dynamodb: health.services?.dynamodb?.status === 'healthy',
        s3: health.services?.s3?.status === 'healthy',
        sqs: true, // SQS doesn't have health check
        sns: true, // SNS doesn't have health check
      }
    }
  } catch (error) {
    return {
      healthy: false,
      latency: Date.now() - start,
      services: {
        dynamodb: false,
        s3: false,
        sqs: false,
        sns: false,
      }
    }
  }
}

// Retry with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  baseDelay = 1000
): Promise<T> {
  let lastError: Error | null = null
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      
      // Don't retry on client errors
      if (error instanceof ApiError && error.statusCode >= 400 && error.statusCode < 500) {
        throw error
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}

// Batch requests to reduce API calls
export class RequestBatcher {
  private batches = new Map<string, {
    requests: Array<{ resolve: Function; reject: Function }>,
    timer: NodeJS.Timeout
  }>()
  
  private readonly batchDelay = 50 // 50ms batch window

  async add<T>(key: string, fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      let batch = this.batches.get(key)
      
      if (!batch) {
        batch = {
          requests: [],
          timer: setTimeout(() => this.executeBatch(key, fn), this.batchDelay)
        }
        this.batches.set(key, batch)
      }
      
      batch.requests.push({ resolve, reject })
    })
  }

  private async executeBatch(key: string, fn: () => Promise<any>) {
    const batch = this.batches.get(key)
    if (!batch) return
    
    this.batches.delete(key)
    
    try {
      const result = await fn()
      batch.requests.forEach(req => req.resolve(result))
    } catch (error) {
      batch.requests.forEach(req => req.reject(error))
    }
  }
}

export const requestBatcher = new RequestBatcher()

// Export circuit breaker state for monitoring
export function getCircuitBreakerState() {
  return circuitBreaker.getState()
}

// Export rate limiter stats
export function getRateLimiterStats() {
  return {
    remaining: rateLimiter.getRemainingRequests(),
    max: 100,
  }
}
