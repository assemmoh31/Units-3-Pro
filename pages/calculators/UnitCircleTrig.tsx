import React, { useState, useEffect } from 'react';
import CalculatorLayout, { useCalculatorHistory } from '../../components/CalculatorLayout';
import { CircleDot, Copy } from 'lucide-react';
import * as math from 'mathjs';
import SEO from '../../components/SEO';

const UnitCircleTrig: React.FC = () => {
  const [angle, setAngle] = useState(0); // in degrees
  const [rad, setRad] = useState(0);
  const [sin, setSin] = useState(0);
  const [cos, setCos] = useState(1);
  const [tan, setTan] = useState(0);
  
  const { history, addToHistory } = useCalculatorHistory('Trigonometry');

  useEffect(() => {
    const r = (angle * Math.PI) / 180;
    setRad(r);
    setSin(Math.sin(r));
    setCos(Math.cos(r));
    setTan(Math.tan(r));
  }, [angle]);

  const handleSave = () => {
    addToHistory(`${angle}°`, `sin:${sin.toFixed(4)}, cos:${cos.toFixed(4)}`);
  };

  // Convert coordinate to SVG position (center 100, 100, radius 80)
  const cx = 100 + 80 * cos;
  const cy = 100 - 80 * sin;

  return (
    <CalculatorLayout 
      title="Unit Circle & Trigonometry" 
      icon={<CircleDot className="w-6 h-6" />}
      history={history}
    >
      <SEO 
        title="Interactive Unit Circle Calculator"
        description="Explore trigonometry with an interactive unit circle. Calculate Sine, Cosine, and Tangent values for any angle."
        keywords={['unit circle', 'trigonometry calculator', 'sine', 'cosine', 'tangent', 'math tool']}
      />
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Visual Unit Circle */}
        <div className="relative w-64 h-64 shrink-0">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
             {/* Grid */}
             <line x1="0" y1="100" x2="200" y2="100" stroke="#cbd5e1" strokeWidth="1" />
             <line x1="100" y1="0" x2="100" y2="200" stroke="#cbd5e1" strokeWidth="1" />
             {/* Circle */}
             <circle cx="100" cy="100" r="80" fill="none" stroke="#6366f1" strokeWidth="2" />
             {/* Angle Line */}
             <line x1="100" y1="100" x2={cx} y2={cy} stroke="#ef4444" strokeWidth="2" />
             {/* Point */}
             <circle cx={cx} cy={cy} r="5" fill="#ef4444" />
             {/* Angle Arc (Simplified) */}
             <path d={`M 130 100 A 30 30 0 ${angle > 180 ? 1 : 0} 0 ${100 + 30 * Math.cos(-rad)} ${100 + 30 * Math.sin(-rad)}`} fill="none" stroke="#ec4899" strokeWidth="2" opacity={angle > 0 ? 1 : 0}/>
          </svg>
        </div>

        <div className="flex-grow w-full space-y-6">
           <div>
             <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
               Angle: <span className="text-primary-600 font-bold">{angle}°</span> / <span className="text-primary-600 font-bold">{rad.toFixed(2)} rad</span>
             </label>
             <input 
               type="range" 
               min="0" 
               max="360" 
               value={angle} 
               onChange={(e) => setAngle(parseInt(e.target.value))}
               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
             />
           </div>

           <div className="grid grid-cols-3 gap-4">
             <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-xs text-slate-500 uppercase">SIN</div>
                <div className="text-lg font-mono font-bold text-slate-800 dark:text-white">{sin.toFixed(4)}</div>
             </div>
             <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-xs text-slate-500 uppercase">COS</div>
                <div className="text-lg font-mono font-bold text-slate-800 dark:text-white">{cos.toFixed(4)}</div>
             </div>
             <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                <div className="text-xs text-slate-500 uppercase">TAN</div>
                <div className="text-lg font-mono font-bold text-slate-800 dark:text-white">
                  {Math.abs(tan) > 100 ? '∞' : tan.toFixed(4)}
                </div>
             </div>
           </div>

           <button 
             onClick={handleSave}
             className="w-full py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
           >
             Save Result
           </button>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default UnitCircleTrig;