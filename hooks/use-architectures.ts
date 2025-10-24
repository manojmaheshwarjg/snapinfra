import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllArchitectures,
  getArchitecturesByProject,
  getArchitectureById,
  createArchitecture,
  updateArchitecture,
  uploadArchitectureDiagram,
  getArchitectureDiagramUrl,
  deleteArchitecture
} from '@/lib/api-client'

export function useArchitectures(projectId?: string) {
  return useQuery({
    queryKey: ['architectures', projectId],
    queryFn: projectId ? () => getArchitecturesByProject(projectId) : getAllArchitectures,
    enabled: !!projectId,
  })
}

export function useArchitecture(id: string, projectId: string) {
  return useQuery({
    queryKey: ['architecture', id, projectId],
    queryFn: () => getArchitectureById(id, projectId),
    enabled: !!id && !!projectId,
  })
}

export function useCreateArchitecture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createArchitecture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['architectures'] })
    },
  })
}

export function useUpdateArchitecture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateArchitecture(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['architectures'] })
      queryClient.invalidateQueries({ queryKey: ['architecture'] })
    },
  })
}

export function useDeleteArchitecture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) => 
      deleteArchitecture(id, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['architectures'] })
    },
  })
}

export function useUploadDiagram() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, file, projectId }: { id: string; file: File; projectId: string }) =>
      uploadArchitectureDiagram(id, file, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['architectures'] })
      queryClient.invalidateQueries({ queryKey: ['architecture'] })
    },
  })
}

export function useDiagramUrl(id: string, projectId: string) {
  return useQuery({
    queryKey: ['architecture', 'diagram', id, projectId],
    queryFn: () => getArchitectureDiagramUrl(id, projectId),
    enabled: !!id && !!projectId,
  })
}
