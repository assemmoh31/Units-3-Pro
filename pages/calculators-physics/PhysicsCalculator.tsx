
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PhysicsLayout, { usePhysicsHistory } from '../../components/PhysicsLayout';
import { physicsCalculators, PhysicsCalculatorConfig } from '../../utils/physics-data';
import { Copy, Save, ChevronDown, RefreshCw, Settings2, Maximize2 } from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import SEO from '../../components/SEO';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement);

// --- Unit Definitions & Conversion Logic ---
type UnitDef = {
  label: string;
  factor: number; // Factor to convert TO the standard base unit
  offset?: number;
};

// Map of Dimension -> { UnitKey: UnitDef }
const UNIT_DEFINITIONS: Record<string, Record<string, UnitDef>> = {
  length: {
    'm': { label: 'm', factor: 1 },
    'cm': { label: 'cm', factor: 0.01 },
    'mm': { label: 'mm', factor: 0.001 },
    'km': { label: 'km', factor: 1000 },
    'ft': { label: 'ft', factor: 0.3048 },
    'in': { label: 'in', factor: 0.0254 },
    'mi': { label: 'mi', factor: 1609.34 },
    'nm': { label: 'nm', factor: 1e-9 },
    'µm': { label: 'µm', factor: 1e-6 },
    'AU': { label: 'AU', factor: 1.496e11 },
  },
  mass: {
    'kg': { label: 'kg', factor: 1 },
    'g': { label: 'g', factor: 0.001 },
    'mg': { label: 'mg', factor: 1e-6 },
    'lb': { label: 'lb', factor: 0.453592 },
    'oz': { label: 'oz', factor: 0.0283495 },
    't': { label: 'ton', factor: 1000 },
  },
  time: {
    's': { label: 's', factor: 1 },
    'min': { label: 'min', factor: 60 },
    'hr': { label: 'hr', factor: 3600 },
    'ms': { label: 'ms', factor: 0.001 },
    'yrs': { label: 'yrs', factor: 3.154e7 },
  },
  velocity: {
    'm/s': { label: 'm/s', factor: 1 },
    'km/h': { label: 'km/h', factor: 0.277778 },
    'mph': { label: 'mph', factor: 0.44704 },
    'ft/s': { label: 'ft/s', factor: 0.3048 },
    'kn': { label: 'kn', factor: 0.514444 },
  },
  acceleration: {
    'm/s²': { label: 'm/s²', factor: 1 },
    'ft/s²': { label: 'ft/s²', factor: 0.3048 },
    'g': { label: 'g', factor: 9.80665 },
  },
  force: {
    'N': { label: 'N', factor: 1 },
    'kN': { label: 'kN', factor: 1000 },
    'lbf': { label: 'lbf', factor: 4.44822 },
    'dyne': { label: 'dyne', factor: 1e-5 },
  },
  energy: {
    'J': { label: 'J', factor: 1 },
    'kJ': { label: 'kJ', factor: 1000 },
    'cal': { label: 'cal', factor: 4.184 },
    'kcal': { label: 'kcal', factor: 4184 },
    'eV': { label: 'eV', factor: 1.602e-19 },
    'kWh': { label: 'kWh', factor: 3.6e6 },
  },
  power: {
    'W': { label: 'W', factor: 1 },
    'kW': { label: 'kW', factor: 1000 },
    'hp': { label: 'hp', factor: 745.7 },
  },
  pressure: {
    'Pa': { label: 'Pa', factor: 1 },
    'kPa': { label: 'kPa', factor: 1000 },
    'atm': { label: 'atm', factor: 101325 },
    'bar': { label: 'bar', factor: 100000 },
    'psi': { label: 'psi', factor: 6894.76 },
  },
  temperature: {
    'K': { label: 'K', factor: 1, offset: 0 },
    '°C': { label: '°C', factor: 1, offset: 273.15 },
    '°F': { label: '°F', factor: 0.555556, offset: 255.372 },
  },
  charge: {
     'C': { label: 'C', factor: 1 },
     'mC': { label: 'mC', factor: 1e-3 },
     'µC': { label: 'µC', factor: 1e-6 },
     'nC': { label: 'nC', factor: 1e-9 },
  },
  voltage: {
     'V': { label: 'V', factor: 1 },
     'kV': { label: 'kV', factor: 1000 },
     'mV': { label: 'mV', factor: 0.001 },
  },
  current: {
     'A': { label: 'A', factor: 1 },
     'mA': { label: 'mA', factor: 0.001 },
     'µA': { label: 'µA', factor: 1e-6 },
  },
  resistance: {
     'Ω': { label: 'Ω', factor: 1 },
     'kΩ': { label: 'kΩ', factor: 1000 },
     'MΩ': { label: 'MΩ', factor: 1e6 },
  },
  capacitance: {
     'F': { label: 'F', factor: 1 },
     'mF': { label: 'mF', factor: 1e-3 },
     'µF': { label: 'µF', factor: 1e-6 },
     'nF': { label: 'nF', factor: 1e-9 },
     'pF': { label: 'pF', factor: 1e-12 },
  },
  inductance: {
     'H': { label: 'H', factor: 1 },
     'mH': { label: 'mH', factor: 1e-3 },
     'µH': { label: 'µH', factor: 1e-6 },
  },
  frequency: {
     'Hz': { label: 'Hz', factor: 1 },
     'kHz': { label: 'kHz', factor: 1000 },
     'MHz': { label: 'MHz', factor: 1e6 },
     'GHz': { label: 'GHz', factor: 1e9 },
  },
  angle: {
      'deg': { label: 'deg', factor: 1 },
      'rad': { label: 'rad', factor: 57.2958 },
  },
  volume: {
      'm³': { label: 'm³', factor: 1 },
      'L': { label: 'L', factor: 0.001 },
      'mL': { label: 'mL', factor: 1e-6 },
      'gal': { label: 'gal', factor: 0.00378541 },
  },
  density: {
      'kg/m³': { label: 'kg/m³', factor: 1 },
      'g/cm³': { label: 'g/cm³', factor: 1000 },
  }
};

