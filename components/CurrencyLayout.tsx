import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Trash2, History, Coins, RefreshCw } from 'lucide-react';
import AdUnit from './AdUnit';

interface CurrencyLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export interface CurrencyHistoryItem {
  id: string;
  title: string;
  result: string;
  timestamp: string;
  details: string;
}

export const useCurrencyHistory = () => {
  const [history, setHistory] = useState<CurrencyHistoryItem[]>([]);

  const addToHistory = (title: string, result: string, details: string) => {
    setHistory(prev => [{
      id: Date.now().toString(),
      title,
      result,
      details,
      timestamp: new Date().toLocaleString()
    }, ...prev]);
  };

  const clearHistory = () => setHistory([]);
  return { history, addToHistory, clearHistory };
};

const CurrencyLayout: React.FC<CurrencyLayoutProps & { history: CurrencyHistoryItem[], onClear: () => void }> = ({
  title,
  subtitle,
  children,
  history,
  onClear
}) => {
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 animate-fade-in px-4">
      {/* Header */}
      <div className="mb-8 pt-4">
         <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
            <Link to="/currency" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Currency Hub</Link>
            <span>/</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{title}</span>
         </div>
         <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
               <Link to="/currency" className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-amber-600 hover:border-amber-200 transition-all shadow-sm group">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
               </Link>
               <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                     <span className="text-amber-500"><Coins className="w-8 h-8" /></span>
                     {title}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                     <RefreshCw className="w-3 h-3" /> {subtitle || 'Real-time Exchange Rates'}
                  </p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Workspace */}
        <div className="lg:col-span-8 space-y-6">
             {children}
        </div>

        {/* Conversion History (Sidebar) */}
        <div className="lg:col-span-4 space-y-4">
           {/* Sidebar Ad Slot */}
           <AdUnit slot="2345678901" className="min-h-[250px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700" />

           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] sticky top-24">
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between backdrop-blur-sm">
                 <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <History className="w-4 h-4 text-amber-500" /> Recent Conversions
                 </h3>
                 <div className="flex gap-1">
                    <button onClick={handlePrint} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 rounded transition-colors" title="Print Log"><Printer className="w-4 h-4" /></button>
                    <button onClick={onClear} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors" title="Clear Log"><Trash2 className="w-4 h-4" /></button>
                 </div>
              </div>

              <div className="flex-grow overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700" id="print-area">
                 {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-xs italic">
                       <Coins className="w-8 h-8 mb-2 opacity-20" />
                       No conversions yet.
                    </div>
                 ) : (
                    history.map((item) => (
                       <div key={item.id} className="bg-slate-50 dark:bg-slate-700/30 p-3 rounded-lg border border-slate-100 dark:border-slate-700/50 group hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                             <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded">{item.title}</span>
                             <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                          </div>
                          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 mb-2 pl-2 border-l-2 border-slate-200 dark:border-slate-600 whitespace-pre-wrap leading-relaxed">
                             {item.details}
                          </div>
                          <div className="text-right text-sm font-bold text-slate-800 dark:text-white">
                             {item.result}
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CurrencyLayout;