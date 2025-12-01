import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { 
  Sigma, 
  Activity, 
  Waves, 
  Binary, 
  BarChart3, 
  Move3d, 
  Zap, 
  CircleDot 
} from 'lucide-react';

const tools = [
  {
    id: 'integral-derivative',
    title: 'Integral & Derivative',
    icon: Sigma,
    desc: 'Compute symbolic derivatives and numeric integrals.',
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    id: 'differential-equations',
    title: 'Differential Equations',
    icon: Activity,
    desc: 'Solve simple ODEs numerically.',
    color: 'text-rose-500',
    bg: 'bg-rose-50 dark:bg-rose-900/20'
  },
  {
    id: 'fourier-transform',
    title: 'Fourier Transform',
    icon: Waves,
    desc: 'Analyze frequency components of signals.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20'
  },
  {
    id: 'laplace-transform',
    title: 'Laplace Transform',
    icon: Binary,
    desc: 'Convert time-domain functions to s-domain.',
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-900/20'
  },
  {
    id: 'probability-distributions',
    title: 'Probability Dist.',
    icon: BarChart3,
    desc: 'Calculate PDF and CDF for distributions.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20'
  },
  {
    id: 'vector-field-gradient',
    title: 'Vector Gradient',
    icon: Move3d,
    desc: 'Compute gradients of scalar fields.',
    color: 'text-cyan-500',
    bg: 'bg-cyan-50 dark:bg-cyan-900/20'
  },
  {
    id: 'physics-formulas',
    title: 'Physics Formulas',
    icon: Zap,
    desc: 'Kinematics, Newton’s Laws, and more.',
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20'
  },
  {
    id: 'unit-circle-trig',
    title: 'Unit Circle & Trig',
    icon: CircleDot,
    desc: 'Interactive trigonometry tool.',
    color: 'text-pink-500',
    bg: 'bg-pink-50 dark:bg-pink-900/20'
  }
];

const AdvancedMathScience: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
      <SEO 
        title="Advanced Math & Science Calculators"
        description="Comprehensive tools for calculus, physics formulas, trigonometry, statistics, and differential equations. Designed for students and engineers."
        keywords={['calculus calculator', 'integral solver', 'derivative calculator', 'physics formulas', 'trigonometry', 'fourier transform', 'laplace transform']}
      />

      <div className="text-center max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
          Advanced Math & Science Tools
        </h1>
        <p className="text-slate-600 dark:text-slate-300">
          Select a tool below to perform complex calculations. 
          Scientific accuracy for students, engineers, and researchers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        {tools.map((tool) => (
          <Link 
            key={tool.id} 
            to={`/advanced-math/${tool.id}`}
            className="group flex flex-col p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-lg ${tool.bg} ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
              <tool.icon className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              {tool.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {tool.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdvancedMathScience;