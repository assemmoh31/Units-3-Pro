import React, { useState } from 'react';
import CalculatorLayout, { useCalculatorHistory } from '../../components/CalculatorLayout';
import { Zap, Copy, Save } from 'lucide-react';
import SEO from '../../components/SEO';

const PhysicsFormulas: React.FC = () => {
  const [category, setCategory] = useState<'kinematics' | 'newton'>('kinematics');
  
  // Kinematics State
  const [v, setV] = useState('');
  const [u, setU] = useState('');
  const [a, setA] = useState('');
  const [t, setT] = useState('');
  const [result, setResult] = useState('');
  
  const { history, addToHistory } = useCalculatorHistory('Physics');

  const calculateKinematics = () => {
    // v = u + at
    const valV = parseFloat(v);
    const valU = parseFloat(u);
    const valA = parseFloat(a);
    const valT = parseFloat(t);

    if (!isNaN(valU) && !isNaN(valA) && !isNaN(valT) && isNaN(valV)) {
      const res = valU + valA * valT;
      setResult(`v = ${res} m/s`);
      addToHistory(`v = u + at`, `${res}`);
    } else if (!isNaN(valV) && !isNaN(valU) && !isNaN(valA) && isNaN(valT)) {
       const res = (valV - valU) / valA;
       setResult(`t = ${res} s`);
       addToHistory(`t = (v-u)/a`, `${res}`);
    } else {
      setResult("Please leave exactly one field empty to calculate it.");
    }
  };

  const handleCopy = () => {
    if (result) navigator.clipboard.writeText(result);
  };

  return (
    <CalculatorLayout 
      title="Physics Formulas" 
      icon={<Zap className="w-6 h-6" />}
      history={history}
    >
      <SEO 
        title="Physics Formulas Calculator"
        description="Solve basic physics problems using Kinematic equations and Newton's laws of motion."
        keywords={['physics calculator', 'kinematics', 'newton law', 'acceleration', 'velocity', 'force']}
      />
       <div className="space-y-6">
        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-900/50 p-1">
          <button 
            onClick={() => { setCategory('kinematics'); setResult(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${category === 'kinematics' ? 'bg-white dark:bg-slate-700 shadow text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Kinematics
          </button>
          <button 
            onClick={() => { setCategory('newton'); setResult(''); }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${category === 'newton' ? 'bg-white dark:bg-slate-700 shadow text-amber-600 dark:text-amber-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            Newton's Law (F=ma)
          </button>
        </div>

        {category === 'kinematics' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Initial Velocity (u)</label>
              <input type="number" value={u} onChange={e => setU(e.target.value)} className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 dark:bg-slate-900" placeholder="m/s" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Final Velocity (v)</label>
              <input type="number" value={v} onChange={e => setV(e.target.value)} className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 dark:bg-slate-900" placeholder="m/s" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Acceleration (a)</label>
              <input type="number" value={a} onChange={e => setA(e.target.value)} className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 dark:bg-slate-900" placeholder="m/s²" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-500">Time (t)</label>
              <input type="number" value={t} onChange={e => setT(e.target.value)} className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 dark:bg-slate-900" placeholder="s" />
            </div>
          </div>
        )}

        <button 
            onClick={calculateKinematics}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors shadow-lg shadow-amber-500/20"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center animate-fade-in">
            <span className="font-mono text-lg text-slate-800 dark:text-slate-200">{result}</span>
             <button onClick={handleCopy} className="p-1.5 text-slate-400 hover:text-amber-500 transition-colors">
                <Copy className="w-4 h-4" />
             </button>
          </div>
        )}
       </div>
    </CalculatorLayout>
  );
};

export default PhysicsFormulas;