import React, { useState, useEffect, isValidElement } from 'react';
import { useParams } from 'react-router-dom';
import FinancialLayout, { useFinancialHistory } from '../../components/FinancialLayout';
import FinancialChart, { StatCard, TrustBadges } from '../../components/FinancialCharts';
import { getCalculator, CalculationResult } from '../../utils/financial-calculators-data';
import { Play, Copy, RotateCcw } from 'lucide-react';
import SEO from '../../components/SEO';

const FinancialCalculator: React.FC = () => {
  const { calculatorId } = useParams<{ calculatorId: string }>();
  const config = getCalculator(calculatorId || 'loan-payment');
  
  const { history, saveResult, clearHistory, deleteItem } = useFinancialHistory();

  // Initialize state
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [calculationData, setCalculationData] = useState<CalculationResult | null>(null);

  useEffect(() => {
    // Reset inputs when calculator changes
    const defaults: Record<string, number> = {};
    config.inputs.forEach(input => {
      defaults[input.name] = input.defaultValue;
    });
    setInputs(defaults);
    setCalculationData(null);
  }, [config.id]);

  const handleInputChange = (name: string, value: string) => {
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const calculate = () => {
    const output = config.calculate(inputs);
    setCalculationData(output);
  };

  const handleSave = () => {
    if (calculationData) {
        const inputSummary = config.inputs
           .map(i => `${i.label}: ${inputs[i.name]}`)
           .join(', ');
        const content = `INPUTS\n${inputSummary}\n\nRESULT\n${calculationData.result}`;
        saveResult(config.title, content);
    }
  };

  const handleCopy = () => {
     if (calculationData) {
         navigator.clipboard.writeText(`${config.title} Result: ${calculationData.result}`);
     }
  };

  const renderIcon = (icon: any) => {
    if (!icon) return undefined;
    if (isValidElement(icon)) return icon;
    const IconComponent = icon as React.ElementType;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <FinancialLayout 
        title={config.title} 
        description={config.description} 
        icon={<config.icon className="w-8 h-8" />}
        history={history}
        onClearHistory={clearHistory}
        onDeleteHistoryItem={deleteItem}
    >
      <SEO 
        title={`${config.title}`}
        description={`${config.description} Easy to use ${config.title} with graphs and detailed breakdown.`}
        keywords={[config.title.toLowerCase(), 'calculator', 'financial tool', 'investment', config.category.toLowerCase()]}
        schema={{
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": config.title,
            "applicationCategory": "FinanceApplication",
            "description": config.description
        }}
      />

      <div className="space-y-10">
         {/* Input Section */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {config.inputs.map((input) => (
                <div key={input.name} className="space-y-3">
                    <div className="flex justify-between">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            {input.label}
                        </label>
                        <span className="text-xs text-primary-600 dark:text-primary-400 font-mono">
                           {input.type === 'currency' ? '$' : ''}{inputs[input.name]}{input.type === 'percent' ? '%' : ''}
                        </span>
                    </div>

                    <div className="relative">
                         {/* Slider for Range Inputs */}
                        {(input.min !== undefined && input.max !== undefined) && (
                           <input
                             type="range"
                             min={input.min}
                             max={input.max}
                             step={input.step || 1}
                             value={inputs[input.name] ?? input.defaultValue}
                             onChange={(e) => handleInputChange(input.name, e.target.value)}
                             className="absolute bottom-0 left-0 w-full h-1 bg-transparent appearance-none cursor-pointer z-20 opacity-0 hover:opacity-100 transition-opacity"
                             title="Slide to adjust"
                           />
                        )}

                        <div className="relative z-10">
                            {input.type === 'currency' && (
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">$</div>
                            )}
                            <input
                                type="number"
                                value={inputs[input.name] ?? ''}
                                onChange={(e) => handleInputChange(input.name, e.target.value)}
                                step={input.step || (input.type === 'currency' ? 0.01 : 1)}
                                className={`w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-emerald-500 outline-none transition-all ${
                                    input.type === 'currency' ? 'pl-8 pr-4' : 'px-4'
                                }`}
                            />
                            {input.type === 'percent' && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">%</div>
                            )}
                            {input.type === 'years' && (
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-xs text-slate-400 uppercase">Yrs</div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
         </div>

         {/* Action Bar */}
         <div className="flex gap-4 pt-2">
             <button 
                onClick={calculate}
                className="flex-grow py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-500/30 flex justify-center items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
             >
                <Play className="w-5 h-5 fill-current" /> Calculate Result
             </button>
             <button 
                onClick={() => {
                    const defaults: Record<string, number> = {};
                    config.inputs.forEach(input => defaults[input.name] = input.defaultValue);
                    setInputs(defaults);
                    setCalculationData(null);
                }}
                className="px-6 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 rounded-xl transition-colors"
                title="Reset"
             >
                <RotateCcw className="w-5 h-5" />
             </button>
         </div>

         {/* Results Area */}
         {calculationData && (
             <div className="space-y-8 animate-fade-in-up">
                 
                 {/* 1. Main Result Card */}
                 <div className="relative bg-slate-900 dark:bg-black rounded-2xl p-6 sm:p-8 text-white shadow-2xl overflow-hidden">
                    {/* Abstract background pattern */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>

                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-emerald-400 font-bold tracking-wider text-xs uppercase">Primary Result</span>
                            <div className="flex gap-2">
                                <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-300 hover:text-white" title="Copy">
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button onClick={handleSave} className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-xs font-bold uppercase transition-colors">
                                    Save
                                </button>
                            </div>
                        </div>
                        
                        <div className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-white mb-2">
                            {calculationData.result}
                        </div>
                        <div className="text-slate-400 text-sm">
                           based on your inputs
                        </div>
                    </div>
                 </div>

                 {/* 2. Stat Cards Grid */}
                 {calculationData.stats && calculationData.stats.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {calculationData.stats.map((stat, idx) => (
                            <StatCard 
                                key={idx} 
                                label={stat.label} 
                                value={stat.value} 
                                icon={renderIcon(stat.icon)} 
                                subtext={stat.subtext} 
                            />
                        ))}
                    </div>
                 )}

                 {/* 3. Interactive Chart */}
                 {calculationData.chart && (
                    <div className="mt-8">
                        <FinancialChart 
                            type={calculationData.chart.type} 
                            data={calculationData.chart.data} 
                            series={calculationData.chart.series}
                            labels={calculationData.chart.labels}
                            title={calculationData.chart.title}
                        />
                    </div>
                 )}
                 
                 {/* 4. Details List (Legacy Support) */}
                 {calculationData.details.length > 0 && !calculationData.stats && (
                     <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
                        <h4 className="text-sm font-bold text-slate-500 uppercase mb-4">Detailed Breakdown</h4>
                        <div className="space-y-3">
                            {calculationData.details.map((line, idx) => (
                                <div key={idx} className="flex justify-between text-sm text-slate-700 dark:text-slate-300 border-b border-slate-50 dark:border-slate-700/50 pb-2 last:border-0 last:pb-0">
                                    <span>{line.split(':')[0]}</span>
                                    <span className="font-mono font-medium">{line.split(':')[1] || ''}</span>
                                </div>
                            ))}
                        </div>
                     </div>
                 )}
             </div>
         )}
         
         <TrustBadges />
      </div>
    </FinancialLayout>
  );
};

export default FinancialCalculator;