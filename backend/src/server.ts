import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import dotenv from 'dotenv';
import { errorHandler } from '@/middleware/errorHandler';
import { rateLimiter } from '@/middleware/rateLimiter';
import { validateEnv } from '@/utils/validateEnv';

// Import routes
import healthRoutes from '@/routes/health';
import authRoutes from '@/routes/auth';
import onboardingRoutes from '@/routes/onboarding';
import projectRoutes from '@/routes/projects';
import aiRoutes from '@/routes/ai';
import deploymentRoutes from '@/routes/deployments';
import homeRoutes from '@/routes/home';
import dashboardRoutes from '@/routes/dashboard';
import schemaRoutes from '@/routes/schema';
import architectureRoutes from '@/routes/architecture';
import codeGenRoutes from '@/routes/codeGen';
import analyticsRoutes from '@/routes/analytics';
import activityRoutes from '@/routes/activity';
import documentationRoutes from '@/routes/documentation';
import teamRoutes from '@/routes/team';
import settingsRoutes from '@/routes/settings';
import integrationsRoutes from '@/routes/integrations';
import introspectionRoutes from '@/routes/introspection';

// Load environment variables
dotenv.config();

// Validate environment variables
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'x-dev-user-id']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
app.use(rateLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/schemas', schemaRoutes);
app.use('/api/architecture', architectureRoutes);
app.use('/api/code-gen', codeGenRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/deployments', deploymentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/documentation', documentationRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api', introspectionRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'snapinfra Backend API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 snapinfra Backend running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  console.log(`☁️  AWS Region: ${process.env.AWS_REGION || 'us-east-1'}`);
});

export default app;
