import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAllDocumentation,
  getDocumentationById,
  getDocumentationByProject,
  createDocumentation,
  updateDocumentation,
  deleteDocumentation,
  searchDocumentation,
  uploadDocumentAttachment,
  getDocumentAttachmentUrl,
  deleteDocumentAttachment
} from '@/lib/api-client'

export function useDocumentation() {
  return useQuery({
    queryKey: ['documentation'],
    queryFn: getAllDocumentation,
  })
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ['documentation', id],
    queryFn: () => getDocumentationById(id),
    enabled: !!id,
  })
}

export function useProjectDocumentation(projectId: string) {
  return useQuery({
    queryKey: ['documentation', 'project', projectId],
    queryFn: () => getDocumentationByProject(projectId),
    enabled: !!projectId,
  })
}

export function useCreateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDocumentation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation'] })
    },
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateDocumentation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation'] })
    },
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteDocumentation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation'] })
    },
  })
}

export function useSearchDocumentation(query: string, projectId?: string) {
  return useQuery({
    queryKey: ['documentation', 'search', query, projectId],
    queryFn: () => searchDocumentation(query, projectId),
    enabled: query.length > 0,
  })
}

export function useUploadAttachment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ documentId, file }: { documentId: string; file: File }) =>
      uploadDocumentAttachment(documentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation'] })
    },
  })
}

export function useAttachmentUrl(documentId: string, attachmentId: string) {
  return useQuery({
    queryKey: ['documentation', 'attachment', documentId, attachmentId],
    queryFn: () => getDocumentAttachmentUrl(documentId, attachmentId),
    enabled: !!documentId && !!attachmentId,
  })
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ documentId, attachmentId }: { documentId: string; attachmentId: string }) =>
      deleteDocumentAttachment(documentId, attachmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentation'] })
    },
  })
}
