
import React from 'react';
import { Link } from 'react-router-dom';
import { Coins, ArrowRightLeft, Calendar, TrendingUp, RefreshCcw } from 'lucide-react';
import SEO from '../components/SEO';

const tools = [
  {
    id: 'converter',
    title: 'Standard Converter',
    desc: 'Real-time exchange rates for global currencies.',
    icon: RefreshCcw,
    color: 'text-amber-500',
    bg: 'bg-amber-100 dark:bg-amber-900/20'
  },
  {
    id: 'multi',
    title: 'Multi-Currency',
    desc: 'Convert one base currency to many others at once.',
    icon: Coins,
    color: 'text-emerald-500',
    bg: 'bg-emerald-100 dark:bg-emerald-900/20'
  },
  {
    id: 'historical',
    title: 'Historical Rates',
    desc: 'Check exchange rates for past dates.',
    icon: Calendar,
    color: 'text-blue-500',
    bg: 'bg-blue-100 dark:bg-blue-900/20'
  },
  {
    id: 'trends',
    title: 'Rate Trends',
    desc: 'View currency performance charts over time.',
    icon: TrendingUp,
    color: 'text-rose-500',
    bg: 'bg-rose-100 dark:bg-rose-900/20'
  }
];

const CurrencyDashboard: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center gap-12 animate-fade-in mb-12">
      <SEO 
        title="Currency Exchange & Trends" 
        description="Real-time exchange rates, historical currency data, and multi-currency converter." 
        keywords={['currency converter', 'exchange rates', 'forex', 'money converter']} 
      />
      {/* Hero Header */}
      <div className="text-center max-w-4xl px-4 mt-8 space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4 text-amber-600 dark:text-amber-400 ring-4 ring-amber-50 dark:ring-amber-900/20">
           <Coins className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Currency <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Exchange</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Live rates, historical data, and trend analysis.
          Powered by reliable exchange rate APIs.
        </p>
      </div>

      <div className="w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
             <Link 
               key={tool.id}
               to={`/currency/${tool.id}`}
               className={`group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col p-6`}
             >
                <div className="flex items-start justify-between mb-4">
                   <div className={`p-3 rounded-2xl ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                      <tool.icon className="w-8 h-8" />
                   </div>
                   <div className="p-2 rounded-full bg-slate-50 dark:bg-slate-700 group-hover:bg-slate-100 dark:group-hover:bg-slate-600 transition-colors">
                      <ArrowRightLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200" />
                   </div>
                </div>
                
                <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{tool.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">{tool.desc}</p>
             </Link>
        ))}
      </div>
    </div>
  );
};

export default CurrencyDashboard;
