// Schema-Aware Mock Data Generator
// Reads actual schemas from Step 1 and generates realistic data based on field types

interface FieldSchema {
  name: string
  type: string
  isPrimary?: boolean
  isRequired?: boolean
  isUnique?: boolean
  isForeignKey?: boolean
  description?: string
}

interface TableSchema {
  name: string
  description?: string
  fields: FieldSchema[]
  relationships?: any[]
}

interface GeneratedEndpoint {
  method: string
  path: string
  description: string
  params?: Record<string, string>
  body?: any
  group: string
}

export class SchemaAwareMockGenerator {
  private mockDatabase: Record<string, any[]> = {}
  private schemas: TableSchema[] = []
  private endpoints: GeneratedEndpoint[] = []

  constructor(schemas: TableSchema[] = [], endpoints: GeneratedEndpoint[] = []) {
    this.schemas = schemas
    this.endpoints = endpoints
  }

  // Generate mock value based on field schema
  private generateValueForField(field: FieldSchema): any {
    const fieldName = field.name.toLowerCase()
    const fieldType = field.type.toLowerCase()

    // Handle IDs
    if (field.isPrimary || fieldName === 'id') {
      return Date.now().toString() + Math.random().toString(36).substr(2, 5)
    }

    // Handle timestamps
    if (fieldName.includes('createdat') || fieldName.includes('updatedat') || fieldName.includes('timestamp')) {
      return new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }

    // Handle foreign keys
    if (field.isForeignKey || fieldName.endsWith('id')) {
      return Math.floor(Math.random() * 5 + 1).toString()
    }

    // Field name-based generation
    if (fieldName.includes('email')) {
      const domains = ['example.com', 'test.com', 'demo.com']
      return `user${Math.floor(Math.random() * 1000)}@${domains[Math.floor(Math.random() * domains.length)]}`
    }

    if (fieldName.includes('username')) {
      const prefixes = ['cool', 'super', 'awesome', 'pro', 'epic']
      return `${prefixes[Math.floor(Math.random() * prefixes.length)]}_user${Math.floor(Math.random() * 10000)}`
    }

    if (fieldName.includes('name')) {
      if (fieldName.includes('first')) {
        const names = ['Alice', 'Bob', 'Carol', 'David', 'Emma', 'Frank', 'Grace', 'Henry']
        return names[Math.floor(Math.random() * names.length)]
      }
      if (fieldName.includes('last')) {
        const names = ['Johnson', 'Smith', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore']
        return names[Math.floor(Math.random() * names.length)]
      }
      if (fieldName.includes('full')) {
        const first = ['Alice', 'Bob', 'Carol', 'David']
        const last = ['Johnson', 'Smith', 'Williams', 'Brown']
        return `${first[Math.floor(Math.random() * first.length)]} ${last[Math.floor(Math.random() * last.length)]}`
      }
      const names = ['Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Emma Davis']
      return names[Math.floor(Math.random() * names.length)]
    }

    if (fieldName.includes('title')) {
      const titles = ['Getting Started', 'Advanced Tips', 'Best Practices', 'Quick Guide', 'Tutorial', 'Introduction', 'Deep Dive']
      return titles[Math.floor(Math.random() * titles.length)]
    }

    if (fieldName.includes('description') || fieldName.includes('bio') || fieldName.includes('about')) {
      const descriptions = [
        'A passionate developer who loves to code and create amazing things.',
        'Experienced professional with a track record of delivering quality results.',
        'Creative thinker with innovative solutions to complex problems.',
        'Dedicated team player focused on achieving collective goals.',
        'Detail-oriented specialist committed to excellence.'
      ]
      return descriptions[Math.floor(Math.random() * descriptions.length)]
    }

    if (fieldName.includes('content') || fieldName.includes('body') || fieldName.includes('text')) {
      const content = [
        'This is a comprehensive guide to getting started with modern development practices. We will explore various concepts and techniques that are essential for building scalable applications.',
        'In this article, we dive deep into the fundamentals and advanced topics. Understanding these principles will help you become a more effective developer.',
        'Learn how to leverage the latest tools and technologies to streamline your workflow and increase productivity in your projects.',
        'Discover best practices and industry standards that professional developers use to build maintainable and efficient codebases.'
      ]
      return content[Math.floor(Math.random() * content.length)]
    }

    if (fieldName.includes('url') || fieldName.includes('link') || fieldName.includes('website')) {
      const domains = ['example.com', 'demo.com', 'test.com', 'sample.org']
      return `https://${domains[Math.floor(Math.random() * domains.length)]}/${Math.random().toString(36).substring(7)}`
    }

    if (fieldName.includes('image') || fieldName.includes('photo') || fieldName.includes('avatar') || fieldName.includes('picture')) {
      const seed = Math.random().toString(36).substring(7)
      return `https://picsum.photos/seed/${seed}/400/300`
    }

    if (fieldName.includes('phone')) {
      return `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
    }

    if (fieldName.includes('address')) {
      const streets = ['Main', 'Oak', 'Maple', 'Cedar', 'Pine', 'Elm']
      const cities = ['Springfield', 'Riverside', 'Greenville', 'Franklin', 'Clinton']
      return `${Math.floor(Math.random() * 9999) + 1} ${streets[Math.floor(Math.random() * streets.length)]} St, ${cities[Math.floor(Math.random() * cities.length)]}, CA 12345`
    }

    if (fieldName.includes('city')) {
      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia']
      return cities[Math.floor(Math.random() * cities.length)]
    }

    if (fieldName.includes('country')) {
      const countries = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France']
      return countries[Math.floor(Math.random() * countries.length)]
    }

    if (fieldName.includes('zipcode') || fieldName.includes('postal')) {
      return Math.floor(Math.random() * 90000) + 10000
    }

    if (fieldName.includes('price') || fieldName.includes('amount') || fieldName.includes('cost') || fieldName.includes('salary')) {
      return parseFloat((Math.random() * 1000).toFixed(2))
    }

    if (fieldName.includes('rating') || fieldName.includes('score')) {
      return parseFloat((Math.random() * 5).toFixed(1))
    }

    if (fieldName.includes('status')) {
      const statuses = ['active', 'pending', 'completed', 'inactive', 'draft', 'published']
      return statuses[Math.floor(Math.random() * statuses.length)]
    }

    if (fieldName.includes('category') || fieldName.includes('type')) {
      const categories = ['General', 'Technology', 'Business', 'Entertainment', 'Science', 'Health']
      return categories[Math.floor(Math.random() * categories.length)]
    }

    if (fieldName.includes('color')) {
      const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'black', 'white']
      return colors[Math.floor(Math.random() * colors.length)]
    }

    if (fieldName.includes('age')) {
      return Math.floor(Math.random() * 60) + 18
    }

    if (fieldName.includes('count') || fieldName.includes('quantity') || fieldName.includes('stock')) {
      return Math.floor(Math.random() * 100)
    }

    // Type-based generation
    switch (fieldType) {
      case 'string':
      case 'text':
      case 'varchar':
      case 'char':
        return `Sample ${field.name}`

      case 'integer':
      case 'int':
      case 'number':
      case 'bigint':
        return Math.floor(Math.random() * 1000)

      case 'float':
      case 'decimal':
      case 'double':
      case 'real':
        return parseFloat((Math.random() * 1000).toFixed(2))

      case 'boolean':
      case 'bool':
        return Math.random() > 0.5

      case 'date':
        return new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

      case 'datetime':
      case 'timestamp':
        return new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()

      case 'json':
      case 'jsonb':
      case 'object':
        return { data: 'sample', value: Math.random() }

      case 'array':
        return ['item1', 'item2', 'item3']

      case 'uuid':
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      default:
        return `Mock ${field.name}`
    }
  }

  // Initialize mock data for a table based on its schema
  initializeTable(tableName: string, count: number = 5): any[] {
    if (this.mockDatabase[tableName]) {
      return this.mockDatabase[tableName]
    }

    const schema = this.schemas.find(s => s.name.toLowerCase() === tableName.toLowerCase())
    const items: any[] = []

    for (let i = 0; i < count; i++) {
      const item: any = {}

      if (schema?.fields) {
        // Generate data based on actual schema fields
        schema.fields.forEach(field => {
          if (field.name.toLowerCase() === 'id' && field.isPrimary) {
            item[field.name] = (i + 1).toString()
          } else {
            item[field.name] = this.generateValueForField(field)
          }
        })
      } else {
        // Fallback if no schema found
        item.id = (i + 1).toString()
        item.createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        item.name = `Item ${i + 1}`
      }

      items.push(item)
    }

    this.mockDatabase[tableName] = items
    return items
  }

  // Get all data for a resource
  getAll(resourceName: string): any[] {
    if (!this.mockDatabase[resourceName]) {
      this.initializeTable(resourceName)
    }
    return this.mockDatabase[resourceName] || []
  }

  // Get single item by ID
  getById(resourceName: string, id: string): any | null {
    const items = this.getAll(resourceName)
    return items.find(item => item.id?.toString() === id) || null
  }

  // Create new item
  create(resourceName: string, data: any): any {
    const items = this.getAll(resourceName)
    const schema = this.schemas.find(s => s.name.toLowerCase() === resourceName.toLowerCase())

    const newItem: any = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString()
    }

    // Fill in missing fields from schema
    if (schema?.fields) {
      schema.fields.forEach(field => {
        if (!newItem[field.name] && !field.isPrimary) {
          newItem[field.name] = this.generateValueForField(field)
        }
      })
    }

    items.push(newItem)
    return newItem
  }

  // Update item
  update(resourceName: string, id: string, data: any): any | null {
    const items = this.getAll(resourceName)
    const index = items.findIndex(item => item.id?.toString() === id)

    if (index !== -1) {
      items[index] = {
        ...items[index],
        ...data,
        updatedAt: new Date().toISOString()
      }
      return items[index]
    }

    return null
  }

  // Delete item
  delete(resourceName: string, id: string): boolean {
    const items = this.getAll(resourceName)
    const index = items.findIndex(item => item.id?.toString() === id)

    if (index !== -1) {
      items.splice(index, 1)
      return true
    }

    return false
  }

  // Reset all data
  reset() {
    this.mockDatabase = {}
  }

  // Get current database state
  getDatabase() {
    return { ...this.mockDatabase }
  }

  // Get schemas
  getSchemas() {
    return this.schemas
  }

  // Get endpoints
  getEndpoints() {
    return this.endpoints
  }
}

// Singleton instance
let mockGeneratorInstance: SchemaAwareMockGenerator | null = null

export function initializeMockGenerator(schemas: TableSchema[], endpoints: GeneratedEndpoint[]) {
  mockGeneratorInstance = new SchemaAwareMockGenerator(schemas, endpoints)
  return mockGeneratorInstance
}

export function getMockGenerator(): SchemaAwareMockGenerator {
  if (!mockGeneratorInstance) {
    mockGeneratorInstance = new SchemaAwareMockGenerator()
  }
  return mockGeneratorInstance
}
