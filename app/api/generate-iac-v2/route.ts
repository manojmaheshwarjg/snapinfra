/**
 * IaC Generation V2 - Intelligent Schema-Based Approach
 * 
 * This endpoint uses the hybrid AI + Pulumi-inspired approach:
 * 1. AI analyzes requirements and generates validated schema
 * 2. Schema is used to generate IaC with templates (coming in Phase 2)
 * 3. AI enhances with best practices
 * 
 * For now, this demonstrates Phase 1: Intelligent Schema Generation
 */

import { NextResponse } from 'next/server'
import { generateIntelligentSchema } from '@/lib/iac/ai-schema-designer'
import { HybridTemplateRenderer } from '@/lib/iac/template-renderer'
import { AIEnhancementEngine } from '@/lib/iac/ai-enhancement-engine'
import type { AISchemaContext } from '@/lib/iac/schema-types'
import { generateDiff } from '@/lib/utils/diff-generator'
import { generatePipeline } from '@/lib/cicd/pipeline-generator'
import { calculateCost } from '@/lib/cost/cost-calculator'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { project, options } = body || {}

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'No project provided' },
        { status: 400 }
      )
    }

    console.log('🚀 Starting Intelligent IaC Generation (V2)')
    console.log('   Project:', project.name)
    console.log('   Tables:', project.schema?.length || 0)
    console.log('   Endpoints:', project.endpoints?.length || 0)

    // Prepare context for AI schema generation
    const context: AISchemaContext = {
      project: {
        name: project.name,
        description: project.description,
        schema: project.schema,
        endpoints: project.endpoints,
        database: project.database,
        architecture: project.architecture
      },
      userPreferences: options?.preferences || {
        cost: options?.costPreference || 'balanced',
        scale: options?.scalePreference || 'startup',
        compliance: options?.compliance || []
      },
      architectureHints: options?.architectureHints,
      budget: options?.budget
    }

    // PHASE 1: Generate intelligent schema
    console.log('🧠 Phase 1: AI analyzing and designing infrastructure schema...')
    
    const schemaResult = await generateIntelligentSchema(context)
    
    console.log('✅ Schema generated successfully!')
    console.log('   Resources:', Object.keys(schemaResult.schema.resources).length)
    console.log('   Estimated Cost: $', schemaResult.estimatedMonthlyCost.min, '-', schemaResult.estimatedMonthlyCost.max, '/month')
    
    // Log AI reasoning
    console.log('💡 AI Reasoning:')
    for (const [resource, reason] of Object.entries(schemaResult.reasoning)) {
      console.log(`   ${resource}: ${reason}`)
    }

    // PHASE 2: Generate IaC from schema using TEMPLATES! ✨
    console.log('🏗️  Phase 2: Generating IaC files from templates...')
    
    const renderer = new HybridTemplateRenderer()
    const targets = options?.targets || ['terraform', 'docker-compose']
    
    // Generate IaC for each target
    let allFiles: any[] = []
    let instructions = ''
    
    for (const target of targets) {
      console.log(`📝 Rendering ${target}...`)
      
      try {
        const files = await renderer.render(schemaResult.schema, {
          target: target as any,
          environment: options?.environment || 'development',
          enableAIEnhancements: options?.enableAIEnhancements !== false,
          includeComments: true,
          includeMonitoring: true
        })
        
        allFiles.push(...files)
        console.log(`✅ Generated ${files.length} ${target} files`)
      } catch (error: any) {
        console.error(`❌ Error generating ${target}:`, error.message)
        // Continue with other targets
      }
    }
    
    if (allFiles.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No IaC files could be generated',
        schema: schemaResult.schema,
        reasoning: schemaResult.reasoning,
        recommendations: schemaResult.recommendations,
        analysis: schemaResult.analysis
      }, { status: 500 })
    }
    
    // Validate generated files
    const validation = await renderer.validate(allFiles)
    if (!validation.valid) {
      console.warn('⚠️  Some files failed validation:', validation.errors)
    }
    
    // Generate deployment instructions
    instructions = generateInstructions(schemaResult.schema, targets, options?.environment)

    console.log('✅ IaC files generated successfully!')
    console.log('   Files:', allFiles.length)
    console.log('   Validation:', validation.valid ? 'PASSED' : 'WARNINGS')
    
    // PHASE 4: Generate CI/CD Pipeline (Optional)
    let pipelineResult = null
    if (options?.generatePipeline !== false) {
      console.log('🔧 Phase 4: Generating CI/CD pipeline...')
      
      try {
        const pipelineConfig = {
          provider: options?.pipelineProvider || 'github-actions',
          target: targets[0] || 'terraform', // Use first target
          projectName: project.name,
          environment: options?.environment || 'development',
          features: {
            enableTesting: options?.enableTesting !== false,
            enableLinting: options?.enableLinting !== false,
            enableSecurity: options?.enableSecurity !== false,
            enableCaching: true,
            enableNotifications: false
          }
        }
        
        pipelineResult = generatePipeline(pipelineConfig)
        console.log('✅ Pipeline generated:', pipelineResult.fileName)
      } catch (error: any) {
        console.error('⚠️  Pipeline generation failed:', error.message)
      }
    }
    
    // PHASE 5: Calculate Infrastructure Cost
    let costEstimate = null
    if (options?.calculateCost !== false) {
      console.log('💰 Phase 5: Calculating infrastructure costs...')
      
      try {
        const provider = options?.cloudProvider || 'aws'
        costEstimate = calculateCost(schemaResult.schema, provider)
        
        console.log('✅ Cost calculated')
        console.log('   Monthly:', `$${costEstimate.monthly.toFixed(2)}`)
        console.log('   Yearly:', `$${costEstimate.yearly.toFixed(2)}`)
      } catch (error: any) {
        console.error('⚠️  Cost calculation failed:', error.message)
      }
    }
    
    // PHASE 6: Generate Code Diffs (if previous version exists)
    let codeDiffs = null
    if (options?.previousVersion && options?.showDiff !== false) {
      console.log('📊 Phase 6: Generating code diffs...')
      
      try {
        codeDiffs = []
        for (const file of allFiles) {
          const previousFile = options.previousVersion.files?.find(
            (f: any) => f.path === file.path
          )
          
          if (previousFile) {
            const diff = generateDiff(
              previousFile.content,
              file.content,
              file.path
            )
            codeDiffs.push(diff)
          }
        }
        
        console.log('✅ Generated diffs for', codeDiffs.length, 'files')
      } catch (error: any) {
        console.error('⚠️  Diff generation failed:', error.message)
      }
    }
    
    // PHASE 3: AI Enhancement (Optional)
    let aiEnhancements = null
    if (options?.enableAIEnhancements !== false) {
      console.log('🎨 Phase 3: AI analyzing for enhancements...')
      
      try {
        const enhancer = new AIEnhancementEngine()
        const enhancementResult = await enhancer.enhanceInfrastructure(
          allFiles,
          schemaResult.schema,
          {
            focusAreas: options?.enhancementFocus || ['security', 'cost', 'monitoring'],
            budget: options?.budget,
            compliance: options?.preferences?.compliance,
            autoApply: options?.autoApplyEnhancements === true
          }
        )
        
        aiEnhancements = enhancementResult
        
        console.log('✅ AI Enhancement complete!')
        console.log('   Total suggestions:', enhancementResult.summary.total)
        console.log('   Auto-applicable:', enhancementResult.autoApplicable.length)
        console.log('   Requires review:', enhancementResult.requiresReview.length)
        
        // Auto-apply safe enhancements if requested
        if (options?.autoApplyEnhancements && enhancementResult.autoApplicable.length > 0) {
          console.log('🔧 Auto-applying safe enhancements...')
          allFiles = await enhancer.applyEnhancements(allFiles, enhancementResult.autoApplicable)
        }
      } catch (error: any) {
        console.error('⚠️  AI enhancement failed:', error.message)
        // Continue without enhancements
      }
    }

    // Return comprehensive result
    return NextResponse.json({
      success: true,
      data: {
        // Schema information
        schema: schemaResult.schema,
        reasoning: schemaResult.reasoning,
        recommendations: schemaResult.recommendations,
        analysis: schemaResult.analysis,
        estimatedCost: schemaResult.estimatedMonthlyCost,
        
        // Generated IaC files
        files: allFiles,
        instructions,
        dependencies: getDependencies(targets),
        validation: {
          valid: validation.valid,
          warnings: validation.warnings,
          errors: validation.errors
        },
        
        // AI enhancement suggestions
        enhancements: aiEnhancements ? {
          total: aiEnhancements.summary.total,
          byCategory: aiEnhancements.summary.byCategory,
          estimatedImpact: aiEnhancements.summary.estimatedImpact,
          suggestions: aiEnhancements.requiresReview,
          autoApplied: options?.autoApplyEnhancements ? aiEnhancements.autoApplicable : []
        } : null,
        
        // NEW: CI/CD Pipeline
        pipeline: pipelineResult,
        
        // NEW: Detailed Cost Estimate
        cost: costEstimate,
        
        // NEW: Code Diffs
        diffs: codeDiffs
      },
      metadata: {
        version: 'v2',
        approach: 'hybrid-template',
        features: [
          'AI analysis of requirements',
          'Validated infrastructure schema',
          'Template-based IaC generation',
          'Guaranteed valid syntax',
          'AI enhancement suggestions',
          'Intelligent resource sizing',
          'Cost estimation',
          'Security & performance improvements',
          'CI/CD pipeline generation',
          'Multi-cloud cost analysis',
          'Code diff visualization'
        ],
        phase: 'Phase 6: Full Feature Integration ACTIVE'
      }
    })

  } catch (error: any) {
    console.error('❌ Intelligent IaC generation error:', error)
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to generate intelligent IaC',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}

/**
 * Generate deployment instructions
 */
function generateInstructions(schema: any, targets: string[], environment?: string): string {
  let instructions = `# Deployment Instructions for ${schema.project.name}\n\n`
  
  if (targets.includes('terraform')) {
    instructions += `## Terraform Deployment\n\n`
    instructions += `1. Initialize Terraform:\n   \`\`\`bash\n   cd infra/terraform\n   terraform init\n   \`\`\`\n\n`
    instructions += `2. Review the plan:\n   \`\`\`bash\n   terraform plan\n   \`\`\`\n\n`
    instructions += `3. Apply the configuration:\n   \`\`\`bash\n   terraform apply\n   \`\`\`\n\n`
  }
  
  if (targets.includes('docker-compose')) {
    instructions += `## Docker Compose Deployment\n\n`
    instructions += `1. Copy environment file:\n   \`\`\`bash\n   cp .env.example .env\n   \`\`\`\n\n`
    instructions += `2. Edit .env with your values\n\n`
    instructions += `3. Start services:\n   \`\`\`bash\n   docker-compose up -d\n   \`\`\`\n\n`
    instructions += `4. Check status:\n   \`\`\`bash\n   docker-compose ps\n   \`\`\`\n\n`
  }
  
  return instructions
}

/**
 * Get required dependencies for targets
 */
function getDependencies(targets: string[]): string[] {
  const deps: string[] = []
  
  if (targets.includes('terraform')) {
    deps.push('Terraform >= 1.0')
    deps.push('AWS CLI configured')
  }
  
  if (targets.includes('docker-compose')) {
    deps.push('Docker >= 20.10')
    deps.push('Docker Compose >= 2.0')
  }
  
  return deps
}

/**
 * GET endpoint - returns information about the V2 API
 */
export async function GET() {
  return NextResponse.json({
    version: 'v2',
    name: 'Intelligent IaC Generation',
    description: 'Hybrid AI + Pulumi-inspired approach for reliable infrastructure generation',
    phases: {
      current: 'Phase 1: Intelligent Schema Generation',
      next: 'Phase 2: Template-Based IaC Generation',
      future: 'Phase 3: Resource Graph & Optimization'
    },
    features: {
      phase1: [
        'AI analyzes project requirements',
        'Generates validated infrastructure schema',
        'Provides AI reasoning for decisions',
        'Intelligent resource sizing',
        'Cost estimation',
        'Security and performance recommendations',
        'Fallback schema for reliability'
      ],
      phase2: [
        'Template-based IaC generation (coming soon)',
        'Guaranteed valid syntax',
        'Cross-file consistency',
        'AI enhancement of generated code'
      ],
      phase3: [
        'Resource dependency graph (coming soon)',
        'Automatic ordering',
        'Circular dependency detection',
        'Interactive chat refinement'
      ]
    },
    advantages: {
      reliability: 'Schema validation prevents invalid infrastructure',
      intelligence: 'AI makes smart decisions about sizing and configuration',
      transparency: 'AI explains its reasoning for each choice',
      cost: 'Upfront cost estimation before deployment',
      security: 'Built-in security recommendations'
    }
  })
}
