# Snapinfra - Enhanced Technical Onboarding Guide

**Version:** 3.0  
**Last Updated:** 2025-10-20  
**Document Owner:** Engineering Team  
**Estimated Setup Time:** 30-45 minutes  

> **Quick Navigation:** [Quick Start](#quick-start) | [Prerequisites](#prerequisites) | [Architecture](#architecture) | [Troubleshooting](#troubleshooting) | [Support](#support)

---

## Quick Start

**Choose Your Path:**

<table>
<tr>
<td width="50%">

### First-Time Setup (45 min)
Perfect for new team members

1. [Prerequisites](#prerequisites) (10 min)
2. [Environment Setup](#environment-setup) (15 min)
3. [Local Development](#local-development) (10 min)
4. [Verify Installation](#verify-installation) (10 min)

</td>
<td width="50%">

### Experienced Developer (15 min)
Already familiar with the stack

```powershell
# Clone & Install
git clone <repo> Snapinfra && cd Snapinfra
pnpm install
cd backend && pnpm install && cd ..

# Configure (add your keys)
cp .env.example .env.local
cp backend/.env.example backend/.env

# Deploy Infrastructure
cd backend && pnpm deploy && cd ..

# Run
pnpm dev  # Terminal 1
cd backend && pnpm dev  # Terminal 2
```

</td>
</tr>
</table>

---

## Table of Contents

### Getting Started
1. [Executive Summary](#1-executive-summary)
2. [Prerequisites & Setup](#2-prerequisites--setup)
3. [Project Structure](#3-project-structure)
4. [Local Development](#4-local-development)

### Core Concepts
5. [System Architecture](#5-system-architecture)
6. [Database Design](#6-database-design)
7. [Authentication Flow](#7-authentication-flow)
8. [AI Integration](#8-ai-integration)

### Development
9. [Frontend Guide](#9-frontend-guide)
10. [Backend Guide](#10-backend-guide)
11. [API Reference](#11-api-reference)
12. [Development Workflow](#12-development-workflow)

### Operations
13. [Deployment](#13-deployment)
14. [Monitoring & Observability](#14-monitoring--observability)
15. [Security](#15-security)
16. [Troubleshooting](#16-troubleshooting)

### Advanced
17. [Performance Optimization](#17-performance-optimization)
18. [Scaling Considerations](#18-scaling-considerations)
19. [CI/CD Pipeline](#19-cicd-pipeline)
20. [Disaster Recovery](#20-disaster-recovery)

### Reference
21. [AWS Infrastructure](#21-aws-infrastructure)
22. [Common Recipes](#22-common-recipes)
23. [Best Practices](#23-best-practices)
24. [Appendices](#24-appendices)

---

## 1. Executive Summary

### What is Snapinfra?

Snapinfra is an **AI-powered platform** that converts natural language descriptions into production-ready backend code with complete AWS infrastructure provisioning.

```
Natural Language → AI Processing → Backend Code + AWS Infrastructure
"Build a user management API" → AI → Express.js + DynamoDB + S3 + Deployed
```

### Key Metrics

| Metric | Value | Status |
|--------|-------|--------|
| **Tech Stack** | Next.js 15, Node.js 18, TypeScript | Modern |
| **Database** | DynamoDB (4 tables, 3 GSIs) | NoSQL |
| **Storage** | S3 (versioned, encrypted) | Secure |
| **Auth** | Clerk (JWT) | Production-ready |
| **AI** | Groq + OpenAI | Dual-provider |
| **Hosting** | Vercel + AWS | Scalable |
| **Cost** | ~$50-100/month (light usage) | Optimized |

### Architecture at a Glance

```
┌──────────┐
│  Browser │ ← User
└────┬─────┘
     │ HTTPS
     ▼
┌─────────────┐
│   Vercel    │ ← Global CDN
│  (Next.js)  │
└──────┬──────┘
       │
       ├──────────────┬──────────────┐
       ▼              ▼              ▼
┌──────────┐    ┌──────────┐    ┌──────────┐
│ Express  │    │   Groq   │    │  Clerk   │
│  Backend │    │  AI API  │    │   Auth   │
└────┬─────┘    └──────────┘    └──────────┘
     │
     ├─────────┬─────────┬─────────┐
     ▼         ▼         ▼         ▼
┌─────────┐ ┌─────┐ ┌─────┐ ┌─────┐
│DynamoDB │ │ S3  │ │ SQS │ │ SNS │
└─────────┘ └─────┘ └─────┘ └─────┘
```

### Core Features

- **AI Code Generation** - Natural language to Express.js backend  
- **Visual Schema Designer** - Interactive database modeling  
- **One-Click Deployment** - Deploy to Vercel/Railway/Render  
- **Real-time Collaboration** - Team-based project management  
- **Complete AWS Stack** - DynamoDB, S3, SQS, SNS provisioning  

---

## 2. Prerequisites & Setup

### 2.1 System Requirements

<table>
<tr>
<th>Category</th>
<th>Requirement</th>
<th>Verification</th>
</tr>
<tr>
<td>Operating System</td>
<td>Windows 10/11, macOS 12+, Ubuntu 20.04+</td>
<td><code>systeminfo</code> (Windows)<br><code>sw_vers</code> (macOS)</td>
</tr>
<tr>
<td>CPU</td>
<td>4+ cores (8+ recommended)</td>
<td>Task Manager → Performance</td>
</tr>
<tr>
<td>RAM</td>
<td>16GB (8GB minimum)</td>
<td>Task Manager → Performance</td>
</tr>
<tr>
<td>Storage</td>
<td>20GB free space</td>
<td><code>Get-Volume C</code></td>
</tr>
<tr>
<td>Network</td>
<td>Stable internet connection</td>
<td><code>Test-NetConnection google.com</code></td>
</tr>
</table>

### 2.2 Required Software

#### Core Tools

**Node.js 18.0.0+** (LTS recommended)
```powershell
# Install
winget install OpenJS.NodeJS.LTS

# Verify
node --version  # Expected: v18.x.x or higher
npm --version   # Expected: v9.x.x or higher
```

**pnpm (Package Manager)**
```powershell
# Install
npm install -g pnpm

# Verify
pnpm --version  # Expected: v8.x.x or higher
```

**Git 2.30+**
```powershell
# Install
winget install Git.Git

# Verify
git --version   # Expected: git version 2.30+

# Configure
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
git config --global core.autocrlf true
```

**AWS CLI v2**
```powershell
# Install
winget install Amazon.AWSCLI

# Verify
aws --version  # Expected: aws-cli/2.x.x
```

#### Optional but Recommended

**VS Code Extensions**
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- ESLint
- Prettier
- AWS Toolkit
- DynamoDB Viewer
- Thunder Client (API testing)

**Desktop Tools**
- Postman or Insomnia (API testing)
- NoSQL Workbench (DynamoDB)
- AWS Console Bookmarked

### 2.3 Account Setup

#### Required Accounts (Time: 20 min)

**1. Clerk (Authentication)** - [clerk.com](https://clerk.com)
```
Time: 5 minutes
Cost: Free tier (10,000 MAU)

Steps:
1. Sign up at https://dashboard.clerk.com
2. Create new application: "Snapinfra"
3. Copy Publishable Key (pk_test_...)
4. Copy Secret Key (sk_test_...)
5. Configure URLs:
   - Sign in: /sign-in
   - Sign up: /sign-up
   - After sign in: /onboarding
   - After sign up: /onboarding
```

**2. Groq (AI Provider)** - [groq.com](https://groq.com)
```
Time: 3 minutes
Cost: Free tier (14,400 requests/day)

Steps:
1. Sign up at https://console.groq.com
2. Go to API Keys
3. Create new key: "Snapinfra Development"
4. Copy key (gsk_...)
5. Save securely
```

**3. AWS (Infrastructure)** - [aws.amazon.com](https://aws.amazon.com)
```
Time: 10 minutes
Cost: ~$5-20/month (free tier eligible)

Steps:
1. Create AWS account
2. Go to IAM → Users → Add User
3. Name: "snapinfra-dev"
4. Attach policies:
   - AmazonDynamoDBFullAccess
   - AmazonS3FullAccess
   - AmazonSQSFullAccess
   - AmazonSNSFullAccess
5. Create access key
6. Save Access Key ID + Secret Access Key
```

**4. OpenAI (Optional Fallback)** - [platform.openai.com](https://platform.openai.com)
```
Time: 2 minutes
Cost: Pay-as-you-go (optional)

Steps:
1. Sign up at https://platform.openai.com
2. Add payment method
3. Create API key
4. Copy key (sk-...)
```

#### Verification Checklist

- [ ] Node.js installed and `node --version` shows 18+
- [ ] pnpm installed and `pnpm --version` works
- [ ] Git configured with name and email
- [ ] AWS CLI installed and `aws --version` shows 2.x
- [ ] Clerk account created with keys saved
- [ ] Groq account created with API key saved
- [ ] AWS account with IAM user and access keys
- [ ] OpenAI key obtained (optional)

---

## 3. Project Structure

### 3.1 Repository Layout

```
Snapinfra/
├── app/                    # Next.js App Router (Frontend Pages)
│   ├── api/                # API Routes
│   │   ├── ai/             # AI endpoints
│   │   ├── deploy/         # Deployment endpoints
│   │   └── generate-backend/
│   ├── dashboard/page.tsx  # Main dashboard
│   ├── schema/page.tsx     # Schema designer
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
│
├── backend/                # Express.js Backend
│   ├── aws/cdk/            # AWS CDK Infrastructure
│   │   ├── app.ts          # CDK app entry point
│   │   └── snapinfra-stack.ts  # Stack definition
│   ├── src/
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utilities
│   │   └── server.ts       # Express server
│   ├── .env                # Backend environment
│   └── package.json        # Backend dependencies
│
├── components/             # React Components
│   ├── ui/                 # Radix UI components
│   ├── schema-designer.tsx
│   └── code-editor.tsx
│
├── lib/                    # Frontend Utilities
│   ├── app-context.tsx     # Global state
│   ├── utils.ts            # Helper functions
│   └── api-client.ts       # API wrapper
│
├── public/                 # Static Assets
│   ├── favicon.ico
│   └── images/
│
├── .env.local              # Frontend environment (gitignored)
├── .env.example            # Frontend env template
├── middleware.ts           # Clerk auth middleware
├── next.config.mjs         # Next.js configuration
├── package.json            # Frontend dependencies
├── tailwind.config.ts      # Tailwind CSS config
├── tsconfig.json           # TypeScript config
└── README.md               # Project overview
```

### 3.2 Key Directories Explained

| Directory | Purpose | Examples |
|-----------|---------|----------|
| `app/` | Next.js pages using App Router | `dashboard/page.tsx`, `api/projects/route.ts` |
| `backend/src/routes/` | Express API endpoints | `projects.ts`, `ai.ts`, `deployments.ts` |
| `backend/aws/cdk/` | Infrastructure as Code | `snapinfra-stack.ts` defines all AWS resources |
| `components/` | Reusable React components | `<Button>`, `<SchemaDesigner>`, `<CodeEditor>` |
| `lib/` | Frontend utilities & helpers | API client, context providers, utils |

### 3.3 Configuration Files

**Frontend:**
- `next.config.mjs` - Next.js settings (API rewrites, headers)
- `tailwind.config.ts` - Tailwind CSS theme
- `tsconfig.json` - TypeScript compiler options
- `.eslintrc.json` - Linting rules
- `middleware.ts` - Clerk authentication middleware

**Backend:**
- `backend/src/server.ts` - Express server setup
- `backend/aws/cdk/cdk.json` - CDK configuration
- `backend/tsconfig.json` - TypeScript compiler options
- `backend/.env` - Environment variables (secrets)

---

## 4. Local Development

### 4.1 Initial Setup (Time: 15 min)

#### Step 1: Clone Repository
```powershell
# Navigate to your projects folder
cd "C:\Users\YourUsername\Projects"

# Clone repository
git clone <your-repo-url> Snapinfra
cd Snapinfra

# Expected output: Cloning into 'Snapinfra'...
```

#### Step 2: Install Dependencies
```powershell
# Install frontend dependencies (root)
pnpm install
# Expected: Progress bar, ~2-3 minutes, "dependencies installed"

# Install backend dependencies
cd backend
pnpm install
# Expected: Progress bar, ~1-2 minutes, "dependencies installed"

cd ..
```

#### Step 3: Configure Environment

**Frontend Environment:**
```powershell
# Copy example file
cp .env.example .env.local

# Open in editor (VS Code)
code .env.local
```

Paste and update with your keys:
```env
# Clerk Keys (from https://dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXX

# Clerk URLs (keep as-is)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Groq AI (from https://console.groq.com)
GROQ_API_KEY=gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AI_MODEL=meta-llama/llama-4-scout-17b-16e-instruct
AI_TEMPERATURE=1
AI_MAX_TOKENS=8192
AI_TOP_P=1
AI_REASONING_EFFORT=medium
```

**Backend Environment:**
```powershell
cd backend
cp .env.example .env
code .env
```

Paste and update:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# AWS Configuration (from AWS IAM)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# DynamoDB Tables (will be created by CDK)
DYNAMODB_PROJECTS_TABLE=Snapinfra-projects
DYNAMODB_USERS_TABLE=Snapinfra-users
DYNAMODB_SCHEMAS_TABLE=Snapinfra-schemas
DYNAMODB_DEPLOYMENTS_TABLE=Snapinfra-deployments

# S3 Configuration
S3_BUCKET_NAME=Snapinfra-storage
S3_BUCKET_REGION=us-east-1

# SQS Queues
SQS_CODE_GENERATION_QUEUE=Snapinfra-code-generation
SQS_DEPLOYMENT_QUEUE=Snapinfra-deployments

# SNS Topics
SNS_DEPLOYMENT_NOTIFICATIONS=Snapinfra-deployment-notifications

# AI Services
GROQ_API_KEY=gsk_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
OPENAI_API_KEY=sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Clerk (same as frontend)
CLERK_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXX
CLERK_PUBLISHABLE_KEY=pk_test_XXXXXXXXXXXXXXXXXXXXXXXX

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Limits
MAX_FILE_SIZE=10485760
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

#### Step 4: Configure AWS CLI
```powershell
aws configure
# AWS Access Key ID [None]: <paste your access key>
# AWS Secret Access Key [None]: <paste your secret key>
# Default region name [None]: us-east-1
# Default output format [None]: json

# Verify configuration
aws sts get-caller-identity
# Expected output: JSON with UserId, Account, Arn
```

#### Step 5: Deploy AWS Infrastructure
```powershell
cd backend

# Bootstrap CDK (first time only)
npx cdk bootstrap
# Expected: Bootstrap stack deployed

# Deploy all resources
pnpm deploy
# or: npx cdk deploy

# Expected output:
# SnapinfraStack: creating CloudFormation changeset...
# SnapinfraStack: deploying...
# SnapinfraStack deployed
#
# Outputs:
# SnapinfraStack.ProjectsTableName = Snapinfra-projects
# SnapinfraStack.S3BucketName = Snapinfra-storage-xxx-us-east-1
# ...

cd ..
```

> **Time Note:** CDK deployment takes 2-5 minutes

#### Step 6: Verify Infrastructure

```powershell
# Check DynamoDB tables
aws dynamodb list-tables
# Expected: 4 tables (projects, users, schemas, deployments)

# Check S3 bucket
aws s3 ls
# Expected: Snapinfra-storage bucket

# Check SQS queues
aws sqs list-queues
# Expected: 2 queues (code-generation, deployments)
```

### 4.2 Running the Application

#### Start Development Servers

**Terminal 1 - Backend:**
```powershell
cd backend
pnpm dev

# Expected output:
# > backend@1.0.0 dev
# > ts-node-dev --respawn --transpile-only src/server.ts
# 
# [INFO] Server running on port 5000
# [INFO] Environment: development
# [INFO] DynamoDB connected
# [INFO] S3 bucket ready
```

**Terminal 2 - Frontend:**
```powershell
pnpm dev

# Expected output:
# > next dev
#
# Next.js 15.2.3
# - Local:        http://localhost:3000
# - Environments: .env.local
#
# Ready in 2.1s
```

#### Access the Application

1. Open browser: **http://localhost:3000**
2. You should see the Snapinfra homepage
3. Click "Sign In" or "Sign Up"
4. Complete Clerk authentication
5. You'll be redirected to `/onboarding`
6. Navigate to `/dashboard` to start creating projects

### 4.3 Verify Installation

#### Health Check

```powershell
# Backend health
curl http://localhost:5000/api/health

# Expected response:
# {
#   "status": "healthy",
#   "uptime": 123,
#   "timestamp": "2025-10-20T10:00:00.000Z",
#   "services": {
#     "dynamodb": "connected",
#     "s3": "connected",
#     "sqs": "connected"
#   }
# }
```

#### Test AI Generation

```powershell
curl -X POST http://localhost:5000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Generate a hello world function","temperature":0.7}'

# Expected: JSON response with generated code
```

#### Frontend Verification

1. Homepage loads at http://localhost:3000
2. Sign in page accessible at http://localhost:3000/sign-in
3. After sign in, redirected to onboarding
4. Dashboard accessible at http://localhost:3000/dashboard
5. No console errors in browser DevTools

### 4.4 Common Setup Issues

<details>
<summary><b>Port 3000 already in use</b></summary>

```powershell
# Find process using port
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use different port
pnpm dev -- -p 3001
```
</details>

<details>
<summary><b>pnpm install fails with EACCES</b></summary>

```powershell
# Run PowerShell as Administrator
# Or fix npm permissions:
npm config set prefix ~\AppData\Roaming\npm
```
</details>

<details>
<summary><b>CDK deploy fails with "Unable to resolve AWS account"</b></summary>

```powershell
# Reconfigure AWS CLI
aws configure

# Verify credentials
aws sts get-caller-identity

# Try deploy again
cd backend && pnpm deploy
```
</details>

<details>
<summary><b>Clerk authentication not working</b></summary>

1. Verify keys in `.env.local` match Clerk dashboard
2. Check Clerk dashboard → Application → URLs are correct
3. Clear browser cookies and try again
4. Check browser console for specific error
</details>

---

## 5. System Architecture

### 5.1 High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Browser  │  │  Mobile  │  │   API    │  │   CLI    │   │
│  │   App    │  │   App    │  │  Client  │  │   Tool   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼──────────┘
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                          │ HTTPS
        ┌─────────────────┴─────────────────┐
        │                                    │
┌───────▼──────────┐              ┌─────────▼─────────┐
│   Vercel CDN     │              │   Clerk Auth      │
│  (Edge Network)  │              │   (External)      │
└───────┬──────────┘              └───────────────────┘
        │
        │ Serves Next.js + Static Assets
        │
┌───────▼────────────────────────────────────────────────┐
│              APPLICATION LAYER (Next.js)                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  App Router (SSR + CSR)                          │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │  │
│  │  │ Pages  │ │   API  │ │Middleware│ │Server │   │  │
│  │  │        │ │ Routes │ │ (Auth)  │ │ Comp  │   │  │
│  │  └────────┘ └───┬────┘ └────────┘ └────────┘   │  │
│  └─────────────────┼──────────────────────────────┘  │
└────────────────────┼─────────────────────────────────┘
                     │ REST API
        ┌────────────┴────────────┐
        │                         │
┌───────▼──────────┐    ┌─────────▼─────────┐
│  Express Backend │    │   AI Services     │
│                  │    │  ┌─────────────┐  │
│  ┌────────────┐  │    │  │    Groq     │  │
│  │  Routes    │  │    │  │  (Primary)  │  │
│  ├────────────┤  │    │  ├─────────────┤  │
│  │ Middleware │  │    │  │   OpenAI    │  │
│  ├────────────┤  │    │  │ (Fallback)  │  │
│  │  Services  │  │    │  └─────────────┘  │
│  └────────────┘  │    └───────────────────┘
└───────┬──────────┘
        │
        │ AWS SDK
        │
┌───────▼────────────────────────────────────────────────┐
│                    DATA LAYER (AWS)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │ DynamoDB │  │    S3    │  │   SQS    │  │  SNS   ││
│  │          │  │          │  │          │  │        ││
│  │ 4 Tables │  │ Versioned│  │ 2 Queues │  │Topics  ││
│  │ 3 GSIs   │  │ Encrypted│  │ + DLQs   │  │        ││
│  └──────────┘  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────────────────────┘
```

### 5.2 Request Flow Diagram

```
User Action → Authentication → Processing → Data Storage → Response

┌─────┐                                              ┌─────┐
│User │                                              │User │
└──┬──┘                                              └──▲──┘
   │                                                    │
   │ 1. HTTPS Request                                  │ 7. Response
   │    (with JWT token)                               │    (JSON data)
   ▼                                                    │
┌──────────────┐                                       │
│ Vercel CDN   │                                       │
│  (Next.js)   │                                       │
└──────┬───────┘                                       │
       │ 2. Clerk Middleware                           │
       │    validates JWT                              │
       ▼                                               │
┌──────────────┐                                       │
│  App Router  │                                       │
│   (Page/API) │                                       │
└──────┬───────┘                                       │
       │ 3. API Call                                   │
       │    to Express                                 │
       ▼                                               │
┌──────────────┐                                       │
│   Express    │                                       │
│   Backend    │                                       │
└──────┬───────┘                                       │
       │ 4. Auth Verification                          │
       │    + Business Logic                           │
       ▼                                               │
┌──────────────┐                                       │
│  DynamoDB/   │                                       │
│   S3/SQS     │                                       │
└──────┬───────┘                                       │
       │ 5. Data Retrieved/Stored                      │
       │                                               │
       ▼                                               │
┌──────────────┐                                       │
│ Process &    │                                       │
│ Format Data  │───────────────────────────────────────┘
└──────────────┘    6. Build Response
```

### 5.3 Authentication Flow

```
┌──────┐                                           ┌───────┐
│Client│                                           │Clerk  │
└───┬──┘                                           │Service│
    │                                              └───┬───┘
    │ 1. Visit protected route                        │
    │    (e.g., /dashboard)                            │
    ├──────────────────────────────────────────────►  │
    │                                                  │
    │ 2. Middleware checks auth                       │
    │    (no valid session)                            │
    │                                                  │
    │ 3. Redirect to /sign-in                         │
    │◄─────────────────────────────────────────────   │
    │                                                  │
    │ 4. User enters credentials                      │
    ├──────────────────────────────────────────────►  │
    │                                                  │
    │                    5. Validate & create session │
    │                       (set cookies with JWT)    │
    │◄─────────────────────────────────────────────   │
    │                                                  │
    │ 6. Redirect to /onboarding                      │
    │◄─────────────────────────────────────────────   │
    │                                                  │
    │ 7. Access protected route                       │
    │    (JWT in cookie)                               │
    ├──────────────────────────────────────────────►  │
    │                                                  │
    │ 8. Middleware verifies JWT                      │
    │                                                  │
    │ 9. Allow access + render page                   │
    │◄─────────────────────────────────────────────   │
    │                                                  │

For API requests:
    │ 10. API call with Authorization header          │
    │     (Bearer <JWT>)                               │
    ├─────────────────────►                            │
    │                     Backend verifies token       │
    │                     with Clerk SDK               │
    │                       │                          │
    │                       ├──────────────────────►   │
    │                       │                          │
    │                       │  Token valid?            │
    │                       │◄─────────────────────    │
    │                       │                          │
    │  Response with data   │                          │
    │◄─────────────────────                            │
```

### 5.4 Component Interaction Matrix

| Component | Interacts With | Protocol | Purpose |
|-----------|---------------|----------|---------|
| Next.js Frontend | Clerk | HTTPS | Authentication |
| Next.js Frontend | Express Backend | REST API | Data operations |
| Next.js Frontend | Groq/OpenAI | HTTPS | AI code generation |
| Express Backend | DynamoDB | AWS SDK | Data persistence |
| Express Backend | S3 | AWS SDK | File storage |
| Express Backend | SQS | AWS SDK | Job queuing |
| Express Backend | SNS | AWS SDK | Notifications |
| Express Backend | Clerk | JWT Verification | Auth validation |

---

## 6. Database Design

### 6.1 DynamoDB Tables Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     DYNAMODB ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────┐      ┌──────────────────────┐    │
│  │ Snapinfra-projects   │      │  Snapinfra-users     │    │
│  │                      │      │                      │    │
│  │ PK: id (UUID)        │      │ PK: id (Clerk ID)    │    │
│  │ SK: userId           │      │                      │    │
│  │                      │      │ Fields:              │    │
│  │ GSI: UserIdIndex     │      │ - email              │    │
│  │  PK: userId          │      │ - username           │    │
│  │  SK: createdAt       │      │ - firstName          │    │
│  │                      │      │ - lastName           │    │
│  │ Fields:              │      │ - createdAt          │    │
│  │ - name               │      │ - updatedAt          │    │
│  │ - description        │      └──────────────────────┘    │
│  │ - schema (nested)    │                                   │
│  │ - status             │                                   │
│  │ - deployments[]      │      ┌──────────────────────┐    │
│  │ - createdAt          │      │ Snapinfra-schemas    │    │
│  │ - updatedAt          │      │                      │    │
│  └──────────────────────┘      │ PK: id (UUID)        │    │
│                                 │ SK: projectId        │    │
│                                 │                      │    │
│  ┌──────────────────────┐      │ GSI: ProjectIdIndex  │    │
│  │Snapinfra-deployments │      │  PK: projectId       │    │
│  │                      │      │  SK: createdAt       │    │
│  │ PK: id (UUID)        │      │                      │    │
│  │ SK: projectId        │      │ Fields:              │    │
│  │                      │      │ - name               │    │
│  │ GSI: ProjectIdIndex  │      │ - tables[]           │    │
│  │  PK: projectId       │      │ - relationships[]    │    │
│  │  SK: createdAt       │      │ - createdAt          │    │
│  │                      │      │ - updatedAt          │    │
│  │ Fields:              │      └──────────────────────┘    │
│  │ - userId             │                                   │
│  │ - platform           │                                   │
│  │ - status             │                                   │
│  │ - url                │                                   │
│  │ - logs[]             │                                   │
│  │ - config{}           │                                   │
│  │ - createdAt          │                                   │
│  │ - updatedAt          │                                   │
│  └──────────────────────┘                                   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 6.2 Projects Table Deep Dive

**Schema:**
```typescript
interface Project {
  // Primary Keys
  id: string;                    // UUID v4
  userId: string;                // Clerk user ID (e.g., user_2xYZ123ABC)
  
  // Metadata
  name: string;                  // "E-commerce API"
  description?: string;          // "Backend for online store"
  
  // Schema (nested object)
  schema: {
    id: string;
    projectId: string;
    name: string;
    tables: Array<{
      id: string;
      name: string;              // "users", "products"
      fields: Array<{
        id: string;
        name: string;            // "id", "email", "price"
        type: 'string' | 'integer' | 'float' | 'boolean' | 
              'date' | 'datetime' | 'text' | 'json';
        nullable: boolean;
        primaryKey: boolean;
        unique: boolean;
        defaultValue?: any;
      }>;
      indexes: Array<{
        id: string;
        name: string;            // "idx_email"
        fields: string[];        // ["email"]
        unique: boolean;
      }>;
    }>;
    relationships: Array<{
      id: string;
      fromTable: string;         // "orders"
      toTable: string;           // "users"
      type: 'one_to_one' | 'one_to_many' | 'many_to_many';
      onDelete?: 'CASCADE' | 'SET_NULL' | 'RESTRICT';
    }>;
    createdAt: string;           // ISO 8601
    updatedAt: string;
  };
  
  // Status tracking
  status: 'draft' | 'generating' | 'ready' | 'deploying' | 
          'deployed' | 'error';
  
  // Related resources
  deployments: string[];         // Array of deployment IDs
  
  // Timestamps
  createdAt: string;             // "2025-01-15T10:00:00.000Z"
  updatedAt: string;
}
```

**Example Document:**
```json
{
  "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
  "userId": "user_2xYZ123ABC",
  "name": "E-commerce API",
  "description": "Complete backend for online store",
  "schema": {
    "id": "schema_001",
    "projectId": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    "name": "E-commerce Schema",
    "tables": [
      {
        "id": "table_users",
        "name": "users",
        "fields": [
          {
            "id": "field_user_id",
            "name": "id",
            "type": "integer",
            "nullable": false,
            "primaryKey": true,
            "unique": true
          },
          {
            "id": "field_user_email",
            "name": "email",
            "type": "string",
            "nullable": false,
            "primaryKey": false,
            "unique": true
          }
        ],
        "indexes": [
          {
            "id": "idx_email",
            "name": "idx_email",
            "fields": ["email"],
            "unique": true
          }
        ]
      }
    ],
    "relationships": [
      {
        "id": "rel_001",
        "fromTable": "orders",
        "toTable": "users",
        "type": "one_to_many",
        "onDelete": "CASCADE"
      }
    ]
  },
  "status": "ready",
  "deployments": [],
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

**Access Patterns:**
1. Get project by ID: `GetItem(id, userId)`
2. List user's projects: `Query(UserIdIndex, userId)`
3. Update project: `UpdateItem(id, userId, updates)`
4. Delete project: `DeleteItem(id, userId)`

### 6.3 Users Table Schema

```typescript
interface User {
  id: string;           // PK: Clerk user ID
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}
```

**Access Patterns:**
1. Get user by ID: `GetItem(id)`
2. Create user: `PutItem(user)`
3. Update user: `UpdateItem(id, updates)`

### 6.4 Schemas Table Schema

```typescript
interface DatabaseSchema {
  id: string;           // PK
  projectId: string;    // SK
  name: string;
  tables: Table[];
  relationships: Relationship[];
  createdAt: string;
  updatedAt: string;
}
```

**Access Patterns:**
1. Get schema by ID: `GetItem(id, projectId)`
2. List project schemas: `Query(ProjectIdIndex, projectId)`
3. Update schema: `UpdateItem(id, projectId, updates)`

### 6.5 Deployments Table Schema

```typescript
interface Deployment {
  id: string;                 // PK
  projectId: string;          // SK
  userId: string;
  platform: 'vercel' | 'railway' | 'render' | 'heroku' | 'aws_ecs';
  status: 'pending' | 'building' | 'deploying' | 'success' | 'failed';
  url?: string;
  logs: Array<{
    id: string;
    timestamp: string;
    level: 'info' | 'warn' | 'error';
    message: string;
  }>;
  config: {
    environmentVariables: Record<string, string>;
    buildCommand?: string;
    startCommand?: string;
    nodeVersion?: string;
    region?: string;
  };
  createdAt: string;
  updatedAt: string;
}
```

**Access Patterns:**
1. Get deployment by ID: `GetItem(id, projectId)`
2. List project deployments: `Query(ProjectIdIndex, projectId)`
3. Update deployment status: `UpdateItem(id, projectId, {status, logs})`

### 6.6 DynamoDB Best Practices

**Single-Table Design Considerations:**
- Each entity has its own table for simplicity
- GSIs enable efficient querying by alternate keys
- Composite keys (PK + SK) prevent unauthorized access

**Query Optimization:**
- Always use Query over Scan when possible
- Leverage GSIs for secondary access patterns
- Use projection expressions to fetch only needed attributes

**Consistency:**
- Use strongly consistent reads for critical operations
- Eventually consistent reads for dashboard listings (acceptable delay)

---

## 7. Authentication Flow

### 7.1 Clerk Integration

**Frontend Middleware (`middleware.ts`):**
```typescript
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/onboarding(.*)",
  "/schema(.*)",
  "/projects(.*)",
  "/deployments(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

**Backend Token Verification:**
```typescript
import { verifyToken } from '@clerk/clerk-sdk-node';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Authentication token required' 
    });
  }
  
  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY
    });
    
    // Attach user ID to request
    req.userId = payload.sub;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ 
      success: false,
      error: 'Invalid or expired token' 
    });
  }
};
```

### 7.2 Protected Routes

**Frontend:**
```
Protected Routes (require authentication):
- /dashboard
- /onboarding
- /schema
- /projects
- /projects/:id
- /deployments
- /deployments/:id
- /settings
- /analytics
- /team

Public Routes (no authentication):
- /
- /sign-in
- /sign-up
- /docs
```

**Backend API:**
```
Protected Endpoints (require Bearer token):
- GET    /api/projects
- POST   /api/projects
- GET    /api/projects/:id
- PUT    /api/projects/:id
- DELETE /api/projects/:id
- POST   /api/ai/generate
- POST   /api/deployments
- GET    /api/deployments/:id

Public Endpoints:
- GET    /api/health
- POST   /api/webhooks/*
```

### 7.3 Frontend API Client

**lib/api-client.ts:**
```typescript
import { auth } from '@clerk/nextjs/server';

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  }

  private async getToken(): Promise<string | null> {
    const { getToken } = await auth();
    return getToken();
  }

  private async request(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = await this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Projects
  async getProjects() {
    return this.request('/api/projects');
  }

  async getProject(id: string) {
    return this.request(`/api/projects/${id}`);
  }

  async createProject(data: any) {
    return this.request('/api/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: any) {
    return this.request(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request(`/api/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // AI
  async generateCode(prompt: string, options: any = {}) {
    return this.request('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt, options }),
    });
  }

  // Deployments
  async createDeployment(projectId: string, config: any) {
    return this.request('/api/deployments', {
      method: 'POST',
      body: JSON.stringify({ projectId, config }),
    });
  }

  async getDeployment(id: string) {
    return this.request(`/api/deployments/${id}`);
  }
}

export const apiClient = new APIClient();
```

### 7.4 Session Management

**Session Duration:**
- Default: 7 days
- Configurable in Clerk dashboard

**Token Refresh:**
- Clerk automatically refreshes tokens
- Frontend SDK handles refresh transparently
- Backend verifies token on each request

**Logout:**
```typescript
import { useClerk } from '@clerk/nextjs';

function LogoutButton() {
  const { signOut } = useClerk();
  
  return (
    <button onClick={() => signOut()}>
      Sign Out
    </button>
  );
}
```

---

## 8. AI Integration

### 8.1 AI Service Architecture

```
┌──────────────────────────────────────────┐
│           AI Service Layer               │
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────┐     │
│  │      AI Service Manager        │     │
│  │                                │     │
│  │  - Provider selection logic    │     │
│  │  - Failover handling           │     │
│  │  - Rate limiting               │     │
│  │  - Prompt templating           │     │
│  └────────┬─────────────┬─────────┘     │
│           │             │               │
│           ▼             ▼               │
│  ┌─────────────┐  ┌──────────────┐     │
│  │    Groq     │  │   OpenAI     │     │
│  │  (Primary)  │  │  (Fallback)  │     │
│  └─────────────┘  └──────────────┘     │
│                                          │
└──────────────────────────────────────────┘
```

### 8.2 AI Service Implementation

**backend/src/services/ai/aiService.ts:**
```typescript
import Groq from 'groq-sdk';
import OpenAI from 'openai';

const groqClient = process.env.GROQ_API_KEY 
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

const openaiClient = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface AIRequest {
  prompt: string;
  systemMessage?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
}

interface AIResponse {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export class AIService {
  /**
   * Generate AI response with automatic fallback
   */
  static async generate(request: AIRequest): Promise<AIResponse> {
    // Try Groq first (faster, free tier)
    if (groqClient) {
      try {
        return await this.generateWithGroq(request);
      } catch (error) {
        console.error('Groq API failed, falling back to OpenAI:', error);
      }
    }
    
    // Fallback to OpenAI
    if (openaiClient) {
      return await this.generateWithOpenAI(request);
    }
    
    throw new Error('No AI service available. Configure GROQ_API_KEY or OPENAI_API_KEY.');
  }

  /**
   * Generate using Groq (Mixtral or Llama)
   */
  private static async generateWithGroq(request: AIRequest): Promise<AIResponse> {
    const model = request.model || 'mixtral-8x7b-32768';
    
    const response = await groqClient.chat.completions.create({
      model,
      messages: [
        ...(request.systemMessage 
          ? [{ role: 'system' as const, content: request.systemMessage }]
          : []
        ),
        { role: 'user' as const, content: request.prompt }
      ],
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 2048,
    });
    
    return {
      content: response.choices[0]?.message?.content || '',
      model: response.model,
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined,
    };
  }

  /**
   * Generate using OpenAI (GPT-4 or GPT-3.5)
   */
  private static async generateWithOpenAI(request: AIRequest): Promise<AIResponse> {
    const model = request.model || 'gpt-3.5-turbo';
    
    const response = await openaiClient.chat.completions.create({
      model,
      messages: [
        ...(request.systemMessage 
          ? [{ role: 'system' as const, content: request.systemMessage }]
          : []
        ),
        { role: 'user' as const, content: request.prompt }
      ],
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 2048,
    });
    
    return {
      content: response.choices[0]?.message?.content || '',
      model: response.model,
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      } : undefined,
    };
  }

  /**
   * Generate backend code from schema
   */
  static async generateBackendCode(schema: any): Promise<string> {
    const systemMessage = `You are an expert backend developer specializing in Express.js and TypeScript.
Generate production-ready code with:
- RESTful API endpoints
- Input validation with Joi
- Error handling middleware
- TypeScript interfaces
- Comments and documentation`;

    const prompt = `Generate a complete Express.js backend with TypeScript for this database schema:

${JSON.stringify(schema, null, 2)}

Requirements:
- CRUD endpoints for each table
- Proper HTTP status codes
- Input validation
- Error handling
- TypeScript types
- JWT authentication middleware

Output complete code organized by directory (routes, models, middleware, etc.).`;

    const response = await this.generate({
      systemMessage,
      prompt,
      temperature: 0.3, // Lower temperature for more consistent code
      maxTokens: 4096,
    });

    return response.content;
  }

  /**
   * Generate database schema from description
   */
  static async generateSchema(description: string): Promise<any> {
    const systemMessage = `You are a database architect. Generate normalized database schemas with proper relationships, indexes, and data types.`;

    const prompt = `Generate a database schema for: ${description}

Requirements:
- Design tables with proper primary keys
- Add foreign keys for relationships
- Include indexes for frequently queried fields
- Use appropriate data types
- Follow normalization principles

Output as JSON with this structure:
{
  "tables": [
    {
      "name": "table_name",
      "fields": [
        {
          "name": "field_name",
          "type": "string|integer|float|boolean|date|datetime|text|json",
          "nullable": true|false,
          "primaryKey": true|false,
          "unique": true|false
        }
      ],
      "indexes": [...]
    }
  ],
  "relationships": [
    {
      "fromTable": "table1",
      "toTable": "table2",
      "type": "one_to_one|one_to_many|many_to_many"
    }
  ]
}`;

    const response = await this.generate({
      systemMessage,
      prompt,
      temperature: 0.5,
      maxTokens: 2048,
    });

    // Parse JSON from response
    const jsonMatch = response.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to extract JSON from AI response');
    }

    return JSON.parse(jsonMatch[0]);
  }

  /**
   * Streaming generation (for real-time UI feedback)
   */
  static async *generateStream(request: AIRequest): AsyncGenerator<string> {
    if (!groqClient && !openaiClient) {
      throw new Error('No AI service available');
    }

    const client = groqClient || openaiClient;
    const model = request.model || (groqClient ? 'mixtral-8x7b-32768' : 'gpt-3.5-turbo');

    const stream = await client.chat.completions.create({
      model,
      messages: [
        ...(request.systemMessage 
          ? [{ role: 'system' as const, content: request.systemMessage }]
          : []
        ),
        { role: 'user' as const, content: request.prompt }
      ],
      temperature: request.temperature ?? 0.7,
      max_tokens: request.maxTokens ?? 2048,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
}
```

### 8.3 Prompt Templates

**Schema Generation Template:**
```typescript
const SCHEMA_GENERATION_PROMPT = `You are a database architect. Generate a normalized database schema.

User Request: {description}

Guidelines:
1. Identify main entities
2. Define relationships (1:1, 1:N, M:N)
3. Add appropriate indexes
4. Use proper data types
5. Follow normalization (3NF minimum)

Output format:
{
  "tables": [...],
  "relationships": [...],
  "indexes": [...]
}`;
```

**Backend Code Generation Template:**
```typescript
const BACKEND_GENERATION_PROMPT = `You are an expert Express.js developer.

Schema:
{schema_json}

Generate a complete backend with:
1. Express.js server setup
2. CRUD routes for each table
3. Joi validation schemas
4. Error handling middleware
5. TypeScript interfaces
6. Authentication middleware (JWT)
7. Database service layer

File structure:
src/
  server.ts
  routes/
    {table}.ts
  middleware/
    auth.ts
    errorHandler.ts
    validator.ts
  models/
    {table}.ts
  services/
    database.ts
  types/
    index.ts`;
```

### 8.4 Rate Limiting

```typescript
// Simple in-memory rate limiter
const rateLimiter = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(userId: string, limit: number = 20, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimiter.get(userId);

  if (!userLimit || now > userLimit.resetAt) {
    rateLimiter.set(userId, {
      count: 1,
      resetAt: now + windowMs,
    });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
}
```

### 8.5 Error Handling

```typescript
export class AIServiceError extends Error {
  constructor(
    message: string,
    public provider: 'groq' | 'openai',
    public originalError?: any
  ) {
    super(message);
    this.name = 'AIServiceError';
  }
}

// Usage in route
try {
  const result = await AIService.generate({ prompt: userPrompt });
  res.json({ success: true, data: result });
} catch (error) {
  if (error instanceof AIServiceError) {
    console.error(`AI Error (${error.provider}):`, error.message);
    res.status(503).json({
      success: false,
      error: 'AI service temporarily unavailable',
    });
  } else {
    throw error;
  }
}
```

---

## 9. Frontend Guide

### 9.1 Next.js App Router

**File-based Routing:**
```
app/
├── page.tsx                    → /
├── dashboard/page.tsx          → /dashboard
├── schema/page.tsx             → /schema
├── projects/
│   ├── page.tsx                → /projects
│   └── [id]/page.tsx           → /projects/:id
├── api/
│   ├── projects/route.ts       → /api/projects
│   └── ai/generate/route.ts    → /api/ai/generate
└── layout.tsx                  → Root layout
```

**Server vs Client Components:**

```typescript
// Server Component (default)
// Can fetch data directly, no useState/useEffect
async function DashboardPage() {
  const projects = await fetch('http://localhost:5000/api/projects')
    .then(r => r.json());
  
  return <ProjectList projects={projects} />;
}

// Client Component (needs interactivity)
'use client';
import { useState } from 'react';

function InteractiveForm() {
  const [value, setValue] = useState('');
  
  return (
    <input 
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### 9.2 State Management

**Global State with Context:**

**lib/app-context.tsx:**
```typescript
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  projects: any[];
  setProjects: (projects: any[]) => void;
  user: any | null;
  setUser: (user: any) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  return (
    <AppContext.Provider value={{ projects, setProjects, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
```

**Usage in layout.tsx:**
```typescript
import { AppProvider } from '@/lib/app-context';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <AppProvider>
            {children}
          </AppProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
```

### 9.3 Data Fetching Patterns

**Server Component (Recommended):**
```typescript
// app/dashboard/page.tsx
import { apiClient } from '@/lib/api-client';

export default async function DashboardPage() {
  const projects = await apiClient.getProjects();
  
  return (
    <div>
      <h1>Dashboard</h1>
      <ProjectList projects={projects} />
    </div>
  );
}
```

**Client Component (Interactive):**
```typescript
'use client';
import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const data = await apiClient.getProjects();
        setProjects(data.data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

**Optimistic Updates:**
```typescript
'use client';
import { useState } from 'react';
import { apiClient } from '@/lib/api-client';

export function CreateProjectForm() {
  const [projects, setProjects] = useState([]);

  async function handleCreate(formData: any) {
    // Optimistic update
    const tempProject = { id: 'temp-' + Date.now(), ...formData };
    setProjects([...projects, tempProject]);

    try {
      const newProject = await apiClient.createProject(formData);
      // Replace temp with real
      setProjects(prev => 
        prev.map(p => p.id === tempProject.id ? newProject.data : p)
      );
    } catch (error) {
      // Rollback on error
      setProjects(prev => prev.filter(p => p.id !== tempProject.id));
      alert('Failed to create project');
    }
  }

  return <form onSubmit={handleCreate}>...</form>;
}
```

### 9.4 Form Handling

**React Hook Form + Zod:**

```typescript
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().max(500).optional(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export function ProjectForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  async function onSubmit(data: ProjectFormData) {
    try {
      await apiClient.createProject(data);
      // Success handling
    } catch (error) {
      // Error handling
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Project Name</label>
        <input
          id="name"
          {...register('name')}
          className="border p-2"
        />
        {errors.name && (
          <p className="text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          {...register('description')}
          className="border p-2"
        />
        {errors.description && (
          <p className="text-red-500">{errors.description.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {isSubmitting ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  );
}
```

### 9.5 Styling with Tailwind CSS

**Utility Classes:**
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
    Action
  </button>
</div>
```

**Responsive Design:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Columns: 1 on mobile, 2 on tablet, 3 on desktop */}
</div>
```

**Dark Mode:**
```tsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Auto switches based on system preference */}
</div>
```

### 9.6 Component Library (Radix UI)

**Button Component:**
```typescript
// components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
```

**Usage:**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">
  Click Me
</Button>
<Button variant="destructive">
  Delete
</Button>
<Button variant="outline" size="sm">
  Cancel
</Button>
```

---

## 10. Backend Guide

### 10.1 Express Server Structure

**backend/src/server.ts:**
```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { validateEnv } from './utils/validateEnv';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimiter';

// Routes
import healthRoutes from './routes/health';
import projectRoutes from './routes/projects';
import aiRoutes from './routes/ai';
import deploymentRoutes from './routes/deployments';

// Validate environment variables
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Performance Middleware
app.use(helmet());
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true 
}));
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
app.use('/api', rateLimiter);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/deployments', deploymentRoutes);

// Error handling (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`[INFO] Server running on port ${PORT}`);
  console.log(`[INFO] Environment: ${process.env.NODE_ENV}`);
  console.log(`[INFO] CORS origin: ${process.env.CORS_ORIGIN}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[INFO] SIGTERM received, shutting down gracefully');
  process.exit(0);
});
```

### 10.2 Route Implementation

**backend/src/routes/projects.ts:**
```typescript
import { Router } from 'express';
import Joi from 'joi';
import { authenticateToken } from '../middleware/authMiddleware';
import { DynamoService } from '../services/database/dynamoService';
import { validateRequest } from '../middleware/validator';

const router = Router();

// Validation schemas
const createProjectSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  description: Joi.string().max(500).optional(),
  schema: Joi.object({
    tables: Joi.array().required(),
    relationships: Joi.array().optional(),
  }).required(),
});

const updateProjectSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  description: Joi.string().max(500).optional(),
  schema: Joi.object().optional(),
  status: Joi.string().valid('draft', 'generating', 'ready', 'deploying', 'deployed', 'error').optional(),
});

// GET /api/projects - List user's projects
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const projects = await DynamoService.getUserProjects(req.userId);
    
    res.json({
      success: true,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/projects/:id - Get specific project
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const project = await DynamoService.getProject(req.params.id, req.userId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found',
      });
    }
    
    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/projects - Create new project
router.post(
  '/',
  authenticateToken,
  validateRequest(createProjectSchema),
  async (req, res, next) => {
    try {
      const project = await DynamoService.createProject(req.userId, req.body);
      
      res.status(201).json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/projects/:id - Update project
router.put(
  '/:id',
  authenticateToken,
  validateRequest(updateProjectSchema),
  async (req, res, next) => {
    try {
      const project = await DynamoService.updateProject(
        req.params.id,
        req.userId,
        req.body
      );
      
      if (!project) {
        return res.status(404).json({
          success: false,
          error: 'Project not found',
        });
      }
      
      res.json({
        success: true,
        data: project,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/projects/:id - Delete project
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    await DynamoService.deleteProject(req.params.id, req.userId);
    
    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
```

### 10.3 DynamoDB Service

**backend/src/services/database/dynamoService.ts:**
```typescript
import { 
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { v4 as uuidv4 } from 'uuid';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
});

const PROJECTS_TABLE = process.env.DYNAMODB_PROJECTS_TABLE || 'Snapinfra-projects';

export class DynamoService {
  /**
   * Get all projects for a user
   */
  static async getUserProjects(userId: string): Promise<any[]> {
    const command = new QueryCommand({
      TableName: PROJECTS_TABLE,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: marshall({
        ':userId': userId,
      }),
      ScanIndexForward: false, // Most recent first
    });

    const response = await client.send(command);
    
    return response.Items?.map(item => unmarshall(item)) || [];
  }

  /**
   * Get a specific project
   */
  static async getProject(id: string, userId: string): Promise<any | null> {
    const command = new GetItemCommand({
      TableName: PROJECTS_TABLE,
      Key: marshall({ id, userId }),
    });

    const response = await client.send(command);
    
    return response.Item ? unmarshall(response.Item) : null;
  }

  /**
   * Create a new project
   */
  static async createProject(userId: string, data: any): Promise<any> {
    const now = new Date().toISOString();
    const project = {
      id: uuidv4(),
      userId,
      name: data.name,
      description: data.description || '',
      schema: data.schema,
      status: 'draft',
      deployments: [],
      createdAt: now,
      updatedAt: now,
    };

    const command = new PutItemCommand({
      TableName: PROJECTS_TABLE,
      Item: marshall(project),
    });

    await client.send(command);
    
    return project;
  }

  /**
   * Update a project
   */
  static async updateProject(
    id: string,
    userId: string,
    updates: any
  ): Promise<any | null> {
    // First verify project exists and belongs to user
    const existing = await this.getProject(id, userId);
    if (!existing) {
      return null;
    }

    const now = new Date().toISOString();
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    // Build update expression dynamically
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'userId' && key !== 'createdAt') {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    // Always update updatedAt
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = now;

    const command = new UpdateItemCommand({
      TableName: PROJECTS_TABLE,
      Key: marshall({ id, userId }),
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: marshall(expressionAttributeValues),
      ReturnValues: 'ALL_NEW',
    });

    const response = await client.send(command);
    
    return response.Attributes ? unmarshall(response.Attributes) : null;
  }

  /**
   * Delete a project
   */
  static async deleteProject(id: string, userId: string): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: PROJECTS_TABLE,
      Key: marshall({ id, userId }),
    });

    await client.send(command);
  }
}
```

### 10.4 Middleware

**Authentication Middleware:**
```typescript
// backend/src/middleware/authMiddleware.ts
import { verifyToken } from '@clerk/clerk-sdk-node';

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication token required',
    });
  }

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    req.userId = payload.sub;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
}
```

**Error Handler:**
```typescript
// backend/src/middleware/errorHandler.ts
export function errorHandler(err, req, res, next) {
  console.error('[ERROR]', err);

  // Joi validation error
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.details.map(d => d.message),
    });
  }

  // AWS SDK errors
  if (err.name === 'ResourceNotFoundException') {
    return res.status(404).json({
      success: false,
      error: 'Resource not found',
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}
```

**Rate Limiter:**
```typescript
// backend/src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'),
  message: {
    success: false,
    error: 'Too many requests, please try again later',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

**Validator:**
```typescript
// backend/src/middleware/validator.ts
import Joi from 'joi';

export function validateRequest(schema: Joi.Schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.details.map(d => ({
          field: d.path.join('.'),
          message: d.message,
        })),
      });
    }

    req.body = value;
    next();
  };
}
```

---

## 11. API Reference

### 11.1 Base URLs

- **Development:** `http://localhost:5000`
- **Production:** `https://api.snapinfra.com`

### 11.2 Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <clerk_jwt_token>
```

### 11.3 Common Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message",
  "details": ["Optional array of detailed errors"]
}
```

### 11.4 Projects Endpoints

#### List Projects

```http
GET /api/projects
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "userId": "user_xxx",
      "name": "Project Name",
      "description": "Description",
      "schema": { ... },
      "status": "ready",
      "deployments": [],
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-15T10:00:00.000Z"
    }
  ]
}
```

#### Get Project

```http
GET /api/projects/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Project Name",
    ...
  }
}
```

**Response (404):**
```json
{
  "success": false,
  "error": "Project not found"
}
```

#### Create Project

```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Project",
  "description": "Optional description",
  "schema": {
    "tables": [...],
    "relationships": [...]
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "New Project",
    "status": "draft",
    ...
  }
}
```

**Response (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "name",
      "message": "Name is required"
    }
  ]
}
```

#### Update Project

```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "ready"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated Name",
    "updatedAt": "2025-01-15T11:00:00.000Z",
    ...
  }
}
```

#### Delete Project

```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

### 11.5 AI Endpoints

#### Generate Code

```http
POST /api/ai/generate
Content-Type: application/json

{
  "prompt": "Generate a user authentication API",
  "options": {
    "temperature": 0.7,
    "maxTokens": 2048
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "content": "// Generated code here...",
    "model": "mixtral-8x7b-32768",
    "usage": {
      "promptTokens": 150,
      "completionTokens": 500,
      "totalTokens": 650
    }
  }
}
```

#### Stream Generation

```http
POST /api/ai/stream
Content-Type: application/json

{
  "prompt": "Generate backend code"
}
```

**Response:** Server-Sent Events (text/event-stream)
```
data: {"chunk": "// Import"}
data: {"chunk": " Express"}
data: {"chunk": "\nconst app"}
...
data: {"done": true}
```

### 11.6 Deployments Endpoints

#### Create Deployment

```http
POST /api/deployments
Authorization: Bearer <token>
Content-Type: application/json

{
  "projectId": "uuid",
  "platform": "vercel",
  "config": {
    "environmentVariables": {
      "NODE_ENV": "production"
    },
    "region": "us-east-1"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "projectId": "uuid",
    "platform": "vercel",
    "status": "pending",
    "logs": [],
    "createdAt": "2025-01-15T12:00:00.000Z"
  }
}
```

#### Get Deployment

```http
GET /api/deployments/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "status": "success",
    "url": "https://my-project.vercel.app",
    "logs": [
      {
        "id": "log1",
        "timestamp": "2025-01-15T12:01:00.000Z",
        "level": "info",
        "message": "Build started"
      }
    ]
  }
}
```

### 11.7 Health Check

```http
GET /api/health
```

**Response (200):**
```json
{
  "status": "healthy",
  "uptime": 12345,
  "timestamp": "2025-01-15T12:00:00.000Z",
  "services": {
    "dynamodb": "connected",
    "s3": "connected",
    "sqs": "connected"
  }
}
```

### 11.8 Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (missing/invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 429 | Too Many Requests (rate limit exceeded) |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## 12. Development Workflow

### 12.1 Daily Routine

```powershell
# Morning: Start fresh
git pull origin main
pnpm install  # If package.json changed
cd backend && pnpm install && cd ..

# Start services (2 terminals)
# Terminal 1:
cd backend && pnpm dev

# Terminal 2:
pnpm dev

# Work on feature
git checkout -b feature/my-feature
# Make changes...
git add .
git commit -m "feat: Add feature description"

# End of day
git push origin feature/my-feature
# Create PR on GitHub
```

### 12.2 Branch Strategy

```
main (protected)
  └─ develop
      ├─ feature/user-auth
      ├─ feature/schema-editor
      ├─ fix/deployment-bug
      └─ refactor/api-client
```

**Branch Naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `refactor/` - Code refactoring
- `docs/` - Documentation
- `test/` - Tests

### 12.3 Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (no code change)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

**Examples:**
```
feat(auth): Add JWT token refresh
fix(api): Fix CORS headers
docs(readme): Update setup instructions
refactor(db): Simplify DynamoDB queries
test(projects): Add project creation tests
chore(deps): Update dependencies
```

### 12.4 Code Review Checklist

**Before Creating PR:**
- [ ] Code runs locally without errors
- [ ] All tests pass
- [ ] No console.log statements (use proper logging)
- [ ] TypeScript types are correct (no `any`)
- [ ] Environment variables documented
- [ ] Comments added for complex logic
- [ ] Git history is clean (squash if needed)

**Reviewer Checklist:**
- [ ] Code follows project style
- [ ] Changes match PR description
- [ ] No security vulnerabilities
- [ ] Error handling is proper
- [ ] Performance considerations addressed
- [ ] Documentation updated if needed

### 12.5 Testing

**Frontend:**
```powershell
# Run type check
pnpm tsc --noEmit

# Run linter
pnpm lint

# Fix lint issues
pnpm lint --fix
```

**Backend:**
```powershell
cd backend

# Run type check
pnpm tsc --noEmit

# Run linter
pnpm lint

# Run tests (when implemented)
pnpm test
```

**Manual Testing:**
1. Test happy path
2. Test error cases
3. Test edge cases
4. Test on different browsers (Chrome, Firefox, Safari)
5. Test responsive design (mobile, tablet, desktop)

### 12.6 Debugging

**Frontend Debugging:**

```typescript
// Use browser DevTools
console.log('State:', state);
console.error('Error:', error);
console.table(arrayData);

// React DevTools
// Install extension: https://react.dev/learn/react-developer-tools

// Network tab
// Check API calls, response times, status codes
```

**Backend Debugging:**

```typescript
// Add debug logs
console.log('[DEBUG] Request body:', req.body);
console.error('[ERROR] Failed to fetch:', error);

// VS Code debugger
// Add breakpoints in VS Code
// Create launch.json:
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "pnpm",
      "runtimeArgs": ["dev"],
      "cwd": "${workspaceFolder}/backend",
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}

// AWS CloudWatch Logs
aws logs tail /aws/dynamodb/Snapinfra-projects --follow
```

**Common Issues:**

<details>
<summary><b>TypeError: Cannot read property 'x' of undefined</b></summary>

```typescript
// Bad
const name = user.profile.name; // Crashes if user or profile is undefined

// Good
const name = user?.profile?.name; // Optional chaining
const name = user && user.profile && user.profile.name; // Explicit checks
```
</details>

<details>
<summary><b>CORS Error</b></summary>

1. Check backend CORS_ORIGIN matches frontend URL
2. Ensure credentials: true if using cookies
3. Verify Authorization header is allowed
4. Check preflight OPTIONS request succeeds
</details>

---

## 13. Deployment

### 13.1 Frontend Deployment (Vercel)

**Initial Setup:**

1. **Connect Repository to Vercel**
   ```
   1. Go to https://vercel.com
   2. Click "New Project"
   3. Import your GitHub repository
   4. Configure:
      - Framework Preset: Next.js
      - Root Directory: ./
      - Build Command: pnpm build
      - Output Directory: .next
   5. Add environment variables
   6. Deploy
   ```

2. **Environment Variables**
   
   Navigate to Project Settings → Environment Variables:

   ```env
   # Clerk
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_XXXXXXXX
   CLERK_SECRET_KEY=sk_live_XXXXXXXX
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
   
   # API
   NEXT_PUBLIC_API_URL=https://api.snapinfra.com
   
   # AI
   GROQ_API_KEY=gsk_XXXXXXXX
   AI_MODEL=mixtral-8x7b-32768
   ```

   **Important:** Set for all environments:
   - Production
   - Preview
   - Development

3. **Automatic Deployments**
   
   Once configured:
   - Push to `main` → Production deployment
   - Push to any branch → Preview deployment
   - Pull requests → Automatic preview URLs

4. **Custom Domain**
   
   ```
   1. Go to Project Settings → Domains
   2. Add domain: app.snapinfra.com
   3. Update DNS records (Vercel provides instructions)
   4. Wait for SSL certificate (automatic)
   ```

**Deployment Commands:**

```powershell
# Manual deployment from CLI
npx vercel

# Deploy to production
npx vercel --prod

# Check deployment status
npx vercel inspect <deployment-url>
```

### 13.2 Backend Deployment

#### Option 1: AWS Elastic Beanstalk

**Setup:**

```powershell
# Install EB CLI
pip install awsebcli

# Navigate to backend
cd backend

# Initialize EB application
eb init -p node.js-18 snapinfra-backend --region us-east-1

# Create environment
eb create snapinfra-backend-prod \
  --instance-type t3.small \
  --envvars \
    NODE_ENV=production,\
    PORT=8080,\
    CORS_ORIGIN=https://app.snapinfra.com

# Deploy
eb deploy

# Check status
eb status

# View logs
eb logs

# Open in browser
eb open
```

**Configuration File (.ebextensions/environment.config):**

```yaml
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    NodeVersion: 18.x
  aws:elasticbeanstalk:environment:proxy:
    ProxyServer: nginx
  aws:autoscaling:launchconfiguration:
    InstanceType: t3.small
  aws:autoscaling:asg:
    MinSize: 1
    MaxSize: 4
```

**Environment Variables:**

```powershell
# Set all environment variables
eb setenv \
  AWS_REGION=us-east-1 \
  AWS_ACCESS_KEY_ID=AKIAXXXXXXXX \
  AWS_SECRET_ACCESS_KEY=XXXXXXXX \
  DYNAMODB_PROJECTS_TABLE=Snapinfra-projects \
  CLERK_SECRET_KEY=sk_live_XXXXXXXX \
  GROQ_API_KEY=gsk_XXXXXXXX
```

#### Option 2: Railway

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize
cd backend
railway init

# Add environment variables via dashboard
# https://railway.app/project/<project-id>/variables

# Deploy
railway up

# View logs
railway logs
```

#### Option 3: AWS ECS (Fargate)

**Create Dockerfile:**

```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8080

CMD ["node", "dist/server.js"]
```

**Deploy with CDK:**

```typescript
// backend/aws/cdk/snapinfra-stack.ts

import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';

// Create VPC
const vpc = new ec2.Vpc(this, 'SnapinfraVPC', {
  maxAzs: 2,
});

// Create ECS cluster
const cluster = new ecs.Cluster(this, 'BackendCluster', {
  vpc,
  clusterName: 'snapinfra-backend',
});

// Create Fargate service
const taskDefinition = new ecs.FargateTaskDefinition(this, 'BackendTask', {
  memoryLimitMiB: 512,
  cpu: 256,
});

const container = taskDefinition.addContainer('backend', {
  image: ecs.ContainerImage.fromAsset('../'),
  logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'backend' }),
  environment: {
    NODE_ENV: 'production',
    PORT: '8080',
  },
  secrets: {
    CLERK_SECRET_KEY: ecs.Secret.fromSecretsManager(clerkSecret),
    GROQ_API_KEY: ecs.Secret.fromSecretsManager(groqSecret),
  },
});

container.addPortMappings({ containerPort: 8080 });

// Create Application Load Balancer
const alb = new elbv2.ApplicationLoadBalancer(this, 'BackendALB', {
  vpc,
  internetFacing: true,
});

const listener = alb.addListener('HttpListener', {
  port: 443,
  certificates: [certificate],
});

const service = new ecs.FargateService(this, 'BackendService', {
  cluster,
  taskDefinition,
  desiredCount: 2,
});

listener.addTargets('BackendTarget', {
  port: 8080,
  targets: [service],
  healthCheck: {
    path: '/api/health',
    interval: cdk.Duration.seconds(30),
  },
});
```

### 13.3 Infrastructure Deployment

**Deploy AWS Resources:**

```powershell
cd backend

# First time: Bootstrap CDK
npx cdk bootstrap

# Check changes
npx cdk diff

# Deploy all stacks
npx cdk deploy --all

# Deploy specific stack
npx cdk deploy SnapinfraStack

# Destroy (careful!)
npx cdk destroy
```

**Multi-Environment Setup:**

```typescript
// backend/aws/cdk/app.ts
import * as cdk from 'aws-cdk-lib';
import { SnapinfraStack } from './snapinfra-stack';

const app = new cdk.App();

// Development environment
new SnapinfraStack(app, 'SnapinfraStackDev', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
  stage: 'dev',
});

// Production environment
new SnapinfraStack(app, 'SnapinfraStackProd', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
  stage: 'prod',
});
```

### 13.4 Deployment Checklist

**Pre-Deployment:**
- [ ] All tests pass
- [ ] Code reviewed and approved
- [ ] Environment variables documented
- [ ] Database migrations ready (if any)
- [ ] API contracts unchanged (or versioned)
- [ ] Performance tested
- [ ] Security scan passed

**Post-Deployment:**
- [ ] Health check returns 200
- [ ] All endpoints responding
- [ ] Logs show no errors
- [ ] Monitoring dashboards updated
- [ ] Team notified
- [ ] Documentation updated

**Rollback Plan:**
```powershell
# Vercel: Rollback to previous deployment
vercel rollback <deployment-url>

# Elastic Beanstalk: Rollback
eb deploy --version <previous-version>

# Railway: Redeploy previous commit
railway up --service <service-id> <commit-hash>
```

---

## 14. Monitoring & Observability

### 14.1 Metrics to Track

**Application Metrics:**
- Request rate (req/sec)
- Response time (p50, p95, p99)
- Error rate (%)
- Success rate (%)
- API endpoint usage

**Infrastructure Metrics:**
- CPU utilization (%)
- Memory utilization (%)
- Network throughput (MB/s)
- Disk usage (%)

**Database Metrics:**
- Read/Write capacity units (DynamoDB)
- Throttled requests
- Query latency
- Item count

**Business Metrics:**
- Active users
- Projects created
- Deployments completed
- AI generations requested

### 14.2 Frontend Monitoring

**Vercel Analytics:**

```typescript
// Already integrated by default
// View at: https://vercel.com/dashboard/analytics

// Custom events
import { track } from '@vercel/analytics';

track('project_created', {
  projectId: project.id,
  projectName: project.name,
});

track('deployment_started', {
  platform: 'vercel',
});
```

**Web Vitals:**

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

**Custom Error Tracking:**

```typescript
// lib/error-tracking.ts
export function logError(error: Error, context?: Record<string, any>) {
  console.error('Error:', error);
  
  // Send to error tracking service (Sentry, Rollbar, etc.)
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error, { extra: context });
  }
}

// Usage
try {
  await apiClient.createProject(data);
} catch (error) {
  logError(error, { action: 'create_project', userId: user.id });
}
```

### 14.3 Backend Monitoring

**CloudWatch Logs:**

```typescript
// backend/src/utils/logger.ts
import { CloudWatchLogsClient, PutLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';

const client = new CloudWatchLogsClient({ region: process.env.AWS_REGION });

export class Logger {
  private logGroupName: string;
  private logStreamName: string;

  constructor(groupName: string, streamName: string) {
    this.logGroupName = groupName;
    this.logStreamName = streamName;
  }

  async log(level: 'info' | 'warn' | 'error', message: string, meta?: any) {
    const logEvent = {
      timestamp: Date.now(),
      message: JSON.stringify({ level, message, meta }),
    };

    // Console log for local development
    console.log(`[${level.toUpperCase()}]`, message, meta);

    // CloudWatch for production
    if (process.env.NODE_ENV === 'production') {
      try {
        await client.send(new PutLogEventsCommand({
          logGroupName: this.logGroupName,
          logStreamName: this.logStreamName,
          logEvents: [logEvent],
        }));
      } catch (error) {
        console.error('Failed to send log to CloudWatch:', error);
      }
    }
  }

  info(message: string, meta?: any) {
    return this.log('info', message, meta);
  }

  warn(message: string, meta?: any) {
    return this.log('warn', message, meta);
  }

  error(message: string, meta?: any) {
    return this.log('error', message, meta);
  }
}

export const logger = new Logger('snapinfra-backend', 'main');
```

**Custom Metrics:**

```typescript
// backend/src/utils/metrics.ts
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

const client = new CloudWatchClient({ region: process.env.AWS_REGION });

export async function recordMetric(
  name: string,
  value: number,
  unit: string = 'Count'
) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[METRIC] ${name}: ${value} ${unit}`);
    return;
  }

  try {
    await client.send(new PutMetricDataCommand({
      Namespace: 'Snapinfra',
      MetricData: [{
        MetricName: name,
        Value: value,
        Unit: unit,
        Timestamp: new Date(),
      }],
    }));
  } catch (error) {
    console.error('Failed to record metric:', error);
  }
}

// Usage
await recordMetric('ProjectCreated', 1);
await recordMetric('AIGenerationTime', 2.5, 'Seconds');
await recordMetric('DeploymentSuccess', 1);
```

**Request Logging Middleware:**

```typescript
// backend/src/middleware/requestLogger.ts
import { logger } from '../utils/logger';

export function requestLogger(req, res, next) {
  const startTime = Date.now();

  // Log request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    userId: req.userId,
    ip: req.ip,
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userId: req.userId,
    });

    // Record metrics
    recordMetric('RequestDuration', duration, 'Milliseconds');
    recordMetric(`StatusCode${res.statusCode}`, 1);
  });

  next();
}
```

### 14.4 CloudWatch Dashboards

**Create Dashboard:**

```typescript
// backend/aws/cdk/monitoring-stack.ts
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

const dashboard = new cloudwatch.Dashboard(this, 'SnapinfraDashboard', {
  dashboardName: 'Snapinfra-Monitoring',
});

// API Response Time
dashboard.addWidgets(new cloudwatch.GraphWidget({
  title: 'API Response Time',
  left: [
    new cloudwatch.Metric({
      namespace: 'Snapinfra',
      metricName: 'RequestDuration',
      statistic: 'Average',
    }),
  ],
}));

// Error Rate
dashboard.addWidgets(new cloudwatch.GraphWidget({
  title: 'Error Rate',
  left: [
    new cloudwatch.Metric({
      namespace: 'Snapinfra',
      metricName: 'StatusCode500',
      statistic: 'Sum',
    }),
  ],
}));

// DynamoDB Metrics
dashboard.addWidgets(new cloudwatch.GraphWidget({
  title: 'DynamoDB Read/Write',
  left: [
    projectsTable.metricConsumedReadCapacityUnits(),
    projectsTable.metricConsumedWriteCapacityUnits(),
  ],
}));
```

### 14.5 Alerting

**CloudWatch Alarms:**

```typescript
// High error rate alarm
const errorAlarm = new cloudwatch.Alarm(this, 'HighErrorRate', {
  metric: new cloudwatch.Metric({
    namespace: 'Snapinfra',
    metricName: 'StatusCode500',
    statistic: 'Sum',
    period: cdk.Duration.minutes(5),
  }),
  threshold: 10,
  evaluationPeriods: 2,
  alarmDescription: 'Alert when error rate is high',
  actionsEnabled: true,
});

// Subscribe to SNS topic
errorAlarm.addAlarmAction(new cloudwatchActions.SnsAction(alertTopic));

// High response time alarm
const latencyAlarm = new cloudwatch.Alarm(this, 'HighLatency', {
  metric: new cloudwatch.Metric({
    namespace: 'Snapinfra',
    metricName: 'RequestDuration',
    statistic: 'Average',
    period: cdk.Duration.minutes(5),
  }),
  threshold: 1000, // 1 second
  evaluationPeriods: 3,
  alarmDescription: 'Alert when response time is high',
});

latencyAlarm.addAlarmAction(new cloudwatchActions.SnsAction(alertTopic));
```

**Email Notifications:**

```powershell
# Subscribe to SNS topic
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:Snapinfra-Alerts \
  --protocol email \
  --notification-endpoint your@email.com

# Confirm subscription via email
```

### 14.6 Log Analysis

**Query CloudWatch Logs:**

```powershell
# View recent logs
aws logs tail /aws/lambda/snapinfra-backend --follow

# Search for errors
aws logs filter-log-events \
  --log-group-name /aws/lambda/snapinfra-backend \
  --filter-pattern "ERROR"

# Query with CloudWatch Insights
aws logs start-query \
  --log-group-name /aws/lambda/snapinfra-backend \
  --start-time $(date -u -d '1 hour ago' +%s) \
  --end-time $(date -u +%s) \
  --query-string "fields @timestamp, @message | filter @message like /ERROR/ | sort @timestamp desc"
```

---

## 15. Security

### 15.1 Authentication & Authorization

**JWT Token Security:**
- Tokens expire after 7 days
- Tokens stored in httpOnly cookies (frontend)
- Tokens verified on every request (backend)
- No sensitive data in JWT payload

**Best Practices:**
```typescript
// Never store sensitive data in JWT
// BAD
const token = jwt.sign({ password: user.password }, secret);

// GOOD
const token = jwt.sign({ userId: user.id, email: user.email }, secret);
```

**Resource Authorization:**
```typescript
// Always verify resource ownership
async function getProject(projectId: string, userId: string) {
  const project = await DynamoService.getProject(projectId, userId);
  
  // This prevents user A from accessing user B's project
  // DynamoDB composite key (id + userId) enforces this
  
  if (!project) {
    throw new Error('Project not found or access denied');
  }
  
  return project;
}
```

### 15.2 Input Validation

**Server-Side Validation (Required):**

```typescript
import Joi from 'joi';

const projectSchema = Joi.object({
  name: Joi.string()
    .min(1)
    .max(100)
    .pattern(/^[a-zA-Z0-9\s-_]+$/)
    .required(),
  description: Joi.string()
    .max(500)
    .optional(),
  schema: Joi.object({
    tables: Joi.array().min(1).required(),
    relationships: Joi.array().optional(),
  }).required(),
});

// Usage
const { error, value } = projectSchema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details });
}
```

**Client-Side Validation (UX Enhancement):**

```typescript
import * as z from 'zod';

const projectSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'Invalid characters'),
  description: z.string()
    .max(500)
    .optional(),
});
```

**Sanitization:**

```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML input
const cleanHtml = DOMPurify.sanitize(userInput);

// Escape SQL-like queries (not needed for DynamoDB, but good practice)
function escapeString(str: string): string {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
    switch (char) {
      case '\0': return '\\0';
      case '\x08': return '\\b';
      case '\x09': return '\\t';
      case '\x1a': return '\\z';
      case '\n': return '\\n';
      case '\r': return '\\r';
      case '"':
      case "'":
      case '\\':
      case '%':
        return '\\' + char;
      default: return char;
    }
  });
}
```

### 15.3 API Security

**Rate Limiting:**

```typescript
import rateLimit from 'express-rate-limit';

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: 'Too many requests from this IP',
});

app.use('/api/', apiLimiter);

// Stricter limit for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'AI generation rate limit exceeded',
});

app.use('/api/ai/', aiLimiter);
```

**CORS Configuration:**

```typescript
import cors from 'cors';

const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours
};

app.use(cors(corsOptions));
```

**Security Headers (Helmet):**

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

### 15.4 Secrets Management

**Environment Variables:**

```powershell
# NEVER commit secrets to Git
# Add to .gitignore:
.env
.env.local
.env.production

# Use environment variables
process.env.CLERK_SECRET_KEY
process.env.AWS_SECRET_ACCESS_KEY
```

**AWS Secrets Manager (Production):**

```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'us-east-1' });

async function getSecret(secretName: string): Promise<string> {
  const command = new GetSecretValueCommand({ SecretId: secretName });
  const response = await client.send(command);
  return response.SecretString || '';
}

// Usage
const clerkSecret = await getSecret('snapinfra/clerk-secret-key');
const groqApiKey = await getSecret('snapinfra/groq-api-key');
```

**CDK Secrets Integration:**

```typescript
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

const clerkSecret = secretsmanager.Secret.fromSecretNameV2(
  this,
  'ClerkSecret',
  'snapinfra/clerk-secret-key'
);

// Grant read access to backend
clerkSecret.grantRead(backendRole);

// Use in ECS
taskDefinition.addContainer('backend', {
  secrets: {
    CLERK_SECRET_KEY: ecs.Secret.fromSecretsManager(clerkSecret),
  },
});
```

### 15.5 Data Security

**Encryption at Rest:**
- DynamoDB: AWS-managed encryption (AES-256)
- S3: Server-side encryption enabled
- RDS: Encryption enabled for production

**Encryption in Transit:**
- HTTPS only (enforced)
- TLS 1.2+ required
- Certificate validation

**Data Retention:**

```typescript
// S3 Lifecycle Policy
storageBucket.addLifecycleRule({
  id: 'DeleteOldVersions',
  noncurrentVersionExpiration: cdk.Duration.days(30),
  expiredObjectDeleteMarker: true,
});

// DynamoDB backup retention
projectsTable.addGlobalSecondaryIndex({
  indexName: 'DeletedIndex',
  partitionKey: { name: 'deleted', type: dynamodb.AttributeType.STRING },
  sortKey: { name: 'deletedAt', type: dynamodb.AttributeType.STRING },
});
```

### 15.6 Security Checklist

**Development:**
- [ ] No secrets in code
- [ ] Input validation on all endpoints
- [ ] Output encoding to prevent XSS
- [ ] Parameterized queries (no SQL injection)
- [ ] Secure dependencies (run `npm audit`)

**Production:**
- [ ] HTTPS enforced
- [ ] Strong authentication (Clerk)
- [ ] Rate limiting enabled
- [ ] Security headers (Helmet)
- [ ] CORS properly configured
- [ ] Secrets in Secrets Manager
- [ ] Regular security audits
- [ ] Logging and monitoring active

**Incident Response:**
```
1. Detect: Monitoring alerts
2. Contain: Isolate affected systems
3. Investigate: Review logs
4. Remediate: Apply fixes
5. Document: Write post-mortem
6. Improve: Update security measures
```

---

## 16. Troubleshooting

### 16.1 Common Issues

#### Frontend Issues

<details>
<summary><b>Port 3000 already in use</b></summary>

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solutions:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (Windows)
taskkill /PID <PID> /F

# Or use different port
pnpm dev -- -p 3001

# Or set in package.json
"dev": "next dev -p 3001"
```
</details>

<details>
<summary><b>Module not found errors</b></summary>

**Symptoms:**
```
Module not found: Can't resolve '@/components/ui/button'
```

**Solutions:**
```powershell
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Check path alias in tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# Restart dev server
pnpm dev
```
</details>

<details>
<summary><b>Clerk authentication not working</b></summary>

**Symptoms:**
- Redirects to sign-in but immediately redirects back
- "Invalid publishable key" error
- Infinite redirect loop

**Solutions:**
```powershell
# 1. Verify environment variables
cat .env.local | grep CLERK

# 2. Check keys match Clerk dashboard
# Go to https://dashboard.clerk.com → API Keys

# 3. Clear browser cookies
# DevTools → Application → Cookies → Clear all

# 4. Verify middleware.ts is correct
# Check matcher includes protected routes

# 5. Restart dev server
pnpm dev
```
</details>

#### Backend Issues

<details>
<summary><b>AWS credentials not found</b></summary>

**Symptoms:**
```
Error: Missing credentials in config
```

**Solutions:**
```powershell
# Configure AWS CLI
aws configure

# Verify credentials
aws sts get-caller-identity

# Check environment variables
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY

# Check credentials file
cat ~/.aws/credentials
```
</details>

<details>
<summary><b>DynamoDB table not found</b></summary>

**Symptoms:**
```
ResourceNotFoundException: Requested resource not found: Table: Snapinfra-projects
```

**Solutions:**
```powershell
# Check if table exists
aws dynamodb list-tables

# Deploy CDK stack
cd backend
npx cdk deploy

# Verify table created
aws dynamodb describe-table --table-name Snapinfra-projects

# Check region matches
echo $AWS_REGION  # Should be us-east-1
```
</details>

<details>
<summary><b>CORS errors</b></summary>

**Symptoms:**
```
Access to fetch at 'http://localhost:5000/api/projects' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solutions:**
```typescript
// backend/.env
CORS_ORIGIN=http://localhost:3000

// backend/src/server.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// Restart backend
cd backend && pnpm dev
```
</details>

<details>
<summary><b>AI generation failing</b></summary>

**Symptoms:**
```
Error: Failed to generate code
AI service unavailable
```

**Solutions:**
```powershell
# 1. Verify API keys
echo $GROQ_API_KEY
# Should start with gsk_

# 2. Test Groq API directly
curl -X POST https://api.groq.com/openai/v1/chat/completions \
  -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"mixtral-8x7b-32768","messages":[{"role":"user","content":"Hello"}]}'

# 3. Check rate limits
# Groq free tier: 30 requests/minute

# 4. Try OpenAI fallback
# Set OPENAI_API_KEY in .env

# 5. Check logs for specific error
cd backend && pnpm dev
```
</details>

### 16.2 Debugging Tools

**Frontend:**

```typescript
// Enable verbose logging
localStorage.setItem('debug', '*');

// React DevTools
// Install: https://react.dev/learn/react-developer-tools

// Network inspection
// Chrome DevTools → Network tab

// Component tree
// React DevTools → Components tab
```

**Backend:**

```typescript
// Verbose logging
DEBUG=* pnpm dev

// VS Code debugger
// Set breakpoints, press F5

// Request inspection
// Use Postman/Insomnia with these collections:
// https://documenter.getpostman.com/view/snapinfra
```

**AWS:**

```powershell
# CloudWatch Logs
aws logs tail /aws/dynamodb/Snapinfra-projects --follow

# DynamoDB scan
aws dynamodb scan --table-name Snapinfra-projects

# S3 list objects
aws s3 ls s3://Snapinfra-storage/

# SQS messages
aws sqs receive-message --queue-url https://sqs.us-east-1.amazonaws.com/123456789012/Snapinfra-code-generation
```

### 16.3 Performance Issues

<details>
<summary><b>Slow page loads</b></summary>

**Diagnosis:**
```typescript
// Chrome DevTools → Performance tab
// Record, interact, stop, analyze

// Lighthouse audit
// DevTools → Lighthouse → Generate report

// Check bundle size
pnpm build
# Look at .next/analyze output
```

**Solutions:**
```typescript
// 1. Code splitting
import dynamic from 'next/dynamic';
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
});

// 2. Image optimization
import Image from 'next/image';
<Image src="/large.jpg" width={800} height={600} priority />

// 3. Lazy loading
const LazyComponent = lazy(() => import('./Component'));

// 4. Caching
export const revalidate = 3600; // Revalidate every hour
```
</details>

<details>
<summary><b>Slow API responses</b></summary>

**Diagnosis:**
```powershell
# Measure response time
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:5000/api/projects

# curl-format.txt:
# time_total: %{time_total}s
```

**Solutions:**
```typescript
// 1. Add database indexes
// Check DynamoDB GSIs are used

// 2. Use Query instead of Scan
// Query with partition key (userId)

// 3. Enable caching
import Redis from 'ioredis';
const redis = new Redis();

// 4. Batch operations
const projects = await Promise.all(
  ids.map(id => getProject(id))
);

// 5. Pagination
const params = {
  TableName: 'Snapinfra-projects',
  Limit: 20,
  ExclusiveStartKey: lastKey,
};
```
</details>

### 16.4 Error Messages Reference

| Error Message | Meaning | Solution |
|---------------|---------|----------|
| `EADDRINUSE` | Port already in use | Kill process or use different port |
| `MODULE_NOT_FOUND` | Missing dependency | `pnpm install` |
| `ResourceNotFoundException` | AWS resource missing | Deploy CDK stack |
| `ValidationError` | Invalid input | Check request payload |
| `UnauthorizedError` | Missing/invalid token | Check Clerk authentication |
| `ThrottlingException` | Rate limit exceeded | Wait and retry |
| `NetworkError` | Cannot reach server | Check server is running |

### 16.5 Getting Help

**Internal Resources:**
- Team Slack: #snapinfra-help
- Documentation: This file
- Code comments: Check inline documentation

**External Resources:**
- Next.js: https://nextjs.org/docs
- Clerk: https://clerk.com/docs
- AWS: https://docs.aws.amazon.com
- Stack Overflow: Tag with `nextjs`, `aws-cdk`, `dynamodb`

**Creating a Bug Report:**

```markdown
## Bug Report

**Environment:**
- OS: Windows 11
- Node: v18.20.0
- Browser: Chrome 120

**Steps to Reproduce:**
1. Navigate to /dashboard
2. Click "Create Project"
3. Error appears

**Expected Behavior:**
Project creation form should open

**Actual Behavior:**
TypeError: Cannot read property 'x' of undefined

**Screenshots:**
[Attach screenshots]

**Console Logs:**
```
[Paste relevant logs]
```

**Additional Context:**
This started after updating dependencies
```

---

## 17. Performance Optimization

### 17.1 Frontend Optimization

**Code Splitting:**

```typescript
// Automatic route-based splitting (Next.js does this)
// Each page in app/ is a separate bundle

// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const SchemaEditor = dynamic(() => import('@/components/schema-editor'), {
  loading: () => <div>Loading editor...</div>,
  ssr: false, // Don't render on server (if it uses window/document)
});

const Chart = dynamic(() => import('react-chartjs-2'), {
  ssr: false,
});
```

**Image Optimization:**

```typescript
import Image from 'next/image';

// Optimized image
<Image
  src="/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // Load immediately (above fold)
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// Responsive images
<Image
  src="/hero.jpg"
  alt="Hero"
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  style={{ objectFit: 'cover' }}
/>
```

**Font Optimization:**

```typescript
// next.config.mjs
const nextConfig = {
  optimizeFonts: true, // Enabled by default
};

// Using next/font
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

**Caching Strategies:**

```typescript
// Static page (regenerated every hour)
export const revalidate = 3600;

export default async function Page() {
  const data = await fetch('https://api.example.com/data');
  return <div>{data}</div>;
}

// Dynamic page with ISR
export async function generateStaticParams() {
  return [{ id: '1' }, { id: '2' }];
}

export default async function ProjectPage({ params }) {
  const project = await getProject(params.id);
  return <div>{project.name}</div>;
}
```

**React Performance:**

```typescript
// Memoization
import { memo, useMemo, useCallback } from 'react';

const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  const processed = useMemo(() => {
    return data.map(item => /* expensive operation */);
  }, [data]);

  return <div>{processed}</div>;
});

// Callback memoization
function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []); // Dependencies

  return <Child onClick={handleClick} />;
}
```

### 17.2 Backend Optimization

**Database Query Optimization:**

```typescript
// BAD: Scan entire table
const allProjects = await dynamodb.scan({
  TableName: 'Snapinfra-projects'
});

// GOOD: Query with partition key
const userProjects = await dynamodb.query({
  TableName: 'Snapinfra-projects',
  IndexName: 'UserIdIndex',
  KeyConditionExpression: 'userId = :userId',
  ExpressionAttributeValues: {
    ':userId': userId
  }
});

// GOOD: Batch get items
const projects = await dynamodb.batchGet({
  RequestItems: {
    'Snapinfra-projects': {
      Keys: ids.map(id => ({ id, userId }))
    }
  }
});

// Projection expression (fetch only needed fields)
const projects = await dynamodb.query({
  TableName: 'Snapinfra-projects',
  ProjectionExpression: 'id, #name, createdAt',
  ExpressionAttributeNames: {
    '#name': 'name'
  }
});
```

**Caching with Redis:**

```typescript
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
});

async function getProject(id: string, userId: string) {
  // Try cache first
  const cached = await redis.get(`project:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch from database
  const project = await DynamoService.getProject(id, userId);

  // Cache for 1 hour
  await redis.setex(`project:${id}`, 3600, JSON.stringify(project));

  return project;
}

// Invalidate cache on update
async function updateProject(id: string, userId: string, data: any) {
  const project = await DynamoService.updateProject(id, userId, data);
  
  // Invalidate cache
  await redis.del(`project:${id}`);
  
  return project;
}
```

**Connection Pooling:**

```typescript
// Reuse AWS SDK clients
const dynamoClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
  maxAttempts: 3,
  requestHandler: {
    connectionTimeout: 3000,
    socketTimeout: 3000,
  },
});

// Don't create new client on every request
// BAD
app.get('/api/projects', async (req, res) => {
  const client = new DynamoDBClient({}); // Creates new connection
});

// GOOD
const sharedClient = new DynamoDBClient({});
app.get('/api/projects', async (req, res) => {
  // Reuses existing connection
});
```

**Response Compression:**

```typescript
import compression from 'compression';

app.use(compression({
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
}));
```

**Pagination:**

```typescript
async function listProjects(userId: string, limit: number = 20, lastKey?: any) {
  const params = {
    TableName: 'Snapinfra-projects',
    IndexName: 'UserIdIndex',
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
    Limit: limit,
    ...(lastKey && { ExclusiveStartKey: lastKey }),
  };

  const result = await dynamodb.query(params);

  return {
    items: result.Items,
    lastKey: result.LastEvaluatedKey,
    hasMore: !!result.LastEvaluatedKey,
  };
}

// Usage
const page1 = await listProjects('user123', 20);
const page2 = await listProjects('user123', 20, page1.lastKey);
```

### 17.3 Performance Monitoring

**Lighthouse Metrics:**

```powershell
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://app.snapinfra.com --output html --output-path ./report.html

# Key metrics to track:
# - FCP (First Contentful Paint): < 1.8s
# - LCP (Largest Contentful Paint): < 2.5s
# - TTI (Time to Interactive): < 3.8s
# - CLS (Cumulative Layout Shift): < 0.1
# - FID (First Input Delay): < 100ms
```

**Custom Performance Tracking:**

```typescript
// Frontend
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    // Send to analytics
    track('page_load_time', { duration: pageLoadTime });
  });
}

// Backend
import { performance } from 'perf_hooks';

app.use((req, res, next) => {
  const start = performance.now();
  
  res.on('finish', () => {
    const duration = performance.now() - start;
    
    // Log slow requests
    if (duration > 1000) {
      logger.warn('Slow request', {
        method: req.method,
        path: req.path,
        duration,
      });
    }
    
    // Record metric
    recordMetric('RequestDuration', duration, 'Milliseconds');
  });
  
  next();
});
```

### 17.4 Performance Checklist

**Frontend:**
- [ ] Images optimized (Next.js Image component)
- [ ] Code split (dynamic imports for heavy components)
- [ ] Fonts optimized (next/font)
- [ ] Bundle size analyzed (< 200KB initial)
- [ ] Critical CSS inlined
- [ ] Lazy loading implemented
- [ ] Service worker configured (PWA)

**Backend:**
- [ ] Database queries use indexes
- [ ] Caching implemented (Redis)
- [ ] Connection pooling enabled
- [ ] Response compression enabled
- [ ] Pagination implemented
- [ ] Rate limiting in place
- [ ] CDN for static assets

**Infrastructure:**
- [ ] Auto-scaling configured
- [ ] Load balancer health checks
- [ ] CloudFront CDN (if applicable)
- [ ] Database read replicas (if needed)
- [ ] Proper instance sizing

---

## 18. Scaling Considerations

### 18.1 Horizontal Scaling

**Auto-Scaling Groups (AWS):**

```typescript
// backend/aws/cdk/snapinfra-stack.ts
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const asg = new autoscaling.AutoScalingGroup(this, 'BackendASG', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.SMALL),
  machineImage: ec2.MachineImage.latestAmazonLinux2(),
  minCapacity: 2,
  maxCapacity: 10,
  desiredCapacity: 2,
});

// Scale based on CPU
asg.scaleOnCpuUtilization('CpuScaling', {
  targetUtilizationPercent: 70,
});

// Scale based on request count
asg.scaleOnRequestCount('RequestScaling', {
  targetRequestsPerMinute: 1000,
});
```

**ECS Fargate Auto-Scaling:**

```typescript
const scalableTarget = service.autoScaleTaskCount({
  minCapacity: 2,
  maxCapacity: 10,
});

scalableTarget.scaleOnCpuUtilization('CpuScaling', {
  targetUtilizationPercent: 70,
});

scalableTarget.scaleOnMetric('RequestScaling', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/ApplicationELB',
    metricName: 'RequestCountPerTarget',
  }),
  scalingSteps: [
    { upper: 1000, change: 0 },
    { lower: 1000, change: +1 },
    { lower: 5000, change: +2 },
  ],
});
```

### 18.2 Database Scaling

**DynamoDB On-Demand vs Provisioned:**

```typescript
// Development: On-Demand (pay per request)
const projectsTable = new dynamodb.Table(this, 'ProjectsTable', {
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
});

// Production: Provisioned with Auto-Scaling
const projectsTable = new dynamodb.Table(this, 'ProjectsTable', {
  billingMode: dynamodb.BillingMode.PROVISIONED,
  readCapacity: 5,
  writeCapacity: 5,
});

// Auto-scaling
const readScaling = projectsTable.autoScaleReadCapacity({
  minCapacity: 5,
  maxCapacity: 100,
});

readScaling.scaleOnUtilization({
  targetUtilizationPercent: 70,
});

const writeScaling = projectsTable.autoScaleWriteCapacity({
  minCapacity: 5,
  maxCapacity: 100,
});

writeScaling.scaleOnUtilization({
  targetUtilizationPercent: 70,
});
```

**Read Replicas (if using RDS):**

```typescript
const primaryDb = new rds.DatabaseInstance(this, 'PrimaryDB', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_15_3,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
  vpc,
});

// Read replica for scaling reads
const readReplica = new rds.DatabaseInstanceReadReplica(this, 'ReadReplica', {
  sourceDatabaseInstance: primaryDb,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM),
  vpc,
});
```

### 18.3 Caching Strategy

**Multi-Layer Caching:**

```
Browser Cache
    ↓
CDN Cache (CloudFront)
    ↓
Application Cache (Redis)
    ↓
Database
```

**Implementation:**

```typescript
// 1. Browser cache (HTTP headers)
res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');

// 2. CDN cache (CloudFront)
const distribution = new cloudfront.Distribution(this, 'CDN', {
  defaultBehavior: {
    origin: new origins.S3Origin(bucket),
    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
});

// 3. Application cache (Redis)
async function getCachedData(key: string, fetcher: () => Promise<any>, ttl: number = 3600) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const data = await fetcher();
  await redis.setex(key, ttl, JSON.stringify(data));
  
  return data;
}

// Usage
const projects = await getCachedData(
  `user:${userId}:projects`,
  () => DynamoService.getUserProjects(userId),
  3600 // 1 hour
);
```

### 18.4 Load Balancing

**Application Load Balancer:**

```typescript
const alb = new elbv2.ApplicationLoadBalancer(this, 'ALB', {
  vpc,
  internetFacing: true,
  http2Enabled: true,
});

const listener = alb.addListener('HttpsListener', {
  port: 443,
  certificates: [certificate],
  sslPolicy: elbv2.SslPolicy.RECOMMENDED,
});

listener.addTargets('BackendTarget', {
  port: 8080,
  targets: [service],
  protocol: elbv2.ApplicationProtocol.HTTP,
  healthCheck: {
    path: '/api/health',
    interval: cdk.Duration.seconds(30),
    timeout: cdk.Duration.seconds(5),
    healthyThresholdCount: 2,
    unhealthyThresholdCount: 3,
  },
  deregistrationDelay: cdk.Duration.seconds(30),
  stickinessCookieDuration: cdk.Duration.hours(1),
});
```

### 18.5 Async Processing

**SQS for Background Jobs:**

```typescript
// Producer: Enqueue job
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqsClient = new SQSClient({ region: 'us-east-1' });

async function enqueueCodeGeneration(projectId: string, schema: any) {
  await sqsClient.send(new SendMessageCommand({
    QueueUrl: process.env.SQS_CODE_GENERATION_QUEUE,
    MessageBody: JSON.stringify({
      projectId,
      schema,
      timestamp: Date.now(),
    }),
  }));
}

// Consumer: Process jobs (separate worker)
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';

async function processQueue() {
  while (true) {
    const messages = await sqsClient.send(new ReceiveMessageCommand({
      QueueUrl: process.env.SQS_CODE_GENERATION_QUEUE,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20, // Long polling
    }));

    for (const message of messages.Messages || []) {
      try {
        const { projectId, schema } = JSON.parse(message.Body);
        
        // Process job
        await generateCodeForProject(projectId, schema);
        
        // Delete message
        await sqsClient.send(new DeleteMessageCommand({
          QueueUrl: process.env.SQS_CODE_GENERATION_QUEUE,
          ReceiptHandle: message.ReceiptHandle,
        }));
      } catch (error) {
        console.error('Failed to process message:', error);
        // Message will be reprocessed after visibility timeout
      }
    }
  }
}
```

### 18.6 CDN Integration

**CloudFront Distribution:**

```typescript
const distribution = new cloudfront.Distribution(this, 'StaticAssetsCDN', {
  defaultBehavior: {
    origin: new origins.S3Origin(storageBucket),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    cachePolicy: new cloudfront.CachePolicy(this, 'CachePolicy', {
      defaultTtl: cdk.Duration.days(1),
      maxTtl: cdk.Duration.days(365),
      minTtl: cdk.Duration.seconds(0),
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Authorization'),
    }),
    responseHeadersPolicy: new cloudfront.ResponseHeadersPolicy(this, 'ResponseHeaders', {
      customHeadersBehavior: {
        customHeaders: [
          { header: 'Cache-Control', value: 'public, max-age=31536000, immutable', override: true },
        ],
      },
    }),
  },
  priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // US, Canada, Europe
});
```

### 18.7 Capacity Planning

**Estimating Requirements:**

```
Users per day: 10,000
Requests per user: 50
Total requests: 500,000/day = 5.8 req/sec average

Peak multiplier: 10x
Peak requests: 58 req/sec

Required capacity:
- Backend instances: 3-5 (at 20 req/sec each)
- DynamoDB RCU: 60 (assuming 4KB items)
- DynamoDB WCU: 20 (3:1 read:write ratio)
- Redis memory: 2GB (100MB per 10K users)
```

**Monitoring for Scale:**

```typescript
// CloudWatch alarms for scaling triggers
new cloudwatch.Alarm(this, 'HighCpuAlarm', {
  metric: asg.metricCpuUtilization(),
  threshold: 80,
  evaluationPeriods: 2,
  alarmDescription: 'Scale up when CPU > 80%',
});

new cloudwatch.Alarm(this, 'HighRequestCountAlarm', {
  metric: alb.metrics.requestCount(),
  threshold: 10000,
  evaluationPeriods: 1,
  comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
});
```

---

## 19. CI/CD Pipeline

### 19.1 GitHub Actions Workflow

**.github/workflows/ci.yml:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'

jobs:
  # Frontend Tests
  test-frontend:
    name: Test Frontend
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Type check
        run: pnpm tsc --noEmit
      
      - name: Lint
        run: pnpm lint
      
      - name: Build
        run: pnpm build
        env:
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY }}
          CLERK_SECRET_KEY: ${{ secrets.CLERK_SECRET_KEY }}

  # Backend Tests
  test-backend:
    name: Test Backend
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Type check
        run: |
          cd backend
          npm run tsc --noEmit
      
      - name: Lint
        run: |
          cd backend
          npm run lint
      
      - name: Build
        run: |
          cd backend
          npm run build

  # Security Scan
  security-scan:
    name: Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Run npm audit
        run: |
          pnpm audit --audit-level=moderate
          cd backend && npm audit --audit-level=moderate
        continue-on-error: true
      
      - name: Run Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

  # Deploy Infrastructure
  deploy-infrastructure:
    name: Deploy AWS Infrastructure
    needs: [test-frontend, test-backend]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Deploy CDK stack
        run: |
          cd backend
          npx cdk deploy --all --require-approval never
        env:
          AWS_REGION: us-east-1

  # Deploy Frontend (Vercel handles this automatically)
  # Backend deployment depends on your hosting choice
  
  # Notify on deployment
  notify:
    name: Send Notification
    needs: [deploy-infrastructure]
    if: always()
    runs-on: ubuntu-latest
    
    steps:
      - name: Send Slack notification
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Deployment ${{ job.status }}'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()
```

### 19.2 Deployment Environments

**Environment Strategy:**

```
Development (dev)
  ↓
Staging (staging)
  ↓
Production (prod)
```

**Branch to Environment Mapping:**

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches:
      - main        # → Production
      - develop     # → Staging
      - feature/*   # → Preview (Vercel)
```

**Environment Variables per Environment:**

```yaml
jobs:
  deploy-production:
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy
        env:
          AWS_REGION: us-east-1
          STAGE: prod
          CORS_ORIGIN: https://app.snapinfra.com
  
  deploy-staging:
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - name: Deploy
        env:
          AWS_REGION: us-east-1
          STAGE: staging
          CORS_ORIGIN: https://staging.snapinfra.com
```

### 19.3 Automated Testing

**Unit Tests (Jest):**

```typescript
// backend/src/services/__tests__/dynamoService.test.ts
import { DynamoService } from '../database/dynamoService';

describe('DynamoService', () => {
  describe('getUserProjects', () => {
    it('should return user projects', async () => {
      const projects = await DynamoService.getUserProjects('user123');
      expect(projects).toBeInstanceOf(Array);
    });
    
    it('should return empty array for new user', async () => {
      const projects = await DynamoService.getUserProjects('newuser');
      expect(projects).toHaveLength(0);
    });
  });
});
```

**Integration Tests:**

```typescript
// backend/src/__tests__/integration/projects.test.ts
import request from 'supertest';
import app from '../../server';

describe('Projects API', () => {
  let authToken: string;
  
  beforeAll(async () => {
    // Get auth token
    authToken = await getTestAuthToken();
  });
  
  describe('GET /api/projects', () => {
    it('should return 401 without auth', async () => {
      const response = await request(app)
        .get('/api/projects');
      
      expect(response.status).toBe(401);
    });
    
    it('should return projects with auth', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
    });
  });
});
```

**E2E Tests (Playwright):**

```typescript
// tests/e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto('/sign-in');
    await page.fill('[name="identifier"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/dashboard');
  });
  
  test('should display projects', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Dashboard');
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount(3);
  });
  
  test('should create new project', async ({ page }) => {
    await page.click('button:text("New Project")');
    await page.fill('[name="name"]', 'Test Project');
    await page.fill('[name="description"]', 'Test Description');
    await page.click('button:text("Create")');
    
    await expect(page.locator('[data-testid="project-card"]')).toHaveCount(4);
  });
});
```

### 19.4 Quality Gates

**Required Checks:**

```yaml
# .github/workflows/quality-gates.yml
jobs:
  quality-gate:
    name: Quality Gate
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      # 1. Code coverage > 80%
      - name: Check code coverage
        run: |
          pnpm test --coverage
          coverage=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$coverage < 80" | bc -l) )); then
            echo "Code coverage is below 80%"
            exit 1
          fi
      
      # 2. No high/critical vulnerabilities
      - name: Security audit
        run: pnpm audit --audit-level=high
      
      # 3. No TypeScript errors
      - name: Type check
        run: pnpm tsc --noEmit
      
      # 4. No lint errors
      - name: Lint
        run: pnpm lint --max-warnings 0
      
      # 5. Build succeeds
      - name: Build
        run: pnpm build
```

### 19.5 Rollback Strategy

**Automatic Rollback:**

```yaml
jobs:
  deploy:
    steps:
      - name: Deploy
        id: deploy
        run: ./deploy.sh
      
      - name: Health check
        id: health
        run: |
          sleep 30
          response=$(curl -f https://api.snapinfra.com/api/health || echo "failed")
          if [ "$response" == "failed" ]; then
            echo "Health check failed"
            exit 1
          fi
      
      - name: Rollback on failure
        if: failure()
        run: |
          echo "Deployment failed, rolling back..."
          ./rollback.sh
```

**Manual Rollback:**

```powershell
# Vercel
vercel rollback https://app-snapinfra-abc123.vercel.app

# AWS CDK
cd backend
git checkout <previous-commit>
npx cdk deploy

# Docker
docker pull snapinfra/backend:<previous-tag>
docker service update --image snapinfra/backend:<previous-tag> backend-service
```

### 19.6 Deployment Notifications

**Slack Integration:**

```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    text: |
      Deployment to production
      Status: ${{ job.status }}
      Commit: ${{ github.sha }}
      Author: ${{ github.actor }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
  if: always()
```

---

## 20. Disaster Recovery

### 20.1 Backup Strategy

**DynamoDB Backups:**

```typescript
// Enable Point-in-Time Recovery
const projectsTable = new dynamodb.Table(this, 'ProjectsTable', {
  tableName: 'Snapinfra-projects',
  pointInTimeRecovery: true, // Enables PITR
  removalPolicy: cdk.RemovalPolicy.RETAIN, // Don't delete on stack removal
});

// Automated daily backups
new backup.BackupPlan(this, 'BackupPlan', {
  backupPlanName: 'DailyBackups',
  backupPlanRules: [
    new backup.BackupPlanRule({
      ruleName: 'DailyBackup',
      scheduleExpression: events.Schedule.cron({ hour: '2', minute: '0' }),
      deleteAfter: cdk.Duration.days(30),
      startWindow: cdk.Duration.hours(1),
      completionWindow: cdk.Duration.hours(2),
    }),
  ],
});

projectsTable.addBackupSelection('Backup', {
  resources: [backup.BackupResource.fromDynamoDbTable(projectsTable)],
});
```

**Manual Backup:**

```powershell
# Create on-demand backup
aws dynamodb create-backup \
  --table-name Snapinfra-projects \
  --backup-name manual-backup-$(date +%Y%m%d-%H%M%S)

# List backups
aws dynamodb list-backups --table-name Snapinfra-projects

# Restore from backup
aws dynamodb restore-table-from-backup \
  --target-table-name Snapinfra-projects-restored \
  --backup-arn arn:aws:dynamodb:us-east-1:123456789012:table/Snapinfra-projects/backup/01234567890123-abcdefgh
```

**S3 Versioning:**

```typescript
// S3 bucket with versioning
const storageBucket = new s3.Bucket(this, 'StorageBucket', {
  bucketName: 'snapinfra-storage',
  versioned: true, // Keep all versions
  lifecycleRules: [
    {
      id: 'DeleteOldVersions',
      noncurrentVersionExpiration: cdk.Duration.days(90),
      expiredObjectDeleteMarker: true,
    },
  ],
});

// Cross-region replication (optional)
const replicaBucket = new s3.Bucket(this, 'ReplicaBucket', {
  bucketName: 'snapinfra-storage-replica',
  versioned: true,
});

storageBucket.addLifecycleRule({
  id: 'ReplicateToBackup',
  enabled: true,
  transitions: [
    {
      storageClass: s3.StorageClass.GLACIER,
      transitionAfter: cdk.Duration.days(30),
    },
  ],
});
```

### 20.2 Recovery Procedures

**Scenario 1: Accidental Table Delete**

```powershell
# 1. Restore from Point-in-Time Recovery
aws dynamodb restore-table-to-point-in-time \
  --source-table-name Snapinfra-projects \
  --target-table-name Snapinfra-projects-restored \
  --restore-date-time 2025-01-20T10:00:00Z

# 2. Verify restored data
aws dynamodb describe-table --table-name Snapinfra-projects-restored

# 3. Update application to use restored table
# Update backend/.env:
DYNAMODB_PROJECTS_TABLE=Snapinfra-projects-restored

# 4. Restart backend
eb restart

# 5. After verification, rename table
# (requires downtime or blue-green deployment)
```

**Scenario 2: Data Corruption**

```powershell
# 1. Identify corruption timeframe
# Check CloudWatch logs, user reports

# 2. Restore to point before corruption
aws dynamodb restore-table-to-point-in-time \
  --source-table-name Snapinfra-projects \
  --target-table-name Snapinfra-projects-clean \
  --restore-date-time 2025-01-20T09:00:00Z  # Before corruption

# 3. Export corrupted data for analysis
aws dynamodb export-table-to-point-in-time \
  --table-arn arn:aws:dynamodb:us-east-1:123456789012:table/Snapinfra-projects \
  --s3-bucket snapinfra-analysis \
  --export-time 2025-01-20T10:30:00Z

# 4. Migrate clean data back
# Use data pipeline or custom script
```

**Scenario 3: Complete AWS Region Failure**

```
1. DNS failover to backup region
2. Activate standby infrastructure
3. Restore from cross-region backups
4. Update CORS origins if needed
5. Verify all services operational
6. Communicate to users
```

### 20.3 Business Continuity Plan

**RTO & RPO Targets:**

| Service | RTO | RPO | Strategy |
|---------|-----|-----|----------|
| Frontend | 5 minutes | 0 | Vercel auto-failover |
| Backend API | 15 minutes | 5 minutes | Multi-AZ deployment |
| Database | 30 minutes | 5 minutes | PITR + Daily backups |
| File Storage | 1 hour | 1 hour | S3 versioning |

**Recovery Priority:**

1. **Critical** (RTO < 1 hour):
   - Authentication (Clerk)
   - Core API endpoints
   - Database access

2. **High** (RTO < 4 hours):
   - AI generation
   - Deployment functionality
   - File uploads

3. **Medium** (RTO < 24 hours):
   - Analytics
   - Email notifications
   - Historical reports

### 20.4 Disaster Recovery Testing

**Quarterly DR Drill:**

```markdown
# DR Drill Checklist

Date: Q1 2025
Scenario: Database corruption requiring restore

[ ] 1. Create test corruption in dev environment
[ ] 2. Restore from backup (measure time)
[ ] 3. Verify data integrity
[ ] 4. Test all critical APIs
[ ] 5. Document lessons learned
[ ] 6. Update DR procedures

Results:
- Time to restore: 12 minutes
- Data loss: 3 minutes (within RPO)
- Issues found: [List any]
- Action items: [List improvements]
```

### 20.5 Data Export

**Full Export for Compliance:**

```powershell
# Export all DynamoDB tables
for table in Snapinfra-projects Snapinfra-users Snapinfra-schemas Snapinfra-deployments; do
  aws dynamodb export-table-to-point-in-time \
    --table-arn arn:aws:dynamodb:us-east-1:123456789012:table/$table \
    --s3-bucket snapinfra-exports \
    --s3-prefix exports/$(date +%Y-%m-%d)/ \
    --export-format DYNAMODB_JSON
done

# Export S3 files
aws s3 sync s3://snapinfra-storage s3://snapinfra-exports/s3-backup/$(date +%Y-%m-%d)/

# Create archive
aws s3 cp s3://snapinfra-exports/ ./exports/ --recursive
tar -czf snapinfra-backup-$(date +%Y-%m-%d).tar.gz exports/
```

---

## 21. AWS Infrastructure

### 21.1 Complete CDK Stack

**backend/aws/cdk/snapinfra-stack.ts:**

```typescript
import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export interface SnapinfraStackProps extends cdk.StackProps {
  stage?: string;
}

export class SnapinfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: SnapinfraStackProps) {
    super(scope, id, props);

    const stage = props?.stage || 'dev';

    // ========== DynamoDB Tables ==========
    
    // Projects Table
    const projectsTable = new dynamodb.Table(this, 'ProjectsTable', {
      tableName: `Snapinfra-projects-${stage}`,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: stage === 'prod' 
        ? dynamodb.BillingMode.PROVISIONED 
        : dynamodb.BillingMode.PAY_PER_REQUEST,
      readCapacity: stage === 'prod' ? 5 : undefined,
      writeCapacity: stage === 'prod' ? 5 : undefined,
      pointInTimeRecovery: stage === 'prod',
      removalPolicy: stage === 'prod' 
        ? cdk.RemovalPolicy.RETAIN 
        : cdk.RemovalPolicy.DESTROY,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    // GSI for querying by userId
    projectsTable.addGlobalSecondaryIndex({
      indexName: 'UserIdIndex',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
      readCapacity: stage === 'prod' ? 5 : undefined,
      writeCapacity: stage === 'prod' ? 5 : undefined,
    });

    // Auto-scaling for production
    if (stage === 'prod') {
      const readScaling = projectsTable.autoScaleReadCapacity({
        minCapacity: 5,
        maxCapacity: 100,
      });
      readScaling.scaleOnUtilization({ targetUtilizationPercent: 70 });

      const writeScaling = projectsTable.autoScaleWriteCapacity({
        minCapacity: 5,
        maxCapacity: 100,
      });
      writeScaling.scaleOnUtilization({ targetUtilizationPercent: 70 });
    }

    // Users Table
    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: `Snapinfra-users-${stage}`,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      pointInTimeRecovery: stage === 'prod',
      removalPolicy: stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    // Schemas Table
    const schemasTable = new dynamodb.Table(this, 'SchemasTable', {
      tableName: `Snapinfra-schemas-${stage}`,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    schemasTable.addGlobalSecondaryIndex({
      indexName: 'ProjectIdIndex',
      partitionKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // Deployments Table
    const deploymentsTable = new dynamodb.Table(this, 'DeploymentsTable', {
      tableName: `Snapinfra-deployments-${stage}`,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    deploymentsTable.addGlobalSecondaryIndex({
      indexName: 'ProjectIdIndex',
      partitionKey: { name: 'projectId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'createdAt', type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // ========== S3 Bucket ==========
    
    const storageBucket = new s3.Bucket(this, 'StorageBucket', {
      bucketName: `snapinfra-storage-${stage}-${this.account}-${this.region}`,
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
            s3.HttpMethods.DELETE,
          ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
      lifecycleRules: [
        {
          id: 'DeleteOldVersions',
          noncurrentVersionExpiration: cdk.Duration.days(90),
          expiredObjectDeleteMarker: true,
        },
      ],
      removalPolicy: stage === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: stage !== 'prod',
    });

    // ========== SQS Queues ==========
    
    // Dead Letter Queue for code generation
    const codeGenerationDLQ = new sqs.Queue(this, 'CodeGenerationDLQ', {
      queueName: `Snapinfra-code-generation-dlq-${stage}`,
      retentionPeriod: cdk.Duration.days(14),
    });

    // Code Generation Queue
    const codeGenerationQueue = new sqs.Queue(this, 'CodeGenerationQueue', {
      queueName: `Snapinfra-code-generation-${stage}`,
      visibilityTimeout: cdk.Duration.minutes(15),
      retentionPeriod: cdk.Duration.days(14),
      deadLetterQueue: {
        queue: codeGenerationDLQ,
        maxReceiveCount: 3,
      },
    });

    // Dead Letter Queue for deployments
    const deploymentDLQ = new sqs.Queue(this, 'DeploymentDLQ', {
      queueName: `Snapinfra-deployments-dlq-${stage}`,
      retentionPeriod: cdk.Duration.days(14),
    });

    // Deployment Queue
    const deploymentQueue = new sqs.Queue(this, 'DeploymentQueue', {
      queueName: `Snapinfra-deployments-${stage}`,
      visibilityTimeout: cdk.Duration.minutes(30),
      retentionPeriod: cdk.Duration.days(14),
      deadLetterQueue: {
        queue: deploymentDLQ,
        maxReceiveCount: 3,
      },
    });

    // ========== SNS Topics ==========
    
    const deploymentNotifications = new sns.Topic(this, 'DeploymentNotifications', {
      topicName: `Snapinfra-deployment-notifications-${stage}`,
      displayName: 'Snapinfra Deployment Notifications',
    });

    // ========== IAM Role for Backend ==========
    
    const backendRole = new iam.Role(this, 'BackendRole', {
      roleName: `Snapinfra-backend-role-${stage}`,
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      description: 'IAM role for Snapinfra backend service',
    });

    // Grant permissions
    projectsTable.grantReadWriteData(backendRole);
    usersTable.grantReadWriteData(backendRole);
    schemasTable.grantReadWriteData(backendRole);
    deploymentsTable.grantReadWriteData(backendRole);
    storageBucket.grantReadWrite(backendRole);
    codeGenerationQueue.grantSendMessages(backendRole);
    codeGenerationQueue.grantConsumeMessages(backendRole);
    deploymentQueue.grantSendMessages(backendRole);
    deploymentQueue.grantConsumeMessages(backendRole);
    deploymentNotifications.grantPublish(backendRole);

    // ========== Outputs ==========
    
    new cdk.CfnOutput(this, 'ProjectsTableName', {
      value: projectsTable.tableName,
      description: 'Projects table name',
    });

    new cdk.CfnOutput(this, 'UsersTableName', {
      value: usersTable.tableName,
      description: 'Users table name',
    });

    new cdk.CfnOutput(this, 'SchemasTableName', {
      value: schemasTable.tableName,
      description: 'Schemas table name',
    });

    new cdk.CfnOutput(this, 'DeploymentsTableName', {
      value: deploymentsTable.tableName,
      description: 'Deployments table name',
    });

    new cdk.CfnOutput(this, 'StorageBucketName', {
      value: storageBucket.bucketName,
      description: 'S3 storage bucket name',
    });

    new cdk.CfnOutput(this, 'CodeGenerationQueueUrl', {
      value: codeGenerationQueue.queueUrl,
      description: 'Code generation queue URL',
    });

    new cdk.CfnOutput(this, 'DeploymentQueueUrl', {
      value: deploymentQueue.queueUrl,
      description: 'Deployment queue URL',
    });

    new cdk.CfnOutput(this, 'DeploymentNotificationsTopicArn', {
      value: deploymentNotifications.topicArn,
      description: 'Deployment notifications SNS topic ARN',
    });

    new cdk.CfnOutput(this, 'BackendRoleArn', {
      value: backendRole.roleArn,
      description: 'Backend IAM role ARN',
    });
  }
}
```

### 21.2 Infrastructure Commands

```powershell
# Bootstrap CDK (first time only)
cd backend
npx cdk bootstrap

# List stacks
npx cdk ls

# Synthesize CloudFormation template
npx cdk synth

# Show differences from deployed stack
npx cdk diff

# Deploy all stacks
npx cdk deploy --all

# Deploy specific stack
npx cdk deploy SnapinfraStackDev

# Destroy stack (careful!)
npx cdk destroy SnapinfraStackDev

# View stack outputs
aws cloudformation describe-stacks \
  --stack-name SnapinfraStackDev \
  --query 'Stacks[0].Outputs'
```

### 21.3 Cost Estimation

**Monthly AWS Costs (Development):**

```
DynamoDB (Pay-per-request): $5-10
S3 Storage (10GB): $0.23
SQS (100K requests): $0.40
SNS (10K notifications): $0.50
Data Transfer: $1-5

Total: ~$10-20/month
```

**Monthly AWS Costs (Production - 10K users):**

```
DynamoDB (Provisioned):
  - 4 tables × 5 RCU/WCU = $23/month
  - Auto-scaling buffer: $10/month

S3 Storage (100GB): $2.30
S3 Requests (1M): $0.40
SQS (1M requests): $0.40
SNS (100K notifications): $0.50
CloudWatch Logs (10GB): $5.00
Data Transfer (50GB): $4.50

Total: ~$50-100/month
```

### 21.4 Resource Tagging

```typescript
// Add tags to all resources
cdk.Tags.of(this).add('Project', 'Snapinfra');
cdk.Tags.of(this).add('Environment', stage);
cdk.Tags.of(this).add('ManagedBy', 'CDK');
cdk.Tags.of(this).add('CostCenter', 'Engineering');

// Query costs by tag
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity MONTHLY \
  --metrics UnblendedCost \
  --filter file://filter.json

# filter.json:
{
  "Tags": {
    "Key": "Project",
    "Values": ["Snapinfra"]
  }
}
```

---

## 22. Common Recipes

### 22.1 Add New API Endpoint

**1. Define route (backend/src/routes/myRoute.ts):**
```typescript
import { Router } from 'express';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, async (req, res, next) => {
  try {
    // Your logic here
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
});

export default router;
```

**2. Register route (backend/src/server.ts):**
```typescript
import myRoutes from './routes/myRoute';
app.use('/api/my-endpoint', myRoutes);
```

**3. Add frontend client method (lib/api-client.ts):**
```typescript
async getMyData() {
  return this.request('/api/my-endpoint');
}
```

**4. Use in component:**
```typescript
const data = await apiClient.getMyData();
```

### 22.2 Add New Page

**1. Create page file (app/my-page/page.tsx):**
```typescript
export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
    </div>
  );
}
```

**2. Add navigation link:**
```typescript
<Link href="/my-page">My Page</Link>
```

**3. Protect route (if needed) in middleware.ts:**
```typescript
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/my-page(.*)',  // Add here
]);
```

### 22.3 Add Environment Variable

**1. Add to .env files:**
```env
# .env.local (frontend)
NEXT_PUBLIC_MY_VAR=value

# backend/.env
MY_SECRET=secret-value
```

**2. Add to .env.example:**
```env
NEXT_PUBLIC_MY_VAR=your_value_here
MY_SECRET=your_secret_here
```

**3. Use in code:**
```typescript
// Frontend
const myVar = process.env.NEXT_PUBLIC_MY_VAR;

// Backend
const mySecret = process.env.MY_SECRET;
```

**4. Add to Vercel/hosting:**
- Vercel: Project Settings → Environment Variables
- AWS: Add to secrets manager or environment configuration

### 22.4 Add DynamoDB Table

**1. Define in CDK (backend/aws/cdk/snapinfra-stack.ts):**
```typescript
const myTable = new dynamodb.Table(this, 'MyTable', {
  tableName: `Snapinfra-mytable-${stage}`,
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
});

// Add GSI if needed
myTable.addGlobalSecondaryIndex({
  indexName: 'MyIndex',
  partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
  projectionType: dynamodb.ProjectionType.ALL,
});

// Grant permissions
myTable.grantReadWriteData(backendRole);

// Output
new cdk.CfnOutput(this, 'MyTableName', {
  value: myTable.tableName,
});
```

**2. Deploy:**
```powershell
cd backend
npx cdk deploy
```

**3. Add to environment:**
```env
DYNAMODB_MY_TABLE=Snapinfra-mytable-dev