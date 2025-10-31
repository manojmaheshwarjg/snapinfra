/**
 * CI/CD Pipeline Generator
 * 
 * Generates deployment pipelines for GitHub Actions, GitLab CI, Jenkins, and Azure DevOps
 */

import yaml from 'js-yaml';
import type {
  PipelineConfig,
  GeneratedPipeline,
  IaCTarget,
  PipelineProvider
} from './pipeline-types';

export class PipelineGenerator {
  /**
   * Generate pipeline based on configuration
   */
  generate(config: PipelineConfig): GeneratedPipeline {
    switch (config.provider) {
      case 'github-actions':
        return this.generateGitHubActions(config);
      case 'gitlab-ci':
        return this.generateGitLabCI(config);
      case 'jenkins':
        return this.generateJenkins(config);
      case 'azure-devops':
        return this.generateAzureDevOps(config);
      default:
        throw new Error(`Unsupported provider: ${config.provider}`);
    }
  }

  /**
   * Generate GitHub Actions workflow
   */
  private generateGitHubActions(config: PipelineConfig): GeneratedPipeline {
    const workflow = {
      name: `Deploy ${config.projectName}`,
      
      on: {
        push: {
          branches: config.options.triggers?.branches || ['main'],
        },
        ...(config.options.triggers?.pullRequests && {
          pull_request: {
            branches: ['main'],
          },
        }),
        ...(config.options.triggers?.schedule && {
          schedule: [{ cron: config.options.triggers.schedule }],
        }),
      },

      env: {
        PROJECT_NAME: config.projectName,
        ENVIRONMENT: config.environment,
      },

      jobs: {
        ...(config.options.runTests && {
          test: {
            'runs-on': 'ubuntu-latest',
            steps: [
              { uses: 'actions/checkout@v3' },
              {
                name: 'Run tests',
                run: config.options.testCommand || 'npm test',
              },
              ...(config.options.lintCommand
                ? [{
                    name: 'Run linter',
                    run: config.options.lintCommand,
                  }]
                : []),
            ],
          },
        }),

        ...(config.options.runSecurityScan && {
          security: {
            'runs-on': 'ubuntu-latest',
            steps: [
              { uses: 'actions/checkout@v3' },
              ...this.getSecurityScanSteps(config),
            ],
          },
        }),

        deploy: {
          'runs-on': 'ubuntu-latest',
          needs: [
            ...(config.options.runTests ? ['test'] : []),
            ...(config.options.runSecurityScan ? ['security'] : []),
          ].filter(Boolean),
          environment: config.environment,
          steps: [
            { uses: 'actions/checkout@v3' },
            ...this.getDeploymentSteps(config),
          ],
        },
      },
    };

    return {
      provider: 'github-actions',
      fileName: `.github/workflows/deploy-${config.environment}.yml`,
      content: yaml.dump(workflow, { noRefs: true }),
      description: `GitHub Actions workflow for deploying ${config.projectName} to ${config.environment}`,
    };
  }

  /**
   * Generate GitLab CI pipeline
   */
  private generateGitLabCI(config: PipelineConfig): GeneratedPipeline {
    const stages = [
      ...(config.options.runTests ? ['test'] : []),
      ...(config.options.runSecurityScan ? ['security'] : []),
      'deploy',
    ];

    const pipeline: any = {
      stages,

      variables: {
        PROJECT_NAME: config.projectName,
        ENVIRONMENT: config.environment,
      },

      ...(config.options.runTests && {
        test: {
          stage: 'test',
          script: [
            config.options.testCommand || 'npm test',
            ...(config.options.lintCommand ? [config.options.lintCommand] : []),
          ],
          only: config.options.triggers?.branches || ['main'],
        },
      }),

      ...(config.options.runSecurityScan && {
        'security-scan': {
          stage: 'security',
          script: this.getSecurityScanCommands(config),
          only: config.options.triggers?.branches || ['main'],
        },
      }),

      deploy: {
        stage: 'deploy',
        script: this.getDeploymentCommands(config),
        only: config.options.triggers?.branches || ['main'],
        environment: {
          name: config.environment,
        },
        when: config.options.requireApproval ? 'manual' : 'on_success',
        ...(config.options.artifacts?.enabled && {
          artifacts: {
            paths: config.options.artifacts.paths,
            expire_in: `${config.options.artifacts.retention || 7} days`,
          },
        }),
      },
    };

    return {
      provider: 'gitlab-ci',
      fileName: '.gitlab-ci.yml',
      content: yaml.dump(pipeline, { noRefs: true }),
      description: `GitLab CI pipeline for deploying ${config.projectName}`,
    };
  }

