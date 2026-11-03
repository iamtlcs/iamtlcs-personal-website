'use client';

import { createContext, useContext, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import enTranslations from '@/locales/en.json';
import zhHKTranslations from '@/locales/zh-HK.json';
import frTranslations from '@/locales/fr.json';

export type Language = 'en' | 'zh-HK' | 'fr';

export type Translations = typeof enTranslations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
  en: enTranslations,
  'zh-HK': zhHKTranslations,
  fr: frTranslations,
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved language preference
    let savedLanguage: string | null = null;
    try { savedLanguage = localStorage.getItem('language'); } catch { /* Optional preference storage. */ }
    if (savedLanguage === 'en' || savedLanguage === 'zh-HK' || savedLanguage === 'fr') {
      setLanguageState(savedLanguage);
    } else {
      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'zh') {
        setLanguageState('zh-HK');
      } else if (browserLang === 'fr') {
        setLanguageState('fr');
      } else {
        setLanguageState('en');
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Save preference
    try { localStorage.setItem('language', language); } catch { /* Optional preference storage. */ }
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language, mounted]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);
  const value = useMemo(() => ({ language, setLanguage, t: translations[language] }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

