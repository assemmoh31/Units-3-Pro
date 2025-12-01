
import React from 'react';
import { Link } from 'react-router-dom';
import { geoCategories, geoCalculators } from '../utils/geography-data';
import { ArrowRight, Globe, Map } from 'lucide-react';
import SEO from '../components/SEO';

const GeographyDashboard: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center gap-12 animate-fade-in mb-12">
      <SEO 
        title="Geography & Navigation Calculators" 
        description="Tools for coordinates, distance, bearing, solar position, and surveying." 
        keywords={['geography calculator', 'coordinates converter', 'latitude longitude', 'surveying tools']} 
      />
      {/* Hero Header */}
      <div className="text-center max-w-4xl px-4 mt-8 space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4 text-blue-600 dark:text-blue-400 ring-4 ring-blue-50 dark:ring-blue-900/20">
           <Globe className="w-8 h-8" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Geography <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">Center</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Advanced tools for navigation, surveying, and mapping. 
          Calculate coordinates, distances, bearings, and solar data with precision.
        </p>
      </div>

      <div className="w-full max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {geoCategories.map((cat: any) => {
           const tools = Object.values(geoCalculators).filter(c => c.category === cat.title);
           
           return (
             <div key={cat.id} className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col`}>
                {/* Card Header */}
                <div className={`p-5 flex items-center gap-4 relative overflow-hidden`}>
                   <div className={`absolute inset-0 opacity-20 ${cat.bg}`}></div>
                   <div className={`relative p-3 rounded-2xl ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                      <cat.icon className="w-6 h-6" />
                   </div>
                   <div className="relative">
                      <h2 className="text-lg font-bold text-slate-800 dark:text-white">{cat.title}</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{tools.length} Modules</p>
                   </div>
                </div>
                
                {/* Tools List */}
                <div className="p-4 space-y-1 flex-grow">
                   {tools.length > 0 ? (
                     <div className="flex flex-col gap-1">
                     {tools.map(tool => (
                       <Link 
                         key={tool.id}
                         to={`/geography/${cat.id}/${tool.id}`}
                         className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all group/item"
                       >
                         <span className="text-slate-600 dark:text-slate-300 font-medium text-xs">{tool.title}</span>
                         <ArrowRight className="w-3 h-3 text-slate-300 group-hover/item:text-blue-500 transition-transform group-hover/item:translate-x-1" />
                       </Link>
                     ))}
                     </div>
                   ) : (
                     <div className="p-6 text-center text-slate-400 text-xs italic flex flex-col items-center">
                        <Map className="w-6 h-6 mb-2 opacity-20" />
                        Coming Soon
                     </div>
                   )}
                </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default GeographyDashboard;
