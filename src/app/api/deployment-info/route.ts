import { NextResponse } from 'next/server';
import { getDeploymentInfo } from '@/lib/deployment';

export const preferredRegion = 'hkg1';

// Public metadata: intentionally cacheable and independent of visitor identity.
export function GET() {
  return NextResponse.json({
    ...getDeploymentInfo(),
    region: process.env.VERCEL_REGION || null,
    timestamp: new Date().toISOString(),
  }, {
    headers: {
      'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
    },
  });
}
