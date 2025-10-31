import { NextRequest, NextResponse } from 'next/server';
import { PipelineGenerator, generatePipeline } from '@/lib/cicd/pipeline-generator';
import type { PipelineConfig } from '@/lib/cicd/pipeline-types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, target, projectName, environment, options } = body;

    // Validation
    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'provider is required (github-actions, gitlab-ci, jenkins, azure-devops)' },
        { status: 400 }
      );
    }

    if (!target) {
      return NextResponse.json(
        { success: false, error: 'target is required (terraform, aws-cdk, kubernetes, helm, docker-compose)' },
        { status: 400 }
      );
    }

    if (!projectName) {
      return NextResponse.json(
        { success: false, error: 'projectName is required' },
        { status: 400 }
      );
    }

    // Use simple generation if no options provided
    if (!options) {
      const pipeline = generatePipeline(
        provider,
        target,
        projectName,
        environment || 'production'
      );

      return NextResponse.json({
        success: true,
        data: {
          pipeline,
          metadata: {
            provider,
            target,
            projectName,
            environment: environment || 'production',
            generatedAt: new Date().toISOString()
          }
        }
      });
    }

    // Use advanced generation with custom options
    const generator = new PipelineGenerator();
    const config: PipelineConfig = {
      provider,
      target,
      projectName,
      environment: environment || 'production',
      options
    };

    const pipeline = generator.generate(config);

    return NextResponse.json({
      success: true,
      data: {
        pipeline,
        config,
        metadata: {
          generatedAt: new Date().toISOString(),
          hasTests: options.runTests || false,
          hasSecurityScan: options.runSecurityScan || false,
          requiresApproval: options.requireApproval || false
        }
      }
    });

  } catch (error: any) {
    console.error('Pipeline generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate pipeline',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Get pipeline templates/examples
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const provider = searchParams.get('provider');
    const target = searchParams.get('target');

    if (!provider || !target) {
      return NextResponse.json({
        success: false,
        error: 'provider and target query parameters are required'
      }, { status: 400 });
    }

    // Generate example pipeline
    const pipeline = generatePipeline(
      provider as any,
      target as any,
      'example-project',
      'production'
    );

    return NextResponse.json({
      success: true,
      data: {
        pipeline,
        isExample: true
      }
    });

  } catch (error: any) {
    console.error('Pipeline template error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate template',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Validate pipeline configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { provider, target, projectName, environment, options } = body;

    const validation = {
      valid: true,
      errors: [] as string[],
      warnings: [] as string[]
    };

    // Validate provider
    const validProviders = ['github-actions', 'gitlab-ci', 'jenkins', 'azure-devops'];
    if (!validProviders.includes(provider)) {
      validation.valid = false;
      validation.errors.push(`Invalid provider. Must be one of: ${validProviders.join(', ')}`);
    }

    // Validate target
    const validTargets = ['terraform', 'aws-cdk', 'kubernetes', 'helm', 'docker-compose'];
    if (!validTargets.includes(target)) {
      validation.valid = false;
      validation.errors.push(`Invalid target. Must be one of: ${validTargets.join(', ')}`);
    }

    // Validate project name
    if (!projectName || projectName.length < 2) {
      validation.valid = false;
      validation.errors.push('Project name must be at least 2 characters');
    }

    // Check for common issues
    if (options?.runSecurityScan && !options.scanTools) {
      validation.warnings.push('Security scan enabled but no scan tools specified. Will use default (trivy)');
    }

    if (environment === 'production' && !options?.requireApproval) {
      validation.warnings.push('Production environment without approval gates. Consider enabling requireApproval');
    }

    return NextResponse.json({
      success: true,
      data: validation
    });

  } catch (error: any) {
    console.error('Pipeline validation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to validate pipeline',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
