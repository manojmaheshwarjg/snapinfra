"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "@/lib/app-context"
import { updateProject as updateProjectAPI } from "@/lib/api-client"
import { EnterpriseDashboardLayout } from "@/components/enterprise-dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import CodeDiffViewer from "@/components/CodeDiffViewer"
import CostDashboard from "@/components/CostDashboard"
import { useCost, usePipeline } from "@/lib/hooks/useFeatures"
import { 
  Code2, 
  Download, 
  Play, 
  Settings,
  FileCode,
  Package,
  Terminal,
  Rocket,
  CheckCircle,
  Clock,
  Eye,
  Copy,
  Zap,
  Database,
  Shield,
  Globe,
  FileText,
  RefreshCw,
  DollarSign,
  GitCompare,
  Workflow
} from "lucide-react"

const frameworks = [
  { id: 'express', name: 'Express.js', language: 'javascript', description: 'Fast, unopinionated web framework' },
  { id: 'fastify', name: 'Fastify', language: 'javascript', description: 'Fast and low overhead web framework' },
  { id: 'nestjs', name: 'NestJS', language: 'typescript', description: 'Progressive Node.js framework' },
  { id: 'django', name: 'Django', language: 'python', description: 'High-level Python web framework' },
  { id: 'fastapi', name: 'FastAPI', language: 'python', description: 'Modern, fast web framework for Python' },
  { id: 'spring', name: 'Spring Boot', language: 'java', description: 'Java-based enterprise framework' },
  { id: 'gin', name: 'Gin', language: 'go', description: 'Go HTTP web framework' },
  { id: 'fiber', name: 'Fiber', language: 'go', description: 'Express-inspired Go web framework' }
]

const codeTemplates = [
  {
    id: 'user-auth',
    name: 'User Authentication',
    description: 'Complete user auth with JWT tokens',
    framework: 'express',
    code: `// User Authentication Service
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthService {
  async register(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    const user = await User.create({
      ...userData,
      password: hashedPassword
    });
    
    const token = this.generateToken(user.id);
    return { user: this.sanitizeUser(user), token };
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    
    const token = this.generateToken(user.id);
    return { user: this.sanitizeUser(user), token };
  }

  generateToken(userId) {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { 
      expiresIn: '7d' 
    });
  }

  sanitizeUser(user) {
    const { password, ...sanitized } = user.toObject();
    return sanitized;
  }
}

module.exports = new AuthService();`
  },
  {
    id: 'crud-api',
    name: 'CRUD API Endpoints',
    description: 'RESTful API with full CRUD operations',
    framework: 'express',
    code: `// CRUD Controller
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');

class CRUDController {
  constructor(model) {
    this.model = model;
  }

  // GET /api/resources
  getAll = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, sort = 'createdAt' } = req.query;
    
    const resources = await this.model
      .find()
      .sort({ [sort]: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await this.model.countDocuments();
    
    res.json({
      resources,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  });

  // GET /api/resources/:id
  getById = asyncHandler(async (req, res) => {
    const resource = await this.model.findById(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json(resource);
  });

  // POST /api/resources
  create = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const resource = await this.model.create(req.body);
    res.status(201).json(resource);
  });

  // PUT /api/resources/:id
  update = asyncHandler(async (req, res) => {
    const resource = await this.model.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json(resource);
  });

  // DELETE /api/resources/:id
  delete = asyncHandler(async (req, res) => {
    const resource = await this.model.findByIdAndDelete(req.params.id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json({ message: 'Resource deleted successfully' });
  });
}

module.exports = CRUDController;`
  }
]

