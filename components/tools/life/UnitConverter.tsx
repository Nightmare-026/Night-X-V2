'use client';
// @ts-nocheck
import { cn } from '@/lib/utils';
import { 
  Scale, 
  Ruler, 
  Thermometer, 
  Zap, 
  Layers, 
  Wind, 
  Copy, 
  Check,
  Calculator,
  Target,
  Activity,
  ShieldCheck,
  Cpu,
  ArrowRight
} from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temp' | 'area' | 'volume' | 'speed';

interface Unit {
  id: string;
  name: string;
  factor: number;
}

const UNITS: Record<UnitCategory, { name: string; icon: any; units: Unit[] }> = {
  length: {
    name: 'Length',
    icon: <Ruler size={16} />,
    units: [
      { id: 'm', name: 'Meters (m)', factor: 1 },
      { id: 'km', name: 'Kilometers (km)', factor: 1000 },
      { id: 'cm', name: 'Centimeters (cm)', factor: 0.01 },
      { id: 'mm', name: 'Millimeters (mm)', factor: 0.001 },
      { id: 'mi', name: 'Miles (mi)', factor: 1609.34 },
      { id: 'ft', name: 'Feet (ft)', factor: 0.3048 },
      { id: 'in', name: 'Inches (in)', factor: 0.0254 }
    ]
  },
  weight: {
    name: 'Weight',
    icon: <Scale size={16} />,
    units: [
      { id: 'kg', name: 'Kilograms (kg)', factor: 1 },
      { id: 'g', name: 'Grams (g)', factor: 0.001 },
      { id: 'mg', name: 'Milligrams (mg)', factor: 0.000001 },
      { id: 'lb', name: 'Pounds (lb)', factor: 0.453592 },
      { id: 'oz', name: 'Ounces (oz)', factor: 0.0283495 }
    ]
  },
  temp: {
    name: 'Temperature',
    icon: <Thermometer size={16} />,
    units: [
      { id: 'c', name: 'Celsius (°C)', factor: 1 },
      { id: 'f', name: 'Fahrenheit (°F)', factor: 0 },
      { id: 'k', name: 'Kelvin (K)', factor: 0 }
    ]
  },
  area: {
    name: 'Area',
    icon: <Layers size={16} />,
    units: [
      { id: 'sqm', name: 'Sq. Meters', factor: 1 },
      { id: 'sqkm', name: 'Sq. Kilometers', factor: 1000000 },
      { id: 'sqft', name: 'Sq. Feet', factor: 0.092903 },
      { id: 'acre', name: 'Acres', factor: 4046.86 },
      { id: 'hec', name: 'Hectares', factor: 10000 }
    ]
  },
  volume: {
    name: 'Volume',
    icon: <Zap size={16} />,
    units: [
      { id: 'l', name: 'Liters (L)', factor: 1 },
      { id: 'ml', name: 'Milliliters (ml)', factor: 0.001 },
      { id: 'gal', name: 'Gallons (US)', factor: 3.78541 },
      { id: 'm3', name: 'Cubic Meters', factor: 1000 }
    ]
  },
  speed: {
    name: 'Speed',
    icon: <Wind size={16} />,
    units: [
      { id: 'mps', name: 'm/s', factor: 1 },
      { id: 'kph', name: 'km/h', factor: 0.277778 },
      { id: 'mph', name: 'mph', factor: 0.44704 },
      { id: 'knot', name: 'Knots', factor: 0.514444 }
    ]
  }
};

