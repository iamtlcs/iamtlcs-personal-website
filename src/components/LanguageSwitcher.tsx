'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { Languages } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh-HK', name: 'Chinese (Hong Kong)', nativeName: '繁體中文（香港）' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const currentLanguage = languages.find((lang) => lang.code === language) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-control flex items-center gap-2 px-3 py-2 rounded-lg min-h-11 border transition-colors duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <Languages className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">{currentLanguage.nativeName}</span>
        <span className="text-sm font-medium sm:hidden">{currentLanguage.code.toUpperCase()}</span>
        <motion.svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="language-menu absolute right-0 mt-2 w-48 rounded-xl border shadow-2xl overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setIsOpen(false);
                }}
                aria-pressed={language === lang.code}
                className="language-option w-full text-left px-4 py-3 text-sm font-medium transition-colors duration-200"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{lang.nativeName}</div>
                    <div className="text-xs theme-muted mt-0.5">{lang.name}</div>
                  </div>
                  {language === lang.code && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-2 h-2 rounded-full bg-blue-400"
                    />
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

