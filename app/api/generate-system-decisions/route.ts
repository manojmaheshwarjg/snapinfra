import { NextRequest, NextResponse } from 'next/server';
import { generateSystemDecisions, validateSystemDecisions } from '@/lib/ai/system-decisions-generator';
import type { GenerateSystemDecisionsRequest } from '@/lib/ai/system-decisions-generator';
import type { SystemDecisionsSummary } from '@/lib/types/system-decisions';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: GenerateSystemDecisionsRequest = await request.json();
    
    // Validate required fields
    if (!body.architecture) {
      return NextResponse.json({
        success: false,
        error: 'Architecture is required',
        projectName: '',
        decisions: [],
        architecture: {
          complexity: 'simple',
          components: 0,
          estimatedCost: { development: '$0', monthly: '$0', annual: '$0' },
          timeline: { mvp: '0 weeks', production: '0 weeks', scale: '0 weeks' }
        },
        integrationPlan: { phase1: [], phase2: [], phase3: [] },
        totalCostEstimate: { development: 0, monthlyOperational: 0, annualOperational: 0 },
        riskAssessment: { technical: [], operational: [], financial: [] }
      }, { status: 400 });
    }

    if (!body.architecture.nodes || body.architecture.nodes.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Architecture must contain at least one node',
        projectName: '',
        decisions: [],
        architecture: {
          complexity: 'simple',
          components: 0,
          estimatedCost: { development: '$0', monthly: '$0', annual: '$0' },
          timeline: { mvp: '0 weeks', production: '0 weeks', scale: '0 weeks' }
        },
        integrationPlan: { phase1: [], phase2: [], phase3: [] },
        totalCostEstimate: { development: 0, monthlyOperational: 0, annualOperational: 0 },
        riskAssessment: { technical: [], operational: [], financial: [] }
      }, { status: 400 });
    }

    // Generate system decisions using AI
    const result: SystemDecisionsSummary = await generateSystemDecisions(body);

    // Validate the generated decisions
    const validation = validateSystemDecisions(result);

    if (!validation.isValid) {
      console.warn('System decisions validation warnings:', validation.errors);
    }

    return NextResponse.json({
      ...result,
      success: true,
      validation,
    });

  } catch (error) {
    console.error('Generate System Decisions API Error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Error type:', typeof error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    let errorMessage = 'Internal server error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      projectName: '',
      decisions: [],
      architecture: {
        complexity: 'simple',
        components: 0,
        estimatedCost: { development: '$0', monthly: '$0', annual: '$0' },
        timeline: { mvp: '0 weeks', production: '0 weeks', scale: '0 weeks' }
      },
      integrationPlan: { phase1: [], phase2: [], phase3: [] },
      totalCostEstimate: { development: 0, monthlyOperational: 0, annualOperational: 0 },
      riskAssessment: { technical: [], operational: [], financial: [] },
      timestamp: new Date().toISOString(),
      debug: {
        errorType: typeof error,
        hasStack: error instanceof Error && !!error.stack
      }
    }, { status: 500 });
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'OK',
    service: 'System Decisions Generation API',
    description: 'Generate comprehensive system decisions and tool recommendations using AI based on system architecture',
    usage: {
      endpoint: 'POST /api/generate-system-decisions',
      body: {
        architecture: {
          description: 'SystemArchitecture object with nodes and edges',
          required: true,
        },
        projectData: {
          description: 'Project information including name, description, schemas, endpoints',
          required: false,
          fields: {
            projectName: 'string (optional)',
            description: 'string (optional)',
            schemas: 'array (optional)',
            endpoints: 'array (optional)',
            analysis: 'object (optional)'
          }
        },
        options: {
          temperature: 'AI creativity level (0-1, default: 0.7)',
          maxTokens: 'Maximum response length (default: 8000)',
        },
      },
    },
    features: [
      'AI-powered tool recommendation and analysis',
      'Comprehensive system decisions for all architecture components',
      'Cost estimation (development and operational)',
      'Timeline estimation (MVP, production, scale)',
      'Risk assessment (technical, operational, financial)',
      'Phased integration plan',
      'Enterprise scoring for each tool recommendation',
      'Context-aware reasoning based on project requirements'
    ],
    timestamp: new Date().toISOString(),
  });
}
