import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import * as dashboardController from '@/controllers/dashboardController';

const router = Router();

router.use(authenticateUser);

router.get('/overview', dashboardController.getOverview);
router.get('/stats', dashboardController.getStats);
router.get('/recent-activity', dashboardController.getRecentActivity);
router.get('/projects', dashboardController.getRecentProjects);
router.get('/deployments', dashboardController.getRecentDeployments);

export default router;
