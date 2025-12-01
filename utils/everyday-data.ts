
import { Thermometer, Ruler, Scale, Beaker, Gauge, Clock, Map, Shirt, Utensils, Flag } from 'lucide-react';

export interface EverydayInput {
  name: string;
  label: string;
  type: 'number' | 'select';
  defaultValue: number | string;
  options?: { label: string; value: string }[];
  unit?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface EverydayResult {
  value: string;
  unit: string;
  details: string[];
  visual?: {
    type: 'thermometer' | 'bar' | 'fill' | 'gauge' | 'text-box';
    data: any;
  };
}

export interface EverydayCalculatorConfig {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: any;
  inputs: EverydayInput[];
  calculate: (values: Record<string, any>) => EverydayResult;
}

export const everydayCategories = [
  { id: 'temperature', title: 'Temperature', icon: Thermometer, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/20' },
  { id: 'length-distance', title: 'Length & Distance', icon: Ruler, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  { id: 'weight-mass', title: 'Weight & Mass', icon: Scale, color: 'text-green-500', bg: 'bg-green-100 dark:bg-green-900/20' },
  { id: 'volume-capacity', title: 'Volume & Capacity', icon: Beaker, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/20' },
  { id: 'speed-fuel', title: 'Speed & Fuel', icon: Gauge, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/20' },
  { id: 'tools', title: 'Everyday Tools', icon: Shirt, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/20' },
];

// --- Helper Conversion Logic ---

// Temperature
const convertTemp = (val: number, from: string, to: string) => {
  let k = 0;
  // Convert to Kelvin first
  if (from === 'C') k = val + 273.15;
  else if (from === 'F') k = (val - 32) * 5/9 + 273.15;
  else if (from === 'K') k = val;
  else if (from === 'R') k = val * 5/9;

  // Convert from Kelvin to target
  if (to === 'C') return k - 273.15;
  if (to === 'F') return (k - 273.15) * 9/5 + 32;
  if (to === 'K') return k;
  if (to === 'R') return k * 9/5;
  return val;
};

// Length (Base: Meter)
const lengthFactors: Record<string, number> = {
  'm': 1, 'km': 1000, 'cm': 0.01, 'mm': 0.001,
  'mi': 1609.34, 'yd': 0.9144, 'ft': 0.3048, 'in': 0.0254, 'nm': 1852
};

// Weight (Base: Gram)
const weightFactors: Record<string, number> = {
  'g': 1, 'kg': 1000, 'mg': 0.001, 't': 1000000,
  'lb': 453.592, 'oz': 28.3495, 'st': 6350.29, 'ct': 0.2
};

// Volume (Base: Milliliter)
const volumeFactors: Record<string, number> = {
  'ml': 1, 'l': 1000, 'm3': 1e6, 'cm3': 1,
  'gal': 3785.41, 'qt': 946.353, 'pt': 473.176, 'cup': 236.588,
  'fl oz': 29.5735, 'tbsp': 14.7868, 'tsp': 4.92892,
  'gal_uk': 4546.09
};

// Speed (Base: m/s)
const speedFactors: Record<string, number> = {
  'm/s': 1, 'km/h': 0.277778, 'mph': 0.44704, 'ft/s': 0.3048, 'kn': 0.514444
};

// Time (Base: Second)
const timeFactors: Record<string, number> = {
  's': 1, 'min': 60, 'h': 3600, 'd': 86400, 'wk': 604800, 'y': 31536000
};

// Area (Base: Square Meter)
const areaFactors: Record<string, number> = {
  'm2': 1, 'cm2': 0.0001, 'km2': 1e6,
  'ft2': 0.092903, 'in2': 0.00064516, 'yd2': 0.836127,
  'ac': 4046.86, 'ha': 10000
};

const convertLinear = (val: number, from: string, to: string, factors: Record<string, number>) => {
  const baseVal = val * factors[from];
  return baseVal / factors[to];
};

export const everydayCalculators: Record<string, EverydayCalculatorConfig> = {
  // --- TEMPERATURE ---
  'temperature-converter': {
    id: 'temperature-converter',
    title: 'Temperature Converter',
    category: 'Temperature',
    description: 'Convert Celsius, Fahrenheit, Kelvin.',
    icon: Thermometer,
    inputs: [
      { name: 'value', label: 'Value', type: 'number', defaultValue: 25 },
      { name: 'from', label: 'From', type: 'select', defaultValue: 'C', options: [
        { label: 'Celsius (°C)', value: 'C' }, { label: 'Fahrenheit (°F)', value: 'F' },
        { label: 'Kelvin (K)', value: 'K' }, { label: 'Rankine (°R)', value: 'R' }
      ]},
      { name: 'to', label: 'To', type: 'select', defaultValue: 'F', options: [
        { label: 'Celsius (°C)', value: 'C' }, { label: 'Fahrenheit (°F)', value: 'F' },
        { label: 'Kelvin (K)', value: 'K' }, { label: 'Rankine (°R)', value: 'R' }
      ]}
    ],
    calculate: (v) => {
      const res = convertTemp(Number(v.value), v.from, v.to);
      const freeze = convertTemp(0, 'C', v.to);
      const boil = convertTemp(100, 'C', v.to);
      return {
        value: res.toFixed(2),
        unit: v.to,
        details: [`Freezing Point: ${freeze.toFixed(1)} ${v.to}`, `Boiling Point: ${boil.toFixed(1)} ${v.to}`],
        visual: { type: 'thermometer', data: { value: Number(v.value), unit: v.from } }
      }
    }
  },

  // --- LENGTH ---
  'length-distance-converter': {
    id: 'length-distance-converter',
    title: 'Length & Distance',
    category: 'Length & Distance',
    description: 'Convert meters, feet, miles, etc.',
    icon: Ruler,
    inputs: [
      { name: 'value', label: 'Length', type: 'number', defaultValue: 1, min: 0 },
      { name: 'from', label: 'From Unit', type: 'select', defaultValue: 'm', options: [
        { label: 'Meters (m)', value: 'm' }, { label: 'Kilometers (km)', value: 'km' },
        { label: 'Centimeters (cm)', value: 'cm' }, { label: 'Millimeters (mm)', value: 'mm' },
        { label: 'Miles (mi)', value: 'mi' }, { label: 'Yards (yd)', value: 'yd' },
        { label: 'Feet (ft)', value: 'ft' }, { label: 'Inches (in)', value: 'in' },
        { label: 'Nautical Miles (nm)', value: 'nm' }
      ]},
      { name: 'to', label: 'To Unit', type: 'select', defaultValue: 'ft', options: [
        { label: 'Meters (m)', value: 'm' }, { label: 'Kilometers (km)', value: 'km' },
        { label: 'Centimeters (cm)', value: 'cm' }, { label: 'Millimeters (mm)', value: 'mm' },
        { label: 'Miles (mi)', value: 'mi' }, { label: 'Yards (yd)', value: 'yd' },
        { label: 'Feet (ft)', value: 'ft' }, { label: 'Inches (in)', value: 'in' },
        { label: 'Nautical Miles (nm)', value: 'nm' }
      ]}
    ],
    calculate: (v) => {
      const res = convertLinear(Number(v.value), v.from, v.to, lengthFactors);
      return {
        value: res.toPrecision(6).replace(/\.?0+$/, ""),
        unit: v.to,
        details: [`Base: ${(Number(v.value) * lengthFactors[v.from]).toFixed(4)} meters`],
        visual: { type: 'bar', data: { value: 1, max: 1 } } // Simple placeholder visual for now
      }
    }
  },

  // --- WEIGHT ---
  'weight-mass-converter': {
    id: 'weight-mass-converter',
    title: 'Weight & Mass',
    category: 'Weight & Mass',
    description: 'Convert kg, lbs, oz, grams.',
    icon: Scale,
    inputs: [
      { name: 'value', label: 'Weight', type: 'number', defaultValue: 1, min: 0 },
      { name: 'from', label: 'From Unit', type: 'select', defaultValue: 'kg', options: [
        { label: 'Kilograms (kg)', value: 'kg' }, { label: 'Grams (g)', value: 'g' },
        { label: 'Milligrams (mg)', value: 'mg' }, { label: 'Metric Tons (t)', value: 't' },
        { label: 'Pounds (lb)', value: 'lb' }, { label: 'Ounces (oz)', value: 'oz' },
        { label: 'Stone (st)', value: 'st' }, { label: 'Carats (ct)', value: 'ct' }
      ]},
      { name: 'to', label: 'To Unit', type: 'select', defaultValue: 'lb', options: [
        { label: 'Kilograms (kg)', value: 'kg' }, { label: 'Grams (g)', value: 'g' },
        { label: 'Milligrams (mg)', value: 'mg' }, { label: 'Metric Tons (t)', value: 't' },
        { label: 'Pounds (lb)', value: 'lb' }, { label: 'Ounces (oz)', value: 'oz' },
        { label: 'Stone (st)', value: 'st' }, { label: 'Carats (ct)', value: 'ct' }
      ]}
    ],
    calculate: (v) => {
      const res = convertLinear(Number(v.value), v.from, v.to, weightFactors);
      return {
        value: res.toPrecision(6).replace(/\.?0+$/, ""),
        unit: v.to,
        details: [`Base: ${(Number(v.value) * weightFactors[v.from]).toFixed(2)} grams`],
        visual: { type: 'bar', data: { value: 1, max: 1 } }
      }
    }
  },

  // --- VOLUME ---
  'volume-capacity-converter': {
    id: 'volume-capacity-converter',
    title: 'Volume & Capacity',
    category: 'Volume & Capacity',
    description: 'Convert liters, gallons, cups.',
    icon: Beaker,
    inputs: [
      { name: 'value', label: 'Volume', type: 'number', defaultValue: 1, min: 0 },
      { name: 'from', label: 'From Unit', type: 'select', defaultValue: 'l', options: [
        { label: 'Liters (L)', value: 'l' }, { label: 'Milliliters (mL)', value: 'ml' },
        { label: 'Cubic Meters (m³)', value: 'm3' }, { label: 'Gallons (US)', value: 'gal' },
        { label: 'Gallons (UK)', value: 'gal_uk' }, { label: 'Quarts (US)', value: 'qt' },
        { label: 'Pints (US)', value: 'pt' }, { label: 'Cups (US)', value: 'cup' },
        { label: 'Fluid Ounces (US)', value: 'fl oz' }, { label: 'Tablespoons', value: 'tbsp' },
        { label: 'Teaspoons', value: 'tsp' }
      ]},
      { name: 'to', label: 'To Unit', type: 'select', defaultValue: 'gal', options: [
        { label: 'Liters (L)', value: 'l' }, { label: 'Milliliters (mL)', value: 'ml' },
        { label: 'Cubic Meters (m³)', value: 'm3' }, { label: 'Gallons (US)', value: 'gal' },
        { label: 'Gallons (UK)', value: 'gal_uk' }, { label: 'Quarts (US)', value: 'qt' },
        { label: 'Pints (US)', value: 'pt' }, { label: 'Cups (US)', value: 'cup' },
        { label: 'Fluid Ounces (US)', value: 'fl oz' }, { label: 'Tablespoons', value: 'tbsp' },
        { label: 'Teaspoons', value: 'tsp' }
      ]}
    ],
    calculate: (v) => {
      const res = convertLinear(Number(v.value), v.from, v.to, volumeFactors);
      const ml = Number(v.value) * volumeFactors[v.from];
      // Normalize visual fill (assume max visually is 1 gallon ~ 3785 ml, or 1 cup ~ 236 ml)
      let maxVis = 1000;
      if (ml < 300) maxVis = 300; // Cup scale
      else if (ml < 1000) maxVis = 1000; // Liter scale
      else maxVis = 4000; // Gallon scale
      
      const pct = Math.min(100, (ml / maxVis) * 100);

      return {
        value: res.toPrecision(6).replace(/\.?0+$/, ""),
        unit: v.to,
        details: [`Base: ${ml.toFixed(1)} mL`],
        visual: { type: 'fill', data: { percent: pct } }
      }
    }
  },

  // --- SPEED & FUEL ---
  'speed-fuel-converter': {
    id: 'speed-fuel-converter',
    title: 'Speed & Fuel',
    category: 'Speed & Fuel',
    description: 'Convert speed and efficiency.',
    icon: Gauge,
    inputs: [
      { name: 'type', label: 'Mode', type: 'select', defaultValue: 'speed', options: [{label: 'Speed', value: 'speed'}, {label: 'Fuel Efficiency', value: 'fuel'}] },
      { name: 'value', label: 'Value', type: 'number', defaultValue: 100 },
      { name: 'from', label: 'From Unit', type: 'select', defaultValue: 'km/h', options: [] }, // Dynamic options handled in logic or simplified here
      { name: 'to', label: 'To Unit', type: 'select', defaultValue: 'mph', options: [] }
    ],
    calculate: (v) => {
      if (v.type === 'speed') {
         // Override generic options logic simulation for cleaner code structure
         const speedRes = convertLinear(Number(v.value), v.from || 'km/h', v.to || 'mph', speedFactors);
         return {
           value: speedRes.toFixed(1),
           unit: v.to || 'mph',
           details: ['Standard speed conversion'],
           visual: { type: 'gauge', data: { value: speedRes, max: 200 } }
         }
      } else {
         // Fuel Efficiency: MPG <-> L/100km is inverse
         const val = Number(v.value);
         let res = 0;
         let from = v.from || 'L/100km';
         let to = v.to || 'mpg_us';
         
         // Helper: Convert everything to MPG(US) first
         let mpgUS = 0;
         if (from === 'L/100km') mpgUS = 235.215 / val;
         else if (from === 'mpg_us') mpgUS = val;
         else if (from === 'mpg_uk') mpgUS = val * 0.832674;

         if (to === 'L/100km') res = 235.215 / mpgUS;
         else if (to === 'mpg_us') res = mpgUS;
         else if (to === 'mpg_uk') res = mpgUS * 1.20095;

         return {
           value: res.toFixed(2),
           unit: to,
           details: ['Inverse relation: L/100km = 235.215 / MPG(US)'],
           visual: { type: 'gauge', data: { value: res, max: 100 } }
         }
      }
    }
  },

  // --- TOOLS ---
  'time-duration-converter': {
    id: 'time-duration-converter',
    title: 'Time & Duration',
    category: 'Everyday Tools',
    description: 'Convert seconds, hours, days.',
    icon: Clock,
    inputs: [
      { name: 'value', label: 'Duration', type: 'number', defaultValue: 1, min: 0 },
      { name: 'from', label: 'From Unit', type: 'select', defaultValue: 'h', options: [
        { label: 'Seconds', value: 's' }, { label: 'Minutes', value: 'min' },
        { label: 'Hours', value: 'h' }, { label: 'Days', value: 'd' },
        { label: 'Weeks', value: 'wk' }, { label: 'Years', value: 'y' }
      ]},
      { name: 'to', label: 'To Unit', type: 'select', defaultValue: 'min', options: [
        { label: 'Seconds', value: 's' }, { label: 'Minutes', value: 'min' },
        { label: 'Hours', value: 'h' }, { label: 'Days', value: 'd' },
        { label: 'Weeks', value: 'wk' }, { label: 'Years', value: 'y' }
      ]}
    ],
    calculate: (v) => {
      const res = convertLinear(Number(v.value), v.from, v.to, timeFactors);
      return {
        value: res.toPrecision(6).replace(/\.?0+$/, ""),
        unit: v.to,
        details: [`Base: ${(Number(v.value) * timeFactors[v.from]).toFixed(0)} seconds`],
        visual: { type: 'text-box', data: { text: 'Time flies!' } }
      }
    }
  },
  'area-converter': {
    id: 'area-converter',
    title: 'Area Converter',
    category: 'Everyday Tools',
    description: 'Acres, hectares, sq meters.',
    icon: Map,
    inputs: [
      { name: 'value', label: 'Area', type: 'number', defaultValue: 1, min: 0 },
      { name: 'from', label: 'From Unit', type: 'select', defaultValue: 'm2', options: [
        { label: 'Sq Meters (m²)', value: 'm2' }, { label: 'Sq Kilometers (km²)', value: 'km2' },
        { label: 'Sq Feet (ft²)', value: 'ft2' }, { label: 'Sq Inches (in²)', value: 'in2' },
        { label: 'Sq Yards (yd²)', value: 'yd2' }, { label: 'Acres (ac)', value: 'ac' },
        { label: 'Hectares (ha)', value: 'ha' }
      ]},
      { name: 'to', label: 'To Unit', type: 'select', defaultValue: 'ft2', options: [
        { label: 'Sq Meters (m²)', value: 'm2' }, { label: 'Sq Kilometers (km²)', value: 'km2' },
        { label: 'Sq Feet (ft²)', value: 'ft2' }, { label: 'Sq Inches (in²)', value: 'in2' },
        { label: 'Sq Yards (yd²)', value: 'yd2' }, { label: 'Acres (ac)', value: 'ac' },
        { label: 'Hectares (ha)', value: 'ha' }
      ]}
    ],
    calculate: (v) => {
      const res = convertLinear(Number(v.value), v.from, v.to, areaFactors);
      return {
        value: res.toPrecision(6).replace(/\.?0+$/, ""),
        unit: v.to,
        details: [`Base: ${(Number(v.value) * areaFactors[v.from]).toFixed(2)} m²`],
        visual: { type: 'bar', data: { value: 1, max: 1 } }
      }
    }
  },
  'clothing-shoe-size': {
    id: 'clothing-shoe-size',
    title: 'Clothing & Shoe Size',
    category: 'Everyday Tools',
    description: 'US, UK, EU Size Chart.',
    icon: Shirt,
    inputs: [
      { name: 'type', label: 'Item Type', type: 'select', defaultValue: 'shoe_m', options: [
        { label: 'Men\'s Shoes', value: 'shoe_m' },
        { label: 'Women\'s Shoes', value: 'shoe_w' },
      ]},
      { name: 'size', label: 'US Size', type: 'number', defaultValue: 9, min: 4, max: 15, step: 0.5 }
    ],
    calculate: (v) => {
      // Approximate conversions formulas
      let eu = 0, uk = 0;
      const size = Number(v.size);
      
      if (v.type === 'shoe_m') {
        uk = size - 1; // Approx
        eu = 30 + size + (size > 10 ? 2 : 1); // Very rough approx for demo
        // Better linear approx: EU = 30.5 + size + (size>8?1:0)
        eu = 1.27 * (size * 3 + 23) + 2; // Roughly ISO
      } else {
        uk = size - 2;
        eu = 1.27 * (size * 3 + 21) + 2;
      }
      
      // Clean up EU to .5 or whole
      eu = Math.round(eu * 2) / 2;

      return {
        value: `EU ${eu} / UK ${uk}`,
        unit: 'Size',
        details: [
          `US Size: ${size}`,
          `Type: ${v.type === 'shoe_m' ? "Men's" : "Women's"}`
        ],
        visual: { type: 'text-box', data: { text: `${eu}` } }
      }
    }
  }
};
