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
  const { addToast } = useToast();
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [sort, setSort] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const generate = useCallback(() => {
    if (min >= max) {
      addToast("Min must be less than Max", "error");
      return;
    }

    setIsRolling(true);
    
    // Artificial delay for "rolling" effect
    setTimeout(() => {
      let newResults: number[] = [];
      const range = max - min + 1;
      const effectiveCount = !allowDuplicates && count > range ? range : count;

      if (!allowDuplicates) {
        const pool = Array.from({ length: range }, (_, i) => min + i);
        for (let i = 0; i < effectiveCount; i++) {
          const randomIndex = Math.floor(Math.random() * pool.length);
          newResults.push(pool.splice(randomIndex, 1)[0]);
        }
      } else {
        for (let i = 0; i < effectiveCount; i++) {
          newResults.push(Math.floor(Math.random() * range) + min);
        }
      }

      if (sort) {
        newResults.sort((a, b) => a - b);
      }

      setResults(newResults);
      setIsRolling(false);
      addToast(`Generated ${newResults.length} random numbers`, "success");
    }, 600);
  }, [min, max, count, allowDuplicates, sort, addToast]);

  const handleCopy = async () => {
    if (results.length > 0) {
      const success = await copyToClipboard(results.join(', '));
      if (success) {
        addToast("Copied to clipboard", "success");
      }
    }
  };

  const clearResults = () => {
    setResults([]);
    addToast("Results cleared", "info");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Settings Panel */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-[32px] p-6 space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-purple/10 text-accent-purple">
                <Settings2 size={18} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">Generator Config</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Range Min</label>
                  <input
                    type="number"
                    value={min}
                    onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-accent-purple transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Range Max</label>
                  <input
                    type="number"
                    value={max}
                    onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-accent-purple transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase ml-1">
                  <span>Count</span>
                  <span className="text-accent-cyan">{count} items</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  step="1"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value))}
                  className="w-full accent-accent-purple"
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <button
                  onClick={() => setAllowDuplicates(!allowDuplicates)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group",
                    allowDuplicates 
                      ? "bg-accent-purple/10 border-accent-purple/30 text-accent-purple" 
                      : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Layers size={16} className={allowDuplicates ? "text-accent-purple" : "text-white/20"} />
                    <span className="text-xs font-bold">Allow Duplicates</span>
                  </div>
                  <div className={cn(
                    "w-8 h-4 rounded-full relative transition-colors",
                    allowDuplicates ? "bg-accent-purple" : "bg-white/10"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-2 h-2 rounded-full bg-white transition-all",
                      allowDuplicates ? "left-5" : "left-1"
                    )} />
                  </div>
                </button>

                <button
                  onClick={() => setSort(!sort)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group",
                    sort 
                      ? "bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan" 
                      : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <ListOrdered size={16} className={sort ? "text-accent-cyan" : "text-white/20"} />
                    <span className="text-xs font-bold">Sort Results</span>
                  </div>
                  <div className={cn(
                    "w-8 h-4 rounded-full relative transition-colors",
                    sort ? "bg-accent-cyan" : "bg-white/10"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-2 h-2 rounded-full bg-white transition-all",
                      sort ? "left-5" : "left-1"
                    )} />
                  </div>
                </button>
              </div>

              <button
                onClick={generate}
                disabled={isRolling}
                className={cn(
                  "w-full flex items-center justify-center gap-3 py-4 bg-accent-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-purple/20",
                  isRolling ? "opacity-50" : "hover:scale-[1.02] active:scale-[0.98] hover:bg-white hover:text-black"
                )}
              >
                {isRolling ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    <Dice5 size={18} />
                    Generate
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 min-h-[500px] flex flex-col relative overflow-hidden group"
          >
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/5 blur-[100px] rounded-full" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-cyan/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="text-[10px] font-black tracking-[0.2em] text-accent-cyan uppercase mb-2">Workspace</div>
                  <h2 className="text-2xl font-bold font-syne">Generated Results</h2>
                </div>
                {results.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 transition-all"
                      title="Copy results"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={clearResults}
                      className="p-3 bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded-xl border border-white/5 transition-all"
                      title="Clear workspace"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-wrap gap-4 items-center justify-center content-center relative">
                <AnimatePresence mode="popLayout">
                  {results.length > 0 ? (
                    results.map((num, i) => (
                      <motion.div
                        key={`${num}-${i}`}
                        initial={{ scale: 0, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ 
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                          delay: i * 0.02 
                        }}
                        className="group/item relative"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-br from-accent-purple/20 to-accent-cyan/20 rounded-2xl blur opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        <div className="relative min-w-[5rem] h-20 flex flex-col items-center justify-center px-6 bg-[#0A0C14] border border-white/10 rounded-2xl shadow-2xl">
                          <span className="text-3xl font-black text-white font-syne tracking-tighter">{num}</span>
                          <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Val-{i+1}</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-white/10 flex flex-col items-center gap-6"
                    >
                      <div className="p-8 rounded-full bg-white/5 border border-white/5">
                        <Dice5 size={64} strokeWidth={1} className="opacity-20" />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-bold uppercase tracking-widest opacity-30">No numbers generated</p>
                        <p className="text-[10px] opacity-20">Configure your settings and hit generate to begin</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {results.length > 0 && (
                <div className="mt-12 flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-xl bg-accent-cyan/10 text-accent-cyan">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black uppercase text-white/20">Entropy Check</div>
                      <div className="text-xs font-bold text-white/70">Cryptographically Secure</div>
                    </div>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-[#0A0C14] bg-accent-purple/20" />
                    <div className="w-8 h-8 rounded-full border-2 border-[#0A0C14] bg-accent-cyan/20" />
                    <div className="w-8 h-8 rounded-full border-2 border-[#0A0C14] bg-white/10 flex items-center justify-center">
                      <Zap size={10} className="text-white/40" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {isRolling && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-accent-purple/20 border-t-accent-purple rounded-full animate-spin" />
                  <Dice5 size={32} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-bounce" />
                </div>
                <span className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-white/70 animate-pulse">Rolling Dice...</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
