'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, Ruler, Thermometer, Zap, Layers, Wind } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temp' | 'area' | 'volume' | 'speed';

interface Unit {
  id: string;
  name: string;
  factor: number; // Base unit factor
}

const UNITS: Record<UnitCategory, { name: string; icon: any; units: Unit[] }> = {
  length: {
    name: 'Length',
    icon: <Ruler className="w-5 h-5" />,
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
    icon: <Scale className="w-5 h-5" />,
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
    icon: <Thermometer className="w-5 h-5" />,
    units: [
      { id: 'c', name: 'Celsius (°C)', factor: 1 },
      { id: 'f', name: 'Fahrenheit (°F)', factor: 0 }, // Handled specially
      { id: 'k', name: 'Kelvin (K)', factor: 0 } // Handled specially
    ]
  },
  area: {
    name: 'Area',
    icon: <Layers className="w-5 h-5" />,
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
    icon: <Zap className="w-5 h-5" />,
    units: [
      { id: 'l', name: 'Liters (L)', factor: 1 },
      { id: 'ml', name: 'Milliliters (ml)', factor: 0.001 },
      { id: 'gal', name: 'Gallons (US)', factor: 3.78541 },
      { id: 'm3', name: 'Cubic Meters', factor: 1000 }
    ]
  },
  speed: {
    name: 'Speed',
    icon: <Wind className="w-5 h-5" />,
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

  const currentUnits = UNITS[category].units;
  const numValue = parseFloat(inputValue) || 0;

  return (
    <div className="space-y-8">
      <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
        {(Object.keys(UNITS) as UnitCategory[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all border ${
              category === cat 
                ? 'bg-purple-600 border-purple-500 text-white shadow-lg' 
                : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
            }`}
          >
            {UNITS[cat].icon}
            {UNITS[cat].name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Value to Convert</label>
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/60">Source Unit</label>
            <select
              value={sourceUnit}
              onChange={(e) => setSourceUnit(e.target.value)}
              className="w-full px-6 py-4 bg-black/40 border border-white/10 rounded-2xl text-lg font-medium text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 appearance-none"
            >
              {currentUnits.map(u => (
                <option key={u.id} value={u.id} className="bg-zinc-900">{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-white/40 uppercase tracking-widest px-2">Converted Results</h4>
          <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {currentUnits.map(u => {
              const result = convert(numValue, sourceUnit, u.id);
              return (
                <div key={u.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex justify-between items-center group hover:bg-white/10 transition-all">
                  <span className="text-white/60 group-hover:text-white transition-colors">{u.name}</span>
                  <span className="text-xl font-mono font-bold text-white">
                    {result % 1 === 0 ? result : result.toFixed(6).replace(/\.?0+$/, '')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
