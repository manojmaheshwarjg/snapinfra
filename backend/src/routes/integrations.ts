import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import * as integrationsController from '@/controllers/integrationsController';

const router = Router();

router.use(authenticateUser);

router.get('/', integrationsController.getAllIntegrations);
router.get('/:id', integrationsController.getIntegrationById);
router.get('/project/:projectId', integrationsController.getProjectIntegrations);
router.post('/', integrationsController.createIntegration);
router.put('/:id', integrationsController.updateIntegration);
router.delete('/:id', integrationsController.deleteIntegration);
router.post('/:id/enable', integrationsController.enableIntegration);
router.post('/:id/disable', integrationsController.disableIntegration);
router.post('/:id/sync', integrationsController.syncIntegration);
router.post('/:id/test', integrationsController.testIntegration);

export default router;
