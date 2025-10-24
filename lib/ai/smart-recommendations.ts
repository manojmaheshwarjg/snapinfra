import { generateText } from 'ai';
import { groq, AI_CONFIG } from './groq-client';

export interface SmartRecommendation {
  title: string;
  description: string;
  type: 'architecture' | 'performance' | 'security' | 'scalability';
  priority: 'Low' | 'Medium' | 'High';
  implementationEffort: 'Low' | 'Medium' | 'High';
}

export interface SmartRecommendationsResult {
  recommendations: SmartRecommendation[];
  success: boolean;
  error?: string;
}

const SMART_RECOMMENDATIONS_PROMPT = `You are a senior software architect. Analyze the project requirements and provide smart, actionable recommendations.

CRITICAL REQUIREMENTS:
- Respond with ONLY valid JSON in the exact format below.
- No markdown, no code blocks, no explanations before or after the JSON.
- Output must be parseable by JSON.parse() without any modifications.
- Do not wrap the JSON in markdown code blocks (no \`\`\`json or \`\`\`).
- Ensure all string values are properly escaped and all arrays/objects are valid JSON.
- All enum values must exactly match: type ("architecture"|"performance"|"security"|"scalability"), priority ("High"|"Medium"|"Low").

**REQUIRED JSON STRUCTURE:**
{
  "recommendations": [
    {
      "title": "Specific actionable recommendation title",
      "description": "Detailed implementation advice and why it's beneficial",
      "type": "architecture|performance|security|scalability",
      "priority": "High|Medium|Low",
      "implementationEffort": "Low|Medium|High"
    }
  ],
  "success": true
}

**REQUIREMENTS:**
1. Generate 4-6 recommendations tailored to the specific use case
2. Each recommendation must be actionable and specific
3. Provide clear implementation guidance in description
4. Balance different types: architecture, performance, security, scalability
5. Set realistic priority and effort levels
6. Make recommendations relevant to the project scale and complexity

**RECOMMENDATION TYPES:**
- architecture: Design patterns, service structure, modularity
- performance: Optimization, caching, indexing strategies
- security: Authentication, authorization, data protection
- scalability: Load handling, database scaling, infrastructure

Return ONLY the JSON object with no additional formatting or text.`;

export async function generateSmartRecommendations(
  description: string,
  schemas: any[] = [],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<SmartRecommendationsResult> {
  if (!description?.trim()) {
    return {
      recommendations: [],
      success: false,
      error: 'Description is required',
    };
  }

  try {
    const prompt = `${SMART_RECOMMENDATIONS_PROMPT}

**PROJECT DESCRIPTION:** "${description}"
**GENERATED TABLES:** ${schemas.map(s => s.name).join(', ')}

Provide smart recommendations tailored to this specific project.`;

    const { text } = await generateText({
      model: groq(AI_CONFIG.model),
      messages: [
        { role: 'system', content: prompt },
        { 
          role: 'user', 
          content: `Provide smart recommendations for: ${description}`
        },
      ],
      temperature: options.temperature ?? 0.4,
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

    // Validate all required fields are present - NO DEFAULTS
    const recommendations = result.recommendations.map((rec: any) => {
      if (!rec.title || !rec.description || !rec.type || !rec.priority || !rec.implementationEffort) {
        throw new Error('Missing required fields in recommendation: title, description, type, priority, implementationEffort are all required');
      }
      return {
        title: rec.title,
        description: rec.description,
        type: rec.type,
        priority: rec.priority,
        implementationEffort: rec.implementationEffort
      };
    });

    return {
      recommendations,
      success: true,
    };

  } catch (error) {
    console.error('Smart Recommendations Error:', error);
    
    return {
      recommendations: [
        {
          title: 'Implement Clean Architecture',
          description: 'Structure your application with clear separation of concerns using clean architecture principles.',
          type: 'architecture',
          priority: 'High',
          implementationEffort: 'Medium'
        },
        {
          title: 'Add Database Indexing',
          description: 'Create indexes on frequently queried columns to improve query performance.',
          type: 'performance',
          priority: 'Medium',
          implementationEffort: 'Low'
        },
        {
          title: 'Implement Authentication',
          description: 'Add secure user authentication and authorization mechanisms.',
          type: 'security',
          priority: 'High',
          implementationEffort: 'Medium'
        }
      ],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate smart recommendations',
    };
  }
}