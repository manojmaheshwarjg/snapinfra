// MSW Handlers Factory - Industry Standard Approach
// Generates request handlers based on schemas from Step 1

import { http, HttpResponse, HttpHandler } from 'msw'
import { initializeMockGenerator } from './schema-aware-mock'

interface FieldSchema {
  name: string
  type: string
  isPrimary?: boolean
  isRequired?: boolean
  isForeignKey?: boolean
  description?: string
}

interface TableSchema {
  name: string
  description?: string
  fields: FieldSchema[]
}

interface Endpoint {
  method: string
  path: string
  group: string
  params?: Record<string, string>
  body?: any
}

export function createMSWHandlers(schemas: TableSchema[], endpoints: Endpoint[]): HttpHandler[] {
  // Initialize the schema-aware mock generator
  const generator = initializeMockGenerator(schemas, endpoints)
  
  const handlers: HttpHandler[] = []

  console.log('🎯 Creating MSW handlers for', endpoints.length, 'endpoints')

  // Create handlers for each endpoint
  endpoints.forEach(endpoint => {
    const fullPath = `/api${endpoint.path}`
    
    switch (endpoint.method.toUpperCase()) {
      case 'GET':
        handlers.push(
          http.get(fullPath, ({ params }) => {
            // Extract resource name from path
            const pathParts = endpoint.path.split('/').filter(Boolean)
            const resourceName = pathParts[0]
            
            // Check if this is a single resource request (has ID)
            if (pathParts.length > 1 && pathParts[1].startsWith(':')) {
              // Single resource: /users/:id
              const idParam = pathParts[1].substring(1) // Remove ':'
              const id = (params as any)[idParam]
              
              const item = generator.getById(resourceName, id as string)
              
              if (item) {
                return HttpResponse.json(item)
              } else {
                return HttpResponse.json(
                  { error: 'Resource not found', id, resource: resourceName },
                  { status: 404 }
                )
              }
            } else {
              // List resources: /users
              const items = generator.getAll(resourceName)
              
              return HttpResponse.json({
                data: items,
                total: items.length,
                page: 1,
                limit: 10,
                message: 'Schema-aware mock data (MSW + Step 1 schemas)'
              })
            }
          })
        )
        break

      case 'POST':
        handlers.push(
          http.post(fullPath, async ({ request }) => {
            const pathParts = endpoint.path.split('/').filter(Boolean)
            const resourceName = pathParts[0]
            
            let body: any = {}
            try {
              body = await request.json()
            } catch {
              body = {}
            }
            
            const newItem = generator.create(resourceName, body)
            
            return HttpResponse.json(
              {
                ...newItem,
                message: 'Resource created successfully'
              },
              { status: 201 }
            )
          })
        )
        break

      case 'PUT':
        handlers.push(
          http.put(fullPath, async ({ request, params }) => {
            const pathParts = endpoint.path.split('/').filter(Boolean)
            const resourceName = pathParts[0]
            
            let body: any = {}
            try {
              body = await request.json()
            } catch {
              body = {}
            }
            
            if (pathParts.length > 1 && pathParts[1].startsWith(':')) {
              const idParam = pathParts[1].substring(1)
              const id = (params as any)[idParam]
              
              const updated = generator.update(resourceName, id as string, body)
              
              if (updated) {
                return HttpResponse.json(updated)
              } else {
                return HttpResponse.json(
                  { error: 'Resource not found' },
                  { status: 404 }
                )
              }
            }
            
            return HttpResponse.json({ error: 'Invalid request' }, { status: 400 })
          })
        )
        break

      case 'PATCH':
        handlers.push(
          http.patch(fullPath, async ({ request, params }) => {
            const pathParts = endpoint.path.split('/').filter(Boolean)
            const resourceName = pathParts[0]
            
            let body: any = {}
            try {
              body = await request.json()
            } catch {
              body = {}
            }
            
            if (pathParts.length > 1 && pathParts[1].startsWith(':')) {
              const idParam = pathParts[1].substring(1)
              const id = (params as any)[idParam]
              
              const updated = generator.update(resourceName, id as string, body)
              
              if (updated) {
                return HttpResponse.json(updated)
              } else {
                return HttpResponse.json(
                  { error: 'Resource not found' },
                  { status: 404 }
                )
              }
            }
            
            return HttpResponse.json({ error: 'Invalid request' }, { status: 400 })
          })
        )
        break

      case 'DELETE':
        handlers.push(
          http.delete(fullPath, ({ params }) => {
            const pathParts = endpoint.path.split('/').filter(Boolean)
            const resourceName = pathParts[0]
            
            if (pathParts.length > 1 && pathParts[1].startsWith(':')) {
              const idParam = pathParts[1].substring(1)
              const id = (params as any)[idParam]
              
              const deleted = generator.delete(resourceName, id as string)
              
              if (deleted) {
                return HttpResponse.json({
                  message: 'Resource deleted successfully',
                  id
                })
              } else {
                return HttpResponse.json(
                  { error: 'Resource not found' },
                  { status: 404 }
                )
              }
            }
            
            return HttpResponse.json({ error: 'Invalid request' }, { status: 400 })
          })
        )
        break
    }
  })

  // Add special auth endpoints
  handlers.push(
    http.post('/api/auth/login', async ({ request }) => {
      let body: any = {}
      try {
        body = await request.json()
      } catch {}
      
      return HttpResponse.json({
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          email: body.email || 'demo@example.com',
          name: 'Demo User',
          username: 'demo_user'
        },
        expiresIn: 3600,
        message: 'Login successful (MSW)'
      })
    }),

    http.post('/api/auth/register', async ({ request }) => {
      let body: any = {}
      try {
        body = await request.json()
      } catch {}
      
      return HttpResponse.json({
        id: Date.now().toString(),
        email: body.email || 'newuser@example.com',
        name: body.name || 'New User',
        username: body.username || `user${Date.now()}`,
        createdAt: new Date().toISOString()
      }, { status: 201 })
    }),

    http.get('/api/auth/me', () => {
      return HttpResponse.json({
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        username: 'demo_user',
        createdAt: new Date().toISOString()
      })
    })
  )

  console.log('✅ Created', handlers.length, 'MSW handlers')

  return handlers
}
