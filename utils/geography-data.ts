
import { Globe, Compass, Map as MapIcon, Sun, Mountain, Plane, Ruler, Navigation, Anchor, Share2, LocateFixed, Sunrise, Wind, Layers } from 'lucide-react';

export interface GeoInput {
  name: string;
  label: string;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue: number | string;
  type?: 'number' | 'text' | 'select';
  options?: string[];
  placeholder?: string;
}

export interface GeoResult {
  value: string | number;
  unit: string;
  steps: string[];
  diagram?: {
    type: 'globe' | 'compass' | 'sun-path' | 'elevation' | 'triangle' | 'wind' | 'fuel' | 'bar' | 'leveling';
    data: any;
  };
}

export interface GeoCalculatorConfig {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: any;
  solveModes: {
    target: string;
    label: string;
    inputs: GeoInput[];
    calculate: (values: Record<string, any>) => GeoResult;
  }[];
}

export const geoCategories = [
  { id: 'coordinates', title: 'Coordinates', icon: LocateFixed, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/20' },
  { id: 'distance', title: 'Distance & Area', icon: Ruler, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/20' },
  { id: 'bearing', title: 'Bearing & Direction', icon: Compass, color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/20' },
  { id: 'time-solar', title: 'Time & Solar', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/20' },
  { id: 'surveying', title: 'Surveying', icon: Mountain, color: 'text-stone-500', bg: 'bg-stone-100 dark:bg-stone-800' },
  { id: 'travel', title: 'Travel & Nav', icon: Plane, color: 'text-sky-500', bg: 'bg-sky-100 dark:bg-sky-900/20' },
];

// --- Helper Functions ---

const toRad = (deg: number) => deg * (Math.PI / 180);
const toDeg = (rad: number) => rad * (180 / Math.PI);

// Haversine Distance
const calculateHaversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Initial Bearing
const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x = Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
            Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  const brg = toDeg(Math.atan2(y, x));
  return (brg + 360) % 360;
};

export const geoCalculators: Record<string, GeoCalculatorConfig> = {
  // --- COORDINATES ---
  'lat-long-conv': {
    id: 'lat-long-conv',
    title: 'Lat/Long Converter',
    category: 'Coordinates',
    description: 'Convert Decimal Degrees to DMS.',
    icon: Globe,
    solveModes: [
      {
        target: 'dms',
        label: 'DD to DMS',
        inputs: [
          { name: 'lat', label: 'Latitude (DD)', unit: '°', defaultValue: 40.7128 },
          { name: 'lon', label: 'Longitude (DD)', unit: '°', defaultValue: -74.0060 }
        ],
        calculate: (v) => {
          const toDMS = (deg: number, isLat: boolean) => {
            const absolute = Math.abs(deg);
            const d = Math.floor(absolute);
            const minFloat = (absolute - d) * 60;
            const m = Math.floor(minFloat);
            const s = ((minFloat - m) * 60).toFixed(2);
            const dir = deg >= 0 ? (isLat ? 'N' : 'E') : (isLat ? 'S' : 'W');
            return `${d}° ${m}' ${s}" ${dir}`;
          };
          
          const latDMS = toDMS(v.lat, true);
          const lonDMS = toDMS(v.lon, false);
          
          return {
            value: `${latDMS}, ${lonDMS}`,
            unit: 'DMS',
            steps: [
              `Lat: ${Math.floor(Math.abs(v.lat))}° + ${(Math.abs(v.lat)%1)*60}'`,
              `Lon: ${Math.floor(Math.abs(v.lon))}° + ${(Math.abs(v.lon)%1)*60}'`
            ],
            diagram: { type: 'globe', data: { lat: v.lat, lon: v.lon } }
          };
        }
      }
    ]
  },
  
  // --- DISTANCE ---
  'great-circle': {
    id: 'great-circle',
    title: 'Great Circle Distance',
    category: 'Distance & Area',
    description: 'Shortest path between two points.',
    icon: Globe,
    solveModes: [
      {
        target: 'dist',
        label: 'Calculate Distance',
        inputs: [
          { name: 'lat1', label: 'Point A Lat', unit: '°', defaultValue: 40.7128 }, // NYC
          { name: 'lon1', label: 'Point A Lon', unit: '°', defaultValue: -74.0060 },
          { name: 'lat2', label: 'Point B Lat', unit: '°', defaultValue: 51.5074 }, // London
          { name: 'lon2', label: 'Point B Lon', unit: '°', defaultValue: -0.1278 }
        ],
        calculate: (v) => {
          const distKm = calculateHaversine(v.lat1, v.lon1, v.lat2, v.lon2);
          const distMi = distKm * 0.621371;
          const distNM = distKm * 0.539957;
          return {
            value: `${distKm.toFixed(1)} km`,
            unit: `/ ${distMi.toFixed(1)} mi / ${distNM.toFixed(1)} NM`,
            steps: [
              'Used Haversine Formula',
              `d = 2R × asin(√a)`,
              `Radius R = 6371 km`
            ],
            diagram: { type: 'globe', data: { lat1: v.lat1, lon1: v.lon1, lat2: v.lat2, lon2: v.lon2, path: true } }
          };
        }
      }
    ]
  },
  'elevation-change': {
    id: 'elevation-change',
    title: 'Elevation Calculator',
    category: 'Distance & Area',
    description: 'Grade and elevation gain/loss.',
    icon: Mountain,
    solveModes: [
      {
        target: 'grade',
        label: 'Calculate Grade',
        inputs: [
          { name: 'dist', label: 'Horizontal Dist', unit: 'm', defaultValue: 1000 },
          { name: 'rise', label: 'Vertical Rise', unit: 'm', defaultValue: 50 }
        ],
        calculate: (v) => {
          const grade = (v.rise / v.dist) * 100;
          const angle = toDeg(Math.atan(v.rise / v.dist));
          return {
            value: `${grade.toFixed(1)}%`,
            unit: `Grade (${angle.toFixed(1)}°)`,
            steps: [
              `Grade = (Rise / Run) × 100`,
              `Grade = (${v.rise} / ${v.dist}) × 100`
            ],
            diagram: { type: 'elevation', data: { run: v.dist, rise: v.rise } }
          };
        }
      }
    ]
  },

  // --- BEARING ---
  'initial-bearing': {
    id: 'initial-bearing',
    title: 'Initial Bearing',
    category: 'Bearing & Direction',
    description: 'Calculate compass heading.',
    icon: Compass,
    solveModes: [
      {
        target: 'bearing',
        label: 'Calculate Bearing',
        inputs: [
          { name: 'lat1', label: 'Start Lat', unit: '°', defaultValue: 34.0522 },
          { name: 'lon1', label: 'Start Lon', unit: '°', defaultValue: -118.2437 },
          { name: 'lat2', label: 'End Lat', unit: '°', defaultValue: 40.7128 },
          { name: 'lon2', label: 'End Lon', unit: '°', defaultValue: -74.0060 }
        ],
        calculate: (v) => {
          const brg = calculateBearing(v.lat1, v.lon1, v.lat2, v.lon2);
          return {
            value: brg.toFixed(1),
            unit: '°',
            steps: [
              'Formula: θ = atan2(sin(Δλ)cos(φ₂), cos(φ₁)sin(φ₂) − sin(φ₁)cos(φ₂)cos(Δλ))',
              `Result normalized to 0-360°`
            ],
            diagram: { type: 'compass', data: { heading: brg } }
          };
        }
      }
    ]
  },
  'destination-point': {
    id: 'destination-point',
    title: 'Destination Point',
    category: 'Bearing & Direction',
    description: 'Find coords given dist & bearing.',
    icon: Navigation,
    solveModes: [
      {
        target: 'dest',
        label: 'Find Destination',
        inputs: [
          { name: 'lat', label: 'Start Lat', unit: '°', defaultValue: 51.5074 },
          { name: 'lon', label: 'Start Lon', unit: '°', defaultValue: -0.1278 },
          { name: 'brg', label: 'Bearing', unit: '°', defaultValue: 90 },
          { name: 'dist', label: 'Distance', unit: 'km', defaultValue: 100 }
        ],
        calculate: (v) => {
          const R = 6371;
          const lat1 = toRad(v.lat);
          const lon1 = toRad(v.lon);
          const brg = toRad(v.brg);
          const lat2 = Math.asin(Math.sin(lat1)*Math.cos(v.dist/R) + 
                       Math.cos(lat1)*Math.sin(v.dist/R)*Math.cos(brg));
          const lon2 = lon1 + Math.atan2(Math.sin(brg)*Math.sin(v.dist/R)*Math.cos(lat1), 
                       Math.cos(v.dist/R)-Math.sin(lat1)*Math.sin(lat2));
          
          return {
            value: `${toDeg(lat2).toFixed(4)}, ${toDeg(lon2).toFixed(4)}`,
            unit: 'Lat, Lon',
            steps: ['Used spherical law of cosines derived formula'],
            diagram: { type: 'globe', data: { lat1: v.lat, lon1: v.lon, lat2: toDeg(lat2), lon2: toDeg(lon2), path: true } }
          };
        }
      }
    ]
  },

  // --- SURVEYING ---
  'slope-correction': {
    id: 'slope-correction',
    title: 'Slope Correction',
    category: 'Surveying',
    description: 'Convert slope distance to horizontal.',
    icon: Mountain,
    solveModes: [
      {
        target: 'hd',
        label: 'Horizontal Distance',
        inputs: [
          { name: 'sd', label: 'Slope Dist', unit: 'm', defaultValue: 100 },
          { name: 'va', label: 'Vertical Angle', unit: '°', defaultValue: 5 }
        ],
        calculate: (v) => {
          const rad = toRad(v.va);
          const hd = v.sd * Math.cos(rad);
          const vd = v.sd * Math.sin(rad);
          return {
            value: `${hd.toFixed(2)} m`,
            unit: `(Rise: ${vd.toFixed(2)} m)`,
            steps: [
              `HD = SD × cos(α)`,
              `HD = ${v.sd} × cos(${v.va}°)`,
              `VD = ${v.sd} × sin(${v.va}°)`
            ],
            diagram: { type: 'triangle', data: { sd: v.sd, hd, vd, angle: v.va } }
          };
        }
      }
    ]
  },
  'leveling': {
    id: 'leveling',
    title: 'Differential Leveling',
    category: 'Surveying',
    description: 'Calculate elevation from rod readings.',
    icon: Layers,
    solveModes: [
      {
        target: 'elev',
        label: 'Find Elevation',
        inputs: [
          { name: 'bm', label: 'Benchmark Elev', unit: 'm', defaultValue: 100 },
          { name: 'bs', label: 'Backsight (+)', unit: 'm', defaultValue: 1.5 },
          { name: 'fs', label: 'Foresight (-)', unit: 'm', defaultValue: 1.2 }
        ],
        calculate: (v) => {
          const hi = v.bm + v.bs;
          const elev = hi - v.fs;
          return {
            value: `${elev.toFixed(3)} m`,
            unit: 'New Elevation',
            steps: [
              `HI = BM + BS = ${v.bm} + ${v.bs} = ${hi.toFixed(3)}`,
              `Elev = HI - FS = ${hi.toFixed(3)} - ${v.fs}`
            ],
            diagram: { type: 'leveling', data: { bm: v.bm, bs: v.bs, fs: v.fs, elev } }
          };
        }
      }
    ]
  },

  // --- TIME & SOLAR ---
  'solar-position': {
    id: 'solar-position',
    title: 'Solar Position',
    category: 'Time & Solar',
    description: 'Sun elevation and azimuth.',
    icon: Sun,
    solveModes: [
      {
        target: 'pos',
        label: 'Calculate Position',
        inputs: [
          { name: 'lat', label: 'Latitude', unit: '°', defaultValue: 40.7 },
          { name: 'hour', label: 'Hour (24h)', unit: 'h', defaultValue: 12, min: 0, max: 23 },
          { name: 'day', label: 'Day of Year', unit: 'd', defaultValue: 180, min: 1, max: 365 }
        ],
        calculate: (v) => {
          // Simplified solar calculation
          const declination = 23.45 * Math.sin(toRad(360/365 * (v.day - 81)));
          const hourAngle = 15 * (v.hour - 12);
          const elevation = toDeg(Math.asin(Math.sin(toRad(v.lat))*Math.sin(toRad(declination)) + 
                            Math.cos(toRad(v.lat))*Math.cos(toRad(declination))*Math.cos(toRad(hourAngle))));
          
          return {
            value: `${elevation.toFixed(1)}°`,
            unit: 'Elevation',
            steps: [
              `Declination approx: ${declination.toFixed(2)}°`,
              `Hour Angle: ${hourAngle.toFixed(1)}°`
            ],
            diagram: { type: 'sun-path', data: { elevation, hour: v.hour } }
          };
        }
      }
    ]
  },

  // --- TRAVEL ---
  'flight-time': {
    id: 'flight-time',
    title: 'Flight Estimator',
    category: 'Travel & Nav',
    description: 'Est. flight time between cities.',
    icon: Plane,
    solveModes: [
      {
        target: 'time',
        label: 'Flight Time',
        inputs: [
          { name: 'dist', label: 'Distance', unit: 'km', defaultValue: 5800 }, // NYC -> London approx
          { name: 'speed', label: 'Speed', unit: 'km/h', defaultValue: 900 }
        ],
        calculate: (v) => {
          const hours = v.dist / v.speed;
          // Add 30 mins for takeoff/landing overhead approximation
          const totalHours = hours + 0.5;
          const h = Math.floor(totalHours);
          const m = Math.round((totalHours - h) * 60);
          return {
            value: `${h}h ${m}m`,
            unit: 'Approx Duration',
            steps: [
              `Time = Distance / Speed`,
              `+ 30 mins overhead for taxi/takeoff`
            ],
            diagram: { type: 'globe', data: { path: true, lat1: 40, lon1: -74, lat2: 51, lon2: 0 } } // Mock visual
          };
        }
      }
    ]
  },
  'wind-correction': {
    id: 'wind-correction',
    title: 'Wind Correction',
    category: 'Travel & Nav',
    description: 'Calculate heading and ground speed.',
    icon: Wind,
    solveModes: [
      {
        target: 'wca',
        label: 'Calculate WCA',
        inputs: [
           { name: 'course', label: 'True Course', unit: '°', defaultValue: 90 },
           { name: 'tas', label: 'True Airspeed', unit: 'kts', defaultValue: 150 },
           { name: 'windDir', label: 'Wind Direction', unit: '°', defaultValue: 45 },
           { name: 'windSpd', label: 'Wind Speed', unit: 'kts', defaultValue: 20 }
        ],
        calculate: (v) => {
           const windRad = toRad(v.windDir - v.course); // Relative wind angle
           // WCA = asin( (Ws * sin(A)) / Tas )
           const wcaRad = Math.asin( (v.windSpd * Math.sin(windRad)) / v.tas );
           const wca = toDeg(wcaRad);
           const gs = v.tas * Math.cos(wcaRad) + v.windSpd * Math.cos(windRad); // Simplified GS

           return {
              value: `${(v.course + wca).toFixed(1)}°`,
              unit: 'Heading',
              steps: [
                 `WCA: ${wca > 0 ? '+' : ''}${wca.toFixed(1)}°`,
                 `Ground Speed: ${gs.toFixed(1)} kts`
              ],
              diagram: { type: 'wind', data: { course: v.course, wca, windDir: v.windDir } }
           };
        }
      }
    ]
  },
  'eta-calculator': {
     id: 'eta-calculator',
     title: 'ETA Calculator',
     category: 'Travel & Nav',
     description: 'Arrival time based on speed.',
     icon: Navigation,
     solveModes: [
        {
           target: 'eta',
           label: 'Calculate ETA',
           inputs: [
              { name: 'dist', label: 'Distance', unit: 'km', defaultValue: 200 },
              { name: 'speed', label: 'Speed', unit: 'km/h', defaultValue: 100 },
              { name: 'start', label: 'Start Hour', unit: '24h', defaultValue: 14 }
           ],
           calculate: (v) => {
              const duration = v.dist / v.speed;
              const arrival = (v.start + duration) % 24;
              const h = Math.floor(arrival);
              const m = Math.round((arrival - h) * 60);
              return {
                 value: `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}`,
                 unit: 'Arrival Time',
                 steps: [`Duration: ${duration.toFixed(2)} hours`],
                 diagram: { type: 'bar', data: [{ label: 'Hours', value: duration, color: '#3b82f6' }] }
              }
           }
        }
     ]
  }
};
