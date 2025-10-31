/**
 * Template Renderer - Hybrid AI + Template System
 * 
 * This renderer uses Handlebars templates to generate IaC with guaranteed
 * valid syntax, while AI provides intelligent enhancements.
 */

import Handlebars from 'handlebars'
import { readFileSync } from 'fs'
import { join } from 'path'
import type {
  ITemplateRenderer,
  GeneratedFile,
  RenderOptions,
  TemplateContext,
  ValidationReport,
  IaCTarget
} from './template-types'
import type { InfrastructureSchema } from './schema-types'

/**
 * Register Handlebars helper functions
 */
function registerHelpers() {
  // Naming convention helpers
  Handlebars.registerHelper('kebabCase', (str: string) => {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  })
  
  Handlebars.registerHelper('snakeCase', (str: string) => {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  })
  
  Handlebars.registerHelper('pascalCase', (str: string) => {
    return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, (_, c) => c.toUpperCase())
  })
  
  Handlebars.registerHelper('screamingSnakeCase', (str: string) => {
    return str.toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '')
  })
  
  // Comparison helper
  Handlebars.registerHelper('eq', (a, b) => a === b)
  Handlebars.registerHelper('or', (...args) => {
    return Array.prototype.slice.call(args, 0, -1).some(Boolean)
  })
  
  // Environment checker
  Handlebars.registerHelper('environment', function(this: any, env: string, options) {
    return this.environment === env ? options.fn(this) : options.inverse(this)
  })
}

/**
 * Hybrid Template Renderer
 */
export class HybridTemplateRenderer implements ITemplateRenderer {
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map()
  private templatesLoaded = false
  
  constructor() {
    registerHelpers()
  }
  
  /**
   * Load templates from filesystem
   */
  private async loadTemplates(): Promise<void> {
    if (this.templatesLoaded) return
    
    const templatesDir = join(process.cwd(), 'lib', 'iac', 'templates')
    
    try {
      // Terraform templates
      const tfDatabase = readFileSync(join(templatesDir, 'terraform', 'database.tf.hbs'), 'utf-8')
      const tfCompute = readFileSync(join(templatesDir, 'terraform', 'compute.tf.hbs'), 'utf-8')
      
      this.templates.set('terraform:database', Handlebars.compile(tfDatabase))
      this.templates.set('terraform:compute', Handlebars.compile(tfCompute))
      
      // Docker Compose template
      const dockerCompose = readFileSync(join(templatesDir, 'docker-compose', 'docker-compose.yml.hbs'), 'utf-8')
      this.templates.set('docker-compose', Handlebars.compile(dockerCompose))
      
      // AWS CDK templates
      const cdkDatabase = readFileSync(join(templatesDir, 'aws-cdk', 'database-stack.ts.hbs'), 'utf-8')
      const cdkApi = readFileSync(join(templatesDir, 'aws-cdk', 'api-stack.ts.hbs'), 'utf-8')
      
      this.templates.set('aws-cdk:database', Handlebars.compile(cdkDatabase))
      this.templates.set('aws-cdk:api', Handlebars.compile(cdkApi))
      
      // Kubernetes templates
      const k8sDeployment = readFileSync(join(templatesDir, 'kubernetes', 'deployment.yaml.hbs'), 'utf-8')
      const k8sService = readFileSync(join(templatesDir, 'kubernetes', 'service-ingress.yaml.hbs'), 'utf-8')
      
      this.templates.set('kubernetes:deployment', Handlebars.compile(k8sDeployment))
      this.templates.set('kubernetes:service', Handlebars.compile(k8sService))
      
      // Helm templates
      const helmChart = readFileSync(join(templatesDir, 'helm', 'Chart.yaml.hbs'), 'utf-8')
      const helmValues = readFileSync(join(templatesDir, 'helm', 'values.yaml.hbs'), 'utf-8')
      
      this.templates.set('helm:chart', Handlebars.compile(helmChart))
      this.templates.set('helm:values', Handlebars.compile(helmValues))
      
      this.templatesLoaded = true
      console.log('✅ Templates loaded successfully')
    } catch (error: any) {
      console.error('❌ Error loading templates:', error.message)
      throw new Error(`Failed to load templates: ${error.message}`)
    }
  }
  
