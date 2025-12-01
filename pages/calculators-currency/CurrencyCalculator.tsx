
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import CurrencyLayout, { useCurrencyHistory } from '../../components/CurrencyLayout';
import { getLatestRates, getHistoricalRate, getRateTrend, CURRENCY_FLAGS, POPULAR_CURRENCIES, getFlagUrl } from '../../utils/currency-api';
import { ArrowRightLeft, Copy, Save, Calendar, RefreshCw, TrendingUp } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import SEO from '../../components/SEO';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const CurrencyCalculator: React.FC = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const { history, addToHistory, clearHistory } = useCurrencyHistory();

  // Common State
  const [amount, setAmount] = useState<number>(10);
  const [base, setBase] = useState<string>('USD');
  const [target, setTarget] = useState<string>('EUR');
  const [rates, setRates] = useState<Record<string, number>>({});
  
  // Default date to yesterday to avoid API errors for "today" if data isn't published yet
  const [date, setDate] = useState<string>(() => {
      const d = new Date();
      d.setDate(d.getDate() - 1); 
      return d.toISOString().split('T')[0];
  });

  const [trendData, setTrendData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Derived Title & Subtitle
  const getMeta = () => {
      switch(toolId) {
          case 'multi': return { title: 'Multi-Currency Converter', subtitle: 'Convert to multiple currencies' };
          case 'historical': return { title: 'Historical Rates', subtitle: 'Past exchange rates lookup' };
          case 'trends': return { title: 'Rate Trends', subtitle: 'Exchange rate history chart' };
          default: return { title: 'Standard Converter', subtitle: 'Live Exchange Rates' };
      }
  };
  const meta = getMeta();

  // Fetch Data Logic
  useEffect(() => {
    const fetchData = async () => {
      // Optimization: No need to fetch if base/target same (unless multi or trends)
      if (toolId !== 'multi' && toolId !== 'trends' && base === target) {
          setRates({ [target]: 1 });
          return;
      }

      setLoading(true);
      try {
        if (toolId === 'trends') {
            // Fetch last 30 days for trend (ending yesterday to ensure data stability)
            const d = new Date();
            d.setDate(d.getDate() - 1);
            const end = d.toISOString().split('T')[0];
            const start = new Date(d.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            
            const data = await getRateTrend(start, end, base, target);
            if (data && data.rates) {
                setTrendData(data.rates);
                setLastUpdated(new Date().toLocaleTimeString());
            }
        } else if (toolId === 'historical') {
            // Always fetch unit rate (1.0) to avoid double multiplication in UI
            // Also ensures API doesn't error if user types 0 in amount
            const data = await getHistoricalRate(date, base, target, 1);
            if (data && data.rates) {
                setRates(data.rates);
                setLastUpdated('Historical Data');
            }
        } else {
            // Standard & Multi
            // Always fetch unit rate (1.0) to avoid double multiplication in UI
            const data = await getLatestRates(base, 1);
            if (data && data.rates) {
                setRates(data.rates);
                setLastUpdated(new Date(data.date).toLocaleDateString());
            }
        }
      } catch (error) {
        console.error("Failed to load currency data", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [base, target, date, toolId]); // Depend only on params, NOT amount

  // Handlers
  const handleSwap = () => {
      setBase(target);
      setTarget(base);
  };

  const handleSave = () => {
      let resultText = '';
      let details = '';
      
      const valAmount = Number(amount);

      if (toolId === 'multi') {
          resultText = `${valAmount} ${base} conversions`;
          details = Object.entries(rates).slice(0, 5).map(([curr, rate]) => `${curr}: ${(Number(rate) * valAmount).toFixed(2)}`).join('\n');
      } else if (toolId === 'historical') {
          const rate = rates[target] || 0;
          resultText = `${(valAmount * rate).toFixed(2)} ${target}`;
          details = `Date: ${date}\nRate: 1 ${base} = ${rate} ${target}`;
      } else if (toolId === 'trends') {
          resultText = 'Trend Chart Saved';
          details = `${base} to ${target} trend analysis`;
      } else {
          const rate = rates[target] || 0;
          resultText = `${(valAmount * rate).toFixed(2)} ${target}`;
          details = `Rate: 1 ${base} = ${rate} ${target}`;
      }
      addToHistory(meta.title, resultText, details);
  };

  // Renderers
  const CurrencySelect = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
      <div className="relative">
          <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 py-3 pl-12 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold text-slate-700 dark:text-white"
          >
              {Object.keys(CURRENCY_FLAGS).map(curr => (
                  <option key={curr} value={curr}>{curr}</option>
              ))}
          </select>
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full overflow-hidden shadow-sm">
              <img src={getFlagUrl(value)} alt={value} className="w-full h-full object-cover" />
          </div>
      </div>
  );

  return (
    <CurrencyLayout 
        title={meta.title} 
        subtitle={meta.subtitle}
        history={history}
        onClear={clearHistory}
    >
        <SEO 
          title={meta.title} 
          description={`${meta.subtitle}. Convert ${base} to ${target}.`} 
          keywords={['currency', 'converter', base, target, 'rate']} 
        />
        <div className="space-y-8">
            
            {/* Control Panel */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    
                    {/* Amount Input */}
                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Amount</label>
                        <input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setAmount(isNaN(val) ? 0 : Math.max(0, val));
                            }}
                            className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono text-lg font-bold outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>

                    {/* Base Currency */}
                    <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-slate-400 uppercase mb-1">From</label>
                        <CurrencySelect value={base} onChange={setBase} />
                    </div>

                    {/* Swap Button (Hidden for Multi) */}
                    {toolId !== 'multi' && (
                        <div className="md:col-span-1 flex justify-center pt-5">
                            <button onClick={handleSwap} className="p-3 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-slate-500 hover:text-amber-600 transition-colors">
                                <ArrowRightLeft className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    {/* Target Currency (Hidden for Multi) */}
                    {toolId !== 'multi' && (
                        <div className="md:col-span-3">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">To</label>
                            <CurrencySelect value={target} onChange={setTarget} />
                        </div>
                    )}

                    {/* Date Picker (Historical Only) */}
                    {toolId === 'historical' && (
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Date</label>
                            <input 
                                type="date" 
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                // Restrict max date to yesterday to ensure data availability
                                max={(() => {
                                    const d = new Date();
                                    d.setDate(d.getDate() - 1);
                                    return d.toISOString().split('T')[0];
                                })()}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Results Display */}
            {toolId === 'multi' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {POPULAR_CURRENCIES.filter(c => c !== base).map(curr => {
                        const rate = rates[curr];
                        // Calculate converted value on client side: Amount * UnitRate
                        const convertedValue = rate ? (amount * rate).toFixed(2) : '...';
                        return (
                            <div key={curr} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-100 shadow-sm">
                                        <img src={getFlagUrl(curr)} alt={curr} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-bold text-slate-700 dark:text-slate-200">{curr}</span>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold text-lg text-slate-900 dark:text-white">
                                        {convertedValue}
                                    </div>
                                    <div className="text-xs text-slate-400">1 {base} = {rate?.toFixed(4)}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : toolId === 'trends' ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-rose-500" /> 30-Day Trend ({base} to {target})
                    </h3>
                    {trendData ? (
                        <div className="h-[350px]">
                            <Line 
                                data={{
                                    labels: Object.keys(trendData),
                                    datasets: [{
                                        label: `${base} to ${target}`,
                                        data: Object.values(trendData).map((d: any) => d[target]),
                                        borderColor: '#f59e0b',
                                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                                        fill: true,
                                        tension: 0.4
                                    }]
                                }}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: { legend: { display: false } },
                                    scales: {
                                        x: { grid: { display: false } },
                                        y: { grid: { color: '#33415520' } }
                                    }
                                }}
                            />
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">Loading chart data...</div>
                    )}
                </div>
            ) : (
                // Standard & Historical Single Result
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="text-amber-100 font-medium tracking-wide uppercase text-sm">Converted Amount</div>
                        <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tight">
                            {rates[target] ? (amount * rates[target]).toFixed(2) : '---'}
                        </div>
                        <div className="text-xl font-medium opacity-90">{target}</div>
                        
                        <div className="mt-6 pt-6 border-t border-white/20 w-full max-w-sm flex justify-between items-center text-sm text-amber-50">
                            <span>1 {base} = {rates[target]?.toFixed(4)} {target}</span>
                            <span>Updated: {lastUpdated}</span>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button onClick={() => navigator.clipboard.writeText((amount * rates[target]).toFixed(2))} className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors" title="Copy">
                                <Copy className="w-5 h-5" />
                            </button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-white text-amber-600 font-bold rounded-lg shadow hover:bg-amber-50 transition-colors">
                                <Save className="w-4 h-4" /> Save Result
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    </CurrencyLayout>
  );
};

export default CurrencyCalculator;
