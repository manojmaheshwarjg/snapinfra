/**
 * Infrastructure Schema Validator
 * 
 * Validates infrastructure schemas using Zod to ensure correctness
 * before IaC generation. This prevents invalid schemas from causing
 * generation failures.
 */

import { z } from 'zod'
import type { ValidationResult } from './schema-types'

/**
 * Resource type enum
 */
const resourceTypeSchema = z.enum([
  'database',
  'compute',
  'cache',
  'storage',
  'network',
  'queue',
  'monitoring',
  'cdn',
  'loadbalancer'
])

/**
 * Cloud provider enum
 */
const cloudProviderSchema = z.enum(['aws', 'azure', 'gcp', 'multi'])

/**
 * Environment enum
 */
const environmentSchema = z.enum(['development', 'staging', 'production'])

/**
 * Project metadata schema
 */
const projectMetadataSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .regex(/^[a-z][a-z0-9-]*$/, 'Project name must be kebab-case (lowercase, hyphens only)'),
  description: z.string().min(1, 'Project description is required'),
  environment: environmentSchema.optional(),
  tags: z.record(z.string()).optional()
})

/**
 * Resource definition schema
 */
const resourceDefinitionSchema = z.object({
  type: resourceTypeSchema,
  provider: cloudProviderSchema,
  properties: z.record(z.any()),
  reasoning: z.string().optional(),
  dependsOn: z.array(z.string()).optional(),
  metadata: z.object({
    estimatedCost: z.string().optional(),
    deploymentTime: z.string().optional(),
    complexity: z.enum(['low', 'medium', 'high']).optional()
  }).optional()
})

/**
 * Recommendations schema
 */
const recommendationsSchema = z.object({
  costOptimizations: z.array(z.string()).optional(),
  securityImprovements: z.array(z.string()).optional(),
  scalabilityNotes: z.array(z.string()).optional()
}).optional()

/**
 * Main infrastructure schema validator
 */
export const infrastructureSchemaValidator = z.object({
  project: projectMetadataSchema,
  resources: z.record(resourceDefinitionSchema)
    .refine(
      (resources) => Object.keys(resources).length > 0,
      { message: 'At least one resource must be defined' }
    ),
  recommendations: recommendationsSchema
})

/**
 * User preferences schema
 */
export const userPreferencesSchema = z.object({
  cost: z.enum(['minimal', 'balanced', 'performance']).optional(),
  scale: z.enum(['startup', 'growth', 'enterprise']).optional(),
  compliance: z.array(z.enum(['hipaa', 'sox', 'gdpr', 'pci-dss'])).optional(),
  region: z.string().optional(),
  availabilityZones: z.number().min(1).max(6).optional(),
  backupRetention: z.number().min(0).max(365).optional()
})

/**
 * AI schema context validator
 */
export const aiSchemaContextValidator = z.object({
  project: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    schema: z.array(z.any()).optional(),
    endpoints: z.array(z.any()).optional(),
    database: z.object({ type: z.string() }).optional(),
    architecture: z.object({
      nodes: z.array(z.any()).optional(),
      edges: z.array(z.any()).optional()
    }).optional()
  }),
  userPreferences: userPreferencesSchema.optional(),
  architectureHints: z.string().optional(),
  budget: z.number().positive().optional()
})

/**
 * Validate infrastructure schema
 */
export function validateInfrastructureSchema(schema: unknown): ValidationResult {
  const result = infrastructureSchemaValidator.safeParse(schema)
  
  if (result.success) {
    // Additional cross-validation
    const warnings: string[] = []
    const data = result.data
    
    // Check for circular dependencies
    const circularDeps = detectCircularDependencies(data.resources)
    if (circularDeps.length > 0) {
      return {
        valid: false,
        errors: [`Circular dependencies detected: ${circularDeps.join(' -> ')}`]
      }
    }
    
    // Check for missing dependency references
    const missingDeps = checkMissingDependencies(data.resources)
    if (missingDeps.length > 0) {
      warnings.push(`Referenced resources not found: ${missingDeps.join(', ')}`)
    }
    
    // Check resource naming conflicts
    const namingIssues = checkResourceNaming(data.resources)
    if (namingIssues.length > 0) {
      warnings.push(...namingIssues)
    }
    
    return {
      valid: true,
      warnings: warnings.length > 0 ? warnings : undefined
    }
  }
  
  return {
    valid: false,
    errors: result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    )
  }
}