  /**
   * Render IaC files from schema
   */
  async render(
    schema: InfrastructureSchema,
    options: RenderOptions
  ): Promise<GeneratedFile[]> {
    await this.loadTemplates()
    
    console.log(`🏗️  Rendering ${options.target} from validated schema...`)
    
    const files: GeneratedFile[] = []
    
    if (options.target === 'terraform') {
      files.push(...await this.renderTerraform(schema, options))
    } else if (options.target === 'docker-compose') {
      files.push(...await this.renderDockerCompose(schema, options))
    } else if (options.target === 'aws-cdk') {
      files.push(...await this.renderAwsCdk(schema, options))
    } else if (options.target === 'kubernetes') {
      files.push(...await this.renderKubernetes(schema, options))
    } else if (options.target === 'helm') {
      files.push(...await this.renderHelm(schema, options))
    } else {
      throw new Error(`Unsupported target: ${options.target}`)
    }
    
    console.log(`✅ Generated ${files.length} files from templates`)
    
    return files
  }
  
  /**
   * Render Terraform files
   */
  private async renderTerraform(
    schema: InfrastructureSchema,
    options: RenderOptions
  ): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = []
    const context = this.buildContext(schema, options)
    
    // Render each resource
    for (const [resourceName, resource] of Object.entries(schema.resources)) {
      const templateKey = `terraform:${resource.type}`
      const template = this.templates.get(templateKey)
      
      if (!template) {
        console.warn(`⚠️  No template found for ${resource.type}, skipping`)
        continue
      }
      
      const resourceContext: TemplateContext = {
        ...context,
        resourceName,
        resourceType: resource.type,
        resource,
        dependencies: resource.dependsOn || []
      }
      
      try {
        const content = template(resourceContext)
        
        files.push({
          path: `infra/terraform/${resourceName}.tf`,
          content,
          description: `Terraform configuration for ${resourceName}`,
          source: 'template',
          resourceType: resource.type
        })
      } catch (error: any) {
        console.error(`❌ Error rendering ${resourceName}:`, error.message)
      }
    }
    
    // Generate main.tf
    files.push({
      path: 'infra/terraform/main.tf',
      content: this.generateTerraformMain(schema),
      description: 'Main Terraform configuration',
      source: 'template'
    })
    
    // Generate variables.tf
    files.push({
      path: 'infra/terraform/variables.tf',
      content: this.generateTerraformVariables(schema),
      description: 'Terraform variables',
      source: 'template'
    })
    
    // Generate outputs.tf
    files.push({
      path: 'infra/terraform/outputs.tf',
      content: this.generateTerraformOutputs(schema),
      description: 'Terraform outputs',
      source: 'template'
    })
    
    // Generate .env.example
    files.push({
      path: '.env.example',
      content: this.generateEnvExample(schema),
      description: 'Environment variables template',
      source: 'template'
    })
    
