import { Database, Code, Brain, Rocket, Gauge, Shield, Network } from "lucide-react"

// ============================================
// TYPES & INTERFACES
// ============================================

export interface GenerationStage {
  id: string
  title: string
  description: string
  icon: any
  status: 'pending' | 'loading' | 'completed'
}

export interface FormFields {
  platformType: string
  businessDomain: string
  targetMetric: string
  keyFeatures: string
  scalingGoal: string
  compliance: string
}

// ============================================
// CONSTANTS
// ============================================

export const INITIAL_GENERATION_STAGES: GenerationStage[] = [
  {
    id: 'backend',
    title: 'Database Schema',
    description: 'Analyzing requirements and generating database structure',
    icon: Database,
    status: 'pending'
  },
  {
    id: 'endpoints',
    title: 'API Endpoints',
    description: 'Creating RESTful API endpoints and routes',
    icon: Code,
    status: 'pending'
  },
  {
    id: 'recommendations',
    title: 'Database Recommendations',
    description: 'Analyzing optimal database choices for your use case',
    icon: Brain,
    status: 'pending'
  },
  {
    id: 'smart',
    title: 'Smart Recommendations',
    description: 'Generating intelligent architecture suggestions',
    icon: Rocket,
    status: 'pending'
  },
  {
    id: 'performance',
    title: 'Performance Analysis',
    description: 'Optimizing for scalability and performance',
    icon: Gauge,
    status: 'pending'
  },
  {
    id: 'security',
    title: 'Security Analysis',
    description: 'Implementing security best practices',
    icon: Shield,
    status: 'pending'
  },
  {
    id: 'hld',
    title: 'High-Level Design Architecture',
    description: 'Compiling all components into a cohesive architecture',
    icon: Network,
    status: 'pending'
  }

]

export const EXAMPLE_TITLES = [
  'Todo App',
  'Supply Chain',
  'Healthcare Platform',
  'Payment System',
  'IoT Monitoring',
  'Customer Analytics',
  'Media Streaming',
  'Learning Platform',
  'Logistics Network',
  'Social Media',
  'E-commerce Store',
  'Project Management'
]

export const PROJECT_NAME_PATTERNS = [
  { regex: /social media|social network/i, name: 'Social Media App' },
  { regex: /e-?commerce|online store|shop/i, name: 'E-commerce Platform' },
  { regex: /blog|cms|content management/i, name: 'Blog CMS' },
  { regex: /task|todo|project management/i, name: 'Task Manager' },
  { regex: /chat|messaging/i, name: 'Chat App' },
  { regex: /food|restaurant|delivery/i, name: 'Food Delivery App' },
  { regex: /booking|reservation/i, name: 'Booking System' },
  { regex: /inventory|warehouse/i, name: 'Inventory System' },
  { regex: /learning|education|course/i, name: 'Learning Platform' },
  { regex: /fitness|health|workout/i, name: 'Fitness App' },
]

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Builds architectural input string from form fields
 */
export const buildArchitecturalInput = (fields: FormFields): string => {
  const { platformType, businessDomain, targetMetric, keyFeatures, scalingGoal, compliance } = fields
  return `Build a ${platformType} platform for ${businessDomain} serving ${targetMetric}. Key features: ${keyFeatures}. Scale to ${scalingGoal} and ensure ${compliance} compliance.`.trim()
}

/**
 * Generates a project name based on the input description
 */
export const generateProjectName = (input: string): string => {
  // Check against predefined patterns
  for (const pattern of PROJECT_NAME_PATTERNS) {
    if (pattern.regex.test(input)) {
      return pattern.name
    }
  }

  // Fallback: extract meaningful words from input
  const words = input
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .slice(0, 3)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

  return words.length > 0 ? words.join(' ') + (words.length === 1 ? ' App' : '') : 'My Project'
}

/**
 * Validates if minimum required fields are filled
 */
export const validateMinimumFields = (fields: FormFields): boolean => {
  return fields.platformType.trim() !== '' && fields.businessDomain.trim() !== ''
}

/**
 * Counts completed fields
 */
export const countCompletedFields = (fields: FormFields): number => {
  return Object.values(fields).filter(field => field.trim() !== '').length
}

/**
 * Calculates progress percentage based on completed stages
 */
export const calculateProgress = (stages: GenerationStage[]): number => {
  const completedStages = stages.filter(stage => stage.status === 'completed').length
  const totalStages = stages.length
  return (completedStages / totalStages) * 100
}

/**
 * Formats error message for user display
 */
export const formatErrorMessage = (error: unknown): string => {
  let errorMessage = 'Backend generation failed. '

  if (error instanceof Error) {
    if (error.message.includes('6-20 tables') || error.message.includes('tables generated')) {
      errorMessage = error.message + ' Try being more specific about your requirements.'
    } else if (error.message.includes('JSON')) {
      errorMessage = 'AI generated invalid response format. Please try again.'
    } else if (error.message.includes('No database schemas')) {
      errorMessage = 'AI could not generate database schemas. Please provide a more detailed description of your backend requirements.'
    } else {
      errorMessage += error.message
    }
  } else {
    errorMessage += 'Unknown error occurred.'
  }

  return errorMessage
}