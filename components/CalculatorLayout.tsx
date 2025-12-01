import React, { useState, useRef } from 'react';
import { Copy, Save, Printer, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import AdUnit from './AdUnit';

interface HistoryItem {
  type: string;
  input: string;
  output: string;
  timestamp: string;
}

interface CalculatorLayoutProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onSave?: () => void;
  history?: HistoryItem[];
}

export const useCalculatorHistory = (type: string) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const addToHistory = (input: string, output: string) => {
    const newItem: HistoryItem = {
      type,
      input,
      output,
      timestamp: new Date().toLocaleTimeString(),
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  return { history, addToHistory };
};

const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ 
  title, 
  icon, 
  children,
  history = [] 
}) => {
  const { t } = useLanguage();
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12">
      <div className="mb-6 flex items-center gap-2">
        <Link to="/advanced-math" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
          <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
        </Link>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('back_to_dashboard')}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calculator Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3 bg-slate-50/50 dark:bg-slate-800/50">
              <div className="text-primary-600 dark:text-primary-400">
                {icon}
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t(title) || title}</h1>
            </div>
            
            <div className="p-6 sm:p-8">
              {children}
            </div>
          </div>
        </div>

        {/* Sidebar / History Area */}
        <div className="space-y-6">
          {/* Sidebar Ad Slot - Placeholder ID */}
          <AdUnit slot="2345678901" className="min-h-[250px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700" />

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full max-h-[600px]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-slate-400" /> {t('recent_results')}
              </h3>
              <button 
                onClick={handlePrint}
                className="p-2 text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                title={t('print_log')}
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto flex-grow p-0" ref={printRef} id="print-area">
              {history.length === 0 ? (
                <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm italic">
                  {t('no_data')}
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {history.map((item, idx) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-bold text-primary-600 dark:text-primary-400 uppercase tracking-wider">{item.type}</span>
                        <span className="text-xs text-slate-400">{item.timestamp}</span>
                      </div>
                      <div className="mb-1 text-sm text-slate-600 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-900/50 rounded px-2 py-1 truncate">
                        {item.input}
                      </div>
                      <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-mono break-all">
                        = {item.output}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorLayout;