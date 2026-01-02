import { NextResponse } from 'next/server';

/**
 * API endpoint that returns real Vercel deployment information
 * Uses Vercel's System Environment Variables
 * @see https://vercel.com/docs/projects/environment-variables/system-environment-variables
 */
export async function GET() {
  const deploymentInfo = {
    // Git information
    gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7), // Short SHA
    gitCommitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE,
    gitCommitAuthor: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME,
    gitBranch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
    gitProvider: process.env.VERCEL_GIT_PROVIDER, // github, gitlab, bitbucket
    gitRepoOwner: process.env.VERCEL_GIT_REPO_OWNER,
    gitRepoSlug: process.env.VERCEL_GIT_REPO_SLUG,

    // Deployment information
    deploymentId: process.env.VERCEL_DEPLOYMENT_ID,
    url: process.env.VERCEL_URL,
    environment: process.env.VERCEL_ENV, // production, preview, or development
    region: process.env.VERCEL_REGION || 'hkg1', // Vercel region code
    
    // Build information
    buildId: process.env.VERCEL_DEPLOYMENT_ID?.substring(0, 7),
    
    // Region mapping (Vercel uses short codes)
    regionName: getRegionName(process.env.VERCEL_REGION),
    
    // Timestamps
    timestamp: new Date().toISOString(),
    buildTime: process.env.VERCEL_BUILD_TIME,
    
    // Additional metadata
    framework: 'Next.js',
    nodeVersion: process.version,
    platform: 'Vercel',
  };

  return NextResponse.json(deploymentInfo, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      'X-Deployment-Id': deploymentInfo.deploymentId || 'unknown',
      'X-Git-Commit-Sha': deploymentInfo.gitCommitSha || 'unknown',
    },
  });
}

/**
 * Maps Vercel region codes to human-readable names
 * @see https://vercel.com/docs/edge-network/regions
 */
function getRegionName(regionCode?: string): string {
  const regionMap: { [key: string]: string } = {
    // Americas
    'iad1': 'Washington, D.C., USA (us-east-1)',
    'dfw1': 'Dallas, USA (us-south-1)',
    'pdx1': 'Portland, USA (us-west-2)',
    'sfo1': 'San Francisco, USA (us-west-1)',
    'gru1': 'São Paulo, Brazil (sa-east-1)',
    
    // Europe
    'ams1': 'Amsterdam, Netherlands (eu-west-1)',
    'cdg1': 'Paris, France (eu-west-2)',
    'lhr1': 'London, UK (eu-west-3)',
    'fra1': 'Frankfurt, Germany (eu-central-1)',
    'dub1': 'Dublin, Ireland (eu-west-4)',
    
    // Asia Pacific
    'hkg1': 'Hong Kong (ap-east-1)',
    'syd1': 'Sydney, Australia (ap-southeast-2)',
    'sin1': 'Singapore (ap-southeast-1)',
    'bom1': 'Mumbai, India (ap-south-1)',
    'icn1': 'Seoul, South Korea (ap-northeast-2)',
    'nrt1': 'Tokyo, Japan (ap-northeast-1)',
    
    // Default
    'dev1': 'Development (local)',
  };

  return regionMap[regionCode || 'hkg1'] || `${regionCode || 'Hong Kong'} (ap-east-1)`;
}

/**
 * Example response:
 * {
 *   "gitCommitSha": "7f3a21c",
 *   "gitCommitMessage": "Add new features",
 *   "gitCommitAuthor": "Simon Cheung",
 *   "gitBranch": "main",
 *   "gitProvider": "github",
 *   "deploymentId": "dpl_xxxxx",
 *   "url": "your-site.vercel.app",
 *   "environment": "production",
 *   "region": "hkg1",
 *   "regionName": "Hong Kong (ap-east-1)",
 *   "buildId": "dpl_xxx",
 *   "timestamp": "2024-12-29T12:00:00.000Z",
 *   "framework": "Next.js",
 *   "nodeVersion": "v20.10.0",
 *   "platform": "Vercel"
 * }
 */

