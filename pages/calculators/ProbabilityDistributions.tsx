import React, { useState } from 'react';
import CalculatorLayout, { useCalculatorHistory } from '../../components/CalculatorLayout';
import { BarChart3 } from 'lucide-react';
import * as math from 'mathjs';
import SEO from '../../components/SEO';

const ProbabilityDistributions: React.FC = () => {
  const [distType, setDistType] = useState<'normal' | 'binomial' | 'poisson'>('normal');
  
  // Params
  const [mean, setMean] = useState('0'); // mu
  const [stdDev, setStdDev] = useState('1'); // sigma
  const [n, setN] = useState('10'); // trials
  const [p, setP] = useState('0.5'); // probability
  const [lambda, setLambda] = useState('5'); // rate
  const [x, setX] = useState('0'); // query point

  const [pdfResult, setPdfResult] = useState<string | null>(null);
  const [cdfResult, setCdfResult] = useState<string | null>(null);

  const { history, addToHistory } = useCalculatorHistory('Probability');

  const calculate = () => {
    const valX = parseFloat(x);
    
    try {
      if (distType === 'normal') {
        const mu = parseFloat(mean);
        const sigma = parseFloat(stdDev);
        
        // PDF: (1 / (sigma * sqrt(2pi))) * exp(-0.5 * ((x-mu)/sigma)^2)
        const pdf = (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((valX - mu) / sigma, 2));
        
        // CDF: 0.5 * (1 + erf((x - mu) / (sigma * sqrt(2))))
        const cdf = 0.5 * (1 + math.erf((valX - mu) / (sigma * Math.sqrt(2))));

        setPdfResult(pdf.toFixed(6));
        setCdfResult(cdf.toFixed(6));
        addToHistory(`Normal(μ=${mu}, σ=${sigma}) at x=${valX}`, `PDF:${pdf.toFixed(4)} CDF:${cdf.toFixed(4)}`);
      } 
      else if (distType === 'binomial') {
        const valN = parseInt(n);
        const valP = parseFloat(p);
        const k = Math.floor(valX);

        if (k < 0 || k > valN) {
           setPdfResult("0");
           setCdfResult(k < 0 ? "0" : "1");
           return;
        }

        // PDF: nCk * p^k * (1-p)^(n-k)
        const combinations = math.combinations(valN, k);
        const prob = combinations * Math.pow(valP, k) * Math.pow(1 - valP, valN - k);

        // CDF: sum(PDF(i)) for i=0 to k
        let cumProb = 0;
        for(let i=0; i<=k; i++) {
           const comb = math.combinations(valN, i);
           cumProb += comb * Math.pow(valP, i) * Math.pow(1 - valP, valN - i);
        }

        setPdfResult(prob.toFixed(6));
        setCdfResult(cumProb.toFixed(6));
        addToHistory(`Binomial(n=${valN}, p=${valP}) at k=${k}`, `P(X=k):${prob.toFixed(4)}`);
      }
      else if (distType === 'poisson') {
        const lam = parseFloat(lambda);
        const k = Math.floor(valX);

        if (k < 0) {
           setPdfResult("0");
           setCdfResult("0");
           return;
        }

        // PDF: (lambda^k * e^-lambda) / k!
        const pdf = (Math.pow(lam, k) * Math.exp(-lam)) / math.factorial(k);
        
        // CDF sum
        let cumProb = 0;
        for(let i=0; i<=k; i++) {
           cumProb += (Math.pow(lam, i) * Math.exp(-lam)) / math.factorial(i);
        }

        setPdfResult(pdf.toFixed(6));
        setCdfResult(cumProb.toFixed(6));
        addToHistory(`Poisson(λ=${lam}) at k=${k}`, `P(X=k):${pdf.toFixed(4)}`);
      }
    } catch (e: any) {
      alert("Error in calculation: " + e.message);
    }
  };

  return (
    <CalculatorLayout 
      title="Probability Distributions" 
      icon={<BarChart3 className="w-6 h-6" />}
      history={history}
    >
      <SEO 
        title="Probability Distributions Calculator"
        description="Calculate PDF and CDF for Normal, Binomial, and Poisson distributions. Essential tool for statistics."
        keywords={['probability calculator', 'normal distribution', 'binomial distribution', 'poisson', 'statistics']}
      />
      <div className="space-y-8">
        <div className="flex rounded-lg bg-slate-100 dark:bg-slate-900/50 p-1">
          {['normal', 'binomial', 'poisson'].map((type) => (
             <button 
               key={type}
               onClick={() => { setDistType(type as any); setPdfResult(null); setCdfResult(null); }}
               className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${distType === type ? 'bg-white dark:bg-slate-700 shadow text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
             >
               {type}
             </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inputs Section */}
          <div className="space-y-4">
             {distType === 'normal' && (
               <>
                 <div><label className="text-sm font-medium text-slate-500">Mean (μ)</label><input type="number" value={mean} onChange={e=>setMean(e.target.value)} className="w-full p-2 rounded border dark:border-slate-700 dark:bg-slate-900" /></div>
                 <div><label className="text-sm font-medium text-slate-500">Std Dev (σ)</label><input type="number" value={stdDev} onChange={e=>setStdDev(e.target.value)} className="w-full p-2 rounded border dark:border-slate-700 dark:bg-slate-900" /></div>
               </>
             )}
             {distType === 'binomial' && (
               <>
                 <div><label className="text-sm font-medium text-slate-500">Trials (n)</label><input type="number" value={n} onChange={e=>setN(e.target.value)} className="w-full p-2 rounded border dark:border-slate-700 dark:bg-slate-900" /></div>
                 <div><label className="text-sm font-medium text-slate-500">Prob (p)</label><input type="number" value={p} onChange={e=>setP(e.target.value)} className="w-full p-2 rounded border dark:border-slate-700 dark:bg-slate-900" /></div>
               </>
             )}
             {distType === 'poisson' && (
               <div><label className="text-sm font-medium text-slate-500">Lambda (λ)</label><input type="number" value={lambda} onChange={e=>setLambda(e.target.value)} className="w-full p-2 rounded border dark:border-slate-700 dark:bg-slate-900" /></div>
             )}
             
             <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                <label className="text-sm font-medium text-slate-900 dark:text-white">Evaluate at x =</label>
                <input type="number" value={x} onChange={e=>setX(e.target.value)} className="w-full p-2 mt-1 rounded border dark:border-slate-700 dark:bg-slate-900" />
             </div>

             <button onClick={calculate} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/20 transition-colors">
               Calculate
             </button>
          </div>

          {/* Results Section */}
          <div className="flex flex-col justify-center space-y-4">
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Probability Density (PDF)</h4>
               <div className="text-3xl font-bold text-slate-800 dark:text-white">
                 {pdfResult === null ? '—' : pdfResult}
               </div>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm">
               <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Cumulative Dist. (CDF)</h4>
               <div className="text-3xl font-bold text-slate-800 dark:text-white">
                 {cdfResult === null ? '—' : cdfResult}
               </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default ProbabilityDistributions;