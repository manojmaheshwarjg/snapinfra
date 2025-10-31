// MSW Browser Setup - Industry Standard
// Configures Mock Service Worker for client-side API mocking

import { setupWorker } from 'msw/browser'
import { createMSWHandlers } from './msw-handlers'

// Global worker instance
let worker: ReturnType<typeof setupWorker> | null = null

export function initializeMSW(schemas: any[], endpoints: any[]): ReturnType<typeof setupWorker> | null {
  if (typeof window === 'undefined') {
    console.warn('⚠️ MSW: Running on server, skipping initialization')
    return null
  }

  // Prevent re-initialization if already running
  if (worker) {
    console.log('⚠️ MSW: Already initialized, resetting handlers instead')
    resetMSWHandlers(schemas, endpoints)
    return worker
  }

  // Validate inputs
  if (!schemas || schemas.length === 0) {
    console.error('❌ MSW: No schemas provided, cannot initialize')
    return null
  }

  if (!endpoints || endpoints.length === 0) {
    console.error('❌ MSW: No endpoints provided, cannot initialize')
    return null
  }

  console.log('🚀 Initializing MSW with schemas from Step 1...')
  console.log('Schemas:', schemas.length)
  console.log('Endpoints:', endpoints.length)

  try {
    // Create handlers from schemas
    const handlers = createMSWHandlers(schemas, endpoints)

    if (handlers.length === 0) {
      console.error('❌ MSW: No handlers created, initialization failed')
      return null
    }

    // Setup worker
    worker = setupWorker(...handlers)

    // Start worker with proper error handling
    worker.start({
      onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
      quiet: false, // Show MSW logs
    }).then(() => {
      console.log('✅ MSW is ready! All API requests will be mocked.')
      console.log('📡 Intercepting:', endpoints.length, 'endpoints')
    }).catch((error) => {
      console.error('❌ MSW failed to start:', error)
      worker = null // Reset worker on failure
    })

    return worker
  } catch (error) {
    console.error('❌ MSW initialization error:', error)
    worker = null
    return null
  }
}

export function stopMSW() {
  if (worker) {
    worker.stop()
    console.log('🛑 MSW stopped')
  }
}

export function resetMSWHandlers(schemas: any[], endpoints: any[]) {
  if (worker) {
    const handlers = createMSWHandlers(schemas, endpoints)
    worker.use(...handlers)
    console.log('🔄 MSW handlers reset')
  }
}

export function getMSWWorker() {
  return worker
}
