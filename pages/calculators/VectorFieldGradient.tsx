import React, { useState } from 'react';
import CalculatorLayout, { useCalculatorHistory } from '../../components/CalculatorLayout';
import { Move3d, ArrowRight } from 'lucide-react';
import * as math from 'mathjs';
import SEO from '../../components/SEO';

const VectorFieldGradient: React.FC = () => {
  const [expression, setExpression] = useState('x^2 * y + z');
  const [variables, setVariables] = useState('x, y, z');
  const [result, setResult] = useState<string[]>([]);
  
  const { history, addToHistory } = useCalculatorHistory('Vector');

  const calculateGradient = () => {
    try {
      const vars = variables.split(',').map(v => v.trim()).filter(v => v);
      if (vars.length === 0) return;

      const gradientComponents = vars.map(v => {
        try {
          const d = math.derivative(expression, v);
          return d.toString();
        } catch (e) {
          return 'error';
        }
      });

      setResult(gradientComponents);
      addToHistory(`∇f where f=${expression}`, `[ ${gradientComponents.join(', ')} ]`);

    } catch (e: any) {
      alert("Error parsing expression.");
    }
  };

  return (
    <CalculatorLayout 
      title="Vector Field Gradient" 
      icon={<Move3d className="w-6 h-6" />}
      history={history}
    >
      <SEO 
        title="Gradient Vector Calculator"
        description="Compute the gradient vector ∇f of a scalar field f(x,y,z). Partial derivative calculator for multivariable calculus."
        keywords={['vector gradient', 'gradient calculator', 'multivariable calculus', 'partial derivative', 'vector field']}
      />
      <div className="space-y-8">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Scalar Field f({variables})
            </label>
            <input 
              type="text" 
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-lg focus:ring-2 focus:ring-cyan-500 outline-none"
              placeholder="e.g. x^2 + y^2"
            />
          </div>
          
          <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
               Variables (comma separated)
             </label>
             <input 
              type="text" 
              value={variables}
              onChange={(e) => setVariables(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
            />
          </div>

          <button 
            onClick={calculateGradient}
            className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg shadow-lg shadow-cyan-500/20 transition-colors"
          >
            Compute Gradient ∇f
          </button>
        </div>

        {result.length > 0 && (
          <div className="animate-fade-in bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
             <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
               Gradient Vector ∇f
             </h3>
             <div className="flex flex-col gap-2 font-mono text-lg">
                <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-2">
                   <span>[</span>
                   <span className="flex-grow text-center">Component Derivatives</span>
                   <span>]</span>
                </div>
                {result.map((comp, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                    <span className="w-8 text-cyan-600 dark:text-cyan-400 font-bold text-right">
                       ∂/∂{variables.split(',')[i]?.trim() || '?'}
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-300" />
                    <span className="text-slate-800 dark:text-slate-200 break-all">{comp}</span>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
};

export default VectorFieldGradient;