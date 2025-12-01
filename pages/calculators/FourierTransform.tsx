import React, { useState } from 'react';
import CalculatorLayout, { useCalculatorHistory } from '../../components/CalculatorLayout';
import { Waves, BarChart2 } from 'lucide-react';
import * as math from 'mathjs';
import SEO from '../../components/SEO';

const FourierTransform: React.FC = () => {
  const [inputData, setInputData] = useState('1, 0, 1, 0, 1, 0, 1, 0');
  const [result, setResult] = useState<any[]>([]);
  const { history, addToHistory } = useCalculatorHistory('Fourier');

  const calculateDFT = () => {
    try {
      // Parse input
      const data = inputData.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
      if (data.length === 0) {
        alert("Please enter valid comma-separated numbers.");
        return;
      }

      const N = data.length;
      const output = [];

      // Basic DFT Algorithm: X_k = sum_{n=0}^{N-1} x_n * exp(-i * 2pi * k * n / N)
      for (let k = 0; k < N; k++) {
        let real = 0;
        let imag = 0;
        for (let n = 0; n < N; n++) {
          const theta = (2 * Math.PI * k * n) / N;
          real += data[n] * Math.cos(theta);
          imag -= data[n] * Math.sin(theta);
        }
        const magnitude = Math.sqrt(real * real + imag * imag);
        const phase = Math.atan2(imag, real);
        
        output.push({ k, real, imag, magnitude, phase });
      }

      setResult(output);
      addToHistory(`DFT of [${data.slice(0, 3).join(',')}...]`, `Size: ${N}`);
    } catch (e: any) {
      alert("Error parsing input data");
    }
  };

  return (
    <CalculatorLayout 
      title="Discrete Fourier Transform (DFT)" 
      icon={<Waves className="w-6 h-6" />}
      history={history}
    >
      <SEO 
        title="Fourier Transform Calculator"
        description="Compute the Discrete Fourier Transform (DFT) of a signal. Analyze frequency, magnitude, and phase components."
        keywords={['fourier transform', 'dft calculator', 'signal processing', 'frequency analysis', 'spectral analysis']}
      />
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Input Signal (comma separated real numbers)
          </label>
          <textarea 
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            className="w-full h-24 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="e.g. 1.0, 0.5, -0.5, ..."
          />
        </div>

        <button 
          onClick={calculateDFT}
          className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 flex justify-center items-center gap-2 transition-colors"
        >
          <BarChart2 className="w-4 h-4" /> Compute Spectrum
        </button>

        {result.length > 0 && (
          <div className="animate-fade-in overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
             <div className="bg-slate-50 dark:bg-slate-800 p-4 border-b border-slate-200 dark:border-slate-700">
               <h3 className="font-semibold text-slate-700 dark:text-slate-300">Frequency Domain Output</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase font-medium text-xs">
                   <tr>
                     <th className="px-4 py-3">k (Freq)</th>
                     <th className="px-4 py-3">Real</th>
                     <th className="px-4 py-3">Imag</th>
                     <th className="px-4 py-3">Magnitude</th>
                     <th className="px-4 py-3">Phase (rad)</th>
                   </tr>
                 </thead>
                 <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                   {result.map((row) => (
                     <tr key={row.k} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                       <td className="px-4 py-2 font-medium text-slate-900 dark:text-white">{row.k}</td>
                       <td className="px-4 py-2 font-mono text-slate-600 dark:text-slate-400">{row.real.toFixed(4)}</td>
                       <td className="px-4 py-2 font-mono text-slate-600 dark:text-slate-400">{row.imag.toFixed(4)}j</td>
                       <td className="px-4 py-2 font-bold text-indigo-600 dark:text-indigo-400">{row.magnitude.toFixed(4)}</td>
                       <td className="px-4 py-2 text-slate-500">{row.phase.toFixed(4)}</td>
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

export default FourierTransform;