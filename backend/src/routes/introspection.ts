import { Router, Request, Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';

const router = Router();

// API Introspection - Returns all available endpoints
router.get('/endpoints', asyncHandler(async (req: Request, res: Response) => {
  const endpoints = [
    {
      group: 'Authentication',
      endpoints: [
        {
          method: 'POST',
          path: '/auth/login',
          description: 'Admin login',
          body: {
            email: 'string',
            password: 'string'
          }
        },
        {
          method: 'POST',
          path: '/auth/register',
          description: 'Register new user',
          body: {
            email: 'string',
            password: 'string',
            username: 'string'
          }
        },
        {
          method: 'POST',
          path: '/auth/logout',
          description: 'Logout current user',
          body: null
        },
        {
          method: 'GET',
          path: '/auth/verify',
          description: 'Verify authentication token',
          body: null
        }
      ]
    },
    {
      group: 'Projects',
      endpoints: [
        {
          method: 'GET',
          path: '/projects',
          description: 'Get all projects',
          params: {
            limit: 'number',
            search: 'string'
          }
        },
        {
          method: 'GET',
          path: '/projects/:id',
          description: 'Get project by ID',
          params: {
            id: 'string'
          }
        },
        {
          method: 'POST',
          path: '/projects',
          description: 'Create new project',
          body: {
            name: 'string',
            description: 'string',
            schema: 'object'
          }
        },
        {
          method: 'PUT',
          path: '/projects/:id',
          description: 'Update project',
          params: {
            id: 'string'
          },
          body: {
            name: 'string',
            description: 'string',
            status: 'string'
          }
        },
        {
          method: 'DELETE',
          path: '/projects/:id',
          description: 'Delete project',
          params: {
            id: 'string'
          }
        }
      ]
    },
    {
      group: 'Health',
      endpoints: [
        {
          method: 'GET',
          path: '/health',
          description: 'Check API health status',
          body: null
        }
      ]
    },
    {
      group: 'Home & Dashboard',
      endpoints: [
        {
          method: 'GET',
          path: '/home',
          description: 'Get home page data',
          body: null
        },
        {
          method: 'GET',
          path: '/dashboard',
          description: 'Get dashboard overview',
          body: null
        },
        {
          method: 'GET',
          path: '/dashboard/metrics',
          description: 'Get dashboard metrics',
          body: null
        }
      ]
    },
    {
      group: 'Schemas',
      endpoints: [
        {
          method: 'GET',
          path: '/schemas',
          description: 'Get all schemas',
          body: null
        },
        {
          method: 'GET',
          path: '/schemas/:id',
          description: 'Get schema by ID',
          params: {
            id: 'string'
          }
        },
        {
          method: 'POST',
          path: '/schemas',
          description: 'Create new schema',
          body: {
            name: 'string',
            tables: 'array'
          }
        }
      ]
    }
  ];

  res.json({
    success: true,
    data: endpoints,
    meta: {
      totalGroups: endpoints.length,
      totalEndpoints: endpoints.reduce((acc, group) => acc + group.endpoints.length, 0),
      version: '1.0.0'
    }
  });
}));

export default router;
