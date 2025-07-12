'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomeSection from '@/components/HomeSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import HongKongSection from '@/components/HongKongSection';
import HobbiesSection from '@/components/HobbiesSection';
import ContactSection from '@/components/ContactSection';
import ClientHydrationWrapper from '@/components/ClientHydrationWrapper';
import HydrationErrorBoundary from '@/components/HydrationErrorBoundary';

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
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-600 via-gray-700 to-blue-800 font-inter text-gray-900">
          <Header navigate={navigate} currentPage={currentPage} className="sticky top-0 z-50" />
          <main className="container mx-auto p-4 md:p-8 flex-1">
          {currentPage === 'home' && <HomeSection navigate={navigate} />}
          {currentPage === 'about' && <AboutSection />}
          {currentPage === 'skills' && <SkillsSection />}
          {currentPage === 'projects' && <ProjectsSection />}
          {currentPage === 'hongkong' && <HongKongSection />}
          {currentPage === 'hobbies' && <HobbiesSection />}
          {currentPage === 'contact' && <ContactSection />}
          </main>
          <Footer />
        </div>
      </ClientHydrationWrapper>
    </HydrationErrorBoundary>
  );
}
