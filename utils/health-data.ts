
import { Heart, Activity, GlassWater, Baby, Scale, Moon, Utensils, Flame, Wind, PersonStanding } from 'lucide-react';

export interface HealthInput {
  name: string;
  label: string;
  type: 'number' | 'select' | 'gender';
  unit?: string;
  defaultValue: number | string;
  options?: { label: string; value: string | number }[];
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
}

export interface HealthResult {
  value: string;
  unit: string;
  category?: string; // e.g., "Overweight", "Excellent"
  color?: string; // color for the result category
  details: string[];
  chart?: {
    type: 'bmi-scale' | 'pie' | 'bar' | 'gauge' | 'timeline' | 'water';
    data: any;
  };
}

export interface HealthCalculatorConfig {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: any;
  inputs: HealthInput[];
  calculate: (values: Record<string, any>) => HealthResult;
}

export const healthCategories = [
  { id: 'body-metrics', title: 'Body Metrics', icon: Scale, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  { id: 'nutrition', title: 'Nutrition & Calories', icon: Utensils, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { id: 'fitness', title: 'Fitness & Performance', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 'pregnancy', title: 'Pregnancy & Women', icon: Baby, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  { id: 'general', title: 'General Health', icon: Heart, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
];

// Helper: BMR Calculation (Mifflin-St Jeor)
const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
  // Weight in kg, Height in cm
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  return gender === 'male' ? bmr + 5 : bmr - 161;
};

export const healthCalculators: Record<string, HealthCalculatorConfig> = {
  // --- BODY METRICS ---
  'bmi': {
    id: 'bmi',
    title: 'BMI Calculator',
    category: 'Body Metrics',
    description: 'Body Mass Index based on height and weight.',
    icon: Scale,
    inputs: [
      { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', defaultValue: 70 },
      { name: 'height', label: 'Height', type: 'number', unit: 'cm', defaultValue: 175 },
    ],
    calculate: (v) => {
      const hM = v.height / 100;
      const bmi = v.weight / (hM * hM);
      let cat = 'Normal', color = '#10b981';
      
      if (bmi < 18.5) { cat = 'Underweight'; color = '#3b82f6'; }
      else if (bmi < 25) { cat = 'Normal'; color = '#10b981'; }
      else if (bmi < 30) { cat = 'Overweight'; color = '#f59e0b'; }
      else { cat = 'Obese'; color = '#ef4444'; }

      return {
        value: bmi.toFixed(1),
        unit: 'BMI',
        category: cat,
        color: color,
        details: [`Weight: ${v.weight} kg`, `Height: ${v.height} cm`],
        chart: { type: 'bmi-scale', data: { value: bmi } }
      };
    }
  },
  'bmr': {
    id: 'bmr',
    title: 'BMR Calculator',
    category: 'Body Metrics',
    description: 'Basal Metabolic Rate (Mifflin-St Jeor).',
    icon: Flame,
    inputs: [
      { name: 'gender', label: 'Gender', type: 'gender', defaultValue: 'male' },
      { name: 'age', label: 'Age', type: 'number', unit: 'yrs', defaultValue: 30 },
      { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', defaultValue: 70 },
      { name: 'height', label: 'Height', type: 'number', unit: 'cm', defaultValue: 175 },
    ],
    calculate: (v) => {
      const bmr = calculateBMR(v.weight, v.height, v.age, v.gender);
      return {
        value: Math.round(bmr).toString(),
        unit: 'kcal/day',
        category: 'Resting Burn',
        details: [
          'Based on Mifflin-St Jeor Equation',
          `Sedentary TDEE: ${Math.round(bmr * 1.2)} kcal`
        ],
        chart: { 
          type: 'bar', 
          data: [
            { label: 'BMR (Coma)', value: bmr, color: '#3b82f6' },
            { label: 'Sedentary', value: bmr * 1.2, color: '#10b981' },
            { label: 'Active', value: bmr * 1.55, color: '#f59e0b' }
          ] 
        }
      };
    }
  },
  'body-fat': {
    id: 'body-fat',
    title: 'Body Fat Percentage',
    category: 'Body Metrics',
    description: 'US Navy Method estimation.',
    icon: PersonStanding,
    inputs: [
      { name: 'gender', label: 'Gender', type: 'gender', defaultValue: 'male' },
      { name: 'height', label: 'Height', type: 'number', unit: 'cm', defaultValue: 178 },
      { name: 'waist', label: 'Waist', type: 'number', unit: 'cm', defaultValue: 85 },
      { name: 'neck', label: 'Neck', type: 'number', unit: 'cm', defaultValue: 38 },
      { name: 'hip', label: 'Hip (Females)', type: 'number', unit: 'cm', defaultValue: 95 }, // Logic to hide this usually handled in UI, but here we just ignore if male
    ],
    calculate: (v) => {
      let bf = 0;
      if (v.gender === 'male') {
        // 495 / (1.0324 - 0.19077 log10(waist-neck) + 0.15456 log10(height)) - 450
        bf = 495 / (1.0324 - 0.19077 * Math.log10(v.waist - v.neck) + 0.15456 * Math.log10(v.height)) - 450;
      } else {
        // 495 / (1.29579 - 0.35004 log10(waist+hip-neck) + 0.22100 log10(height)) - 450
        bf = 495 / (1.29579 - 0.35004 * Math.log10(v.waist + v.hip - v.neck) + 0.22100 * Math.log10(v.height)) - 450;
      }
      bf = Math.max(2, bf); // Clamp min
      
      let cat = 'Average';
      if (v.gender === 'male') {
         if(bf < 6) cat = 'Essential Fat';
         else if(bf < 14) cat = 'Athletes';
         else if(bf < 18) cat = 'Fitness';
         else if(bf < 25) cat = 'Average';
         else cat = 'Obese';
      } else {
         if(bf < 14) cat = 'Essential Fat';
         else if(bf < 21) cat = 'Athletes';
         else if(bf < 25) cat = 'Fitness';
         else if(bf < 32) cat = 'Average';
         else cat = 'Obese';
      }

      return {
        value: bf.toFixed(1),
        unit: '%',
        category: cat,
        details: [`Method: US Navy Tape Measure`],
        chart: { type: 'gauge', data: { value: bf, max: 50, zones: [6, 14, 18, 25], colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'] } }
      };
    }
  },

  // --- NUTRITION ---
  'daily-calories': {
    id: 'daily-calories',
    title: 'Daily Calorie Needs',
    category: 'Nutrition & Calories',
    description: 'Calculate TDEE based on activity.',
    icon: Utensils,
    inputs: [
      { name: 'gender', label: 'Gender', type: 'gender', defaultValue: 'female' },
      { name: 'age', label: 'Age', type: 'number', unit: 'yrs', defaultValue: 28 },
      { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', defaultValue: 65 },
      { name: 'height', label: 'Height', type: 'number', unit: 'cm', defaultValue: 165 },
      { name: 'activity', label: 'Activity Level', type: 'select', defaultValue: 1.375, options: [
        { label: 'Sedentary (Office job)', value: 1.2 },
        { label: 'Light Exercise (1-2 days)', value: 1.375 },
        { label: 'Moderate Exercise (3-5 days)', value: 1.55 },
        { label: 'Heavy Exercise (6-7 days)', value: 1.725 },
        { label: 'Athlete (2x per day)', value: 1.9 },
      ]},
    ],
    calculate: (v) => {
      const bmr = calculateBMR(v.weight, v.height, v.age, v.gender);
      const tdee = bmr * Number(v.activity);
      return {
        value: Math.round(tdee).toString(),
        unit: 'kcal',
        category: 'Maintenance',
        details: [
          `Basal Metabolic Rate: ${Math.round(bmr)} kcal`,
          `To Lose Weight (-500): ${Math.round(tdee - 500)} kcal`,
          `To Gain Weight (+500): ${Math.round(tdee + 500)} kcal`,
        ],
        chart: { 
          type: 'bar', 
          data: [
            { label: 'Cut', value: tdee - 500, color: '#f59e0b' },
            { label: 'Maintain', value: tdee, color: '#3b82f6' },
            { label: 'Bulk', value: tdee + 500, color: '#10b981' }
          ] 
        }
      };
    }
  },
  'macros': {
    id: 'macros',
    title: 'Macro Nutrients',
    category: 'Nutrition & Calories',
    description: 'Protein, Carb, and Fat breakdown.',
    icon: Utensils,
    inputs: [
      { name: 'calories', label: 'Daily Calories', type: 'number', unit: 'kcal', defaultValue: 2000 },
      { name: 'plan', label: 'Diet Plan', type: 'select', defaultValue: 'balanced', options: [
        { label: 'Balanced (40/30/30)', value: 'balanced' },
        { label: 'Low Carb (40/35/25)', value: 'lowcarb' },
        { label: 'High Protein (35/40/25)', value: 'highprot' },
        { label: 'Keto (5/70/25)', value: 'keto' },
      ]}
    ],
    calculate: (v) => {
      let ratios = { c: 0.4, f: 0.3, p: 0.3 };
      if(v.plan === 'lowcarb') ratios = { c: 0.25, f: 0.35, p: 0.4 };
      if(v.plan === 'highprot') ratios = { c: 0.35, f: 0.25, p: 0.4 };
      if(v.plan === 'keto') ratios = { c: 0.05, f: 0.70, p: 0.25 };

      const pG = Math.round((v.calories * ratios.p) / 4);
      const cG = Math.round((v.calories * ratios.c) / 4);
      const fG = Math.round((v.calories * ratios.f) / 9);

      return {
        value: `${pG}g P / ${cG}g C / ${fG}g F`,
        unit: 'Macros',
        details: [
          `Protein: ${Math.round(ratios.p*100)}% (${pG}g)`,
          `Carbs: ${Math.round(ratios.c*100)}% (${cG}g)`,
          `Fats: ${Math.round(ratios.f*100)}% (${fG}g)`,
        ],
        chart: {
          type: 'pie',
          data: [
            { label: 'Protein', value: pG * 4, color: '#f43f5e' },
            { label: 'Carbs', value: cG * 4, color: '#3b82f6' },
            { label: 'Fats', value: fG * 9, color: '#fbbf24' },
          ]
        }
      }
    }
  },
  'water-intake': {
    id: 'water-intake',
    title: 'Water Intake',
    category: 'Nutrition & Calories',
    description: 'Daily hydration recommendation.',
    icon: GlassWater,
    inputs: [
      { name: 'weight', label: 'Weight', type: 'number', unit: 'kg', defaultValue: 70 },
      { name: 'activity', label: 'Activity', type: 'number', unit: 'min', defaultValue: 30 },
    ],
    calculate: (v) => {
      // Basic rule: 35ml per kg + estimated sweat loss
      let liters = (v.weight * 0.033) + (v.activity / 30) * 0.35;
      liters = Math.round(liters * 10) / 10;
      return {
        value: liters.toString(),
        unit: 'Liters',
        category: 'Daily Goal',
        details: [
          `Base Needs: ${(v.weight * 0.033).toFixed(1)} L`,
          `Activity Add-on: ${((v.activity / 30) * 0.35).toFixed(1)} L`
        ],
        chart: { type: 'water', data: { value: liters } }
      }
    }
  },

  // --- FITNESS ---
  'heart-rate': {
    id: 'heart-rate',
    title: 'Target Heart Rate',
    category: 'Fitness & Performance',
    description: 'Training zones based on age.',
    icon: Heart,
    inputs: [
      { name: 'age', label: 'Age', type: 'number', unit: 'yrs', defaultValue: 30 },
      { name: 'resting', label: 'Resting HR', type: 'number', unit: 'bpm', defaultValue: 70 },
    ],
    calculate: (v) => {
      const maxHr = 220 - v.age;
      const reserve = maxHr - v.resting;
      const z2 = Math.round(v.resting + 0.6 * reserve); // 60%
      const z3 = Math.round(v.resting + 0.7 * reserve); // 70%
      const z4 = Math.round(v.resting + 0.8 * reserve); // 80%
      const z5 = Math.round(v.resting + 0.9 * reserve); // 90%

      return {
        value: `${z3}-${z4}`,
        unit: 'bpm (Zone 3)',
        category: 'Cardio Zone',
        details: [
          `Max HR: ${maxHr} bpm`,
          `Fat Burn (Z2): ${z2} bpm`,
          `Cardio (Z3): ${z3} bpm`,
          `Peak (Z5): ${z5} bpm`,
        ],
        chart: {
          type: 'bar',
          data: [
            { label: 'Warmup', value: z2, color: '#94a3b8' },
            { label: 'Fat Burn', value: z3, color: '#3b82f6' },
            { label: 'Cardio', value: z4, color: '#10b981' },
            { label: 'Hardcore', value: z5, color: '#ef4444' }
          ]
        }
      }
    }
  },
  'one-rep-max': {
    id: 'one-rep-max',
    title: '1RM Calculator',
    category: 'Fitness & Performance',
    description: 'Estimate max lift (Epley Formula).',
    icon: Activity,
    inputs: [
      { name: 'weight', label: 'Weight Lifted', type: 'number', unit: 'kg', defaultValue: 60 },
      { name: 'reps', label: 'Repetitions', type: 'number', defaultValue: 8, max: 12 },
    ],
    calculate: (v) => {
      // Epley: w * (1 + r/30)
      const orm = v.weight * (1 + v.reps / 30);
      return {
        value: Math.round(orm).toString(),
        unit: 'kg',
        category: 'Estimated Max',
        details: [
          `5 Rep Max (~87%): ${Math.round(orm * 0.87)} kg`,
          `8 Rep Max (~80%): ${Math.round(orm * 0.80)} kg`,
          `12 Rep Max (~70%): ${Math.round(orm * 0.70)} kg`
        ],
        chart: {
          type: 'bar',
          data: [
            { label: '100% (1RM)', value: orm, color: '#ef4444' },
            { label: '90% (3RM)', value: orm*0.9, color: '#f59e0b' },
            { label: '80% (8RM)', value: orm*0.8, color: '#3b82f6' },
            { label: '70% (12RM)', value: orm*0.7, color: '#10b981' },
          ]
        }
      }
    }
  },
  'vo2-max': {
    id: 'vo2-max',
    title: 'VO2 Max (Estimate)',
    category: 'Fitness & Performance',
    description: 'Resting HR estimate method.',
    icon: Wind,
    inputs: [
      { name: 'age', label: 'Age', type: 'number', unit: 'yrs', defaultValue: 30 },
      { name: 'resting', label: 'Resting HR', type: 'number', unit: 'bpm', defaultValue: 60 },
      { name: 'gender', label: 'Gender', type: 'gender', defaultValue: 'male' },
    ],
    calculate: (v) => {
      // Uth-Sørensen-Overgaard-Pedersen estimation
      const maxHr = 220 - v.age;
      const vo2 = 15.3 * (maxHr / v.resting);
      
      let cat = 'Average';
      // Very rough categorization
      if (vo2 > 55) cat = 'Elite';
      else if (vo2 > 45) cat = 'Excellent';
      else if (vo2 > 35) cat = 'Good';
      else if (vo2 > 30) cat = 'Fair';
      else cat = 'Poor';

      return {
        value: vo2.toFixed(1),
        unit: 'ml/kg/min',
        category: cat,
        details: [
          `Max HR Est: ${maxHr}`,
          `Formula: 15.3 * (MaxHR / RestHR)`
        ],
        chart: { type: 'gauge', data: { value: vo2, max: 70, zones: [30, 38, 46, 54], colors: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'] } }
      }
    }
  },

  // --- PREGNANCY ---
  'due-date': {
    id: 'due-date',
    title: 'Pregnancy Due Date',
    category: 'Pregnancy & Women',
    description: 'Estimated date of delivery (Naegele).',
    icon: Baby,
    inputs: [
      { name: 'lmp_month', label: 'LMP Month', type: 'number', defaultValue: 1, min: 1, max: 12 },
      { name: 'lmp_day', label: 'LMP Day', type: 'number', defaultValue: 1, min: 1, max: 31 },
      { name: 'lmp_year', label: 'LMP Year', type: 'number', defaultValue: new Date().getFullYear() },
      { name: 'cycle', label: 'Cycle Length', type: 'number', unit: 'days', defaultValue: 28 },
    ],
    calculate: (v) => {
      const lmp = new Date(v.lmp_year, v.lmp_month - 1, v.lmp_day);
      const cycleAdj = v.cycle - 28;
      // Add 280 days + cycle adjustment
      const due = new Date(lmp.getTime() + (280 + cycleAdj) * 24 * 60 * 60 * 1000);
      
      const now = new Date();
      const elapsed = now.getTime() - lmp.getTime();
      const weeks = Math.floor(elapsed / (7 * 24 * 60 * 60 * 1000));
      
      return {
        value: due.toLocaleDateString(),
        unit: 'Due Date',
        category: `Week ${Math.max(0, weeks)}`,
        details: [
          `Conception: ${new Date(lmp.getTime() + 14 * 86400000).toLocaleDateString()}`,
          `Progress: ${Math.max(0, Math.min(100, (weeks/40)*100)).toFixed(0)}%`,
        ],
        chart: { type: 'timeline', data: { total: 40, current: weeks } }
      }
    }
  },

  // --- GENERAL ---
  'blood-pressure': {
    id: 'blood-pressure',
    title: 'Blood Pressure',
    category: 'General Health',
    description: 'Check BP category.',
    icon: Heart,
    inputs: [
      { name: 'sys', label: 'Systolic (Upper)', type: 'number', unit: 'mmHg', defaultValue: 120 },
      { name: 'dia', label: 'Diastolic (Lower)', type: 'number', unit: 'mmHg', defaultValue: 80 },
    ],
    calculate: (v) => {
      let cat = 'Normal';
      let color = '#10b981';
      
      if (v.sys < 120 && v.dia < 80) { cat = 'Normal'; color = '#10b981'; }
      else if (v.sys <= 129 && v.dia < 80) { cat = 'Elevated'; color = '#eab308'; } // Yellow-500
      else if (v.sys <= 139 || v.dia <= 89) { cat = 'Hypertension 1'; color = '#f97316'; } // Orange-500
      else if (v.sys >= 140 || v.dia >= 90) { cat = 'Hypertension 2'; color = '#ef4444'; } // Red-500
      else if (v.sys > 180 || v.dia > 120) { cat = 'Hypertensive Crisis'; color = '#991b1b'; } // Red-800

      return {
        value: `${v.sys}/${v.dia}`,
        unit: 'mmHg',
        category: cat,
        color: color,
        details: [
          'Normal: <120 and <80',
          'Elevated: 120-129 and <80',
          'High Stage 1: 130-139 or 80-89'
        ],
        chart: { 
            type: 'gauge', 
            data: { 
                value: v.sys, 
                max: 200, 
                // Zones for systolic: Normal <120, Elevated 120-129, Stage 1 130-139, Stage 2 >140
                zones: [120, 130, 140, 180], 
                colors: ['#10b981', '#eab308', '#f97316', '#ef4444'] 
            } 
        }
      }
    }
  },
  'sleep': {
    id: 'sleep',
    title: 'Sleep Calculator',
    category: 'General Health',
    description: 'Wake up times based on cycles.',
    icon: Moon,
    inputs: [
      { name: 'hour', label: 'Bedtime Hour', type: 'number', defaultValue: 23, max: 23 },
      { name: 'minute', label: 'Bedtime Minute', type: 'number', defaultValue: 0, max: 59 },
    ],
    calculate: (v) => {
      const cycles = [4, 5, 6]; // 6h, 7.5h, 9h
      const results = cycles.map(c => {
        const mins = c * 90 + 15; // 90min cycle + 15min fall asleep
        let h = v.hour + Math.floor((v.minute + mins)/60);
        let m = (v.minute + mins) % 60;
        h = h % 24;
        return `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`;
      });

      return {
        value: results[1], // 7.5h
        unit: 'Best Wake Time',
        category: '5 Cycles',
        details: [
          `6.0 hours (4 cycles): ${results[0]}`,
          `7.5 hours (5 cycles): ${results[1]}`,
          `9.0 hours (6 cycles): ${results[2]}`
        ],
        chart: { type: 'bar', data: [
          { label: '4 Cycles', value: 6, color: '#94a3b8' },
          { label: '5 Cycles', value: 7.5, color: '#3b82f6' },
          { label: '6 Cycles', value: 9, color: '#8b5cf6' }
        ]}
      }
    }
  }
};
