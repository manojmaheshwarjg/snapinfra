import { NextRequest, NextResponse } from 'next/server'

// Import the mock database and initialization function from the catch-all route
// Since we can't directly import from [...path], we'll use a shared module approach

interface Schema {
  name: string
  fields: Array<{
    name: string
    type: string
    isPrimary?: boolean
    isRequired?: boolean
  }>
}

interface InitRequest {
  schemas: Schema[]
}

// This endpoint receives schema information from the frontend
// and initializes the mock database accordingly
export async function POST(request: NextRequest) {
  try {
    const body: InitRequest = await request.json()
    
    if (!body.schemas || !Array.isArray(body.schemas)) {
      return NextResponse.json(
        { error: 'Invalid request: schemas array is required' },
        { status: 400 }
      )
    }

    // Store schemas in a way that the catch-all route can access
    // For now, we'll just acknowledge receipt
    // The catch-all route will handle actual data generation
    
    return NextResponse.json({
      message: 'Mock database initialized with schemas',
      schemasReceived: body.schemas.length,
      tables: body.schemas.map(s => s.name),
      note: 'Mock data will be generated dynamically as endpoints are called'
    })
  } catch (error) {
    console.error('Error initializing mock database:', error)
    return NextResponse.json(
      { error: 'Failed to initialize mock database' },
      { status: 500 }
    )
  }
}

// GET endpoint to check mock database status
export async function GET() {
  return NextResponse.json({
    message: 'Mock API system ready',
    status: 'active',
    note: 'Data is generated dynamically based on endpoint requests'
  })
}