    return files
  }
  
  /**
   * Render Docker Compose
   */
  private async renderDockerCompose(
    schema: InfrastructureSchema,
    options: RenderOptions
  ): Promise<GeneratedFile[]> {
    const template = this.templates.get('docker-compose')
    
    if (!template) {
      throw new Error('Docker Compose template not loaded')
    }
    
    const context = {
      projectName: schema.project.name,
      environment: options.environment || 'development',
      schema,
      naming: {
        kebabCase: (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        snakeCase: (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
        screamingSnakeCase: (str: string) => str.toUpperCase().replace(/[^A-Z0-9]+/g, '_'),
        pascalCase: (str: string) => str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      }
    }
    
    const content = template(context)
    
    return [
      {
        path: 'docker-compose.yml',
        content,
        description: 'Docker Compose configuration',
        source: 'template'
      },
      {
        path: '.env.example',
        content: this.generateDockerEnvExample(schema),
        description: 'Environment variables for Docker Compose',
        source: 'template'
      },
      {
        path: 'Dockerfile',
        content: this.generateDockerfile(),
        description: 'Dockerfile for application container',
        source: 'template'
      }
    ]
  }
  
  /**
   * Build template context
   */
  private buildContext(schema: InfrastructureSchema, options: RenderOptions): Partial<TemplateContext> {
    return {
      projectName: schema.project.name,
      projectDescription: schema.project.description,
      environment: options.environment || 'development',
      schema,
      outputs: {},
      tags: schema.project.tags || {},
      includeComments: options.includeComments !== false,
      naming: {
        kebabCase: (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        snakeCase: (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, ''),
        pascalCase: (str: string) => str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^(.)/, (_, c) => c.toUpperCase()),
        sanitize: (str: string) => str.replace(/[^a-zA-Z0-9-_]/g, '')
      }
    }
  }
  
  /**
   * Generate Terraform main.tf
   */
  private generateTerraformMain(schema: InfrastructureSchema): string {
    return `# Main Terraform configuration for ${schema.project.name}
# Generated by Snapinfra

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  # Uncomment for remote state
  # backend "s3" {
  #   bucket = "your-terraform-state-bucket"
  #   key    = "${schema.project.name}/terraform.tfstate"
  #   region = "us-east-1"
  # }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "${schema.project.name}"
      ManagedBy   = "Snapinfra"
      Environment = var.environment
    }
  }
}
`
  }
  
  /**
   * Generate Terraform variables.tf
   */
  private generateTerraformVariables(schema: InfrastructureSchema): string {
    let content = `# Variables for ${schema.project.name}
# Generated by Snapinfra

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "development"
  
  validation {
    condition     = contains(["development", "staging", "production"], var.environment)
    error_message = "Environment must be development, staging, or production"
  }
}
`
    
    return content
  }
  
  /**
   * Generate Terraform outputs.tf
   */
  private generateTerraformOutputs(schema: InfrastructureSchema): string {
    return `# Outputs for ${schema.project.name}
# Generated by Snapinfra

# Resource-specific outputs are defined in individual resource files
`
  }
  
  /**
   * Generate .env.example
   */
  private generateEnvExample(schema: InfrastructureSchema): string {
    let content = `# Environment variables for ${schema.project.name}
# Copy to .env and fill in your values

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

`
    
    // Add database credentials
    for (const [name, resource] of Object.entries(schema.resources)) {
      if (resource.type === 'database') {
        const upperName = name.toUpperCase().replace(/[^A-Z0-9]+/g, '_')
        content += `# ${name} credentials\n`
        content += `${upperName}_USERNAME=admin\n`
        content += `${upperName}_PASSWORD=your_secure_password\n\n`
      }
    }
    
    return content
  }
  
  /**
   * Generate Docker .env.example
   */
  private generateDockerEnvExample(schema: InfrastructureSchema): string {
    return `# Environment variables for ${schema.project.name}
# Copy to .env and fill in your values

# Database Configuration
DB_USERNAME=admin
DB_PASSWORD=password
DB_ROOT_PASSWORD=rootpassword

# Application Configuration
NODE_ENV=development
PORT=3000
`
  }
  
  /**
   * Generate Dockerfile
   */
  private generateDockerfile(): string {
    return `# Multi-stage Dockerfile
# Generated by Snapinfra

FROM node:18-alpine AS base
WORKDIR /app

# Dependencies
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production
FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]
`
  }
  
  /**
   * Validate generated files
   */
  async validate(files: GeneratedFile[]): Promise<ValidationReport> {
    const errors: any[] = []
    const warnings: any[] = []
    let validFiles = 0
    
    for (const file of files) {
      // Basic validation - check if content is not empty
      if (!file.content || file.content.trim().length === 0) {
        errors.push({
          file: file.path,
          message: 'Generated file is empty'
        })
      } else {
        validFiles++
      }
      
      // Check for template artifacts
      if (file.content.includes('{{') || file.content.includes('}}')) {
        warnings.push({
          file: file.path,
          message: 'File may contain unrendered template variables',
          suggestion: 'Check template context for missing data'
        })
      }
    }
    
    return {
      valid: errors.length === 0,
      totalFiles: files.length,
      validFiles,
      invalidFiles: files.length - validFiles,
      errors,
      warnings
    }
  }
  
  /**
   * Render AWS CDK files
   */
  private async renderAwsCdk(
    schema: InfrastructureSchema,
    options: RenderOptions
  ): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = []
    const context = this.buildContext(schema, options)
    
    // Database stack
    const dbTemplate = this.templates.get('aws-cdk:database')
    if (dbTemplate) {
      files.push({
        path: `lib/stacks/${schema.project.name}-database-stack.ts`,
        content: dbTemplate(context),
        description: 'AWS CDK database stack',
        source: 'template',
        resourceType: 'database'
      })
    }
    
    // API stack
    const apiTemplate = this.templates.get('aws-cdk:api')
    if (apiTemplate) {
      files.push({
        path: `lib/stacks/${schema.project.name}-api-stack.ts`,
        content: apiTemplate(context),
        description: 'AWS CDK API Gateway + Lambda stack',
        source: 'template',
        resourceType: 'compute'
      })
    }
    
    // CDK App file
    files.push({
      path: 'bin/app.ts',
      content: this.generateCdkApp(schema),
      description: 'CDK App entry point',
      source: 'template'
    })
    
    // package.json
    files.push({
      path: 'package.json',
      content: this.generateCdkPackageJson(schema),
      description: 'CDK project dependencies',
      source: 'template'
    })
    
    return files
  }
  
  /**
   * Render Kubernetes manifests
   */
  private async renderKubernetes(
    schema: InfrastructureSchema,
    options: RenderOptions
  ): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = []
    const context = this.buildContext(schema, options)
    
    // Deployment
    const deploymentTemplate = this.templates.get('kubernetes:deployment')
    if (deploymentTemplate) {
      files.push({
        path: `k8s/deployment.yaml`,
        content: deploymentTemplate(context),
        description: 'Kubernetes Deployment',
        source: 'template'
      })
    }
    
    // Service + Ingress + HPA
    const serviceTemplate = this.templates.get('kubernetes:service')
    if (serviceTemplate) {
      files.push({
        path: `k8s/service.yaml`,
        content: serviceTemplate(context),
        description: 'Kubernetes Service, Ingress, and HPA',
        source: 'template'
      })
    }
    
    // ConfigMap
    files.push({
      path: 'k8s/configmap.yaml',
      content: this.generateK8sConfigMap(schema),
      description: 'Kubernetes ConfigMap',
      source: 'template'
    })
    
    // Secret (placeholder)
    files.push({
      path: 'k8s/secret.yaml',
      content: this.generateK8sSecret(schema),
      description: 'Kubernetes Secret (base64 encoded)',
      source: 'template'
    })
    
    return files
  }
  
  /**
   * Render Helm chart
   */
  private async renderHelm(
    schema: InfrastructureSchema,
    options: RenderOptions
  ): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = []
    const context = this.buildContext(schema, options)
    
    // Chart.yaml
    const chartTemplate = this.templates.get('helm:chart')
    if (chartTemplate) {
      files.push({
        path: `helm/${schema.project.name}/Chart.yaml`,
        content: chartTemplate(context),
        description: 'Helm Chart metadata',
        source: 'template'
      })
    }
    
    // values.yaml
    const valuesTemplate = this.templates.get('helm:values')
    if (valuesTemplate) {
      files.push({
        path: `helm/${schema.project.name}/values.yaml`,
        content: valuesTemplate(context),
        description: 'Helm Chart values',
        source: 'template'
      })
    }
    
    // Re-use Kubernetes templates for chart templates
    const deploymentTemplate = this.templates.get('kubernetes:deployment')
    if (deploymentTemplate) {
      files.push({
        path: `helm/${schema.project.name}/templates/deployment.yaml`,
        content: deploymentTemplate(context),
        description: 'Helm template for Deployment',
        source: 'template'
      })
    }
    
    const serviceTemplate = this.templates.get('kubernetes:service')
    if (serviceTemplate) {
      files.push({
        path: `helm/${schema.project.name}/templates/service.yaml`,
        content: serviceTemplate(context),
        description: 'Helm template for Service',
        source: 'template'
      })
    }
    
    return files
  }
  
  /**
   * Generate CDK App entry point
   */
  private generateCdkApp(schema: InfrastructureSchema): string {
    return `#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ${this.pascalCase(schema.project.name)}DatabaseStack } from '../lib/stacks/${schema.project.name}-database-stack';
import { ${this.pascalCase(schema.project.name)}ApiStack } from '../lib/stacks/${schema.project.name}-api-stack';

const app = new cdk.App();

const environment = process.env.ENVIRONMENT || 'development';

const dbStack = new ${this.pascalCase(schema.project.name)}DatabaseStack(app, '${this.pascalCase(schema.project.name)}DatabaseStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  environment,
});

const apiStack = new ${this.pascalCase(schema.project.name)}ApiStack(app, '${this.pascalCase(schema.project.name)}ApiStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  databaseSecretArn: dbStack.secret.secretArn,
  environment,
});

apiStack.addDependency(dbStack);
`
  }
  
  /**
   * Generate CDK package.json
   */
  private generateCdkPackageJson(schema: InfrastructureSchema): string {
    return JSON.stringify({
      name: `${schema.project.name}-cdk`,
      version: '1.0.0',
      bin: {
        [schema.project.name]: 'bin/app.js'
      },
      scripts: {
        build: 'tsc',
        watch: 'tsc -w',
        cdk: 'cdk',
        deploy: 'cdk deploy --all',
        destroy: 'cdk destroy --all'
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        'aws-cdk': '^2.100.0',
        'ts-node': '^10.9.0',
        'typescript': '^5.0.0'
      },
      dependencies: {
        'aws-cdk-lib': '^2.100.0',
        'constructs': '^10.0.0',
        'source-map-support': '^0.5.21'
      }
    }, null, 2)
  }
  
  /**
   * Generate Kubernetes ConfigMap
   */
  private generateK8sConfigMap(schema: InfrastructureSchema): string {
    return `apiVersion: v1
kind: ConfigMap
metadata:
  name: ${this.kebabCase(schema.project.name)}-config
  namespace: default
data:
  NODE_ENV: "production"
  LOG_LEVEL: "info"
`
  }
  
  /**
   * Generate Kubernetes Secret
   */
  private generateK8sSecret(schema: InfrastructureSchema): string {
    return `apiVersion: v1
kind: Secret
metadata:
  name: ${this.kebabCase(schema.project.name)}-secret
  namespace: default
type: Opaque
data:
  # Base64 encoded values
  # Use: echo -n 'value' | base64
  DATABASE_PASSWORD: ""
`
  }
  
  // Helper methods
  private kebabCase(str: string): string {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }
  
  private pascalCase(str: string): string {
    return str.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '')
      .replace(/^(.)/, (_, c) => c.toUpperCase())
  }
  
  /**
   * Get supported targets
   */
  getSupportedTargets(): IaCTarget[] {
    return ['terraform', 'docker-compose', 'aws-cdk', 'kubernetes', 'helm']
  }
}
