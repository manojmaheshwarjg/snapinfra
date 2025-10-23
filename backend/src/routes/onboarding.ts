import { Router, Request, Response } from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { AuthService } from '@/services/auth/authService';

const router = Router();
const authService = new AuthService();

// Middleware to verify user is authenticated
const requireAuth = asyncHandler(async (req: Request, res: Response, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  const session = await authService.getSession(token);

  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }

  // Attach user info to request
  (req as any).userId = session.userId;
  (req as any).userEmail = session.email;
  next();
});

// Get current onboarding status
router.get('/status', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  
  const user = await authService.getUserById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: {
      onboardingCompleted: user.onboardingCompleted || false,
      onboardingStep: user.onboardingStep || 0,
      profile: user.profile || {}
    }
  });
}));

// Update onboarding step
router.post('/step', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { step, data } = req.body;

  if (typeof step !== 'number' || step < 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid step number'
    });
  }

  const user = await authService.getUserById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Determine if onboarding is completed (e.g., after step 3)
  const totalSteps = 3;
  const completed = step >= totalSteps;

  // Merge profile data if provided
  let profileData = user.profile || {};
  if (data) {
    profileData = { ...profileData, ...data };
  }

  const updatedUser = await authService.updateOnboardingProgress(
    userId,
    step,
    completed,
    profileData
  );

  res.status(200).json({
    success: true,
    data: {
      onboardingCompleted: updatedUser.onboardingCompleted,
      onboardingStep: updatedUser.onboardingStep,
      profile: updatedUser.profile,
      message: completed ? 'Onboarding completed' : 'Onboarding progress saved'
    }
  });
}));

// Complete onboarding
router.post('/complete', requireAuth, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).userId;
  const { data } = req.body;

  const user = await authService.getUserById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found'
    });
  }

  // Merge final profile data
  let profileData = user.profile || {};
  if (data) {
    profileData = { ...profileData, ...data };
  }

  const updatedUser = await authService.updateOnboardingProgress(
    userId,
    3, // Final step
    true, // Completed
    profileData
  );

  res.status(200).json({
    success: true,
    data: {
      onboardingCompleted: true,
      profile: updatedUser.profile,
      message: 'Onboarding completed successfully'
    }
  });
}));

export default router;
