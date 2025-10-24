import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAllActivities, getProjectActivities, logActivity } from '@/lib/api-client'

export function useActivities(limit?: number) {
  return useQuery({
    queryKey: ['activities', limit],
    queryFn: () => getAllActivities(limit),
    refetchInterval: 10000, // Auto-refresh every 10 seconds
  })
}

export function useProjectActivities(projectId: string, limit?: number) {
  return useQuery({
    queryKey: ['activities', 'project', projectId, limit],
    queryFn: () => getProjectActivities(projectId, limit),
    enabled: !!projectId,
    refetchInterval: 10000,
  })
}

export function useLogActivity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: logActivity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] })
    },
  })
}
