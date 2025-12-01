import React, { useState } from 'react';
import CalculatorLayout, { useCalculatorHistory } from '../../components/CalculatorLayout';
import { Sigma, Copy, Save } from 'lucide-react';
import * as math from 'mathjs';
import SEO from '../../components/SEO';

const IntegralDerivative: React.FC = () => {
  const [expression, setExpression] = useState('x^2 + 2*x');
  const [variable, setVariable] = useState('x');
  const [mode, setMode] = useState<'derivative' | 'integral'>('derivative');
  
  // Integration Params
  const [lowerLimit, setLowerLimit] = useState('0');
  const [upperLimit, setUpperLimit] = useState('1');
  const [intervals, setIntervals] = useState('100');

  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string>('');
  
  const { history, addToHistory } = useCalculatorHistory('Calculus');

  const calculate = () => {
    try {
      if (mode === 'derivative') {
        const d = math.derivative(expression, variable);
        setResult(d.toString());
        setSteps(`d/d${variable} [ ${expression} ]`);
        addToHistory(`Derivative of ${expression}`, d.toString());
      } else {
        // Numeric Integration using Simpson's Rule
        const f = math.compile(expression);
        const a = parseFloat(lowerLimit);
        const b = parseFloat(upperLimit);
        const n = parseInt(intervals);

        if (isNaN(a) || isNaN(b) || isNaN(n) || n <= 0 || n % 2 !== 0) {
          setResult("Error: Ensure limits are numbers and N is an even integer > 0.");
          return;
        }

        const h = (b - a) / n;
        let sum = f.evaluate({ [variable]: a }) + f.evaluate({ [variable]: b });

        for (let i = 1; i < n; i++) {
          const x = a + i * h;
          const val = f.evaluate({ [variable]: x });
          if (i % 2 === 0) sum += 2 * val;
          else sum += 4 * val;
        }

        const integralVal = (h / 3) * sum;
        setResult(integralVal.toFixed(6));
        setSteps(`∫ from ${a} to ${b} of (${expression}) dx ≈ using Simpson's 1/3 Rule (n=${n})`);
        addToHistory(`Integral of ${expression} [${a}, ${b}]`, integralVal.toFixed(6));
      }
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    }
  };

  const handleSave = () => {
    // Logic handled in calculate for history, this might be redundant or used for external save
  };

  const handleCopy = () => {
    if (result) navigator.clipboard.writeText(result);
  };

  return (
    <CalculatorLayout 
      title="Integral & Derivative" 
      icon={<Sigma className="w-6 h-6" />}
      history={history}
    >
      <SEO 
        title="Symbolic Derivative & Definite Integral Calculator"
        description="Compute derivatives and definite integrals instantly. Supports symbolic differentiation and numeric integration (Simpson's Rule)."
        keywords={['derivative calculator', 'integral calculator', 'calculus', 'definite integral', 'differentiation', 'math tool']}
      />

      <div className="space-y-6">
        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-900/50 p-1">
          <button 
            onClick={() => { setMode('derivative'); setResult(''); setSteps(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'derivative' ? 'bg-white dark:bg-slate-700 shadow text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Symbolic Derivative
          </button>
          <button 
            onClick={() => { setMode('integral'); setResult(''); setSteps(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${mode === 'integral' ? 'bg-white dark:bg-slate-700 shadow text-primary-600 dark:text-primary-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Numeric Integral
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Function f({variable})</label>
          <input 
            type="text" 
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-mono"
            placeholder="e.g., x^2 + sin(x)"
          />
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <div className="w-24 space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Variable</label>
            <input 
              type="text" 
              value={variable}
              onChange={(e) => setVariable(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-mono"
              placeholder="x"
            />
          </div>

          {mode === 'integral' && (
            <>
              <div className="w-24 space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Start (a)</label>
                <input 
                  type="text" 
                  value={lowerLimit}
                  onChange={(e) => setLowerLimit(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-mono"
                />
              </div>
              <div className="w-24 space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">End (b)</label>
                <input 
                  type="text" 
                  value={upperLimit}
                  onChange={(e) => setUpperLimit(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-mono"
                />
              </div>
              <div className="w-24 space-y-2">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300" title="Must be even">Sub-int (N)</label>
                 <input 
                   type="number" 
                   value={intervals}
                   onChange={(e) => setIntervals(e.target.value)}
                   className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all font-mono"
                 />
              </div>
            </>
          )}

          <button 
            onClick={calculate}
            className="flex-grow px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/20"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Result</span>
              <div className="flex gap-2">
                 <button onClick={handleCopy} className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors" title="Copy">
                   <Copy className="w-4 h-4" />
                 </button>
                 <button className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-white dark:hover:bg-slate-800 rounded transition-colors" title="Saved to History">
                   <Save className="w-4 h-4" />
                 </button>
              </div>
            </div>
            <div className="mb-2 text-sm text-slate-500 dark:text-slate-400 font-mono">
              {steps}
            </div>
            <div className="text-xl sm:text-2xl font-mono text-slate-900 dark:text-white break-all font-bold">
              {result}
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
};

export default IntegralDerivative;