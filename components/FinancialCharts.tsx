import React from 'react';
import { TrendingUp, PieChart, BarChart3, ShieldCheck, Lock } from 'lucide-react';

// --- Types ---
export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

export interface LineSeries {
  label: string;
  data: number[];
  color: string;
}

export interface ChartProps {
  type: 'donut' | 'line' | 'bar';
  data?: ChartDataPoint[]; // For Donut/Bar
  series?: LineSeries[];   // For Line
  labels?: string[];       // X-axis labels for Line
  title?: string;
  height?: number;
}

// --- Donut Chart ---
const DonutChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  if (total === 0) return <div className="text-center text-slate-400 py-8">No data to display</div>;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
      <div className="relative w-48 h-48 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {data.map((item, i) => {
            const percent = item.value / total;
            const dashArray = `${percent * 100} 100`;
            const offset = -cumulativePercent * 100;
            cumulativePercent += percent;
            
            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={item.color}
                strokeWidth="20"
                strokeDasharray={dashArray}
                strokeDashoffset={offset}
                pathLength="100"
                className="transition-all duration-1000 ease-out"
              />
            );
          })}
        </svg>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 dark:text-slate-300 pointer-events-none transform rotate-90">
            <span className="text-xs font-medium uppercase tracking-wider opacity-70">Total</span>
            <span className="font-bold text-sm">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: "compact", maximumFractionDigits: 1 }).format(total)}
            </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3 w-full max-w-xs">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="text-slate-600 dark:text-slate-300">{item.label}</span>
            </div>
            <div className="flex items-center gap-3">
               <span className="font-medium text-slate-900 dark:text-white">
                  {new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(item.value / total)}
               </span>
               <span className="text-xs text-slate-400 w-16 text-right">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: "compact" }).format(item.value)}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Line Chart ---
const LineChart: React.FC<{ series: LineSeries[], labels?: string[] }> = ({ series, labels }) => {
  if (!series || series.length === 0) return null;

  const width = 100;
  const height = 50;
  const padding = 5;

  // Find max value for scaling
  const allValues = series.flatMap(s => s.data);
  const maxValue = Math.max(...allValues) || 1;
  const pointsCount = series[0].data.length;

  return (
    <div className="w-full space-y-4 py-4">
       <div className="relative w-full aspect-[2/1] bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-800 p-2">
         <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
                <line 
                   key={tick} 
                   x1="0" 
                   y1={height - (tick * height)} 
                   x2={width} 
                   y2={height - (tick * height)} 
                   stroke="currentColor" 
                   className="text-slate-200 dark:text-slate-700" 
                   strokeWidth="0.2" 
                />
            ))}

            {series.map((s, sIdx) => {
               const points = s.data.map((val, i) => {
                 const x = (i / (pointsCount - 1)) * width;
                 const y = height - ((val / maxValue) * height);
                 return `${x},${y}`;
               }).join(' ');

               // Area path (close the loop)
               const areaPoints = `${points} ${width},${height} 0,${height}`;

               return (
                 <g key={sIdx}>
                    <polyline 
                       points={points} 
                       fill="none" 
                       stroke={s.color} 
                       strokeWidth="1.5" 
                       strokeLinecap="round" 
                       strokeLinejoin="round"
                       className="drop-shadow-sm"
                    />
                    {/* Optional: Area fill for first series if singular or specific styling */}
                    {sIdx === 0 && series.length === 1 && (
                        <polygon points={areaPoints} fill={s.color} fillOpacity="0.1" />
                    )}
                 </g>
               );
            })}
         </svg>
         
         {/* Y-Axis Labels (Absolute) */}
         <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-[10px] text-slate-400 pointer-events-none pl-1">
             <span>{new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(maxValue)}</span>
             <span>0</span>
         </div>
       </div>

       {/* Legend */}
       <div className="flex flex-wrap justify-center gap-4">
         {series.map((s, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
               <span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></span>
               <span className="text-slate-600 dark:text-slate-300 font-medium">{s.label}</span>
            </div>
         ))}
       </div>
    </div>
  );
};

// --- Bar Chart ---
const BarChart: React.FC<{ data: ChartDataPoint[] }> = ({ data }) => {
    const maxValue = Math.max(...data.map(d => d.value)) || 1;

    return (
        <div className="space-y-3 py-4">
            {data.map((item, i) => (
                <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                        <span className="text-slate-500">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: "compact" }).format(item.value)}</span>
                    </div>
                    <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${(item.value / maxValue) * 100}%`, backgroundColor: item.color }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
};


// --- Stat Card ---
export const StatCard: React.FC<{ label: string; value: string; icon?: React.ReactNode; subtext?: string }> = ({ label, value, icon, subtext }) => (
  <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-start gap-3 hover:shadow-md transition-shadow">
    {icon && (
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
            {icon}
        </div>
    )}
    <div>
        <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</div>
        <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight mt-0.5">{value}</div>
        {subtext && <div className="text-xs text-slate-400 mt-1">{subtext}</div>}
    </div>
  </div>
);

// --- Trust Badge ---
export const TrustBadges = () => (
    <div className="flex flex-wrap justify-center gap-4 mt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
            <Lock className="w-3 h-3" /> 256-bit Secure
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
             <ShieldCheck className="w-3 h-3" /> Privacy Protected
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
             No Data Saved
        </div>
    </div>
);

// --- Main Chart Renderer ---
const FinancialChart: React.FC<ChartProps> = (props) => {
  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              {props.type === 'donut' && <PieChart className="w-5 h-5 text-emerald-500" />}
              {props.type === 'line' && <TrendingUp className="w-5 h-5 text-blue-500" />}
              {props.type === 'bar' && <BarChart3 className="w-5 h-5 text-purple-500" />}
              {props.title || 'Analysis'}
           </h3>
        </div>
        
        {props.type === 'donut' && props.data && <DonutChart data={props.data} />}
        {props.type === 'line' && props.series && <LineChart series={props.series} labels={props.labels} />}
        {props.type === 'bar' && props.data && <BarChart data={props.data} />}
    </div>
  );
};

export default FinancialChart;