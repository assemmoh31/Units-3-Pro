
import { Binary, Network, Calendar, Palette, Code, Eye, FileJson, Hash, Globe, Lock, Cpu, Server, Wifi, Key, FileText, Search, Shield, FileCode, ToggleLeft } from 'lucide-react';

// --- Color Helper Functions ---
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
};

const getLuminance = (r: number, g: number, b: number) => {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getContrastRatio = (hex1: string, hex2: string) => {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
};

const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
        r = g = b = l; 
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
};

export interface TechInput {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select' | 'color' | 'date' | 'textarea';
  defaultValue: string | number;
  options?: { label: string; value: string | number }[];
  placeholder?: string;
  rows?: number; // for textarea
  min?: number;
  max?: number;
}

export interface TechResult {
  value: string; // Main display value
  unit?: string;
  details: string[]; // Extra info lines
  diagram?: {
    type: 'color-preview' | 'json-viewer' | 'binary-visual' | 'calendar' | 'barcode' | 'markdown' | 'regex-match' | 'chmod-visual' | 'list' | 'contrast-check' | 'palette-visual' | 'gradient-visual';
    data: any;
  };
}

export interface TechCalculatorConfig {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: any;
  inputs: TechInput[];
  calculate: (values: Record<string, any>) => TechResult;
}

