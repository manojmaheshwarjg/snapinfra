/**
 * Diff Generation Utilities
 * 
 * Generates line-by-line diffs between before and after code
 */

export type DiffLineType = 'added' | 'removed' | 'unchanged' | 'modified';

export interface DiffLine {
  type: DiffLineType;
  lineNumber: number;
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface DiffResult {
  fileName: string;
  language: string;
  totalAdded: number;
  totalRemoved: number;
  totalUnchanged: number;
  lines: DiffLine[];
}

/**
 * Generate unified diff between two code strings
 */
export function generateDiff(
  before: string,
  after: string,
  fileName: string = 'file',
  language: string = 'typescript'
): DiffResult {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');
  
  const diff = computeDiff(beforeLines, afterLines);
  
  return {
    fileName,
    language,
    totalAdded: diff.filter(l => l.type === 'added').length,
    totalRemoved: diff.filter(l => l.type === 'removed').length,
    totalUnchanged: diff.filter(l => l.type === 'unchanged').length,
    lines: diff
  };
}

/**
 * Compute line-by-line diff using Myers algorithm (simplified)
 */
function computeDiff(before: string[], after: string[]): DiffLine[] {
  const result: DiffLine[] = [];
  let beforeIndex = 0;
  let afterIndex = 0;
  let lineNumber = 1;
  
  // Simple line-by-line comparison
  // For production, use a library like diff-match-patch or fast-diff
  while (beforeIndex < before.length || afterIndex < after.length) {
    const beforeLine = beforeIndex < before.length ? before[beforeIndex] : null;
    const afterLine = afterIndex < after.length ? after[afterIndex] : null;
    
    if (beforeLine === afterLine && beforeLine !== null) {
      // Lines are identical
      result.push({
        type: 'unchanged',
        lineNumber,
        content: beforeLine,
        oldLineNumber: beforeIndex + 1,
        newLineNumber: afterIndex + 1
      });
      beforeIndex++;
      afterIndex++;
      lineNumber++;
    } else if (beforeLine && !afterLine) {
      // Line removed
      result.push({
        type: 'removed',
        lineNumber,
        content: beforeLine,
        oldLineNumber: beforeIndex + 1
      });
      beforeIndex++;
      lineNumber++;
    } else if (!beforeLine && afterLine) {
      // Line added
      result.push({
        type: 'added',
        lineNumber,
        content: afterLine,
        newLineNumber: afterIndex + 1
      });
      afterIndex++;
      lineNumber++;
    } else if (beforeLine && afterLine) {
      // Lines differ - check if it's a modification or addition/removal
      const similarity = calculateSimilarity(beforeLine, afterLine);
      
      if (similarity > 0.5) {
        // Modified line
        result.push({
          type: 'removed',
          lineNumber,
          content: beforeLine,
          oldLineNumber: beforeIndex + 1
        });
        result.push({
          type: 'added',
          lineNumber: lineNumber + 1,
          content: afterLine,
          newLineNumber: afterIndex + 1
        });
        beforeIndex++;
        afterIndex++;
        lineNumber += 2;
      } else {
        // Check if next lines match to determine if this is an addition or removal
        const nextBeforeMatchesAfter = before[beforeIndex + 1] === afterLine;
        const nextAfterMatchesBefore = after[afterIndex + 1] === beforeLine;
        
        if (nextBeforeMatchesAfter) {
          // Line removed
          result.push({
            type: 'removed',
            lineNumber,
            content: beforeLine,
            oldLineNumber: beforeIndex + 1
          });
          beforeIndex++;
        } else if (nextAfterMatchesBefore) {
          // Line added
          result.push({
            type: 'added',
            lineNumber,
            content: afterLine,
            newLineNumber: afterIndex + 1
          });
          afterIndex++;
        } else {
          // Both changed
          result.push({
            type: 'removed',
            lineNumber,
            content: beforeLine,
            oldLineNumber: beforeIndex + 1
          });
          result.push({
            type: 'added',
            lineNumber: lineNumber + 1,
            content: afterLine,
            newLineNumber: afterIndex + 1
          });
          beforeIndex++;
          afterIndex++;
          lineNumber++;
        }
        lineNumber++;
      }
    }
  }
  
  return result;
}

/**
 * Calculate similarity between two strings (0-1)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Generate diff statistics
 */
export function generateDiffStats(diff: DiffResult): {
  additions: number;
  deletions: number;
  changes: number;
  total: number;
} {
  return {
    additions: diff.totalAdded,
    deletions: diff.totalRemoved,
    changes: diff.totalAdded + diff.totalRemoved,
    total: diff.lines.length
  };
}

/**
 * Format diff for display
 */
export function formatDiffLine(line: DiffLine): string {
  const prefix = line.type === 'added' ? '+ ' : line.type === 'removed' ? '- ' : '  ';
  return `${prefix}${line.content}`;
}

/**
 * Detect language from file extension
 */
export function detectLanguage(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  
  const languageMap: Record<string, string> = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'py': 'python',
    'go': 'go',
    'rs': 'rust',
    'java': 'java',
    'tf': 'hcl',
    'yaml': 'yaml',
    'yml': 'yaml',
    'json': 'json',
    'md': 'markdown',
    'sh': 'bash',
    'dockerfile': 'dockerfile'
  };
  
  return languageMap[ext || ''] || 'text';
}
