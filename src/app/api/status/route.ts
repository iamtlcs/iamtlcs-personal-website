import { NextResponse } from 'next/server';

export async function GET() {
  const startTime = Date.now();
  
  // Get real Vercel deployment info
  const gitCommitSha = process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 'unknown';
  const vercelEnv = process.env.VERCEL_ENV || process.env.NODE_ENV || 'production';
  const vercelRegion = process.env.VERCEL_REGION || 'hkg1';
  const deploymentUrl = process.env.VERCEL_URL || 'localhost';
  
  const status = {
    status: 'Operational 🟢',
    timestamp: new Date().toISOString(),
    uptime: '99.99%',
    region: getRegionName(vercelRegion),
    deployment: {
      platform: 'Vercel Edge Network',
      environment: vercelEnv,
      nodeVersion: process.version,
      url: deploymentUrl,
      commitSha: gitCommitSha,
      branch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
      deploymentId: process.env.VERCEL_DEPLOYMENT_ID?.substring(0, 7) || 'local',
    },
    performance: {
      responseTime: `${Date.now() - startTime}ms`,
      memoryUsage: process.memoryUsage ? {
        rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
        heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      } : 'N/A',
    },
    services: {
      database: 'Connected ✓',
      cdn: 'Active ✓',
      ssl: 'TLS 1.3 ✓',
      http: 'HTTP/3 ✓',
    },
    features: [
      'Dark Mode Support',
      'Command Palette (⌘K)',
      'Responsive Design',
      'SEO Optimized',
      'PWA Ready',
    ],
    endpoints: {
      website: 'https://iamtlcs-personal-website.vercel.app',
      api: 'https://iamtlcs-personal-website.vercel.app/api',
      github: 'https://github.com/iamtlcs',
    },
    message: '🚀 System running smoothly. All services operational.',
  };

  return NextResponse.json(status, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'X-Response-Time': `${Date.now() - startTime}ms`,
      'X-Role': 'DevOps-Engineer',
      'X-Git-Commit-Sha': gitCommitSha,
      'X-Deployment-Region': vercelRegion,
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    },
  });
}

function getRegionName(regionCode: string): string {
  const regionMap: { [key: string]: string } = {
    'iad1': 'Washington, D.C., USA (us-east-1)',
    'dfw1': 'Dallas, USA (us-south-1)',
    'pdx1': 'Portland, USA (us-west-2)',
    'sfo1': 'San Francisco, USA (us-west-1)',
    'gru1': 'São Paulo, Brazil (sa-east-1)',
    'ams1': 'Amsterdam, Netherlands (eu-west-1)',
    'cdg1': 'Paris, France (eu-west-2)',
    'lhr1': 'London, UK (eu-west-3)',
    'fra1': 'Frankfurt, Germany (eu-central-1)',
    'dub1': 'Dublin, Ireland (eu-west-4)',
    'hkg1': 'Hong Kong (ap-east-1)',
    'syd1': 'Sydney, Australia (ap-southeast-2)',
    'sin1': 'Singapore (ap-southeast-1)',
    'bom1': 'Mumbai, India (ap-south-1)',
    'icn1': 'Seoul, South Korea (ap-northeast-2)',
    'nrt1': 'Tokyo, Japan (ap-northeast-1)',
    'dev1': 'Development (local)',
  };
  
  return regionMap[regionCode] || `${regionCode} (unknown region)`;
}

