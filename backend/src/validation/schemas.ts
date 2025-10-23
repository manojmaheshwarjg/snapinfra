import Joi from 'joi';

export const projectSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  status: Joi.string().valid('active', 'archived', 'draft').default('draft'),
  framework: Joi.string().optional(),
  database: Joi.string().optional(),
  deploymentUrl: Joi.string().uri().optional(),
  repository: Joi.string().uri().optional(),
  tags: Joi.array().items(Joi.string()).optional()
});

export const schemaSchema = Joi.object({
  projectId: Joi.string().required(),
  name: Joi.string().min(1).max(100).required(),
  tables: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    name: Joi.string().required(),
    fields: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      type: Joi.string().required(),
      required: Joi.boolean().default(false),
      unique: Joi.boolean().optional(),
      defaultValue: Joi.any().optional(),
      description: Joi.string().optional()
    })).required(),
    indexes: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      fields: Joi.array().items(Joi.string()).required(),
      type: Joi.string().valid('primary', 'unique', 'index').required()
    })).optional()
  })).required(),
  relationships: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    fromTable: Joi.string().required(),
    toTable: Joi.string().required(),
    type: Joi.string().valid('one-to-one', 'one-to-many', 'many-to-many').required(),
    fromField: Joi.string().required(),
    toField: Joi.string().required()
  })).optional(),
  version: Joi.number().integer().min(1).default(1)
});

export const architectureSchema = Joi.object({
  projectId: Joi.string().required(),
  name: Joi.string().min(1).max(100).required(),
  nodes: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    type: Joi.string().valid('service', 'database', 'api', 'frontend', 'cache', 'queue', 'storage').required(),
    label: Joi.string().required(),
    position: Joi.object({
      x: Joi.number().required(),
      y: Joi.number().required()
    }).required(),
    data: Joi.object().optional()
  })).required(),
  edges: Joi.array().items(Joi.object({
    id: Joi.string().required(),
    source: Joi.string().required(),
    target: Joi.string().required(),
    label: Joi.string().optional(),
    type: Joi.string().optional()
  })).optional(),
  metadata: Joi.object().optional()
});

export const codeGenerationSchema = Joi.object({
  projectId: Joi.string().required(),
  type: Joi.string().valid('api', 'model', 'controller', 'service', 'full-stack').required(),
  prompt: Joi.string().min(10).max(5000).required()
});

export const deploymentSchema = Joi.object({
  projectId: Joi.string().required(),
  environment: Joi.string().valid('development', 'staging', 'production').required(),
  provider: Joi.string().valid('aws', 'vercel', 'netlify', 'heroku', 'gcp', 'azure').required(),
  version: Joi.string().required(),
  metadata: Joi.object().optional()
});

export const analyticsSchema = Joi.object({
  projectId: Joi.string().required(),
  metric: Joi.string().required(),
  value: Joi.number().required(),
  dimensions: Joi.object().optional(),
  timestamp: Joi.string().isoDate().optional()
});

export const activitySchema = Joi.object({
  projectId: Joi.string().optional(),
  action: Joi.string().required(),
  entityType: Joi.string().required(),
  entityId: Joi.string().required(),
  metadata: Joi.object().optional()
});

export const teamMemberSchema = Joi.object({
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'developer', 'viewer').required()
});

export const settingsSchema = Joi.object({
  theme: Joi.string().valid('light', 'dark', 'system').optional(),
  notifications: Joi.object({
    email: Joi.boolean().optional(),
    push: Joi.boolean().optional(),
    slack: Joi.boolean().optional(),
    deploymentAlerts: Joi.boolean().optional(),
    errorAlerts: Joi.boolean().optional()
  }).optional(),
  integrations: Joi.object().optional(),
  preferences: Joi.object().optional()
});

export const integrationSchema = Joi.object({
  projectId: Joi.string().required(),
  type: Joi.string().valid('github', 'aws', 'slack', 'vercel', 'stripe', 'sendgrid').required(),
  name: Joi.string().min(1).max(100).required(),
  enabled: Joi.boolean().default(true),
  config: Joi.object().required()
});

export const documentationSchema = Joi.object({
  projectId: Joi.string().required(),
  title: Joi.string().min(1).max(200).required(),
  content: Joi.string().required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).optional(),
  order: Joi.number().integer().optional()
});

export const aiChatSchema = Joi.object({
  projectId: Joi.string().optional(),
  message: Joi.string().min(1).max(5000).required(),
  context: Joi.string().optional(),
  model: Joi.string().optional()
});
