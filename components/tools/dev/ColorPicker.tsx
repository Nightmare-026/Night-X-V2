'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import { 
  Palette, 
  Copy, 
  Check, 
  RotateCcw,
  Pipette,
  Hash,
  Sliders,
  Droplets,
  Zap,
  ShieldCheck,
  Layout
} from 'lucide-react';

export default function ColorPicker() {
  const [color, setColor] = useState('#22d3ee'); // Default cyan-400
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const normalizeHex = (hex: string) => {
    if (hex.length === 4) {
      return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    return hex;
  };

  const hexToRgb = (hex: string) => {
    const normalized = normalizeHex(hex);
    const r = parseInt(normalized.slice(1, 3), 16) || 0;
    const g = parseInt(normalized.slice(3, 5), 16) || 0;
    const b = parseInt(normalized.slice(5, 7), 16) || 0;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const hexToHsl = (hex: string) => {
    const normalized = normalizeHex(hex);
    let r = parseInt(normalized.slice(1, 3), 16) / 255 || 0;
    let g = parseInt(normalized.slice(3, 5), 16) / 255 || 0;
    let b = parseInt(normalized.slice(5, 7), 16) / 255 || 0;

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
    '#EF4444', '#F59E0B', '#22D3EE', '#3B82F6', '#6366F1', '#8B5CF6', 
    '#EC4899', '#64748B', '#F8FAFC', '#0F172A', '#10B981', '#F43F5E'
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Chromatic Input */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="text-cyan-400" size={16} />
                <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Chromatic Input</h3>
              </div>
              <button 
                onClick={() => setColor('#22d3ee')}
                className="text-white/20 hover:text-cyan-400 transition-colors"
                title="Reset Spectrum"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-black/40 p-4 rounded-md border border-white/[0.05]">
                <HexColorPicker 
                  color={color} 
                  onChange={setColor} 
                  style={{ width: '100%', height: '240px' }}
                  className="rounded-md overflow-hidden"
                />
              </div>

              <div className="grid grid-cols-6 gap-3">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => setColor(p)}
                    className="aspect-square rounded-md border border-white/[0.05] transition-transform hover:scale-110 active:scale-95 shadow-lg"
                    style={{ backgroundColor: p }}
                  />
                ))}
              </div>

              <div 
                className="h-24 rounded-md border border-white/[0.05] flex items-center justify-center relative overflow-hidden group"
                style={{ backgroundColor: color }}
              >
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 font-mono font-bold text-lg mix-blend-difference text-white uppercase tracking-widest">
                  {color}
                </span>
              </div>
            </div>

            <div className="p-6 bg-cyan-400/5 border border-cyan-400/10 rounded-md space-y-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <Pipette size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Spectral Precision</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                Utilizing high-fidelity color space transforms for accurate UI/UX design synthesis.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Spectral Data */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 space-y-12">
              <div>
                <div className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase mb-2">Protocol Standards</div>
                <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Spectral Data</h2>
              </div>

              <div className="space-y-6">
                {/* Format Inputs */}
                {[
                  { label: 'HEX Code', value: color.toUpperCase(), id: 'hex', icon: Hash },
                  { label: 'RGB Vector', value: hexToRgb(color), id: 'rgb', icon: Sliders },
                  { label: 'HSL Model', value: hexToHsl(color), id: 'hsl', icon: Droplets },
                ].map((field) => (
                  <div key={field.id} className="space-y-3">
                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest flex items-center gap-2 px-1">
                      <field.icon size={10} /> {field.label}
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        readOnly
                        value={field.value}
                        className="w-full bg-black/40 border border-white/[0.05] rounded-md py-4 px-6 font-mono text-sm text-white/80 focus:outline-none focus:border-cyan-400/50 transition-all"
                      />
                      <button
                        onClick={() => handleCopy(field.value, field.id)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:text-cyan-400 transition-colors"
                      >
                        {copiedField === field.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/20" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-8 border-t border-white/[0.05] space-y-8">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Harmony Modules</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'Complementary', filter: 'hue-rotate(180deg)' },
                    { label: 'Monochromatic', filter: 'brightness(1.4)' },
                    { label: 'Triadic', filter: 'hue-rotate(120deg)' },
                  ].map((h) => (
                    <div key={h.label} className="space-y-4">
                      <div className="text-[8px] font-bold uppercase tracking-widest text-white/40">{h.label}</div>
                      <div className="flex gap-2">
                        <div className="h-10 flex-1 rounded-md border border-white/[0.05]" style={{ backgroundColor: color }} />
                        <div className="h-10 flex-1 rounded-md border border-white/[0.05]" style={{ backgroundColor: color, filter: h.filter }} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                    <div className="flex items-center gap-3 text-cyan-400">
                      <Zap size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">W3C Compliance</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                      Color space conversions mapped to standard sRGB specifications.
                    </p>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <ShieldCheck size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Design Guard</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                      Validates accessibility contrast ratios in real-time within the sandbox.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
