/** Public build metadata only. Do not add secrets or request-specific data here. */
export function getDeploymentInfo() {
  const isVercel = process.env.VERCEL === '1';
  return {
    gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || null,
    gitCommitMessage: process.env.VERCEL_GIT_COMMIT_MESSAGE || null,
    gitCommitAuthor: process.env.VERCEL_GIT_COMMIT_AUTHOR_NAME || null,
    gitBranch: process.env.VERCEL_GIT_COMMIT_REF || 'main',
    gitProvider: process.env.VERCEL_GIT_PROVIDER || 'github',
    gitRepoOwner: process.env.VERCEL_GIT_REPO_OWNER || 'iamtlcs',
    gitRepoSlug: process.env.VERCEL_GIT_REPO_SLUG || 'iamtlcs-personal-website',
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    platform: isVercel ? 'Vercel' : 'Local server',
    delivery: isVercel ? 'Global CDN' : 'Local server',
  };
}

export type DeploymentInfo = ReturnType<typeof getDeploymentInfo>;
