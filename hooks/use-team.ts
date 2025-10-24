import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProjectTeam,
  inviteTeamMember,
  acceptTeamInvitation,
  getUserInvitations,
  removeTeamMember,
  updateTeamMemberRole
} from '@/lib/api-client'

export function useProjectTeam(projectId: string) {
  return useQuery({
    queryKey: ['team', 'project', projectId],
    queryFn: () => getProjectTeam(projectId),
    enabled: !!projectId,
  })
}

export function useUserInvitations() {
  return useQuery({
    queryKey: ['team', 'invitations'],
    queryFn: getUserInvitations,
  })
}

export function useInviteTeamMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      inviteTeamMember(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    },
  })
}

export function useAcceptInvitation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acceptTeamInvitation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    },
  })
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, userId }: { projectId: string; userId: string }) =>
      removeTeamMember(projectId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    },
  })
}

export function useUpdateTeamMemberRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ projectId, userId, role }: { projectId: string; userId: string; role: string }) =>
      updateTeamMemberRole(projectId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team'] })
    },
  })
}
