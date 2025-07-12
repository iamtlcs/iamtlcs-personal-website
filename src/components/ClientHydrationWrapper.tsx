"use client";

import { useEffect } from "react";

interface ClientHydrationWrapperProps {
  children: React.ReactNode;
}

export default function ClientHydrationWrapper({ children }: ClientHydrationWrapperProps) {
  useEffect(() => {
    const cleanupBrowserExtensions = () => {
      const bodyElement = document.body;
      if (bodyElement) {
        // Remove Grammarly attributes
        bodyElement.removeAttribute('data-new-gr-c-s-check-loaded');
        bodyElement.removeAttribute('data-gr-ext-installed');
        // Remove other common extension attributes
        bodyElement.removeAttribute('data-lt-installed');
        bodyElement.removeAttribute('data-new-gr-c-s-loaded');
      }
    };

    cleanupBrowserExtensions();

    const interval = setInterval(cleanupBrowserExtensions, 1000);
    
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}
