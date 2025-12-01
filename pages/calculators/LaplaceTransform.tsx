import React, { useState } from 'react';
import CalculatorLayout, { useCalculatorHistory } from '../../components/CalculatorLayout';
import { Binary, ArrowRight } from 'lucide-react';
import SEO from '../../components/SEO';

const LaplaceTransform: React.FC = () => {
  const [input, setInput] = useState('t^2 + 3*t');
  const [result, setResult] = useState('');
  const { history, addToHistory } = useCalculatorHistory('Laplace');

  // Basic Symbolic Solver using pattern matching
  // Note: A full solver requires a Computer Algebra System (CAS).
  const solveLaplace = () => {
    let expr = input.replace(/\s+/g, '');
    let outputParts: string[] = [];
    
    // Split by '+' (naive splitting, doesn't handle nested parentheses well, but good for simple sums)
    // We assume input is a sum of terms.
    const terms = expr.split('+');

    try {
      terms.forEach(term => {
        let coeff = 1;
        let func = term;
        
        // Extract coefficient if present (e.g., 3*t or 5t)
        // Matches "3*" or "3" at start
        const coeffMatch = term.match(/^(\d+(\.\d+)?)\*?/);
        if (coeffMatch) {
           coeff = parseFloat(coeffMatch[1]);
           func = term.substring(coeffMatch[0].length);
        }
        
        if (func === '' || func === '1') {
           // L{1} = 1/s
           outputParts.push(`${coeff}/s`);
        } 
        else if (func === 't') {
           // L{t} = 1/s^2
           outputParts.push(`${coeff}/s^2`);
        }
        else if (func.match(/^t\^(\d+)$/)) {
           // L{t^n} = n! / s^(n+1)
           const n = parseInt(func.match(/^t\^(\d+)$/)![1]);
           const fact = factorial(n);
           outputParts.push(`${coeff * fact}/s^${n + 1}`);
        }
        else if (func.match(/^e\^(\(?\w+\)?t)$/)) {
           // L{e^at} = 1/(s-a)
           // simplify: assume e^2t
           const power = func.match(/^e\^(\(?(\d+)?t\)?)$/)![1];
           const a = parseInt(power.replace('t', '')) || 1;
           outputParts.push(`${coeff}/(s - ${a})`);
        }
        else if (func.match(/^sin\((\d+)?t\)$/)) {
            // L{sin(at)} = a/(s^2 + a^2)
            const match = func.match(/^sin\((\d+)?t\)$/);
            const a = match![1] ? parseInt(match![1]) : 1;
            outputParts.push(`${coeff * a}/(s^2 + ${a*a})`);
        }
        else if (func.match(/^cos\((\d+)?t\)$/)) {
            // L{cos(at)} = s/(s^2 + a^2)
            const match = func.match(/^cos\((\d+)?t\)$/);
            const a = match![1] ? parseInt(match![1]) : 1;
            const num = coeff === 1 ? 's' : `${coeff}s`;
            outputParts.push(`${num}/(s^2 + ${a*a})`);
        }
        else {
            outputParts.push(`L{${func}}`);
        }
      });

      const finalRes = outputParts.join(' + ');
      setResult(finalRes);
      addToHistory(`L{ ${input} }`, finalRes);
    } catch (e) {
      setResult("Error parsing expression.");
    }
  };

  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  return (
    <CalculatorLayout 
      title="Laplace Transform" 
      icon={<Binary className="w-6 h-6" />}
      history={history}
    >
      <SEO 
        title="Laplace Transform Calculator"
        description="Convert time-domain functions to the s-domain. Supports polynomials, exponentials, and trigonometric functions."
        keywords={['laplace transform', 'calculus', 'differential equations', 's-domain', 'math solver']}
      />
      <div className="space-y-8">
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-900/50 rounded-lg text-sm text-purple-800 dark:text-purple-300">
           <strong>Supported formats:</strong> Constants, t, t^n, e^at, sin(at), cos(at). <br/>
           Combine with addition, e.g., <code>3*t^2 + 2*sin(3t)</code>
        </div>

        <div className="flex items-center gap-4 flex-col md:flex-row">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Time Domain f(t)
            </label>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-lg focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          <div className="hidden md:block pt-6 text-slate-400">
            <ArrowRight className="w-8 h-8" />
          </div>

          <div className="flex-1 w-full">
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
               Frequency Domain F(s)
             </label>
             <div className="w-full px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-lg min-h-[54px] flex items-center">
               {result}
             </div>
          </div>
        </div>

        <button 
          onClick={solveLaplace}
          className="w-full md:w-auto px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg shadow-lg shadow-purple-500/20 transition-colors"
        >
          Transform
        </button>
      </div>
    </CalculatorLayout>
  );
};

export default LaplaceTransform;