
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ChemistryLayout, { useChemistryHistory } from '../../components/ChemistryLayout';
import { chemistryCalculators, ChemistryCalculatorConfig } from '../../utils/chemistry-data';
import { Copy, Save, ChevronDown, RefreshCw, Settings2, Maximize2 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import SEO from '../../components/SEO';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Diagrams ---

const BeakerDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    const fillHeight = Math.min(100, Math.max(10, (data.fill ?? 0.5) * 100));
    const particles = Array.from({length: data.particles ?? 10});
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="w-32 h-40 border-b-4 border-l-4 border-r-4 border-slate-400 dark:border-slate-500 rounded-b-xl relative overflow-hidden bg-white/10">
                <div className="absolute bottom-0 w-full bg-cyan-400/30 transition-all duration-500 ease-in-out" style={{ height: `${fillHeight}%` }}>
                    <div className="absolute top-0 w-full h-1 bg-cyan-400/50"></div>
                </div>
                {particles.map((_, i) => (
                    <div key={i} className="absolute w-2 h-2 bg-cyan-600 rounded-full animate-bounce opacity-70"
                        style={{
                            bottom: `${Math.random() * (fillHeight-10)}%`,
                            left: `${Math.random() * 80 + 10}%`,
                            animationDuration: `${Math.random() * 2 + 1}s`,
                            animationDelay: `${Math.random()}s`
                        }}
                    ></div>
                ))}
                <div className="absolute bottom-2 w-full text-center text-xs font-bold text-cyan-800 dark:text-cyan-200">{data.label}</div>
            </div>
        </div>
    );
};

const GasDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    const speed = Math.max(0.5, Math.min(5, (data.t || 298)/100));
    // Determine box size relative to max V if provided, otherwise static
    const maxV = data.maxV || 100;
    const currentV = data.v || 22.4;
    const heightPct = Math.min(100, Math.max(20, (currentV / maxV) * 100));

    return (
        <div className="w-full h-full flex items-end justify-center p-6 relative">
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                 <div className="w-48 h-[200px] border-l-2 border-r-2 border-slate-300"></div>
             </div>
            <div 
                className="w-48 border-4 border-slate-500 relative bg-slate-100 dark:bg-slate-800 rounded-lg shadow-inner overflow-hidden transition-all duration-700 ease-out"
                style={{ height: `${heightPct}%` }}
            >
                {/* Piston Head */}
                <div className="absolute top-0 w-full h-2 bg-slate-600 shadow-md"></div>
                
                {Array.from({length: Math.min(20, Math.max(5, (data.n || 1) * 5))}).map((_,i) => (
                    <div key={i} className="absolute w-3 h-3 bg-red-500 rounded-full opacity-80"
                        style={{
                            top: `${Math.random() * 90}%`,
                            left: `${Math.random() * 90}%`,
                            animation: `float ${2/speed}s infinite linear alternate`
                        }}
                    ></div>
                ))}
                <div className="absolute top-4 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded font-mono">
                    P: {data.p?.toFixed(2)} atm
                </div>
                 <style>{`
                    @keyframes float {
                        0% { transform: translate(0,0); }
                        100% { transform: translate(${Math.random()*40-20}px, ${Math.random()*40-20}px); }
                    }
                `}</style>
            </div>
        </div>
    );
};

const EnergyProfileDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    const { ea, dh } = data; // ea (activation energy), dh (enthalpy change)
    
    // Scale for visualization
    const baseY = 150;
    const peakY = 150 - Math.min(100, ea);
    const finalY = 150 - Math.min(100, Math.max(-100, dh));
    
    return (
        <svg viewBox="0 0 300 200" className="w-full h-full">
            {/* Axes */}
            <line x1="40" y1="180" x2="280" y2="180" stroke="#94a3b8" strokeWidth="2" />
            <line x1="40" y1="180" x2="40" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <text x="20" y="100" transform="rotate(-90 20,100)" className="text-xs fill-slate-500 font-bold">Energy</text>
            <text x="160" y="195" className="text-xs fill-slate-500 font-bold">Reaction Coordinate</text>

            {/* Reaction Path */}
            <path 
                d={`M 40 ${baseY} Q 150 ${peakY-50} 260 ${finalY}`} 
                fill="none" 
                stroke="#f43f5e" 
                strokeWidth="4" 
                strokeLinecap="round"
            />
            
            {/* Labels */}
            <line x1="40" y1={baseY} x2="150" y2={baseY} stroke="#cbd5e1" strokeDasharray="4" />
            <line x1="150" y1={peakY-30} x2="150" y2={baseY} stroke="#f59e0b" markerStart="url(#arrow)" />
            <text x="160" y={peakY} className="text-xs fill-amber-500 font-bold">Ea = {ea} kJ</text>
            
            <circle cx="40" cy={baseY} r="4" fill="#64748b" />
            <text x="50" y={baseY+15} className="text-xs fill-slate-500">Reactants</text>
            <circle cx="260" cy={finalY} r="4" fill="#64748b" />
            <text x="250" y={finalY+15} className="text-xs fill-slate-500">Products</text>
        </svg>
    )
}

const PHScaleDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    const ph = Math.max(0, Math.min(14, data.ph));
    const percent = (ph / 14) * 100;
    
    // Determine color based on pH
    let colorClass = 'bg-green-500';
    if(ph < 3) colorClass = 'bg-red-500';
    else if(ph < 6) colorClass = 'bg-orange-500';
    else if(ph < 8) colorClass = 'bg-green-500';
    else if(ph < 11) colorClass = 'bg-blue-500';
    else colorClass = 'bg-purple-500';

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <div className="w-full h-8 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-purple-600 relative mb-4">
                <div 
                    className="absolute -top-2 w-4 h-12 bg-white border-2 border-slate-800 rounded shadow-lg transition-all duration-500"
                    style={{ left: `${percent}%`, transform: 'translateX(-50%)' }}
                ></div>
            </div>
            <div className="text-3xl font-bold text-slate-800 dark:text-white mb-2">pH {ph.toFixed(2)}</div>
            <div className={`px-4 py-1 rounded-full text-white font-bold text-sm ${colorClass} capitalize`}>
                {ph < 7 ? 'Acidic' : ph > 7 ? 'Basic' : 'Neutral'}
            </div>
        </div>
    );
};

const BeerLambertDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    // Darker color for higher absorbance
    const opacity = Math.min(1, Math.max(0.05, data.abs));
    return (
        <div className="w-full h-full flex items-center justify-center gap-4">
             <div className="flex flex-col items-center">
                 <div className="w-20 h-2 bg-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.8)]"></div>
                 <span className="text-xs text-slate-500 mt-1">Light I₀</span>
             </div>
             <div className="w-24 h-32 border-2 border-slate-400 bg-cyan-500 transition-opacity duration-300" style={{ opacity }}></div>
             <div className="flex flex-col items-center">
                 <div className="w-20 h-2 bg-yellow-400/50 shadow-[0_0_10px_rgba(250,204,21,0.3)]"></div>
                 <span className="text-xs text-slate-500 mt-1">Light I</span>
             </div>
        </div>
    )
}

// --- Main Component ---

