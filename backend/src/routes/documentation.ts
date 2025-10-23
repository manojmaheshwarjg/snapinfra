import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import * as documentationController from '@/controllers/documentationController';

const router = Router();

router.use(authenticateUser);

router.get('/', documentationController.getAllDocuments);
router.get('/:id', documentationController.getDocumentById);
router.get('/project/:projectId', documentationController.getProjectDocuments);
router.get('/project/:projectId/category/:category', documentationController.getDocumentsByCategory);
router.post('/', documentationController.createDocument);
router.put('/:id', documentationController.updateDocument);
router.delete('/:id', documentationController.deleteDocument);
router.post('/search', documentationController.searchDocuments);
router.post('/:documentId/attachments', documentationController.uploadAttachment);
router.get('/:documentId/attachments/:attachmentId/url', documentationController.getAttachmentUrl);
router.delete('/:documentId/attachments/:attachmentId', documentationController.deleteAttachment);

export default router;
