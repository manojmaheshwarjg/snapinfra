'use client';

import React, { useState, useMemo } from 'react';
import {
  EnhancementPreviewProps,
  EnhancementUIState,
  EnhancementStats,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  AnimationState,
} from '@/lib/iac/enhancement-ui-types';
import { Enhancement, EnhancementCategory } from '@/lib/iac/ai-enhancement-engine';

export default function EnhancementPreview({
  enhancements,
  onApply,
  onReject,
  onApplyAll,
  loading = false,
}: EnhancementPreviewProps) {
  const [uiState, setUIState] = useState<EnhancementUIState>({
    selectedIds: new Set(),
    expandedIds: new Set(),
    appliedIds: new Set(),
    rejectedIds: new Set(),
    filterCategories: [],
    sortBy: 'priority',
    viewMode: 'list',
  });

  const [animationStates, setAnimationStates] = useState<Record<string, AnimationState>>({});

  // Calculate stats
  const stats: EnhancementStats = useMemo(() => {
    const byCategory: Record<EnhancementCategory, number> = {
      security: 0,
      cost: 0,
      performance: 0,
      monitoring: 0,
      reliability: 0,
      compliance: 0,
    };

    const bySeverity = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    enhancements.forEach((e) => {
      byCategory[e.category]++;
      if (e.priority >= 9) bySeverity.critical++;
      else if (e.priority >= 7) bySeverity.high++;
      else if (e.priority >= 5) bySeverity.medium++;
      else bySeverity.low++;
    });

    return { byCategory, bySeverity };
  }, [enhancements]);

  // Filter and sort enhancements
  const filteredEnhancements = useMemo(() => {
    let filtered = enhancements;

    // Apply category filter
    if (uiState.filterCategories.length > 0) {
      filtered = filtered.filter((e) => uiState.filterCategories.includes(e.category));
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      if (uiState.sortBy === 'priority') return b.priority - a.priority;
      if (uiState.sortBy === 'category') return a.category.localeCompare(b.category);
      return 0;
    });

    return filtered;
  }, [enhancements, uiState.filterCategories, uiState.sortBy]);

  // Handlers
  const toggleSelect = (id: string) => {
    const newSelected = new Set(uiState.selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setUIState({ ...uiState, selectedIds: newSelected });
  };

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(uiState.expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setUIState({ ...uiState, expandedIds: newExpanded });
  };

  const handleApply = async (ids: string[]) => {
    ids.forEach((id) => setAnimationStates((prev) => ({ ...prev, [id]: 'applying' })));

    try {
      await onApply(ids);
      ids.forEach((id) => {
        setAnimationStates((prev) => ({ ...prev, [id]: 'applied' }));
        setUIState((prev) => ({
          ...prev,
          appliedIds: new Set([...prev.appliedIds, id]),
          selectedIds: new Set([...prev.selectedIds].filter((sid) => sid !== id)),
        }));
      });
    } catch (error) {
      ids.forEach((id) => setAnimationStates((prev) => ({ ...prev, [id]: 'error' })));
    }
  };

  const handleReject = async (ids: string[]) => {
    ids.forEach((id) => setAnimationStates((prev) => ({ ...prev, [id]: 'rejecting' })));

    try {
      await onReject(ids);
      ids.forEach((id) => {
        setAnimationStates((prev) => ({ ...prev, [id]: 'rejected' }));
        setUIState((prev) => ({
          ...prev,
          rejectedIds: new Set([...prev.rejectedIds, id]),
          selectedIds: new Set([...prev.selectedIds].filter((sid) => sid !== id)),
        }));
      });
    } catch (error) {
      ids.forEach((id) => setAnimationStates((prev) => ({ ...prev, [id]: 'error' })));
    }
  };

  const selectAll = () => {
    setUIState({
      ...uiState,
      selectedIds: new Set(filteredEnhancements.map((e) => e.id)),
    });
  };

  const clearSelection = () => {
    setUIState({ ...uiState, selectedIds: new Set() });
  };

  const toggleCategoryFilter = (category: EnhancementCategory) => {
    const newFilters = uiState.filterCategories.includes(category)
      ? uiState.filterCategories.filter((c) => c !== category)
      : [...uiState.filterCategories, category];
    setUIState({ ...uiState, filterCategories: newFilters });
  };

  return (
    <div className="w-full space-y-6">
      {/* Summary Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-2xl font-bold mb-4">AI Enhancement Suggestions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={enhancements.length} color="#6366f1" />
          <StatCard label="Critical" value={stats.bySeverity.critical} color="#dc2626" />
          <StatCard label="High" value={stats.bySeverity.high} color="#ea580c" />
          <StatCard label="Applied" value={uiState.appliedIds.size} color="#10b981" />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(CATEGORY_COLORS) as EnhancementCategory[]).map((category) => {
          const count = stats.byCategory[category];
          const isActive = uiState.filterCategories.includes(category);

          return (
            <button
              key={category}
              onClick={() => toggleCategoryFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isActive
                  ? 'ring-2 ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isActive ? CATEGORY_COLORS[category] : `${CATEGORY_COLORS[category]}20`,
                color: isActive ? '#fff' : CATEGORY_COLORS[category],
                ringColor: CATEGORY_COLORS[category],
              }}
              disabled={count === 0}
            >
              {CATEGORY_ICONS[category]} {category} ({count})
            </button>
          );
        })}
      </div>

      {/* Action Bar */}
      {uiState.selectedIds.size > 0 && (
        <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between border border-blue-200">
          <span className="text-sm font-medium">
            {uiState.selectedIds.size} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={clearSelection}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => handleReject(Array.from(uiState.selectedIds))}
              className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
            >
              Reject Selected
            </button>
            <button
              onClick={() => handleApply(Array.from(uiState.selectedIds))}
              className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
            >
              Apply Selected
            </button>
          </div>
        </div>
      )}

      {/* Enhancement Cards */}
      <div className="space-y-4">
        {filteredEnhancements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No enhancements match your filters.
          </div>
        ) : (
          filteredEnhancements.map((enhancement) => (
            <EnhancementCard
              key={enhancement.id}
              enhancement={enhancement}
              selected={uiState.selectedIds.has(enhancement.id)}
              expanded={uiState.expandedIds.has(enhancement.id)}
              animationState={animationStates[enhancement.id] || 'idle'}
              onToggleSelect={() => toggleSelect(enhancement.id)}
              onToggleExpand={() => toggleExpand(enhancement.id)}
              onApply={() => handleApply([enhancement.id])}
              onReject={() => handleReject([enhancement.id])}
              applied={uiState.appliedIds.has(enhancement.id)}
              rejected={uiState.rejectedIds.has(enhancement.id)}
            />
          ))
        )}
      </div>

      {/* Apply All Button */}
      {filteredEnhancements.length > 0 && (
        <button
          onClick={onApplyAll}
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
        >
          {loading ? 'Applying...' : 'Apply All Enhancements'}
        </button>
      )}
    </div>
  );
}

