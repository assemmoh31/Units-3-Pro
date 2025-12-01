import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import TechLayout, { useTechHistory } from '../../components/TechLayout';
import { techCalculators, TechCalculatorConfig } from '../../utils/tech-data';
import { Copy, Save, Maximize2, ChevronDown, Play, Check } from 'lucide-react';
import SEO from '../../components/SEO';

// --- Visualizers ---

const BinaryVisual = ({ data }: { data: any }) => {
    if(!data || !data.bits) return null;
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 overflow-hidden">
            <div className="flex flex-wrap justify-center gap-1 max-w-full">
                {data.bits.map((bit: boolean, i: number) => (
                    <div key={i} className={`w-3 h-8 rounded-sm transition-all duration-300 ${bit ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-slate-200 dark:bg-slate-700 opacity-50'}`} title={bit ? '1' : '0'}></div>
                ))}
            </div>
            <div className="mt-4 font-mono text-xs text-slate-500 break-all text-center">
                {data.bits.map((b: boolean) => b ? '1' : '0').join('')}
            </div>
        </div>
    )
}

const ColorPreview = ({ data }: { data: any }) => {
    if(!data) return null;
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-100 dark:bg-slate-900 rounded-lg">
            <div className="w-32 h-32 rounded-2xl shadow-xl transition-colors duration-500 border-4 border-white dark:border-slate-700" style={{ backgroundColor: data.hex }}></div>
            <div className="mt-4 font-mono font-bold text-lg text-slate-700 dark:text-white uppercase select-all">{data.hex}</div>
        </div>
    )
}

