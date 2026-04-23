'use client';

import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, 
  Copy, 
  Check, 
  RotateCcw,
  Pipette,
  Hash,
  Sliders,
  Droplets
} from 'lucide-react';

export default function ColorPicker() {
  const [color, setColor] = useState('#6366f1');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Convert HEX to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Convert HEX to HSL
  const hexToHsl = (hex: string) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const presets = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', '#8B5CF6', 
    '#EC4899', '#64748B', '#000000', '#FFFFFF', '#FF5733', '#33FF57'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 p-8 rounded-[40px] border border-white/10 shadow-2xl backdrop-blur-xl">
        
        {/* Left: Picker & Preview */}
        <div className="space-y-6">
          <div className="relative group p-4 bg-black/40 rounded-3xl border border-white/10 flex items-center justify-center">
            <HexColorPicker 
              color={color} 
              onChange={setColor} 
              style={{ width: '100%', height: '240px' }}
            />
          </div>

          <div className="grid grid-cols-6 gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setColor(p)}
                className="aspect-square rounded-lg border border-white/10 transition-transform hover:scale-110 active:scale-95 shadow-lg"
                style={{ backgroundColor: p }}
              />
            ))}
          </div>

          <div 
            className="h-24 rounded-3xl border border-white/10 shadow-inner flex items-center justify-center relative overflow-hidden"
            style={{ backgroundColor: color }}
          >
            <span className={`font-bold text-lg mix-blend-difference text-white uppercase`}>
              {color}
            </span>
          </div>
        </div>

        {/* Right: Values & Formats */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Palette className="w-5 h-5 text-accent-cyan" />
            <h3 className="font-syne font-bold text-xl text-white">Color Formats</h3>
          </div>

          <div className="space-y-4">
            {/* HEX */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2 flex items-center gap-1">
                <Hash className="w-3 h-3" /> HEX Code
              </label>
              <div className="relative group">
                <input
                  type="text"
                  value={color.toUpperCase()}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 font-mono text-white focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all"
                />
                <button
                  onClick={() => handleCopy(color.toUpperCase(), 'hex')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  {copiedField === 'hex' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/40" />}
                </button>
              </div>
            </div>

            {/* RGB */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2 flex items-center gap-1">
                <Sliders className="w-3 h-3" /> RGB Value
              </label>
              <div className="relative group">
                <input
                  type="text"
                  readOnly
                  value={hexToRgb(color)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 font-mono text-white/60 focus:outline-none"
                />
                <button
                  onClick={() => handleCopy(hexToRgb(color), 'rgb')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  {copiedField === 'rgb' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/40" />}
                </button>
              </div>
            </div>

            {/* HSL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/40 uppercase ml-2 flex items-center gap-1">
                <Droplets className="w-3 h-3" /> HSL Value
              </label>
              <div className="relative group">
                <input
                  type="text"
                  readOnly
                  value={hexToHsl(color)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 px-5 font-mono text-white/60 focus:outline-none"
                />
                <button
                  onClick={() => handleCopy(hexToHsl(color), 'hsl')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl hover:bg-white/5 transition-all"
                >
                  {copiedField === 'hsl' ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white/40" />}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-4">
            <button 
              onClick={() => setColor('#6366f1')}
              className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
            <div className="flex-1 flex items-center justify-center bg-accent-cyan/10 rounded-2xl border border-accent-cyan/20 text-accent-cyan text-xs font-bold gap-2">
              <Pipette className="w-4 h-4" /> Eye Dropper
            </div>
          </div>
        </div>
      </div>

      {/* Modern Palette Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 hover:border-white/20 transition-all group">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            Complementary
          </h4>
          <div className="flex gap-2">
            {[color, color].map((_, i) => (
              <div key={i} className="h-12 flex-1 rounded-xl border border-white/10" style={{ backgroundColor: color, filter: i === 1 ? 'hue-rotate(180deg)' : 'none' }} />
            ))}
          </div>
        </div>
        <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 hover:border-white/20 transition-all group">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            Monochromatic
          </h4>
          <div className="flex gap-2">
            {[0.7, 1, 1.3].map((v, i) => (
              <div key={i} className="h-12 flex-1 rounded-xl border border-white/10" style={{ backgroundColor: color, filter: `brightness(${v})` }} />
            ))}
          </div>
        </div>
        <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 hover:border-white/20 transition-all group">
          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            Triadic
          </h4>
          <div className="flex gap-2">
            {[0, 120, 240].map((deg, i) => (
              <div key={i} className="h-12 flex-1 rounded-xl border border-white/10" style={{ backgroundColor: color, filter: `hue-rotate(${deg}deg)` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
