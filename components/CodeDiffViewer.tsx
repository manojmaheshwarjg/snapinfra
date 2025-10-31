'use client';

import React, { useState, useMemo } from 'react';
import { generateDiff, generateDiffStats, detectLanguage, DiffResult, DiffLine } from '@/lib/utils/diff-generator';

export interface CodeDiffViewerProps {
  before: string;
  after: string;
  fileName: string;
  language?: string;
  showStats?: boolean;
  collapsible?: boolean;
  maxHeight?: string;
}

export default function CodeDiffViewer({
  before,
  after,
  fileName,
  language,
  showStats = true,
  collapsible = true,
  maxHeight = '500px'
}: CodeDiffViewerProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [copied, setCopied] = useState(false);

  const detectedLanguage = language || detectLanguage(fileName);
  
  const diff = useMemo(() => 
    generateDiff(before, after, fileName, detectedLanguage),
    [before, after, fileName, detectedLanguage]
  );

  const stats = useMemo(() => generateDiffStats(diff), [diff]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(after);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (isCollapsed) {
    return (
      <div className="border rounded-lg bg-gray-50">
        <button
          onClick={() => setIsCollapsed(false)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono">{fileName}</span>
            <DiffStats stats={stats} compact />
          </div>
          <span className="text-gray-500">▼ Expand</span>
        </button>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono font-semibold">{fileName}</span>
          {showStats && <DiffStats stats={stats} />}
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1 text-xs ${
                viewMode === 'split'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode('unified')}
              className={`px-3 py-1 text-xs border-l ${
                viewMode === 'unified'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Unified
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>

          {/* Collapse Button */}
          {collapsible && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="px-3 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              ▲ Collapse
            </button>
          )}
        </div>
      </div>

      {/* Diff Content */}
      <div 
        className="overflow-auto font-mono text-sm"
        style={{ maxHeight }}
      >
        {viewMode === 'split' ? (
          <SplitView diff={diff} />
        ) : (
          <UnifiedView diff={diff} />
        )}
      </div>
    </div>
  );
}

// Diff Statistics Component
function DiffStats({ stats, compact = false }: { stats: ReturnType<typeof generateDiffStats>; compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        {stats.additions > 0 && (
          <span className="text-green-600">+{stats.additions}</span>
        )}
        {stats.deletions > 0 && (
          <span className="text-red-600">-{stats.deletions}</span>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 text-xs">
      {stats.additions > 0 && (
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-green-500 rounded"></span>
          <span className="text-green-700 font-semibold">+{stats.additions}</span>
        </span>
      )}
      {stats.deletions > 0 && (
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 bg-red-500 rounded"></span>
          <span className="text-red-700 font-semibold">-{stats.deletions}</span>
        </span>
      )}
      <span className="text-gray-500">{stats.total} lines</span>
    </div>
  );
}

// Split View (Side-by-side)
function SplitView({ diff }: { diff: DiffResult }) {
  const beforeLines = diff.lines.filter(l => l.type !== 'added');
  const afterLines = diff.lines.filter(l => l.type !== 'removed');

  return (
    <div className="grid grid-cols-2 divide-x">
      {/* Before (Left) */}
      <div>
        <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 sticky top-0">
          Before
        </div>
        <div>
          {beforeLines.map((line, idx) => (
            <DiffLineComponent key={`before-${idx}`} line={line} side="before" />
          ))}
        </div>
      </div>

      {/* After (Right) */}
      <div>
        <div className="bg-gray-100 px-4 py-2 text-xs font-semibold text-gray-700 sticky top-0">
          After
        </div>
        <div>
          {afterLines.map((line, idx) => (
            <DiffLineComponent key={`after-${idx}`} line={line} side="after" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Unified View
function UnifiedView({ diff }: { diff: DiffResult }) {
  return (
    <div>
      {diff.lines.map((line, idx) => (
        <DiffLineComponent key={idx} line={line} />
      ))}
    </div>
  );
}

// Individual Diff Line
function DiffLineComponent({ 
  line, 
  side 
}: { 
  line: DiffLine; 
  side?: 'before' | 'after' 
}) {
  const getBackgroundColor = () => {
    if (side === 'before' && line.type === 'removed') return 'bg-red-50';
    if (side === 'after' && line.type === 'added') return 'bg-green-50';
    if (!side) {
      if (line.type === 'added') return 'bg-green-50';
      if (line.type === 'removed') return 'bg-red-50';
    }
    return 'bg-white';
  };

  const getTextColor = () => {
    if (line.type === 'added') return 'text-green-800';
    if (line.type === 'removed') return 'text-red-800';
    return 'text-gray-800';
  };

  const getLinePrefix = () => {
    if (!side) {
      if (line.type === 'added') return '+';
      if (line.type === 'removed') return '-';
      return ' ';
    }
    return ' ';
  };

  const lineNumber = side === 'before' 
    ? line.oldLineNumber 
    : side === 'after' 
    ? line.newLineNumber 
    : line.lineNumber;

  // Skip lines that don't belong to this side in split view
  if (side === 'before' && line.type === 'added') return null;
  if (side === 'after' && line.type === 'removed') return null;

  return (
    <div className={`flex ${getBackgroundColor()} hover:bg-opacity-75 transition-colors`}>
      {/* Line Number */}
      <div className="flex-shrink-0 w-12 text-center text-gray-500 text-xs py-1 select-none border-r">
        {lineNumber}
      </div>
      
      {/* Prefix */}
      <div className={`flex-shrink-0 w-6 text-center ${getTextColor()} py-1 select-none`}>
        {getLinePrefix()}
      </div>
      
      {/* Content */}
      <div className={`flex-1 px-2 py-1 ${getTextColor()} whitespace-pre`}>
        {line.content || ' '}
      </div>
    </div>
  );
}

// Collapsible Diff Group (for multiple files)
export function DiffGroup({ 
  diffs, 
  title 
}: { 
  diffs: Array<{ before: string; after: string; fileName: string }>; 
  title?: string 
}) {
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set([0]));

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedIndices);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedIndices(newExpanded);
  };

  return (
    <div className="space-y-4">
      {title && (
        <h3 className="text-lg font-semibold">{title}</h3>
      )}
      
      {diffs.map((diff, index) => (
        <div key={index}>
          {expandedIndices.has(index) ? (
            <CodeDiffViewer
              before={diff.before}
              after={diff.after}
              fileName={diff.fileName}
              collapsible
            />
          ) : (
            <div className="border rounded-lg bg-gray-50">
              <button
                onClick={() => toggleExpanded(index)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-mono">{diff.fileName}</span>
                <span className="text-gray-500">▼ Expand</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
