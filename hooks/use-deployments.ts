import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllDeployments,
  getDeploymentById,
  getDeploymentsByProject,
  createDeployment,
  updateDeployment,
  getDeploymentStatus,
  getDeploymentLogs
} from '@/lib/api-client'

export function useDeployments() {
  return useQuery({
    queryKey: ['deployments'],
    queryFn: getAllDeployments,
  })
}

export function useDeployment(id: string) {
  return useQuery({
    queryKey: ['deployment', id],
    queryFn: () => getDeploymentById(id),
    enabled: !!id,
  })
}

export function useProjectDeployments(projectId: string) {
  return useQuery({
    queryKey: ['deployments', 'project', projectId],
    queryFn: () => getDeploymentsByProject(projectId),
    enabled: !!projectId,
  })
}

export function useCreateDeployment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDeployment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] })
    },
  })
}

export function useUpdateDeployment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateDeployment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deployments'] })
      queryClient.invalidateQueries({ queryKey: ['deployment'] })
    },
  })
}

export function useDeploymentStatus(id: string, options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ['deployment', 'status', id],
    queryFn: () => getDeploymentStatus(id),
    enabled: !!id,
    refetchInterval: options?.refetchInterval || 5000, // Poll every 5 seconds by default
  })
}

export function useDeploymentLogs(id: string) {
  return useQuery({
    queryKey: ['deployment', 'logs', id],
    queryFn: () => getDeploymentLogs(id),
    enabled: !!id,
    refetchInterval: 10000, // Refresh logs every 10 seconds
  })
}
