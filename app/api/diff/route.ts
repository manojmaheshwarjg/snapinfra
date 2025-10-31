import { NextRequest, NextResponse } from 'next/server';
import { generateDiff, generateDiffStats, detectLanguage } from '@/lib/utils/diff-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { before, after, fileName, language } = body;

    // Validation
    if (!before || !after) {
      return NextResponse.json(
        { success: false, error: 'Both before and after code are required' },
        { status: 400 }
      );
    }

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: 'fileName is required' },
        { status: 400 }
      );
    }

    // Detect language if not provided
    const detectedLanguage = language || detectLanguage(fileName);

    // Generate diff
    const diff = generateDiff(before, after, fileName, detectedLanguage);
    const stats = generateDiffStats(diff);

    return NextResponse.json({
      success: true,
      data: {
        diff,
        stats,
        metadata: {
          fileName,
          language: detectedLanguage,
          beforeLines: before.split('\n').length,
          afterLines: after.split('\n').length,
        }
      }
    });

  } catch (error: any) {
    console.error('Diff generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate diff',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

// Batch diff generation
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { files } = body;

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'files array is required' },
        { status: 400 }
      );
    }

    const diffs = files.map(file => {
      const { before, after, fileName, language } = file;
      const detectedLanguage = language || detectLanguage(fileName);
      const diff = generateDiff(before, after, fileName, detectedLanguage);
      const stats = generateDiffStats(diff);

      return {
        fileName,
        diff,
        stats,
        language: detectedLanguage
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        diffs,
        totalFiles: diffs.length,
        totalAdditions: diffs.reduce((sum, d) => sum + d.stats.additions, 0),
        totalDeletions: diffs.reduce((sum, d) => sum + d.stats.deletions, 0),
      }
    });

  } catch (error: any) {
    console.error('Batch diff generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate batch diffs',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
