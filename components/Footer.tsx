import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import AdUnit from './AdUnit';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="mt-auto py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 text-center">
        {/* Footer Ad Slot - Placeholder ID */}
        <AdUnit slot="4567890123" className="mb-8 min-h-[90px]" />
        
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {t('footer')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;