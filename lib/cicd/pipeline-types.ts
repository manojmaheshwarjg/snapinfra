/**
 * CI/CD Pipeline Configuration Types
 * 
 * Types for generating deployment pipelines across different platforms
 */

export type PipelineProvider = 'github-actions' | 'gitlab-ci' | 'jenkins' | 'azure-devops' | 'circleci';
export type IaCTarget = 'terraform' | 'aws-cdk' | 'kubernetes' | 'helm' | 'docker-compose';

export interface PipelineConfig {
  provider: PipelineProvider;
  target: IaCTarget;
  projectName: string;
  environment: 'development' | 'staging' | 'production';
  options: PipelineOptions;
}

export interface PipelineOptions {
  // Deployment settings
  autoApprove?: boolean;
  requireApproval?: boolean;
  approvers?: string[];
  
  // Testing
  runTests?: boolean;
  testCommand?: string;
  lintCommand?: string;
  
  // Security
  runSecurityScan?: boolean;
  scanTools?: ('trivy' | 'snyk' | 'checkov')[];
  
  // Notifications
  notifications?: {
    slack?: { webhook: string; channel: string };
    email?: string[];
    teams?: string;
  };
  
  // Triggers
  triggers?: {
    branches?: string[];
    tags?: string[];
    pullRequests?: boolean;
    schedule?: string; // cron
  };
  
  // Artifacts
  artifacts?: {
    enabled: boolean;
    paths: string[];
    retention?: number; // days
  };
  
  // Secrets management
  secrets?: {
    provider: 'vault' | 'aws-secrets-manager' | 'azure-key-vault' | 'k8s-secrets';
    path?: string;
  };
  
  // Custom steps
  beforeDeploy?: string[];
  afterDeploy?: string[];
}

export interface GeneratedPipeline {
  provider: PipelineProvider;
  fileName: string;
  content: string;
  description: string;
  additionalFiles?: Array<{
    fileName: string;
    content: string;
    description: string;
  }>;
}

// GitHub Actions specific
export interface GitHubActionsConfig {
  workflowName: string;
  runs: {
    on: {
      push?: { branches: string[] };
      pull_request?: { branches: string[] };
      schedule?: Array<{ cron: string }>;
    };
  };
  jobs: Record<string, GitHubJob>;
}

export interface GitHubJob {
  'runs-on': string;
  steps: Array<{
    name: string;
    uses?: string;
    run?: string;
    with?: Record<string, any>;
    env?: Record<string, string>;
    if?: string;
  }>;
  needs?: string[];
  environment?: string;
}

// GitLab CI specific
export interface GitLabCIConfig {
  stages: string[];
  variables?: Record<string, string>;
  before_script?: string[];
  after_script?: string[];
  jobs: Record<string, GitLabJob>;
}

export interface GitLabJob {
  stage: string;
  script: string[];
  only?: string[];
  except?: string[];
  when?: 'on_success' | 'on_failure' | 'always' | 'manual';
  dependencies?: string[];
  artifacts?: {
    paths: string[];
    expire_in?: string;
  };
  environment?: {
    name: string;
    url?: string;
  };
}

// Jenkins specific
export interface JenkinsConfig {
  pipeline: {
    agent: { label?: string; docker?: { image: string } };
    environment?: Record<string, string>;
    stages: JenkinsStage[];
    post?: {
      always?: string[];
      success?: string[];
      failure?: string[];
    };
  };
}

export interface JenkinsStage {
  name: string;
  steps: string[];
  when?: string;
}

// Azure DevOps specific
export interface AzureDevOpsConfig {
  trigger: {
    branches: { include: string[] };
  };
  pool: {
    vmImage: string;
  };
  variables: Record<string, string>;
  stages: AzureStage[];
}

export interface AzureStage {
  stage: string;
  displayName: string;
  jobs: Array<{
    job: string;
    displayName: string;
    steps: Array<{
      task?: string;
      script?: string;
      displayName: string;
      inputs?: Record<string, any>;
    }>;
  }>;
}

// Deployment strategies
export interface DeploymentStrategy {
  type: 'rolling' | 'blue-green' | 'canary' | 'recreate';
  config?: {
    // Rolling
    maxUnavailable?: number;
    maxSurge?: number;
    
    // Canary
    canaryPercentage?: number;
    canaryDuration?: string;
    
    // Blue-green
    switchTraffic?: 'manual' | 'automatic';
  };
}

// Environment configuration
export interface EnvironmentConfig {
  name: string;
  url?: string;
  secrets: string[];
  variables: Record<string, string>;
  approvers?: string[];
}
