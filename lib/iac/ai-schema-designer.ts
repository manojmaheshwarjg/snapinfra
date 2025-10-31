/**
 * AI-Powered Infrastructure Schema Designer
 * 
 * Uses AI to analyze project requirements and generate optimal
 * infrastructure schemas that are then validated and used for
 * template-based IaC generation.
 * 
 * This is the hybrid approach: AI for intelligence, templates for reliability.
 */

import { generateText } from 'ai'
import type {
  AISchemaContext,
  IntelligentSchemaResult,
  ProjectAnalysis,
  InfrastructureSchema
} from './schema-types'
import { 
  validateInfrastructureSchema, 
  validateAISchemaContext,
  getValidationErrorsString
} from './schema-validator'

/**
 * Analyze project requirements to provide rich context for AI
 */
export function analyzeProjectRequirements(project: AISchemaContext['project']): ProjectAnalysis {
  const schema = project.schema || []
  const endpoints = project.endpoints || []
  
  // Calculate metrics
  const tableCount = schema.length
  const totalFields = schema.reduce((sum, table: any) => {
    return sum + (table.fields?.length || 0)
  }, 0)
  
  // Estimate data size based on tables and fields
  let estimatedDataSize: ProjectAnalysis['estimatedDataSize'] = 'small'
  if (totalFields > 200 || tableCount > 30) {
    estimatedDataSize = 'xlarge'
  } else if (totalFields > 100 || tableCount > 20) {
    estimatedDataSize = 'large'
  } else if (totalFields > 50 || tableCount > 10) {
    estimatedDataSize = 'medium'
  }
  
  // Analyze endpoint patterns
  const endpointCount = endpoints.length
  const readEndpoints = endpoints.filter((e: any) => 
    e.method === 'GET' || e.method?.toUpperCase() === 'GET'
  ).length
  const writeEndpoints = endpointCount - readEndpoints
  
  const readWriteRatio = {
    read: endpointCount > 0 ? Math.round((readEndpoints / endpointCount) * 100) : 50,
    write: endpointCount > 0 ? Math.round((writeEndpoints / endpointCount) * 100) : 50
  }
  
  // Determine complexity
  let complexity: ProjectAnalysis['complexity'] = 'low'
  if (tableCount > 15 || endpointCount > 20 || totalFields > 100) {
    complexity = 'high'
  } else if (tableCount > 8 || endpointCount > 10 || totalFields > 50) {
    complexity = 'medium'
  }
  
  // Recommend compute resources based on complexity
  let recommendedCompute = 't3.micro' // Minimal
  if (complexity === 'high' || readWriteRatio.write > 40) {
    recommendedCompute = 't3.large' // More powerful for writes
  } else if (complexity === 'medium') {
    recommendedCompute = 't3.small'
  }
  
  // Recommend database based on data characteristics
  const dbType = project.database?.type?.toLowerCase() || 'postgres'
  let recommendedDatabase = 'db.t3.micro'
  
  if (estimatedDataSize === 'xlarge' || complexity === 'high') {
    recommendedDatabase = 'db.r6g.large' // Memory-optimized
  } else if (estimatedDataSize === 'large') {
    recommendedDatabase = 'db.t3.medium'
  } else if (estimatedDataSize === 'medium') {
    recommendedDatabase = 'db.t3.small'
  }
  
  return {
    tableCount,
    totalFields,
    estimatedDataSize,
    endpointCount,
    readWriteRatio,
    complexity,
    recommendedCompute,
    recommendedDatabase
  }
}

/**
 * Generate intelligent infrastructure schema using AI
 */
