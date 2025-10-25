import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    services: {
      dynamodb: process.env.DYNAMODB_PROJECTS_TABLE ? 'configured' : 'missing',
      s3: process.env.S3_BUCKET_NAME ? 'configured' : 'missing',
      groq: process.env.GROQ_API_KEY ? 'configured' : 'missing'
    }
  });
}
