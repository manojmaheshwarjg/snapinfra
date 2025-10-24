import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllSchemas,
  getSchemaById,
  getSchemasByProject,
  createSchema,
  updateSchema,
  deleteSchema
} from '@/lib/api-client'

export function useSchemas() {
  return useQuery({
    queryKey: ['schemas'],
    queryFn: getAllSchemas,
  })
}

export function useSchema(id: string) {
  return useQuery({
    queryKey: ['schema', id],
    queryFn: () => getSchemaById(id),
    enabled: !!id,
  })
}

export function useProjectSchemas(projectId: string) {
  return useQuery({
    queryKey: ['schemas', 'project', projectId],
    queryFn: () => getSchemasByProject(projectId),
    enabled: !!projectId,
  })
}

export function useCreateSchema() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSchema,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemas'] })
    },
  })
}

export function useUpdateSchema() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateSchema(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemas'] })
      queryClient.invalidateQueries({ queryKey: ['schema'] })
    },
  })
}

export function useDeleteSchema() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteSchema,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemas'] })
    },
  })
}
