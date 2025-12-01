import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import EverydayLayout, { useEverydayHistory } from '../../components/EverydayLayout';
import { everydayCalculators, EverydayCalculatorConfig } from '../../utils/everyday-data';
import { Copy, Save, ArrowRightLeft, Maximize2, RotateCcw, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import SEO from '../../components/SEO';

// --- Visual Components ---

const ThermometerVisual = ({ data }: { data: any }) => {
    if(!data) return null;
    const { value, unit } = data;
    // Normalize to Celsius for visual height
    let c = value;
    if(unit === 'F') c = (value - 32) * 5/9;
    if(unit === 'K') c = value - 273.15;
    if(unit === 'R') c = (value - 491.67) * 5/9;

    // Range -30 to 50 for visual
    const pct = Math.max(0, Math.min(100, ((c + 30) / 80) * 100));
    
    // Color changes based on temp
    let color = '#3b82f6'; // Blue (Cold)
    if(c > 10) color = '#10b981'; // Green (Mild)
    if(c > 25) color = '#f59e0b'; // Orange (Warm)
    if(c > 35) color = '#ef4444'; // Red (Hot)

    return (
        <div className="h-full w-full flex items-center justify-center p-6">
            <div className="relative w-16 h-48 bg-slate-200 dark:bg-slate-700 rounded-full border-4 border-slate-300 dark:border-slate-600 shadow-inner overflow-hidden">
                <div 
                    className="absolute bottom-0 w-full transition-all duration-700 ease-in-out" 
                    style={{ height: `${pct}%`, backgroundColor: color }}
                ></div>
                {/* Ticks */}
                <div className="absolute right-0 top-4 bottom-4 w-2 flex flex-col justify-between text-[8px] text-slate-400">
                    <span>50°C</span>
                    <span>0°C</span>
                    <span>-30°C</span>
                </div>
            </div>
            <div className="ml-4 text-center">
               <div className="text-3xl font-bold" style={{ color }}>{value.toFixed(1)}°</div>
               <div className="text-sm font-bold text-slate-400">{unit}</div>
            </div>
        </div>
    );
};

const LiquidVisual = ({ data }: { data: any }) => {
    if(!data) return null;
    const { percent } = data;
    return (
        <div className="h-full w-full flex items-center justify-center p-6">
            <div className="relative w-32 h-40 border-4 border-slate-400 dark:border-slate-500 rounded-b-xl border-t-0 bg-white/5 overflow-hidden backdrop-blur-sm">
                <div 
                    className="absolute bottom-0 w-full bg-cyan-500/60 transition-all duration-700 ease-out flex items-start justify-center overflow-hidden" 
                    style={{ height: `${percent}%` }}
                >
                    <div className="w-full h-2 bg-cyan-400/80 absolute top-0 animate-pulse"></div>
                    <div className="w-full h-full absolute top-0 left-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                </div>
                {/* Measurement Lines */}
                <div className="absolute right-0 top-0 h-full w-full flex flex-col justify-evenly items-end pr-1 pointer-events-none">
                    <div className="w-4 h-0.5 bg-slate-400/50"></div>
                    <div className="w-2 h-0.5 bg-slate-400/50"></div>
                    <div className="w-4 h-0.5 bg-slate-400/50"></div>
                    <div className="w-2 h-0.5 bg-slate-400/50"></div>
                    <div className="w-4 h-0.5 bg-slate-400/50"></div>
                </div>
            </div>
        </div>
    )
};

const GaugeVisual = ({ data }: { data: any }) => {
    if(!data) return null;
    const { value, max } = data;
    const rotation = Math.min(180, Math.max(0, (value / max) * 180));
    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-6">
            <div className="relative w-40 h-20 overflow-hidden">
                <div className="w-full h-full bg-slate-200 dark:bg-slate-700 rounded-t-full"></div>
                <div 
                    className="absolute bottom-0 left-1/2 w-full h-full origin-bottom-left bg-orange-500 rounded-t-full opacity-80"
                    style={{ transform: `rotate(${rotation - 180}deg)`, transformOrigin: '50% 100%' }}
                ></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-slate-800 dark:bg-white rounded-full z-10"></div>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-700 dark:text-white">{value}</div>
        </div>
    )
}

const TextBoxVisual = ({ data }: { data: any }) => {
    if(!data) return null;
    return (
        <div className="h-full w-full flex items-center justify-center p-6">
            <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                {data.text}
            </div>
        </div>
    )
}

// --- Main Component ---

