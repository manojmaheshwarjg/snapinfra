import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import * as activityController from '@/controllers/activityController';

const router = Router();

router.use(authenticateUser);

router.get('/', activityController.getAllActivities);
router.get('/project/:projectId', activityController.getProjectActivities);
router.get('/user', activityController.getUserActivities);
router.post('/', activityController.logActivity);
router.delete('/:id', activityController.deleteActivity);

export default router;
