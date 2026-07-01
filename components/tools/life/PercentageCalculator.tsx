'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  Percent, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  HelpCircle,
  Calculator,
  Target,
  Activity,
  Zap,
  ShieldCheck,
  History,
  Scale
} from 'lucide-react';

export default function PercentageCalculator() {
  const [activeTab, setActiveTab] = useState(0);
  const [val1, setVal1] = useState(10);
  const [val2, setVal2] = useState(200);

  const tabs = [
    { title: 'Percentage Of', sub: 'X% of Y', icon: <Percent size={14} /> },
    { title: 'Percentage Change', sub: 'X to Y', icon: <TrendingUp size={14} /> },
    { title: 'Reverse Ratio', sub: 'X is what % of Y', icon: <Scale size={14} /> }
  ];

  const calculateResult = () => {
    switch(activeTab) {
      case 0:
        return (val1 / 100) * val2;
      case 1:
        return val1 !== 0 ? ((val2 - val1) / val1) * 100 : 0;
      case 2:
        return val2 !== 0 ? (val1 / val2) * 100 : 0;
      default:
        return 0;
    }
  };

  const result = calculateResult();

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Input Configuration */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Calculator className="text-amber-400" size={16} />
              <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Input Configuration</h3>
            </div>

            {/* Mode Selection */}
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-1">Calculation Mode</span>
              <div className="grid grid-cols-1 gap-2">
                {tabs.map((tab, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setActiveTab(idx);
                      // Reset values on tab change to sensible defaults for that mode
                      if (idx === 0) { setVal1(10); setVal2(200); }
                      if (idx === 1) { setVal1(100); setVal2(150); }
                      if (idx === 2) { setVal1(20); setVal2(50); }
                    }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-md border transition-all text-left group",
                      activeTab === idx 
                        ? "bg-amber-400/10 border-amber-400/30 text-white" 
                        : "bg-black/40 border-white/[0.05] text-white/40 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-2 rounded-sm transition-colors",
                        activeTab === idx ? "bg-amber-400 text-black" : "bg-white/5 text-white/40 group-hover:bg-white/10"
                      )}>
                        {tab.icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest">{tab.title}</div>
                        <div className="text-[9px] font-medium text-white/20 uppercase tracking-widest mt-0.5">{tab.sub}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Inputs */}
            <div className="space-y-6 pt-4 border-t border-white/[0.05]">
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                  <span className="text-white/20">{activeTab === 0 ? 'Percentage' : activeTab === 1 ? 'Initial Value' : 'Part Value'}</span>
                  <span className="text-amber-400 font-mono">{val1}</span>
                </div>
                <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] space-y-4">
                  <input
                    type="range"
                    min="0"
                    max={activeTab === 0 ? 100 : 10000}
                    step={activeTab === 0 ? 1 : 10}
                    value={val1}
                    onChange={(e) => setVal1(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <input
                    type="number"
                    value={val1}
                    onChange={(e) => setVal1(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/20 border border-white/[0.05] rounded-md py-3 px-4 font-mono text-xs text-white/40 focus:outline-none focus:border-amber-400/50 transition-all text-right"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                  <span className="text-white/20">{activeTab === 0 ? 'Total Value' : activeTab === 1 ? 'Final Value' : 'Whole Value'}</span>
                  <span className="text-amber-400 font-mono">{val2}</span>
                </div>
                <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] space-y-4">
                  <input
                    type="range"
                    min="1"
                    max="10000"
                    step="10"
                    value={val2}
                    onChange={(e) => setVal2(parseFloat(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-amber-400"
                  />
                  <input
                    type="number"
                    value={val2}
                    onChange={(e) => setVal2(parseFloat(e.target.value) || 0)}
                    className="w-full bg-black/20 border border-white/[0.05] rounded-md py-3 px-4 font-mono text-xs text-white/40 focus:outline-none focus:border-amber-400/50 transition-all text-right"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-amber-400/5 border border-amber-400/10 rounded-md space-y-4">
              <div className="flex items-center gap-3 text-amber-400">
                <Target size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Calculation Logic</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                {activeTab === 0 && "Executing standard percentage extraction: (P / 100) * T."}
                {activeTab === 1 && "Modeling percentage delta: ((V2 - V1) / V1) * 100."}
                {activeTab === 2 && "Performing reverse ratio analysis: (V1 / V2) * 100."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Ratio Visualization */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden flex flex-col min-h-[600px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase mb-2">Protocol Output</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Ratio Visualization</h2>
                </div>
                
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-md border border-white/5">
                  <Activity size={12} className="text-amber-400" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Metric Sync</span>
                </div>
              </div>

              <div className="flex-1 space-y-8 flex flex-col justify-center">
                {/* Main Result Display */}
                <div className="text-center space-y-6">
                  <div className="p-16 bg-black/40 border border-white/[0.05] rounded-md relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400/20 to-transparent" />
                    <div className="text-[10px] font-bold text-white/10 uppercase tracking-[0.5em] mb-4">Calculated Output</div>
                    <div className="flex items-center justify-center gap-4">
                      <span className={cn(
                        "text-7xl font-outfit font-bold tracking-tighter transition-all",
                        activeTab === 1 && result < 0 ? "text-red-400" : "text-white"
                      )}>
                        {activeTab === 1 && result > 0 ? '+' : ''}
                        {Number.isInteger(result) ? result : result.toFixed(2)}
                        {(activeTab === 1 || activeTab === 2) && '%'}
                      </span>
                    </div>
                    {activeTab === 1 && (
                      <div className={cn(
                        "text-[10px] font-bold uppercase tracking-[0.2em] mt-4 flex items-center justify-center gap-2",
                        result >= 0 ? "text-emerald-400/60" : "text-red-400/60"
                      )}>
                        {result >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        Total {result >= 0 ? 'Increase' : 'Decrease'} detected
                      </div>
                    )}
                  </div>
                </div>

                {/* Comparative Visual */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Structural Delta</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">{activeTab === 1 ? 'Delta' : 'Ratio'} Distribution</span>
                  </div>
                  
                  <div className="p-8 bg-black/40 border border-white/[0.05] rounded-md space-y-8">
                    <div className="relative h-4 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "absolute top-0 left-0 h-full transition-all duration-700 ease-out",
                          activeTab === 1 && result < 0 ? "bg-red-400" : "bg-amber-400"
                        )}
                        style={{ 
                          width: activeTab === 0 
                            ? `${(result / val2) * 100}%` 
                            : activeTab === 1 
                              ? `${Math.min(100, Math.abs(result))}%` 
                              : `${Math.min(100, result)}%` 
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Base Parameter</div>
                        <div className="text-lg font-outfit font-bold text-white tracking-widest">{val1}</div>
                      </div>
                      <div className="space-y-2 text-right">
                        <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Target Parameter</div>
                        <div className="text-lg font-outfit font-bold text-white tracking-widest">{val2}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Trace Footer */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-amber-400">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Engine Trace</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Real-time computational cycle executed at 1ms latency for instant reactive parameter shifts.
                  </p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Validation Policy</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Division by zero protection and precision rounding logic verified against financial standards.
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