  /**
   * Generate Jenkinsfile
   */
  private generateJenkins(config: PipelineConfig): GeneratedPipeline {
    const stages = [
      ...(config.options.runTests ? ['Test'] : []),
      ...(config.options.runSecurityScan ? ['Security Scan'] : []),
      'Deploy',
    ];

    const jenkinsfile = `
pipeline {
    agent any
    
    environment {
        PROJECT_NAME = '${config.projectName}'
        ENVIRONMENT = '${config.environment}'
    }
    
    stages {
        ${config.options.runTests ? `
        stage('Test') {
            steps {
                sh '${config.options.testCommand || 'npm test'}'
                ${config.options.lintCommand ? `sh '${config.options.lintCommand}'` : ''}
            }
        }
        ` : ''}
        
        ${config.options.runSecurityScan ? `
        stage('Security Scan') {
            steps {
                ${this.getSecurityScanCommands(config).map(cmd => `sh '${cmd}'`).join('\n                ')}
            }
        }
        ` : ''}
        
        stage('Deploy') {
            ${config.options.requireApproval ? `
            input {
                message "Approve deployment to ${config.environment}?"
                ok "Deploy"
            }
            ` : ''}
            steps {
                ${this.getDeploymentCommands(config).map(cmd => `sh '${cmd}'`).join('\n                ')}
            }
        }
    }
    
    post {
        success {
            echo 'Deployment successful!'
            ${config.options.notifications?.slack ? `
            slackSend color: 'good', message: "Deployment to ${config.environment} succeeded"
            ` : ''}
        }
        failure {
            echo 'Deployment failed!'
            ${config.options.notifications?.slack ? `
            slackSend color: 'danger', message: "Deployment to ${config.environment} failed"
            ` : ''}
        }
    }
}
    `.trim();

    return {
      provider: 'jenkins',
      fileName: 'Jenkinsfile',
      content: jenkinsfile,
      description: `Jenkins pipeline for deploying ${config.projectName}`,
    };
  }

  /**
   * Generate Azure DevOps pipeline
   */
  private generateAzureDevOps(config: PipelineConfig): GeneratedPipeline {
    const pipeline: any = {
      trigger: {
        branches: {
          include: config.options.triggers?.branches || ['main'],
        },
      },

      pool: {
        vmImage: 'ubuntu-latest',
      },

      variables: {
        projectName: config.projectName,
        environment: config.environment,
      },

      stages: [
        ...(config.options.runTests
          ? [
              {
                stage: 'Test',
                displayName: 'Run Tests',
                jobs: [
                  {
                    job: 'test',
                    displayName: 'Test',
                    steps: [
                      {
                        script: config.options.testCommand || 'npm test',
                        displayName: 'Run tests',
                      },
                      ...(config.options.lintCommand
                        ? [
                            {
                              script: config.options.lintCommand,
                              displayName: 'Run linter',
                            },
                          ]
                        : []),
                    ],
                  },
                ],
              },
            ]
          : []),

        {
          stage: 'Deploy',
          displayName: `Deploy to ${config.environment}`,
          jobs: [
            {
              job: 'deploy',
              displayName: 'Deploy Infrastructure',
              steps: this.getDeploymentCommands(config).map((cmd) => ({
                script: cmd,
                displayName: cmd.split(' ')[0],
              })),
            },
          ],
        },
      ],
    };

    return {
      provider: 'azure-devops',
      fileName: 'azure-pipelines.yml',
      content: yaml.dump(pipeline, { noRefs: true }),
      description: `Azure DevOps pipeline for deploying ${config.projectName}`,
    };
  }

