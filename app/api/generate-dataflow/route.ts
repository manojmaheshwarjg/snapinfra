import { NextRequest, NextResponse } from 'next/server'
import { generateEnhancedDataFlow } from '@/lib/utils/dataflow-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { schemas, endpoints, projectName } = body

    if (!schemas || !endpoints || !projectName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: schemas, endpoints, or projectName' },
        { status: 400 }
      )
    }

    console.log('🗺️ Generating Data Flow Diagram for project:', projectName)
    console.log('  Schemas:', schemas?.length || 0)
    console.log('  Endpoint Groups:', endpoints?.length || 0)

    const dataFlow = await generateEnhancedDataFlow(schemas, endpoints, projectName)

    console.log('✅ Data Flow Diagram generated successfully')
    console.log('  Nodes:', dataFlow.nodes.length)
    console.log('  Flows:', dataFlow.edges.length)

    return NextResponse.json({
      success: true,
      dataFlow,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalNodes: dataFlow.metadata.totalNodes,
        totalFlows: dataFlow.metadata.totalFlows,
        encryptedFlows: dataFlow.metadata.encryptedFlows
      }
    })

  } catch (error: any) {
    console.error('❌ Data Flow generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate Data Flow Diagram',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/generate-dataflow',
    method: 'POST',
    requiredFields: ['schemas', 'endpoints', 'projectName'],
    description: 'Generates Data Flow Diagram showing how data moves through the system'
  })
}