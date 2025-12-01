
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, LanguageContextType } from '../types';
import { translations } from '../assets/translations';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('app-language');
    // Validate saved language
    if (saved && Object.keys(translations).includes(saved)) {
      return saved as Language;
    }
    return 'en';
  });

  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    localStorage.setItem('app-language', language);
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    setDir(direction);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
  }, [language]);

  const t = (key: string): string => {
    const dict = translations[language];
    return dict[key as keyof typeof dict] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