export async function generateIntelligentSchema(
  context: AISchemaContext
): Promise<IntelligentSchemaResult> {
  // Validate input context
  const contextValidation = validateAISchemaContext(context)
  if (!contextValidation.valid) {
    throw new Error(`Invalid schema context: ${getValidationErrorsString(contextValidation)}`)
  }
  
  // Analyze project requirements
  const analysis = analyzeProjectRequirements(context.project)
  
  console.log('📊 Project Analysis:')
  console.log('   Tables:', analysis.tableCount)
  console.log('   Fields:', analysis.totalFields)
  console.log('   Data Size:', analysis.estimatedDataSize)
  console.log('   Endpoints:', analysis.endpointCount)
  console.log('   Read/Write:', `${analysis.readWriteRatio.read}%/${analysis.readWriteRatio.write}%`)
  console.log('   Complexity:', analysis.complexity)
  
  // Build AI prompt with rich context
  const prompt = buildSchemaGenerationPrompt(context, analysis)
  
  // Call AI with fallback models
  const { groq, AI_CONFIG } = await import('../ai/groq-client')
  const models = [
    'llama-3.3-70b-versatile', // Most capable
    'llama-3.1-70b-versatile',
    'llama-3.1-8b-instant' // Fast fallback
  ]
  
  let response: string | null = null
  let lastError: any = null
  
  for (const model of models) {
    try {
      console.log(`🤖 Calling AI (${model})...`)
      
      const result = await generateText({
        model: groq(model),
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.4, // Balance creativity and consistency
        maxTokens: 4000,
        topP: 0.9
      })
      
      response = result.text
      if (response) {
        console.log(`✅ AI responded (${model})`)
        break
      }
    } catch (error: any) {
      lastError = error
      console.warn(`⚠️  Model ${model} failed:`, error.message)
      continue
    }
  }
  
  if (!response) {
    throw new Error(`All AI models failed. Last error: ${lastError?.message || 'Unknown error'}`)
  }
  
  // Parse and validate AI response
  const parsed = parseAIResponse(response)
  
  // Validate the schema structure
  const schemaValidation = validateInfrastructureSchema(parsed.schema)
  if (!schemaValidation.valid) {
    console.error('❌ AI generated invalid schema')
    console.error(getValidationErrorsString(schemaValidation))
    
    // Retry with corrections
    return retryWithCorrections(context, analysis, schemaValidation.errors || [])
  }
  
  if (schemaValidation.warnings && schemaValidation.warnings.length > 0) {
    console.warn('⚠️  Schema warnings:')
    schemaValidation.warnings.forEach(w => console.warn('   -', w))
  }
  
  // Extract reasoning from resources
  const reasoning: Record<string, string> = {}
  for (const [name, resource] of Object.entries(parsed.schema.resources)) {
    if (resource.reasoning) {
      reasoning[name] = resource.reasoning
    }
  }
  
  // Estimate costs
  const estimatedCost = estimateMonthlyCost(parsed.schema, context.userPreferences)
  
  return {
    schema: parsed.schema,
    reasoning,
    recommendations: parsed.recommendations,
    analysis,
    estimatedMonthlyCost: estimatedCost
  }
}

/**
 * System prompt for AI
 */
const SYSTEM_PROMPT = `You are a senior cloud architect and DevOps engineer with expertise in AWS, Azure, and GCP.

Your task is to analyze project requirements and design OPTIMAL infrastructure.

INTELLIGENCE TASKS (use your expertise):
1. Determine appropriate resource sizing based on data volume and traffic
2. Identify security requirements from data sensitivity
3. Recommend suitable database engines and configurations
4. Suggest caching if beneficial for performance
5. Propose monitoring and observability setup
6. Consider cost optimization opportunities
7. Add production-ready security configurations
8. Suggest high availability and disaster recovery options

STRUCTURE REQUIREMENTS (follow EXACTLY):
Output VALID JSON with this exact structure:

{
  "schema": {
    "project": {
      "name": "project-name",
      "description": "Brief description",
      "environment": "development" | "staging" | "production"
    },
    "resources": {
      "resource_name": {
        "type": "database" | "compute" | "cache" | "storage" | "network" | "queue" | "monitoring",
        "provider": "aws" | "azure" | "gcp",
        "properties": {
          // Resource-specific properties (use your intelligence here)
        },
        "reasoning": "Explain WHY you chose these specifications",
        "dependsOn": ["other_resource"] // if applicable
      }
    }
  },
  "recommendations": {
    "cost": ["Cost optimization suggestions"],
    "security": ["Security improvement suggestions"],
    "scalability": ["Scalability notes"],
    "performance": ["Performance optimization suggestions"]
  }
}

GUIDELINES:
- For databases: Choose engine, instance size, storage, backup config
- For compute: Choose runtime, CPU/memory, scaling policy
- For caching: Determine if needed, size appropriately
- Security: Always enable encryption, use private subnets, least-privilege IAM
- Cost: Balance performance with cost-effectiveness
- Dependencies: Ensure compute depends on database, etc.

IMPORTANT: 
- Use consistent naming (kebab-case for project, snake_case for resource IDs)
- Provide specific reasoning for each resource choice
- Be production-ready (backups, monitoring, encryption)
- Output ONLY valid JSON, no markdown, no comments`

