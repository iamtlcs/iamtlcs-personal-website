'use client';

import type { DeploymentInfo } from '@/lib/deployment';
import { motion } from 'framer-motion';
import {
  Activity,
  MapPin,
  GitBranch,
  Server,
  Heart,
  Github,
  Linkedin,
  Mail,
} from 'lucide-react';

export default function SystemStatusFooter({ deployment, year }: { deployment: DeploymentInfo; year: number }) {
  const currentYear = year;
  const deploymentInfo = {
    buildHash: deployment.gitCommitSha || 'local',
    region: deployment.delivery,
    commitMessage: deployment.gitCommitMessage,
    commitAuthor: deployment.gitCommitAuthor,
    gitProvider: deployment.gitProvider,
    repoOwner: deployment.gitRepoOwner,
    repoSlug: deployment.gitRepoSlug,
    branch: deployment.gitBranch,
  };
  return (
    <footer className="relative mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      {/* System Status Bar */}
      <div className="container mx-auto px-6 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          {/* Status Indicators */}
          <div className="flex flex-wrap items-center gap-4">
            {/* System Status */}
            <StatusItem
              icon={Activity}
              label="System"
              value="Online"
              color="text-green-700 dark:text-green-400"
              pulse
            />

            {/* Location */}
            <StatusItem
              icon={MapPin}
              label="Delivery"
              value={deploymentInfo.region}
              color="text-blue-700 dark:text-blue-400"
            />

            {/* Build - Make it clickable */}
            {deploymentInfo.buildHash !== 'local' &&
             deploymentInfo.buildHash !== 'unknown' ? (
              <a
                href={`https://${deploymentInfo.gitProvider}.com/${deploymentInfo.repoOwner}/${deploymentInfo.repoSlug}/commit/${deploymentInfo.buildHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
                title="View commit on GitHub"
              >
                <StatusItem
                  icon={GitBranch}
                  label="Build"
                  value={`${deploymentInfo.buildHash} (${deploymentInfo.branch})`}
                  color="text-purple-700 dark:text-purple-400"
                />
              </a>
            ) : (
              <StatusItem
                icon={GitBranch}
                label="Build"
                value={`${deploymentInfo.buildHash} (${deploymentInfo.branch})`}
                color="text-purple-700 dark:text-purple-400"
              />
            )}

            {/* Deployment */}
            <StatusItem
              icon={Server}
              label="Deployment"
              value={deployment.platform}
              color="text-cyan-700 dark:text-cyan-400"
            />
          </div>


        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col items-center space-y-6">
          {/* Social Links */}
          <div className="flex gap-4">
            {[
              {
                Icon: Github,
                href: 'https://github.com/iamtlcs',
                label: 'GitHub',
                color: 'hover:text-slate-900 dark:hover:text-white',
              },
              {
                Icon: Linkedin,
                href: 'https://linkedin.com/in/iamtlcs',
                label: 'LinkedIn',
                color: 'hover:text-blue-600',
              },
              {
                Icon: Mail,
                href: 'mailto:simoncheung2002@gmail.com',
                label: 'Email',
                color: 'hover:text-red-500',
              },
            ].map(({ Icon, href, label, color }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors duration-300 ${color}`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                aria-label={label}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center space-y-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {currentYear} CHEUNG TAK LEUNG. All rights reserved.
            </p>

            {/* Deployment Info Box */}
            {deploymentInfo.commitMessage && (
              <motion.div
                className="w-full max-w-2xl mx-auto p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-blue-900/30 border border-blue-200 dark:border-blue-800"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="space-y-2">
                  {/* Commit Message */}
                  <div className="flex items-start gap-2">
                    <GitBranch className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                        Latest Commit:
                      </p>
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {deploymentInfo.commitMessage}
                      </p>
                    </div>
                  </div>

                  {/* Author and Timestamp */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                    {deploymentInfo.commitAuthor && (
                      <div className="flex items-center gap-1">
                        <span>🚀 Deployed by</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {deploymentInfo.commitAuthor}
                        </span>
                      </div>
                    )}

                    {/* GitHub Link */}
                    {deploymentInfo.buildHash !== 'local' &&
                     deploymentInfo.buildHash !== 'unknown' && (
                      <motion.a
                        href={`https://${deploymentInfo.gitProvider}.com/${deploymentInfo.repoOwner}/${deploymentInfo.repoSlug}/commit/${deploymentInfo.buildHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>View Commit</span>
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Built with */}
            <motion.p
              className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 flex-wrap"
              initial={false}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span>Built with</span>
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              >
                <Heart className="w-4 h-4 inline text-red-500 fill-current" />
              </motion.span>
              <span>using</span>
              <span className="font-semibold text-slate-700 dark:text-blue-400">
                Next.js
              </span>
              <span>•</span>
              <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                Tailwind
              </span>
              <span>•</span>
              <span className="font-semibold text-purple-600 dark:text-purple-400">
                TypeScript
              </span>
            </motion.p>

            {/* DevOps Flavor Text */}
            <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
              {deployment.platform} • {deployment.delivery}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

interface StatusItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  color?: string;
  pulse?: boolean;
}

function StatusItem({ icon: Icon, label, value, color = 'text-slate-500', pulse = false }: StatusItemProps) {
  return (
    <div className="flex min-w-0 items-center gap-2 text-slate-600 dark:text-slate-400">
      <Icon className={`w-3.5 h-3.5 ${color} ${pulse ? 'animate-pulse' : ''}`} />
      <span className="text-slate-500 dark:text-slate-400">{label}:</span>
      <span className={`min-w-0 break-all font-semibold ${color}`}>{value}</span>
    </div>
  );
}

