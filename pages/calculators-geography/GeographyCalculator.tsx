
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import GeographyLayout, { useGeoHistory } from '../../components/GeographyLayout';
import { geoCalculators, GeoCalculatorConfig } from '../../utils/geography-data';
import { Copy, Save, ChevronDown, RefreshCw, Settings2, Maximize2 } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import SEO from '../../components/SEO';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// --- Visual Components ---

const GlobeDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    return (
        <div className="relative w-full h-full flex items-center justify-center bg-slate-900 rounded-lg overflow-hidden">
             {/* Simple SVG Globe Representation */}
             <svg viewBox="0 0 200 200" className="w-64 h-64 animate-spin-slow" style={{ animationDuration: '60s' }}>
                 <circle cx="100" cy="100" r="90" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                 {/* Longitude Lines */}
                 <ellipse cx="100" cy="100" rx="30" ry="90" fill="none" stroke="#334155" strokeWidth="1" />
                 <ellipse cx="100" cy="100" rx="60" ry="90" fill="none" stroke="#334155" strokeWidth="1" />
                 <line x1="100" y1="10" x2="100" y2="190" stroke="#334155" strokeWidth="1" />
                 {/* Latitude Lines */}
                 <line x1="10" y1="100" x2="190" y2="100" stroke="#334155" strokeWidth="1" />
                 <path d="M 20 70 Q 100 90 180 70" fill="none" stroke="#334155" strokeWidth="1" />
                 <path d="M 20 130 Q 100 110 180 130" fill="none" stroke="#334155" strokeWidth="1" />
             </svg>
             
             {/* Pins */}
             <div className="absolute inset-0 flex items-center justify-center">
                 {data.lat !== undefined && (
                    <div className="absolute w-2 h-2 bg-red-500 rounded-full shadow-[0_0_10px_red]" style={{ transform: 'translate(20px, -20px)' }}></div>
                 )}
                 {data.path && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        <path d="M 40% 40% Q 50% 20% 60% 40%" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4" className="animate-pulse"/>
                    </svg>
                 )}
             </div>
        </div>
    );
};

const CompassDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    const heading = data.heading || 0;
    return (
        <div className="relative w-full h-full flex items-center justify-center">
             <div className="relative w-48 h-48 border-4 border-slate-300 dark:border-slate-600 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center">
                  {/* Markings */}
                  <div className="absolute top-2 text-xs font-bold text-slate-500">N</div>
                  <div className="absolute bottom-2 text-xs font-bold text-slate-500">S</div>
                  <div className="absolute left-2 text-xs font-bold text-slate-500">W</div>
                  <div className="absolute right-2 text-xs font-bold text-slate-500">E</div>
                  
                  {/* Needle */}
                  <div className="w-4 h-32 relative transition-transform duration-1000 ease-out" style={{ transform: `rotate(${heading}deg)` }}>
                      <div className="absolute top-0 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[60px] border-l-transparent border-r-transparent border-b-red-500 left-1/2 -translate-x-1/2"></div>
                      <div className="absolute bottom-0 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[60px] border-l-transparent border-r-transparent border-t-slate-300 left-1/2 -translate-x-1/2"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800 rounded-full"></div>
                  </div>
             </div>
             <div className="absolute bottom-4 text-sm font-mono font-bold text-slate-600 dark:text-slate-300">{heading.toFixed(1)}°</div>
        </div>
    )
}

const SunPathDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    const { elevation, hour } = data;
    // Map hour 0-24 to x position 0-300
    const sunX = (hour / 24) * 300;
    const sunY = 200 - (elevation / 90) * 150; // Simple scaling

    return (
        <svg viewBox="0 0 300 200" className="w-full h-full bg-gradient-to-b from-sky-200 to-sky-50 dark:from-slate-800 dark:to-slate-900">
             <path d="M 20 200 Q 150 20 280 200" fill="none" stroke="#fbbf24" strokeWidth="2" strokeDasharray="4" />
             <line x1="0" y1="200" x2="300" y2="200" stroke="#16a34a" strokeWidth="4" />
             
             {/* Sun */}
             <g transform={`translate(${sunX}, ${sunY})`}>
                <circle r="12" fill="#f59e0b" className="shadow-lg" />
                <circle r="18" fill="#fcd34d" opacity="0.3" className="animate-pulse" />
             </g>
             
             <text x="10" y="20" className="text-xs fill-slate-500">Elevation: {elevation.toFixed(1)}°</text>
        </svg>
    )
}

const ElevationDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    return (
        <svg viewBox="0 0 300 200" className="w-full h-full bg-slate-50 dark:bg-slate-900">
             <path d={`M 20 180 L 280 180 L 280 ${180 - Math.min(150, data.rise*2)} Z`} fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
             <text x="150" y="195" textAnchor="middle" className="text-xs fill-slate-500">{data.run}m</text>
             <text x="290" y={180 - Math.min(150, data.rise)/2} textAnchor="middle" className="text-xs fill-slate-500" transform={`rotate(-90 290,${180 - Math.min(150, data.rise)/2})`}>{data.rise}m</text>
        </svg>
    )
}

const WindCorrectionDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    return (
         <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
             {/* Plane */}
             <div className="absolute transition-transform duration-500" style={{ transform: `rotate(${data.course}deg)` }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                      <path d="M12 2L12 22M12 2L2 12M12 2L22 12" />
                  </svg>
             </div>
             {/* Wind Arrow */}
             <div className="absolute w-full h-full flex items-center justify-center pointer-events-none">
                 <div className="w-32 h-0.5 bg-blue-400 absolute" style={{ transform: `rotate(${data.windDir}deg)` }}></div>
                 <div className="absolute text-blue-500 font-bold text-xs" style={{ transform: `rotate(${data.windDir}deg) translate(60px, -10px)` }}>Wind</div>
             </div>
         </div>
    )
}

const TriangleDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    return (
        <svg viewBox="0 0 300 200" className="w-full h-full bg-slate-50 dark:bg-slate-900">
             <path d={`M 30 170 L 270 170 L 270 ${170 - Math.min(140, data.vd * 3)} Z`} fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
             <text x="150" y="190" textAnchor="middle" className="text-xs fill-slate-500">HD: {data.hd.toFixed(1)}m</text>
             <text x="280" y={170 - Math.min(140, data.vd * 3)/2} textAnchor="middle" className="text-xs fill-slate-500" transform={`rotate(90 280,${170 - Math.min(140, data.vd * 3)/2})`}>VD: {data.vd.toFixed(1)}m</text>
             <text x="150" y={170 - Math.min(140, data.vd * 3)/2 - 10} textAnchor="middle" className="text-xs fill-blue-500 font-bold" transform={`rotate(${-data.angle} 150,${170})`}>SD: {data.sd}m</text>
             <path d="M 80 170 A 50 50 0 0 0 80 160" fill="none" stroke="#f59e0b" /> 
             <text x="90" y="165" className="text-xs fill-amber-500">{data.angle}°</text>
        </svg>
    )
}

const LevelingDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    const lineOfSightY = 80;
    const groundY = 150;
    const staffHeightA = Math.max(20, Math.min(100, data.bs * 20));
    const staffHeightB = Math.max(20, Math.min(100, data.fs * 20));

    return (
        <svg viewBox="0 0 300 200" className="w-full h-full bg-slate-50 dark:bg-slate-900">
             {/* Ground */}
             <path d="M 0 150 Q 150 140 300 160 L 300 200 L 0 200 Z" fill="#e2e8f0" stroke="none" className="dark:fill-slate-800" />
             
             {/* Staff A (BM) */}
             <rect x="50" y={lineOfSightY} width="10" height={staffHeightA} fill="#f1f5f9" stroke="#64748b" />
             <text x="55" y={lineOfSightY + staffHeightA + 15} textAnchor="middle" className="text-[10px] fill-slate-500">BM</text>
             <text x="30" y={lineOfSightY + staffHeightA/2} className="text-[10px] fill-blue-600 font-bold">{data.bs}m</text>

             {/* Level Instrument */}
             <line x1="150" y={lineOfSightY + 40} x2="150" y2={lineOfSightY - 5} stroke="#64748b" strokeWidth="2" />
             <rect x="140" y={lineOfSightY - 10} width="20" height="5" fill="#3b82f6" />
             <line x1="55" y1={lineOfSightY} x2="245" y2={lineOfSightY} stroke="#ef4444" strokeWidth="1" strokeDasharray="4" />

             {/* Staff B (FS) */}
             <rect x="240" y={lineOfSightY} width="10" height={staffHeightB} fill="#f1f5f9" stroke="#64748b" />
             <text x="245" y={lineOfSightY + staffHeightB + 15} textAnchor="middle" className="text-[10px] fill-slate-500">TP</text>
             <text x="260" y={lineOfSightY + staffHeightB/2} className="text-[10px] fill-blue-600 font-bold">{data.fs}m</text>
             
             <text x="150" y="40" textAnchor="middle" className="text-xs fill-slate-500 font-mono">New Elev: {data.elev.toFixed(3)}m</text>
        </svg>
    )
}

