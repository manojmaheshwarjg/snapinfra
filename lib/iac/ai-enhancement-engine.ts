/**
 * AI Enhancement Engine
 * 
 * Analyzes template-generated IaC and suggests intelligent improvements
 * for security, performance, cost optimization, and monitoring.
 * 
 * This is the "AI for intelligence" part of the hybrid system.
 */

import { generateText } from 'ai'
import type {
  AIEnhancement,
  AIEnhancementRequest,
  GeneratedFile
} from './template-types'
import type { InfrastructureSchema } from './schema-types'

export interface EnhancementResult {
  enhancements: AIEnhancement[]
  summary: {
    total: number
    byCategory: Record<string, number>
    estimatedImpact: {
      costSavings?: string
      securityScore?: string
      performanceGain?: string
    }
  }
  autoApplicable: AIEnhancement[]
  requiresReview: AIEnhancement[]
}

/**
 * AI Enhancement Engine
 */
export class AIEnhancementEngine {
  
  /**
   * Analyze and enhance infrastructure
   */
  async enhanceInfrastructure(
    files: GeneratedFile[],
    schema: InfrastructureSchema,
    options: {
      focusAreas?: ('security' | 'performance' | 'cost' | 'monitoring')[]
      budget?: number
      compliance?: string[]
      autoApply?: boolean
    } = {}
  ): Promise<EnhancementResult> {
    console.log('🎨 AI analyzing infrastructure for enhancements...')
    
    const focusAreas = options.focusAreas || ['security', 'cost', 'monitoring']
    const enhancements: AIEnhancement[] = []
    
    // Analyze for each focus area
    for (const area of focusAreas) {
      console.log(`   Analyzing ${area}...`)
      
      try {
        const areaEnhancements = await this.analyzeArea(area, files, schema, options)
        enhancements.push(...areaEnhancements)
        console.log(`   ✅ Found ${areaEnhancements.length} ${area} enhancements`)
      } catch (error: any) {
        console.error(`   ❌ Error analyzing ${area}:`, error.message)
      }
    }
    
    // Categorize enhancements
    const autoApplicable = enhancements.filter(e => this.isAutoApplicable(e))
    const requiresReview = enhancements.filter(e => !this.isAutoApplicable(e))
    
    // Calculate summary
    const byCategory = this.countByCategory(enhancements)
    const estimatedImpact = this.estimateImpact(enhancements, schema)
    
    console.log(`✅ Found ${enhancements.length} total enhancements`)
    console.log(`   Auto-applicable: ${autoApplicable.length}`)
    console.log(`   Requires review: ${requiresReview.length}`)
    
    return {
      enhancements,
      summary: {
        total: enhancements.length,
        byCategory,
        estimatedImpact
      },
      autoApplicable,
      requiresReview
    }
  }
  
  /**
   * Analyze specific area
   */
  private async analyzeArea(
    area: string,
    files: GeneratedFile[],
    schema: InfrastructureSchema,
    options: any
  ): Promise<AIEnhancement[]> {
    const prompt = this.buildAreaPrompt(area, files, schema, options)
    
    const { groq } = await import('../ai/groq-client')
    
    const result = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      messages: [
        { role: 'system', content: this.getSystemPrompt(area) },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
      maxTokens: 3000
    })
    
