import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Printer, RefreshCw, Trash2, Download, Table } from 'lucide-react';
import AdUnit from './AdUnit';

interface FinancialLayoutProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  resultData?: {
    label: string;
    value: string;
  }[];
  onSave?: () => void;
}

export interface SavedResult {
  id: string;
  title: string;
  date: string;
  details: string; // concise string of inputs -> output
}

export const useFinancialHistory = () => {
  const [history, setHistory] = useState<SavedResult[]>([]);

  const saveResult = (title: string, details: string) => {
    const newResult: SavedResult = {
      id: Date.now().toString(),
      title,
      date: new Date().toLocaleString(),
      details
    };
    setHistory(prev => [newResult, ...prev]);
  };

  const clearHistory = () => setHistory([]);
  const deleteItem = (id: string) => setHistory(prev => prev.filter(i => i.id !== id));

  return { history, saveResult, clearHistory, deleteItem };
};

const FinancialLayout: React.FC<FinancialLayoutProps & { history: SavedResult[], onClearHistory: () => void, onDeleteHistoryItem: (id: string) => void }> = ({ 
  title, 
  description, 
  icon, 
  children, 
  history,
  onClearHistory,
  onDeleteHistoryItem
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto pb-12 animate-fade-in">
      {/* Header Breadcrumb */}
      <div className="mb-6 flex items-center gap-2">
        <Link to="/financial-investment" className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Financial Hub</span>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Calculator Card */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-slate-200 dark:border-slate-700 overflow-hidden relative">
            {/* Top accent bar */}
            <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600"></div>
            
            <div className="p-6 sm:p-8">
              <div className="flex items-start gap-4 mb-8">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                  {icon || <Table className="w-8 h-8" />}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{title}</h1>
                  {description && <p className="text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
                </div>
              </div>

              {children}
            </div>
          </div>
        </div>

        {/* Sidebar / History Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Sidebar Ad Slot */}
          <AdUnit slot="2345678901" className="min-h-[250px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700" />

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full max-h-[800px]">
            <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10">
              <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-emerald-500" /> Saved Calculations
              </h3>
              <div className="flex gap-1">
                <button 
                  onClick={handlePrint}
                  className="p-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                  title="Print Table"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button 
                  onClick={onClearHistory}
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                  title="Clear All"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-grow p-0 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700" id="print-area">
              {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400 p-6 text-center">
                  <Save className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm">No saved calculations yet.</p>
                  <p className="text-xs mt-1 opacity-70">Calculations you save will appear here.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {history.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group relative">
                       <button 
                         onClick={() => onDeleteHistoryItem(item.id)}
                         className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-all"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                       <div className="text-xs text-slate-400 mb-1">{item.date}</div>
                       <div className="font-medium text-slate-800 dark:text-slate-200 text-sm mb-1">{item.title}</div>
                       <div className="text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 p-2 rounded border border-slate-200 dark:border-slate-700/50 whitespace-pre-wrap">
                         {item.details}
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl">
             <div className="flex gap-3">
               <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
               <p className="text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
                 <strong>Pro Tip:</strong> Use the "Save" button in the calculator to add results to this list. Then click the Print icon to export a report.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialLayout;