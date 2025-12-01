import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import HealthLayout, { useHealthHistory } from '../../components/HealthLayout';
import { healthCalculators, HealthCalculatorConfig } from '../../utils/health-data';
import { Copy, Save, Info, Maximize2, ChevronDown } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import SEO from '../../components/SEO';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// --- Visual Components ---

const BMIScaleDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    const value = Math.min(40, Math.max(10, data.value));
    const percent = ((value - 10) / 30) * 100;
    
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div className="w-full relative h-12 mb-2">
                <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none" className="rounded-full overflow-hidden">
                    <defs>
                        <linearGradient id="bmiGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#60a5fa" />
                            <stop offset="18.5%" stopColor="#60a5fa" />
                            <stop offset="18.5%" stopColor="#10b981" />
                            <stop offset="50%" stopColor="#10b981" />
                            <stop offset="50%" stopColor="#fbbf24" />
                            <stop offset="66%" stopColor="#fbbf24" />
                            <stop offset="66%" stopColor="#ef4444" />
                            <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                    </defs>
                    <rect x="0" y="0" width="100" height="20" fill="url(#bmiGradient)" />
                </svg>
                {/* Marker */}
                <div 
                    className="absolute top-0 h-full w-1 bg-black dark:bg-white shadow-[0_0_5px_rgba(0,0,0,0.5)] transition-all duration-500"
                    style={{ left: `${percent}%` }}
                ></div>
            </div>
            <div className="flex justify-between w-full text-xs text-slate-400 px-1">
                <span>10</span>
                <span>18.5</span>
                <span>25</span>
                <span>30</span>
                <span>40</span>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-800 dark:text-white">BMI {data.value.toFixed(1)}</div>
        </div>
    );
};

const GaugeVisual = ({ data }: { data: any }) => {
    if(!data) return null;
    const { value, max } = data;
    const rotation = Math.min(180, Math.max(0, (value / max) * 180));
    
    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-6">
            <div className="relative w-48 h-24 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full rounded-t-full bg-slate-200 dark:bg-slate-700"></div>
                {/* Needle */}
                <div 
                    className="absolute bottom-0 left-1/2 w-1 h-full bg-slate-800 dark:bg-white origin-bottom-center transition-transform duration-1000 ease-out"
                    style={{ transform: `rotate(${rotation - 90}deg)` }}
                ></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-slate-800 dark:bg-white rounded-full z-10"></div>
            </div>
            <div className="mt-4 text-3xl font-bold text-slate-800 dark:text-white">{value}</div>
        </div>
    )
}

const TimelineVisual = ({ data }: { data: any }) => {
    if(!data) return null;
    const { total, current } = data;
    const pct = Math.min(100, Math.max(0, (current / total) * 100));
    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8">
            <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                <div className="h-full bg-pink-500 transition-all duration-1000 ease-out" style={{ width: `${pct}%` }}></div>
            </div>
            <div className="flex justify-between w-full mt-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                <span>Conception</span>
                <span>Due Date</span>
            </div>
            <div className="mt-4 text-xl font-bold text-pink-600 dark:text-pink-400">Week {current} of {total}</div>
        </div>
    )
}

const WaterVisual = ({ data }: { data: any }) => {
    if(!data) return null;
    const glasses = Math.round(data.value * 4); // assume 250ml glass
    return (
        <div className="h-full w-full flex flex-wrap items-center justify-center gap-2 p-6 content-center">
            {Array.from({length: glasses}).map((_, i) => (
                <div key={i} className="w-8 h-12 bg-cyan-400 rounded-sm opacity-80 border-b-4 border-cyan-600"></div>
            ))}
            <div className="w-full text-center mt-4 text-lg font-bold text-cyan-600 dark:text-cyan-400">{data.value} Liters</div>
        </div>
    )
}