/**
 * Build user prompt with context
 */
function buildSchemaGenerationPrompt(
  context: AISchemaContext,
  analysis: ProjectAnalysis
): string {
  const prefs = context.userPreferences || {}
  
  return `Design optimal infrastructure for this project:

PROJECT DETAILS:
- Name: ${context.project.name}
- Description: ${context.project.description}
- Database: ${context.project.database?.type || 'postgres'}

DATA CHARACTERISTICS:
- Tables: ${analysis.tableCount}
- Total Fields: ${analysis.totalFields}
- Estimated Data Size: ${analysis.estimatedDataSize}
- Complexity: ${analysis.complexity}

API CHARACTERISTICS:
- Endpoints: ${analysis.endpointCount}
- Read Operations: ${analysis.readWriteRatio.read}%
- Write Operations: ${analysis.readWriteRatio.write}%

USER PREFERENCES:
- Cost Priority: ${prefs.cost || 'balanced'}
- Scale: ${prefs.scale || 'startup'}
- Budget: ${context.budget ? `$${context.budget}/month` : 'flexible'}
- Compliance: ${prefs.compliance?.join(', ') || 'none'}
- Region: ${prefs.region || 'us-east-1'}

ARCHITECTURE HINTS:
${context.architectureHints || 'Standard web application'}

RECOMMENDATIONS FROM ANALYSIS:
- Recommended Compute: ${analysis.recommendedCompute}
- Recommended Database: ${analysis.recommendedDatabase}

Based on this analysis, design the optimal infrastructure with intelligent resource sizing and configuration.`
}

/**
 * Parse AI response and clean JSON
 */