// --- Main Calculator ---

const GeographyCalculator: React.FC = () => {
  const { calculatorId, category } = useParams<{ calculatorId: string, category: string }>();
  const config = geoCalculators[calculatorId || 'lat-long-conv'] as GeoCalculatorConfig;
  const { history, addToHistory, clearHistory } = useGeoHistory();

  const [activeModeIdx, setActiveModeIdx] = useState(0);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  
  const activeMode = config ? config.solveModes[activeModeIdx] : null;

  useEffect(() => {
    if(activeMode) {
        const defaults: Record<string, any> = {};
        activeMode.inputs.forEach(i => {
            defaults[i.name] = i.defaultValue;
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
      const inputDef = activeMode?.inputs.find(i => i.name === name);
      const value = inputDef?.type === 'text' ? val : (parseFloat(val) || 0);
      setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
     if(result && activeMode) {
         const details = activeMode.inputs.map(i => `${i.label}: ${inputs[i.name]}`).join('\n');
         addToHistory(config.title, `${result.value} ${result.unit}`, details);
     }
  };

  if(!config) return <div className="p-10 text-center">Calculator not found</div>;

  const Icon = config.icon;

  return (
    <GeographyLayout 
        title={config.title} 
        category={config.category} 
        icon={<Icon className="w-6 h-6" />} 
        history={history}
        onClear={clearHistory}
    >
        <SEO 
          title={config.title} 
          description={config.description} 
          keywords={[config.category, 'geography', 'calculator', 'map', 'navigation']} 
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Controls */}
            <div className="lg:col-span-5 space-y-6">
                {config.solveModes.length > 1 && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                           <Settings2 className="w-3 h-3" /> Method
                        </label>
                        <div className="relative">
                            <select 
                                className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white py-3 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium shadow-sm"
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
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Data Inputs</span>
                    </div>
                    <div className="p-5 space-y-6">
                        {activeMode && activeMode.inputs.map(input => (
                            <div key={input.name} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-blue-600 transition-colors">
                                        {input.label}
                                    </label>
                                    <span className="text-xs font-bold text-slate-400 px-1">{input.unit}</span>
                                </div>
                                <input 
                                    type={input.type || 'number'}
                                    value={inputs[input.name] ?? ''}
                                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                                    step={input.step}
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm text-slate-900 dark:text-white"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Visualizer */}
                <div className="flex-grow bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner relative overflow-hidden min-h-[280px] flex items-center justify-center p-6">
                    {result?.diagram?.type === 'globe' && <GlobeDiagram data={result.diagram.data} />}
                    {result?.diagram?.type === 'compass' && <CompassDiagram data={result.diagram.data} />}
                    {result?.diagram?.type === 'sun-path' && <SunPathDiagram data={result.diagram.data} />}
                    {result?.diagram?.type === 'elevation' && <ElevationDiagram data={result.diagram.data} />}
                    {result?.diagram?.type === 'wind' && <WindCorrectionDiagram data={result.diagram.data} />}
                    {result?.diagram?.type === 'triangle' && <TriangleDiagram data={result.diagram.data} />}
                    {result?.diagram?.type === 'leveling' && <LevelingDiagram data={result.diagram.data} />}
                    {result?.diagram?.type === 'bar' && result.diagram.data && (
                         <div className="w-full h-full">
                            <Bar 
                               data={{
                                 labels: result.diagram.data.map((d: any) => d.label),
                                 datasets: [{
                                   label: 'Value',
                                   data: result.diagram.data.map((d: any) => d.value),
                                   backgroundColor: result.diagram.data.map((d: any) => d.color || '#3b82f6'),
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
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="text-xs font-bold text-blue-200 uppercase tracking-widest mb-1">Calculated Output</div>
                            <div className="flex flex-col gap-1">
                                <span className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tighter">
                                   {result?.value}
                                </span>
                                <span className="text-lg text-blue-200 font-medium">{result?.unit}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => navigator.clipboard.writeText(result?.value.toString() || '')} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white" title="Copy">
                                <Copy className="w-4 h-4" />
                            </button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-3 py-2 bg-white text-blue-700 hover:bg-blue-50 font-bold text-xs uppercase rounded-lg shadow-lg">
                                <Save className="w-3 h-3" /> Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                     <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                         <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded">
                             <RefreshCw className="w-3.5 h-3.5" />
                         </div>
                         <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Calculation Details</h3>
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
    </GeographyLayout>
  );
};

export default GeographyCalculator;
