import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import * as architectureController from '@/controllers/architectureController';

const router = Router();

router.use(authenticateUser);

router.get('/', architectureController.getAllArchitectures);
router.get('/:id', architectureController.getArchitectureById);
router.get('/project/:projectId', architectureController.getArchitecturesByProject);
router.post('/', architectureController.createArchitecture);
router.put('/:id', architectureController.updateArchitecture);
router.delete('/:id', architectureController.deleteArchitecture);
router.post('/:id/export', architectureController.exportArchitecture);
router.post('/:id/diagram', architectureController.uploadDiagram);
router.get('/:id/diagram-url', architectureController.getDiagramUrl);

export default router;