function parseAIResponse(text: string): {
  schema: InfrastructureSchema
  recommendations: any
} {
  // Clean response
  let clean = text.trim()
  
  // Remove markdown code blocks
  clean = clean.replace(/^```json\s*/gm, '').replace(/^```\s*/gm, '').replace(/```$/gm, '')
  
  // Find JSON boundaries
  const jsonStart = clean.indexOf('{')
  const jsonEnd = clean.lastIndexOf('}')
  
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error('No JSON found in AI response')
  }
  
  clean = clean.substring(jsonStart, jsonEnd + 1)
  
  try {
    const parsed = JSON.parse(clean)
    
    // Ensure structure
    if (!parsed.schema || !parsed.schema.resources) {
      throw new Error('Invalid response structure: missing schema or resources')
    }
    
    return {
      schema: parsed.schema,
      recommendations: parsed.recommendations || {
        cost: [],
        security: [],
        scalability: [],
        performance: []
      }
    }
  } catch (error: any) {
    console.error('JSON Parse Error:', error.message)
    console.error('Cleaned content (first 500 chars):', clean.substring(0, 500))
    throw new Error(`Failed to parse AI response: ${error.message}`)
  }
}

/**
 * Retry with corrections if AI generates invalid schema
 */
async function retryWithCorrections(
  context: AISchemaContext,
  analysis: ProjectAnalysis,
  errors: string[]
): Promise<IntelligentSchemaResult> {
  console.log('🔄 Retrying with error corrections...')
  
  const { groq } = await import('../ai/groq-client')
  
  const correctionPrompt = `Your previous response had validation errors:
${errors.map(e => `- ${e}`).join('\n')}

Please fix these errors and regenerate the infrastructure schema.

${buildSchemaGenerationPrompt(context, analysis)}

Ensure the JSON structure is exactly as specified, with no validation errors.`
  
  const result = await generateText({
    model: groq('llama-3.3-70b-versatile'),
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: correctionPrompt }
    ],
    temperature: 0.3, // Lower temperature for corrections
    maxTokens: 4000
  })
  
  const parsed = parseAIResponse(result.text)
  
  // Validate again
  const validation = validateInfrastructureSchema(parsed.schema)
  if (!validation.valid) {
    // If still invalid, return a minimal valid schema
    console.error('❌ Retry failed, using fallback schema')
    return createFallbackSchema(context, analysis)
  }
  
  const reasoning: Record<string, string> = {}
  for (const [name, resource] of Object.entries(parsed.schema.resources)) {
    if (resource.reasoning) {
      reasoning[name] = resource.reasoning
    }
  }
  
  return {
    schema: parsed.schema,
    reasoning,
    recommendations: parsed.recommendations,
    analysis,
    estimatedMonthlyCost: estimateMonthlyCost(parsed.schema, context.userPreferences)
  }
}

/**
 * Create fallback schema if AI fails
 */
function createFallbackSchema(
  context: AISchemaContext,
  analysis: ProjectAnalysis
): IntelligentSchemaResult {
  const dbType = context.project.database?.type || 'postgres'
  
  const schema: InfrastructureSchema = {
    project: {
      name: context.project.name.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
      description: context.project.description
    },
    resources: {
      database: {
        type: 'database',
        provider: 'aws',
        properties: {
          engine: dbType,
          instanceClass: analysis.recommendedDatabase,
          allocatedStorage: analysis.estimatedDataSize === 'small' ? 20 : 100,
          multiAZ: false,
          backupRetentionPeriod: 7
        },
        reasoning: 'Conservative database configuration based on project size'
      },
      api_server: {
        type: 'compute',
        provider: 'aws',
        properties: {
          instanceType: analysis.recommendedCompute,
          desiredCount: 2,
          containerPort: 3000
        },
        reasoning: 'Standard API server with basic auto-scaling',
        dependsOn: ['database']
      }
    },
    recommendations: {
      costOptimizations: ['Consider reserved instances for production'],
      securityImprovements: ['Enable VPC with private subnets', 'Add WAF for API protection'],
      scalabilityNotes: ['Add load balancer for high traffic', 'Consider adding read replicas']
    }
  }
  
  return {
    schema,
    reasoning: {
      database: 'Fallback: Conservative database configuration',
      api_server: 'Fallback: Standard API server configuration'
    },
    recommendations: {
      cost: schema.recommendations!.costOptimizations!,
      security: schema.recommendations!.securityImprovements!,
      scalability: schema.recommendations!.scalabilityNotes!,
      performance: ['Add caching layer if needed']
    },
    analysis,
    estimatedMonthlyCost: {
      min: 50,
      max: 150,
      currency: 'USD'
    }
  }
}

/**
 * Estimate monthly cost
 */
function estimateMonthlyCost(
  schema: InfrastructureSchema,
  preferences?: any
): { min: number; max: number; currency: string } {
  let minCost = 0
  let maxCost = 0
  
  // Simple cost estimation based on resource types
  for (const resource of Object.values(schema.resources)) {
    if (resource.type === 'database') {
      const instanceClass = resource.properties.instanceClass || 'db.t3.micro'
      if (instanceClass.includes('micro')) {
        minCost += 15
        maxCost += 25
      } else if (instanceClass.includes('small')) {
        minCost += 30
        maxCost += 50
      } else if (instanceClass.includes('medium')) {
        minCost += 60
        maxCost += 100
      } else {
        minCost += 120
        maxCost += 200
      }
    } else if (resource.type === 'compute') {
      minCost += 20
      maxCost += 50
    } else if (resource.type === 'cache') {
      minCost += 15
      maxCost += 30
    } else if (resource.type === 'storage') {
      minCost += 5
      maxCost += 20
    }
  }
  
  return {
    min: Math.round(minCost),
    max: Math.round(maxCost),
    currency: 'USD'
  }
}
