import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import * as settingsController from '@/controllers/settingsController';

const router = Router();

router.use(authenticateUser);

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);
router.put('/theme', settingsController.updateTheme);
router.put('/notifications', settingsController.updateNotifications);
router.put('/integrations', settingsController.updateIntegrations);
router.delete('/', settingsController.resetSettings);
router.post('/profile-picture', settingsController.uploadProfilePicture);
router.get('/profile-picture/url', settingsController.getProfilePictureUrl);
router.delete('/profile-picture', settingsController.deleteProfilePicture);

export default router;