// Stat Card Component
function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-lg p-4 border" style={{ borderColor: color }}>
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-2xl font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

// Enhancement Card Component
interface EnhancementCardComponentProps {
  enhancement: Enhancement;
  selected: boolean;
  expanded: boolean;
  animationState: AnimationState;
  onToggleSelect: () => void;
  onToggleExpand: () => void;
  onApply: () => void;
  onReject: () => void;
  applied: boolean;
  rejected: boolean;
}

function EnhancementCard({
  enhancement,
  selected,
  expanded,
  animationState,
  onToggleSelect,
  onToggleExpand,
  onApply,
  onReject,
  applied,
  rejected,
}: EnhancementCardComponentProps) {
  const categoryColor = CATEGORY_COLORS[enhancement.category];
  const categoryIcon = CATEGORY_ICONS[enhancement.category];

  const priorityLabel =
    enhancement.priority >= 9
      ? 'Critical'
      : enhancement.priority >= 7
      ? 'High'
      : enhancement.priority >= 5
      ? 'Medium'
      : 'Low';

  const isProcessing = animationState === 'applying' || animationState === 'rejecting';
  const isDone = applied || rejected;

  return (
    <div
      className={`bg-white rounded-lg border-2 transition-all ${
        selected ? 'ring-2 ring-blue-400' : ''
      } ${isDone ? 'opacity-60' : ''} ${isProcessing ? 'animate-pulse' : ''}`}
      style={{ borderColor: applied ? '#10b981' : rejected ? '#ef4444' : categoryColor }}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <input
              type="checkbox"
              checked={selected}
              onChange={onToggleSelect}
              className="mt-1 w-4 h-4"
              disabled={isDone}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: categoryColor }}>{categoryIcon}</span>
                <span
                  className="px-2 py-1 text-xs font-semibold rounded-full"
                  style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                >
                  {enhancement.category}
                </span>
                <span className="text-xs text-gray-500">{priorityLabel}</span>
              </div>
              <h3 className="font-semibold text-lg mb-1">{enhancement.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{enhancement.description}</p>
              <div className="text-xs text-gray-500">
                Impact: {enhancement.impact.description}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {!isDone && (
              <>
                <button
                  onClick={onReject}
                  disabled={isProcessing}
                  className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={onApply}
                  disabled={isProcessing}
                  className="px-3 py-1 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </>
            )}
            <button
              onClick={onToggleExpand}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {expanded ? '▲' : '▼'}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div>
              <div className="text-sm font-semibold mb-1">Changes:</div>
              <div className="space-y-1">
                {enhancement.changes.map((change, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="text-gray-600">{change.file}:</span>
                    <span className="text-gray-800 ml-2">{change.description}</span>
                  </div>
                ))}
              </div>
            </div>
            {enhancement.reasoning && (
              <div>
                <div className="text-sm font-semibold mb-1">Reasoning:</div>
                <div className="text-sm text-gray-600">{enhancement.reasoning}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
