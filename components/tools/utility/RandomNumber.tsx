'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  Copy, 
  Check, 
  Dice5, 
  Settings2, 
  Trash2, 
  Hash, 
  ListOrdered, 
  Layers,
  Sparkles,
  Zap
} from 'lucide-react';
import { cn, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

export default function RandomNumber() {
  const { toast } = useToast();
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [sort, setSort] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const generate = useCallback(() => {
    if (min >= max) {
      toast("Min must be less than Max", "error");
      return;
    }

    setIsRolling(true);
    
    // Artificial delay for "rolling" effect
    setTimeout(() => {
      let newResults: number[] = [];
      const range = max - min + 1;
      const effectiveCount = !allowDuplicates && count > range ? range : count;

      const getRandomInt = (minVal: number, maxVal: number) => {
        const rangeVal = maxVal - minVal + 1;
        const array = new Uint32Array(1);
        crypto.getRandomValues(array);
        return (array[0] % rangeVal) + minVal;
      };

      if (!allowDuplicates) {
        // For small ranges, use the pool method for efficiency
        // For large ranges, use a Set to track duplicates to avoid memory issues
        if (range < 10000) {
          const pool = Array.from({ length: range }, (_, i) => min + i);
          for (let i = 0; i < effectiveCount; i++) {
            const array = new Uint32Array(1);
            crypto.getRandomValues(array);
            const randomIndex = array[0] % pool.length;
            newResults.push(pool.splice(randomIndex, 1)[0]);
          }
        } else {
          const uniqueSet = new Set<number>();
          while (uniqueSet.size < effectiveCount) {
            uniqueSet.add(getRandomInt(min, max));
          }
          newResults = Array.from(uniqueSet);
        }
      } else {
        for (let i = 0; i < effectiveCount; i++) {
          newResults.push(getRandomInt(min, max));
        }
      }

      if (sort) {
        newResults.sort((a, b) => a - b);
      }

      setResults(newResults);
      setIsRolling(false);
      toast(`Generated ${newResults.length} random numbers`, "success");
    }, 600);
  }, [min, max, count, allowDuplicates, sort, toast]);

  const handleCopy = async () => {
    if (results.length > 0) {
      const success = await copyToClipboard(results.join(', '));
      if (success) {
        toast("Copied to clipboard", "success");
      }
    }
  };

  const clearResults = () => {
    setResults([]);
    toast("Results cleared", "info");
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Results Panel */}
        <div className="lg:col-span-8 order-2 lg:order-1 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 min-h-[600px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full flex-1">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-accent-blue uppercase mb-2">Entropy Pool</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Generated Values</h2>
                </div>
                {results.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-3 bg-white/[0.02] hover:bg-white/[0.05] text-white/40 hover:text-white rounded-md border border-white/[0.05] transition-all"
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      onClick={clearResults}
                      className="p-3 bg-white/[0.02] hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded-md border border-white/[0.05] transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-wrap gap-4 items-center justify-center content-center py-12">
                <AnimatePresence mode="popLayout">
                  {results.length > 0 ? (
                    results.map((num, i) => (
                      <motion.div
                        key={`${num}-${i}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2, delay: i * 0.01 }}
                        className="group relative"
                      >
                        <div className="relative min-w-[100px] h-24 flex flex-col items-center justify-center px-8 bg-black/40 border border-white/[0.05] rounded-md transition-all group-hover:border-accent-blue/30 group-hover:bg-accent-blue/5">
                          <span className="text-3xl font-outfit font-bold text-white tracking-tighter leading-none">{num}</span>
                          <span className="text-[8px] font-bold text-white/10 uppercase tracking-widest mt-2">Index {i + 1}</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center gap-6 opacity-20">
                      <Dice5 size={48} strokeWidth={1} />
                      <div className="text-center space-y-1">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">No entropy data</p>
                        <p className="text-[10px] uppercase">Initialize generator to begin</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {results.length > 0 && (
                <div className="mt-auto pt-12">
                  <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-accent-blue/10 flex items-center justify-center">
                        <Sparkles size={16} className="text-accent-blue" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase text-white/30 tracking-widest">Protocol</div>
                        <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Web Crypto API Secure</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-blue/40" />
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-blue/20" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isRolling && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <RefreshCw className="w-10 h-10 text-accent-blue animate-spin mb-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Synthesizing...</span>
              </div>
            )}
          </div>
        </div>

        {/* Settings Panel */}
        <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Settings2 className="text-accent-blue" size={16} />
              <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Generator Config</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1 font-inter">Minimum</label>
                  <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/[0.05] rounded-md p-4 text-sm focus:outline-none focus:border-accent-blue transition-all font-inter text-white/80"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1 font-inter">Maximum</label>
                  <input
                    type="number"
                    value={max}
                    onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/[0.05] rounded-md p-4 text-sm focus:outline-none focus:border-accent-blue transition-all font-inter text-white/80"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1 font-inter">
                  <span>Count</span>
                  <span className="text-accent-blue">{count} Units</span>
                </div>
                <div className="px-4 py-8 bg-black/40 rounded-md border border-white/[0.05]">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full accent-accent-blue h-1 bg-white/[0.05] rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-white/[0.05]">
                <button
                  onClick={() => setAllowDuplicates(!allowDuplicates)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-md border transition-all",
                    allowDuplicates 
                      ? "bg-accent-blue/10 border-accent-blue/30 text-accent-blue" 
                      : "bg-white/[0.02] border-white/[0.05] text-white/20 hover:text-white/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Layers size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Duplicates</span>
                  </div>
                  <div className={cn(
                    "w-6 h-3 rounded-full relative transition-colors",
                    allowDuplicates ? "bg-accent-blue" : "bg-white/10"
                  )}>
                    <div className={cn(
                      "absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all",
                      allowDuplicates ? "left-3.5" : "left-0.5"
                    )} />
                  </div>
                </button>

                <button
                  onClick={() => setSort(!sort)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-md border transition-all",
                    sort 
                      ? "bg-accent-blue/10 border-accent-blue/30 text-accent-blue" 
                      : "bg-white/[0.02] border-white/[0.05] text-white/20 hover:text-white/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <ListOrdered size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Sort Results</span>
                  </div>
                  <div className={cn(
                    "w-6 h-3 rounded-full relative transition-colors",
                    sort ? "bg-accent-blue" : "bg-white/10"
                  )}>
                    <div className={cn(
                      "absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all",
                      sort ? "left-3.5" : "left-0.5"
                    )} />
                  </div>
                </button>
              </div>

              <button
                onClick={generate}
                disabled={isRolling}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black rounded-md font-bold text-[10px] uppercase tracking-widest transition-all shadow-xl hover:bg-white/90 disabled:opacity-50"
              >
                {isRolling ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <>
                    <Dice5 size={14} />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-md space-y-4">
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-accent-blue" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/80">Security Note</h4>
            </div>
            <p className="text-[10px] text-white/30 uppercase tracking-wide font-inter leading-relaxed">
              We utilize cryptographically strong random values generated by the window.crypto.getRandomValues interface for maximum security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
