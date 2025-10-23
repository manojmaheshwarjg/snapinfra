# Snapinfra Backend API Documentation

Complete backend with APIs for all modules

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication. Include the user authentication headers:
```
Authorization: Bearer <token>
x-dev-user-id: <user-id>
```

---

## Endpoints Overview

### 1. Health Check
**GET** `/health`
- Public endpoint
- Returns server health status

---

### 2. Home
**GET** `/home`
- Get personalized home page data
- Returns recent projects and activities

---

### 3. Dashboard
**GET** `/dashboard/overview`
- Get dashboard overview metrics

**GET** `/dashboard/stats`
- Get user statistics

**GET** `/dashboard/recent-activity?limit=20`
- Get recent activities

**GET** `/dashboard/projects?limit=10`
- Get recent projects

**GET** `/dashboard/deployments?limit=10`
- Get recent deployments

---

### 4. Projects
**GET** `/projects`
- Get all projects for the user

**POST** `/projects`
- Create a new project
```json
{
  "name": "Project Name",
  "description": "Project description",
  "status": "draft",
  "framework": "express",
  "database": "postgresql"
}
```

**GET** `/projects/:id`
- Get project by ID

**PUT** `/projects/:id`
- Update project

**DELETE** `/projects/:id`
- Delete project

---

### 5. Schemas
**GET** `/schemas`
- Get all schemas

**POST** `/schemas`
- Create new schema
```json
{
  "projectId": "project-id",
  "name": "Schema Name",
  "tables": [
    {
      "id": "table-1",
      "name": "users",
      "fields": [
        {
          "name": "id",
          "type": "string",
          "required": true,
          "unique": true
        }
      ]
    }
  ],
  "relationships": [],
  "version": 1
}
```

**GET** `/schemas/:id`
- Get schema by ID

**GET** `/schemas/project/:projectId`
- Get schemas by project

**PUT** `/schemas/:id`
- Update schema

**DELETE** `/schemas/:id`
- Delete schema

**POST** `/schemas/:id/version`
- Create new schema version

**GET** `/schemas/:id/versions`
- Get all schema versions

---

### 6. Architecture
**GET** `/architecture`
- Get all architectures

**POST** `/architecture`
- Create architecture
```json
{
  "projectId": "project-id",
  "name": "System Architecture",
  "nodes": [
    {
      "id": "node-1",
      "type": "service",
      "label": "API Server",
      "position": { "x": 100, "y": 100 },
      "data": {}
    }
  ],
  "edges": [
    {
      "id": "edge-1",
      "source": "node-1",
      "target": "node-2"
    }
  ]
}
```

**GET** `/architecture/:id`
- Get architecture by ID

**GET** `/architecture/project/:projectId`
- Get architectures by project

**PUT** `/architecture/:id`
- Update architecture

**DELETE** `/architecture/:id`
- Delete architecture

**POST** `/architecture/:id/export`
- Export architecture

---

### 7. Code Generation
**GET** `/code-gen`
- Get all code generations

**POST** `/code-gen/generate`
- Generate code
```json
{
  "projectId": "project-id",
  "type": "api",
  "prompt": "Create a REST API for user management"
}
```

**GET** `/code-gen/:id`
- Get code generation by ID

**GET** `/code-gen/project/:projectId`
- Get code generations by project

**GET** `/code-gen/:id/download`
- Download generated code as ZIP

**DELETE** `/code-gen/:id`
- Delete code generation

---

### 8. Analytics
**GET** `/analytics/dashboard`
- Get dashboard metrics

**GET** `/analytics/project/:projectId`
- Get project analytics

**GET** `/analytics/project/:projectId/metrics`
- Get project metrics

**POST** `/analytics/track`
- Track event
```json
{
  "projectId": "project-id",
  "metric": "deployment",
  "value": 1,
  "dimensions": {
    "environment": "production"
  }
}
```

**GET** `/analytics/trends?period=7d&metric=deployments`
- Get trends

**GET** `/analytics/usage`
- Get usage statistics

---

### 9. Activity
**GET** `/activity?limit=50`
- Get all activities

**GET** `/activity/project/:projectId?limit=50`
- Get project activities

**GET** `/activity/user?limit=50`
- Get user activities

