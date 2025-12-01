import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Trash2, Terminal, History, Code2 } from 'lucide-react';
import AdUnit from './AdUnit';

interface TechLayoutProps {
  title: string;
  category: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export interface TechHistoryItem {
  id: string;
  title: string;
  result: string;
  timestamp: string;
  details: string;
}

export const useTechHistory = () => {
  const [history, setHistory] = useState<TechHistoryItem[]>([]);

  const addToHistory = (title: string, result: string, details: string) => {
    setHistory(prev => [{
      id: Date.now().toString(),
      title,
      result,
      details,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }, ...prev]);
  };

  const clearHistory = () => setHistory([]);
  return { history, addToHistory, clearHistory };
};

const TechLayout: React.FC<TechLayoutProps & { history: TechHistoryItem[], onClear: () => void }> = ({
  title,
  category,
  icon,
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
            <Link to="/tech-developer" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Developer Tools</Link>
            <span>/</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">{category}</span>
         </div>
         <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
               <Link to="/tech-developer" className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm group">
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
               </Link>
               <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                     {icon && <span className="text-indigo-500">{icon}</span>}
                     {title}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                     <Terminal className="w-3 h-3" /> Utility Console
                  </p>
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Workspace */}
        <div className="lg:col-span-9 space-y-6">
             {children}
        </div>

        {/* Console Log (Sidebar) */}
        <div className="lg:col-span-3 space-y-4">
           {/* Sidebar Ad Slot */}
           <AdUnit slot="2345678901" className="min-h-[250px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700" />

           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-200px)] sticky top-24">
              <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between backdrop-blur-sm">
                 <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <History className="w-4 h-4 text-indigo-500" /> Console Log
                 </h3>
                 <div className="flex gap-1">
                    <button onClick={handlePrint} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 rounded transition-colors" title="Print Log"><Printer className="w-4 h-4" /></button>
                    <button onClick={onClear} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-colors" title="Clear Log"><Trash2 className="w-4 h-4" /></button>
                 </div>
              </div>

              <div className="flex-grow overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 font-mono text-xs" id="print-area">
                 {history.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-xs italic font-sans">
                       <Code2 className="w-8 h-8 mb-2 opacity-20" />
                       No execution history.
                    </div>
                 ) : (
                    history.map((item) => (
                       <div key={item.id} className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors">
                          <div className="flex justify-between items-start mb-1">
                             <span className="font-bold text-indigo-600 dark:text-indigo-400">&gt; {item.title}</span>
                             <span className="text-slate-400 text-[10px]">{item.timestamp}</span>
                          </div>
                          <div className="text-slate-500 dark:text-slate-400 mb-2 truncate">
                             {item.details.split('\n')[0]}...
                          </div>
                          <div className="p-2 bg-white dark:bg-black/20 rounded border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 break-all">
                             {item.result.length > 50 ? item.result.substring(0, 50) + '...' : item.result}
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

export default TechLayout;