const HealthCalculator: React.FC = () => {
  const { calculatorId, category } = useParams<{ calculatorId: string, category: string }>();
  const config = healthCalculators[calculatorId || 'bmi'] as HealthCalculatorConfig;
  const { history, addToHistory, clearHistory } = useHealthHistory();

  const [inputs, setInputs] = useState<Record<string, any>>({});
  
  useEffect(() => {
    if(config) {
        const defaults: Record<string, any> = {};
        config.inputs.forEach(i => {
            defaults[i.name] = i.defaultValue;
        });
        setInputs(defaults);
    }
  }, [config?.id]);

  const result = useMemo(() => {
      try {
          if (!config) return null;
          return config.calculate(inputs);
      } catch(e) {
          return null;
      }
  }, [inputs, config]);

  const handleInputChange = (name: string, val: string | number) => {
      setInputs(prev => ({ ...prev, [name]: val }));
  };

  const handleSave = () => {
     if(result && config) {
         const details = config.inputs.map(i => {
             const unit = i.unit ? ` ${i.unit}` : '';
             return `${i.label}: ${inputs[i.name]}${unit}`;
         }).join('\n');
         addToHistory(config.title, `${result.value} ${result.unit}`, details);
     }
  };

  if(!config) return <div className="p-10 text-center">Calculator not found</div>;

  const Icon = config.icon;

  return (
    <HealthLayout 
        title={config.title} 
        category={config.category} 
        icon={<Icon className="w-6 h-6" />} 
        history={history}
        onClear={clearHistory}
    >
        <SEO 
          title={config.title} 
          description={config.description} 
          keywords={[config.category, 'health', 'calculator', 'fitness', 'wellness']} 
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Panel */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Your Data</span>
                    </div>
                    <div className="p-5 space-y-5">
                        {config.inputs.map(input => (
                            <div key={input.name} className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    {input.label}
                                </label>
                                
                                {input.type === 'select' && input.options ? (
                                    <div className="relative">
                                        <select
                                            value={inputs[input.name] ?? ''}
                                            onChange={(e) => handleInputChange(input.name, e.target.value)}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg appearance-none outline-none focus:ring-2 focus:ring-rose-500 text-sm font-medium text-slate-800 dark:text-white transition-all shadow-sm"
                                        >
                                            {input.options.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                ) : input.type === 'gender' ? (
                                    <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                                        <button 
                                            onClick={() => handleInputChange(input.name, 'male')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${inputs[input.name] === 'male' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500'}`}
                                        >
                                            Male
                                        </button>
                                        <button 
                                            onClick={() => handleInputChange(input.name, 'female')}
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${inputs[input.name] === 'female' ? 'bg-white dark:bg-slate-700 text-pink-600 dark:text-pink-400 shadow-sm' : 'text-slate-500'}`}
                                        >
                                            Female
                                        </button>
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input 
                                            type="number"
                                            value={inputs[input.name] ?? ''}
                                            onChange={(e) => handleInputChange(input.name, parseFloat(e.target.value))}
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-rose-500 font-mono text-sm text-slate-900 dark:text-white shadow-sm"
                                            placeholder={input.placeholder}
                                            min={input.min}
                                            max={input.max}
                                        />
                                        {input.unit && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 pointer-events-none">{input.unit}</div>}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Visualizer Area */}
                <div className="flex-grow bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden min-h-[300px] flex items-center justify-center relative">
                    <div className="absolute top-3 left-4 z-10">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                             Analysis
                         </span>
                    </div>
                    
                    {result?.chart?.type === 'bmi-scale' && <BMIScaleDiagram data={result.chart.data} />}
                    {result?.chart?.type === 'gauge' && <GaugeVisual data={result.chart.data} />}
                    {result?.chart?.type === 'timeline' && <TimelineVisual data={result.chart.data} />}
                    {result?.chart?.type === 'water' && <WaterVisual data={result.chart.data} />}
                    
                    {result?.chart?.type === 'bar' && result.chart.data && (
                         <div className="w-full h-full p-6 pt-10">
                            <Bar 
                               data={{
                                 labels: result.chart.data.map((d: any) => d.label),
                                 datasets: [{
                                   label: 'Value',
                                   data: result.chart.data.map((d: any) => d.value),
                                   backgroundColor: result.chart.data.map((d: any) => d.color || '#f43f5e'),
                                   borderRadius: 4
                                 }]
                               }}
                               options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
                            />
                         </div>
                    )}
                    {result?.chart?.type === 'pie' && result.chart.data && (
                         <div className="w-full h-full p-6 pt-10 max-w-sm mx-auto">
                            <Pie 
                               data={{
                                 labels: result.chart.data.map((d: any) => d.label),
                                 datasets: [{
                                   data: result.chart.data.map((d: any) => d.value),
                                   backgroundColor: result.chart.data.map((d: any) => d.color),
                                   borderWidth: 0
                                 }]
                               }}
                               options={{ responsive: true, maintainAspectRatio: false }} 
                            />
                         </div>
                    )}

                    {!result?.chart && (
                        <div className="text-slate-400 text-sm flex flex-col items-center gap-2">
                            <Maximize2 className="w-8 h-8 opacity-20"/>
                            <span>Enter data to visualize</span>
                        </div>
                    )}
                </div>

                {/* Primary Result Box */}
                <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
                    <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <div className="text-xs font-bold text-rose-100 uppercase tracking-widest mb-1">Result</div>
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight">
                                   {result?.value || '---'}
                                </span>
                                <span className="text-xl text-rose-100 font-medium">{result?.unit}</span>
                            </div>
                            {result?.category && (
                                <div className="mt-2 inline-flex px-3 py-1 rounded-full bg-white/20 text-sm font-bold backdrop-blur-sm">
                                    {result.category}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button onClick={() => navigator.clipboard.writeText(result?.value || '')} className="flex-1 sm:flex-none p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white backdrop-blur-sm" title="Copy">
                                <Copy className="w-5 h-5 mx-auto" />
                            </button>
                            <button onClick={handleSave} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-rose-600 hover:bg-rose-50 font-bold text-sm uppercase rounded-xl shadow-lg transition-colors">
                                <Save className="w-4 h-4" /> Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details List */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                     <h3 className="font-bold text-slate-700 dark:text-slate-200 text-xs uppercase mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Analysis</h3>
                     <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                         {result?.details.map((line, i) => (
                             <div key={i} className="flex gap-2 items-start">
                                 <Info className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                                 <span>{line}</span>
                             </div>
                         ))}
                         {(!result?.details || result.details.length === 0) && <div className="italic text-slate-400">No additional details</div>}
                     </div>
                </div>

            </div>
        </div>
    </HealthLayout>
  );
};

export default HealthCalculator;
