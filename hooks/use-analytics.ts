import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getAnalyticsDashboardMetrics,
  getProjectAnalytics,
  trackAnalyticsEvent,
  getAnalyticsChartData,
  getRealtimeAnalytics,
  getAnalyticsTrends
} from '@/lib/api-client'

export function useAnalyticsDashboard() {
  return useQuery({
    queryKey: ['analytics', 'dashboard'],
    queryFn: getAnalyticsDashboardMetrics,
  })
}

export function useProjectAnalytics(projectId: string) {
  return useQuery({
    queryKey: ['analytics', 'project', projectId],
    queryFn: () => getProjectAnalytics(projectId),
    enabled: !!projectId,
  })
}

export function useAnalyticsChartData(chartType: string, period: string = '7d') {
  return useQuery({
    queryKey: ['analytics', 'chart', chartType, period],
    queryFn: () => getAnalyticsChartData(chartType, period),
  })
}

export function useRealtimeAnalytics(projectId?: string, options?: { refetchInterval?: number }) {
  return useQuery({
    queryKey: ['analytics', 'realtime', projectId],
    queryFn: () => getRealtimeAnalytics(projectId),
    refetchInterval: options?.refetchInterval || 30000, // 30 seconds default
  })
}

export function useAnalyticsTrends(period: string = '7d', metric?: string) {
  return useQuery({
    queryKey: ['analytics', 'trends', period, metric],
    queryFn: () => getAnalyticsTrends(period, metric),
  })
}

export function useTrackEvent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: trackAnalyticsEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analytics'] })
    },
  })
}
