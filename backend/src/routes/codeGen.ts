import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import * as codeGenController from '@/controllers/codeGenController';

const router = Router();

router.use(authenticateUser);

router.get('/', codeGenController.getAllCodeGenerations);
router.get('/:id', codeGenController.getCodeGenerationById);
router.get('/project/:projectId', codeGenController.getCodeGenerationsByProject);
router.post('/generate', codeGenController.generateCode);
router.get('/:id/download-url', codeGenController.getDownloadUrl);
router.get('/:id/download', codeGenController.downloadGeneratedCode);
router.delete('/:id', codeGenController.deleteCodeGeneration);

export default router;
