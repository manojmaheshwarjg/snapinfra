import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getSettings,
  updateSettings,
  updateTheme,
  updateNotificationSettings,
  uploadProfilePicture,
  getProfilePictureUrl,
  deleteProfilePicture
} from '@/lib/api-client'

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  })
}

export function useUpdateSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

export function useUpdateTheme() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateTheme,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

export function useUpdateNotifications() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateNotificationSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    },
  })
}

export function useProfilePictureUrl() {
  return useQuery({
    queryKey: ['settings', 'profile-picture'],
    queryFn: getProfilePictureUrl,
    retry: false, // Don't retry if no picture exists
  })
}

export function useUploadProfilePicture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      queryClient.invalidateQueries({ queryKey: ['settings', 'profile-picture'] })
    },
  })
}

export function useDeleteProfilePicture() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      queryClient.invalidateQueries({ queryKey: ['settings', 'profile-picture'] })
    },
  })
}
