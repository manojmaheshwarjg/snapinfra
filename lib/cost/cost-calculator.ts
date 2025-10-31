/**
 * Cost Calculation Engine
 * 
 * Calculates infrastructure costs for AWS, Azure, and GCP
 * Based on resource configurations from schema
 */

import type { InfrastructureSchema, ResourceDefinition } from '../iac/schema-types';

export type CloudProvider = 'aws' | 'azure' | 'gcp';
export type Region = 'us-east-1' | 'us-west-2' | 'eu-west-1' | 'ap-southeast-1';

export interface CostEstimate {
  provider: CloudProvider;
  region: Region;
  monthly: number;
  yearly: number;
  currency: string;
  breakdown: CostBreakdown[];
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: Date;
}

export interface CostBreakdown {
  resourceName: string;
  resourceType: string;
  service: string;
  hourlyCost: number;
  monthlyCost: number;
  yearlyCost: number;
  details: {
    quantity: number;
    unit: string;
    pricePerUnit: number;
  };
}

export interface CostComparison {
  before: CostEstimate;
  after: CostEstimate;
  savings: number;
  savingsPercentage: number;
  recommendation: string;
}

/**
 * AWS Pricing (Simplified - US East 1)
 * Note: These are approximate prices for demonstration
 * In production, use AWS Price List API
 */
const AWS_PRICING = {
  // Compute
  'ec2.t3.micro': 0.0104, // per hour
  'ec2.t3.small': 0.0208,
  'ec2.t3.medium': 0.0416,
  'ec2.t3.large': 0.0832,
  'ec2.m5.large': 0.096,
  'ec2.m5.xlarge': 0.192,
  
  // Database
  'rds.db.t3.micro': 0.017,
  'rds.db.t3.small': 0.034,
  'rds.db.t3.medium': 0.068,
  'rds.db.m5.large': 0.17,
  'rds.storage.gp2': 0.115, // per GB/month
  'rds.storage.gp3': 0.096, // per GB/month
  
  // Lambda
  'lambda.requests': 0.0000002, // per request
  'lambda.duration': 0.0000166667, // per GB-second
  
  // Storage
  's3.standard': 0.023, // per GB/month
  'ebs.gp2': 0.10, // per GB/month
  'ebs.gp3': 0.08, // per GB/month
  
  // Network
  'data.transfer.out': 0.09, // per GB
  'nat.gateway': 0.045, // per hour
  
  // Container
  'ecs.fargate.cpu': 0.04048, // per vCPU/hour
  'ecs.fargate.memory': 0.004445, // per GB/hour
};

/**
 * Azure Pricing (Simplified - East US)
 */
const AZURE_PRICING = {
  // Compute
  'vm.B1s': 0.0104,
  'vm.B2s': 0.0416,
  'vm.D2s_v3': 0.096,
  
  // Database
  'sql.basic': 0.0068,
  'sql.standard.s0': 0.02,
  'sql.standard.s1': 0.04,
  
  // Storage
  'storage.blob': 0.0208,
  'storage.disk': 0.10,
  
  // Functions
  'functions.execution': 0.0000002,
  'functions.duration': 0.000016,
};

/**
 * GCP Pricing (Simplified - us-central1)
 */
const GCP_PRICING = {
  // Compute
  'compute.e2-micro': 0.0084,
  'compute.e2-small': 0.0168,
  'compute.e2-medium': 0.0336,
  'compute.n1-standard-1': 0.0475,
  
  // Database
  'sql.db-f1-micro': 0.0150,
  'sql.db-g1-small': 0.0350,
  'sql.storage': 0.17, // per GB/month
  
  // Storage
  'storage.standard': 0.020,
  'storage.persistent-disk': 0.04,
  
  // Functions
  'functions.invocations': 0.0000004,
  'functions.compute': 0.0000025,
};

export class CostCalculator {
  /**
   * Calculate total cost from infrastructure schema
   */
  calculateFromSchema(
    schema: InfrastructureSchema,
    provider: CloudProvider = 'aws',
    region: Region = 'us-east-1'
  ): CostEstimate {
    const breakdown: CostBreakdown[] = [];

    for (const [resourceName, resource] of Object.entries(schema.resources)) {
      const cost = this.calculateResourceCost(resourceName, resource, provider);
      if (cost) {
        breakdown.push(cost);
      }
    }

    const monthly = breakdown.reduce((sum, item) => sum + item.monthlyCost, 0);
    const yearly = monthly * 12;

    return {
      provider,
      region,
      monthly: Math.round(monthly * 100) / 100,
      yearly: Math.round(yearly * 100) / 100,
      currency: 'USD',
      breakdown,
      confidence: 'medium',
      lastUpdated: new Date(),
    };
  }

