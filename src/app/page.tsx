'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SystemStatusFooter from '@/components/SystemStatusFooter';
import HomeSection from '@/components/HomeSection';
import F1RaceTrackSkills from '@/components/F1RaceTrackSkills';
import ProjectsSection from '@/components/ProjectsSection';
import HongKongSection from '@/components/HongKongSection';
import HobbiesSection from '@/components/HobbiesSection';
import ContactSection from '@/components/ContactSection';
import ArchitectureShowcase from '@/components/ArchitectureShowcase';
import ClientHydrationWrapper from '@/components/ClientHydrationWrapper';
import HydrationErrorBoundary from '@/components/HydrationErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import PageTransition from '@/components/PageTransition';
import AnimatedBackground from '@/components/AnimatedBackground';
import CommandPalette from '@/components/CommandPalette';

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Function to handle navigation
  const navigate = (page: string) => {
    setCurrentPage(page);
    // Scroll to top when navigating (only on client side)
    if (isMounted && typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <HydrationErrorBoundary>
      <ClientHydrationWrapper>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-blue-950 font-inter text-gray-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
            {/* Animated Background */}
            <AnimatedBackground />
            
            {/* Command Palette */}
            <CommandPalette navigate={navigate} />
            
            {/* Content */}
            <div className="relative z-10">
              <Header navigate={navigate} currentPage={currentPage} />
              <main className="container mx-auto p-4 md:p-8 flex-1">
                <PageTransition pageKey={currentPage}>
                  {currentPage === 'home' && <HomeSection navigate={navigate} />}
                  {currentPage === 'skills' && <F1RaceTrackSkills />}
                  {currentPage === 'projects' && <ProjectsSection />}
                  {currentPage === 'architecture' && <ArchitectureShowcase />}
                  {currentPage === 'hongkong' && <HongKongSection />}
                  {currentPage === 'hobbies' && <HobbiesSection />}
                  {currentPage === 'contact' && <ContactSection />}
                </PageTransition>
              </main>
              <SystemStatusFooter />
            </div>
          </div>
        </ThemeProvider>
      </ClientHydrationWrapper>
    </HydrationErrorBoundary>
  );
}
