'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
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
    localStorage.setItem('language', language);
    // Update HTML lang attribute
    document.documentElement.lang = language;
  }, [language, mounted]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
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

