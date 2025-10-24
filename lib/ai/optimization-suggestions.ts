import { generateText } from 'ai';
import { groq, AI_CONFIG } from './groq-client';

export interface OptimizationSuggestion {
  type: 'indexing' | 'caching' | 'monitoring' | 'backup' | 'performance' | 'infrastructure' | 'security' | 'maintenance';
  title: string;
  description: string;
  impact: 'Low' | 'Medium' | 'High';
  complexity: 'Low' | 'Medium' | 'High';
}

export interface OptimizationSuggestionsResult {
  suggestions: OptimizationSuggestion[];
  success: boolean;
  error?: string;
}

const OPTIMIZATION_SUGGESTIONS_PROMPT = `You are a performance optimization expert. Analyze the project requirements and provide specific optimization suggestions.

CRITICAL REQUIREMENTS:
- Respond with ONLY valid JSON in the exact format below.
- No markdown, no code blocks, no explanations before or after the JSON.
- Output must be parseable by JSON.parse() without any modifications.
- Do not wrap the JSON in markdown code blocks (no \`\`\`json or \`\`\`).
- Ensure all string values are properly escaped and all arrays/objects are valid JSON.
- All enum values must exactly match: type values from list, impact/complexity ("High"|"Medium"|"Low").

**REQUIRED JSON STRUCTURE:**
{
  "suggestions": [
    {
      "type": "indexing|caching|monitoring|backup|performance|infrastructure|security|maintenance",
      "title": "Specific optimization technique",
      "description": "How to implement and why it helps performance",
      "impact": "High|Medium|Low",
      "complexity": "Low|Medium|High"
    }
  ],
  "success": true
}

**REQUIREMENTS:**
1. Generate 5-7 optimization suggestions relevant to the project
2. Each suggestion must be specific and actionable
3. Provide clear implementation guidance
4. Explain the performance impact and why it helps
5. Set realistic impact and complexity levels
6. Cover different optimization areas: database, caching, infrastructure, etc.

**OPTIMIZATION TYPES:**
- indexing: Database indexes, query optimization
- caching: Redis, CDN, application-level caching
- monitoring: Performance tracking, alerting, metrics
- backup: Data protection, disaster recovery
- performance: Query optimization, connection pooling
- infrastructure: Load balancing, auto-scaling
- security: Efficient authentication, rate limiting
- maintenance: Automated cleanup, log rotation

Return ONLY the JSON object with no additional formatting or text.`;

export async function generateOptimizationSuggestions(
  description: string,
  schemas: any[] = [],
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<OptimizationSuggestionsResult> {
  if (!description?.trim()) {
    return {
      suggestions: [],
      success: false,
      error: 'Description is required',
    };
  }

  try {
    const prompt = `${OPTIMIZATION_SUGGESTIONS_PROMPT}

**PROJECT DESCRIPTION:** "${description}"
**GENERATED TABLES:** ${schemas.map(s => s.name).join(', ')}

Provide optimization suggestions tailored to this specific project.`;

    const { text } = await generateText({
      model: groq(AI_CONFIG.model),
      messages: [
        { role: 'system', content: prompt },
        { 
          role: 'user', 
          content: `Provide optimization suggestions for: ${description}`
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
    
    if (!result.suggestions || !Array.isArray(result.suggestions)) {
      throw new Error('Invalid response: suggestions array is required');
    }

    // Validate all required fields are present - NO DEFAULTS
    const suggestions = result.suggestions.map((sug: any) => {
      if (!sug.type || !sug.title || !sug.description || !sug.impact || !sug.complexity) {
        throw new Error('Missing required fields in suggestion: type, title, description, impact, complexity are all required');
      }
      return {
        type: sug.type,
        title: sug.title,
        description: sug.description,
        impact: sug.impact,
        complexity: sug.complexity
      };
    });

    return {
      suggestions,
      success: true,
    };

  } catch (error) {
    console.error('Optimization Suggestions Error:', error);
    
    return {
      suggestions: [
        {
          type: 'indexing',
          title: 'Create Database Indexes',
          description: 'Add indexes on frequently queried columns to improve query performance significantly.',
          impact: 'High',
          complexity: 'Low'
        },
        {
          type: 'caching',
          title: 'Implement Redis Caching',
          description: 'Use Redis to cache frequently accessed data and reduce database load.',
          impact: 'High',
          complexity: 'Medium'
        },
        {
          type: 'monitoring',
          title: 'Set Up Performance Monitoring',
          description: 'Implement comprehensive monitoring to track application performance and identify bottlenecks.',
          impact: 'Medium',
          complexity: 'Medium'
        },
        {
          type: 'backup',
          title: 'Automated Database Backups',
          description: 'Set up automated, regular database backups to ensure data protection.',
          impact: 'High',
          complexity: 'Low'
        }
      ],
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate optimization suggestions',
    };
  }
}