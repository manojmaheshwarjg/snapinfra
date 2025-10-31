import { NextRequest, NextResponse } from 'next/server'

// In-memory database that gets dynamically populated
const mockDatabase: Record<string, any[]> = {}

// Helper to generate realistic mock data based on field type
function generateMockValue(fieldType: string, fieldName: string): any {
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
  
  // URL/Link fields
  if (lowerFieldName.includes('url') || lowerFieldName.includes('link') || lowerFieldName.includes('website')) {
    return `https://example.com/${Math.random().toString(36).substring(7)}`
  }
  
  // Image fields
  if (lowerFieldName.includes('image') || lowerFieldName.includes('photo') || lowerFieldName.includes('avatar') || lowerFieldName.includes('picture')) {
    return `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/400/300`
  }
  
  // Phone fields
  if (lowerFieldName.includes('phone')) {
    return `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
  }
  
  // Address fields
  if (lowerFieldName.includes('address')) {
    return `${Math.floor(Math.random() * 9999) + 1} Main Street, City, State 12345`
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
  
  // Type-based generation
  switch (fieldType.toLowerCase()) {
    case 'string':
    case 'text':
    case 'varchar':
      return `Sample ${fieldName}`
    
    case 'number':
    case 'integer':
    case 'int':
      return Math.floor(Math.random() * 1000)
    
    case 'float':
    case 'decimal':
    case 'double':
      return (Math.random() * 1000).toFixed(2)
    
    case 'boolean':
    case 'bool':
      return Math.random() > 0.5
    
    case 'date':
    case 'datetime':
    case 'timestamp':
      return new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    
    case 'json':
    case 'object':
      return { data: 'sample' }
    
    case 'array':
      return ['item1', 'item2', 'item3']
    
    default:
      return `Mock ${fieldName}`
  }
}

// Initialize mock data for a resource based on schema
function initializeMockData(resourceName: string, schema?: any, count: number = 5): any[] {
  if (mockDatabase[resourceName]) {
    return mockDatabase[resourceName]
  }
  
  const items: any[] = []
  
  for (let i = 0; i < count; i++) {
    const item: any = {
      id: (i + 1).toString(),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
    
    // If schema is provided, use it to generate fields
    if (schema?.fields) {
      schema.fields.forEach((field: any) => {
        if (field.name !== 'id' && !field.name.toLowerCase().includes('createdat')) {
          item[field.name] = generateMockValue(field.type, field.name)
        }
      })
    } else {
      // Fallback: generate common fields based on resource name
      const resourceLower = resourceName.toLowerCase()
      
      if (resourceLower.includes('user')) {
        item.email = generateMockValue('string', 'email')
        item.name = generateMockValue('string', 'name')
        item.username = generateMockValue('string', 'username')
      } else if (resourceLower.includes('post')) {
        item.title = generateMockValue('string', 'title')
        item.content = generateMockValue('text', 'content')
        item.userId = Math.floor(Math.random() * 5 + 1).toString()
      } else if (resourceLower.includes('comment')) {
        item.content = generateMockValue('text', 'content')
        item.userId = Math.floor(Math.random() * 5 + 1).toString()
        item.postId = Math.floor(Math.random() * 10 + 1).toString()
      } else {
        // Generic resource
        item.name = generateMockValue('string', 'name')
        item.description = generateMockValue('text', 'description')
      }
    }
    
    items.push(item)
  }
  
  mockDatabase[resourceName] = items
  return items
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  const path = resolvedParams.path.join('/')
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Auth endpoints
  if (path === 'auth/me') {
    return NextResponse.json({
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      username: 'demo_user',
      createdAt: new Date().toISOString()
    })
  }
  
  // List endpoints - match pattern like "users", "posts", etc.
  const resource = path.split('/')[0]
  
  // Initialize data if not exists (lazy loading)
  if (!mockDatabase[resource]) {
    initializeMockData(resource, undefined, 5)
  }
  
  if (mockDatabase[resource]) {
    return NextResponse.json({
      data: mockDatabase[resource],
      total: mockDatabase[resource].length,
      page: 1,
      limit: 10,
      message: 'Mock data generated dynamically based on your schema'
    })
  }
  
  // Single resource endpoints - match pattern like "users/1"
  const match = path.match(/^([^/]+)\/([^/]+)$/)
  if (match) {
    const [, resourceName, id] = match
    
    // Initialize if needed
    if (!mockDatabase[resourceName]) {
      initializeMockData(resourceName, undefined, 5)
    }
    
    const item = mockDatabase[resourceName]?.find(item => item.id === id)
    
    if (item) {
      return NextResponse.json(item)
    }
    
    // If not found, return 404
    return NextResponse.json(
      { error: 'Resource not found', id, resource: resourceName },
      { status: 404 }
    )
  }
  
  // Default response for unmatched patterns
  return NextResponse.json({
    message: 'Mock API endpoint',
    path: `/${path}`,
    method: 'GET',
    timestamp: new Date().toISOString(),
    note: 'This is a dynamically generated mock response for testing'
  })
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  const path = resolvedParams.path.join('/')
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 400))
  
  let body
  try {
    body = await request.json()
  } catch {
    body = {}
  }
  
  // Auth login
  if (path === 'auth/login') {
    return NextResponse.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: '1',
        email: body.email || 'demo@example.com',
        name: 'Demo User',
        username: 'demo_user'
      },
      expiresIn: 3600,
      message: 'Login successful'
    })
  }
  
  // Auth register
  if (path === 'auth/register') {
    const newUser = {
      id: Date.now().toString(),
      email: body.email || 'newuser@example.com',
      name: body.name || 'New User',
      username: body.username || `user${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    
    // Add to users database
    if (!mockDatabase.users) {
      initializeMockData('users', undefined, 3)
    }
    mockDatabase.users.push(newUser)
    
    return NextResponse.json(newUser, { status: 201 })
  }
  
  // Create resource
  const resource = path.split('/')[0]
  
  // Initialize if doesn't exist
  if (!mockDatabase[resource]) {
    initializeMockData(resource, undefined, 3)
  }
  
  if (mockDatabase[resource] !== undefined) {
    const newItem = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString()
    }
    mockDatabase[resource].push(newItem)
    
    return NextResponse.json({
      ...newItem,
      message: 'Resource created successfully'
    }, { status: 201 })
  }
  
  // Default POST response for unknown resources
  return NextResponse.json({
    id: Date.now().toString(),
    ...body,
    createdAt: new Date().toISOString(),
    message: 'Mock resource created dynamically'
  }, { status: 201 })
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  const path = resolvedParams.path.join('/')
  
  await new Promise(resolve => setTimeout(resolve, 350))
  
  let body
  try {
    body = await request.json()
  } catch {
    body = {}
  }
  
  // Update resource - match pattern like "users/1"
  const match = path.match(/^([^/]+)\/([^/]+)$/)
  if (match) {
    const [, resourceName, id] = match
    const index = mockDatabase[resourceName]?.findIndex(item => item.id === id)
    
    if (index !== undefined && index !== -1) {
      mockDatabase[resourceName][index] = {
        ...mockDatabase[resourceName][index],
        ...body,
        updatedAt: new Date().toISOString()
      }
      
      return NextResponse.json(mockDatabase[resourceName][index])
    }
  }
  
  // Default PUT response
  return NextResponse.json({
    ...body,
    updatedAt: new Date().toISOString(),
    message: 'Mock resource updated'
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return PUT(request, { params })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params
  const path = resolvedParams.path.join('/')
  
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Delete resource - match pattern like "users/1"
  const match = path.match(/^([^/]+)\/([^/]+)$/)
  if (match) {
    const [, resourceName, id] = match
    const index = mockDatabase[resourceName]?.findIndex(item => item.id === id)
    
    if (index !== undefined && index !== -1) {
      mockDatabase[resourceName].splice(index, 1)
      return NextResponse.json({ 
        message: 'Resource deleted successfully',
        id 
      })
    }
  }
  
  // Default DELETE response
  return NextResponse.json({
    message: 'Mock resource deleted',
    timestamp: new Date().toISOString()
  })
}
