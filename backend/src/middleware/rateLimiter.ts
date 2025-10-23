import { Request, Response, NextFunction } from 'express';
import { DynamoDBService } from '@/services/database/dynamoDBService';

const dynamoDB = new DynamoDBService();
const WINDOW_SIZE_IN_MS = parseInt(process.env.RATE_LIMIT_WINDOW || '900000'); // 15 minutes
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX || '100');

export const rateLimiter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Get client IP
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  const windowStart = Math.floor(now / WINDOW_SIZE_IN_MS);
  const windowKey = `rate-limit-${clientIP}-${windowStart}`;
  const resetTime = (windowStart + 1) * WINDOW_SIZE_IN_MS;
  
  try {
    // Get current count from DynamoDB
    // Analytics table uses 'timestamp' as sort key
    const timestampStr = windowStart.toString();
    const existing = await dynamoDB.get('Analytics', { 
      id: windowKey,
      timestamp: timestampStr
    });
    
    const currentCount = existing ? (existing.count || 0) : 0;
    const newCount = currentCount + 1;
    
    // Update count with TTL (auto-cleanup after window + 1 hour buffer)
    const ttl = Math.floor(resetTime / 1000) + 3600;
    await dynamoDB.put('Analytics', {
      id: windowKey,
      timestamp: timestampStr,
      type: 'rate-limit',
      clientIP,
      count: newCount,
      windowStart,
      resetTime,
      ttl,
      lastRequestAt: now
    });
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS.toString());
    res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS - newCount).toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(resetTime / 1000).toString());
    
    // Check if rate limit exceeded
    if (newCount > MAX_REQUESTS) {
      res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again after ${Math.ceil((resetTime - now) / 1000)} seconds.`,
        retryAfter: Math.ceil((resetTime - now) / 1000)
      });
      return;
    }
    
    next();
  } catch (error) {
    // Fail open - allow request if rate limiting fails
    // This ensures the API remains available even if DynamoDB has issues
    console.error('Rate limiting error:', error);
    console.warn('Rate limiter failed, allowing request through');
    next();
  }
};