const ChemistryCalculator: React.FC = () => {
  const { calculatorId, category } = useParams<{ calculatorId: string, category: string }>();
  const config = chemistryCalculators[calculatorId || 'molarity'] as ChemistryCalculatorConfig;
  const { history, addToHistory, clearHistory } = useChemistryHistory();

  const [activeModeIdx, setActiveModeIdx] = useState(0);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  
  const activeMode = config ? config.solveModes[activeModeIdx] : null;

  useEffect(() => {
    if(activeMode) {
        const defaults: Record<string, number> = {};
        activeMode.inputs.forEach(i => {
            defaults[i.name] = Number(i.defaultValue);
        });
        setInputs(defaults);
    }
  }, [activeMode, config?.id]);

  const result = useMemo(() => {
      try {
          if (!activeMode) return null;
          return activeMode.calculate(inputs);
      } catch(e) {
          return null;
      }
  }, [inputs, activeMode]);

  const handleInputChange = (name: string, val: string) => {
      setInputs(prev => ({ ...prev, [name]: parseFloat(val) || 0 }));
  };

  const handleSave = () => {
     if(result && activeMode) {
         const details = activeMode.inputs.map(i => `${i.label}: ${inputs[i.name]} ${i.unit}`).join('\n');
         addToHistory(config.title, `${typeof result.value === 'number' ? result.value.toFixed(4) : result.value} ${result.unit}`, details);
     }
  };

  if(!config) return <div className="p-10 text-center">Calculator not found</div>;

  const Icon = config.icon;

  return (
    <ChemistryLayout 
        title={config.title} 
        category={config.category} 
        icon={<Icon className="w-6 h-6" />} 
        history={history}
        onClear={clearHistory}
    >
        <SEO 
          title={config.title} 
          description={config.description} 
          keywords={[config.category, 'chemistry', 'calculator', 'science', 'lab']} 
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Controls */}
            <div className="lg:col-span-5 space-y-6">
                {config.solveModes.length > 1 && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                           <Settings2 className="w-3 h-3" /> Calculation Mode
                        </label>
                        <div className="relative">
                            <select 
                                className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white py-3 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium shadow-sm"
                                value={activeModeIdx}
                                onChange={(e) => setActiveModeIdx(parseInt(e.target.value))}
                            >
                                {config.solveModes.map((m, i) => (
                                    <option key={i} value={i}>{m.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Parameters</span>
                    </div>
                    <div className="p-5 space-y-6">
                        {activeMode && activeMode.inputs.map(input => (
                            <div key={input.name} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-cyan-600 transition-colors">
                                        {input.label}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number"
                                            value={inputs[input.name] ?? ''}
                                            onChange={(e) => handleInputChange(input.name, e.target.value)}
                                            step={input.step}
                                            className="w-24 p-1 text-right bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-cyan-500 outline-none font-mono text-sm text-slate-900 dark:text-white"
                                        />
                                        <span className="text-xs font-bold text-slate-400 px-1">{input.unit}</span>
                                    </div>
                                </div>
                                {input.min !== undefined && (
                                    <input 
                                        type="range"
                                        min={input.min}
                                        max={input.max || 100}
                                        step={input.step}
                                        value={inputs[input.name] ?? input.defaultValue}
                                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer focus:outline-none accent-cyan-600"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Visualizer */}
                <div className="flex-grow bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner relative overflow-hidden min-h-[280px] flex items-center justify-center">
                    <div className="absolute top-3 left-4 z-10">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/50 dark:bg-black/20 px-2 py-1 rounded backdrop-blur-sm border border-slate-200 dark:border-slate-700/50">
                             Lab Simulation
                         </span>
                    </div>
                    {result?.diagram?.type === 'beaker' && <BeakerDiagram data={result.diagram.data} />}
                    {result?.diagram?.type === 'gas' && <GasDiagram data={result.diagram.data} />}
                    {result?.diagram?.type === 'ph-scale' && <PHScaleDiagram data={result.diagram.data} />}
                    {result?.diagram?.type === 'beer-lambert' && <BeerLambertDiagram data={result.diagram.data} />}
                    {result?.diagram?.type === 'energy-profile' && <EnergyProfileDiagram data={result.diagram.data} />}
                    {result?.diagram?.type === 'bar' && result.diagram.data && (
                         <div className="w-full h-full p-4">
                            <Bar 
                               data={{
                                 labels: result.diagram.data.map((d: any) => d.label),
                                 datasets: [{
                                   label: 'Value',
                                   data: result.diagram.data.map((d: any) => d.value),
                                   backgroundColor: result.diagram.data.map((d: any) => d.color || '#06b6d4'),
                                   borderRadius: 4
                                 }]
                               }}
                               options={{ maintainAspectRatio: false, plugins: { legend: { display: false } } }} 
                            />
                         </div>
                    )}
                    {!result?.diagram && <div className="text-slate-400 text-sm flex flex-col items-center gap-2"><Maximize2 className="w-8 h-8 opacity-20"/>Visualization Unavailable</div>}
                </div>

                {/* Main Result */}
                <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="text-xs font-bold text-cyan-200 uppercase tracking-widest mb-1">Result</div>
                            <div className="flex items-baseline gap-2">
                                <span className={`font-extrabold font-mono tracking-tighter ${typeof result?.value === 'string' && result.value.length > 10 ? 'text-2xl sm:text-3xl' : 'text-4xl sm:text-5xl'}`}>
                                   {typeof result?.value === 'number' ? result.value.toExponential(3).replace('e+', 'e') : result?.value}
                                </span>
                                <span className="text-xl text-cyan-200 font-medium">{result?.unit}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => navigator.clipboard.writeText(result?.value.toString() || '')} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Copy">
                                <Copy className="w-4 h-4" />
                            </button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-3 py-2 bg-white text-cyan-700 hover:bg-cyan-50 font-bold text-xs uppercase rounded-lg shadow-lg">
                                <Save className="w-3 h-3" /> Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                     <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                         <div className="p-1.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 rounded">
                             <RefreshCw className="w-3.5 h-3.5" />
                         </div>
                         <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Solution Steps</h3>
                     </div>
                     <div className="space-y-2 font-mono text-sm">
                         {result?.steps?.map((step, i) => (
                             <div key={i} className="flex gap-3 text-slate-600 dark:text-slate-300">
                                 <span className="text-slate-400 select-none text-xs pt-1">{i+1}.</span>
                                 <p className="bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded w-full border border-slate-100 dark:border-slate-700/50">{step}</p>
                             </div>
                         ))}
                     </div>
                </div>

            </div>
        </div>
    </ChemistryLayout>
  );
};

export default ChemistryCalculator;