const getUnitCategory = (unit: string) => {
  for (const [category, units] of Object.entries(UNIT_DEFINITIONS)) {
    if (unit in units) return category;
  }
  return null;
};

const convertToBase = (value: number, fromUnit: string, toUnit: string): number => {
  const category = getUnitCategory(fromUnit);
  if (!category) return value; 
  
  const fromDef = UNIT_DEFINITIONS[category][fromUnit];
  const toDef = UNIT_DEFINITIONS[category][toUnit];

  if(!fromDef || !toDef) return value;
  
  if (category === 'temperature' && fromDef.offset !== undefined && toDef.offset !== undefined) {
      if(fromUnit === '°C' && toUnit === 'K') return value + 273.15;
      if(fromUnit === '°F' && toUnit === 'K') return (value - 32) * 5/9 + 273.15;
      if(fromUnit === 'K' && toUnit === '°C') return value - 273.15;
  }

  return value * (fromDef.factor / toDef.factor);
};


// --- Diagram Components (Unchanged logic, just wrappers if needed) ---
const ProjectileDiagram = ({ data }: { data: any }) => {
   if(!data) return null;
   const { points, range, h_max } = data;
   if (!points || typeof range !== 'number' || typeof h_max !== 'number') return <div className="text-xs text-slate-400 flex items-center justify-center h-full">Data unavailable</div>;
   const max_x = range * 1.1 || 10; 
   const max_y = h_max * 1.5 || 10; 
   const pathData = points.map((p: any, i: number) => `${i===0?'M':'L'} ${(p.x/max_x)*300} ${200 - (p.y/max_y)*200}`).join(' ');

   return (
     <svg viewBox="0 0 300 200" className="w-full h-full">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" className="text-slate-400" />
        <path d={pathData} fill="none" stroke="#6366f1" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="200" x2="300" y2="200" stroke="#94a3b8" strokeWidth="2" />
        <circle cx={(range/max_x)*300} cy="200" r="4" fill="#ef4444" />
        <text x="10" y="20" className="text-xs fill-slate-500 font-mono">Max H: {h_max.toFixed(1)}m</text>
        <text x="250" y="190" className="text-xs fill-slate-500 font-mono">R: {range.toFixed(1)}m</text>
     </svg>
   );
};

// ... [Re-using other diagrams with improved container styling implicitly via parent]
const CircuitDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    return (
    <div className="relative w-full h-full flex items-center justify-center">
       <div className="relative w-40 h-24 border-4 border-amber-400 rounded-sm bg-white dark:bg-slate-900 z-10">
           <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 px-2 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded shadow-sm">
               R = {data.r?.toFixed(1) ?? '?'}Ω
           </div>
           <div className="absolute top-1/2 -left-8 -translate-y-1/2 flex flex-col items-center">
               <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-1">{data.v?.toFixed(1) ?? '?'}V</span>
               <div className="w-6 h-6 rounded-full border-2 border-slate-400 flex items-center justify-center text-[10px] bg-slate-100 dark:bg-slate-800">+ -</div>
           </div>
           <div className="absolute bottom-2 right-2 text-xs text-blue-500 font-bold bg-blue-50 dark:bg-blue-900/30 px-1 rounded">
               I = {data.i?.toFixed(2) ?? '?'}A →
           </div>
       </div>
    </div>
    );
};

const TransformerDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    return (
        <svg viewBox="0 0 300 150" className="w-full h-full">
            <rect x="100" y="30" width="100" height="90" rx="4" fill="none" stroke="#64748b" strokeWidth="8" />
            <path d="M70 40 Q 110 40 110 50 Q 70 50 70 60 Q 110 60 110 70 Q 70 70 70 80 Q 110 80 110 90 Q 70 90 70 100 Q 110 100 110 110" fill="none" stroke="#f59e0b" strokeWidth="3" />
            <text x="30" y="75" className="text-xs fill-slate-500 font-bold">Vp:{data.vp}V</text>
            <path d="M190 40 Q 230 40 230 50 Q 190 50 190 60 Q 230 60 230 70 Q 190 70 190 80 Q 230 80 230 90 Q 190 90 190 100 Q 230 100 230 110" fill="none" stroke="#10b981" strokeWidth="3" />
            <text x="240" y="75" className="text-xs fill-slate-500 font-bold">Vs:{data.vs.toFixed(1)}V</text>
        </svg>
    )
}

const LCDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    return (
    <div className="relative w-full h-full flex items-center justify-center gap-8">
       <div className="flex flex-col items-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
            <svg width="60" height="40" viewBox="0 0 60 40"><path d="M0 20 Q10 0 20 20 Q30 40 40 20 Q50 0 60 20" fill="none" stroke="#ef4444" strokeWidth="3" /></svg>
            <span className="text-xs text-slate-500 mt-1 font-mono">L: {data.l}mH</span>
       </div>
       <div className="h-0.5 w-10 bg-slate-400"></div>
       <div className="flex flex-col items-center p-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
            <div className="flex gap-1 items-center"><div className="w-0.5 h-8 bg-slate-700 dark:bg-slate-300"></div><div className="w-0.5 h-8 bg-slate-700 dark:bg-slate-300"></div></div>
            <span className="text-xs text-slate-500 mt-1 font-mono">C: {data.c}µF</span>
       </div>
       <div className="absolute top-4 right-4 text-xs font-bold text-violet-500 bg-violet-50 dark:bg-violet-900/30 px-2 py-1 rounded shadow-sm border border-violet-100 dark:border-violet-800">
           f₀ = {data.f.toFixed(0)} Hz
       </div>
    </div>
    )
}

const VoltageDividerDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    return (
        <svg viewBox="0 0 200 150" className="w-full h-full">
             <line x1="100" y1="10" x2="100" y2="40" stroke="#94a3b8" strokeWidth="2" />
             <rect x="85" y="40" width="30" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
             <text x="125" y="52" className="text-xs fill-slate-500 font-mono">R1</text>
             <line x1="100" y1="55" x2="100" y2="85" stroke="#94a3b8" strokeWidth="2" />
             <line x1="100" y1="85" x2="140" y2="85" stroke="#94a3b8" strokeWidth="2" />
             <circle cx="140" cy="85" r="3" fill="#ef4444" />
             <text x="150" y="88" className="text-xs fill-red-500 font-bold">Vout ({data.vout.toFixed(1)}V)</text>
             <rect x="85" y="85" width="30" height="15" fill="none" stroke="#f59e0b" strokeWidth="2" />
             <text x="125" y="97" className="text-xs fill-slate-500 font-mono">R2</text>
             <line x1="100" y1="100" x2="100" y2="130" stroke="#94a3b8" strokeWidth="2" />
             <text x="30" y="75" className="text-xs fill-slate-500 font-bold">Vin ({data.vin}V)</text>
        </svg>
    )
}

const ResistorDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    return (
        <svg viewBox="0 0 300 100" className="w-full h-full">
             {data.mode === 'series' ? (
                 <>
                   <line x1="20" y1="50" x2="80" y2="50" stroke="#94a3b8" strokeWidth="2" />
                   <rect x="80" y="40" width="60" height="20" fill="none" stroke="#f59e0b" strokeWidth="2" />
                   <text x="110" y="30" textAnchor="middle" className="text-xs fill-slate-500 font-mono">R1</text>
                   <line x1="140" y1="50" x2="180" y2="50" stroke="#94a3b8" strokeWidth="2" />
                   <rect x="180" y="40" width="60" height="20" fill="none" stroke="#f59e0b" strokeWidth="2" />
                   <text x="210" y="30" textAnchor="middle" className="text-xs fill-slate-500 font-mono">R2</text>
                   <line x1="240" y1="50" x2="280" y2="50" stroke="#94a3b8" strokeWidth="2" />
                 </>
             ) : (
                 <>
                   <path d="M20 50 L80 50 M80 20 L80 80 M80 20 L110 20 M170 20 L200 20 M200 20 L200 80 M80 80 L110 80 M170 80 L200 80 M200 50 L280 50" stroke="#94a3b8" strokeWidth="2" fill="none" />
                   <rect x="110" y="10" width="60" height="20" fill="none" stroke="#f59e0b" strokeWidth="2" />
                   <text x="140" y="45" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">R1</text>
                   <rect x="110" y="70" width="60" height="20" fill="none" stroke="#f59e0b" strokeWidth="2" />
                   <text x="140" y="65" textAnchor="middle" className="text-[10px] fill-slate-500 font-mono">R2</text>
                 </>
             )}
        </svg>
    )
};

const RayDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    const incidentRad = (90 - (data.theta1 ?? 0)) * (Math.PI/180); 
    const x1 = 150 - Math.cos(incidentRad)*100;
    const y1 = 100 - Math.sin(incidentRad)*100;
    const refractRad = (90 - (data.theta2 ?? 0)) * (Math.PI/180);
    const x2 = 150 + Math.cos(refractRad)*100;
    const y2 = 100 + Math.sin(refractRad)*100;

    return (
        <svg viewBox="0 0 300 200" className="w-full h-full">
            <rect x="0" y="0" width="300" height="100" fill="#e0f2fe" opacity="0.5" />
            <rect x="0" y="100" width="300" height="100" fill="#bae6fd" opacity="0.5" />
            <line x1="150" y1="0" x2="150" y2="200" stroke="#94a3b8" strokeDasharray="4" />
            <line x1="0" y1="100" x2="300" y2="100" stroke="#64748b" />
            <line x1={x1} y1={y1} x2="150" y2="100" stroke="#ef4444" strokeWidth="2" />
            <line x1="150" y1="100" x2={x2} y2={y2} stroke="#ef4444" strokeWidth="2" />
            <text x="10" y="90" className="text-xs fill-slate-500">n1={data.n1}</text>
            <text x="10" y="120" className="text-xs fill-slate-500">n2={data.n2}</text>
        </svg>
    );
};

const OrbitDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950/50">
        <div className="w-12 h-12 bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] z-10 relative">
             <div className="absolute inset-0 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
        </div>
        <div className="absolute w-32 h-32 border border-slate-600 rounded-full border-dashed animate-spin-slow" style={{ animationDuration: '10s' }}></div>
        <div className="absolute w-32 h-32 animate-spin-slow" style={{ animationDuration: '4s' }}>
             <div className="w-3 h-3 bg-white rounded-full absolute -top-1.5 left-1/2 -translate-x-1/2 shadow-[0_0_10px_white]"></div>
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-slate-400 font-mono">
            {data.v > 0 ? `v = ${data.v?.toFixed(0)} m/s` : `r = ${data.r} m`}
        </div>
    </div>
    );
};

const WaveDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    const freq = Math.min((data.f ?? 10) / 10, 20); 
    const points = [];
    for(let x=0; x<=300; x+=5) {
        const y = 100 + 40 * Math.sin((x/300) * freq * Math.PI * 2);
        points.push(`${x},${y}`);
    }
    return (
        <svg viewBox="0 0 300 200" className="w-full h-full">
            <polyline points={points.join(' ')} fill="none" stroke="#3b82f6" strokeWidth="2" />
            <line x1="0" y1="100" x2="300" y2="100" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
        </svg>
    );
}

const ForceDiagram = ({ data }: { data: any }) => (
    <div className="w-full h-full flex items-center justify-center gap-16 relative">
         <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs z-10 shadow-sm border border-slate-300 dark:border-slate-600">
             {data.type === 'charge' ? (data.m1 > 0 ? '+' : '-') : 'M1'}
         </div>
         {data.type !== 'field' && (
             <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs z-10 shadow-sm border border-slate-300 dark:border-slate-600">
                 {data.type === 'charge' ? (data.m2 > 0 ? '+' : '-') : 'M2'}
             </div>
         )}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center items-center">
              <div className="h-0.5 w-32 bg-slate-300 dark:bg-slate-600"></div>
              {data.type === 'field' && <div className="absolute text-xs text-slate-500 -mt-4 bg-white dark:bg-slate-800 px-1">Field →</div>}
         </div>
    </div>
);

const LensDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    const scale = 2; 
    const doPos = 150 - ((data.do ?? 20) * scale);
    const diPos = 150 + ((data.di ?? 20) * scale);
    return (
        <svg viewBox="0 0 300 200" className="w-full h-full">
             <line x1="0" y1="100" x2="300" y2="100" stroke="#94a3b8" /> 
             <ellipse cx="150" cy="100" rx="4" ry="70" fill="#bfdbfe" opacity="0.3" stroke="#3b82f6" strokeWidth="1" /> 
             <line x1={doPos} y1="100" x2={doPos} y2="70" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
             <text x={doPos-10} y="120" className="text-[10px] fill-slate-500 font-mono">Object</text>
             <line x1={diPos} y1="100" x2={diPos} y2="130" stroke="#f59e0b" strokeWidth="3" />
             <text x={diPos-10} y="90" className="text-[10px] fill-slate-500 font-mono">Image</text>
             <circle cx="150" cy="100" r="2" fill="#3b82f6" />
        </svg>
    )
}

const GasDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    return (
    <div className="w-full h-full flex items-center justify-center p-4">
        <div className="w-40 h-40 border-2 border-slate-400 dark:border-slate-500 relative overflow-hidden rounded bg-white dark:bg-slate-900/50 shadow-inner">
             {Array.from({length: 15}).map((_,i) => (
                 <div key={i} className="absolute w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce opacity-80" 
                      style={{ 
                          top: `${Math.random()*100}%`, 
                          left: `${Math.random()*100}%`,
                          animationDuration: `${1000/(data.t || 300)}s` 
                      }}>
                 </div>
             ))}
             <div className="absolute bottom-1 right-1 text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-1 rounded">{data.p?.toFixed(1) ?? '?'} atm</div>
        </div>
    </div>
    );
};

const DiffractionDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    const points = [];
    for(let i=0; i<=300; i++) {
        const x = (i - 150) / 30; 
        const y = x === 0 ? 1 : Math.pow(Math.sin(x)/x, 2);
        points.push(`${i},${200 - y*180}`);
    }
    return (
        <svg viewBox="0 0 300 200" className="w-full h-full bg-slate-900">
             <polyline points={points.join(' ')} fill="none" stroke="#f43f5e" strokeWidth="2" />
             <text x="10" y="20" className="text-xs fill-slate-500">Intensity Pattern</text>
        </svg>
    );
};

const DecayDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    const { n0, half, t } = data;
    const points = [];
    const maxT = Math.max(t * 1.5, half * 5);
    for(let i=0; i<=20; i++) {
        const time = (maxT / 20) * i;
        const val = n0 * Math.pow(0.5, time/half);
        points.push({x: time.toFixed(1), y: val});
    }

    return (
        <div className="w-full h-full relative p-2">
            <Line 
               data={{
                  labels: points.map(p => p.x),
                  datasets: [{
                     label: 'Remaining',
                     data: points.map(p => p.y),
                     borderColor: '#10b981',
                     tension: 0.4,
                     pointRadius: 0,
                     borderWidth: 2
                  }]
               }}
               options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { display: false }, y: { display: false } } }}
            />
        </div>
    )
};

const StarDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    let color = '#f59e0b';
    if(data.t > 10000) color = '#3b82f6';
    else if(data.t > 6000) color = '#fff';
    else if(data.t < 3500) color = '#ef4444';
    const size = Math.min(80, Math.max(20, data.r * 10));

    return (
        <div className="w-full h-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
             <div 
               className="rounded-full shadow-[0_0_50px_currentColor] transition-all duration-500 relative z-10"
               style={{ 
                   width: `${size}px`, 
                   height: `${size}px`, 
                   backgroundColor: color,
                   color: color 
               }}
             ></div>
             <div className="absolute bottom-2 right-2 text-xs text-slate-500 font-mono">
                T: {data.t}K
             </div>
        </div>
    );
};

const BuoyancyDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    return (
        <svg viewBox="0 0 300 200" className="w-full h-full">
            <rect x="50" y="80" width="200" height="120" fill="#bae6fd" opacity="0.6" stroke="#0ea5e9" />
            <line x1="50" y1="80" x2="250" y2="80" stroke="#0ea5e9" strokeWidth="2" />
            <rect x="120" y="100" width="60" height="60" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
            <line x1="150" y1="130" x2="150" y2="60" stroke="#ef4444" strokeWidth="3" />
            <polygon points="150,55 145,65 155,65" fill="#ef4444" />
            <text x="160" y="70" className="text-xs fill-red-500 font-bold">Fb = {data.fb.toFixed(0)}N</text>
        </svg>
    )
}

