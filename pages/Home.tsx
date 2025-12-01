import React from 'react';
import { Ruler, ArrowRightLeft, Scale, Calculator, Atom, TrendingUp, Landmark, PieChart, Coins, Zap, FlaskConical, Globe, RefreshCcw, HeartPulse, Activity, Terminal, Code2, Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import AdUnit from '../components/AdUnit';

const Home: React.FC = () => {
  const { t } = useLanguage();

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Unit Converter Pro",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${window.location.href.split('#')[0]}#/?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-12 mb-12">
      <SEO 
        title="All-in-One Calculator & Unit Converter"
        description="Free online calculator suite for finance, math, science, health, and everyday conversions. Convert units, calculate loans, solve equations, and more."
        keywords={['unit converter', 'online calculator', 'finance calculator', 'scientific calculator', 'math tools', 'health calculator', 'currency converter']}
        schema={schema}
      />

      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto mt-8 sm:mt-0">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t('hero_title')}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('hero_subtitle')}
        </p>
      </div>

      {/* Inline Ad Slot - Placeholder ID */}
      <div className="w-full max-w-4xl mx-auto px-4">
        <AdUnit slot="3456789012" className="min-h-[100px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-4">
        
        {/* Everyday Conversions Card */}
        <Link to="/everyday" className="w-full group perspective-1000">
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-orange-500/20 relative transform-style-3d group-hover:rotate-x-2">
            <div className="p-1 bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 animate-gradient-x"></div>
            
            <div className="p-8 sm:p-10 text-center flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/0 via-transparent to-yellow-500/0 group-hover:from-orange-500/5 group-hover:to-yellow-500/5 transition-colors duration-500"></div>

              <div className="flex gap-4 mb-6 text-orange-600 dark:text-orange-400 transition-transform duration-500 group-hover:scale-110">
                <Coffee className="w-10 h-10" />
                <Ruler className="w-10 h-10" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 relative z-10">
                {t('everyday_tools')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto relative z-10">
                {t('everyday_desc')}
              </p>
              
              <span className="mt-6 inline-flex items-center text-orange-600 dark:text-orange-400 font-medium group-hover:underline relative z-10">
                {t('start_converting')} <ArrowRightLeft className="w-4 h-4 ml-2 rtl:rotate-180" />
              </span>
            </div>
          </div>
        </Link>

        {/* Tech & Developer Tools Card */}
        <Link to="/tech-developer" className="w-full group perspective-1000">
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-indigo-500/20 relative transform-style-3d group-hover:rotate-x-2">
            <div className="p-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
            
            <div className="p-8 sm:p-10 text-center flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-transparent to-pink-500/0 group-hover:from-indigo-500/5 group-hover:to-pink-500/5 transition-colors duration-500"></div>

              <div className="flex gap-4 mb-6 text-indigo-600 dark:text-indigo-400 transition-transform duration-500 group-hover:scale-110">
                <Terminal className="w-10 h-10" />
                <Code2 className="w-10 h-10" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 relative z-10">
                {t('dev_tools')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto relative z-10">
                {t('dev_desc')}
              </p>
              
              <span className="mt-6 inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium group-hover:underline relative z-10">
                {t('open_suite')} <ArrowRightLeft className="w-4 h-4 ml-2 rtl:rotate-180" />
              </span>
            </div>
          </div>
        </Link>

        {/* Advanced Math & Science Card */}
        <Link to="/advanced-math" className="w-full group perspective-1000">
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-teal-500/20 relative transform-style-3d group-hover:rotate-x-2">
            <div className="p-1 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600"></div>
            
            <div className="p-8 sm:p-10 text-center flex flex-col items-center justify-center min-h-[250px]">
              <div className="flex gap-4 mb-6 text-teal-500/80 dark:text-teal-400/80 transition-transform duration-500 group-hover:scale-110">
                <Calculator className="w-10 h-10 group-hover:rotate-12 transition-transform duration-300" />
                <Atom className="w-10 h-10 group-hover:animate-spin-slow" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                {t('adv_math')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {t('adv_desc')}
              </p>
              
              <span className="mt-6 inline-flex items-center text-teal-600 dark:text-teal-400 font-medium group-hover:underline">
                {t('open_dashboard')} <ArrowRightLeft className="w-4 h-4 ml-2 rtl:rotate-180" />
              </span>
            </div>
          </div>
        </Link>

        {/* Financial & Investment Card */}
        <Link to="/financial-investment" className="w-full group perspective-1000">
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-emerald-500/20 relative transform-style-3d group-hover:rotate-x-2">
            <div className="p-1 bg-gradient-to-r from-amber-400 via-orange-500 to-emerald-600 animate-gradient-x"></div>
            
            <div className="p-8 sm:p-10 text-center flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/0 via-transparent to-emerald-500/0 group-hover:from-amber-500/5 group-hover:to-emerald-500/5 transition-colors duration-500"></div>

              <div className="flex gap-4 mb-6 text-emerald-600 dark:text-emerald-400 transition-transform duration-500 group-hover:scale-110">
                <Landmark className="w-10 h-10" />
                <TrendingUp className="w-10 h-10" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 relative z-10">
                {t('finance_tools')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto relative z-10">
                {t('finance_desc')}
              </p>
              
              <span className="mt-6 inline-flex items-center text-emerald-600 dark:text-emerald-400 font-medium group-hover:underline relative z-10">
                {t('open_finance')} <ArrowRightLeft className="w-4 h-4 ml-2 rtl:rotate-180" />
              </span>
            </div>
          </div>
        </Link>

        {/* Health & Fitness Card */}
        <Link to="/health" className="w-full group perspective-1000">
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-rose-500/20 relative transform-style-3d group-hover:rotate-x-2">
            <div className="p-1 bg-gradient-to-r from-pink-500 via-rose-500 to-red-600 animate-gradient-x"></div>
            
            <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[250px] relative overflow-hidden">
                <div className="flex gap-4 mb-6 text-rose-600 dark:text-rose-400 transition-transform duration-500 group-hover:scale-110">
                  <HeartPulse className="w-10 h-10 animate-pulse" />
                  <Activity className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {t('health_fitness')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  {t('health_desc')}
                </p>
                <span className="mt-6 inline-flex items-center text-rose-600 dark:text-rose-400 font-medium group-hover:underline">
                  {t('view_health')} <ArrowRightLeft className="w-4 h-4 ml-2 rtl:rotate-180" />
                </span>
            </div>
          </div>
        </Link>

        {/* Currency Converter Card */}
        <Link to="/currency" className="w-full group perspective-1000">
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-amber-500/20 relative transform-style-3d group-hover:rotate-x-2">
            <div className="p-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600 animate-gradient-x"></div>
            
            <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[250px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/0 to-orange-500/0 group-hover:from-yellow-500/5 group-hover:to-orange-500/5 transition-colors duration-500"></div>

                <div className="flex gap-4 mb-6 text-amber-600 dark:text-amber-400 transition-transform duration-500 group-hover:scale-110">
                  <Coins className="w-10 h-10" />
                  <RefreshCcw className="w-10 h-10 group-hover:rotate-180 transition-transform duration-700" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 relative z-10">
                  {t('currency_conv')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto relative z-10">
                  {t('currency_desc')}
                </p>
                
                <span className="mt-6 inline-flex items-center text-amber-600 dark:text-amber-400 font-medium group-hover:underline relative z-10">
                  {t('exchange_now')} <ArrowRightLeft className="w-4 h-4 ml-2 rtl:rotate-180" />
                </span>
            </div>
          </div>
        </Link>

        {/* Physics System Card */}
        <Link to="/physics" className="w-full group perspective-1000">
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-violet-500/20 relative transform-style-3d group-hover:rotate-x-2">
            <div className="p-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-600 animate-gradient-x"></div>
            
            <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[250px] relative overflow-hidden">
                <div className="flex gap-4 mb-6 text-violet-600 dark:text-violet-400 transition-transform duration-500 group-hover:scale-110">
                  <Atom className="w-10 h-10 animate-spin-slow" />
                  <Zap className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
                  {t('physics_lab')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  {t('physics_desc')}
                </p>
                <span className="mt-6 inline-flex items-center text-violet-600 dark:text-violet-400 font-medium group-hover:underline">
                  {t('enter_lab')} <ArrowRightLeft className="w-4 h-4 ml-2 rtl:rotate-180" />
                </span>
            </div>
          </div>
        </Link>

        {/* Chemistry Card */}
        <Link to="/chemistry" className="w-full group perspective-1000">
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-cyan-500/20 relative transform-style-3d group-hover:rotate-x-2">
            <div className="p-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 animate-gradient-x"></div>
            
            <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[250px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-colors duration-500"></div>

                <div className="flex gap-4 mb-6 text-cyan-600 dark:text-cyan-400 transition-transform duration-500 group-hover:scale-110">
                  <FlaskConical className="w-10 h-10" />
                  <Scale className="w-10 h-10" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 relative z-10">
                  {t('chem_lab')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto relative z-10">
                  {t('chem_desc')}
                </p>
                
                <span className="mt-6 inline-flex items-center text-cyan-600 dark:text-cyan-400 font-medium group-hover:underline relative z-10">
                  {t('start_exp')} <ArrowRightLeft className="w-4 h-4 ml-2 rtl:rotate-180" />
                </span>
            </div>
          </div>
        </Link>

        {/* Geography Card */}
        <Link to="/geography" className="w-full group perspective-1000">
          <div className="h-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:shadow-blue-500/20 relative transform-style-3d group-hover:rotate-x-2">
            <div className="p-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-600 animate-gradient-x"></div>
            
            <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[250px] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-colors duration-500"></div>

                <div className="flex gap-4 mb-6 text-blue-600 dark:text-blue-400 transition-transform duration-500 group-hover:scale-110">
                  <Globe className="w-10 h-10" />
                  <TrendingUp className="w-10 h-10" />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 relative z-10">
                  {t('geography')}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto relative z-10">
                  {t('geo_desc')}
                </p>
                
                <span className="mt-6 inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:underline relative z-10">
                  {t('explore_maps')} <ArrowRightLeft className="w-4 h-4 ml-2 rtl:rotate-180" />
                </span>
            </div>
          </div>
        </Link>

      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl mt-4">
        {[
          { title: "precision", desc: "precision_desc" },
          { title: "speed", desc: "speed_desc" },
          { title: "dark_mode", desc: "dark_mode_desc" }
        ].map((item, idx) => (
          <div key={idx} className="p-6 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 text-center hover:bg-white dark:hover:bg-slate-800 transition-colors duration-200">
             <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{t(item.title)}</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400">{t(item.desc)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;