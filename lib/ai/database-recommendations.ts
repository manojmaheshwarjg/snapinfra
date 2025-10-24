import { generateText } from 'ai';
import { groq, AI_CONFIG } from './groq-client';

export interface DatabaseRecommendation {
  name: string;
  score: number;
  reasons: string[];
  bestFor: string;
  pros: string[];
  cons: string[];
  whyForUseCase: string[];
}

export interface DatabaseRecommendationsResult {
  recommendations: DatabaseRecommendation[];
  selected: string;
  useCase: {
    key: string;
    label: string;
    features: string[];
    complexity: 'simple' | 'medium' | 'complex';
  };
  success: boolean;
  error?: string;
}

const DATABASE_RECOMMENDATIONS_PROMPT = `You are a database expert. Analyze the project requirements and recommend the best database options.

CRITICAL REQUIREMENTS:
- Respond with ONLY valid JSON in the exact format below.
- No markdown, no code blocks, no explanations before or after the JSON.
- Output must be parseable by JSON.parse() without any modifications.
- Do not wrap the JSON in markdown code blocks (no \`\`\`json or \`\`\`).
- Ensure all string values are properly escaped and all arrays/objects are valid JSON.

**REQUIRED JSON STRUCTURE:**
{
  "useCase": {
    "key": "social|ecommerce|blog|tasks|saas|analytics|gaming|etc",
    "label": "Human readable use case name",
    "features": ["key feature 1", "key feature 2", "key feature 3"],
    "complexity": "simple|medium|complex"
  },
  "recommendations": [
    {
      "name": "PostgreSQL|MySQL|MongoDB|Redis|SQLite|etc",
      "score": 85,
      "reasons": ["specific technical reason 1", "specific reason 2"],
      "bestFor": "what this DB excels at for this use case",
      "pros": ["advantage 1", "advantage 2", "advantage 3"],
      "cons": ["limitation 1", "limitation 2"],
      "whyForUseCase": ["use case specific reason 1", "use case specific reason 2"]
    }
  ],
  "selected": "PostgreSQL",
  "success": true
}

**REQUIREMENTS:**
1. Always recommend 3-4 databases with realistic scores (75-95 range)
2. Tailor recommendations specifically to the described use case
3. Provide detailed, technical reasons for each recommendation
4. Explain why each database fits the specific use case
5. Include both pros and cons for balanced recommendations
6. Set "selected" to the highest-scored recommendation

Return ONLY the JSON object with no additional formatting or text.`;

export async function generateDatabaseRecommendations(
  description: string,
  schemas: any[] = [],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<DatabaseRecommendationsResult> {
  if (!description?.trim()) {
    return {
      useCase: { key: 'generic', label: 'General Application', features: [], complexity: 'simple' },
      recommendations: [],
      selected: 'PostgreSQL',
      success: false,
      error: 'Description is required',
    };
  }

  try {
    const prompt = `${DATABASE_RECOMMENDATIONS_PROMPT}

**PROJECT DESCRIPTION:** "${description}"
**GENERATED TABLES:** ${schemas.map(s => s.name).join(', ')}

Analyze this project and provide tailored database recommendations.`;

    const { text } = await generateText({
      model: groq(AI_CONFIG.model),
      messages: [
        { role: 'system', content: prompt },
        { 
          role: 'user', 
          content: `Recommend the best databases for: ${description}`
        },
      ],
      temperature: options.temperature ?? 0.3,
      maxTokens: options.maxTokens || 2000,
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
    
    if (!result.recommendations || !Array.isArray(result.recommendations)) {
      throw new Error('Invalid response: recommendations array is required');
    }

    return {
      useCase: result.useCase,
      recommendations: result.recommendations,
      selected: result.selected || (result.recommendations[0]?.name || 'PostgreSQL'),
      success: true,
    };

  } catch (error) {
    console.error('Database Recommendations Error:', error);
    
    return {
      useCase: { key: 'generic', label: 'General Application', features: [], complexity: 'simple' },
      recommendations: [
        {
          name: 'PostgreSQL',
          score: 90,
          reasons: ['ACID compliance', 'Advanced features'],
          bestFor: 'Complex applications with relationships',
          pros: ['Reliable', 'Feature-rich', 'Good performance'],
          cons: ['Higher memory usage', 'Complex setup'],
          whyForUseCase: ['Great for relational data', 'Supports complex queries']
        }
      ],
      selected: 'PostgreSQL',
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate database recommendations',
    };
  }
}