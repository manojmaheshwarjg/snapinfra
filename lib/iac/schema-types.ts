/**
 * Infrastructure Schema Types
 * 
 * Pulumi-inspired type definitions for defining infrastructure resources
 * in a structured, validated way before IaC generation.
 */

export type ResourceType = 
  | 'database' 
  | 'compute' 
  | 'cache' 
  | 'storage' 
  | 'network'
  | 'queue'
  | 'monitoring'
  | 'cdn'
  | 'loadbalancer'

export type CloudProvider = 'aws' | 'azure' | 'gcp' | 'multi'

export type CostPreference = 'minimal' | 'balanced' | 'performance'
export type ScalePreference = 'startup' | 'growth' | 'enterprise'
export type ComplianceRequirement = 'hipaa' | 'sox' | 'gdpr' | 'pci-dss'

/**
 * Main infrastructure schema that defines all resources
 */
export interface InfrastructureSchema {
  project: ProjectMetadata
  resources: Record<string, ResourceDefinition>
  recommendations?: {
    costOptimizations?: string[]
    securityImprovements?: string[]
    scalabilityNotes?: string[]
  }
}

/**
 * Project metadata
 */
export interface ProjectMetadata {
  name: string // kebab-case
  description: string
  environment?: 'development' | 'staging' | 'production'
  tags?: Record<string, string>
}

/**
 * Individual resource definition
 */
export interface ResourceDefinition {
  type: ResourceType
  provider: CloudProvider
  properties: Record<string, any>
  reasoning?: string // AI explains why it chose these specs
  dependsOn?: string[] // Resource dependencies
  metadata?: {
    estimatedCost?: string
    deploymentTime?: string
    complexity?: 'low' | 'medium' | 'high'
  }
}

/**
 * Property specification for validation
 */
export interface PropertySpec {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object'
  required?: boolean
  default?: any
  enum?: any[]
  description?: string
  validation?: {
    min?: number
    max?: number
    pattern?: string
  }
}

/**
 * User preferences for schema generation
 */
export interface UserPreferences {
  cost?: CostPreference
  scale?: ScalePreference
  compliance?: ComplianceRequirement[]
  region?: string
  availabilityZones?: number
  backupRetention?: number // days
}

/**
 * Context for AI schema generation
 */
export interface AISchemaContext {
  project: {
    name: string
    description: string
    schema?: any[] // Database tables
    endpoints?: any[] // API endpoints
    database?: { type: string }
    architecture?: {
      nodes?: any[]
      edges?: any[]
    }
  }
  userPreferences?: UserPreferences
  architectureHints?: string // e.g., "microservices", "monolith", "serverless"
  budget?: number // monthly budget in USD
}

/**
 * Project analysis metrics
 */
export interface ProjectAnalysis {
  tableCount: number
  totalFields: number
  estimatedDataSize: 'small' | 'medium' | 'large' | 'xlarge'
  endpointCount: number
  readWriteRatio: {
    read: number // percentage
    write: number // percentage
  }
  complexity: 'low' | 'medium' | 'high'
  recommendedCompute: string
  recommendedDatabase: string
}

/**
 * Result from intelligent schema generation
 */
export interface IntelligentSchemaResult {
  schema: InfrastructureSchema
  reasoning: Record<string, string> // resource name -> reasoning
  recommendations: {
    cost: string[]
    security: string[]
    scalability: string[]
    performance: string[]
  }
  analysis: ProjectAnalysis
  estimatedMonthlyCost: {
    min: number
    max: number
    currency: string
  }
}

/**
 * Dependency graph for resource ordering
 */
export interface DependencyGraph {
  nodes: DependencyNode[]
  edges: DependencyEdge[]
}

export interface DependencyNode {
  id: string
  resourceName: string
  type: ResourceType
}

export interface DependencyEdge {
  from: string
  to: string
  relationship: 'depends_on' | 'references' | 'provides_to'
}

/**
 * Resource reference (for cross-resource dependencies)
 */
export interface ResourceReference {
  resource: string
  property: string
  transform?: (value: any) => any
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean
  errors?: string[]
  warnings?: string[]
}

/**
 * Common AWS resource types and their properties
 */
export namespace AWSResources {
  export interface RDSDatabase extends ResourceDefinition {
    type: 'database'
    provider: 'aws'
    properties: {
      engine: 'postgres' | 'mysql' | 'mariadb' | 'oracle' | 'sqlserver'
      engineVersion?: string
      instanceClass: string // e.g., 'db.t3.micro'
      allocatedStorage: number // GB
      storageType?: 'gp2' | 'gp3' | 'io1'
      multiAZ?: boolean
      backupRetentionPeriod?: number
      backupWindow?: string
      maintenanceWindow?: string
      publiclyAccessible?: boolean
      vpcSecurityGroupIds?: string[]
      subnetGroupName?: string
    }
  }

  export interface ECSService extends ResourceDefinition {
    type: 'compute'
    provider: 'aws'
    properties: {
      clusterName: string
      serviceName: string
      taskDefinition: string
      desiredCount: number
      launchType: 'FARGATE' | 'EC2'
      cpu?: string // vCPU units
      memory?: string // MB
      containerPort?: number
      loadBalancer?: boolean
    }
  }

  export interface ElastiCacheRedis extends ResourceDefinition {
    type: 'cache'
    provider: 'aws'
    properties: {
      engine: 'redis'
      engineVersion?: string
      nodeType: string // e.g., 'cache.t3.micro'
      numCacheNodes: number
      automaticFailoverEnabled?: boolean
      transitEncryptionEnabled?: boolean
      atRestEncryptionEnabled?: boolean
    }
  }
}
