import { Router, Request, Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthService } from '@/services/auth/authService';

const router = Router();
const authService = new AuthService();

// Register new user
router.post('/register', asyncHandler(async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  try {
    const { user, token } = await authService.registerUser(email, password, username);

    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep,
        token,
        message: 'User registered successfully'
      }
    });
  } catch (error: any) {
    if (error.message === 'User with this email already exists') {
      return res.status(409).json({
        success: false,
        error: error.message
      });
    }
    throw error;
  }
}));

// Login user
router.post('/login', asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  try {
    const { user, token } = await authService.loginUser(email, password);

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        onboardingCompleted: user.onboardingCompleted,
        onboardingStep: user.onboardingStep,
        profile: user.profile,
        token,
        message: 'Login successful'
      }
    });
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({
        success: false,
        error: error.message
      });
    }
    throw error;
  }
}));

// Logout user
router.post('/logout', asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (token) {
    await authService.deleteSession(token);
  }

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
}));

// Verify token (for testing)
router.get('/verify', asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }

  const session = await authService.getSession(token);

  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      userId: session.userId,
      email: session.email
    }
  });
}));

export default router;