**POST** `/activity`
- Log activity
```json
{
  "projectId": "project-id",
  "action": "deployment_created",
  "entityType": "deployment",
  "entityId": "deployment-id",
  "metadata": {}
}
```

**DELETE** `/activity/:id`
- Delete activity

---

### 10. Documentation
**GET** `/documentation`
- Get all documents

**POST** `/documentation`
- Create document
```json
{
  "projectId": "project-id",
  "title": "Getting Started",
  "content": "# Getting Started\n\nContent here...",
  "category": "guides",
  "tags": ["tutorial", "basics"]
}
```

**GET** `/documentation/:id`
- Get document by ID

**GET** `/documentation/project/:projectId`
- Get project documents

**GET** `/documentation/project/:projectId/category/:category`
- Get documents by category

**PUT** `/documentation/:id`
- Update document

**DELETE** `/documentation/:id`
- Delete document

**POST** `/documentation/search`
- Search documents
```json
{
  "query": "search term",
  "projectId": "project-id"
}
```

---

### 11. Team
**GET** `/team/project/:projectId`
- Get project team

**POST** `/team/project/:projectId/invite`
- Invite team member
```json
{
  "email": "user@example.com",
  "role": "developer"
}
```

**POST** `/team/invite/:invitationId/accept`
- Accept invitation

**POST** `/team/invite/:invitationId/decline`
- Decline invitation

**DELETE** `/team/project/:projectId/member/:userId`
- Remove team member

**PUT** `/team/project/:projectId/member/:userId/role`
- Update member role
```json
{
  "role": "admin"
}
```

**GET** `/team/invitations`
- Get user invitations

---

### 12. Settings
**GET** `/settings`
- Get user settings

**PUT** `/settings`
- Update settings
```json
{
  "theme": "dark",
  "notifications": {
    "email": true,
    "push": true,
    "deploymentAlerts": true
  }
}
```

**PUT** `/settings/theme`
- Update theme
```json
{
  "theme": "dark"
}
```

**PUT** `/settings/notifications`
- Update notifications
```json
{
  "email": true,
  "deploymentAlerts": true
}
```

**PUT** `/settings/integrations`
- Update integrations

**DELETE** `/settings`
- Reset settings to default

---

### 13. Integrations
**GET** `/integrations`
- Get all integrations

**POST** `/integrations`
- Create integration
```json
{
  "projectId": "project-id",
  "type": "github",
  "name": "GitHub Integration",
  "enabled": true,
  "config": {
    "accessToken": "token",
    "repositories": []
  }
}
```

**GET** `/integrations/:id`
- Get integration by ID

**GET** `/integrations/project/:projectId`
- Get project integrations

**PUT** `/integrations/:id`
- Update integration

**DELETE** `/integrations/:id`
- Delete integration

**POST** `/integrations/:id/enable`
- Enable integration

**POST** `/integrations/:id/disable`
- Disable integration

**POST** `/integrations/:id/sync`
- Sync integration

**POST** `/integrations/:id/test`
- Test integration connection

---

### 14. Deployments
**GET** `/deployments`
- Get all deployments

**POST** `/deployments`
- Create deployment
```json
{
  "projectId": "project-id",
  "environment": "production",
  "provider": "vercel",
  "version": "1.0.0"
}
```

**GET** `/deployments/:id`
- Get deployment by ID

**GET** `/deployments/project/:projectId`
- Get project deployments

**PUT** `/deployments/:id`
- Update deployment status

**DELETE** `/deployments/:id`
- Delete deployment

---

### 15. AI Assistant
**POST** `/ai/chat`
- Chat with AI assistant
```json
{
  "projectId": "project-id",
  "message": "How do I deploy this project?",
  "context": "deployment guide"
}
```

**POST** `/ai/generate`
- Generate code/content with AI

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

## Status Codes
- `200` - Success
- `201` - Created
- `202` - Accepted (async operation)
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Running the Backend

1. Install dependencies:
```bash
cd backend
npm install
```

2. Set up environment variables in `.env`:
```
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
AWS_REGION=us-east-1
```

3. Run in development mode:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
npm start
```

## Database Tables
The backend uses DynamoDB with the following tables:
- Projects
- Schemas
- Architectures
- CodeGenerations
- Deployments
- Analytics
- Activity
- Documentation
- Teams
- Settings
- Integrations

Each table has appropriate indexes for efficient querying by userId, projectId, and other relevant fields.