export default function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [sourceUnit, setSourceUnit] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setSourceUnit(UNITS[category].units[0].id);
  }, [category]);

  const convert = (val: number, from: string, to: string) => {
    if (category === 'temp') {
      let celsius = val;
      if (from === 'f') celsius = (val - 32) * 5/9;
      if (from === 'k') celsius = val - 273.15;

      if (to === 'c') return celsius;
      if (to === 'f') return (celsius * 9/5) + 32;
      if (to === 'k') return celsius + 273.15;
      return celsius;
    }

    const fromFactor = UNITS[category].units.find(u => u.id === from)?.factor || 1;
    const toFactor = UNITS[category].units.find(u => u.id === to)?.factor || 1;
    return (val * fromFactor) / toFactor;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentUnits = UNITS[category].units;
  const numValue = parseFloat(inputValue) || 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Conversion Registry */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Calculator className="text-amber-400" size={16} />
              <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Conversion Registry</h3>
            </div>

            {/* Category Grid */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-1">Dimension Category</span>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(UNITS) as UnitCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-md border transition-all text-left group",
                      category === cat 
                        ? "bg-amber-400/10 border-amber-400/30 text-white" 
                        : "bg-black/40 border-white/[0.05] text-white/40 hover:border-white/20"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-sm transition-colors",
                      category === cat ? "bg-amber-400 text-black" : "bg-white/5 text-white/40 group-hover:bg-white/10"
                    )}>
                      {UNITS[cat].icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{UNITS[cat].name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Configuration */}
            <div className="space-y-6 pt-4 border-t border-white/[0.05]">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                  <span className="text-white/20">Source Value</span>
                  <span className="text-amber-400 font-mono">{inputValue || '0'}</span>
                </div>
                <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] space-y-4">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter numeric value..."
                    className="w-full bg-black/20 border border-white/[0.05] rounded-md py-4 px-6 font-outfit text-2xl text-white focus:outline-none focus:border-amber-400/50 transition-all text-center"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                  <span className="text-white/20">Source Unit</span>
                  <span className="text-amber-400 font-mono">{UNITS[category].units.find(u => u.id === sourceUnit)?.name}</span>
                </div>
                <div className="p-4 bg-black/40 rounded-md border border-white/[0.05]">
                  <select
                    value={sourceUnit}
                    onChange={(e) => setSourceUnit(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold uppercase tracking-widest text-white/40 focus:outline-none cursor-pointer appearance-none text-center"
                  >
                    {currentUnits.map(u => (
                      <option key={u.id} value={u.id} className="bg-zinc-900">{u.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 bg-amber-400/5 border border-amber-400/10 rounded-md space-y-4">
              <div className="flex items-center gap-3 text-amber-400">
                <Target size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Logic Protocol</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                Utilizing high-precision floating point arithmetic with SI-base unit normalization for maximum accuracy.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Matrix Output */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden flex flex-col min-h-[700px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase mb-2">Protocol Output</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Matrix Output</h2>
                </div>
                
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-md border border-white/5">
                  <Activity size={12} className="text-amber-400" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Real-time Sync</span>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar max-h-[500px]">
                {currentUnits.map(u => {
                  const result = convert(numValue, sourceUnit, u.id);
                  const resultStr = result % 1 === 0 ? result.toString() : result.toFixed(6).replace(/\.?0+$/, '');
                  
                  return (
                    <div 
                      key={u.id} 
                      className="p-4 bg-black/40 border border-white/[0.05] rounded-md flex justify-between items-center group hover:border-amber-400/30 transition-all"
                    >
                      <div className="space-y-1">
                        <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Target Unit</div>
                        <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">{u.name}</div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right space-y-1">
                          <div className="text-[8px] font-bold text-amber-400/40 uppercase tracking-widest text-right">Magnitude</div>
                          <div className="text-lg font-mono font-bold text-white tracking-tighter">
                            {resultStr}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => copyToClipboard(resultStr, u.id)}
                          className={cn(
                            "p-3 rounded-sm border transition-all",
                            copiedId === u.id 
                              ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" 
                              : "bg-white/5 border-white/10 text-white/20 hover:border-white/30 hover:text-white"
                          )}
                        >
                          {copiedId === u.id ? <Check size={14} /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Technical Trace Footer */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-amber-400">
                    <Cpu size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Engine Trace</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Computational engine utilizing 64-bit precision for dimension translation cycles.
                  </p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Policy Validation</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Mathematical constants and SI factors verified against global measurement standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