    return this.parseEnhancements(result.text, area)
  }
  
  /**
   * Get system prompt for area
   */
  private getSystemPrompt(area: string): string {
    const base = `You are a senior DevOps/SRE expert analyzing infrastructure code.

Your task: Suggest specific, actionable improvements for ${area}.

Output ONLY valid JSON in this format:
{
  "enhancements": [
    {
      "type": "addition" | "modification" | "new-file",
      "file": "path/to/file",
      "content": "specific code to add/change",
      "reasoning": "why this improves ${area}",
      "impact": {
        "cost": "estimated impact" (if relevant),
        "security": "improvement description" (if relevant),
        "performance": "improvement description" (if relevant)
      }
    }
  ]
}

CRITICAL: Be specific and practical. Don't suggest generic advice.`

    const areaGuidance: Record<string, string> = {
      security: `
Focus on:
- Missing encryption (at rest, in transit)
- Overly permissive IAM policies
- Publicly accessible resources that should be private
- Missing network isolation (VPC, security groups)
- Secrets in plain text
- Missing audit logging
- Vulnerable configurations

Suggest SPECIFIC code additions/changes.`,
      
      cost: `
Focus on:
- Oversized resources for workload
- Reserved instances opportunities
- Storage tier optimization (S3, EBS)
- Auto-scaling configurations
- Unused resources
- Spot instances for non-critical workloads
- Data transfer optimization

Provide SPECIFIC sizing recommendations with cost estimates.`,
      
      performance: `
Focus on:
- Caching opportunities (CloudFront, ElastiCache)
- Database read replicas
- Connection pooling
- CDN integration
- Resource bottlenecks
- Inefficient configurations

Suggest SPECIFIC performance improvements with expected gains.`,
      
      monitoring: `
Focus on:
- Missing CloudWatch alarms (CPU, memory, disk, errors)
- Custom metrics for business KPIs
- Log aggregation and retention
- Alerting rules for critical issues
- Health checks
- Performance dashboards

Provide SPECIFIC alarm/metric configurations.`
    }
    
    return base + '\n' + (areaGuidance[area] || '')
  }
  
  /**
   * Build prompt for area analysis
   */
  private buildAreaPrompt(
    area: string,
    files: GeneratedFile[],
    schema: InfrastructureSchema,
    options: any
  ): string {
    let prompt = `Analyze this infrastructure for ${area} improvements:\n\n`
    
    // Include file contents
    prompt += `INFRASTRUCTURE FILES:\n`
    for (const file of files.slice(0, 3)) { // Limit to avoid token overflow
      prompt += `\n=== ${file.path} ===\n`
      prompt += file.content.substring(0, 1000) // First 1000 chars
      prompt += file.content.length > 1000 ? '\n... (truncated)' : ''
      prompt += '\n'
    }
    
    // Include context
    prompt += `\nPROJECT CONTEXT:\n`
    prompt += `- Name: ${schema.project.name}\n`
    prompt += `- Resources: ${Object.keys(schema.resources).join(', ')}\n`
    
    if (options.budget) {
      prompt += `- Budget: $${options.budget}/month\n`
    }
    
    if (options.compliance?.length) {
      prompt += `- Compliance: ${options.compliance.join(', ')}\n`
    }
    
    prompt += `\nSuggest specific, actionable improvements for ${area}.`
    
    return prompt
  }
  
  /**
   * Parse AI response into enhancements
   */
  private parseEnhancements(text: string, category: string): AIEnhancement[] {
    try {
      // Clean response
      let clean = text.trim()
      clean = clean.replace(/^```json\s*/gm, '').replace(/^```\s*/gm, '').replace(/```$/gm, '')
      
      const jsonStart = clean.indexOf('{')
      const jsonEnd = clean.lastIndexOf('}')
      
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        clean = clean.substring(jsonStart, jsonEnd + 1)
      }
      
      const parsed = JSON.parse(clean)
      
      if (!parsed.enhancements || !Array.isArray(parsed.enhancements)) {
        return []
      }
      
      // Add category to each enhancement
      return parsed.enhancements.map((e: any) => ({
        ...e,
        category: category as any
      }))
    } catch (error: any) {
      console.error(`Error parsing ${category} enhancements:`, error.message)
      return []
    }
  }
  
  /**
   * Check if enhancement is safe to auto-apply
   */
  private isAutoApplicable(enhancement: AIEnhancement): boolean {
    // Safe to auto-apply:
    // - Adding monitoring/logging
    // - Adding comments
    // - Adding tags
    // - Enabling encryption (if not already configured)
    
    const safeTypes = [
      'cloudwatch alarm',
      'logging',
      'tags',
      'encryption',
      'backup'
    ]
    
    const reasoning = enhancement.reasoning.toLowerCase()
    
    return safeTypes.some(type => reasoning.includes(type)) &&
           enhancement.type !== 'modification' // Don't auto-modify existing resources
  }
  
  /**
   * Count enhancements by category
   */
  private countByCategory(enhancements: AIEnhancement[]): Record<string, number> {
    const counts: Record<string, number> = {}
    
    for (const enhancement of enhancements) {
      counts[enhancement.category] = (counts[enhancement.category] || 0) + 1
    }
    
    return counts
  }
  
  /**
   * Estimate impact of enhancements
   */
  private estimateImpact(
    enhancements: AIEnhancement[],
    schema: InfrastructureSchema
  ): any {
    const impact: any = {}
    
    // Count cost-related enhancements
    const costEnhancements = enhancements.filter(e => e.category === 'cost')
    if (costEnhancements.length > 0) {
      // Rough estimate: each optimization saves 10-30%
      const avgSavings = 20
      impact.costSavings = `~${avgSavings * costEnhancements.length}% potential savings`
    }
    
    // Count security enhancements
    const securityEnhancements = enhancements.filter(e => e.category === 'security')
    if (securityEnhancements.length > 0) {
      const baseScore = 60
      const improvement = Math.min(40, securityEnhancements.length * 8)
      impact.securityScore = `+${improvement} points (${baseScore} → ${baseScore + improvement})`
    }
    
    // Count performance enhancements
    const perfEnhancements = enhancements.filter(e => e.category === 'performance')
    if (perfEnhancements.length > 0) {
      impact.performanceGain = `~${perfEnhancements.length * 15}% faster response times`
    }
    
    return impact
  }
  
  /**
   * Apply enhancements to files
   */
  async applyEnhancements(
    files: GeneratedFile[],
    enhancements: AIEnhancement[]
  ): Promise<GeneratedFile[]> {
    console.log(`🔧 Applying ${enhancements.length} enhancements...`)
    
    const enhanced = [...files]
    let applied = 0
    
    for (const enhancement of enhancements) {
      try {
        if (enhancement.type === 'new-file') {
          // Add new file
          enhanced.push({
            path: enhancement.file,
            content: enhancement.content || '',
            description: enhancement.reasoning,
            source: 'ai-enhanced'
          })
          applied++
        } else if (enhancement.type === 'addition') {
          // Add content to existing file
          const fileIndex = enhanced.findIndex(f => f.path === enhancement.file)
          
          if (fileIndex !== -1) {
            const file = enhanced[fileIndex]
            
            if (enhancement.insertAt) {
              // Insert at specific location
              const lines = file.content.split('\n')
              const insertLine = enhancement.insertAt.line
              
              if (enhancement.insertAt.position === 'after') {
                lines.splice(insertLine + 1, 0, enhancement.content || '')
              } else {
                lines.splice(insertLine, 0, enhancement.content || '')
              }
              
              enhanced[fileIndex] = {
                ...file,
                content: lines.join('\n'),
                source: 'ai-enhanced'
              }
            } else {
              // Append to end
              enhanced[fileIndex] = {
                ...file,
                content: file.content + '\n\n' + (enhancement.content || ''),
                source: 'ai-enhanced'
              }
            }
            
            applied++
          }
        }
      } catch (error: any) {
        console.error(`Error applying enhancement:`, error.message)
      }
    }
    
    console.log(`✅ Applied ${applied} enhancements`)
    
    return enhanced
  }
}

/**
 * Quick helper to get enhancement suggestions
 */
export async function getEnhancementSuggestions(
  files: GeneratedFile[],
  schema: InfrastructureSchema,
  focusAreas: ('security' | 'performance' | 'cost' | 'monitoring')[] = ['security', 'cost']
): Promise<EnhancementResult> {
  const engine = new AIEnhancementEngine()
  return engine.enhanceInfrastructure(files, schema, { focusAreas })
}
