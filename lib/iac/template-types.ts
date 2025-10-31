/**
 * Template System Type Definitions
 * 
 * Types for the hybrid template + AI IaC generation system.
 * Templates guarantee valid syntax, AI provides intelligence.
 */

import type { InfrastructureSchema, ResourceDefinition } from './schema-types'

/**
 * Supported IaC targets
 */
export type IaCTarget = 
  | 'terraform'
  | 'aws-cdk'
  | 'kubernetes'
  | 'docker-compose'
  | 'helm'
  | 'azure-bicep'
  | 'gcp-terraform'

/**
 * Template metadata
 */
export interface TemplateMetadata {
  name: string
  description: string
  target: IaCTarget
  resourceType: string
  version: string
  author?: string
}

/**
 * Template context for rendering
 */
export interface TemplateContext {
  // Project information
  projectName: string
  projectDescription: string
  environment: 'development' | 'staging' | 'production'
  
  // Resource being rendered
  resourceName: string
  resourceType: string
  resource: ResourceDefinition
  
  // Full schema for cross-references
  schema: InfrastructureSchema
  
  // Helper data
  dependencies: string[]
  outputs: Record<string, string>
  tags: Record<string, string>
  
  // Naming conventions
  naming: {
    kebabCase: (str: string) => string
    snakeCase: (str: string) => string
    pascalCase: (str: string) => string
    sanitize: (str: string) => string
  }
}

/**
 * Generated file from template
 */
export interface GeneratedFile {
  path: string
  content: string
  description: string
  source: 'template' | 'ai-enhanced' | 'ai-generated'
  resourceType?: string
  validation?: {
    syntaxValid: boolean
    errors?: string[]
    warnings?: string[]
  }
}

/**
 * Template rendering options
 */
export interface RenderOptions {
  target: IaCTarget
  environment?: 'development' | 'staging' | 'production'
  enableAIEnhancements?: boolean
  includeComments?: boolean
  includeMonitoring?: boolean
  strictMode?: boolean
}

/**
 * Template renderer interface
 */
export interface ITemplateRenderer {
  /**
   * Render IaC files from schema
   */
  render(
    schema: InfrastructureSchema,
    options: RenderOptions
  ): Promise<GeneratedFile[]>
  
  /**
   * Validate generated content
   */
  validate(files: GeneratedFile[]): Promise<ValidationReport>
  
  /**
   * Get supported targets
   */
  getSupportedTargets(): IaCTarget[]
}

/**
 * Validation report
 */
export interface ValidationReport {
  valid: boolean
  totalFiles: number
  validFiles: number
  invalidFiles: number
  errors: FileValidationError[]
  warnings: FileValidationWarning[]
}

export interface FileValidationError {
  file: string
  line?: number
  column?: number
  message: string
  code?: string
}

export interface FileValidationWarning {
  file: string
  message: string
  suggestion?: string
}

/**
 * AI enhancement request
 */
export interface AIEnhancementRequest {
  baseFiles: GeneratedFile[]
  schema: InfrastructureSchema
  options: {
    focusAreas?: ('security' | 'performance' | 'cost' | 'monitoring')[]
    constraints?: {
      budget?: number
      compliance?: string[]
    }
  }
}

/**
 * AI enhancement result
 */
export interface AIEnhancement {
  type: 'addition' | 'modification' | 'new-file'
  file: string
  content?: string
  insertAt?: {
    line: number
    position: 'before' | 'after'
  }
  reasoning: string
  category: 'security' | 'performance' | 'cost' | 'monitoring' | 'best-practice'
  impact: {
    cost?: string
    security?: string
    performance?: string
  }
}

/**
 * Template cache entry
 */
export interface TemplateCacheEntry {
  template: HandlebarsTemplateDelegate
  metadata: TemplateMetadata
  compiled: Date
}

/**
 * Handlebars template delegate type
 */
export type HandlebarsTemplateDelegate<T = any> = (context: T, options?: any) => string

/**
 * Resource naming strategy
 */
export interface NamingStrategy {
  projectPrefix: string
  separator: '-' | '_'
  resourceNames: Record<string, string>
  environmentSuffix?: string
}

/**
 * Terraform-specific types
 */
export namespace Terraform {
  export interface Resource {
    type: string
    name: string
    properties: Record<string, any>
    dependsOn?: string[]
    lifecycle?: {
      createBeforeDestroy?: boolean
      preventDestroy?: boolean
      ignoreChanges?: string[]
    }
    provisioner?: Provisioner[]
  }
  
  export interface Provisioner {
    type: 'local-exec' | 'remote-exec' | 'file'
    config: Record<string, any>
  }
  
  export interface Variable {
    name: string
    type: string
    description?: string
    default?: any
    sensitive?: boolean
    validation?: {
      condition: string
      errorMessage: string
    }
  }
  
  export interface Output {
    name: string
    value: string
    description?: string
    sensitive?: boolean
  }
}

/**
 * AWS CDK-specific types
 */
export namespace AWSCDK {
  export interface Stack {
    name: string
    description: string
    constructs: Construct[]
    outputs: CDKOutput[]
  }
  
  export interface Construct {
    type: string
    id: string
    props: Record<string, any>
  }
  
  export interface CDKOutput {
    id: string
    value: string
    exportName?: string
    description?: string
  }
}

/**
 * Docker Compose-specific types
 */
export namespace DockerCompose {
  export interface Service {
    name: string
    image?: string
    build?: {
      context: string
      dockerfile?: string
    }
    ports?: string[]
    environment?: Record<string, string>
    volumes?: string[]
    dependsOn?: string[]
    networks?: string[]
    healthcheck?: {
      test: string[]
      interval?: string
      timeout?: string
      retries?: number
    }
  }
  
  export interface Network {
    name: string
    driver?: string
    ipam?: {
      config: Array<{ subnet: string }>
    }
  }
  
  export interface Volume {
    name: string
    driver?: string
    driverOpts?: Record<string, string>
  }
}

/**
 * Kubernetes-specific types
 */
export namespace Kubernetes {
  export interface Deployment {
    name: string
    namespace?: string
    replicas: number
    selector: Record<string, string>
    template: PodTemplate
  }
  
  export interface PodTemplate {
    metadata: {
      labels: Record<string, string>
    }
    spec: {
      containers: Container[]
      volumes?: Volume[]
    }
  }
  
  export interface Container {
    name: string
    image: string
    ports?: Array<{ containerPort: number }>
    env?: Array<{ name: string; value?: string; valueFrom?: any }>
    resources?: {
      requests?: { cpu: string; memory: string }
      limits?: { cpu: string; memory: string }
    }
  }
  
  export interface Service {
    name: string
    namespace?: string
    type: 'ClusterIP' | 'NodePort' | 'LoadBalancer'
    selector: Record<string, string>
    ports: Array<{
      port: number
      targetPort: number
      protocol?: 'TCP' | 'UDP'
    }>
  }
  
  export interface Volume {
    name: string
    persistentVolumeClaim?: { claimName: string }
    configMap?: { name: string }
    secret?: { secretName: string }
  }
}
