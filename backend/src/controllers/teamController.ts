import { Request, Response } from 'express';
import { DynamoDBService } from '@/services/database/dynamoDBService';
import { SNSService } from '@/services/notifications/snsService';
import { teamMemberSchema } from '@/validation/schemas';
import { v4 as uuidv4 } from 'uuid';
import { Team, TeamInvitation } from '@/models';

const dynamoDB = new DynamoDBService();
const snsService = new SNSService();

export const getProjectTeam = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const team = await dynamoDB.get('Teams', { projectId, userId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json({ team });
  } catch (error) {
    console.error('Error in getProjectTeam:', error);
    res.status(500).json({ error: 'Failed to fetch project team' });
  }
};

export const inviteTeamMember = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.userId;

    const { error, value } = teamMemberSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    let team = await dynamoDB.get('Teams', { projectId, userId });
    
    if (!team) {
      team = {
        id: uuidv4(),
        projectId,
        userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        members: [],
        invitations: []
      };
    }

    const invitation: TeamInvitation = {
      id: uuidv4(),
      email: value.email,
      role: value.role,
      invitedBy: userId,
      invitedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    };

    team.invitations = team.invitations || [];
    team.invitations.push(invitation);
    team.updatedAt = new Date().toISOString();

    await dynamoDB.put('Teams', team);

    await snsService.sendNotification({
      subject: `Team Invitation: You've been invited to join a project`,
      message: JSON.stringify({
        invitationId: invitation.id,
        projectId,
        email: invitation.email,
        role: invitation.role,
        invitedBy: userId,
        invitedAt: invitation.invitedAt,
        expiresAt: invitation.expiresAt,
        message: `You have been invited to join the project as a ${invitation.role}.`
      }, null, 2)
    });

    res.status(201).json({ invitation });
  } catch (error) {
    console.error('Error in inviteTeamMember:', error);
    res.status(500).json({ error: 'Failed to invite team member' });
  }
};

export const acceptInvitation = async (req: Request, res: Response) => {
  try {
    const { invitationId } = req.params;
    const userId = req.userId;

    const teams = await dynamoDB.scan({
      TableName: 'Teams',
      FilterExpression: 'contains(invitations, :invitationId)',
      ExpressionAttributeValues: {
        ':invitationId': invitationId
      }
    });

    const team = teams.Items?.[0];
    if (!team) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const invitation = team.invitations?.find((inv: TeamInvitation) => inv.id === invitationId);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation already processed' });
    }

    if (new Date(invitation.expiresAt) < new Date()) {
      invitation.status = 'expired';
      await dynamoDB.put('Teams', team);
      return res.status(400).json({ error: 'Invitation has expired' });
    }

    invitation.status = 'accepted';
    team.members = team.members || [];
    team.members.push({
      userId,
      email: invitation.email,
      name: req.userName || invitation.email,
      role: invitation.role,
      joinedAt: new Date().toISOString()
    });
    team.updatedAt = new Date().toISOString();

    await dynamoDB.put('Teams', team);
    res.json({ message: 'Invitation accepted successfully', team });
  } catch (error) {
    console.error('Error in acceptInvitation:', error);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
};

export const declineInvitation = async (req: Request, res: Response) => {
  try {
    const { invitationId } = req.params;

    const teams = await dynamoDB.scan({
      TableName: 'Teams',
      FilterExpression: 'contains(invitations, :invitationId)',
      ExpressionAttributeValues: {
        ':invitationId': invitationId
      }
    });

    const team = teams.Items?.[0];
    if (!team) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    const invitation = team.invitations?.find((inv: TeamInvitation) => inv.id === invitationId);
    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    invitation.status = 'declined';
    team.updatedAt = new Date().toISOString();

    await dynamoDB.put('Teams', team);
    res.json({ message: 'Invitation declined successfully' });
  } catch (error) {
    console.error('Error in declineInvitation:', error);
    res.status(500).json({ error: 'Failed to decline invitation' });
  }
};

export const removeTeamMember = async (req: Request, res: Response) => {
  try {
    const { projectId, userId: memberUserId } = req.params;
    const userId = req.userId;

    const team = await dynamoDB.get('Teams', { projectId, userId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    team.members = team.members?.filter((member: any) => member.userId !== memberUserId) || [];
    team.updatedAt = new Date().toISOString();

    await dynamoDB.put('Teams', team);
    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Error in removeTeamMember:', error);
    res.status(500).json({ error: 'Failed to remove team member' });
  }
};

export const updateMemberRole = async (req: Request, res: Response) => {
  try {
    const { projectId, userId: memberUserId } = req.params;
    const userId = req.userId;
    const { role } = req.body;

    if (!['admin', 'developer', 'viewer'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const team = await dynamoDB.get('Teams', { projectId, userId });
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const member = team.members?.find((m: any) => m.userId === memberUserId);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    member.role = role;
    team.updatedAt = new Date().toISOString();

    await dynamoDB.put('Teams', team);

    await snsService.sendNotification({
      subject: `Team Role Updated`,
      message: JSON.stringify({
        projectId,
        userId: memberUserId,
        newRole: role,
        updatedBy: userId,
        updatedAt: team.updatedAt
      }, null, 2)
    });

    res.json({ message: 'Member role updated successfully', member });
  } catch (error) {
    console.error('Error in updateMemberRole:', error);
    res.status(500).json({ error: 'Failed to update member role' });
  }
};

export const getUserInvitations = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    const teams = await dynamoDB.scan({
      TableName: 'Teams'
    });

    const userInvitations: any[] = [];
    
    teams.Items?.forEach((team: any) => {
      team.invitations?.forEach((invitation: TeamInvitation) => {
        if (invitation.status === 'pending') {
          userInvitations.push({
            ...invitation,
            projectId: team.projectId,
            teamId: team.id
          });
        }
      });
    });

    res.json({ invitations: userInvitations });
  } catch (error) {
    console.error('Error in getUserInvitations:', error);
    res.status(500).json({ error: 'Failed to fetch user invitations' });
  }
};
