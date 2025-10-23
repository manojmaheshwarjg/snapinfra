import { Request, Response, NextFunction } from 'express';
import { clerkClient, verifyToken } from '@clerk/clerk-sdk-node';
import { DynamoService } from '@/services/database/dynamoService';
import { User, AuthenticatedRequest } from '@/types';
import { createError } from './errorHandler';

interface ClerkPayload {
  sub: string; // Clerk user ID
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

// Clerk Authentication Middleware
export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('🔐 Authenticating request:', req.method, req.path);
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      console.log('❌ No token provided');
      throw createError('Access token required', 401);
    }

    console.log('🔑 Token received, verifying with Clerk...');
    // Verify Clerk token
    let clerkUserId: string;
    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!
      });
      clerkUserId = payload.sub;
      console.log('✅ Clerk JWT verified, user ID:', clerkUserId);
    } catch (error) {
      console.log('❌ Clerk JWT verification failed:', error);
      throw createError('Invalid or expired token', 401);
    }

    // Get Clerk user details
    console.log('📥 Fetching user details from Clerk...');
    const clerkUser = await clerkClient.users.getUser(clerkUserId);
    console.log('✅ User details fetched:', clerkUser.emailAddresses[0]?.emailAddress);

    // Get or create user in our database
    console.log('🔍 Checking if user exists in DynamoDB...');
    let user = await DynamoService.getUserById(clerkUserId);

    // If user doesn't exist, create from Clerk data
    if (!user) {
      console.log('🆕 User not found, creating in DynamoDB...');
      user = await DynamoService.createUser({
        id: clerkUserId,
        email: clerkUser.emailAddresses[0]?.emailAddress || 'unknown@example.com',
        username: clerkUser.username || clerkUser.firstName || 'user',
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined
      });
      console.log('✅ User created in DynamoDB:', user.id);
    } else {
      console.log('✅ User found in DynamoDB:', user.id);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.log('❌ Authentication error:', error);
    next(error);
  }
};

// Optional authentication middleware (doesn't fail if no token)
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const payload = await verifyToken(token, {
          secretKey: process.env.CLERK_SECRET_KEY!
        });
        const clerkUserId = payload.sub;
        const clerkUser = await clerkClient.users.getUser(clerkUserId);
        
        let user = await DynamoService.getUserById(clerkUserId);
        if (!user) {
          user = await DynamoService.createUser({
            id: clerkUserId,
            email: clerkUser.emailAddresses[0]?.emailAddress || 'unknown@example.com',
            username: clerkUser.username || clerkUser.firstName || 'user',
            firstName: clerkUser.firstName || undefined,
            lastName: clerkUser.lastName || undefined
          });
        }

        req.user = user;
      } catch (error) {
        // Invalid token, but we don't fail - just continue without user
        console.warn('Optional auth failed:', error);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

// Development-only middleware for testing
export const devAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // Only use in development
  if (process.env.NODE_ENV !== 'development') {
    throw createError('Development auth not allowed in production', 403);
  }

  // Read user ID from header (for frontend integration) or use default
  const userId = (req.headers['x-dev-user-id'] as string) || 'dev-user-123';

  // Create a mock user for development
  req.user = {
    id: userId,
    email: 'dev@example.com',
    username: 'developer',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  next();
};


// Helper function to get current user ID (works with different auth methods)
export const getCurrentUserId = (req: AuthenticatedRequest): string => {
  // If we have an authenticated user, use their ID
  if (req.user) {
    return req.user.id;
  }

  // Development fallback - check header first
  if (process.env.NODE_ENV === 'development') {
    const headerUserId = req.headers['x-dev-user-id'] as string;
    return headerUserId || 'dev-user-123';
  }

  throw createError('User not authenticated', 401);
};

// Middleware to require authentication
export const requireAuth = authenticateToken;
export const authenticateUser = devAuth; // Alias for development

// Middleware for admin-only routes (if needed later)
export const requireAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      throw createError('Authentication required', 401);
    }

    // Check if user has admin role (you'd implement this logic)
    // For now, we'll just allow all authenticated users
    next();
  } catch (error) {
    next(error);
  }
};