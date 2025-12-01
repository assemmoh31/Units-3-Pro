
import { FlaskConical, Atom, TestTube, Thermometer, Wind, Zap, Scale, Droplets, Microscope, Layers, ArrowRightLeft, Flame } from 'lucide-react';

// Common Atomic Masses for Moles <-> Grams
export const ATOMIC_MASSES: Record<string, number> = {
  'H': 1.008, 'He': 4.003, 'Li': 6.94, 'Be': 9.012, 'B': 10.81, 'C': 12.011, 'N': 14.007, 'O': 15.999,
  'F': 18.998, 'Ne': 20.180, 'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Si': 28.085, 'P': 30.974,
  'S': 32.06, 'Cl': 35.45, 'K': 39.098, 'Ca': 40.078, 'Fe': 55.845, 'Cu': 63.546, 'Zn': 65.38,
  'Ag': 107.87, 'Au': 196.97, 'Pb': 207.2
};

export interface ChemistryInput {
  name: string;
  label: string;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string;
  type?: 'number' | 'text' | 'select';
  options?: string[]; // For select types
}

export interface ChemistryResult {
  value: number | string;
  unit: string;
  steps: string[];
  diagram?: {
    type: 'beaker' | 'gas' | 'titration' | 'bar' | 'ph-scale' | 'energy' | 'cell' | 'beer-lambert' | 'energy-profile';
    data: any;
  };
}

export interface ChemistryCalculatorConfig {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: any;
  solveModes: {
    target: string;
    label: string;
    inputs: ChemistryInput[];
    calculate: (values: Record<string, any>) => ChemistryResult;
  }[];
}

