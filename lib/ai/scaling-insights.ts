import { generateText } from 'ai';
import { groq, AI_CONFIG } from './groq-client';

export interface ScalingInsight {
  expectedLoad: 'Low' | 'Medium' | 'High';
  readWriteRatio: string;
  cachingStrategy: string;
  indexingPriority: Array<{
    table: string;
    priority: 'Low' | 'Medium' | 'High';
    reason: string;
  }>;
}

export interface PerformanceMetric {
  label: string;
  value: string;
  description: string;
}

export interface ScalingInsightsResult {
  insights: ScalingInsight;
  metrics: PerformanceMetric[];
  success: boolean;
  error?: string;
}

const SCALING_INSIGHTS_PROMPT = `You are a scalability expert. Analyze the project requirements and provide scaling insights and performance estimates.

CRITICAL REQUIREMENTS:
- Respond with ONLY valid JSON in the exact format below.
- No markdown, no code blocks, no explanations before or after the JSON.
- Output must be parseable by JSON.parse() without any modifications.
- Do not wrap the JSON in markdown code blocks (no \`\`\`json or \`\`\`).
- Ensure all string values are properly escaped and all arrays/objects are valid JSON.
- All enum values must exactly match: expectedLoad ("Low"|"Medium"|"High"), priority ("High"|"Medium"|"Low").

**REQUIRED JSON STRUCTURE:**
{
  "insights": {
    "expectedLoad": "Low|Medium|High",
    "readWriteRatio": "80:20",
    "cachingStrategy": "Redis + CDN|Application-level|Database-level|etc",
    "indexingPriority": [
      {
        "table": "table_name",
        "priority": "High|Medium|Low",
        "reason": "why this table needs priority indexing"
      }
    ]
  },
  "metrics": [
    {
      "label": "Expected QPS",
      "value": "1000-5000",
      "description": "Queries per second estimate"
    },
    {
      "label": "Data Growth",
      "value": "500GB/year",
      "description": "Estimated data growth rate"
    }
  ],
  "success": true
}

**REQUIREMENTS:**
1. Assess expected load based on project description and complexity
2. Estimate realistic read/write ratios for the use case
3. Recommend appropriate caching strategy
4. Identify tables that need priority indexing
5. Provide realistic performance metrics and growth estimates
6. Tailor all insights to the specific project requirements

**LOAD ASSESSMENT:**
- Low: Simple apps, <1000 users, basic operations
- Medium: Growing apps, 1K-100K users, moderate complexity
- High: Large scale, >100K users, complex operations

Return ONLY the JSON object with no additional formatting or text.`;

export async function generateScalingInsights(
  description: string,
  schemas: any[] = [],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<ScalingInsightsResult> {
  if (!description?.trim()) {
    return {
      insights: {
        expectedLoad: 'Medium',
        readWriteRatio: '70:30',
        cachingStrategy: 'Application-level',
        indexingPriority: []
      },
      metrics: [],
      success: false,
      error: 'Description is required',
    };
  }

  try {
    const prompt = `${SCALING_INSIGHTS_PROMPT}

**PROJECT DESCRIPTION:** "${description}"
**GENERATED TABLES:** ${schemas.map(s => s.name).join(', ')}

Provide scaling insights tailored to this specific project.`;

    const { text } = await generateText({
      model: groq(AI_CONFIG.model),
      messages: [
        { role: 'system', content: prompt },
        { 
          role: 'user', 
          content: `Provide scaling insights for: ${description}`
        },
      ],
      temperature: options.temperature ?? 0.3,
      maxTokens: options.maxTokens || 1500,
      topP: 0.9,
    });

    // Clean up the response text
    let cleanText = text.trim();
    
    // Remove markdown code blocks if present
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/m, '').replace(/\s*```$/m, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/m, '').replace(/\s*```$/m, '');
    }
    
    // Extract JSON if there's text before/after
    const jsonStart = cleanText.indexOf('{');
    const jsonEnd = cleanText.lastIndexOf('}');
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleanText = cleanText.substring(jsonStart, jsonEnd + 1);
    }

    const result = JSON.parse(cleanText);
    
    if (!result.insights) {
      throw new Error('Invalid response: insights object is required');
    }

    // Ensure all fields are present with defaults
    const insights = {
      expectedLoad: result.insights.expectedLoad || 'Medium',
      readWriteRatio: result.insights.readWriteRatio || '70:30',
      cachingStrategy: result.insights.cachingStrategy || 'Application-level',
      indexingPriority: (result.insights.indexingPriority || []).map((idx: any) => ({
        table: idx.table || 'unknown',
        priority: idx.priority || 'Medium',
        reason: idx.reason || 'Performance optimization'
      }))
    };

    const metrics = (result.metrics || []).map((metric: any) => ({
      label: metric.label || 'Unknown Metric',
      value: metric.value || 'N/A',
      description: metric.description || 'Metric description not specified'
    }));

    return {
      insights,
      metrics,
      success: true,
    };

  } catch (error) {
    console.error('Scaling Insights Error:', error);
    
    return {
      insights: {
        expectedLoad: 'Medium',
        readWriteRatio: '70:30',
        cachingStrategy: 'Application-level',
        indexingPriority: schemas.slice(0, 3).map((schema: any) => ({
          table: schema.name,
          priority: 'Medium' as const,
          reason: 'Standard indexing for performance'
        }))
      },
      metrics: [
        {
          label: 'Expected QPS',
          value: '100-1000',
          description: 'Estimated queries per second'
        },
        {
          label: 'Data Growth',
          value: '10GB/year',
          description: 'Estimated annual data growth'
        },
        {
          label: 'Concurrent Users',
          value: '50-500',
          description: 'Estimated concurrent user load'
        }
      ],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate scaling insights',
    };
  }
}