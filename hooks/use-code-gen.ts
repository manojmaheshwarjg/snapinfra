import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllCodeGenerations,
  getCodeGenerationById,
  getCodeGenerationsByProject,
  generateCode,
  getCodeDownloadUrl,
  deleteCodeGeneration
} from '@/lib/api-client'

export function useCodeGenerations() {
  return useQuery({
    queryKey: ['code-gen'],
    queryFn: getAllCodeGenerations,
  })
}

export function useCodeGeneration(id: string) {
  return useQuery({
    queryKey: ['code-gen', id],
    queryFn: () => getCodeGenerationById(id),
    enabled: !!id,
    refetchInterval: (data: any) => {
      // Poll while pending or processing
      if (data?.status === 'pending' || data?.status === 'processing') {
        return 5000 // Check every 5 seconds
      }
      return false // Stop polling when complete
    },
  })
}

export function useProjectCodeGenerations(projectId: string) {
  return useQuery({
    queryKey: ['code-gen', 'project', projectId],
    queryFn: () => getCodeGenerationsByProject(projectId),
    enabled: !!projectId,
  })
}

export function useGenerateCode() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: generateCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['code-gen'] })
    },
  })
}

export function useCodeDownloadUrl(id: string) {
  return useQuery({
    queryKey: ['code-gen', 'download', id],
    queryFn: () => getCodeDownloadUrl(id),
    enabled: !!id,
  })
}

export function useDeleteCodeGeneration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteCodeGeneration,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['code-gen'] })
    },
  })
}