export const techCategories = [
  { id: 'base-converters', title: 'Base Converters', icon: Binary, color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/20' },
  { id: 'bitrate', title: 'Bitrate & Bandwidth', icon: Network, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  { id: 'date-time', title: 'Date & Time', icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
  { id: 'color', title: 'Color Tools', icon: Palette, color: 'text-pink-500', bg: 'bg-pink-100 dark:bg-pink-900/20' },
  { id: 'developer-tools', title: 'Developer Utils', icon: Code, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/20' },
];

export const techCalculators: Record<string, TechCalculatorConfig> = {
  // --- BASE CONVERTERS ---
  'base-converter': {
    id: 'base-converter',
    title: 'Base Converter',
    category: 'Base Converters',
    description: 'Convert between Binary, Octal, Decimal, Hex.',
    icon: Binary,
    inputs: [
      { name: 'value', label: 'Input Value', type: 'text', defaultValue: '255', placeholder: 'e.g. 1010, FF, 255' },
      { name: 'from', label: 'From Base', type: 'select', defaultValue: 10, options: [
        { label: 'Binary (2)', value: 2 },
        { label: 'Octal (8)', value: 8 },
        { label: 'Decimal (10)', value: 10 },
        { label: 'Hexadecimal (16)', value: 16 }
      ]},
      { name: 'to', label: 'To Base', type: 'select', defaultValue: 2, options: [
        { label: 'Binary (2)', value: 2 },
        { label: 'Octal (8)', value: 8 },
        { label: 'Decimal (10)', value: 10 },
        { label: 'Hexadecimal (16)', value: 16 }
      ]}
    ],
    calculate: (v) => {
      try {
        const decimal = parseInt(v.value, parseInt(v.from));
        if (isNaN(decimal)) throw new Error('Invalid Input');
        const result = decimal.toString(parseInt(v.to)).toUpperCase();
        
        // Generate binary visual data
        const binaryStr = decimal.toString(2);
        const bits = binaryStr.padStart(Math.ceil(binaryStr.length / 8) * 8, '0').split('').map(b => b === '1');

        return {
          value: result,
          unit: `(Base ${v.to})`,
          details: [
            `Decimal: ${decimal}`,
            `Binary: ${decimal.toString(2)}`,
            `Hex: ${decimal.toString(16).toUpperCase()}`
          ],
          diagram: { type: 'binary-visual', data: { bits } }
        };
      } catch (e) {
        return { value: 'Error', details: ['Invalid input for selected base'], diagram: undefined };
      }
    }
  },
  'signed-converter': {
    id: 'signed-converter',
    title: 'Signed/Unsigned & Two\'s Comp',
    category: 'Base Converters',
    description: 'Convert between Signed, Unsigned, and Two\'s Complement.',
    icon: Binary,
    inputs: [
      { name: 'value', label: 'Value', type: 'text', defaultValue: '-5', placeholder: 'Enter number' },
      { name: 'bits', label: 'Bit Width', type: 'select', defaultValue: 8, options: [
          { label: '4-bit', value: 4 },
          { label: '8-bit', value: 8 },
          { label: '16-bit', value: 16 },
          { label: '32-bit', value: 32 }
      ]},
      { name: 'type', label: 'Input Type', type: 'select', defaultValue: 'signed', options: [
          { label: 'Signed Decimal', value: 'signed' },
          { label: 'Unsigned Decimal', value: 'unsigned' },
          { label: 'Binary', value: 'binary' },
          { label: 'Hex', value: 'hex' }
      ]}
    ],
    calculate: (v) => {
      try {
        const bits = BigInt(v.bits);
        const maxUnsigned = (1n << bits) - 1n;
        const maxSigned = (1n << (bits - 1n)) - 1n;
        const minSigned = -(1n << (bits - 1n));
        
        let rawVal = 0n;
        
        if(v.type === 'signed') {
            const val = BigInt(v.value);
            if(val > maxSigned || val < minSigned) throw new Error('Out of range');
            // If negative, convert to 2's complement unsigned representation
            rawVal = val < 0n ? (val & maxUnsigned) : val;
        } else if(v.type === 'unsigned') {
            const val = BigInt(v.value);
            if(val < 0n || val > maxUnsigned) throw new Error('Out of range');
            rawVal = val;
        } else if(v.type === 'binary') {
            const str = v.value.replace(/^0b/, '').replace(/\s/g, '');
            if(!/^[01]+$/.test(str)) throw new Error('Invalid Binary');
            if(str.length > Number(bits)) throw new Error('Too many bits');
            rawVal = BigInt('0b' + str);
        } else if(v.type === 'hex') {
            const str = v.value.replace(/^0x/, '').replace(/\s/g, '');
            if(!/^[0-9A-Fa-f]+$/.test(str)) throw new Error('Invalid Hex');
            if(BigInt('0x'+str) > maxUnsigned) throw new Error('Too large');
            rawVal = BigInt('0x' + str);
        }

        // Calculations
        const unsignedStr = rawVal.toString();
        
        // Determine signed value
        // Check MSB
        const isNegative = (rawVal & (1n << (bits - 1n))) !== 0n;
        const signedVal = isNegative ? rawVal - (1n << bits) : rawVal;
        const signedStr = signedVal.toString();

        const binaryStr = rawVal.toString(2).padStart(Number(bits), '0');
        const hexStr = rawVal.toString(16).toUpperCase().padStart(Math.ceil(Number(bits)/4), '0');

        const bitArray = binaryStr.split('').map(b => b === '1');

        return {
            value: `0b${binaryStr}`,
            unit: `(${bits}-bit)`,
            details: [
                `Signed: ${signedStr}`,
                `Unsigned: ${unsignedStr}`,
                `Hex: 0x${hexStr}`,
                `Binary: ${binaryStr.replace(/(.{4})/g, '$1 ').trim()}`
            ],
            diagram: { type: 'binary-visual', data: { bits: bitArray } }
        };

      } catch (e: any) {
          return { value: 'Error', unit: '', details: [e.message || 'Invalid input'] };
      }
    }
  },

  // --- BITRATE & BANDWIDTH ---
  'bandwidth': {
    id: 'bandwidth',
    title: 'Bandwidth Calculator',
    category: 'Bitrate & Bandwidth',
    description: 'Calculate transfer time.',
    icon: Network,
    inputs: [
      { name: 'size', label: 'File Size', type: 'number', defaultValue: 1, placeholder: 'Size' },
      { name: 'sizeUnit', label: 'Size Unit', type: 'select', defaultValue: 'GB', options: [
        { label: 'MB', value: 'MB' }, { label: 'GB', value: 'GB' }, { label: 'TB', value: 'TB' }
      ]},
      { name: 'speed', label: 'Speed', type: 'number', defaultValue: 100, placeholder: 'Speed' },
      { name: 'speedUnit', label: 'Speed Unit', type: 'select', defaultValue: 'Mbps', options: [
        { label: 'Kbps', value: 'Kbps' }, { label: 'Mbps', value: 'Mbps' }, { label: 'Gbps', value: 'Gbps' }
      ]}
    ],
    calculate: (v) => {
      // Normalize to bits
      let bits = Number(v.size);
      if (v.sizeUnit === 'MB') bits *= 8 * 1e6;
      else if (v.sizeUnit === 'GB') bits *= 8 * 1e9;
      else if (v.sizeUnit === 'TB') bits *= 8 * 1e12;

      // Normalize speed to bps
      let bps = Number(v.speed);
      if (v.speedUnit === 'Kbps') bps *= 1e3;
      else if (v.speedUnit === 'Mbps') bps *= 1e6;
      else if (v.speedUnit === 'Gbps') bps *= 1e9;

      if (bps === 0) return { value: 'Infinity', details: [], diagram: undefined };

      const seconds = bits / bps;
      
      // Format time
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = Math.floor(seconds % 60);

      return {
        value: `${h}h ${m}m ${s}s`,
        unit: 'Transfer Time',
        details: [
          `Total Bits: ${bits.toExponential(2)}`,
          `Speed: ${v.speed} ${v.speedUnit}`
        ]
      };
    }
  },

  // --- DATE & TIME ---
  'date-diff': {
    id: 'date-diff',
    title: 'Date Difference',
    category: 'Date & Time',
    description: 'Calculate time between dates.',
    icon: Calendar,
    inputs: [
      { name: 'start', label: 'Start Date', type: 'date', defaultValue: new Date().toISOString().split('T')[0] },
      { name: 'end', label: 'End Date', type: 'date', defaultValue: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0] }
    ],
    calculate: (v) => {
      const d1 = new Date(v.start);
      const d2 = new Date(v.end);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;

      return {
        value: `${diffDays} Days`,
        unit: '',
        details: [
          `${weeks} Weeks, ${days} Days`,
          `Hours: ${diffDays * 24}`,
          `Minutes: ${diffDays * 24 * 60}`
        ],
        diagram: { type: 'calendar', data: { start: v.start, end: v.end, days: diffDays } }
      };
    }
  },
  'unix-time': {
    id: 'unix-time',
    title: 'Unix Timestamp',
    category: 'Date & Time',
    description: 'Convert Epoch to Human Date.',
    icon: Calendar,
    inputs: [
      { name: 'ts', label: 'Timestamp (s or ms)', type: 'number', defaultValue: Math.floor(Date.now()/1000) }
    ],
    calculate: (v) => {
      let ts = Number(v.ts);
      // Guess if seconds or ms based on digits (10 digits = sec approx now, 13 = ms)
      let type = 'Seconds';
      if (ts < 10000000000) {
         ts *= 1000;
      } else {
         type = 'Milliseconds';
      }
      const date = new Date(ts);
      return {
        value: date.toLocaleString(),
        unit: 'Local Time',
        details: [
          `UTC: ${date.toUTCString()}`,
          `ISO: ${date.toISOString()}`,
          `Input treated as: ${type}`
        ]
      };
    }
  },

  // --- COLOR TOOLS ---
  'color-converter': {
    id: 'color-converter',
    title: 'Color Converter',
    category: 'Color Tools',
    description: 'HEX, RGB, HSL conversion.',
    icon: Palette,
    inputs: [
      { name: 'color', label: 'Color (Hex)', type: 'text', defaultValue: '#6366f1', placeholder: '#RRGGBB' }
    ],
    calculate: (v) => {
      let hex = v.color.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map((c:string) => c+c).join('');
      if (hex.length !== 6) return { value: 'Invalid', details: [], diagram: undefined };

      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

      return {
        value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
        unit: 'RGB',
        details: [
          `HEX: #${hex.toUpperCase()}`,
          `HSL: ${Math.round(hsl.h)}°, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%`
        ],
        diagram: { type: 'color-preview', data: { hex: `#${hex}` } }
      };
    }
  },
  'contrast-checker': {
    id: 'contrast-checker',
    title: 'Contrast Checker',
    category: 'Color Tools',
    description: 'Check WCAG contrast ratio.',
    icon: Eye,
    inputs: [
      { name: 'fg', label: 'Foreground (Hex)', type: 'text', defaultValue: '#FFFFFF' },
      { name: 'bg', label: 'Background (Hex)', type: 'text', defaultValue: '#6366F1' }
    ],
    calculate: (v) => {
      let fg = v.fg.replace('#', '');
      let bg = v.bg.replace('#', '');
      if (fg.length === 3) fg = fg.split('').map((c:string) => c+c).join('');
      if (bg.length === 3) bg = bg.split('').map((c:string) => c+c).join('');
      
      const ratio = getContrastRatio(fg, bg);
      const aa = ratio >= 4.5 ? 'Pass' : 'Fail';
      const aaa = ratio >= 7 ? 'Pass' : 'Fail';
      const aaLarge = ratio >= 3 ? 'Pass' : 'Fail';

      return {
        value: `${ratio.toFixed(2)} : 1`,
        unit: 'Ratio',
        details: [
          `AA Normal: ${aa}`,
          `AAA Normal: ${aaa}`,
          `AA Large Text: ${aaLarge}`
        ],
        diagram: { type: 'contrast-check', data: { fg: `#${fg}`, bg: `#${bg}`, ratio, passes: { aa: ratio >= 4.5, aaa: ratio >= 7, aaLarge: ratio >= 3 } } }
      };
    }
  },
  'palette-generator': {
    id: 'palette-generator',
    title: 'Palette Generator',
    category: 'Color Tools',
    description: 'Generate color schemes.',
    icon: Palette,
    inputs: [
      { name: 'base', label: 'Base Color', type: 'text', defaultValue: '#3B82F6' },
      { name: 'type', label: 'Scheme', type: 'select', defaultValue: 'complementary', options: [
        { label: 'Complementary', value: 'complementary' },
        { label: 'Analogous', value: 'analogous' },
        { label: 'Triadic', value: 'triadic' },
        { label: 'Monochromatic', value: 'monochromatic' }
      ]}
    ],
    calculate: (v) => {
      let hex = v.base.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map((c:string) => c+c).join('');
      
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      let colors = [];
      
      if (v.type === 'complementary') {
        const compHsl = { ...hsl, h: (hsl.h + 180) % 360 };
        const compRgb = hslToRgb(compHsl.h, compHsl.s, compHsl.l);
        colors = [`#${hex}`, rgbToHex(compRgb.r, compRgb.g, compRgb.b)];
      } else if (v.type === 'analogous') {
        const h1 = (hsl.h + 30) % 360;
        const h2 = (hsl.h - 30 + 360) % 360;
        const rgb1 = hslToRgb(h1, hsl.s, hsl.l);
        const rgb2 = hslToRgb(h2, hsl.s, hsl.l);
        colors = [rgbToHex(rgb2.r, rgb2.g, rgb2.b), `#${hex}`, rgbToHex(rgb1.r, rgb1.g, rgb1.b)];
      } else if (v.type === 'triadic') {
        const h1 = (hsl.h + 120) % 360;
        const h2 = (hsl.h + 240) % 360;
        const rgb1 = hslToRgb(h1, hsl.s, hsl.l);
        const rgb2 = hslToRgb(h2, hsl.s, hsl.l);
        colors = [`#${hex}`, rgbToHex(rgb1.r, rgb1.g, rgb1.b), rgbToHex(rgb2.r, rgb2.g, rgb2.b)];
      } else if (v.type === 'monochromatic') {
        const l1 = Math.max(0, hsl.l - 20);
        const l2 = Math.min(100, hsl.l + 20);
        const rgb1 = hslToRgb(hsl.h, hsl.s, l1);
        const rgb2 = hslToRgb(hsl.h, hsl.s, l2);
        colors = [rgbToHex(rgb1.r, rgb1.g, rgb1.b), `#${hex}`, rgbToHex(rgb2.r, rgb2.g, rgb2.b)];
      }

      return {
        value: 'Palette Generated',
        unit: '',
        details: colors,
        diagram: { type: 'palette-visual', data: { colors, type: v.type } }
      };
    }
  },
  'gradient-generator': {
    id: 'gradient-generator',
    title: 'Gradient Generator',
    category: 'Color Tools',
    description: 'Create CSS gradients.',
    icon: Palette,
    inputs: [
      { name: 'color1', label: 'Color 1', type: 'text', defaultValue: '#6366F1' },
      { name: 'color2', label: 'Color 2', type: 'text', defaultValue: '#EC4899' },
      { name: 'angle', label: 'Angle (deg)', type: 'number', defaultValue: 135, min: 0, max: 360 },
      { name: 'type', label: 'Type', type: 'select', defaultValue: 'linear', options: [{label:'Linear', value:'linear'}, {label:'Radial', value:'radial'}] }
    ],
    calculate: (v) => {
      const c1 = v.color1;
      const c2 = v.color2;
      const css = v.type === 'linear' 
        ? `linear-gradient(${v.angle}deg, ${c1}, ${c2})`
        : `radial-gradient(circle, ${c1}, ${c2})`;
      
      return {
        value: 'CSS Gradient',
        unit: '',
        details: [css],
        diagram: { type: 'gradient-visual', data: { css } }
      };
    }
  },
  'shade-generator': {
    id: 'shade-generator',
    title: 'Shades & Tints',
    category: 'Color Tools',
    description: 'Generate light/dark variations.',
    icon: Palette,
    inputs: [
      { name: 'base', label: 'Base Color', type: 'text', defaultValue: '#10B981' },
      { name: 'steps', label: 'Steps', type: 'number', defaultValue: 5, min: 3, max: 10 }
    ],
    calculate: (v) => {
      let hex = v.base.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map((c:string) => c+c).join('');
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      
      const count = parseInt(v.steps);
      const shades = [];
      const tints = [];
      
      // Tints (Lighten)
      for(let i=1; i<=count; i++) {
          const l = Math.min(100, hsl.l + (i * (100 - hsl.l) / (count + 1)));
          const c = hslToRgb(hsl.h, hsl.s, l);
          tints.push(rgbToHex(c.r, c.g, c.b));
      }
      
      // Shades (Darken)
      for(let i=1; i<=count; i++) {
          const l = Math.max(0, hsl.l - (i * hsl.l / (count + 1)));
          const c = hslToRgb(hsl.h, hsl.s, l);
          shades.push(rgbToHex(c.r, c.g, c.b));
      }

      return {
        value: `${count * 2} Variations`,
        unit: '',
        details: [`Base: #${hex}`, ...tints, ...shades],
        diagram: { type: 'palette-visual', data: { colors: [...tints.reverse(), `#${hex}`, ...shades], type: 'Shades & Tints' } }
      }
    }
  },

  // --- DEV TOOLS ---
  'json-formatter': {
    id: 'json-formatter',
    title: 'JSON Formatter',
    category: 'Developer Utils',
    description: 'Beautify or Minify JSON.',
    icon: FileJson,
    inputs: [
      { name: 'json', label: 'JSON Input', type: 'textarea', defaultValue: '{"name":"User","id":123,"active":true}', rows: 5 }
    ],
    calculate: (v) => {
      try {
        const obj = JSON.parse(v.json);
        const pretty = JSON.stringify(obj, null, 2);
        return {
          value: 'Valid JSON',
          unit: '',
          details: [`Size: ${v.json.length} chars`, `Keys: ${Object.keys(obj).length}`],
          diagram: { type: 'json-viewer', data: { content: pretty } }
        };
      } catch (e: any) {
        return { value: 'Invalid JSON', unit: '', details: [e.message] };
      }
    }
  },
  'regex-tester': {
    id: 'regex-tester',
    title: 'Regex Tester',
    category: 'Developer Utils',
    description: 'Test RegExp patterns.',
    icon: Search,
    inputs: [
      { name: 'pattern', label: 'Pattern', type: 'text', defaultValue: '([A-Z])\\w+' },
      { name: 'flags', label: 'Flags', type: 'text', defaultValue: 'g' },
      { name: 'text', label: 'Test String', type: 'textarea', defaultValue: 'Hello World! This is a Test.', rows: 3 }
    ],
    calculate: (v) => {
      try {
        const re = new RegExp(v.pattern, v.flags);
        const matches = [...v.text.matchAll(re)];
        
        return {
          value: `${matches.length} Match${matches.length !== 1 ? 'es' : ''}`,
          unit: '',
          details: matches.map((m, i) => `Match ${i+1}: "${m[0]}" at index ${m.index}`),
          diagram: { type: 'regex-match', data: { text: v.text, pattern: v.pattern, flags: v.flags } }
        };
      } catch (e: any) {
        return { value: 'Error', unit: '', details: [e.message] };
      }
    }
  },
  'base64': {
    id: 'base64',
    title: 'Base64 Encoder',
    category: 'Developer Utils',
    description: 'Encode/Decode Base64 strings.',
    icon: Code,
    inputs: [
      { name: 'text', label: 'Input Text', type: 'textarea', defaultValue: 'Hello World', rows: 3 },
      { name: 'mode', label: 'Mode', type: 'select', defaultValue: 'encode', options: [{label: 'Encode', value: 'encode'}, {label: 'Decode', value: 'decode'}] }
    ],
    calculate: (v) => {
      try {
        const result = v.mode === 'encode' ? btoa(v.text) : atob(v.text);
        return {
          value: result,
          unit: '',
          details: [`Mode: ${v.mode}`, `Length: ${result.length}`]
        };
      } catch (e) {
        return { value: 'Error', unit: '', details: ['Invalid input for decoding'] };
      }
    }
  },
  'ip-subnet': {
    id: 'ip-subnet',
    title: 'IP Subnet Calculator',
    category: 'Developer Utils',
    description: 'CIDR to Netmask, Network IP.',
    icon: Globe,
    inputs: [
      { name: 'ip', label: 'IP Address', type: 'text', defaultValue: '192.168.1.10' },
      { name: 'cidr', label: 'CIDR (0-32)', type: 'number', defaultValue: 24, min: 0, max: 32 }
    ],
    calculate: (v) => {
      try {
        // Convert IP to int
        const ipParts = v.ip.split('.').map(Number);
        if(ipParts.length !== 4 || ipParts.some(p => isNaN(p) || p < 0 || p > 255)) throw new Error('Invalid IP');
        
        const ipInt = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
        const cidr = Number(v.cidr);
        const maskInt = ~(2**(32-cidr) - 1);
        
        const netInt = ipInt & maskInt;
        const bcInt = netInt | (~maskInt);
        
        const toIP = (int: number) => {
           return [ (int>>>24)&255, (int>>>16)&255, (int>>>8)&255, int&255 ].join('.');
        }

        const count = 2**(32-cidr);
        const usable = Math.max(0, count - 2);

        return {
          value: `${toIP(netInt)} / ${cidr}`,
          unit: 'Network',
          details: [
            `Mask: ${toIP(maskInt)}`,
            `Broadcast: ${toIP(bcInt)}`,
            `Range: ${toIP(netInt+1)} - ${toIP(bcInt-1)}`,
            `Hosts: ${usable}`
          ]
        };
      } catch (e) {
        return { value: 'Invalid', unit: 'Input', details: [] };
      }
    }
  },
  'uuid-gen': {
    id: 'uuid-gen',
    title: 'UUID Generator',
    category: 'Developer Utils',
    description: 'Generate Random UUIDs (v4).',
    icon: Key,
    inputs: [
      { name: 'count', label: 'Quantity', type: 'number', defaultValue: 5, min: 1, max: 100 }
    ],
    calculate: (v) => {
      const count = Math.min(100, Math.max(1, v.count));
      const uuids = Array.from({length: count}).map(() => {
         return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
         });
      });
      return {
        value: `${count} UUIDs Generated`,
        unit: '',
        details: [`Format: Version 4 (Random)`, `Count: ${count}`],
        diagram: { type: 'list', data: { items: uuids } }
      }
    }
  },
  'chmod-calc': {
    id: 'chmod-calc',
    title: 'Chmod Calculator',
    category: 'Developer Utils',
    description: 'Linux file permissions.',
    icon: Shield,
    inputs: [
      { name: 'octal', label: 'Octal (e.g. 755)', type: 'text', defaultValue: '755', placeholder: '755' }
    ],
    calculate: (v) => {
      const octal = v.octal.replace(/[^0-7]/g, '').substring(0,3).padEnd(3, '0');
      const map = ['---','--x','-w-','-wx','r--','r-x','rw-','rwx'];
      const perms = octal.split('').map(d => map[parseInt(d)]).join('');
      
      const details = [
        `Owner: ${map[parseInt(octal[0])]} (${octal[0]})`,
        `Group: ${map[parseInt(octal[1])]} (${octal[1]})`,
        `Public: ${map[parseInt(octal[2])]} (${octal[2]})`
      ];

      return {
        value: perms,
        unit: `(${octal})`,
        details: details,
        diagram: { type: 'chmod-visual', data: { octal } }
      }
    }
  },
  'markdown-preview': {
    id: 'markdown-preview',
    title: 'Markdown Preview',
    category: 'Developer Utils',
    description: 'Live Markdown rendering.',
    icon: FileCode,
    inputs: [
      { name: 'md', label: 'Markdown Text', type: 'textarea', defaultValue: '# Hello\n**Bold text** and *Italic*\n- List item 1\n- List item 2', rows: 6 }
    ],
    calculate: (v) => {
      return {
        value: 'Rendered Output',
        unit: '',
        details: [`Length: ${v.md.length} chars`],
        diagram: { type: 'markdown', data: { content: v.md } }
      }
    }
  },
  'url-encoder': {
    id: 'url-encoder',
    title: 'URL Encoder/Decoder',
    category: 'Developer Utils',
    description: 'Encode/Decode URL strings.',
    icon: Globe,
    inputs: [
      { name: 'text', label: 'Text', type: 'textarea', defaultValue: 'https://example.com/search?q=hello world', rows: 3 },
      { name: 'mode', label: 'Mode', type: 'select', defaultValue: 'encode', options: [{label:'Encode', value:'encode'}, {label:'Decode', value:'decode'}] }
    ],
    calculate: (v) => {
      try {
        const res = v.mode === 'encode' ? encodeURIComponent(v.text) : decodeURIComponent(v.text);
        return {
          value: res,
          unit: '',
          details: [`Mode: ${v.mode}`]
        };
      } catch(e) {
        return { value: 'Error', unit: '', details: ['Malformed URI sequence'] };
      }
    }
  }
};
