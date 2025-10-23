import { DynamoDBService } from './database/dynamoDBService';
import { AIService } from './ai/aiService';
import { CodeGeneration, GeneratedFile } from '@/models';
import JSZip from 'jszip';

export class CodeGenerationService {
  private dynamoDB: DynamoDBService;
  private aiService: AIService;

  constructor() {
    this.dynamoDB = new DynamoDBService();
    this.aiService = new AIService();
  }

  async generateCodeAsync(codeGeneration: CodeGeneration): Promise<void> {
    try {
      await this.updateStatus(codeGeneration.id, 'generating');

      const generatedFiles = await this.generateFiles(codeGeneration);

      codeGeneration.generatedCode = generatedFiles;
      codeGeneration.status = 'completed';
      codeGeneration.updatedAt = new Date().toISOString();

      await this.dynamoDB.put('CodeGenerations', codeGeneration);
    } catch (error) {
      console.error('Code generation error:', error);
      
      codeGeneration.status = 'failed';
      codeGeneration.error = error instanceof Error ? error.message : 'Unknown error';
      codeGeneration.updatedAt = new Date().toISOString();

      await this.dynamoDB.put('CodeGenerations', codeGeneration);
    }
  }

  private async generateFiles(codeGeneration: CodeGeneration): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];

    switch (codeGeneration.type) {
      case 'api':
        files.push(...await this.generateAPI(codeGeneration.prompt));
        break;
      case 'model':
        files.push(...await this.generateModel(codeGeneration.prompt));
        break;
      case 'controller':
        files.push(...await this.generateController(codeGeneration.prompt));
        break;
      case 'service':
        files.push(...await this.generateService(codeGeneration.prompt));
        break;
      case 'full-stack':
        files.push(...await this.generateFullStack(codeGeneration.prompt));
        break;
    }

    return files;
  }

  private async generateAPI(prompt: string): Promise<GeneratedFile[]> {
    const systemPrompt = 'You are an expert backend developer. Generate RESTful API endpoints based on the user requirements. Include route definitions, controller logic, and validation.';
    
    const response = await this.aiService.generateCode(systemPrompt, prompt);
    
    return [
      {
        path: 'routes/api.ts',
        content: response.routes || '// Generated routes',
        language: 'typescript'
      },
      {
        path: 'controllers/apiController.ts',
        content: response.controller || '// Generated controller',
        language: 'typescript'
      }
    ];
  }

  private async generateModel(prompt: string): Promise<GeneratedFile[]> {
    const systemPrompt = 'You are an expert in database modeling. Generate database models and schemas based on the requirements. Include TypeScript interfaces and database schemas.';
    
    const response = await this.aiService.generateCode(systemPrompt, prompt);
    
    return [
      {
        path: 'models/index.ts',
        content: response.model || '// Generated model',
        language: 'typescript'
      }
    ];
  }

  private async generateController(prompt: string): Promise<GeneratedFile[]> {
    const systemPrompt = 'You are an expert backend developer. Generate controller logic with proper error handling, validation, and business logic.';
    
    const response = await this.aiService.generateCode(systemPrompt, prompt);
    
    return [
      {
        path: 'controllers/controller.ts',
        content: response.controller || '// Generated controller',
        language: 'typescript'
      }
    ];
  }

  private async generateService(prompt: string): Promise<GeneratedFile[]> {
    const systemPrompt = 'You are an expert backend developer. Generate service layer code with business logic and external integrations.';
    
    const response = await this.aiService.generateCode(systemPrompt, prompt);
    
    return [
      {
        path: 'services/service.ts',
        content: response.service || '// Generated service',
        language: 'typescript'
      }
    ];
  }

  private async generateFullStack(prompt: string): Promise<GeneratedFile[]> {
    const systemPrompt = 'You are an expert full-stack developer. Generate complete application code including frontend components, backend APIs, models, and database schemas.';
    
    const response = await this.aiService.generateCode(systemPrompt, prompt);
    
    return [
      {
        path: 'frontend/components/App.tsx',
        content: response.frontend || '// Generated frontend',
        language: 'typescript'
      },
      {
        path: 'backend/routes/api.ts',
        content: response.routes || '// Generated routes',
        language: 'typescript'
      },
      {
        path: 'backend/controllers/controller.ts',
        content: response.controller || '// Generated controller',
        language: 'typescript'
      },
      {
        path: 'backend/models/index.ts',
        content: response.model || '// Generated model',
        language: 'typescript'
      }
    ];
  }

  async createZipArchive(files: GeneratedFile[]): Promise<Buffer> {
    const zip = new JSZip();

    files.forEach(file => {
      zip.file(file.path, file.content);
    });

    return await zip.generateAsync({ type: 'nodebuffer' });
  }

  private async updateStatus(id: string, status: CodeGeneration['status']): Promise<void> {
    const codeGen = await this.dynamoDB.get('CodeGenerations', { id });
    if (codeGen) {
      codeGen.status = status;
      codeGen.updatedAt = new Date().toISOString();
      await this.dynamoDB.put('CodeGenerations', codeGen);
    }
  }
}