const PendulumDiagram = ({ data }: { data: any }) => {
    if (!data) return null;
    return (
        <div className="relative w-full h-full flex justify-center overflow-hidden">
             <div className="origin-top animate-swing mt-2" style={{ animationDuration: `${Math.max(1, data.t)}s` }}>
                 <div className="w-0.5 bg-slate-800 dark:bg-slate-300 mx-auto" style={{ height: `${Math.min(140, data.l * 30)}px` }}></div>
                 <div className="w-8 h-8 rounded-full bg-violet-500 -mt-1 mx-auto shadow-lg"></div>
             </div>
             <div className="absolute top-2 right-2 text-xs text-slate-500 font-mono">T = {data.t.toFixed(2)}s</div>
             <style>{`
               @keyframes swing {
                 0% { transform: rotate(15deg); }
                 50% { transform: rotate(-15deg); }
                 100% { transform: rotate(15deg); }
               }
               .animate-swing { animation: swing infinite ease-in-out; }
             `}</style>
        </div>
    )
}

const TorqueDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    const angleRad = (data.theta ?? 90) * (Math.PI / 180);
    const len = 100;
    const endX = 150 + len;
    const endY = 100;
    const fx = endX + 40 * Math.cos(angleRad);
    const fy = endY - 40 * Math.sin(angleRad); 

    return (
        <svg viewBox="0 0 300 200" className="w-full h-full">
             <circle cx="150" cy="100" r="5" fill="#94a3b8" />
             <line x1="150" y1="100" x2={endX} y2={endY} stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
             <text x="180" y="120" className="text-xs fill-slate-500 font-mono">r = {data.r}m</text>
             <line x1={endX} y1={endY} x2={fx} y2={fy} stroke="#ef4444" strokeWidth="3" />
             <polygon points={`${fx},${fy} ${fx-5},${fy+5} ${fx+5},${fy+5}`} fill="#ef4444" transform={`rotate(${90-data.theta} ${fx} ${fy})`} />
             <path d={`M ${endX-20} ${endY} A 20 20 0 0 0 ${endX + 20*Math.cos(angleRad)} ${endY - 20*Math.sin(angleRad)}`} fill="none" stroke="#f59e0b" />
             <text x={endX+10} y={endY-10} className="text-xs fill-amber-500">{data.theta}°</text>
        </svg>
    )
}

const DopplerDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    return (
        <div className="relative w-full h-full bg-slate-900 overflow-hidden flex items-center justify-center">
            <div className="absolute w-4 h-4 bg-red-500 rounded-full z-10 animate-pulse"></div>
            {[1,2,3,4].map(i => (
                <div key={i} className="absolute rounded-full border border-blue-500 opacity-50" 
                     style={{
                         width: `${i*40}px`,
                         height: `${i*40}px`,
                         left: `calc(50% - ${i*20}px + ${data.vs > 0 ? i*10 : 0}px)`, 
                         top: `calc(50% - ${i*20}px)`
                     }}>
                </div>
            ))}
            <div className="absolute bottom-2 text-xs text-slate-400 font-mono">v_source: {data.vs} m/s</div>
        </div>
    )
}

const FlowDiagram = ({ data }: { data: any }) => {
    if(!data) return null;
    return (
        <div className="relative w-full h-full flex items-center justify-center">
             <svg width="200" height="100" viewBox="0 0 200 100">
                 <path d="M0 20 L200 20 L200 80 L0 80 Z" fill="#bae6fd" stroke="#0ea5e9" strokeWidth="2" opacity="0.3" />
                 <line x1="20" y1="50" x2="180" y2="50" stroke="#0284c7" strokeWidth="2" strokeDasharray="5,5" />
                 <polygon points="180,50 170,45 170,55" fill="#0284c7" />
                 <text x="100" y="45" textAnchor="middle" className="text-xs fill-slate-500 font-bold">Q = {data.q.toFixed(2)}</text>
             </svg>
        </div>
    )
}

