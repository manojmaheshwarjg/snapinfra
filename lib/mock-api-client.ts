// Client-side mock API for serverless deployment
// This runs entirely in the browser, no server needed
// Now with SCHEMA-AWARE data generation!

import { getMockGenerator, initializeMockGenerator, SchemaAwareMockGenerator } from './schema-aware-mock'

interface MockDatabase {
  [key: string]: any[]
}

class ClientMockAPI {
  private database: MockDatabase = {}
  private initialized = false
  private mockGenerator: SchemaAwareMockGenerator | null = null

  // Initialize with schemas from Step 1
  initializeWithSchemas(schemas: any[], endpoints: any[]) {
    this.mockGenerator = initializeMockGenerator(schemas, endpoints)
    this.initialized = true
    console.log('✅ Mock API initialized with', schemas.length, 'schemas')
  }

  // Generate mock data (same logic as server)
  private generateMockValue(fieldType: string, fieldName: string): any {
    const lowerFieldName = fieldName.toLowerCase()
    
    // Email fields
    if (lowerFieldName.includes('email')) {
      return `user${Math.floor(Math.random() * 1000)}@example.com`
    }
    
    // Name fields
    if (lowerFieldName.includes('name') || lowerFieldName === 'title') {
      const names = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Emma Davis']
      const titles = ['Getting Started', 'Advanced Tips', 'Best Practices', 'Quick Guide', 'Tutorial']
      return lowerFieldName === 'title' ? titles[Math.floor(Math.random() * titles.length)] : names[Math.floor(Math.random() * names.length)]
    }
    
    // Username fields
    if (lowerFieldName.includes('username')) {
      return `user${Math.floor(Math.random() * 10000)}`
    }
    
    // Content/description fields
    if (lowerFieldName.includes('content') || lowerFieldName.includes('description') || lowerFieldName.includes('bio')) {
      const content = [
        'This is a sample content for testing purposes.',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'A great example of dynamic content generation.',
        'Testing the API with realistic mock data.',
        'Explore the possibilities with our platform.'
      ]
      return content[Math.floor(Math.random() * content.length)]
    }
    
    // Image fields
    if (lowerFieldName.includes('image') || lowerFieldName.includes('photo') || lowerFieldName.includes('avatar')) {
      return `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/400/300`
    }
    
    // Phone fields
    if (lowerFieldName.includes('phone')) {
      return `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
    }
    
    // Price/amount fields
    if (lowerFieldName.includes('price') || lowerFieldName.includes('amount') || lowerFieldName.includes('cost')) {
      return (Math.random() * 1000).toFixed(2)
    }
    
    // Status fields
    if (lowerFieldName.includes('status')) {
      const statuses = ['active', 'pending', 'completed', 'inactive', 'draft']
      return statuses[Math.floor(Math.random() * statuses.length)]
    }
    
    // Boolean fields
    if (lowerFieldName.includes('is') || lowerFieldName.includes('has') || lowerFieldName.includes('enabled')) {
      return Math.random() > 0.5
    }
    
    // Type-based fallback
    return `Sample ${fieldName}`
  }

  private initializeMockData(resourceName: string, count: number = 5): any[] {
    if (this.database[resourceName]) {
      return this.database[resourceName]
    }
    
    const items: any[] = []
    const resourceLower = resourceName.toLowerCase()
    
    for (let i = 0; i < count; i++) {
      const item: any = {
        id: (i + 1).toString(),
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      }
      
      if (resourceLower.includes('user')) {
        item.email = this.generateMockValue('string', 'email')
        item.name = this.generateMockValue('string', 'name')
        item.username = this.generateMockValue('string', 'username')
      } else if (resourceLower.includes('post')) {
        item.title = this.generateMockValue('string', 'title')
        item.content = this.generateMockValue('text', 'content')
        item.userId = Math.floor(Math.random() * 5 + 1).toString()
      } else if (resourceLower.includes('comment')) {
        item.content = this.generateMockValue('text', 'content')
        item.userId = Math.floor(Math.random() * 5 + 1).toString()
        item.postId = Math.floor(Math.random() * 10 + 1).toString()
      } else {
        item.name = this.generateMockValue('string', 'name')
        item.description = this.generateMockValue('text', 'description')
      }
      
      items.push(item)
    }
    
    this.database[resourceName] = items
    return items
  }

  async mockFetch(url: string, options: RequestInit = {}): Promise<Response> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200))
    
    const method = options.method || 'GET'
    const urlObj = new URL(url, window.location.origin)
    const path = urlObj.pathname.replace('/api/', '')
    
    let body: any = {}
    if (options.body) {
      try {
        body = JSON.parse(options.body as string)
      } catch {
        body = {}
      }
    }

    // Handle different endpoints
    let responseData: any
    let status = 200

    try {
      // Auth endpoints
      if (path === 'auth/login') {
        responseData = {
          token: 'mock-jwt-token-' + Date.now(),
          user: {
            id: '1',
            email: body.email || 'demo@example.com',
            name: 'Demo User',
            username: 'demo_user'
          },
          expiresIn: 3600,
          message: 'Login successful'
        }
      } else if (path === 'auth/register') {
        const newUser = {
          id: Date.now().toString(),
          email: body.email || 'newuser@example.com',
          name: body.name || 'New User',
          username: body.username || `user${Date.now()}`,
          createdAt: new Date().toISOString()
        }
        
        if (!this.database.users) {
          this.initializeMockData('users', 3)
        }
        this.database.users.push(newUser)
        
        responseData = newUser
        status = 201
      } else if (path === 'auth/me') {
        responseData = {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          username: 'demo_user',
          createdAt: new Date().toISOString()
        }
      } else if (method === 'GET') {
        // GET requests - use schema-aware generator if available
        const match = path.match(/^([^/]+)\/([^/]+)$/)
        
        if (match) {
          // Single resource: /users/1
          const [, resourceName, id] = match
          
          if (this.mockGenerator) {
            const item = this.mockGenerator.getById(resourceName, id)
            if (item) {
              responseData = item
            } else {
              responseData = { error: 'Resource not found', id, resource: resourceName }
              status = 404
            }
          } else {
            // Fallback
            if (!this.database[resourceName]) {
              this.initializeMockData(resourceName, 5)
            }
            const item = this.database[resourceName]?.find(item => item.id === id)
            responseData = item || { error: 'Resource not found', id, resource: resourceName }
            if (!item) status = 404
          }
        } else {
          // List resource: /users
          const resource = path.split('/')[0]
          
          if (this.mockGenerator) {
            const items = this.mockGenerator.getAll(resource)
            responseData = {
              data: items,
              total: items.length,
              page: 1,
              limit: 10,
              message: 'Schema-aware mock data (based on your Step 1 design)'
            }
          } else {
            // Fallback
            if (!this.database[resource]) {
              this.initializeMockData(resource, 5)
            }
            responseData = {
              data: this.database[resource] || [],
              total: (this.database[resource] || []).length,
              page: 1,
              limit: 10,
              message: 'Mock data generated dynamically (client-side)'
            }
          }
        }
      } else if (method === 'POST') {
        // Create resource - use schema-aware generator if available
        const resource = path.split('/')[0]
        
        if (this.mockGenerator) {
          const newItem = this.mockGenerator.create(resource, body)
          responseData = {
            ...newItem,
            message: 'Resource created successfully'
          }
        } else {
          // Fallback
          if (!this.database[resource]) {
            this.initializeMockData(resource, 3)
          }
          const newItem = {
            id: Date.now().toString(),
            ...body,
            createdAt: new Date().toISOString()
          }
          this.database[resource].push(newItem)
          responseData = {
            ...newItem,
            message: 'Resource created successfully'
          }
        }
        status = 201
      } else if (method === 'PUT' || method === 'PATCH') {
        // Update resource
        const match = path.match(/^([^/]+)\/([^/]+)$/)
        
        if (match) {
          const [, resourceName, id] = match
          
          if (!this.database[resourceName]) {
            this.initializeMockData(resourceName, 5)
          }
          
          const index = this.database[resourceName]?.findIndex(item => item.id === id)
          
          if (index !== undefined && index !== -1) {
            this.database[resourceName][index] = {
              ...this.database[resourceName][index],
              ...body,
              updatedAt: new Date().toISOString()
            }
            
            responseData = this.database[resourceName][index]
          } else {
            responseData = { error: 'Resource not found' }
            status = 404
          }
        }
      } else if (method === 'DELETE') {
        // Delete resource
        const match = path.match(/^([^/]+)\/([^/]+)$/)
        
        if (match) {
          const [, resourceName, id] = match
          
          if (!this.database[resourceName]) {
            this.initializeMockData(resourceName, 5)
          }
          
          const index = this.database[resourceName]?.findIndex(item => item.id === id)
          
          if (index !== undefined && index !== -1) {
            this.database[resourceName].splice(index, 1)
            responseData = {
              message: 'Resource deleted successfully',
              id
            }
          } else {
            responseData = { error: 'Resource not found' }
            status = 404
          }
        }
      }
    } catch (error) {
      responseData = {
        error: 'Mock API error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }
      status = 500
    }

    // Create mock Response object
    return new Response(JSON.stringify(responseData), {
      status,
      statusText: status === 200 ? 'OK' : status === 201 ? 'Created' : status === 404 ? 'Not Found' : 'Error',
      headers: {
        'Content-Type': 'application/json',
      }
    })
  }

  // Reset database (useful for testing)
  reset() {
    this.database = {}
  }

  // Get current database state
  getDatabase() {
    return { ...this.database }
  }
}

// Export singleton instance
export const clientMockAPI = new ClientMockAPI()

// Export wrapper that mimics fetch API
export async function mockFetch(url: string, options?: RequestInit): Promise<Response> {
  return clientMockAPI.mockFetch(url, options)
}

// Export for backwards compatibility
export default clientMockAPI
