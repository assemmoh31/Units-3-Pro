import React from 'react';
import { Link } from 'react-router-dom';
import { physicsCategories, physicsCalculators } from '../utils/physics-data';
import { ArrowRight, Atom, Zap, Microscope } from 'lucide-react';
import SEO from '../components/SEO';

const PhysicsDashboard: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center gap-12 animate-fade-in mb-12">
      <SEO 
        title="Physics Laboratory Simulations"
        description="Interactive physics calculators for mechanics, optics, thermodynamics, electromagnetism, and fluid dynamics."
        keywords={['physics calculator', 'mechanics solver', 'optics simulator', 'kinematics calculator', 'thermodynamics', 'fluid mechanics']}
      />

      {/* Hero Header */}
      <div className="text-center max-w-4xl px-4 mt-8 space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-violet-100 dark:bg-violet-900/30 rounded-full mb-4 text-violet-600 dark:text-violet-400 ring-4 ring-violet-50 dark:ring-violet-900/20">
           <Atom className="w-8 h-8 animate-spin-slow" style={{ animationDuration: '10s' }} />
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Physics <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">Laboratory</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Explore the universe through interactive simulations. 
          From quantum mechanics to orbital dynamics, visualize and solve complex problems.
        </p>
      </div>

      <div className="w-full max-w-7xl px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {physicsCategories.map((cat: any) => {
           const tools = Object.values(physicsCalculators).filter(c => c.category === cat.title);
           
           return (
             <div key={cat.id} className={`bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group flex flex-col ${cat.className || ''}`}>
                {/* Card Header */}
                <div className={`p-6 flex items-center gap-4 relative overflow-hidden`}>
                   <div className={`absolute inset-0 opacity-20 ${cat.bg}`}></div>
                   <div className={`absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/30 transition-colors`}></div>
                   
                   <div className={`relative p-3 rounded-2xl ${cat.bg} ${cat.color} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                      <cat.icon className="w-8 h-8" />
                   </div>
                   <div className="relative">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white">{cat.title}</h2>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{tools.length} Modules</p>
                   </div>
                </div>
                
                {/* Tools List */}
                <div className="p-4 space-y-2 flex-grow">
                   {tools.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                     {tools.map(tool => (
                       <Link 
                         key={tool.id}
                         to={`/physics/${cat.id}/${tool.id}`}
                         className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all group/item"
                       >
                         <span className="text-slate-600 dark:text-slate-300 font-medium text-sm">{tool.title}</span>
                         <ArrowRight className="w-4 h-4 text-slate-300 group-hover/item:text-violet-500 transition-transform group-hover/item:translate-x-1" />
                       </Link>
                     ))}
                     </div>
                   ) : (
                     <div className="p-8 text-center text-slate-400 text-sm italic flex flex-col items-center">
                        <Microscope className="w-8 h-8 mb-2 opacity-20" />
                        Coming Soon
                     </div>
                   )}
                </div>
                
                {/* Footer Gradient Strip */}
                <div className={`h-1 w-full bg-gradient-to-r from-transparent via-${cat.color.split('-')[1]}-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
             </div>
           );
        })}
      </div>
    </div>
  );
};

export default PhysicsDashboard;