const EverydayCalculator: React.FC = () => {
  const { calculatorId, category } = useParams<{ calculatorId: string, category: string }>();
  const config = everydayCalculators[calculatorId || 'temperature-converter'] as EverydayCalculatorConfig;
  const { history, addToHistory, clearHistory } = useEverydayHistory();
  const { t } = useLanguage();

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

  // Handle special dynamic options for Speed/Fuel
  const currentInputs = useMemo(() => {
      if(config?.id === 'speed-fuel-converter') {
          // Clone config inputs to avoid mutation
          const dynamicInputs = JSON.parse(JSON.stringify(config.inputs));
          const mode = inputs['type'] || 'speed';
          
          if(mode === 'speed') {
              dynamicInputs[2].options = [ // From
                  { label: 'km/h', value: 'km/h' }, { label: 'mph', value: 'mph' },
                  { label: 'm/s', value: 'm/s' }, { label: 'ft/s', value: 'ft/s' }, { label: 'Knots', value: 'kn' }
              ];
              dynamicInputs[3].options = dynamicInputs[2].options; // To
          } else {
              dynamicInputs[2].options = [ // From
                  { label: 'L/100km', value: 'L/100km' }, { label: 'MPG (US)', value: 'mpg_us' }, { label: 'MPG (UK)', value: 'mpg_uk' }
              ];
              dynamicInputs[3].options = dynamicInputs[2].options; // To
          }
          return dynamicInputs;
      }
      return config?.inputs || [];
  }, [config, inputs['type']]);

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

  const handleSwap = () => {
      if(inputs['from'] && inputs['to']) {
          setInputs(prev => ({ ...prev, from: prev.to, to: prev.from }));
      }
  };

  const handleSave = () => {
     if(result && config) {
         // Create a readable string of input values
         const fromVal = inputs['value'];
         const fromUnit = inputs['from'];
         const toUnit = inputs['to'];
         
         const details = `${fromVal} ${fromUnit || ''} → ${result.value} ${toUnit || result.unit}`;
         addToHistory(config.title, `${result.value} ${result.unit}`, details);
     }
  };

  if(!config) return <div className="p-10 text-center">Calculator not found</div>;

  const Icon = config.icon;

  return (
    <EverydayLayout 
        title={t(config.title) || config.title} 
        category={t(config.category) || config.category} 
        icon={<Icon className="w-6 h-6" />} 
        history={history}
        onClear={clearHistory}
    >
        <SEO 
          title={config.title} 
          description={config.description} 
          keywords={[config.category, 'calculator', 'converter', calculatorId || 'tool']} 
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{t('inputs')}</span>
                        {(inputs.from && inputs.to) && (
                            <button onClick={handleSwap} className="p-1.5 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-500 transition-colors" title="Swap Units">
                                <ArrowRightLeft className="w-4 h-4 rtl:rotate-180" />
                            </button>
                        )}
                    </div>
                    <div className="p-6 space-y-6">
                        {currentInputs.map((input: any) => (
                            <div key={input.name} className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    {t(input.label) || input.label}
                                </label>
                                
                                {input.type === 'select' && input.options ? (
                                    <div className="relative">
                                        <select
                                            value={inputs[input.name] ?? ''}
                                            onChange={(e) => handleInputChange(input.name, e.target.value)}
                                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium text-slate-800 dark:text-white transition-all shadow-sm"
                                        >
                                            {input.options.map((o: any) => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                ) : (
                                    <div className="relative group">
                                        <input 
                                            type="number"
                                            value={inputs[input.name] ?? ''}
                                            onChange={(e) => handleInputChange(input.name, parseFloat(e.target.value))}
                                            step={input.step || 'any'}
                                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 font-mono text-lg text-slate-900 dark:text-white shadow-sm transition-all group-hover:border-slate-300 dark:group-hover:border-slate-600"
                                        />
                                    </div>
                                )}
                                
                                {/* Range Slider for numerical inputs */}
                                {input.type === 'number' && input.name === 'value' && (
                                    <input 
                                        type="range"
                                        min={0}
                                        max={100} // Arbitrary scale for UI feel
                                        step={1}
                                        value={Math.min(100, Math.max(0, inputs[input.name] || 0))}
                                        onChange={(e) => handleInputChange(input.name, parseFloat(e.target.value))}
                                        className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Visualizer Area */}
                <div className="flex-grow bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner relative overflow-hidden min-h-[300px] flex items-center justify-center">
                    <div className="absolute top-3 left-4 z-10">
                         <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                             Live Preview
                         </span>
                    </div>
                    
                    {result?.visual?.type === 'thermometer' && <ThermometerVisual data={result.visual.data} />}
                    {result?.visual?.type === 'fill' && <LiquidVisual data={result.visual.data} />}
                    {result?.visual?.type === 'gauge' && <GaugeVisual data={result.visual.data} />}
                    {result?.visual?.type === 'text-box' && <TextBoxVisual data={result.visual.data} />}
                    {!result?.visual && <div className="text-slate-400 text-sm flex flex-col items-center gap-2"><Maximize2 className="w-8 h-8 opacity-20"/>Visualization Unavailable</div>}
                </div>

                {/* Result Output */}
                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <div className="text-xs font-bold text-orange-100 uppercase tracking-widest mb-1">{t('result')}</div>
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className={`font-extrabold font-mono tracking-tighter ${result?.value.length > 10 ? 'text-3xl' : 'text-5xl'}`}>
                                   {result?.value || '---'}
                                </span>
                                <span className="text-xl text-orange-100 font-medium">{result?.unit}</span>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button onClick={() => navigator.clipboard.writeText(result?.value.toString() || '')} className="flex-1 sm:flex-none p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-colors text-white backdrop-blur-sm" title="Copy">
                                <Copy className="w-5 h-5 mx-auto" />
                            </button>
                            <button onClick={handleSave} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-orange-600 hover:bg-orange-50 font-bold text-sm uppercase rounded-xl shadow-lg transition-colors">
                                <Save className="w-4 h-4" /> {t('save')}
                            </button>
                        </div>
                    </div>
                    
                    {/* Details */}
                    {result?.details && result.details.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-orange-50">
                            {result.details.map((d, i) => (
                                <div key={i}>• {d}</div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    </EverydayLayout>
  );
};

export default EverydayCalculator;