export const chemistryCategories = [
  { id: 'solutions', title: 'Solutions & Conc.', icon: FlaskConical, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/20' },
  { id: 'stoichiometry', title: 'Stoichiometry', icon: Scale, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
  { id: 'gas-laws', title: 'Gas Laws', icon: Wind, color: 'text-sky-500', bg: 'bg-sky-100 dark:bg-sky-900/20' },
  { id: 'thermochemistry', title: 'Thermochemistry', icon: Thermometer, color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/20' },
  { id: 'acids-bases', title: 'Acids & Bases', icon: Droplets, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
  { id: 'electrochemistry', title: 'Electrochemistry', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/20' },
  { id: 'lab-tools', title: 'Lab Tools', icon: Microscope, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/20' },
  { id: 'converters', title: 'Converters', icon: ArrowRightLeft, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' },
];

export const chemistryCalculators: Record<string, ChemistryCalculatorConfig> = {
  // --- SOLUTIONS ---
  'molarity': {
    id: 'molarity',
    title: 'Molarity Calculator',
    category: 'Solutions & Conc.',
    description: 'Calculate Molarity, Moles, or Volume.',
    icon: FlaskConical,
    solveModes: [
      {
        target: 'M',
        label: 'Molarity (M)',
        inputs: [
          { name: 'n', label: 'Moles Solute', unit: 'mol', defaultValue: 0.5, min: 0, step: 0.01 },
          { name: 'v', label: 'Volume Solution', unit: 'L', defaultValue: 1, min: 0.001, step: 0.01 }
        ],
        calculate: (v) => ({
          value: v.n / v.v,
          unit: 'M',
          steps: ['M = n / V', `M = ${v.n} mol / ${v.v} L`],
          diagram: { type: 'beaker', data: { fill: 0.8, particles: Math.min(20, v.n * 10), label: 'Solute' } }
        })
      },
      {
        target: 'n',
        label: 'Moles (n)',
        inputs: [
          { name: 'M', label: 'Molarity', unit: 'M', defaultValue: 0.5, min: 0, step: 0.01 },
          { name: 'v', label: 'Volume', unit: 'L', defaultValue: 1, min: 0, step: 0.01 }
        ],
        calculate: (v) => ({
          value: v.M * v.v,
          unit: 'mol',
          steps: ['n = M × V', `n = ${v.M} M × ${v.v} L`],
          diagram: { type: 'beaker', data: { fill: 0.8, particles: Math.min(20, v.M * 10), label: 'Solute' } }
        })
      }
    ]
  },
  'dilution': {
    id: 'dilution',
    title: 'Dilution Calculator',
    category: 'Solutions & Conc.',
    description: 'C₁V₁ = C₂V₂',
    icon: FlaskConical,
    solveModes: [
      {
        target: 'v2',
        label: 'Final Volume (V₂)',
        inputs: [
          { name: 'c1', label: 'Initial Conc (C₁)', unit: 'M', defaultValue: 10 },
          { name: 'v1', label: 'Initial Vol (V₁)', unit: 'mL', defaultValue: 50 },
          { name: 'c2', label: 'Final Conc (C₂)', unit: 'M', defaultValue: 1 }
        ],
        calculate: (v) => {
          const v2 = (v.c1 * v.v1) / v.c2;
          return {
            value: v2,
            unit: 'mL',
            steps: ['C₁V₁ = C₂V₂', `V₂ = (${v.c1} × ${v.v1}) / ${v.c2}`, `Add ${(v2 - v.v1).toFixed(2)} mL of solvent`],
            diagram: { type: 'beaker', data: { fill: 0.9, particles: 10, label: 'Diluted' } }
          };
        }
      }
    ]
  },
  'percent-conc': {
    id: 'percent-conc',
    title: 'Percent Concentration',
    category: 'Solutions & Conc.',
    description: 'Calculate % w/w or % v/v.',
    icon: FlaskConical,
    solveModes: [
      {
        target: 'ww',
        label: '% Mass (w/w)',
        inputs: [
          { name: 'm_solute', label: 'Mass Solute', unit: 'g', defaultValue: 5 },
          { name: 'm_total', label: 'Total Mass', unit: 'g', defaultValue: 100 }
        ],
        calculate: (v) => ({
          value: (v.m_solute / v.m_total) * 100,
          unit: '%',
          steps: ['% w/w = (mass solute / total mass) * 100', `% = (${v.m_solute} / ${v.m_total}) * 100`],
          diagram: { type: 'beaker', data: { fill: 0.5, particles: 15, label: 'Solution' } }
        })
      }
    ]
  },
  'solution-prep': {
    id: 'solution-prep',
    title: 'Solution Preparation',
    category: 'Solutions & Conc.',
    description: 'Calculate mass required for a solution.',
    icon: Scale,
    solveModes: [
      {
        target: 'mass',
        label: 'Mass Required',
        inputs: [
          { name: 'v', label: 'Volume', unit: 'L', defaultValue: 1, min: 0.1 },
          { name: 'c', label: 'Concentration', unit: 'M', defaultValue: 0.5 },
          { name: 'mw', label: 'Molar Mass', unit: 'g/mol', defaultValue: 58.44 } // NaCl approx
        ],
        calculate: (v) => ({
          value: v.c * v.v * v.mw,
          unit: 'g',
          steps: ['Mass = Molarity × Volume × MW', `Mass = ${v.c} × ${v.v} × ${v.mw}`],
          diagram: { type: 'beaker', data: { fill: 0.5, particles: 20, label: 'Add Solid' } }
        })
      }
    ]
  },

  // --- GAS LAWS ---
  'ideal-gas': {
    id: 'ideal-gas',
    title: 'Ideal Gas Law',
    category: 'Gas Laws',
    description: 'PV = nRT',
    icon: Wind,
    solveModes: [
      {
        target: 'P',
        label: 'Pressure (P)',
        inputs: [
          { name: 'n', label: 'Moles', unit: 'mol', defaultValue: 1 },
          { name: 'T', label: 'Temp', unit: 'K', defaultValue: 298 },
          { name: 'V', label: 'Volume', unit: 'L', defaultValue: 22.4 }
        ],
        calculate: (v) => {
          const R = 0.0821; // L atm / mol K
          const P = (v.n * R * v.T) / v.V;
          return {
            value: P,
            unit: 'atm',
            steps: ['PV = nRT', `P = (${v.n} × ${R} × ${v.T}) / ${v.V}`],
            diagram: { type: 'gas', data: { n: v.n, v: v.V, t: v.T, p: P, maxV: 50 } }
          }
        }
      },
      {
        target: 'V',
        label: 'Volume (V)',
        inputs: [
          { name: 'n', label: 'Moles', unit: 'mol', defaultValue: 1 },
          { name: 'T', label: 'Temp', unit: 'K', defaultValue: 298 },
          { name: 'P', label: 'Pressure', unit: 'atm', defaultValue: 1 }
        ],
        calculate: (v) => {
          const R = 0.0821;
          const Vol = (v.n * R * v.T) / v.P;
          return {
            value: Vol,
            unit: 'L',
            steps: ['V = nRT / P', `V = (${v.n} × ${R} × ${v.T}) / ${v.P}`],
            diagram: { type: 'gas', data: { n: v.n, v: Vol, t: v.T, p: v.P, maxV: 100 } }
          }
        }
      }
    ]
  },
  'combined-gas': {
    id: 'combined-gas',
    title: 'Combined Gas Law',
    category: 'Gas Laws',
    description: 'P1V1/T1 = P2V2/T2',
    icon: Wind,
    solveModes: [
      {
        target: 'v2',
        label: 'Solve for V2',
        inputs: [
          { name: 'p1', label: 'P1', unit: 'atm', defaultValue: 1 },
          { name: 'v1', label: 'V1', unit: 'L', defaultValue: 5 },
          { name: 't1', label: 'T1', unit: 'K', defaultValue: 300 },
          { name: 'p2', label: 'P2', unit: 'atm', defaultValue: 2 },
          { name: 't2', label: 'T2', unit: 'K', defaultValue: 300 }
        ],
        calculate: (v) => {
          const v2 = (v.p1 * v.v1 * v.t2) / (v.p2 * v.t1);
          return {
            value: v2,
            unit: 'L',
            steps: ['P1V1/T1 = P2V2/T2', `V2 = (P1*V1*T2) / (P2*T1)`, `V2 = (${v.p1}*${v.v1}*${v.t2}) / (${v.p2}*${v.t1})`],
            diagram: { type: 'gas', data: { p: v.p2, v: v2, t: v.t2, maxV: 20 } }
          };
        }
      }
    ]
  },
  'boyles-law': {
    id: 'boyles-law',
    title: 'Boyle\'s Law',
    category: 'Gas Laws',
    description: 'Pressure vs Volume (Const T).',
    icon: Wind,
    solveModes: [
      {
        target: 'v2',
        label: 'Final Volume (V2)',
        inputs: [
          { name: 'p1', label: 'Initial Pressure (P1)', unit: 'atm', defaultValue: 1 },
          { name: 'v1', label: 'Initial Volume (V1)', unit: 'L', defaultValue: 10 },
          { name: 'p2', label: 'Final Pressure (P2)', unit: 'atm', defaultValue: 2 }
        ],
        calculate: (v) => {
          const v2 = (v.p1 * v.v1) / v.p2;
          return {
            value: v2,
            unit: 'L',
            steps: ['P1V1 = P2V2', `V2 = (P1 * V1) / P2`, `V2 = (${v.p1} * ${v.v1}) / ${v.p2}`],
            diagram: { type: 'gas', data: { p: v.p2, v: v2, t: 300, maxV: Math.max(v.v1, v2) * 1.5 } }
          }
        }
      }
    ]
  },
  'charles-law': {
    id: 'charles-law',
    title: 'Charles\'s Law',
    category: 'Gas Laws',
    description: 'Volume vs Temp (Const P).',
    icon: Wind,
    solveModes: [
      {
        target: 'v2',
        label: 'Final Volume (V2)',
        inputs: [
          { name: 'v1', label: 'Initial Volume (V1)', unit: 'L', defaultValue: 10 },
          { name: 't1', label: 'Initial Temp (T1)', unit: 'K', defaultValue: 300 },
          { name: 't2', label: 'Final Temp (T2)', unit: 'K', defaultValue: 600 }
        ],
        calculate: (v) => {
          const v2 = (v.v1 * v.t2) / v.t1;
          return {
            value: v2,
            unit: 'L',
            steps: ['V1/T1 = V2/T2', `V2 = (V1 * T2) / T1`, `V2 = (${v.v1} * ${v.t2}) / ${v.t1}`],
            diagram: { type: 'gas', data: { p: 1, v: v2, t: v.t2, maxV: Math.max(v.v1, v2) * 1.5 } }
          }
        }
      }
    ]
  },

  // --- ACIDS BASES ---
  'ph-calc': {
    id: 'ph-calc',
    title: 'pH Calculator',
    category: 'Acids & Bases',
    description: 'Calculate pH from [H+].',
    icon: Droplets,
    solveModes: [
      {
        target: 'ph',
        label: 'pH from [H+]',
        inputs: [
          { name: 'h', label: '[H+] Conc', unit: 'M', defaultValue: 0.0001, step: 0.0000001, min: 0 }
        ],
        calculate: (v) => {
          const ph = -Math.log10(v.h);
          return {
            value: ph,
            unit: 'pH',
            steps: ['pH = -log[H+]', `pH = -log(${v.h})`],
            diagram: { type: 'ph-scale', data: { ph: ph } }
          }
        }
      }
    ]
  },
  'poh-calc': {
    id: 'poh-calc',
    title: 'pOH Calculator',
    category: 'Acids & Bases',
    description: 'Calculate pOH from [OH-].',
    icon: Droplets,
    solveModes: [
      {
        target: 'poh',
        label: 'pOH from [OH-]',
        inputs: [
          { name: 'oh', label: '[OH-] Conc', unit: 'M', defaultValue: 0.0001, step: 0.0000001, min: 0 }
        ],
        calculate: (v) => {
          const poh = -Math.log10(v.oh);
          const ph = 14 - poh;
          return {
            value: poh,
            unit: 'pOH',
            steps: ['pOH = -log[OH-]', `pOH = -log(${v.oh})`],
            diagram: { type: 'ph-scale', data: { ph: ph } } // Reuse pH scale diagram to show acidity
          }
        }
      }
    ]
  },
  'buffer': {
    id: 'buffer',
    title: 'Buffer Calculator',
    category: 'Acids & Bases',
    description: 'Henderson-Hasselbalch Equation.',
    icon: Layers,
    solveModes: [
      {
        target: 'ph',
        label: 'Buffer pH',
        inputs: [
          { name: 'pka', label: 'pKa', unit: '', defaultValue: 4.76 },
          { name: 'base', label: '[Base]', unit: 'M', defaultValue: 0.1 },
          { name: 'acid', label: '[Acid]', unit: 'M', defaultValue: 0.1 }
        ],
        calculate: (v) => {
          const ph = v.pka + Math.log10(v.base / v.acid);
          return {
            value: ph,
            unit: 'pH',
            steps: ['pH = pKa + log([A-]/[HA])', `pH = ${v.pka} + log(${v.base}/${v.acid})`],
            diagram: { type: 'ph-scale', data: { ph } }
          }
        }
      }
    ]
  },
  'ka-pka': {
    id: 'ka-pka',
    title: 'Ka ↔ pKa Converter',
    category: 'Acids & Bases',
    description: 'Convert between Ka and pKa.',
    icon: Droplets,
    solveModes: [
      {
        target: 'pka',
        label: 'Calculate pKa',
        inputs: [
          { name: 'ka', label: 'Ka', unit: '', defaultValue: 0.0000174 } // Acetic Acid
        ],
        calculate: (v) => {
          const pka = -Math.log10(v.ka);
          return {
            value: pka,
            unit: 'pKa',
            steps: ['pKa = -log(Ka)', `pKa = -log(${v.ka})`],
            diagram: { type: 'bar', data: [{ label: 'pKa', value: pka, color: '#a855f7' }] }
          }
        }
      },
      {
        target: 'ka',
        label: 'Calculate Ka',
        inputs: [
          { name: 'pka', label: 'pKa', unit: '', defaultValue: 4.76 }
        ],
        calculate: (v) => {
          const ka = Math.pow(10, -v.pka);
          return {
            value: ka.toExponential(4),
            unit: 'Ka',
            steps: ['Ka = 10^(-pKa)', `Ka = 10^(-${v.pka})`],
            diagram: { type: 'bar', data: [{ label: '-log(Ka)', value: v.pka, color: '#a855f7' }] }
          }
        }
      }
    ]
  },

  // --- THERMOCHEMISTRY ---
  'specific-heat': {
    id: 'specific-heat',
    title: 'Specific Heat',
    category: 'Thermochemistry',
    description: 'q = mcΔT',
    icon: Thermometer,
    solveModes: [
      {
        target: 'q',
        label: 'Heat (q)',
        inputs: [
          { name: 'm', label: 'Mass', unit: 'g', defaultValue: 100 },
          { name: 'c', label: 'Specific Heat', unit: 'J/g°C', defaultValue: 4.18 }, // Water
          { name: 'dt', label: 'ΔT', unit: '°C', defaultValue: 20 }
        ],
        calculate: (v) => ({
          value: v.m * v.c * v.dt,
          unit: 'J',
          steps: ['q = mcΔT', `q = ${v.m} × ${v.c} × ${v.dt}`],
          diagram: { type: 'bar', data: [{ label: 'Heat Energy (J)', value: v.m * v.c * v.dt, color: '#ef4444' }] }
        })
      }
    ]
  },
  'gibbs': {
    id: 'gibbs',
    title: 'Gibbs Free Energy',
    category: 'Thermochemistry',
    description: 'ΔG = ΔH - TΔS',
    icon: Zap,
    solveModes: [
      {
        target: 'dg',
        label: 'ΔG (Spontaneity)',
        inputs: [
          { name: 'dh', label: 'ΔH (Enthalpy)', unit: 'kJ/mol', defaultValue: -100 },
          { name: 'ds', label: 'ΔS (Entropy)', unit: 'J/mol·K', defaultValue: 50 },
          { name: 't', label: 'Temp', unit: 'K', defaultValue: 298 }
        ],
        calculate: (v) => {
          const ds_kj = v.ds / 1000;
          const dg = v.dh - v.t * ds_kj;
          return {
            value: dg,
            unit: 'kJ/mol',
            steps: ['ΔG = ΔH - TΔS', `ΔG = ${v.dh} - ${v.t} * (${v.ds}/1000)`],
            diagram: { type: 'bar', data: [{ label: 'ΔH', value: v.dh, color: '#f59e0b' }, { label: '-TΔS', value: -v.t * ds_kj, color: '#3b82f6' }, { label: 'ΔG', value: dg, color: dg < 0 ? '#10b981' : '#ef4444' }] }
          };
        }
      }
    ]
  },
  'arrhenius': {
    id: 'arrhenius',
    title: 'Arrhenius Equation',
    category: 'Thermochemistry',
    description: 'Rate constant & Activation Energy.',
    icon: Flame,
    solveModes: [
      {
        target: 'k',
        label: 'Rate Constant (k)',
        inputs: [
          { name: 'A', label: 'Freq. Factor (A)', unit: '/s', defaultValue: 1e13 },
          { name: 'Ea', label: 'Activation E', unit: 'kJ/mol', defaultValue: 50 },
          { name: 'T', label: 'Temp', unit: 'K', defaultValue: 298 }
        ],
        calculate: (v) => {
          const R = 8.314;
          const k = v.A * Math.exp(-(v.Ea * 1000) / (R * v.T));
          return {
            value: k.toExponential(3),
            unit: '/s',
            steps: ['k = A * exp(-Ea/RT)', `k = ${v.A} * exp(-${v.Ea*1000} / (8.314 * ${v.T}))`],
            diagram: { type: 'energy-profile', data: { ea: v.Ea, dh: -20 } } // Assume exothermic for visual
          }
        }
      }
    ]
  },

  // --- LAB TOOLS ---
  'beer-lambert': {
    id: 'beer-lambert',
    title: 'Beer-Lambert Law',
    category: 'Lab Tools',
    description: 'A = εlc (Absorbance)',
    icon: Microscope,
    solveModes: [
      {
        target: 'A',
        label: 'Absorbance (A)',
        inputs: [
          { name: 'eps', label: 'Molar Absorptivity (ε)', unit: 'L/mol·cm', defaultValue: 1500 },
          { name: 'l', label: 'Path Length (l)', unit: 'cm', defaultValue: 1 },
          { name: 'c', label: 'Concentration (c)', unit: 'M', defaultValue: 0.0005 }
        ],
        calculate: (v) => ({
          value: v.eps * v.l * v.c,
          unit: 'Abs',
          steps: ['A = εlc', `A = ${v.eps} × ${v.l} × ${v.c}`],
          diagram: { type: 'beer-lambert', data: { abs: v.eps * v.l * v.c, c: v.c } }
        })
      }
    ]
  },
  'density': {
    id: 'density',
    title: 'Density Calculator',
    category: 'Lab Tools',
    description: 'ρ = m/V',
    icon: Scale,
    solveModes: [
      {
        target: 'rho',
        label: 'Density (ρ)',
        inputs: [
          { name: 'm', label: 'Mass', unit: 'g', defaultValue: 10 },
          { name: 'v', label: 'Volume', unit: 'mL', defaultValue: 2 }
        ],
        calculate: (v) => ({
          value: v.m / v.v,
          unit: 'g/mL',
          steps: ['ρ = m / V', `ρ = ${v.m} / ${v.v}`],
          diagram: { type: 'bar', data: [{ label: 'Density', value: v.m / v.v, color: '#6366f1' }] }
        })
      }
    ]
  },

  // --- STOICHIOMETRY ---
  'moles-grams': {
    id: 'moles-grams',
    title: 'Moles ↔ Grams',
    category: 'Stoichiometry',
    description: 'Convert using atomic mass.',
    icon: Scale,
    solveModes: [
      {
        target: 'grams',
        label: 'To Grams',
        inputs: [
           { name: 'n', label: 'Moles', unit: 'mol', defaultValue: 2 },
           { name: 'mw', label: 'Molar Mass', unit: 'g/mol', defaultValue: 18.015 } // Water
        ],
        calculate: (v) => ({
           value: v.n * v.mw,
           unit: 'g',
           steps: ['mass = n × MW', `mass = ${v.n} × ${v.mw}`],
           diagram: { type: 'bar', data: [{label: 'Mass (g)', value: v.n * v.mw, color: '#10b981'}] }
        })
      }
    ]
  },
  'yield': {
    id: 'yield',
    title: 'Percent Yield',
    category: 'Stoichiometry',
    description: 'Actual vs Theoretical Yield.',
    icon: Scale,
    solveModes: [
      {
        target: 'pct',
        label: 'Percent Yield',
        inputs: [
          { name: 'actual', label: 'Actual Yield', unit: 'g', defaultValue: 45 },
          { name: 'theo', label: 'Theoretical', unit: 'g', defaultValue: 50 }
        ],
        calculate: (v) => ({
          value: (v.actual / v.theo) * 100,
          unit: '%',
          steps: ['% Yield = (Actual / Theoretical) * 100', `% = (${v.actual} / ${v.theo}) * 100`],
          diagram: { type: 'bar', data: [{ label: 'Actual', value: v.actual, color: '#10b981' }, { label: 'Theoretical', value: v.theo, color: '#94a3b8' }] }
        })
      }
    ]
  },
  'limiting-reagent': {
    id: 'limiting-reagent',
    title: 'Limiting Reagent',
    category: 'Stoichiometry',
    description: 'Find limiting reactant.',
    icon: Scale,
    solveModes: [
      {
        target: 'lr',
        label: 'Limiting Reactant',
        inputs: [
          { name: 'molA', label: 'Moles A', unit: 'mol', defaultValue: 5 },
          { name: 'coeffA', label: 'Coeff A', unit: '', defaultValue: 1 },
          { name: 'molB', label: 'Moles B', unit: 'mol', defaultValue: 3 },
          { name: 'coeffB', label: 'Coeff B', unit: '', defaultValue: 1 }
        ],
        calculate: (v) => {
           const ratioA = v.molA / v.coeffA;
           const ratioB = v.molB / v.coeffB;
           const isA = ratioA < ratioB;
           return {
             value: isA ? 'Reactant A' : 'Reactant B',
             unit: 'is Limiting',
             steps: [
               `Ratio A = ${v.molA}/${v.coeffA} = ${ratioA.toFixed(2)}`,
               `Ratio B = ${v.molB}/${v.coeffB} = ${ratioB.toFixed(2)}`,
               `Lowest ratio determines limiting reagent.`
             ],
             diagram: { type: 'bar', data: [{label: 'Ratio A', value: ratioA, color: isA ? '#ef4444' : '#94a3b8'}, {label: 'Ratio B', value: ratioB, color: !isA ? '#ef4444' : '#94a3b8'}] }
           };
        }
      }
    ]
  },

  // --- ELECTROCHEMISTRY ---
  'nernst': {
    id: 'nernst',
    title: 'Nernst Equation',
    category: 'Electrochemistry',
    description: 'Calculate Cell Potential.',
    icon: Zap,
    solveModes: [
      {
        target: 'E',
        label: 'Cell Potential (E)',
        inputs: [
          { name: 'e0', label: 'Standard E⁰', unit: 'V', defaultValue: 1.10 },
          { name: 'n', label: 'Electrons (n)', unit: 'mol', defaultValue: 2 },
          { name: 'q', label: 'Reaction Quotient (Q)', unit: '', defaultValue: 0.01 }
        ],
        calculate: (v) => {
          // E = E0 - (0.0592/n)logQ at 298K
          const E = v.e0 - (0.0592 / v.n) * Math.log10(v.q);
          return {
            value: E,
            unit: 'V',
            steps: ['E = E⁰ - (0.0592/n)logQ', `E = ${v.e0} - (0.0592/${v.n})log(${v.q})`],
            diagram: { type: 'cell', data: { e: E, e0: v.e0 } }
          }
        }
      }
    ]
  },
  'electrolysis': {
    id: 'electrolysis',
    title: 'Electrolysis (Faraday)',
    category: 'Electrochemistry',
    description: 'Mass deposited by electrolysis.',
    icon: Zap,
    solveModes: [
      {
        target: 'm',
        label: 'Mass Deposited',
        inputs: [
          { name: 'i', label: 'Current', unit: 'A', defaultValue: 5 },
          { name: 't', label: 'Time', unit: 'sec', defaultValue: 600 },
          { name: 'mw', label: 'Molar Mass', unit: 'g/mol', defaultValue: 63.55 }, // Cu
          { name: 'n', label: 'Electrons (n)', unit: 'mol', defaultValue: 2 }
        ],
        calculate: (v) => {
          const F = 96485;
          const mol = (v.i * v.t) / (v.n * F);
          const mass = mol * v.mw;
          return {
            value: mass,
            unit: 'g',
            steps: ['n(mol) = It / nF', `mass = n(mol) * MW`, `mass = (${v.i}*${v.t} / ${v.n}*96485) * ${v.mw}`],
            diagram: { type: 'bar', data: [{ label: 'Deposited Mass', value: mass, color: '#f59e0b' }] }
          };
        }
      }
    ]
  },

  // --- CONVERTERS ---
  'temp-conv': {
    id: 'temp-conv',
    title: 'Temperature',
    category: 'Converters',
    description: 'C, F, K conversion.',
    icon: Thermometer,
    solveModes: [
      {
        target: 'c_to_others',
        label: 'From Celsius',
        inputs: [
          { name: 'c', label: 'Celsius', unit: '°C', defaultValue: 25 }
        ],
        calculate: (v) => {
          const f = (v.c * 9/5) + 32;
          const k = v.c + 273.15;
          return {
            value: `${f.toFixed(1)}°F / ${k.toFixed(1)}K`,
            unit: '', 
            steps: ['F = C × 9/5 + 32', 'K = C + 273.15'],
            diagram: { type: 'bar', data: [{ label: 'Celsius', value: v.c, color: '#3b82f6' }, { label: 'Fahrenheit', value: f, color: '#ef4444' }] } 
          };
        }
      }
    ]
  },
  'pressure-conv': {
    id: 'pressure-conv',
    title: 'Pressure',
    category: 'Converters',
    description: 'atm, kPa, mmHg, bar.',
    icon: Wind,
    solveModes: [
      {
        target: 'atm_to_others',
        label: 'From ATM',
        inputs: [
          { name: 'atm', label: 'Pressure', unit: 'atm', defaultValue: 1 }
        ],
        calculate: (v) => {
          const kpa = v.atm * 101.325;
          const mmhg = v.atm * 760;
          return {
            value: `${kpa.toFixed(1)} kPa`,
            unit: ` / ${mmhg.toFixed(0)} mmHg`,
            steps: ['1 atm = 101.325 kPa', '1 atm = 760 mmHg'],
            diagram: { type: 'bar', data: [{ label: 'ATM', value: v.atm, color: '#6366f1' }, { label: 'Bar', value: v.atm * 1.01325, color: '#10b981' }] }
          };
        }
      }
    ]
  },
  'energy-conv': {
    id: 'energy-conv',
    title: 'Energy Converter',
    category: 'Converters',
    description: 'Joules, Calories, eV.',
    icon: Zap,
    solveModes: [
      {
        target: 'j_to_others',
        label: 'From Joules',
        inputs: [
          { name: 'j', label: 'Energy', unit: 'J', defaultValue: 1000 }
        ],
        calculate: (v) => {
          const cal = v.j / 4.184;
          const ev = v.j / 1.602e-19;
          return {
            value: `${cal.toFixed(1)} cal`,
            unit: ` / ${ev.toExponential(2)} eV`,
            steps: ['1 cal = 4.184 J', '1 eV = 1.602e-19 J'],
            diagram: { type: 'bar', data: [{ label: 'Joules', value: v.j, color: '#10b981' }, { label: 'Calories', value: cal, color: '#f59e0b' }] }
          };
        }
      }
    ]
  }
};
