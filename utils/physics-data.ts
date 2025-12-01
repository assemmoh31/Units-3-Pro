
import { Atom, Zap, Waves, Flame, Orbit, Cpu, Settings, Thermometer, Wind, Eye, Activity, Scale, Magnet, Lightbulb, Move, Radio, Droplets, Timer, RotateCcw } from 'lucide-react';

export interface PhysicsInput {
  name: string;
  label: string;
  unit: string; // Display unit
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface PhysicsResult {
  value: number;
  unit: string;
  steps: string[]; // Steps for display
  diagram?: {
    type: 'projectile' | 'circuit' | 'ray' | 'chart' | 'orbit' | 'bar' | 'wave' | 'forces' | 'lens' | 'gas' | 'resistor' | 'star' | 'interference' | 'decay' | 'transformer' | 'lc-circuit' | 'voltage-divider' | 'buoyancy' | 'pendulum' | 'torque' | 'doppler' | 'flow';
    data: any; // Flexible data structure for the SVG renderer
  };
}

export interface PhysicsCalculatorConfig {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: any;
  solveModes: {
    target: string; // The variable we are solving for
    label: string;
    inputs: PhysicsInput[]; // Inputs required for this target
    calculate: (values: Record<string, number>) => PhysicsResult;
  }[];
}

export const physicsCategories = [
  { id: 'waves', title: 'Waves & Sound', icon: Waves, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  { id: 'optics', title: 'Light & Optics', icon: Eye, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/20' },
  { id: 'thermo', title: 'Thermodynamics', icon: Flame, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' },
  { id: 'modern', title: 'Modern Physics', icon: Atom, color: 'text-violet-500', bg: 'bg-violet-100 dark:bg-violet-900/20' },
  { id: 'astronomy', title: 'Astronomy', icon: Orbit, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/20' },
  { id: 'fluids', title: 'Fluid Mechanics', icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/20' },
  { id: 'mechanics', title: 'Mechanics', icon: Settings, color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', className: 'md:col-span-2 lg:col-span-3' },
  { id: 'electricity', title: 'Electricity & Magnetism', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/20', className: 'md:col-span-2 lg:col-span-3' },
];

export const physicsCalculators: Record<string, PhysicsCalculatorConfig> = {
  // ==========================================
  // MECHANICS
  // ==========================================
  'kinematics': {
    id: 'kinematics',
    title: 'Motion Equations',
    category: 'Mechanics',
    description: 'Solve for displacement, velocity, acceleration, or time.',
    icon: Move,
    solveModes: [
      {
        target: 's',
        label: 'Displacement (s)',
        inputs: [
          { name: 'u', label: 'Initial Velocity', unit: 'm/s', min: 0, max: 100, step: 0.1, defaultValue: 0 },
          { name: 't', label: 'Time', unit: 's', min: 0.1, max: 100, step: 0.1, defaultValue: 10 },
          { name: 'a', label: 'Acceleration', unit: 'm/s²', min: -50, max: 50, step: 0.1, defaultValue: 9.8 }
        ],
        calculate: (v) => ({
          value: v.u * v.t + 0.5 * v.a * v.t * v.t,
          unit: 'm',
          steps: ['s = ut + ½at²', `s = (${v.u})(${v.t}) + 0.5(${v.a})(${v.t})²`],
          diagram: { type: 'bar', data: [{label: 'Distance', value: v.u * v.t + 0.5 * v.a * v.t * v.t, color: '#3b82f6'}] }
        })
      },
      {
        target: 'v',
        label: 'Final Velocity (v)',
        inputs: [
          { name: 'u', label: 'Initial Velocity', unit: 'm/s', min: 0, max: 100, step: 0.1, defaultValue: 0 },
          { name: 'a', label: 'Acceleration', unit: 'm/s²', min: -50, max: 50, step: 0.1, defaultValue: 9.8 },
          { name: 't', label: 'Time', unit: 's', min: 0.1, max: 100, step: 0.1, defaultValue: 5 }
        ],
        calculate: (v) => ({
          value: v.u + v.a * v.t,
          unit: 'm/s',
          steps: ['v = u + at', `v = ${v.u} + (${v.a})(${v.t})`],
          diagram: { type: 'bar', data: [{label: 'Final Velocity', value: v.u + v.a * v.t, color: '#ef4444'}] }
        })
      }
    ]
  },
  'pendulum': {
    id: 'pendulum',
    title: 'Simple Pendulum',
    category: 'Mechanics',
    description: 'Period of a simple pendulum.',
    icon: Timer,
    solveModes: [
      {
        target: 't',
        label: 'Period (T)',
        inputs: [
          { name: 'l', label: 'Length', unit: 'm', min: 0.1, max: 100, step: 0.1, defaultValue: 1 },
          { name: 'g', label: 'Gravity', unit: 'm/s²', min: 1, max: 30, step: 0.1, defaultValue: 9.81 }
        ],
        calculate: (v) => {
          const t = 2 * Math.PI * Math.sqrt(v.l / v.g);
          return {
            value: t,
            unit: 's',
            steps: ['T = 2π√(L/g)', `T = 2π√(${v.l}/${v.g})`],
            diagram: { type: 'pendulum', data: { l: v.l, t } }
          }
        }
      }
    ]
  },
  'torque': {
    id: 'torque',
    title: 'Torque',
    category: 'Mechanics',
    description: 'Moment of force.',
    icon: RotateCcw,
    solveModes: [
      {
        target: 'tau',
        label: 'Torque (τ)',
        inputs: [
          { name: 'f', label: 'Force', unit: 'N', min: 1, max: 1000, step: 1, defaultValue: 50 },
          { name: 'r', label: 'Lever Arm', unit: 'm', min: 0.1, max: 10, step: 0.1, defaultValue: 0.5 },
          { name: 'theta', label: 'Angle', unit: 'deg', min: 0, max: 180, step: 1, defaultValue: 90 }
        ],
        calculate: (v) => {
          const tau = v.r * v.f * Math.sin(v.theta * Math.PI / 180);
          return {
            value: tau,
            unit: 'Nm',
            steps: ['τ = r F sin(θ)', `τ = ${v.r} * ${v.f} * sin(${v.theta}°) `],
            diagram: { type: 'torque', data: { f: v.f, r: v.r, theta: v.theta } }
          }
        }
      }
    ]
  },
  'work-power': {
    id: 'work-power',
    title: 'Work & Power',
    category: 'Mechanics',
    description: 'Calculate mechanical work and power output.',
    icon: Activity,
    solveModes: [
      {
        target: 'w',
        label: 'Work (W)',
        inputs: [
          { name: 'f', label: 'Force', unit: 'N', min: 1, max: 1000, step: 1, defaultValue: 50 },
          { name: 'd', label: 'Distance', unit: 'm', min: 1, max: 1000, step: 1, defaultValue: 10 },
          { name: 'theta', label: 'Angle', unit: 'deg', min: 0, max: 90, step: 1, defaultValue: 0 }
        ],
        calculate: (v) => {
          const w = v.f * v.d * Math.cos(v.theta * Math.PI / 180);
          return {
            value: w,
            unit: 'J',
            steps: ['W = Fd cos(θ)', `W = ${v.f} * ${v.d} * cos(${v.theta})`],
            diagram: { type: 'bar', data: [{label: 'Work Done', value: w, color: '#10b981'}] }
          };
        }
      },
      {
        target: 'p',
        label: 'Power (P)',
        inputs: [
           { name: 'w', label: 'Work', unit: 'J', min: 1, max: 50000, step: 10, defaultValue: 1000 },
           { name: 't', label: 'Time', unit: 's', min: 1, max: 600, step: 1, defaultValue: 10 }
        ],
        calculate: (v) => ({
          value: v.w / v.t,
          unit: 'W',
          steps: ['P = W / t', `P = ${v.w} / ${v.t}`],
          diagram: { type: 'bar', data: [{label: 'Power', value: v.w/v.t, color: '#f59e0b'}] }
        })
      }
    ]
  },
  'circular-motion': {
    id: 'circular-motion',
    title: 'Circular Motion',
    category: 'Mechanics',
    description: 'Centripetal force and acceleration.',
    icon: Orbit,
    solveModes: [
      {
        target: 'fc',
        label: 'Centripetal Force',
        inputs: [
           { name: 'm', label: 'Mass', unit: 'kg', min: 0.1, max: 1000, step: 0.1, defaultValue: 10 },
           { name: 'v', label: 'Velocity', unit: 'm/s', min: 1, max: 100, step: 0.1, defaultValue: 20 },
           { name: 'r', label: 'Radius', unit: 'm', min: 1, max: 500, step: 1, defaultValue: 50 }
        ],
        calculate: (v) => ({
          value: (v.m * v.v * v.v) / v.r,
          unit: 'N',
          steps: ['Fc = mv²/r', `Fc = ${v.m} * ${v.v}² / ${v.r}`],
          diagram: { type: 'orbit', data: { v: v.v, r: v.r } }
        })
      }
    ]
  },
  'projectile-motion': {
    id: 'projectile-motion',
    title: 'Projectile Motion',
    category: 'Mechanics',
    description: 'Calculate range, height, and time of flight.',
    icon: Wind,
    solveModes: [
      {
        target: 'range',
        label: 'Calculate Trajectory',
        inputs: [
          { name: 'v0', label: 'Initial Velocity', unit: 'm/s', min: 1, max: 200, step: 1, defaultValue: 50 },
          { name: 'angle', label: 'Launch Angle', unit: 'deg', min: 1, max: 89, step: 1, defaultValue: 45 },
          { name: 'h0', label: 'Initial Height', unit: 'm', min: 0, max: 100, step: 1, defaultValue: 0 }
        ],
        calculate: (vals) => {
          const g = 9.81;
          const rad = vals.angle * (Math.PI / 180);
          const vx = vals.v0 * Math.cos(rad);
          const vy = vals.v0 * Math.sin(rad);
          
          const t_flight = (vy + Math.sqrt(vy*vy + 2*g*vals.h0)) / g;
          const range = vx * t_flight;
          const h_max = vals.h0 + (vy*vy) / (2*g);

          const points = [];
          for(let i=0; i<=20; i++) {
             const t = (t_flight / 20) * i;
             const x = vx * t;
             const y = vals.h0 + vy*t - 0.5*g*t*t;
             points.push({x, y});
          }

          return {
            value: range,
            unit: 'm',
            steps: [
              `Vy = ${vals.v0}sin(${vals.angle}) = ${vy.toFixed(1)} m/s`,
              `Vx = ${vals.v0}cos(${vals.angle}) = ${vx.toFixed(1)} m/s`,
              `Time = ${t_flight.toFixed(2)} s`,
              `Max Height = ${h_max.toFixed(2)} m`
            ],
            diagram: {
              type: 'projectile',
              data: { points, range, h_max }
            }
          };
        }
      }
    ]
  },
  'newtons-second': {
    id: 'newtons-second',
    title: 'Newton\'s Second Law',
    category: 'Mechanics',
    description: 'F = ma',
    icon: Scale,
    solveModes: [
      {
        target: 'force',
        label: 'Solve for Force (F)',
        inputs: [
          { name: 'm', label: 'Mass', unit: 'kg', min: 0.1, max: 1000, step: 0.1, defaultValue: 10 },
          { name: 'a', label: 'Acceleration', unit: 'm/s²', min: 0, max: 100, step: 0.1, defaultValue: 9.8 }
        ],
        calculate: (v) => ({
          value: v.m * v.a,
          unit: 'N',
          steps: [`F = m * a`, `F = ${v.m} * ${v.a}`],
          diagram: { type: 'bar', data: [{label: 'Force', value: v.m * v.a, color: '#6366f1'}] }
        })
      }
    ]
  },

  // ==========================================
  // FLUID MECHANICS
  // ==========================================
  'buoyancy': {
    id: 'buoyancy',
    title: 'Buoyancy',
    category: 'Fluid Mechanics',
    description: 'Archimedes\' Principle.',
    icon: Droplets,
    solveModes: [
      {
        target: 'fb',
        label: 'Buoyant Force (Fb)',
        inputs: [
          { name: 'rho', label: 'Fluid Density', unit: 'kg/m³', min: 1, max: 2000, step: 10, defaultValue: 1000 }, // Water
          { name: 'v', label: 'Displaced Vol', unit: 'm³', min: 0.01, max: 100, step: 0.01, defaultValue: 1 },
          { name: 'g', label: 'Gravity', unit: 'm/s²', min: 1, max: 30, step: 0.1, defaultValue: 9.81 }
        ],
        calculate: (v) => {
          const fb = v.rho * v.v * v.g;
          return {
            value: fb,
            unit: 'N',
            steps: ['Fb = ρ V g', `Fb = ${v.rho} * ${v.v} * ${v.g}`],
            diagram: { type: 'buoyancy', data: { rho: v.rho, v: v.v, fb } }
          }
        }
      }
    ]
  },
  'hydrostatic-pressure': {
    id: 'hydrostatic-pressure',
    title: 'Hydrostatic Pressure',
    category: 'Fluid Mechanics',
    description: 'Pressure at depth in a fluid.',
    icon: Scale,
    solveModes: [
      {
        target: 'p',
        label: 'Pressure (P)',
        inputs: [
          { name: 'rho', label: 'Density', unit: 'kg/m³', min: 1, max: 2000, step: 10, defaultValue: 1000 },
          { name: 'h', label: 'Depth', unit: 'm', min: 1, max: 11000, step: 1, defaultValue: 10 },
          { name: 'g', label: 'Gravity', unit: 'm/s²', min: 1, max: 30, step: 0.1, defaultValue: 9.81 }
        ],
        calculate: (v) => {
          const p = v.rho * v.g * v.h;
          return {
            value: p / 1000, // kPa
            unit: 'kPa',
            steps: ['P = ρgh', `P = ${v.rho} * ${v.g} * ${v.h} (Pa)`],
            diagram: { type: 'bar', data: [{label: 'Pressure', value: p/1000, color: '#06b6d4'}] }
          }
        }
      }
    ]
  },
  'continuity-equation': {
    id: 'continuity-equation',
    title: 'Flow Rate',
    category: 'Fluid Mechanics',
    description: 'Flow continuity Q = Av.',
    icon: Wind,
    solveModes: [
      {
        target: 'q',
        label: 'Flow Rate (Q)',
        inputs: [
          { name: 'a', label: 'Area', unit: 'm²', min: 0.01, max: 10, step: 0.01, defaultValue: 0.5 },
          { name: 'v', label: 'Velocity', unit: 'm/s', min: 0.1, max: 100, step: 0.1, defaultValue: 2 }
        ],
        calculate: (v) => {
          const q = v.a * v.v;
          return {
            value: q,
            unit: 'm³/s',
            steps: ['Q = A * v', `Q = ${v.a} * ${v.v}`],
            diagram: { type: 'flow', data: { a: v.a, v: v.v, q } }
          }
        }
      }
    ]
  },

  // ==========================================
  // ELECTRICITY & MAGNETISM
  // ==========================================
  'electric-power': {
      id: 'electric-power',
      title: 'Electric Power',
      category: 'Electricity & Magnetism',
      description: 'Calculate power using V, I, or R.',
      icon: Zap,
      solveModes: [
          {
              target: 'p-vi',
              label: 'Power (P = VI)',
              inputs: [
                  { name: 'v', label: 'Voltage', unit: 'V', min: 1, max: 240, step: 1, defaultValue: 120 },
                  { name: 'i', label: 'Current', unit: 'A', min: 0.1, max: 20, step: 0.1, defaultValue: 2 }
              ],
              calculate: (v) => ({
                  value: v.v * v.i,
                  unit: 'W',
                  steps: ['P = V * I', `P = ${v.v} * ${v.i}`],
                  diagram: { type: 'bar', data: [{label: 'Power (W)', value: v.v * v.i, color: '#f59e0b'}] }
              })
          },
          {
              target: 'p-ir',
              label: 'Power (P = I²R)',
              inputs: [
                  { name: 'i', label: 'Current', unit: 'A', min: 0.1, max: 20, step: 0.1, defaultValue: 5 },
                  { name: 'r', label: 'Resistance', unit: 'Ω', min: 1, max: 1000, step: 1, defaultValue: 10 }
              ],
              calculate: (v) => ({
                  value: v.i * v.i * v.r,
                  unit: 'W',
                  steps: ['P = I²R', `P = (${v.i})² * ${v.r}`],
                  diagram: { type: 'bar', data: [{label: 'Power (W)', value: v.i * v.i * v.r, color: '#ef4444'}] }
              })
          }
      ]
  },
  'voltage-divider': {
    id: 'voltage-divider',
    title: 'Voltage Divider',
    category: 'Electricity & Magnetism',
    description: 'Calculate output voltage across R2.',
    icon: Cpu,
    solveModes: [
      {
        target: 'vout',
        label: 'Output Voltage (Vout)',
        inputs: [
           { name: 'vin', label: 'Input Voltage', unit: 'V', min: 1, max: 100, step: 0.1, defaultValue: 12 },
           { name: 'r1', label: 'Resistor 1', unit: 'Ω', min: 1, max: 10000, step: 10, defaultValue: 1000 },
           { name: 'r2', label: 'Resistor 2', unit: 'Ω', min: 1, max: 10000, step: 10, defaultValue: 2000 }
        ],
        calculate: (v) => {
           const vout = v.vin * (v.r2 / (v.r1 + v.r2));
           return {
             value: vout,
             unit: 'V',
             steps: ['Vout = Vin * R2 / (R1 + R2)', `Vout = ${v.vin} * ${v.r2} / (${v.r1} + ${v.r2})`],
             diagram: { type: 'voltage-divider', data: { vin: v.vin, r1: v.r1, r2: v.r2, vout } }
           };
        }
      }
    ]
  },
  'transformer': {
    id: 'transformer',
    title: 'Transformer Equation',
    category: 'Electricity & Magnetism',
    description: 'Calculate voltage or turns ratio.',
    icon: Cpu,
    solveModes: [
        {
            target: 'vs',
            label: 'Secondary Voltage (Vs)',
            inputs: [
                { name: 'vp', label: 'Primary Voltage', unit: 'V', min: 1, max: 10000, step: 10, defaultValue: 120 },
                { name: 'np', label: 'Primary Turns', unit: '', min: 1, max: 5000, step: 1, defaultValue: 500 },
                { name: 'ns', label: 'Secondary Turns', unit: '', min: 1, max: 5000, step: 1, defaultValue: 100 }
            ],
            calculate: (v) => {
                const vs = v.vp * (v.ns / v.np);
                return {
                    value: vs,
                    unit: 'V',
                    steps: ['Vs/Vp = Ns/Np', `Vs = Vp * (Ns/Np)`, `Vs = ${v.vp} * (${v.ns}/${v.np})`],
                    diagram: { type: 'transformer', data: { vp: v.vp, vs, np: v.np, ns: v.ns } }
                }
            }
        }
    ]
  },
  'lc-resonance': {
      id: 'lc-resonance',
      title: 'LC Resonance',
      category: 'Electricity & Magnetism',
      description: 'Resonant frequency of LC circuit.',
      icon: Radio,
      solveModes: [
          {
              target: 'f',
              label: 'Frequency (f)',
              inputs: [
                  { name: 'l', label: 'Inductance', unit: 'mH', min: 0.1, max: 1000, step: 0.1, defaultValue: 10 },
                  { name: 'c', label: 'Capacitance', unit: 'µF', min: 0.1, max: 1000, step: 0.1, defaultValue: 10 }
              ],
              calculate: (v) => {
                  const L = v.l * 1e-3;
                  const C = v.c * 1e-6;
                  const f = 1 / (2 * Math.PI * Math.sqrt(L * C));
                  return {
                      value: f,
                      unit: 'Hz',
                      steps: ['f = 1 / (2π√LC)', `f = 1 / (2π * √(${v.l}mH * ${v.c}µF))`],
                      diagram: { type: 'lc-circuit', data: { f, l: v.l, c: v.c } }
                  }
              }
          }
      ]
  },
  'ohms-law': {
    id: 'ohms-law',
    title: 'Ohm\'s Law',
    category: 'Electricity & Magnetism',
    description: 'Voltage, Current, and Resistance.',
    icon: Zap,
    solveModes: [
      {
        target: 'voltage',
        label: 'Solve for Voltage (V)',
        inputs: [
           { name: 'i', label: 'Current', unit: 'A', min: 0.1, max: 100, step: 0.1, defaultValue: 2 },
           { name: 'r', label: 'Resistance', unit: 'Ω', min: 1, max: 1000, step: 1, defaultValue: 10 }
        ],
        calculate: (v) => ({
          value: v.i * v.r,
          unit: 'V',
          steps: ['V = I * R', `V = ${v.i} * ${v.r}`],
          diagram: { type: 'circuit', data: { v: v.i*v.r, i: v.i, r: v.r } }
        })
      },
      {
        target: 'current',
        label: 'Solve for Current (I)',
        inputs: [
           { name: 'v', label: 'Voltage', unit: 'V', min: 1, max: 240, step: 1, defaultValue: 12 },
           { name: 'r', label: 'Resistance', unit: 'Ω', min: 1, max: 1000, step: 1, defaultValue: 100 }
        ],
        calculate: (v) => ({
          value: v.v / v.r,
          unit: 'A',
          steps: ['I = V / R', `I = ${v.v} / ${v.r}`],
          diagram: { type: 'circuit', data: { v: v.v, i: v.v/v.r, r: v.r } }
        })
      }
    ]
  },
  'resistors': {
    id: 'resistors',
    title: 'Resistors in Circuit',
    category: 'Electricity & Magnetism',
    description: 'Series and Parallel combinations.',
    icon: Cpu,
    solveModes: [
      {
        target: 'series',
        label: 'Series Equivalent',
        inputs: [
          { name: 'r1', label: 'Resistor 1', unit: 'Ω', min: 1, max: 1000, step: 1, defaultValue: 100 },
          { name: 'r2', label: 'Resistor 2', unit: 'Ω', min: 1, max: 1000, step: 1, defaultValue: 220 }
        ],
        calculate: (v) => ({
          value: v.r1 + v.r2,
          unit: 'Ω',
          steps: ['Req = R1 + R2', `Req = ${v.r1} + ${v.r2}`],
          diagram: { type: 'resistor', data: { r1: v.r1, r2: v.r2, mode: 'series' } }
        })
      },
      {
        target: 'parallel',
        label: 'Parallel Equivalent',
        inputs: [
          { name: 'r1', label: 'Resistor 1', unit: 'Ω', min: 1, max: 1000, step: 1, defaultValue: 100 },
          { name: 'r2', label: 'Resistor 2', unit: 'Ω', min: 1, max: 1000, step: 1, defaultValue: 100 }
        ],
        calculate: (v) => {
          const req = (v.r1 * v.r2) / (v.r1 + v.r2);
          return {
            value: req,
            unit: 'Ω',
            steps: ['1/Req = 1/R1 + 1/R2', `Req = (${v.r1}*${v.r2}) / (${v.r1}+${v.r2})`],
            diagram: { type: 'resistor', data: { r1: v.r1, r2: v.r2, mode: 'parallel' } }
          };
        }
      }
    ]
  },
  'electric-field': {
    id: 'electric-field',
    title: 'Electric Field',
    category: 'Electricity & Magnetism',
    description: 'Field strength from a point charge.',
    icon: Zap,
    solveModes: [
      {
        target: 'e',
        label: 'Field Strength (E)',
        inputs: [
           { name: 'q', label: 'Charge', unit: 'µC', min: 0.1, max: 1000, step: 0.1, defaultValue: 10 },
           { name: 'r', label: 'Distance', unit: 'cm', min: 1, max: 100, step: 1, defaultValue: 10 }
        ],
        calculate: (v) => {
           const k = 8.99e9;
           const Q = v.q * 1e-6;
           const r = v.r / 100;
           const E = (k * Q) / (r * r);
           return {
             value: E,
             unit: 'N/C',
             steps: ['E = kQ / r²', `E = (9e9 * ${v.q}e-6) / (${v.r}e-2)²`],
             diagram: { type: 'forces', data: { m1: v.q, m2: 0, type: 'field' } }
           };
        }
      }
    ]
  },
  'coulombs-law': {
    id: 'coulombs-law',
    title: 'Coulomb\'s Law',
    category: 'Electricity & Magnetism',
    description: 'Electric force between two charges.',
    icon: Zap,
    solveModes: [
      {
        target: 'force',
        label: 'Electric Force (Fe)',
        inputs: [
          { name: 'q1', label: 'Charge 1', unit: 'µC', min: -100, max: 100, step: 0.1, defaultValue: 10 },
          { name: 'q2', label: 'Charge 2', unit: 'µC', min: -100, max: 100, step: 0.1, defaultValue: -5 },
          { name: 'r', label: 'Distance', unit: 'cm', min: 1, max: 100, step: 0.1, defaultValue: 10 }
        ],
        calculate: (v) => {
          const k = 8.987e9;
          const q1 = v.q1 * 1e-6;
          const q2 = v.q2 * 1e-6;
          const r = v.r / 100;
          const f = k * Math.abs(q1 * q2) / (r * r);
          return {
            value: f,
            unit: 'N',
            steps: ['F = k|q1q2|/r²', `F = 9e9 * |${v.q1}μ * ${v.q2}μ| / (${v.r}cm)²`],
            diagram: { type: 'forces', data: { m1: v.q1, m2: v.q2, type: 'charge' } }
          };
        }
      }
    ]
  },
  'capacitance': {
    id: 'capacitance',
    title: 'Capacitance',
    category: 'Electricity & Magnetism',
    description: 'Charge stored in a capacitor.',
    icon: Zap,
    solveModes: [
      {
        target: 'q',
        label: 'Charge (Q)',
        inputs: [
           { name: 'c', label: 'Capacitance', unit: 'µF', min: 0.1, max: 1000, step: 1, defaultValue: 100 },
           { name: 'v', label: 'Voltage', unit: 'V', min: 1, max: 100, step: 1, defaultValue: 12 }
        ],
        calculate: (v) => ({
          value: v.c * v.v,
          unit: 'µC',
          steps: ['Q = CV', `Q = ${v.c}µF * ${v.v}V`],
          diagram: { type: 'bar', data: [{label: 'Charge Stored', value: v.c*v.v, color: '#f59e0b'}] }
        })
      }
    ]
  },
  'magnetic-force': {
    id: 'magnetic-force',
    title: 'Magnetic Force',
    category: 'Electricity & Magnetism',
    description: 'Force on a moving charge.',
    icon: Magnet,
    solveModes: [
      {
        target: 'f',
        label: 'Force (F)',
        inputs: [
           { name: 'q', label: 'Charge', unit: 'mC', min: 0.1, max: 100, step: 0.1, defaultValue: 1 },
           { name: 'v', label: 'Velocity', unit: 'm/s', min: 1, max: 1000, step: 1, defaultValue: 50 },
           { name: 'b', label: 'B-Field', unit: 'T', min: 0.1, max: 10, step: 0.1, defaultValue: 1 },
           { name: 'theta', label: 'Angle', unit: 'deg', min: 0, max: 90, step: 1, defaultValue: 90 }
        ],
        calculate: (v) => {
          const f = (v.q * 1e-3) * v.v * v.b * Math.sin(v.theta * Math.PI/180);
          return {
            value: f,
            unit: 'N',
            steps: ['F = qvB sin(θ)', `F = ${v.q}m * ${v.v} * ${v.b} * sin(${v.theta})`],
            diagram: { type: 'bar', data: [{label: 'Force', value: f, color: '#8b5cf6'}] }
          };
        }
      }
    ]
  },
  'magnetic-field-wire': {
    id: 'magnetic-field-wire',
    title: 'Magnetic Field (Wire)',
    category: 'Electricity & Magnetism',
    description: 'B-field around a current-carrying wire.',
    icon: Magnet,
    solveModes: [
      {
        target: 'b',
        label: 'Magnetic Field (B)',
        inputs: [
           { name: 'i', label: 'Current', unit: 'A', min: 0.1, max: 1000, step: 0.1, defaultValue: 10 },
           { name: 'r', label: 'Distance', unit: 'cm', min: 1, max: 100, step: 0.1, defaultValue: 5 }
        ],
        calculate: (v) => {
          const mu = 4 * Math.PI * 1e-7;
          const r = v.r / 100;
          const B = (mu * v.i) / (2 * Math.PI * r);
          return {
            value: B * 1e6, // convert to microTesla for readability
            unit: 'µT',
            steps: ['B = μ₀I / 2πr', `B = (4πe-7 * ${v.i}) / (2π * ${v.r}e-2)`],
            diagram: { type: 'orbit', data: { r: v.r, v: 0 } } // Reuse orbit for circular field visual
          };
        }
      }
    ]
  },

  // ==========================================
  // WAVES & SOUND
  // ==========================================
  'wave-properties': {
    id: 'wave-properties',
    title: 'Wave Properties',
    category: 'Waves & Sound',
    description: 'Frequency, Wavelength, and Speed.',
    icon: Waves,
    solveModes: [
      {
        target: 'v',
        label: 'Wave Speed (v)',
        inputs: [
           { name: 'f', label: 'Frequency', unit: 'Hz', min: 1, max: 1000, step: 1, defaultValue: 50 },
           { name: 'lam', label: 'Wavelength', unit: 'm', min: 0.1, max: 100, step: 0.1, defaultValue: 2 }
        ],
        calculate: (v) => ({
          value: v.f * v.lam,
          unit: 'm/s',
          steps: ['v = fλ', `v = ${v.f} * ${v.lam}`],
          diagram: { type: 'wave', data: { f: v.f, lam: v.lam } }
        })
      },
      {
        target: 'f',
        label: 'Frequency (f)',
        inputs: [
          { name: 'v', label: 'Wave Speed', unit: 'm/s', min: 1, max: 5000, step: 1, defaultValue: 340 },
          { name: 'lam', label: 'Wavelength', unit: 'm', min: 0.1, max: 100, step: 0.1, defaultValue: 1 }
        ],
        calculate: (v) => ({
          value: v.v / v.lam,
          unit: 'Hz',
          steps: ['f = v / λ', `f = ${v.v} / ${v.lam}`],
          diagram: { type: 'wave', data: { f: v.v/v.lam, lam: v.lam } }
        })
      }
    ]
  },
  'doppler-effect': {
    id: 'doppler-effect',
    title: 'Doppler Effect',
    category: 'Waves & Sound',
    description: 'Frequency shift of sound.',
    icon: Radio,
    solveModes: [
      {
        target: 'fobs',
        label: 'Observed Freq (f_obs)',
        inputs: [
          { name: 'fs', label: 'Source Freq', unit: 'Hz', min: 100, max: 10000, step: 10, defaultValue: 440 },
          { name: 'v', label: 'Speed of Sound', unit: 'm/s', min: 300, max: 360, step: 1, defaultValue: 343 },
          { name: 'vs', label: 'Source Speed', unit: 'm/s', min: 0, max: 300, step: 1, defaultValue: 20 },
          { name: 'vo', label: 'Observer Speed', unit: 'm/s', min: 0, max: 300, step: 1, defaultValue: 0 }
        ],
        calculate: (v) => {
          const fobs = v.fs * ((v.v + v.vo) / (v.v - v.vs));
          return {
            value: fobs,
            unit: 'Hz',
            steps: ['f_obs = fs * (v + vo) / (v - vs)', `f_obs = ${v.fs} * (${v.v}+${v.vo}) / (${v.v}-${v.vs})`],
            diagram: { type: 'doppler', data: { vs: v.vs, v: v.v } }
          }
        }
      }
    ]
  },
  'sound-decibels': {
    id: 'sound-decibels',
    title: 'Sound Level (dB)',
    category: 'Waves & Sound',
    description: 'Calculate decibel level from intensity.',
    icon: Radio,
    solveModes: [
      {
        target: 'db',
        label: 'Sound Level (β)',
        inputs: [
           { name: 'i', label: 'Intensity', unit: 'W/m²', min: 0, max: 100, step: 0.000000000001, defaultValue: 0.000001 } // 1e-6 => 60dB
        ],
        calculate: (v) => {
           const i0 = 1e-12;
           const db = 10 * Math.log10(v.i / i0);
           return {
             value: db,
             unit: 'dB',
             steps: ['β = 10 log(I/I₀)', `β = 10 log(${v.i}/1e-12)`],
             diagram: { type: 'bar', data: [{label: 'Decibels', value: db, color: '#3b82f6'}] }
           };
        }
      }
    ]
  },

  // ==========================================
  // LIGHT & OPTICS
  // ==========================================
  'diffraction': {
    id: 'diffraction',
    title: 'Diffraction Grating',
    category: 'Light & Optics',
    description: 'Calculate angle of constructive interference.',
    icon: Eye,
    solveModes: [
      {
        target: 'theta',
        label: 'Angle (θ)',
        inputs: [
           { name: 'd', label: 'Slit Spacing', unit: 'µm', min: 0.1, max: 100, step: 0.1, defaultValue: 2 },
           { name: 'lam', label: 'Wavelength', unit: 'nm', min: 380, max: 750, step: 1, defaultValue: 532 },
           { name: 'n', label: 'Order (n)', unit: '', min: 1, max: 10, step: 1, defaultValue: 1 }
        ],
        calculate: (v) => {
           // d sin(theta) = n lambda
           // theta = asin(n lambda / d)
           const d = v.d * 1e-6;
           const lam = v.lam * 1e-9;
           const val = (v.n * lam) / d;
           if(val > 1) return { value: NaN, unit: 'deg', steps: ['Impossible geometry (sin θ > 1)'], diagram: undefined };
           
           const theta = Math.asin(val) * (180/Math.PI);
           return {
             value: theta,
             unit: 'deg',
             steps: ['d sinθ = nλ', `θ = arcsin(${v.n}*${v.lam}nm / ${v.d}µm)`],
             diagram: { type: 'interference', data: { lam: v.lam, d: v.d } }
           };
        }
      }
    ]
  },
  'lens-equation': {
    id: 'lens-equation',
    title: 'Lens Equation',
    category: 'Light & Optics',
    description: 'Focal length and image distance.',
    icon: Eye,
    solveModes: [
      {
        target: 'di',
        label: 'Image Distance (di)',
        inputs: [
           { name: 'f', label: 'Focal Length', unit: 'cm', min: 1, max: 100, step: 0.1, defaultValue: 10 },
           { name: 'do', label: 'Object Dist', unit: 'cm', min: 1, max: 100, step: 0.1, defaultValue: 20 }
        ],
        calculate: (v) => {
           // 1/f = 1/do + 1/di => 1/di = 1/f - 1/do
           const invDi = (1/v.f) - (1/v.do);
           const di = 1/invDi;
           return {
             value: di,
             unit: 'cm',
             steps: ['1/f = 1/do + 1/di', `1/${v.f} = 1/${v.do} + 1/di`, `di = ${di.toFixed(2)}`],
             diagram: { type: 'lens', data: { f: v.f, do: v.do, di } }
           };
        }
      }
    ]
  },
  'snells-law': {
    id: 'snells-law',
    title: 'Snell\'s Law',
    category: 'Light & Optics',
    description: 'Calculate refraction angle of light.',
    icon: Eye,
    solveModes: [
      {
        target: 'angle2',
        label: 'Refraction Angle',
        inputs: [
          { name: 'n1', label: 'Index n1', unit: '', min: 1, max: 3, step: 0.01, defaultValue: 1.0 },
          { name: 'n2', label: 'Index n2', unit: '', min: 1, max: 3, step: 0.01, defaultValue: 1.5 },
          { name: 'theta1', label: 'Inc Angle', unit: 'deg', min: 0, max: 89, step: 1, defaultValue: 30 }
        ],
        calculate: (v) => {
          const rad1 = v.theta1 * (Math.PI/180);
          const sinT2 = (v.n1 / v.n2) * Math.sin(rad1);
          let theta2 = 0;
          if(sinT2 > 1) theta2 = 90; 
          else theta2 = Math.asin(sinT2) * (180/Math.PI);

          return {
            value: theta2,
            unit: 'deg',
            steps: [`n₁sin(θ₁) = n₂sin(θ₂)`, `θ₂ = arcsin(${sinT2.toFixed(3)})`],
            diagram: { type: 'ray', data: { n1: v.n1, n2: v.n2, theta1: v.theta1, theta2 } }
          };
        }
      }
    ]
  },

  // ==========================================
  // THERMODYNAMICS
  // ==========================================
  'ideal-gas': {
    id: 'ideal-gas',
    title: 'Ideal Gas Law',
    category: 'Thermodynamics',
    description: 'PV = nRT relations.',
    icon: Wind,
    solveModes: [
      {
        target: 'p',
        label: 'Pressure (P)',
        inputs: [
           { name: 'n', label: 'Moles', unit: 'mol', min: 0.1, max: 100, step: 0.1, defaultValue: 1 },
           { name: 't', label: 'Temp', unit: 'K', min: 1, max: 1000, step: 1, defaultValue: 300 },
           { name: 'v', label: 'Volume', unit: 'L', min: 1, max: 1000, step: 1, defaultValue: 22.4 }
        ],
        calculate: (v) => {
           const R = 8.314;
           const p = (v.n * 0.0821 * v.t) / v.v;
           return {
             value: p,
             unit: 'atm',
             steps: ['PV = nRT', `P = nRT/V = ${v.n}*0.0821*${v.t} / ${v.v}`],
             diagram: { type: 'gas', data: { p, v: v.v, t: v.t } }
           };
        }
      }
    ]
  },
  'thermal-expansion': {
    id: 'thermal-expansion',
    title: 'Thermal Expansion',
    category: 'Thermodynamics',
    description: 'Length change due to temperature.',
    icon: Thermometer,
    solveModes: [
      {
        target: 'dl',
        label: 'Change in Length (ΔL)',
        inputs: [
           { name: 'l', label: 'Orig Length', unit: 'm', min: 1, max: 1000, step: 1, defaultValue: 10 },
           { name: 'alpha', label: 'Coeff (x10⁻⁶)', unit: '/K', min: 1, max: 100, step: 1, defaultValue: 12 }, // Steel
           { name: 'dt', label: 'Change in T', unit: '°C', min: 1, max: 500, step: 1, defaultValue: 100 }
        ],
        calculate: (v) => {
           const dl = v.l * (v.alpha * 1e-6) * v.dt;
           return {
             value: dl * 1000, // convert to mm
             unit: 'mm',
             steps: ['ΔL = α L ΔT', `ΔL = ${v.alpha}e-6 * ${v.l} * ${v.dt}`],
             diagram: { type: 'bar', data: [{label: 'Orig', value: v.l*1000, color: '#94a3b8'}, {label: 'Expanded', value: (v.l*1000)+dl, color: '#ef4444'}]}
           };
        }
      }
    ]
  },
  'heat-transfer': {
    id: 'heat-transfer',
    title: 'Specific Heat',
    category: 'Thermodynamics',
    description: 'Q = mcΔT calculation.',
    icon: Flame,
    solveModes: [
      {
        target: 'q',
        label: 'Heat Energy (Q)',
        inputs: [
          { name: 'm', label: 'Mass', unit: 'kg', min: 0.1, max: 100, step: 0.1, defaultValue: 1 },
          { name: 'c', label: 'Specific Heat', unit: 'J/kgK', min: 100, max: 5000, step: 10, defaultValue: 4186 },
          { name: 'dt', label: 'Change in Temp', unit: '°C', min: 1, max: 1000, step: 1, defaultValue: 50 }
        ],
        calculate: (v) => ({
          value: v.m * v.c * v.dt,
          unit: 'J',
          steps: [`Q = m c ΔT`, `Q = ${v.m} * ${v.c} * ${v.dt}`],
          diagram: { type: 'bar', data: [{label: 'Energy (J)', value: v.m * v.c * v.dt, color: '#ef4444'}] }
        })
      }
    ]
  },

  // ==========================================
  // MODERN PHYSICS
  // ==========================================
  'mass-energy': {
    id: 'mass-energy',
    title: 'E = mc²',
    category: 'Modern Physics',
    description: 'Mass-energy equivalence.',
    icon: Atom,
    solveModes: [
      {
        target: 'e',
        label: 'Energy (E)',
        inputs: [
           { name: 'm', label: 'Mass', unit: 'kg', min: 0.0000001, max: 1, step: 0.0000001, defaultValue: 0.001 }
        ],
        calculate: (v) => {
           const c = 3e8;
           const e = v.m * c * c;
           return {
             value: e,
             unit: 'J',
             steps: ['E = mc²', `E = ${v.m} * (3e8)²`],
             diagram: { type: 'bar', data: [{label: 'Rest Energy', value: e, color: '#8b5cf6'}] }
           };
        }
      }
    ]
  },
  'radioactive-decay': {
    id: 'radioactive-decay',
    title: 'Radioactive Decay',
    category: 'Modern Physics',
    description: 'Calculate remaining isotope amount.',
    icon: Radio,
    solveModes: [
      {
        target: 'n',
        label: 'Remaining Amount (N)',
        inputs: [
           { name: 'n0', label: 'Initial Amount', unit: 'g', min: 1, max: 1000, step: 1, defaultValue: 100 },
           { name: 'half', label: 'Half-Life', unit: 'yrs', min: 1, max: 10000, step: 1, defaultValue: 5730 },
           { name: 't', label: 'Time Elapsed', unit: 'yrs', min: 1, max: 50000, step: 100, defaultValue: 5730 }
        ],
        calculate: (v) => {
           const n = v.n0 * Math.pow(0.5, v.t / v.half);
           return {
             value: n,
             unit: 'g',
             steps: ['N = N₀(1/2)^(t/t½)', `N = ${v.n0} * 0.5^(${v.t}/${v.half})`],
             diagram: { type: 'decay', data: { n0: v.n0, half: v.half, t: v.t } }
           };
        }
      }
    ]
  },
  'photon-energy': {
    id: 'photon-energy',
    title: 'Photon Energy',
    category: 'Modern Physics',
    description: 'Energy of a photon from frequency.',
    icon: Lightbulb,
    solveModes: [
      {
        target: 'e',
        label: 'Energy (E)',
        inputs: [
           { name: 'f', label: 'Frequency', unit: 'x10¹⁴ Hz', min: 1, max: 100, step: 0.1, defaultValue: 4.5 } // Visible light
        ],
        calculate: (v) => {
           const h = 6.626e-34;
           const f = v.f * 1e14;
           const e = h * f;
           return {
             value: e,
             unit: 'J',
             steps: ['E = hf', `E = 6.626e-34 * ${v.f}e14`],
             diagram: { type: 'wave', data: { f: v.f, lam: 1 } }
           };
        }
      }
    ]
  },
  'length-contraction': {
    id: 'length-contraction',
    title: 'Length Contraction',
    category: 'Modern Physics',
    description: 'Relativistic length effects.',
    icon: Move,
    solveModes: [
      {
        target: 'l',
        label: 'Contracted Length (L)',
        inputs: [
           { name: 'l0', label: 'Rest Length', unit: 'm', min: 1, max: 1000, step: 1, defaultValue: 100 },
           { name: 'v', label: 'Velocity (%c)', unit: '%', min: 0, max: 99.9, step: 0.1, defaultValue: 80 }
        ],
        calculate: (v) => {
           const beta = v.v / 100;
           const l = v.l0 * Math.sqrt(1 - beta*beta);
           return {
             value: l,
             unit: 'm',
             steps: ['L = L₀√(1 - v²/c²)', `L = ${v.l0} * √(${1 - beta*beta})`],
             diagram: { type: 'bar', data: [{label: 'Rest Length', value: v.l0, color: '#94a3b8'}, {label: 'Observed Length', value: l, color: '#ef4444'}] }
           };
        }
      }
    ]
  },
  'time-dilation': {
    id: 'time-dilation',
    title: 'Time Dilation',
    category: 'Modern Physics',
    description: 'Relativistic time effects.',
    icon: Atom,
    solveModes: [
      {
        target: 't',
        label: 'Dilated Time (t\')',
        inputs: [
           { name: 't0', label: 'Proper Time', unit: 's', min: 1, max: 100, step: 1, defaultValue: 10 },
           { name: 'v', label: 'Velocity (%c)', unit: '%', min: 0, max: 99.9, step: 0.1, defaultValue: 50 }
        ],
        calculate: (vals) => {
           const v_c = vals.v / 100;
           const gamma = 1 / Math.sqrt(1 - v_c*v_c);
           const t = vals.t0 * gamma;
           return {
             value: t,
             unit: 's',
             steps: [
               `γ = 1 / √(1 - v²/c²) = ${gamma.toFixed(4)}`,
               `t' = γt₀ = ${gamma.toFixed(4)} * ${vals.t0}`
             ],
             diagram: { type: 'bar', data: [{label: 'Proper Time', value: vals.t0, color: '#94a3b8'}, {label: 'Dilated Time', value: t, color: '#8b5cf6'}] }
           };
        }
      }
    ]
  },

  // ==========================================
  // ASTRONOMY
  // ==========================================
  'gravitational-force': {
    id: 'gravitational-force',
    title: 'Gravity Force',
    category: 'Astronomy',
    description: 'Newton\'s Law of Gravitation.',
    icon: Orbit,
    solveModes: [
      {
        target: 'f',
        label: 'Force (F)',
        inputs: [
           { name: 'm1', label: 'Mass 1', unit: 'x10²⁴kg', min: 0.1, max: 1000, step: 0.1, defaultValue: 5.97 }, // Earth
           { name: 'm2', label: 'Mass 2', unit: 'kg', min: 1, max: 10000, step: 10, defaultValue: 1000 },
           { name: 'r', label: 'Distance', unit: 'km', min: 6000, max: 100000, step: 100, defaultValue: 6371 }
        ],
        calculate: (v) => {
           const G = 6.674e-11;
           const M1 = v.m1 * 1e24;
           const R = v.r * 1000;
           const f = (G * M1 * v.m2) / (R * R);
           return {
             value: f,
             unit: 'N',
             steps: ['F = GMm/r²', `F = (6.67e-11 * ${v.m1}e24 * ${v.m2}) / (${v.r}e3)²`],
             diagram: { type: 'forces', data: { m1: 100, m2: 10, type: 'mass' } }
           };
        }
      }
    ]
  },
  'escape-velocity': {
    id: 'escape-velocity',
    title: 'Escape Velocity',
    category: 'Astronomy',
    description: 'Speed to break orbit.',
    icon: Orbit,
    solveModes: [
      {
        target: 'v',
        label: 'Velocity (ve)',
        inputs: [
           { name: 'm', label: 'Mass', unit: 'x10²⁴kg', min: 0.1, max: 1000, step: 0.1, defaultValue: 5.97 },
           { name: 'r', label: 'Radius', unit: 'km', min: 1000, max: 100000, step: 100, defaultValue: 6371 }
        ],
        calculate: (v) => {
           const G = 6.674e-11;
           const M = v.m * 1e24;
           const R = v.r * 1000;
           const ve = Math.sqrt((2 * G * M) / R);
           return {
             value: ve,
             unit: 'm/s',
             steps: ['v = √(2GM/R)', `v = √((2 * 6.67e-11 * ${v.m}e24) / ${v.r}e3)`],
             diagram: { type: 'orbit', data: { v: ve, r: v.r } }
           };
        }
      }
    ]
  },
  'orbital-velocity': {
    id: 'orbital-velocity',
    title: 'Orbital Velocity',
    category: 'Astronomy',
    description: 'Velocity required to stay in orbit.',
    icon: Orbit,
    solveModes: [
      {
        target: 'v',
        label: 'Orbital Velocity',
        inputs: [
          { name: 'm', label: 'Mass', unit: 'x10²⁴kg', min: 0.1, max: 1000, step: 0.1, defaultValue: 5.97 },
          { name: 'r', label: 'Orbit Radius', unit: 'km', min: 2000, max: 100000, step: 100, defaultValue: 6700 }
        ],
        calculate: (vals) => {
          const G = 6.674e-11;
          const M = vals.m * 1e24;
          const R = vals.r * 1000;
          const v = Math.sqrt( (G * M) / R );
          return {
            value: v,
            unit: 'm/s',
            steps: [
              `v = √(GM / r)`,
              `v = √(${G} * ${M.toExponential(2)} / ${R.toExponential(2)})`
            ],
            diagram: { type: 'orbit', data: { r: vals.r, v } }
          };
        }
      }
    ]
  },
  'keplers-third-law': {
    id: 'keplers-third-law',
    title: 'Kepler\'s Third Law',
    category: 'Astronomy',
    description: 'Orbital period vs Radius.',
    icon: Orbit,
    solveModes: [
      {
        target: 't',
        label: 'Period (T)',
        inputs: [
          { name: 'm', label: 'Central Mass', unit: 'x10²⁴kg', min: 0.1, max: 2000000, step: 0.1, defaultValue: 1989000 }, // Sun
          { name: 'a', label: 'Semi-major Axis', unit: 'AU', min: 0.1, max: 100, step: 0.1, defaultValue: 1 } // Earth
        ],
        calculate: (v) => {
          // T^2 = (4pi^2 / GM) a^3
          const G = 6.674e-11;
          const M = v.m * 1e24;
          const A = v.a * 1.496e11; // AU to m
          const T2 = (4 * Math.PI * Math.PI * Math.pow(A, 3)) / (G * M);
          const T = Math.sqrt(T2);
          const years = T / (365.25 * 24 * 3600);
          
          return {
            value: years,
            unit: 'years',
            steps: ['T² = (4π²/GM)a³', `T = √(...) / sec_in_year`],
            diagram: { type: 'orbit', data: { r: v.a*1000, v: 0 } }
          };
        }
      }
    ]
  },
  'star-luminosity': {
    id: 'star-luminosity',
    title: 'Star Luminosity',
    category: 'Astronomy',
    description: 'Brightness based on size and temp.',
    icon: Lightbulb,
    solveModes: [
      {
        target: 'l',
        label: 'Luminosity (L)',
        inputs: [
          { name: 'r', label: 'Radius', unit: 'R_sun', min: 0.1, max: 1000, step: 0.1, defaultValue: 1 },
          { name: 't', label: 'Temperature', unit: 'K', min: 1000, max: 50000, step: 100, defaultValue: 5778 }
        ],
        calculate: (v) => {
           // L = 4pi R^2 sigma T^4
           // Use solar units for simplicity in calc, but proper physics
           const R_sun = 6.96e8;
           const sigma = 5.67e-8;
           const R = v.r * R_sun;
           const L = 4 * Math.PI * R * R * sigma * Math.pow(v.t, 4);
           const L_sun = 3.828e26;
           
           return {
             value: L / L_sun,
             unit: 'L_sun',
             steps: ['L = 4πR²σT⁴', `L/L☉ = ${(L/L_sun).toFixed(2)}`],
             diagram: { type: 'star', data: { r: v.r, t: v.t } }
           };
        }
      }
    ]
  }
};
