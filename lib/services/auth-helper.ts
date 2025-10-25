import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { DynamoService } from './database/dynamoService';
import type { User } from '@/lib/types/system-decisions';

export class AuthError extends Error {
  constructor(message: string, public statusCode: number = 401) {
    super(message);
    this.name = 'AuthError';
  }
}

export async function getCurrentUser(request: NextRequest): Promise<User> {
  const authMode = process.env.NEXT_PUBLIC_AUTH_MODE || 'development';

  if (authMode === 'production') {
    // Production: Use Clerk authentication
    const { userId } = await auth();
    
    if (!userId) {
      throw new AuthError('Authentication required', 401);
    }

    // Get or create user in DynamoDB
    let user = await DynamoService.getUserById(userId);
    
    if (!user) {
      // Create user from Clerk data
      user = await DynamoService.createUser({
        id: userId,
        email: 'user@example.com', // You'd get this from Clerk
        username: userId
      });
    }

    return user;
  } else {
    // Development: Use dev user ID from header
    const devUserId = request.headers.get('x-dev-user-id') || 'dev-user-123';
    
    let user = await DynamoService.getUserById(devUserId);
    
    if (!user) {
      user = await DynamoService.createUser({
        id: devUserId,
        email: 'dev@example.com',
        username: 'developer'
      });
    }

    return user;
  }
}

export function getDevUserId(request: NextRequest): string {
  return request.headers.get('x-dev-user-id') || 'dev-user-123';
}
