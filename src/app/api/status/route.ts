import { NextResponse } from 'next/server';

export const preferredRegion = 'hkg1';

// A lightweight liveness endpoint, not an uptime or dependency-monitoring service.
export function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    region: process.env.VERCEL_REGION || null,
    commitSha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || null,
  }, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=60, stale-while-revalidate=300',
    },
  });
}
