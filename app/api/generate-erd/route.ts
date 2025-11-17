import { NextRequest, NextResponse } from 'next/server'
import { generateEnhancedERD } from '@/lib/utils/erd-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { schemas, projectName, description } = body

    if (!schemas || !projectName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: schemas or projectName' },
        { status: 400 }
      )
    }

    console.log('🗺️ Generating ERD for project:', projectName)
    console.log('  Schemas:', schemas?.length || 0)

    const erd = await generateEnhancedERD(schemas, projectName, description)

    console.log('✅ ERD generated successfully')
    console.log('  Tables (Nodes):', erd.nodes.length)
    console.log('  Relationships (Edges):', erd.edges.length)

    return NextResponse.json({
      success: true,
      erd: {
        nodes: erd.nodes,
        edges: erd.edges,
        metadata: erd.metadata,
        aiInsights: (erd as any).aiInsights
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        totalTables: erd.nodes.length,
        totalRelationships: erd.edges.length,
        totalFields: erd.metadata.totalFields
      }
    })

  } catch (error: any) {
    console.error('❌ ERD generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate ERD',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/generate-erd',
    method: 'POST',
    requiredFields: ['schemas', 'projectName'],
    description: 'Generates Entity Relationship Diagram from database schemas',
    responseFormat: {
      nodes: 'Array of table nodes for ReactFlow',
      edges: 'Array of relationship edges for ReactFlow',
      metadata: 'Diagram statistics'
    }
  })
}
