import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import * as homeController from '@/controllers/homeController';

const router = Router();

router.use(authenticateUser);

router.get('/', homeController.getHome);

export default router;
