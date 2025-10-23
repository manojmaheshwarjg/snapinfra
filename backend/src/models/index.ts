export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface Project extends BaseEntity {
  name: string;
  description: string;
  status: 'active' | 'archived' | 'draft';
  framework?: string;
  database?: string;
  deploymentUrl?: string;
  repository?: string;
  tags?: string[];
}

export interface Schema extends BaseEntity {
  projectId: string;
  name: string;
  tables: SchemaTable[];
  relationships: SchemaRelationship[];
  version: number;
}

export interface SchemaTable {
  id: string;
  name: string;
  fields: SchemaField[];
  indexes?: SchemaIndex[];
}

export interface SchemaField {
  name: string;
  type: string;
  required: boolean;
  unique?: boolean;
  defaultValue?: any;
  description?: string;
}

export interface SchemaIndex {
  name: string;
  fields: string[];
  type: 'primary' | 'unique' | 'index';
}

export interface SchemaRelationship {
  id: string;
  fromTable: string;
  toTable: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  fromField: string;
  toField: string;
}

export interface Architecture extends BaseEntity {
  projectId: string;
  name: string;
  nodes: ArchitectureNode[];
  edges: ArchitectureEdge[];
  metadata?: Record<string, any>;
}

export interface ArchitectureNode {
  id: string;
  type: 'service' | 'database' | 'api' | 'frontend' | 'cache' | 'queue' | 'storage';
  label: string;
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface ArchitectureEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
}

export interface CodeGeneration extends BaseEntity {
  projectId: string;
  type: 'api' | 'model' | 'controller' | 'service' | 'full-stack';
  prompt: string;
  generatedCode: GeneratedFile[];
  status: 'pending' | 'generating' | 'completed' | 'failed';
  error?: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
}

export interface Deployment extends BaseEntity {
  projectId: string;
  environment: 'development' | 'staging' | 'production';
  status: 'pending' | 'deploying' | 'success' | 'failed' | 'rolled-back';
  provider: 'aws' | 'vercel' | 'netlify' | 'heroku' | 'gcp' | 'azure';
  url?: string;
  version: string;
  logs?: DeploymentLog[];
  metadata?: Record<string, any>;
}

export interface DeploymentLog {
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

export interface Analytics extends BaseEntity {
  projectId: string;
  metric: string;
  value: number;
  dimensions?: Record<string, string>;
  timestamp: string;
}

export interface Activity extends BaseEntity {
  projectId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

export interface Team extends BaseEntity {
  projectId: string;
  members: TeamMember[];
  invitations?: TeamInvitation[];
}

export interface TeamMember {
  userId: string;
  email: string;
  name: string;
  role: 'owner' | 'admin' | 'developer' | 'viewer';
  joinedAt: string;
}

export interface TeamInvitation {
  id: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer';
  invitedBy: string;
  invitedAt: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
}

export interface Settings extends BaseEntity {
  theme: 'light' | 'dark' | 'system';
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
  preferences: Record<string, any>;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  slack: boolean;
  deploymentAlerts: boolean;
  errorAlerts: boolean;
}

export interface IntegrationSettings {
  github?: GitHubIntegration;
  aws?: AWSIntegration;
  slack?: SlackIntegration;
  vercel?: VercelIntegration;
}

export interface GitHubIntegration {
  enabled: boolean;
  accessToken?: string;
  repositories?: string[];
}

export interface AWSIntegration {
  enabled: boolean;
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export interface SlackIntegration {
  enabled: boolean;
  webhookUrl?: string;
  channel?: string;
}

export interface VercelIntegration {
  enabled: boolean;
  accessToken?: string;
  teamId?: string;
}

export interface Integration extends BaseEntity {
  projectId: string;
  type: 'github' | 'aws' | 'slack' | 'vercel' | 'stripe' | 'sendgrid';
  name: string;
  enabled: boolean;
  config: Record<string, any>;
  lastSyncedAt?: string;
}

export interface Documentation extends BaseEntity {
  projectId: string;
  title: string;
  content: string;
  category: string;
  tags?: string[];
  order?: number;
}

export interface AIChat extends BaseEntity {
  projectId?: string;
  messages: AIMessage[];
  context?: string;
  model: string;
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}
