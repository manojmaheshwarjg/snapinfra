import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import * as analyticsController from '@/controllers/analyticsController';

const router = Router();

router.use(authenticateUser);

router.get('/dashboard', analyticsController.getDashboardMetrics);
router.get('/project/:projectId', analyticsController.getProjectAnalytics);
router.get('/project/:projectId/metrics', analyticsController.getProjectMetrics);
router.post('/track', analyticsController.trackEvent);
router.get('/trends', analyticsController.getTrends);
router.get('/usage', analyticsController.getUsageStats);
router.get('/chart-data', analyticsController.getChartData);
router.get('/realtime', analyticsController.getRealtimeMetrics);

export default router;