export default function CodeGenerationPage() {
  const { state, dispatch } = useAppContext()
  const { currentProject } = state
  const [selectedFramework, setSelectedFramework] = useState('express')
  const [selectedLanguage, setSelectedLanguage] = useState('typescript')
  const [selectedTemplate, setSelectedTemplate] = useState(codeTemplates[0])
  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [isGeneratingIac, setIsGeneratingIac] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [includeAuth, setIncludeAuth] = useState(true)
  const [includeTests, setIncludeTests] = useState(true)
  const [includeDocker, setIncludeDocker] = useState(false)
  const [customInstructions, setCustomInstructions] = useState('')
  
  // New feature states
  const [costEstimate, setCostEstimate] = useState<any>(null)
  const [generatedPipeline, setGeneratedPipeline] = useState<any>(null)
  const [showCostEstimate, setShowCostEstimate] = useState(false)
  const [showPipeline, setShowPipeline] = useState(false)
  const [previousIacFiles, setPreviousIacFiles] = useState<any[]>([])
  const [showDiff, setShowDiff] = useState(false)
  
  // Feature hooks
  const { calculateCost, loading: costLoading } = useCost()
  const { generatePipeline, loading: pipelineLoading } = usePipeline()

  async function retryGenerate(kind: 'code'|'iac') {
    if (!currentProject) return
    
    // Normalize schema to array format (AWS returns { tables: [...] })
    const normalizedSchema = Array.isArray(currentProject.schema) 
      ? currentProject.schema 
      : currentProject.schema?.tables || []
    
    if (normalizedSchema.length === 0) {
      alert('Project has no tables. Please add tables to your schema first.')
      return
    }
    
    if (kind === 'code') setIsGeneratingCode(true)
    else setIsGeneratingIac(true)
    
    // Create normalized project with schema as array
    const normalizedProject = {
      ...currentProject,
      schema: normalizedSchema
    }
    
    try {
      if (kind === 'code') {
        const resp = await fetch('/api/generate-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project: normalizedProject, framework: selectedFramework, language: selectedLanguage, includeAuth, includeTests })
        })
        const data = await resp.json()
        const generatedCode = data?.success 
          ? data.data 
          : { files: [], instructions: '', dependencies: [], success: false, error: data?.error || 'Code generation failed' }
        
        // Update local state
        dispatch({ type: 'UPDATE_PROJECT', payload: { id: currentProject.id, generatedCode } as any })
        
        // Save to AWS (project ID is the backend ID)
        try {
          await updateProjectAPI(currentProject.id, { generatedCode })
          console.log('✅ Generated code saved to AWS')
        } catch (awsError) {
          console.warn('⚠️ Failed to save generated code to AWS:', awsError)
        }
      } else {
        // Save previous IaC files for diff comparison
        if (currentProject.generatedIaC?.files?.length > 0) {
          setPreviousIacFiles(currentProject.generatedIaC.files)
        }
        
        const resp = await fetch('/api/generate-iac-v2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            project: normalizedProject, 
            options: { 
              targets: ['terraform','aws-cdk','docker-compose'], 
              cloud: 'aws', 
              environment: 'development',
              calculateCost: true,
              generatePipeline: true,
              pipelineProvider: 'github-actions'
            } 
          })
        })
        const data = await resp.json()
        const generatedIaC = data?.success
          ? data.data
          : { files: [], instructions: '', dependencies: [], success: false, error: data?.error || 'IaC generation failed' }
        
        // Extract cost and pipeline data if available
        if (data?.success && data.data) {
          if (data.data.cost) {
            setCostEstimate(data.data.cost)
            setShowCostEstimate(true)
          }
          if (data.data.pipeline) {
            setGeneratedPipeline(data.data.pipeline)
            setShowPipeline(true)
          }
          // Show diff if we have previous files
          if (previousIacFiles.length > 0) {
            setShowDiff(true)
          }
        }
        
        // Update local state
        dispatch({ type: 'UPDATE_PROJECT', payload: { id: currentProject.id, generatedIaC } as any })
        
        // Save to AWS (project ID is the backend ID)
        try {
          await updateProjectAPI(currentProject.id, { generatedIaC })
          console.log('✅ Generated IaC saved to AWS')
        } catch (awsError) {
          console.warn('⚠️ Failed to save generated IaC to AWS:', awsError)
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Request failed'
      if (kind === 'code') {
        dispatch({ type: 'UPDATE_PROJECT', payload: { id: currentProject.id, generatedCode: { files: [], instructions: '', dependencies: [], success: false, error: msg } } as any })
      } else {
        dispatch({ type: 'UPDATE_PROJECT', payload: { id: currentProject.id, generatedIaC: { files: [], instructions: '', dependencies: [], success: false, error: msg } } as any })
      }
    } finally {
      if (kind === 'code') setIsGeneratingCode(false)
      else setIsGeneratingIac(false)
    }
  }

  const selectedFrameworkData = frameworks.find(f => f.id === selectedFramework)

  return (
    <EnterpriseDashboardLayout
      title="Code Generation"
      description="Generate production-ready backend code from your schema"
      breadcrumbs={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Code Generation" },
      ]}
    >
      <div className="space-y-8">

        {/* Backend Code Section */}
        {currentProject && (
          <Card id="backend-code" className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    Backend Code
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-600 mt-1">Production-ready API endpoints and models</CardDescription>
                </div>
                {currentProject?.generatedCode?.files?.length > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                    {currentProject.generatedCode.files.length} files
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 bg-white">
              {isGeneratingCode ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-gray-900">Generating Backend Code</p>
                    <p className="text-xs text-gray-500">Analyzing schema and creating API endpoints...</p>
                  </div>
                </div>
              ) : currentProject?.generatedCode?.files?.length ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Code Generated Successfully</span>
                  </div>
                  <GeneratedFilesList files={currentProject.generatedCode.files} fileType="code" projectName={currentProject.name} />
                </div>
              ) : currentProject?.generatedCode?.success === false ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-red-900">Generation Failed</p>
                        <p className="text-xs text-red-700">{currentProject.generatedCode.error || 'Unknown error occurred'}</p>
                        <Button variant="outline" size="sm" onClick={() => retryGenerate('code')} className="mt-2">
                          <RefreshCw className="w-3 h-3 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-8">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Code2 className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-gray-900">No Backend Code Yet</h4>
                      <p className="text-xs text-gray-500 max-w-sm">Generate production-ready backend code with API endpoints, models, and database configuration based on your schema.</p>
                    </div>
                    <div className="pt-2">
                      <Button 
                        onClick={() => retryGenerate('code')} 
                        size="sm"
                        className="shadow-sm"
                      >
                        <Code2 className="w-4 h-4 mr-2" />
                        Generate Backend Code
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Infrastructure as Code Section */}
        {currentProject && (
          <Card id="infrastructure" className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Rocket className="w-4 h-4" />
                    Infrastructure as Code
                  </CardTitle>
                  <CardDescription className="text-xs text-gray-600 mt-1">Terraform, AWS CDK, and Docker configurations</CardDescription>
                </div>
                {currentProject?.generatedIaC?.files?.length > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-300">
                    {currentProject.generatedIaC.files.length} files
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 bg-white">
              {isGeneratingIac ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="relative">
                    <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-gray-900">Generating Infrastructure Code</p>
                    <p className="text-xs text-gray-500">Creating Terraform, CDK, and Docker configurations...</p>
                  </div>
                </div>
              ) : currentProject?.generatedIaC?.files?.length ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-900">Infrastructure Code Generated</span>
                  </div>
                  <GeneratedFilesList files={currentProject.generatedIaC.files} fileType="iac" projectName={currentProject.name} />
                </div>
              ) : currentProject?.generatedIaC?.success === false ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-w-md">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-red-900">Generation Failed</p>
                        <p className="text-xs text-red-700">{currentProject.generatedIaC.error || 'Unknown error occurred'}</p>
                        <Button variant="outline" size="sm" onClick={() => retryGenerate('iac')} className="mt-2">
                          <RefreshCw className="w-3 h-3 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-8">
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <Rocket className="w-6 h-6 text-gray-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-gray-900">No Infrastructure Code Yet</h4>
                      <p className="text-xs text-gray-500 max-w-sm">Generate Infrastructure-as-Code including Terraform, AWS CDK, and Docker Compose configurations for deployment.</p>
                    </div>
                    <div className="pt-2">
                      <Button 
                        onClick={() => retryGenerate('iac')} 
                        size="sm"
                        className="shadow-sm"
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Generate Infrastructure Code
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Cost Estimate Section */}
        {showCostEstimate && costEstimate && (
          <Card className="border border-blue-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-blue-100 bg-blue-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Infrastructure Cost Estimate
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowCostEstimate(false)}
                  className="h-6 px-2"
                >
                  Hide
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CostDashboard estimate={costEstimate} showOptimizations />
            </CardContent>
          </Card>
        )}

        {/* Pipeline Section */}
        {showPipeline && generatedPipeline && (
          <Card className="border border-purple-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-purple-100 bg-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                    <Workflow className="w-4 h-4" />
                    CI/CD Pipeline
                  </CardTitle>
                  <CardDescription className="text-xs text-purple-700 mt-1">
                    {generatedPipeline.fileName}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => navigator.clipboard.writeText(generatedPipeline.content)}
                    className="h-8"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowPipeline(false)}
                    className="h-8"
                  >
                    Hide
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="bg-gray-50 p-3 rounded mb-3">
                <p className="text-xs text-gray-700">{generatedPipeline.description}</p>
              </div>
              <div className="bg-gray-900 text-white p-4 rounded overflow-x-auto max-h-96">
                <pre className="text-xs"><code>{generatedPipeline.content}</code></pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Code Diff Section */}
        {showDiff && previousIacFiles.length > 0 && currentProject?.generatedIaC?.files && (
          <Card className="border border-orange-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-orange-100 bg-orange-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-orange-900 flex items-center gap-2">
                  <GitCompare className="w-4 h-4" />
                  Infrastructure Changes
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowDiff(false)}
                  className="h-6 px-2"
                >
                  Hide
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {currentProject.generatedIaC.files.slice(0, 3).map((newFile: any, idx: number) => {
                const oldFile = previousIacFiles.find(f => f.path === newFile.path)
                if (!oldFile) return null
                
                return (
                  <CodeDiffViewer
                    key={idx}
                    before={oldFile.content}
                    after={newFile.content}
                    fileName={newFile.path}
                    showStats
                    collapsible
                  />
                )
              })}
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        {currentProject && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Database Tables</p>
                    <p className="text-2xl font-bold text-blue-600">{(() => {
                      const schemaArray = Array.isArray(currentProject?.schema) 
                        ? currentProject.schema 
                        : currentProject?.schema?.tables || []
                      return schemaArray.length
                    })()}</p>
                  </div>
                  <Database className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">API Endpoints</p>
                    <p className="text-2xl font-bold text-green-600">{(() => {
                      const schemaArray = Array.isArray(currentProject?.schema) 
                        ? currentProject.schema 
                        : currentProject?.schema?.tables || []
                      return schemaArray.length * 5
                    })()}</p>
                  </div>
                  <Globe className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Est. Lines of Code</p>
                    <p className="text-2xl font-bold text-purple-600">{(() => {
                      const schemaArray = Array.isArray(currentProject?.schema) 
                        ? currentProject.schema 
                        : currentProject?.schema?.tables || []
                      return schemaArray.length * 150
                    })()}</p>
                  </div>
                  <Code2 className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Framework & Language</CardTitle>
                <CardDescription>Choose your preferred technology stack</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="framework">Framework</Label>
                  <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frameworks.map((framework) => (
                        <SelectItem key={framework.id} value={framework.id}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {framework.language}
                            </Badge>
                            {framework.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedFrameworkData && (
                    <p className="text-sm text-gray-500 mt-1">{selectedFrameworkData.description}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="language">Language Variant</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generation Options</CardTitle>
                <CardDescription>Customize what to include in your generated code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="auth" 
                    checked={includeAuth} 
                    onCheckedChange={setIncludeAuth}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="auth" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Authentication & Authorization
                    </Label>
                    <p className="text-xs text-gray-500">JWT-based auth with middleware</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tests" 
                    checked={includeTests} 
                    onCheckedChange={setIncludeTests}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="tests" className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Unit & Integration Tests
                    </Label>
                    <p className="text-xs text-gray-500">Jest test suites for all endpoints</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="docker" 
                    checked={includeDocker} 
                    onCheckedChange={setIncludeDocker}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label htmlFor="docker" className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Docker Configuration
                    </Label>
                    <p className="text-xs text-gray-500">Dockerfile and docker-compose.yml</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Instructions</CardTitle>
                <CardDescription>Additional requirements or modifications</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="e.g., Use Redis for caching, implement rate limiting, add email notifications..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EnterpriseDashboardLayout>
  )
}

function GeneratedFilesList({ files, fileType, projectName }: { files: { path: string; content: string }[]; fileType: 'code'|'iac'; projectName: string }) {
  const max = 8
  const list = files.slice(0, max)
  const more = files.length - list.length

  const copy = async (content: string) => {
    try { await navigator.clipboard.writeText(content) } catch {}
  }
  const downloadBundle = async () => {
    const { default: JSZip } = await import('jszip')
    const zip = new JSZip()
    for (const f of files) {
      const path = String(f.path || '').replace(/^\/+/, '')
      zip.file(path, f.content ?? '')
    }
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectName}-${fileType}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {list.map((f, i) => (
          <div key={i} className="border rounded-md p-2 flex items-start justify-between gap-2 hover:bg-gray-50 transition-colors">
            <div className="min-w-0 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <div className="font-mono text-sm truncate" title={f.path}>{f.path}</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => copy(f.content)} title="Copy" className="flex-shrink-0">
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
      {more > 0 && <div className="text-xs text-gray-500">+{more} more files</div>}
      <div className="pt-1">
        <Button variant="outline" size="sm" onClick={downloadBundle}>
          <Download className="w-4 h-4 mr-2" />
          Download ZIP ({files.length} files)
        </Button>
      </div>
    </div>
  )
}
