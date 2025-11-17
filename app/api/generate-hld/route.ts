// app/api/generate-hld/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateArchitectureFromData } from '@/lib/utils/architecture-new'
import { DatabaseSchemaToArchitecture, ApiEndpointsToArchitecture } from '@/lib/types/architecture'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const { schemas, endpoints, projectName, description, analysis } = body

    // Validate required fields
    if (!schemas || !endpoints || !projectName) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: schemas, endpoints, or projectName' 
        },
        { status: 400 }
      )
    }

    console.log('🏗️ Generating HLD for project:', projectName)
    console.log('  Schemas:', schemas?.length || 0)
    console.log('  API Groups:', endpoints?.length || 0)

    // Prepare data for architecture generation
    const schemaData: DatabaseSchemaToArchitecture = {
      schemas: schemas || [],
      analysis: analysis || {}
    }

    const apiData: ApiEndpointsToArchitecture = {
      endpoints: endpoints || [],
      groups: [...new Set((endpoints || []).map((group: any) => group.group))]
    }

    // Generate the architecture
    const architecture = await generateArchitectureFromData(
      schemaData,
      apiData,
      projectName
    )

    console.log('✅ HLD generated successfully')
    console.log('  Components:', architecture.nodes.length)
    console.log('  Connections:', architecture.edges.length)

    return NextResponse.json({
      success: true,
      architecture,
      metadata: {
        generatedAt: new Date().toISOString(),
        componentsCount: architecture.nodes.length,
        connectionsCount: architecture.edges.length,
        complexity: architecture.metadata?.complexity || 'Moderate'
      }
    })

  } catch (error: any) {
    console.error('❌ HLD generation error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate high-level design',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

// Optional: Add GET method for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/generate-hld',
    method: 'POST',
    requiredFields: ['schemas', 'endpoints', 'projectName']
  })
}