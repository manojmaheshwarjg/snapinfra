// Enhancement Preview UI Types
// Types for the visual enhancement preview system

import { Enhancement, EnhancementCategory, EnhancementImpact } from './ai-enhancement-engine';

export interface EnhancementPreviewProps {
  enhancements: Enhancement[];
  onApply: (enhancementIds: string[]) => Promise<void>;
  onReject: (enhancementIds: string[]) => Promise<void>;
  onApplyAll: () => Promise<void>;
  loading?: boolean;
}

export interface EnhancementCardProps {
  enhancement: Enhancement;
  onApply: () => void;
  onReject: () => void;
  selected?: boolean;
  onToggleSelect?: () => void;
}

export interface EnhancementDiffProps {
  before: string;
  after: string;
  language: string;
  fileName: string;
}

export interface CategoryFilterProps {
  categories: EnhancementCategory[];
  selected: EnhancementCategory[];
  onToggle: (category: EnhancementCategory) => void;
}

export interface ImpactSummaryProps {
  impact: EnhancementImpact;
  totalEnhancements: number;
  appliedCount?: number;
}

export interface EnhancementActionBarProps {
  selectedCount: number;
  totalCount: number;
  onApplySelected: () => void;
  onRejectSelected: () => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

// Enhancement stats for visualization
export interface EnhancementStats {
  byCategory: Record<EnhancementCategory, number>;
  bySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  totalSavings?: {
    cost: string;
    performance: string;
  };
  securityScore?: {
    before: number;
    after: number;
    improvement: number;
  };
}

// UI state management
export interface EnhancementUIState {
  selectedIds: Set<string>;
  expandedIds: Set<string>;
  appliedIds: Set<string>;
  rejectedIds: Set<string>;
  filterCategories: EnhancementCategory[];
  sortBy: 'priority' | 'category' | 'impact';
  viewMode: 'list' | 'grid' | 'compact';
}

// Color scheme for categories
export const CATEGORY_COLORS: Record<EnhancementCategory, string> = {
  security: '#ef4444', // red
  cost: '#10b981', // green
  performance: '#3b82f6', // blue
  monitoring: '#f59e0b', // amber
  reliability: '#8b5cf6', // purple
  compliance: '#ec4899', // pink
};

// Icons for categories
export const CATEGORY_ICONS: Record<EnhancementCategory, string> = {
  security: '🔒',
  cost: '💰',
  performance: '⚡',
  monitoring: '📊',
  reliability: '🛡️',
  compliance: '✅',
};

// Severity levels
export type EnhancementSeverity = 'critical' | 'high' | 'medium' | 'low';

export const SEVERITY_COLORS: Record<EnhancementSeverity, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#f59e0b',
  low: '#84cc16',
};

// Animation states
export type AnimationState = 'idle' | 'applying' | 'applied' | 'rejecting' | 'rejected' | 'error';

// Toast notifications
export interface EnhancementToast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  duration?: number;
}
