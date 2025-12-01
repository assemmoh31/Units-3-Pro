import React, { useState } from 'react';
import CalculatorLayout, { useCalculatorHistory } from '../../components/CalculatorLayout';
import { Activity, Play, RotateCcw, Copy } from 'lucide-react';
import * as math from 'mathjs';
import SEO from '../../components/SEO';

const DifferentialEquations: React.FC = () => {
  const [equation, setEquation] = useState('x - y'); // dy/dx = f(x, y)
  const [x0, setX0] = useState('0');
  const [y0, setY0] = useState('1');
  const [targetX, setTargetX] = useState('1');
  const [stepSize, setStepSize] = useState('0.1');
  const [result, setResult] = useState<string | null>(null);
  const [stepsData, setStepsData] = useState<Array<{x: number, y: number}>>([]);
  
  const { history, addToHistory } = useCalculatorHistory('Diff Eq');

  const solveODE = () => {
    try {
      const f = math.compile(equation);
      let x = parseFloat(x0);
      let y = parseFloat(y0);
      const xEnd = parseFloat(targetX);
      const h = parseFloat(stepSize);

      if (isNaN(x) || isNaN(y) || isNaN(xEnd) || isNaN(h) || h <= 0) {
        alert("Please enter valid numeric parameters.");
        return;
      }

      const steps = [];
      steps.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(6)) });

      // Runge-Kutta 4th Order
      const n = Math.ceil((xEnd - x) / h);
      
      for (let i = 0; i < n; i++) {
        // Prevent overshooting target due to float precision
        const currentH = (x + h > xEnd) ? xEnd - x : h;
        
        const k1 = currentH * f.evaluate({ x, y });
        const k2 = currentH * f.evaluate({ x: x + 0.5 * currentH, y: y + 0.5 * k1 });
        const k3 = currentH * f.evaluate({ x: x + 0.5 * currentH, y: y + 0.5 * k2 });
        const k4 = currentH * f.evaluate({ x: x + currentH, y: y + k3 });

        y = y + (k1 + 2*k2 + 2*k3 + k4) / 6;
        x = x + currentH;

        steps.push({ x: parseFloat(x.toFixed(4)), y: parseFloat(y.toFixed(6)) });
        if (x >= xEnd) break;
      }

      setResult(y.toFixed(6));
      setStepsData(steps);
      addToHistory(`y(${targetX}) for dy/dx=${equation}`, y.toFixed(6));
    } catch (e: any) {
      alert(`Error solving equation: ${e.message}`);
    }
  };

  return (
    <CalculatorLayout 
      title="Differential Equations (RK4 Solver)" 
      icon={<Activity className="w-6 h-6" />}
      history={history}
    >
      <SEO 
        title="Differential Equation Solver"
        description="Solve first-order ordinary differential equations (ODEs) numerically using the Runge-Kutta 4th Order (RK4) method."
        keywords={['differential equations', 'ode solver', 'runge kutta', 'calculus calculator', 'math tool']}
      />
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            First Order ODE: <span className="font-mono">dy/dx = f(x, y)</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-slate-500">f(x,y) =</span>
            <input 
              type="text" 
              value={equation}
              onChange={(e) => setEquation(e.target.value)}
              className="flex-grow px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono focus:ring-2 focus:ring-rose-500 outline-none"
              placeholder="e.g. x - y"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase">Initial X (x₀)</label>
            <input type="number" value={x0} onChange={e => setX0(e.target.value)} className="w-full p-2 mt-1 rounded border dark:border-slate-700 dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase">Initial Y (y₀)</label>
            <input type="number" value={y0} onChange={e => setY0(e.target.value)} className="w-full p-2 mt-1 rounded border dark:border-slate-700 dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase">Step Size (h)</label>
            <input type="number" value={stepSize} onChange={e => setStepSize(e.target.value)} className="w-full p-2 mt-1 rounded border dark:border-slate-700 dark:bg-slate-900" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase">Target X</label>
            <input type="number" value={targetX} onChange={e => setTargetX(e.target.value)} className="w-full p-2 mt-1 rounded border dark:border-slate-700 dark:bg-slate-900" />
          </div>
        </div>

        <div className="flex gap-4">
          <button onClick={solveODE} className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white font-medium rounded-lg shadow-lg shadow-rose-500/20 flex justify-center items-center gap-2 transition-colors">
            <Play className="w-4 h-4" /> Solve
          </button>
          <button onClick={() => { setStepsData([]); setResult(null); }} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {result && (
          <div className="space-y-4 animate-fade-in">
            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 rounded-xl">
               <div className="text-sm text-rose-600 dark:text-rose-400 font-medium mb-1">Result at x = {targetX}</div>
               <div className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                 y ≈ {result}
                 <button onClick={() => navigator.clipboard.writeText(result)} className="p-1 hover:bg-white/50 rounded"><Copy className="w-4 h-4 opacity-50" /></button>
               </div>
            </div>

            <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-slate-500 font-medium">Step</th>
                    <th className="px-4 py-2 text-slate-500 font-medium">x</th>
                    <th className="px-4 py-2 text-slate-500 font-medium">y</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-900">
                  {stepsData.map((pt, i) => (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-4 py-1 text-slate-400">{i}</td>
                      <td className="px-4 py-1 font-mono text-slate-700 dark:text-slate-300">{pt.x}</td>
                      <td className="px-4 py-1 font-mono text-slate-900 dark:text-white font-medium">{pt.y}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
};

export default DifferentialEquations;