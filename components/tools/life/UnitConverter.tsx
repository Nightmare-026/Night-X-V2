'use client';

import React, { useState, useEffect } from 'react';
import { cn, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
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
  Activity, 
  ShieldCheck, 
  Cpu 
} from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temp' | 'area' | 'volume' | 'speed';

interface Unit {
  id: string;
  name: string;
  factor: number;
}

interface CategoryConfig {
  name: string;
  icon: React.ReactNode;
  units: Unit[];
}

const UNITS: Record<UnitCategory, CategoryConfig> = {
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
      { id: 'sqm', name: 'Sq. Meters (m²)', factor: 1 },
      { id: 'sqkm', name: 'Sq. Kilometers (km²)', factor: 1000000 },
      { id: 'sqft', name: 'Sq. Feet (ft²)', factor: 0.092903 },
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
      { id: 'm3', name: 'Cubic Meters (m³)', factor: 1000 }
    ]
  },
  speed: {
    name: 'Speed',
    icon: <Wind size={16} />,
    units: [
      { id: 'mps', name: 'Meters/sec (m/s)', factor: 1 },
      { id: 'kph', name: 'Kilometers/hour (km/h)', factor: 0.277778 },
      { id: 'mph', name: 'Miles/hour (mph)', factor: 0.44704 },
      { id: 'knot', name: 'Knots', factor: 0.514444 }
    ]
  }
};

export default function UnitConverter() {
  const { toast } = useToast();
  const [category, setCategory] = useState<UnitCategory>('length');
  const [inputValue, setInputValue] = useState<string>('1');
  const [sourceUnit, setSourceUnit] = useState<string>(UNITS.length.units[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setSourceUnit(UNITS[category].units[0].id);
  }, [category]);

  const convert = (val: number, from: string, to: string): number => {
    if (category === 'temp') {
      let celsius = val;
      if (from === 'f') celsius = (val - 32) * (5 / 9);
      if (from === 'k') celsius = val - 273.15;

      if (to === 'c') return celsius;
      if (to === 'f') return (celsius * (9 / 5)) + 32;
      if (to === 'k') return celsius + 273.15;
      return celsius;
    }

    const fromFactor = UNITS[category].units.find(u => u.id === from)?.factor || 1;
    const toFactor = UNITS[category].units.find(u => u.id === to)?.factor || 1;
    return (val * fromFactor) / toFactor;
  };

  const handleCopy = async (text: string, id: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      toast("Value copied to clipboard", "success");
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const currentUnits = UNITS[category].units;
  const numValue = parseFloat(inputValue) || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Category & Source Input */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card bg-[#0E101B]/80 border-white/[0.08] rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.08]">
              <Calculator className="text-amber-400" size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Conversion Settings</h3>
            </div>

            {/* Category Grid */}
            <div className="space-y-2.5">
              <span className="text-xs font-semibold text-text-secondary block">Unit Category</span>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(UNITS) as UnitCategory[]).map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left group",
                        isSelected 
                          ? "bg-amber-400/15 border-amber-400/40 text-white shadow-sm" 
                          : "bg-white/[0.02] border-white/[0.06] text-text-secondary hover:border-white/[0.15] hover:text-white"
                      )}
                    >
                      <div className={cn(
                        "p-1.5 rounded-lg transition-colors",
                        isSelected ? "bg-amber-400 text-black font-bold" : "bg-white/5 text-text-muted group-hover:text-white"
                      )}>
                        {UNITS[cat].icon}
                      </div>
                      <span className="text-xs font-semibold">{UNITS[cat].name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Value & Source Unit */}
            <div className="space-y-4 pt-4 border-t border-white/[0.08]">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary block">Source Value</label>
                <input
                  type="number"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="1.0"
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-xl px-4 font-mono text-lg text-white placeholder:text-text-muted focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary block">Convert From</label>
                <div className="relative">
                  <select
                    value={sourceUnit}
                    onChange={(e) => setSourceUnit(e.target.value)}
                    className="w-full h-11 bg-white/[0.03] border border-white/10 rounded-xl px-4 text-xs font-semibold text-white focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/20 transition-all cursor-pointer appearance-none"
                  >
                    {currentUnits.map(u => (
                      <option key={u.id} value={u.id} className="bg-[#0E101B] text-white">
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Converted Targets List */}
        <div className="lg:col-span-7">
          <div className="glass-card bg-[#0E101B]/80 border-white/[0.08] rounded-2xl overflow-hidden flex flex-col min-h-[500px] shadow-xl">
            <div className="p-5 border-b border-white/[0.08] bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={15} className="text-amber-400" />
                <h3 className="text-sm font-bold text-white">Simultaneous Conversions</h3>
              </div>
              <span className="text-xs text-text-muted font-mono">{currentUnits.length} Units</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
              {currentUnits.map(u => {
                const result = convert(numValue, sourceUnit, u.id);
                const resultStr = result % 1 === 0 ? result.toString() : result.toFixed(6).replace(/\.?0+$/, '');
                const isCurrentSource = u.id === sourceUnit;
                
                return (
                  <div 
                    key={u.id} 
                    className={cn(
                      "p-3.5 rounded-xl border flex justify-between items-center transition-all group",
                      isCurrentSource 
                        ? "bg-amber-400/[0.06] border-amber-400/30" 
                        : "bg-white/[0.02] border-white/[0.04] hover:border-white/20"
                    )}
                  >
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {u.name}
                      </p>
                      {isCurrentSource && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          Source Unit
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-sm sm:text-base font-mono font-bold text-white">
                          {resultStr}
                        </span>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={() => handleCopy(resultStr, u.id)}
                        className={cn(
                          "p-2 rounded-lg border transition-all",
                          copiedId === u.id 
                            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400" 
                            : "bg-white/[0.04] border-white/[0.08] text-text-muted hover:text-white hover:bg-white/10"
                        )}
                        title="Copy Value"
                        aria-label="Copy Value"
                      >
                        {copiedId === u.id ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-white/[0.01] border-t border-white/[0.08] flex items-center justify-between text-xs text-text-muted">
              <span>IEEE 754 High Precision</span>
              <span>Instant Local Conversion</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
