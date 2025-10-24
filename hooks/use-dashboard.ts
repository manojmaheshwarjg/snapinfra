import { useQuery } from '@tanstack/react-query'
import { 
  getDashboardOverview, 
  getDashboardMetrics, 
  getRecentActivity,
  getRecentDeployments
} from '@/lib/api-client'

export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: getDashboardOverview,
  })
}

export function useDashboardMetrics() {
  return useQuery({
    queryKey: ['dashboard', 'metrics'],
    queryFn: getDashboardMetrics,
  })
}

export function useRecentActivity(limit?: number) {
  return useQuery({
    queryKey: ['dashboard', 'activity', limit],
    queryFn: () => getRecentActivity(limit),
  })
}

export function useRecentDeployments(limit?: number) {
  return useQuery({
    queryKey: ['dashboard', 'deployments', limit],
    queryFn: () => getRecentDeployments(limit),
  })
}
