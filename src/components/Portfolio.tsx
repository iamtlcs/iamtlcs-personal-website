'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { MotionConfig } from 'framer-motion';
import type { DeploymentInfo } from '@/lib/deployment';
import Header from '@/components/Header';
import SystemStatusFooter from '@/components/SystemStatusFooter';
import HomeSection from '@/components/HomeSection';
import HydrationErrorBoundary from '@/components/HydrationErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import PageTransition from '@/components/PageTransition';
import AnimatedBackground from '@/components/AnimatedBackground';
import CommandPaletteLauncher from '@/components/CommandPaletteLauncher';

const F1RaceTrackSkills = dynamic(() => import('@/components/F1RaceTrackSkills'), {
  ssr: false,
  loading: () => <div className="content-section min-h-[70dvh] p-8" role="status">Loading skills track…</div>,
});
const ProjectsSection = dynamic(() => import('@/components/ProjectsSection'));
const ContactSection = dynamic(() => import('@/components/ContactSection'));

export default function Portfolio({ deploymentInfo, year }: { deploymentInfo: DeploymentInfo; year: number }) {
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = useCallback((page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }, []);

  return (
    <HydrationErrorBoundary>
      <MotionConfig reducedMotion="user">
        <LanguageProvider>
          <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950 font-inter text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-x-clip">
            {/* Animated Background */}
            <AnimatedBackground />

            {/* Command Palette */}
            <CommandPaletteLauncher navigate={navigate} />

            {/* Content */}
            <div className="relative z-10">
              <Header navigate={navigate} currentPage={currentPage} />
              <main className="container mx-auto min-w-0 p-3 sm:p-4 lg:p-8 flex-1">
                <PageTransition pageKey={currentPage}>
                  {currentPage === 'home' && <HomeSection navigate={navigate} />}
                  {currentPage === 'skills' && <F1RaceTrackSkills />}
                  {currentPage === 'projects' && <ProjectsSection />}
                  {currentPage === 'contact' && <ContactSection />}
                </PageTransition>
              </main>
              <SystemStatusFooter deployment={deploymentInfo} year={year} />
            </div>
          </div>
          </ThemeProvider>
        </LanguageProvider>
      </MotionConfig>
    </HydrationErrorBoundary>
  );
}
