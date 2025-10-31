import { NextRequest, NextResponse } from 'next/server';
import { CostCalculator, quickEstimate } from '@/lib/cost/cost-calculator';
import type { CloudProvider } from '@/lib/cost/cost-calculator';
import type { InfrastructureSchema } from '@/lib/iac/schema-types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schema, provider, region, compareProviders } = body;

    // Validation
    if (!schema) {
      return NextResponse.json(
        { success: false, error: 'schema is required' },
        { status: 400 }
      );
    }

    const calculator = new CostCalculator();
    const selectedProvider = (provider || 'aws') as CloudProvider;

    // Single provider calculation
    if (!compareProviders) {
      const estimate = calculator.calculateFromSchema(
        schema,
        selectedProvider,
        region || 'us-east-1'
      );

      const serviceBreakdown = calculator.getServiceBreakdown(estimate);
      const optimizations = calculator.generateOptimizations(estimate);

      return NextResponse.json({
        success: true,
        data: {
          estimate,
          serviceBreakdown,
          optimizations,
          metadata: {
            provider: selectedProvider,
            region: region || 'us-east-1',
            calculatedAt: new Date().toISOString()
          }
        }
      });
    }

    // Multi-provider comparison
    const providers: CloudProvider[] = Array.isArray(compareProviders) 
      ? compareProviders 
      : ['aws', 'azure', 'gcp'];

    const estimates = {} as Record<CloudProvider, any>;
    
    for (const p of providers) {
      const estimate = calculator.calculateFromSchema(schema, p, region || 'us-east-1');
      const serviceBreakdown = calculator.getServiceBreakdown(estimate);
      const optimizations = calculator.generateOptimizations(estimate);

      estimates[p] = {
        estimate,
        serviceBreakdown,
        optimizations
      };
    }

    // Find cheapest provider
    const cheapest = Object.entries(estimates).reduce((min, [provider, data]) => {
      return data.estimate.monthly < min.cost 
        ? { provider, cost: data.estimate.monthly }
        : min;
    }, { provider: 'aws', cost: Infinity });

    return NextResponse.json({
      success: true,
      data: {
        estimates,
        comparison: {
          cheapest: cheapest.provider,
          cheapestCost: cheapest.cost,
          mostExpensive: Object.entries(estimates).reduce((max, [provider, data]) => {
            return data.estimate.monthly > max.cost
              ? { provider, cost: data.estimate.monthly }
              : max;
          }, { provider: 'aws', cost: 0 }),
          savings: Math.max(...Object.values(estimates).map((e: any) => e.estimate.monthly)) - cheapest.cost
        },
        metadata: {
          providersCompared: providers.length,
          calculatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error: any) {
    console.error('Cost calculation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to calculate costs',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Compare before/after costs
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { beforeSchema, afterSchema, provider } = body;

    if (!beforeSchema || !afterSchema) {
      return NextResponse.json(
        { success: false, error: 'Both beforeSchema and afterSchema are required' },
        { status: 400 }
      );
    }

    const calculator = new CostCalculator();
    const selectedProvider = (provider || 'aws') as CloudProvider;

    const comparison = calculator.compareCosts(
      beforeSchema,
      afterSchema,
      selectedProvider
    );

    return NextResponse.json({
      success: true,
      data: {
        comparison,
        metadata: {
          provider: selectedProvider,
          calculatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error: any) {
    console.error('Cost comparison error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to compare costs',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Quick cost estimate
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schemaParam = searchParams.get('schema');
    const provider = searchParams.get('provider') || 'aws';

    if (!schemaParam) {
      return NextResponse.json({
        success: false,
        error: 'schema query parameter is required (JSON string)'
      }, { status: 400 });
    }

    const schema = JSON.parse(schemaParam);
    const estimate = quickEstimate(schema, provider as CloudProvider);

    return NextResponse.json({
      success: true,
      data: {
        estimate,
        metadata: {
          provider,
          estimationType: 'quick',
          calculatedAt: new Date().toISOString()
        }
      }
    });

  } catch (error: any) {
    console.error('Quick estimate error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate quick estimate',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