const PaletteVisual = ({ data }: { data: any }) => {
    if(!data || !data.colors) return null;
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="flex w-full h-24 rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
                {data.colors.map((c: string, i: number) => (
                    <div key={i} className="flex-1 h-full flex items-end justify-center pb-2 group relative" style={{ backgroundColor: c }}>
                        <span className="text-[10px] font-mono bg-black/50 text-white px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => navigator.clipboard.writeText(c)}>
                            {c}
                        </span>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-xs font-bold text-slate-500 uppercase">{data.type}</div>
        </div>
    )
}

const ContrastVisual = ({ data }: { data: any }) => {
    if(!data) return null;
    return (
        <div className="w-full h-full flex flex-col gap-4 p-6">
            <div className="flex-1 rounded-xl flex flex-col items-center justify-center text-center p-4 border border-slate-200 dark:border-slate-700 shadow-sm" style={{ backgroundColor: data.bg, color: data.fg }}>
                <h3 className="text-2xl font-bold mb-2">Large Heading Text</h3>
                <p className="text-sm opacity-90">Normal body text comparison.</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
                <div className={`p-2 rounded text-center text-xs font-bold border ${data.passes.aa ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                    AA {data.passes.aa ? 'PASS' : 'FAIL'}
                </div>
                <div className={`p-2 rounded text-center text-xs font-bold border ${data.passes.aaa ? 'bg-green-100 border-green-200 text-green-700' : 'bg-red-100 border-red-200 text-red-700'}`}>
                    AAA {data.passes.aaa ? 'PASS' : 'FAIL'}
                </div>
                <div className="p-2 rounded text-center text-xs font-bold border bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                    Ratio {data.ratio.toFixed(2)}
                </div>
            </div>
        </div>
    )
}

const GradientVisual = ({ data }: { data: any }) => {
    if(!data) return null;
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div className="w-full h-32 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700" style={{ background: data.css }}></div>
            <div className="mt-4 w-full bg-slate-900 text-slate-300 p-3 rounded-lg font-mono text-xs overflow-auto whitespace-nowrap flex justify-between items-center group">
                <span>{data.css}</span>
                <button onClick={() => navigator.clipboard.writeText(data.css)} className="text-indigo-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy className="w-3 h-3" />
                </button>
            </div>
        </div>
    )
}

const JSONViewer = ({ data }: { data: any }) => {
    if(!data) return null;
    return (
        <div className="w-full h-full overflow-auto bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-xs shadow-inner">
            <pre className="whitespace-pre-wrap break-all">{data.content}</pre>
        </div>
    )
}

const CalendarVisual = ({ data }: { data: any }) => {
    if(!data) return null;
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm w-48 text-center">
                <div className="text-xs text-slate-400 uppercase font-bold mb-2">Duration</div>
                <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{data.days}</div>
                <div className="text-sm text-slate-500">Days</div>
            </div>
            <div className="mt-4 flex justify-between w-full max-w-xs text-xs text-slate-500">
                <span>{data.start}</span>
                <span className="border-t border-dashed border-slate-400 flex-grow mx-2 relative top-2"></span>
                <span>{data.end}</span>
            </div>
        </div>
    )
}

const MarkdownViewer = ({ data }: { data: any }) => {
    if(!data) return null;
    // Simple mock renderer for demo purposes
    const renderMarkdown = (text: string) => {
        let html = text
            .replace(/^# (.*$)/gim, '<h1 class="text-xl font-bold mb-2">$1</h1>')
            .replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold mb-2">$1</h2>')
            .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
            .replace(/\*(.*)\*/gim, '<i>$1</i>')
            .replace(/^- (.*$)/gim, '<li class="ml-4 list-disc">$1</li>')
            .replace(/\n/gim, '<br />');
        return { __html: html };
    };

    return (
        <div className="w-full h-full overflow-auto bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm font-sans">
            <div dangerouslySetInnerHTML={renderMarkdown(data.content)} />
        </div>
    );
}

const RegexViewer = ({ data }: { data: any }) => {
    if(!data) return null;
    const { text, pattern, flags } = data;
    
    // Highlight logic
    const renderHighlights = () => {
        try {
            if (!pattern) return text;
            const re = new RegExp(`(${pattern})`, flags);
            const parts = text.split(re);
            return parts.map((part: string, i: number) => {
                if(i % 2 === 1) { // Matched part (assuming capturing group or split behavior)
                    return <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-slate-900 dark:text-white rounded px-0.5">{part}</mark>;
                } else if (part.match(new RegExp(pattern, flags))) {
                     // Fallback if split behaves differently with groups
                     return <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/50 text-slate-900 dark:text-white rounded px-0.5">{part}</mark>;
                }
                return <span key={i}>{part}</span>;
            });
        } catch (e) {
            return text;
        }
    };

    return (
        <div className="w-full h-full overflow-auto bg-white dark:bg-slate-900 p-4 rounded-lg font-mono text-sm border border-slate-200 dark:border-slate-700 whitespace-pre-wrap text-slate-600 dark:text-slate-300">
            {renderHighlights()}
        </div>
    );
}

const ChmodViewer = ({ data }: { data: any }) => {
    if(!data) return null;
    const octal = data.octal || '000';
    const perms = [
        { label: 'Owner', val: parseInt(octal[0] || '0') },
        { label: 'Group', val: parseInt(octal[1] || '0') },
        { label: 'Public', val: parseInt(octal[2] || '0') }
    ];

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
            <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                {perms.map((p, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 shadow-sm text-center">
                        <div className="text-xs font-bold uppercase text-slate-400 mb-2">{p.label}</div>
                        <div className="space-y-1">
                            <div className={`text-xs px-2 py-1 rounded ${p.val & 4 ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>Read</div>
                            <div className={`text-xs px-2 py-1 rounded ${p.val & 2 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>Write</div>
                            <div className={`text-xs px-2 py-1 rounded ${p.val & 1 ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}>Execute</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const ListViewer = ({ data }: { data: any }) => {
    if(!data || !data.items) return null;
    return (
        <div className="w-full h-full overflow-auto p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
            <ul className="space-y-1 font-mono text-sm text-slate-700 dark:text-slate-300">
                {data.items.map((item: string, i: number) => (
                    <li key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-1 flex justify-between group">
                        <span>{item}</span>
                        <button onClick={() => navigator.clipboard.writeText(item)} className="opacity-0 group-hover:opacity-100 text-xs text-indigo-500 hover:underline ml-2">Copy</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}

// --- Main Component ---

const TechCalculator: React.FC = () => {
  const { calculatorId } = useParams<{ calculatorId: string }>();
  const config = techCalculators[calculatorId || 'base-converter'] as TechCalculatorConfig;
  const { history, addToHistory, clearHistory } = useTechHistory();

  const [inputs, setInputs] = useState<Record<string, any>>({});
  
  // Initialize defaults
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

  const handleInputChange = (name: string, val: any) => {
      setInputs(prev => ({ ...prev, [name]: val }));
  };

  const handleSave = () => {
     if(result && config) {
         const details = config.inputs.map(i => `${i.label}: ${inputs[i.name]}`).join('\n');
         addToHistory(config.title, `${result.value} ${result.unit || ''}`, details);
     }
  };

  if(!config) return <div className="p-10 text-center">Tool not found</div>;

  const Icon = config.icon;

  return (
    <TechLayout 
        title={config.title} 
        category={config.category} 
        icon={<Icon className="w-6 h-6" />} 
        history={history}
        onClear={clearHistory}
    >
        <SEO 
          title={config.title} 
          description={config.description} 
          keywords={[config.category, 'developer tool', 'tech utility', calculatorId || 'tech']} 
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Panel */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Configuration</span>
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
                                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg appearance-none outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium text-slate-800 dark:text-white transition-all shadow-sm"
                                        >
                                            {input.options.map(o => (
                                                <option key={o.value} value={o.value}>{o.label}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                    </div>
                                ) : input.type === 'textarea' ? (
                                    <textarea
                                        rows={input.rows || 3}
                                        value={inputs[input.name] ?? ''}
                                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-800 dark:text-white shadow-sm resize-y"
                                        placeholder={input.placeholder}
                                    />
                                ) : (
                                    <input 
                                        type={input.type}
                                        value={inputs[input.name] ?? ''}
                                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                                        className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm text-slate-800 dark:text-white shadow-sm"
                                        placeholder={input.placeholder}
                                        min={input.min}
                                        max={input.max}
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
                <div className="flex-grow bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner relative overflow-hidden min-h-[200px] flex items-center justify-center">
                    {result?.diagram?.type === 'binary-visual' && <BinaryVisual data={result.diagram.data} />}
                    {result?.diagram?.type === 'color-preview' && <ColorPreview data={result.diagram.data} />}
                    {result?.diagram?.type === 'json-viewer' && <JSONViewer data={result.diagram.data} />}
                    {result?.diagram?.type === 'calendar' && <CalendarVisual data={result.diagram.data} />}
                    {result?.diagram?.type === 'markdown' && <MarkdownViewer data={result.diagram.data} />}
                    {result?.diagram?.type === 'regex-match' && <RegexViewer data={result.diagram.data} />}
                    {result?.diagram?.type === 'chmod-visual' && <ChmodViewer data={result.diagram.data} />}
                    {result?.diagram?.type === 'list' && <ListViewer data={result.diagram.data} />}
                    {result?.diagram?.type === 'palette-visual' && <PaletteVisual data={result.diagram.data} />}
                    {result?.diagram?.type === 'contrast-check' && <ContrastVisual data={result.diagram.data} />}
                    {result?.diagram?.type === 'gradient-visual' && <GradientVisual data={result.diagram.data} />}
                    
                    {!result?.diagram && (
                        <div className="text-slate-400 text-sm flex flex-col items-center gap-2">
                            <Maximize2 className="w-8 h-8 opacity-20"/>
                            <span>Output Preview</span>
                        </div>
                    )}
                </div>

                {/* Primary Result Box */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest">Output</div>
                            <div className="flex gap-2">
                                <button onClick={() => navigator.clipboard.writeText(result?.value || '')} className="p-1.5 bg-white/10 hover:bg-white/20 rounded transition-colors text-white" title="Copy">
                                    <Copy className="w-4 h-4" />
                                </button>
                                <button onClick={handleSave} className="p-1.5 bg-white text-indigo-600 hover:bg-indigo-50 rounded font-bold transition-colors" title="Log">
                                    <Save className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <div className="font-mono text-xl sm:text-3xl font-bold break-all max-h-40 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20">
                            {result?.value || '---'}
                        </div>
                        <div className="text-indigo-200 text-sm mt-1">{result?.unit}</div>
                    </div>
                </div>

                {/* Details List */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                     <h3 className="font-bold text-slate-700 dark:text-slate-200 text-xs uppercase mb-3 border-b border-slate-100 dark:border-slate-700 pb-2">Details</h3>
                     <div className="space-y-2 font-mono text-xs text-slate-600 dark:text-slate-300">
                         {result?.details.map((line, i) => (
                             <div key={i} className="flex gap-2 items-start">
                                 <span className="text-indigo-500 mt-0.5">•</span>
                                 <span className="break-all">{line}</span>
                             </div>
                         ))}
                         {result?.details.length === 0 && <div className="italic text-slate-400">No additional details</div>}
                     </div>
                </div>

            </div>
        </div>
    </TechLayout>
  );
};

export default TechCalculator;