  /**
   * Get deployment steps based on IaC target
   */
  private getDeploymentSteps(config: PipelineConfig): any[] {
    const steps: any[] = [];

    // Custom before deploy steps
    if (config.options.beforeDeploy) {
      steps.push({
        name: 'Run pre-deployment steps',
        run: config.options.beforeDeploy.join('\n'),
      });
    }

    switch (config.target) {
      case 'terraform':
        steps.push(
          {
            name: 'Setup Terraform',
            uses: 'hashicorp/setup-terraform@v2',
            with: { terraform_version: '1.5.0' },
          },
          {
            name: 'Terraform Init',
            run: 'cd infra/terraform && terraform init',
          },
          {
            name: 'Terraform Plan',
            run: 'cd infra/terraform && terraform plan -out=tfplan',
          },
          {
            name: 'Terraform Apply',
            run: `cd infra/terraform && terraform apply ${config.options.autoApprove ? '-auto-approve' : ''} tfplan`,
          }
        );
        break;

      case 'aws-cdk':
        steps.push(
          {
            name: 'Setup Node.js',
            uses: 'actions/setup-node@v3',
            with: { 'node-version': '18' },
          },
          {
            name: 'Install dependencies',
            run: 'npm ci',
          },
          {
            name: 'Build CDK',
            run: 'npm run build',
          },
          {
            name: 'CDK Deploy',
            run: `npx cdk deploy --all ${config.options.requireApproval ? '' : '--require-approval never'}`,
          }
        );
        break;

      case 'kubernetes':
        steps.push(
          {
            name: 'Setup kubectl',
            uses: 'azure/setup-kubectl@v3',
          },
          {
            name: 'Deploy to Kubernetes',
            run: 'kubectl apply -f k8s/',
          }
        );
        break;

      case 'helm':
        steps.push(
          {
            name: 'Setup Helm',
            uses: 'azure/setup-helm@v3',
          },
          {
            name: 'Deploy Helm Chart',
            run: `helm upgrade --install ${config.projectName} ./helm/${config.projectName}/ --namespace ${config.environment} --create-namespace`,
          }
        );
        break;

      case 'docker-compose':
        steps.push(
          {
            name: 'Deploy with Docker Compose',
            run: 'docker-compose up -d',
          }
        );
        break;
    }

    // Custom after deploy steps
    if (config.options.afterDeploy) {
      steps.push({
        name: 'Run post-deployment steps',
        run: config.options.afterDeploy.join('\n'),
      });
    }

    return steps;
  }

  /**
   * Get deployment commands (for CLI-based pipelines)
   */
  private getDeploymentCommands(config: PipelineConfig): string[] {
    const commands: string[] = [];

    if (config.options.beforeDeploy) {
      commands.push(...config.options.beforeDeploy);
    }

    switch (config.target) {
      case 'terraform':
        commands.push(
          'cd infra/terraform',
          'terraform init',
          'terraform plan -out=tfplan',
          `terraform apply ${config.options.autoApprove ? '-auto-approve' : ''} tfplan`
        );
        break;

      case 'aws-cdk':
        commands.push(
          'npm ci',
          'npm run build',
          `npx cdk deploy --all ${config.options.requireApproval ? '' : '--require-approval never'}`
        );
        break;

      case 'kubernetes':
        commands.push('kubectl apply -f k8s/');
        break;

      case 'helm':
        commands.push(
          `helm upgrade --install ${config.projectName} ./helm/${config.projectName}/ --namespace ${config.environment} --create-namespace`
        );
        break;

      case 'docker-compose':
        commands.push('docker-compose up -d');
        break;
    }

    if (config.options.afterDeploy) {
      commands.push(...config.options.afterDeploy);
    }

    return commands;
  }

  /**
   * Get security scan steps
   */
  private getSecurityScanSteps(config: PipelineConfig): any[] {
    const steps: any[] = [];
    const tools = config.options.scanTools || ['trivy'];

    if (tools.includes('trivy')) {
      steps.push({
        name: 'Run Trivy security scan',
        uses: 'aquasecurity/trivy-action@master',
        with: {
          'scan-type': 'fs',
          'scan-ref': '.',
        },
      });
    }

    if (tools.includes('snyk')) {
      steps.push({
        name: 'Run Snyk security scan',
        uses: 'snyk/actions/node@master',
        env: {
          SNYK_TOKEN: '${{ secrets.SNYK_TOKEN }}',
        },
      });
    }

    if (tools.includes('checkov')) {
      steps.push({
        name: 'Run Checkov scan',
        uses: 'bridgecrewio/checkov-action@master',
        with: {
          directory: '.',
        },
      });
    }

    return steps;
  }

  /**
   * Get security scan commands
   */
  private getSecurityScanCommands(config: PipelineConfig): string[] {
    const commands: string[] = [];
    const tools = config.options.scanTools || ['trivy'];

    if (tools.includes('trivy')) {
      commands.push('trivy fs .');
    }

    if (tools.includes('snyk')) {
      commands.push('snyk test');
    }

    if (tools.includes('checkov')) {
      commands.push('checkov -d .');
    }

    return commands;
  }
}

/**
 * Generate pipeline with defaults
 */
export function generatePipeline(
  provider: PipelineProvider,
  target: IaCTarget,
  projectName: string,
  environment: 'development' | 'staging' | 'production' = 'production'
): GeneratedPipeline {
  const generator = new PipelineGenerator();
  
  const config: PipelineConfig = {
    provider,
    target,
    projectName,
    environment,
    options: {
      runTests: true,
      testCommand: 'npm test',
      runSecurityScan: environment === 'production',
      scanTools: ['trivy'],
      requireApproval: environment === 'production',
      autoApprove: environment !== 'production',
      triggers: {
        branches: environment === 'production' ? ['main'] : ['main', 'develop'],
        pullRequests: true,
      },
    },
  };

  return generator.generate(config);
}
