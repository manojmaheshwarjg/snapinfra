import { Router } from 'express';
import { authenticateUser } from '@/middleware/authMiddleware';
import * as teamController from '@/controllers/teamController';

const router = Router();

router.use(authenticateUser);

router.get('/project/:projectId', teamController.getProjectTeam);
router.post('/project/:projectId/invite', teamController.inviteTeamMember);
router.post('/invite/:invitationId/accept', teamController.acceptInvitation);
router.post('/invite/:invitationId/decline', teamController.declineInvitation);
router.delete('/project/:projectId/member/:userId', teamController.removeTeamMember);
router.put('/project/:projectId/member/:userId/role', teamController.updateMemberRole);
router.get('/invitations', teamController.getUserInvitations);

export default router;
