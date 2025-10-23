import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import * as schemaController from '@/controllers/schemaController';

const router = Router();

router.use(authenticateUser);

router.get('/', schemaController.getAllSchemas);
router.get('/:id', schemaController.getSchemaById);
router.get('/project/:projectId', schemaController.getSchemasByProject);
router.post('/', schemaController.createSchema);
router.put('/:id', schemaController.updateSchema);
router.delete('/:id', schemaController.deleteSchema);
router.post('/:id/version', schemaController.createSchemaVersion);
router.get('/:id/versions', schemaController.getSchemaVersions);

export default router;