// --- Main Calculator Component ---
const PhysicsCalculator: React.FC = () => {
  const { calculatorId, category } = useParams<{ calculatorId: string, category: string }>();
  const config = physicsCalculators[calculatorId || 'projectile-motion'] as PhysicsCalculatorConfig;
  
  const { history, addToHistory, clearHistory } = usePhysicsHistory();

  const [activeModeIdx, setActiveModeIdx] = useState(0);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [selectedUnits, setSelectedUnits] = useState<Record<string, string>>({});
  
  const activeMode = config ? config.solveModes[activeModeIdx] : null;

  useEffect(() => {
    if(activeMode) {
        const defaults: Record<string, number> = {};
        const defaultUnits: Record<string, string> = {};
        
        activeMode.inputs.forEach(i => {
            defaults[i.name] = i.defaultValue;
            defaultUnits[i.name] = i.unit; 
        });
        
        setInputs(defaults);
        setSelectedUnits(defaultUnits);
    }
  }, [activeMode, config?.id]);

  const result = useMemo(() => {
      try {
          if (!activeMode || !activeMode.inputs.every(input => typeof inputs[input.name] === 'number')) {
              return null;
          }
          const normalizedInputs: Record<string, number> = {};
          activeMode.inputs.forEach(input => {
              const val = inputs[input.name];
              const selectedUnit = selectedUnits[input.name] || input.unit;
              const baseUnit = input.unit;
              normalizedInputs[input.name] = convertToBase(val, selectedUnit, baseUnit);
          });
          return activeMode.calculate(normalizedInputs);
      } catch(e) {
          return null;
      }
  }, [inputs, selectedUnits, activeMode]);

  const handleInputChange = (name: string, val: string) => {
      setInputs(prev => ({ ...prev, [name]: parseFloat(val) || 0 }));
  };

  const handleUnitChange = (name: string, unit: string) => {
      setSelectedUnits(prev => ({ ...prev, [name]: unit }));
  };

  const handleSave = () => {
     if(result && activeMode) {
         const details = activeMode.inputs.map(i => {
             const unit = selectedUnits[i.name] || i.unit;
             return `${i.label}: ${inputs[i.name]} ${unit}`;
         }).join('\n');
         addToHistory(config.title, `${result.value.toFixed(2)} ${result.unit}`, details);
     }
  };

  if(!config) return <div className="p-10 text-center">Calculator not found</div>;

  const Icon = config.icon;

  return (
    <PhysicsLayout 
        title={config.title} 
        category={config.category} 
        icon={<Icon className="w-6 h-6" />} 
        history={history}
        onClear={clearHistory}
    >
        <SEO 
          title={config.title} 
          description={config.description} 
          keywords={[config.category, 'physics', 'calculator', 'science', 'solver']} 
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Controls */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* Mode Selector */}
                {config.solveModes.length > 1 && (
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                           <Settings2 className="w-3 h-3" /> Calculation Mode
                        </label>
                        <div className="relative">
                            <select 
                                className="w-full appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white py-3 px-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 font-medium shadow-sm transition-all hover:border-violet-300"
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

                {/* Inputs Panel */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Variables</span>
                    </div>
                    <div className="p-5 space-y-6">
                        {activeMode && activeMode.inputs.map(input => {
                            const unitCategory = getUnitCategory(input.unit);
                            const availableUnits = unitCategory ? UNIT_DEFINITIONS[unitCategory] : null;

                            return (
                            <div key={input.name} className="group">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-violet-600 transition-colors">
                                        {input.label}
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number"
                                            value={inputs[input.name] ?? ''}
                                            onChange={(e) => handleInputChange(input.name, e.target.value)}
                                            className="w-20 p-1 text-right bg-transparent border-b border-slate-300 dark:border-slate-600 focus:border-violet-500 outline-none font-mono text-sm text-slate-900 dark:text-white"
                                        />
                                        {availableUnits ? (
                                            <div className="relative">
                                                <select 
                                                    value={selectedUnits[input.name] || input.unit}
                                                    onChange={(e) => handleUnitChange(input.name, e.target.value)}
                                                    className="appearance-none bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold py-1 px-2 pr-6 rounded cursor-pointer hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                                >
                                                    {Object.keys(availableUnits).map(u => (
                                                        <option key={u} value={u}>{u}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                            </div>
                                        ) : (
                                            <span className="text-xs font-bold text-slate-400 px-2">{input.unit}</span>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Custom Slider */}
                                <div className="relative h-6 flex items-center">
                                    <input 
                                        type="range"
                                        min={input.min}
                                        max={input.max}
                                        step={input.step}
                                        value={inputs[input.name] ?? input.defaultValue}
                                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                                        className="absolute w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer focus:outline-none focus:bg-violet-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-violet-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
                                    />
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right Column: Visualization & Results */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* 1. Diagram Viewer (Blueprint Style) */}
                <div className="flex-grow bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner relative overflow-hidden min-h-[280px] flex flex-col">
                    <div className="absolute inset-0 pointer-events-none" 
                        style={{ 
                            backgroundImage: `radial-gradient(${localStorage.getItem('app-theme') === 'dark' ? '#334155' : '#cbd5e1'} 1px, transparent 1px)`, 
                            backgroundSize: '20px 20px' 
                        }}
                    ></div>
                    
                    <div className="absolute top-3 left-4 z-10">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-white/50 dark:bg-black/20 px-2 py-1 rounded backdrop-blur-sm border border-slate-200 dark:border-slate-700/50">
                            {result?.diagram?.type ? `${result.diagram.type.toUpperCase()} VIEW` : 'NO SIGNAL'}
                        </span>
                    </div>

                    <div className="flex-grow relative p-6 flex items-center justify-center">
                        {result?.diagram?.type === 'projectile' && <ProjectileDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'circuit' && <CircuitDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'ray' && <RayDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'orbit' && <OrbitDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'wave' && <WaveDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'forces' && <ForceDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'lens' && <LensDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'gas' && <GasDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'resistor' && <ResistorDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'transformer' && <TransformerDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'lc-circuit' && <LCDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'voltage-divider' && <VoltageDividerDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'interference' && <DiffractionDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'decay' && <DecayDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'star' && <StarDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'buoyancy' && <BuoyancyDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'pendulum' && <PendulumDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'torque' && <TorqueDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'doppler' && <DopplerDiagram data={result.diagram.data} />}
                        {result?.diagram?.type === 'flow' && <FlowDiagram data={result.diagram.data} />}
                        
                        {result?.diagram?.type === 'bar' && result.diagram.data && (
                             <div className="w-full h-full relative p-4">
                                <Bar 
                                   data={{
                                     labels: result.diagram.data.map((d: any) => d.label),
                                     datasets: [{
                                       label: config.title,
                                       data: result.diagram.data.map((d: any) => d.value),
                                       backgroundColor: result.diagram.data.map((d: any) => d.color),
                                       borderRadius: 4,
                                       barThickness: 40
                                     }]
                                   }}
                                   options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { display: false } } } }} 
                                />
                             </div>
                        )}
                        {!result?.diagram && <div className="text-slate-400 text-sm flex flex-col items-center gap-2"><Maximize2 className="w-8 h-8 opacity-20"/>Input parameters to visualize</div>}
                    </div>
                </div>

                {/* 2. Result Card (Glassmorphism) */}
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>

                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="text-xs font-bold text-violet-200 uppercase tracking-widest mb-1">Calculated Result</div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tighter">
                                   {typeof result?.value === 'number' && !isNaN(result.value) ? 
                                      (Math.abs(result.value) < 0.001 || Math.abs(result.value) > 99999 ? result.value.toExponential(3).replace('e+', 'e') : result.value.toLocaleString(undefined, { maximumFractionDigits: 3 })) 
                                      : '---'}
                                </span>
                                <span className="text-xl text-violet-200 font-medium">{result?.unit ?? ''}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => navigator.clipboard.writeText(result?.value.toString() || '')} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white backdrop-blur-sm" title="Copy Value">
                                <Copy className="w-4 h-4" />
                            </button>
                            <button onClick={handleSave} className="flex items-center gap-2 px-3 py-2 bg-white text-violet-700 hover:bg-violet-50 font-bold text-xs uppercase rounded-lg shadow-lg transition-colors">
                                <Save className="w-3 h-3" /> Save
                            </button>
                        </div>
                    </div>
                </div>

                {/* 3. Steps Panel */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                     <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-700">
                         <div className="p-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 rounded">
                             <RefreshCw className="w-3.5 h-3.5" />
                         </div>
                         <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Derivation Steps</h3>
                     </div>
                     <div className="space-y-3 font-mono text-sm">
                         {result?.steps?.map((step, i) => (
                             <div key={i} className="flex gap-3 text-slate-600 dark:text-slate-300">
                                 <span className="text-slate-400 select-none text-xs pt-1">0{i+1}</span>
                                 <p className="bg-slate-50 dark:bg-slate-900/50 px-2 py-1 rounded w-full border border-slate-100 dark:border-slate-700/50">{step}</p>
                             </div>
                         ))}
                         {!result?.steps && <div className="text-slate-400 text-xs italic pl-7">Awaiting inputs...</div>}
                     </div>
                </div>

            </div>

        </div>
    </PhysicsLayout>
  );
};

export default PhysicsCalculator;
