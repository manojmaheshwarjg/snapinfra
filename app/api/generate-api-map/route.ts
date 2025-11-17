import { NextRequest, NextResponse } from 'next/server'
import { generateEnhancedAPIMap } from '@/lib/utils/api-map-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { endpoints, projectName, schemas } = body

    if (!endpoints || !projectName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: endpoints or projectName' },
        { status: 400 }
      )
    }

    console.log('🗺️ Generating API Map for project:', projectName)
    console.log('  Endpoint Groups:', endpoints?.length || 0)

    const apiMap = await generateEnhancedAPIMap(endpoints, projectName, schemas)

    console.log('✅ API Map generated successfully')
    console.log('  Groups:', apiMap.groups.length)
    console.log('  Total Endpoints:', apiMap.metadata.totalEndpoints)

    return NextResponse.json({
      success: true,
      apiMap,
      metadata: {
        generatedAt: new Date().toISOString(),
        totalEndpoints: apiMap.metadata.totalEndpoints,
        totalGroups: apiMap.metadata.totalGroups,
        authEndpoints: apiMap.metadata.authEndpoints,
        publicEndpoints: apiMap.metadata.publicEndpoints
      }
    })

  } catch (error: any) {
    console.error('❌ API Map generation error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to generate API Map',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: '/api/generate-api-map',
    method: 'POST',
    requiredFields: ['endpoints', 'projectName'],
    description: 'Generates API Endpoints Map with routes, methods, and authentication'
  })
}