  /**
   * Calculate cost for a single resource
   */
  private calculateResourceCost(
    resourceName: string,
    resource: ResourceDefinition,
    provider: CloudProvider
  ): CostBreakdown | null {
    switch (resource.type) {
      case 'database':
        return this.calculateDatabaseCost(resourceName, resource, provider);
      case 'compute':
        return this.calculateComputeCost(resourceName, resource, provider);
      case 'storage':
        return this.calculateStorageCost(resourceName, resource, provider);
      default:
        return null;
    }
  }

  /**
   * Calculate database costs
   */
  private calculateDatabaseCost(
    resourceName: string,
    resource: ResourceDefinition,
    provider: CloudProvider
  ): CostBreakdown {
    const props = resource.properties;
    const instanceClass = props.instanceClass || 't3';
    const instanceSize = props.instanceSize || 'micro';
    const storage = props.storage || 20; // GB

    let hourlyCost = 0;
    let service = '';

    if (provider === 'aws') {
      const instanceKey = `rds.db.${instanceClass}.${instanceSize}` as keyof typeof AWS_PRICING;
      const instancePrice = AWS_PRICING[instanceKey] || AWS_PRICING['rds.db.t3.micro'];
      const storagePrice = (AWS_PRICING['rds.storage.gp3'] * storage) / 730; // Convert monthly to hourly
      
      hourlyCost = instancePrice + storagePrice;
      service = 'AWS RDS';
    } else if (provider === 'azure') {
      hourlyCost = AZURE_PRICING['sql.standard.s0'];
      service = 'Azure SQL Database';
    } else if (provider === 'gcp') {
      const instancePrice = GCP_PRICING['sql.db-g1-small'];
      const storagePrice = (GCP_PRICING['sql.storage'] * storage) / 730;
      hourlyCost = instancePrice + storagePrice;
      service = 'Google Cloud SQL';
    }

    const monthlyCost = hourlyCost * 730;
    const yearlyCost = monthlyCost * 12;

    return {
      resourceName,
      resourceType: 'database',
      service,
      hourlyCost: Math.round(hourlyCost * 10000) / 10000,
      monthlyCost: Math.round(monthlyCost * 100) / 100,
      yearlyCost: Math.round(yearlyCost * 100) / 100,
      details: {
        quantity: 1,
        unit: 'instance',
        pricePerUnit: monthlyCost,
      },
    };
  }

  /**
   * Calculate compute costs
   */
  private calculateComputeCost(
    resourceName: string,
    resource: ResourceDefinition,
    provider: CloudProvider
  ): CostBreakdown {
    const props = resource.properties;
    const instanceType = props.instanceType || 't3.micro';
    const count = props.count || 1;

    let hourlyCost = 0;
    let service = '';

    if (provider === 'aws') {
      if (props.computeType === 'lambda') {
        // Lambda: Estimate based on invocations and duration
        const requests = props.estimatedRequests || 1000000; // per month
        const avgDuration = props.avgDuration || 200; // ms
        const memory = props.memory || 128; // MB
        
        const requestCost = requests * AWS_PRICING['lambda.requests'];
        const durationCost = (requests * (avgDuration / 1000) * (memory / 1024)) * AWS_PRICING['lambda.duration'];
        
        hourlyCost = (requestCost + durationCost) / 730;
        service = 'AWS Lambda';
      } else if (props.computeType === 'fargate') {
        const cpu = props.cpu || 0.25; // vCPU
        const memory = props.memory || 0.5; // GB
        hourlyCost = (cpu * AWS_PRICING['ecs.fargate.cpu'] + memory * AWS_PRICING['ecs.fargate.memory']) * count;
        service = 'AWS Fargate';
      } else {
        const key = `ec2.${instanceType}` as keyof typeof AWS_PRICING;
        hourlyCost = (AWS_PRICING[key] || AWS_PRICING['ec2.t3.micro']) * count;
        service = 'AWS EC2';
      }
    } else if (provider === 'azure') {
      hourlyCost = AZURE_PRICING['vm.B2s'] * count;
      service = 'Azure Virtual Machines';
    } else if (provider === 'gcp') {
      hourlyCost = GCP_PRICING['compute.e2-small'] * count;
      service = 'Google Compute Engine';
    }

    const monthlyCost = hourlyCost * 730;
    const yearlyCost = monthlyCost * 12;

    return {
      resourceName,
      resourceType: 'compute',
      service,
      hourlyCost: Math.round(hourlyCost * 10000) / 10000,
      monthlyCost: Math.round(monthlyCost * 100) / 100,
      yearlyCost: Math.round(yearlyCost * 100) / 100,
      details: {
        quantity: count,
        unit: 'instance',
        pricePerUnit: monthlyCost / count,
      },
    };
  }

