'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // The head script applies the saved/system theme before the first paint.
    setTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light');
    setMounted(true);
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const followSystem = () => {
      let saved: string | null = null;
      try { saved = localStorage.getItem('theme'); } catch { /* Optional preference storage. */ }
      if (saved !== 'light' && saved !== 'dark') setTheme(media.matches ? 'dark' : 'light');
    };
    media.addEventListener('change', followSystem);
    return () => media.removeEventListener('change', followSystem);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Keep browser controls and Tailwind colors aligned with the selected theme.
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.style.colorScheme = theme;
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try { localStorage.setItem('theme', nextTheme); } catch { /* Optional preference storage. */ }
  }, [theme]);
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

