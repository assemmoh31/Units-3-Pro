import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { Moon, Sun, Box, Globe, ChevronDown, Check } from 'lucide-react';
import { Language } from '../types';

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-primary-600 p-2 rounded-lg group-hover:bg-primary-500 transition-colors duration-300 shadow-lg shadow-primary-500/30">
                <Box className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                UnitConverter
              </span>
            </Link>
          </div>

          {/* Navigation Links & Toggles */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-6 mr-2">
              <Link
                to="/"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/') 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {t('home')}
              </Link>
              <Link
                to="/privacy"
                className={`text-sm font-medium transition-colors duration-200 ${
                  isActive('/privacy') 
                    ? 'text-primary-600 dark:text-primary-400' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {t('privacy')}
              </Link>
            </div>

            {/* Language Picker */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs font-bold uppercase hidden sm:block">{language}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {isLangOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 overflow-hidden animate-fade-in-up origin-top-right z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between group transition-colors"
                    >
                      <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                        <span className="text-lg">{lang.flag}</span>
                        {lang.label}
                      </span>
                      {language === lang.code && (
                        <Check className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-600 hover:text-primary-600 transition-colors" />
              ) : (
                <Sun className="w-5 h-5 text-slate-300 hover:text-amber-400 transition-colors" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav */}
      <div className="sm:hidden flex justify-center pb-3 space-x-6 border-b border-slate-100 dark:border-slate-800/50">
          <Link
            to="/"
            className={`text-sm font-medium ${isActive('/') ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            {t('home')}
          </Link>
          <Link
            to="/privacy"
            className={`text-sm font-medium ${isActive('/privacy') ? 'text-primary-600 dark:text-primary-400' : 'text-slate-500 dark:text-slate-400'}`}
          >
            {t('privacy')}
          </Link>
      </div>
    </nav>
  );
};

export default Navbar;