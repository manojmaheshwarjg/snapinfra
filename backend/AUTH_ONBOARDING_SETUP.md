# AWS DynamoDB Authentication and Onboarding Setup

## Overview
This document describes the AWS DynamoDB integration for user authentication and onboarding flow, where all user data is persisted to AWS at each step.

## Architecture

### Components Created

1. **AuthService** (`src/services/auth/authService.ts`)
   - Handles user registration, login, and session management
   - Stores all data in AWS DynamoDB
   - Uses bcrypt for password hashing
   - Manages JWT-like token-based sessions

2. **Auth Routes** (`src/routes/auth.ts` - updated)
   - POST `/api/auth/register` - Register new user
   - POST `/api/auth/login` - Login user
   - POST `/api/auth/logout` - Logout user
   - GET `/api/auth/verify` - Verify token

3. **Onboarding Routes** (`src/routes/onboarding.ts` - new)
   - GET `/api/onboarding/status` - Get current onboarding progress
   - POST `/api/onboarding/step` - Update onboarding step
   - POST `/api/onboarding/complete` - Complete onboarding

## Data Flow

### User Registration
1. User submits email, password, and optional username
2. Password is hashed using bcrypt (10 salt rounds)
3. User record is created in DynamoDB with:
   - Unique user ID
   - Email and username
   - Password hash
   - onboardingCompleted: false
   - onboardingStep: 0
4. Session is created and stored in DynamoDB
5. Token is returned to client

### Onboarding Progress
1. Client sends onboarding step number and data
2. AuthService updates user record in DynamoDB with:
   - Current step number
   - Profile data (name, company, role, etc.)
   - Completion status
3. All data is persisted immediately to AWS
4. Progress can be retrieved at any time

### DynamoDB Schema

#### User Records
```json
{
  "id": "user_1234567890_abc123",
  "email": "user@example.com",
  "passwordHash": "$2b$10$...",
  "username": "user",
  "createdAt": "2025-10-23T01:52:24.000Z",
  "updatedAt": "2025-10-23T01:52:24.000Z",
  "onboardingCompleted": false,
  "onboardingStep": 1,
  "profile": {
    "name": "John Doe",
    "company": "Acme Inc",
    "role": "Developer"
  }
}
```

#### Session Records
```json
{
  "id": "session_tok_1234567890_abc123",
  "type": "session",
  "userId": "user_1234567890_abc123",
  "email": "user@example.com",
  "token": "tok_1234567890_abc123",
  "createdAt": "2025-10-23T01:52:24.000Z",
  "expiresAt": 1729736544000
}
```

## API Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "username": "user123"
}

Response:
{
  "success": true,
  "data": {
    "id": "user_1234567890_abc123",
    "email": "user@example.com",
    "username": "user123",
    "onboardingCompleted": false,
    "onboardingStep": 0,
    "token": "tok_1234567890_abc123",
    "message": "User registered successfully"
  }
}
```

### Update Onboarding Step
```bash
POST /api/onboarding/step
Authorization: Bearer tok_1234567890_abc123
Content-Type: application/json

{
  "step": 1,
  "data": {
    "name": "John Doe",
    "company": "Acme Inc"
  }
}

Response:
{
  "success": true,
  "data": {
    "onboardingCompleted": false,
    "onboardingStep": 1,
    "profile": {
      "name": "John Doe",
      "company": "Acme Inc"
    },
    "message": "Onboarding progress saved"
  }
}
```

### Complete Onboarding
```bash
POST /api/onboarding/complete
Authorization: Bearer tok_1234567890_abc123
Content-Type: application/json

{
  "data": {
    "role": "Developer"
  }
}

Response:
{
  "success": true,
  "data": {
    "onboardingCompleted": true,
    "profile": {
      "name": "John Doe",
      "company": "Acme Inc",
      "role": "Developer"
    },
    "message": "Onboarding completed successfully"
  }
}
```

## Security Features

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **Token-based Sessions**: Secure random tokens with expiration (24 hours)
3. **Authentication Middleware**: Protects onboarding routes
4. **Password Never Returned**: Password hash is filtered from all API responses

## Dependencies Added

- `bcrypt@^6.0.0` - Password hashing
- `@types/bcrypt@^6.0.0` - TypeScript types

## DynamoDB Table

All data is stored in the `snapinfra-users` table (configurable via `DYNAMODB_USERS_TABLE` environment variable).

The table uses a single-table design with:
- Partition key: `id`
- Items: User records and session records (differentiated by presence of `type: "session"` attribute)

## Future Improvements

1. Add email-based GSI for faster user lookups by email
2. Implement session cleanup for expired sessions
3. Add refresh token mechanism
4. Implement password reset flow
5. Add rate limiting on authentication endpoints
6. Add multi-factor authentication support
