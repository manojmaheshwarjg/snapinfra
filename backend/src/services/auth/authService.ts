import { DynamoDBService } from '@/services/database/dynamoDBService';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  username: string;
  createdAt: string;
  updatedAt: string;
  onboardingCompleted?: boolean;
  onboardingStep?: number;
  profile?: {
    name?: string;
    company?: string;
    role?: string;
  };
}

export interface Session {
  token: string;
  userId: string;
  email: string;
  createdAt: string;
  expiresAt: number;
}

export class AuthService {
  private dbService: DynamoDBService;

  constructor() {
    this.dbService = new DynamoDBService();
  }

  private generateToken(): string {
    return `tok_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
  }

  private generateUserId(): string {
    return `user_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  private generateSessionId(): string {
    return `sess_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
  }

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async registerUser(email: string, password: string, username?: string): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = await this.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const userId = this.generateUserId();
    const passwordHash = await this.hashPassword(password);
    const now = new Date().toISOString();

    const user: User = {
      id: userId,
      email,
      passwordHash,
      username: username || email.split('@')[0],
      createdAt: now,
      updatedAt: now,
      onboardingCompleted: false,
      onboardingStep: 0
    };

    // Save user to DynamoDB
    await this.dbService.put('Users', user);

    // Create session
    const token = await this.createSession(userId, email);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }

  async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.getUserByEmail(email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await this.verifyPassword(password, user.passwordHash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Create new session
    const token = await this.createSession(user.id, user.email);

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword as User, token };
  }

  async createSession(userId: string, email: string): Promise<string> {
    const token = this.generateToken();
    const sessionId = this.generateSessionId();
    const now = new Date().toISOString();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const session: Session & { id: string } = {
      id: sessionId,
      token,
      userId,
      email,
      createdAt: now,
      expiresAt
    };

    // Save session to DynamoDB using userId as partition key for queries
    await this.dbService.put('Users', {
      id: `session_${token}`,
      userId,
      email,
      token,
      type: 'session',
      createdAt: now,
      expiresAt
    });

    return token;
  }

  async getSession(token: string): Promise<Session | null> {
    try {
      const session = await this.dbService.get('Users', { id: `session_${token}` });
      
      if (!session || session.type !== 'session') {
        return null;
      }

      // Check if session is expired
      if (session.expiresAt < Date.now()) {
        await this.deleteSession(token);
        return null;
      }

      return {
        token: session.token,
        userId: session.userId,
        email: session.email,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt
      };
    } catch (error) {
      return null;
    }
  }

  async deleteSession(token: string): Promise<void> {
    try {
      await this.dbService.delete('Users', { id: `session_${token}` });
    } catch (error) {
      // Ignore errors when deleting sessions
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      // Query users by email using GSI (Global Secondary Index)
      // For now, we'll use scan with filter (not ideal for production)
      const result = await this.dbService.scan({
        TableName: 'snapinfra-users',
        FilterExpression: 'email = :email AND attribute_not_exists(#type)',
        ExpressionAttributeValues: {
          ':email': email
        },
        ExpressionAttributeNames: {
          '#type': 'type'
        }
      });

      if (result.Items && result.Items.length > 0) {
        return result.Items[0] as User;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await this.dbService.get('Users', { id: userId });
      
      if (!user || user.type === 'session') {
        return null;
      }

      return user as User;
    } catch (error) {
      return null;
    }
  }

  async updateOnboardingProgress(userId: string, step: number, completed: boolean, profileData?: any): Promise<User> {
    const updates: any = {
      onboardingStep: step,
      onboardingCompleted: completed,
      updatedAt: new Date().toISOString()
    };

    if (profileData) {
      updates.profile = profileData;
    }

    const updatedUser = await this.dbService.update('Users', { id: userId }, updates);
    
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword as User;
  }
}