  /**
   * Calculate storage costs
   */
  private calculateStorageCost(
    resourceName: string,
    resource: ResourceDefinition,
    provider: CloudProvider
  ): CostBreakdown {
    const props = resource.properties;
    const size = props.size || 100; // GB

    let monthlyCost = 0;
    let service = '';

    if (provider === 'aws') {
      monthlyCost = size * AWS_PRICING['s3.standard'];
      service = 'AWS S3';
    } else if (provider === 'azure') {
      monthlyCost = size * AZURE_PRICING['storage.blob'];
      service = 'Azure Blob Storage';
    } else if (provider === 'gcp') {
      monthlyCost = size * GCP_PRICING['storage.standard'];
      service = 'Google Cloud Storage';
    }

    const hourlyCost = monthlyCost / 730;
    const yearlyCost = monthlyCost * 12;

    return {
      resourceName,
      resourceType: 'storage',
      service,
      hourlyCost: Math.round(hourlyCost * 10000) / 10000,
      monthlyCost: Math.round(monthlyCost * 100) / 100,
      yearlyCost: Math.round(yearlyCost * 100) / 100,
      details: {
        quantity: size,
        unit: 'GB',
        pricePerUnit: monthlyCost / size,
      },
    };
  }

  /**
   * Compare costs between two schemas
   */
  compareCosts(
    beforeSchema: InfrastructureSchema,
    afterSchema: InfrastructureSchema,
    provider: CloudProvider = 'aws'
  ): CostComparison {
    const before = this.calculateFromSchema(beforeSchema, provider);
    const after = this.calculateFromSchema(afterSchema, provider);
    
    const savings = before.monthly - after.monthly;
    const savingsPercentage = (savings / before.monthly) * 100;

    let recommendation = '';
    if (savings > 0) {
      recommendation = `Implementing these changes will save $${Math.abs(savings).toFixed(2)}/month (${Math.abs(savingsPercentage).toFixed(1)}%)`;
    } else if (savings < 0) {
      recommendation = `These changes will increase costs by $${Math.abs(savings).toFixed(2)}/month (${Math.abs(savingsPercentage).toFixed(1)}%)`;
    } else {
      recommendation = 'No significant cost impact';
    }

    return {
      before,
      after,
      savings: Math.round(savings * 100) / 100,
      savingsPercentage: Math.round(savingsPercentage * 10) / 10,
      recommendation,
    };
  }

  /**
   * Get cost breakdown by service
   */
  getServiceBreakdown(estimate: CostEstimate): Record<string, number> {
    const breakdown: Record<string, number> = {};
    
    for (const item of estimate.breakdown) {
      if (!breakdown[item.service]) {
        breakdown[item.service] = 0;
      }
      breakdown[item.service] += item.monthlyCost;
    }

    return breakdown;
  }

  /**
   * Generate cost optimization suggestions
   */
  generateOptimizations(estimate: CostEstimate): string[] {
    const suggestions: string[] = [];
    
    // Check for oversized resources
    for (const item of estimate.breakdown) {
      if (item.resourceType === 'database' && item.monthlyCost > 100) {
        suggestions.push(`Consider using a smaller instance for ${item.resourceName} or enabling auto-scaling`);
      }
      
      if (item.resourceType === 'compute' && item.monthlyCost > 200) {
        suggestions.push(`Review ${item.resourceName} utilization - consider spot instances or reserved capacity`);
      }
    }

    // Check total cost
    if (estimate.monthly > 1000) {
      suggestions.push('Consider using Savings Plans or Reserved Instances for 30-40% cost reduction');
    }

    if (estimate.breakdown.some(b => b.service.includes('RDS') || b.service.includes('SQL'))) {
      suggestions.push('Enable automated backups with lifecycle policies to reduce storage costs');
    }

    return suggestions;
  }
}

/**
 * Quick cost estimation
 */
export function quickEstimate(
  schema: InfrastructureSchema,
  provider: CloudProvider = 'aws'
): { min: number; max: number; estimated: number } {
  const calculator = new CostCalculator();
  const estimate = calculator.calculateFromSchema(schema, provider);
  
  return {
    min: Math.round(estimate.monthly * 0.8),
    max: Math.round(estimate.monthly * 1.2),
    estimated: estimate.monthly,
  };
}