/**
 * Validate AI schema context
 */
export function validateAISchemaContext(context: unknown): ValidationResult {
  const result = aiSchemaContextValidator.safeParse(context)
  
  if (result.success) {
    return { valid: true }
  }
  
  return {
    valid: false,
    errors: result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    )
  }
}

/**
 * Validate user preferences
 */
export function validateUserPreferences(preferences: unknown): ValidationResult {
  const result = userPreferencesSchema.safeParse(preferences)
  
  if (result.success) {
    return { valid: true }
  }
  
  return {
    valid: false,
    errors: result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    )
  }
}

/**
 * Detect circular dependencies in resource graph
 */
function detectCircularDependencies(
  resources: Record<string, any>
): string[] {
  const visited = new Set<string>()
  const recursionStack = new Set<string>()
  const cycle: string[] = []
  
  function dfs(resourceName: string, path: string[]): boolean {
    if (recursionStack.has(resourceName)) {
      // Found cycle
      const cycleStart = path.indexOf(resourceName)
      return true
    }
    
    if (visited.has(resourceName)) {
      return false
    }
    
    visited.add(resourceName)
    recursionStack.add(resourceName)
    path.push(resourceName)
    
    const resource = resources[resourceName]
    if (resource?.dependsOn) {
      for (const dep of resource.dependsOn) {
        if (dfs(dep, [...path])) {
          cycle.push(...path, dep)
          return true
        }
      }
    }
    
    recursionStack.delete(resourceName)
    return false
  }
  
  for (const resourceName of Object.keys(resources)) {
    if (!visited.has(resourceName)) {
      if (dfs(resourceName, [])) {
        return cycle
      }
    }
  }
  
  return []
}

/**
 * Check for missing dependency references
 */
function checkMissingDependencies(
  resources: Record<string, any>
): string[] {
  const resourceNames = new Set(Object.keys(resources))
  const missing: string[] = []
  
  for (const [name, resource] of Object.entries(resources)) {
    if (resource.dependsOn) {
      for (const dep of resource.dependsOn) {
        if (!resourceNames.has(dep)) {
          missing.push(`${name} depends on non-existent resource: ${dep}`)
        }
      }
    }
  }
  
  return missing
}

/**
 * Check resource naming conventions
 */
function checkResourceNaming(
  resources: Record<string, any>
): string[] {
  const issues: string[] = []
  
  for (const name of Object.keys(resources)) {
    // Check for naming consistency
    if (name.includes('_') && name.includes('-')) {
      issues.push(`Resource '${name}' mixes underscores and hyphens - choose one convention`)
    }
    
    // Check for reserved names
    const reserved = ['default', 'aws', 'azure', 'gcp', 'terraform', 'pulumi']
    if (reserved.includes(name.toLowerCase())) {
      issues.push(`Resource name '${name}' is a reserved word`)
    }
    
    // Check length
    if (name.length > 64) {
      issues.push(`Resource name '${name}' exceeds maximum length of 64 characters`)
    }
  }
  
  return issues
}

/**
 * Quick validation helper that returns boolean
 */
export function isValidInfrastructureSchema(schema: unknown): boolean {
  return validateInfrastructureSchema(schema).valid
}

/**
 * Get validation errors as formatted string
 */
export function getValidationErrorsString(result: ValidationResult): string {
  if (result.valid) return ''
  
  const errors = result.errors || []
  const warnings = result.warnings || []
  
  let message = ''
  
  if (errors.length > 0) {
    message += 'Errors:\n' + errors.map(e => `  - ${e}`).join('\n')
  }
  
  if (warnings.length > 0) {
    if (message) message += '\n\n'
    message += 'Warnings:\n' + warnings.map(w => `  - ${w}`).join('\n')
  }
  
  return message
}
