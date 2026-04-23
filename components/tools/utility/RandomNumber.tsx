'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Copy, Check, Dice5, Settings2, Trash2 } from 'lucide-react';

export default function RandomNumber() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(false);
  const [sort, setSort] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setIsRolling(true);
    
    // Artificial delay for "rolling" effect
    setTimeout(() => {
      let newResults: number[] = [];
      const range = max - min + 1;

      if (!allowDuplicates && count > range) {
        setCount(range);
        // We'll proceed with range as count
      }

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
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Minimum</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Maximum</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(parseInt(e.target.value) || 0)}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Count</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white"
            min="1"
            max="1000"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/60">Settings</label>
          <div className="flex gap-2">
            <button
              onClick={() => setAllowDuplicates(!allowDuplicates)}
              className={`flex-1 py-2.5 text-xs font-medium rounded-xl border transition-all ${
                allowDuplicates 
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' 
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
              }`}
              title="Allow duplicate numbers"
            >
              Duplicates
            </button>
            <button
              onClick={() => setSort(!sort)}
              className={`flex-1 py-2.5 text-xs font-medium rounded-xl border transition-all ${
                sort 
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' 
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
              }`}
              title="Sort results ascending"
            >
              Sort A-Z
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={generate}
          disabled={isRolling}
          className="flex-1 relative overflow-hidden flex items-center justify-center gap-2 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-bold transition-all shadow-xl shadow-purple-900/30 disabled:opacity-50"
        >
          <AnimatePresence mode="wait">
            {isRolling ? (
              <motion.div
                key="rolling"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div key="static" className="flex items-center gap-2">
                <Dice5 className="w-5 h-5" />
                Generate Random
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {results.length > 0 && (
          <>
            <button
              onClick={handleCopy}
              className="px-6 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all"
              title="Copy all results"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </button>
            <button
              onClick={clearResults}
              className="px-6 flex items-center justify-center bg-white/5 hover:bg-red-500/10 text-white hover:text-red-400 rounded-2xl border border-white/10 hover:border-red-500/30 transition-all"
              title="Clear results"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      <div className="min-h-[200px] p-8 bg-black/40 border border-white/10 rounded-3xl flex flex-wrap gap-4 items-center justify-center content-center relative overflow-hidden">
        <AnimatePresence>
          {results.length > 0 ? (
            results.map((num, i) => (
              <motion.div
                key={`${num}-${i}`}
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: i * 0.05 
                }}
                className="min-w-[4rem] h-16 flex items-center justify-center px-4 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-2xl text-2xl font-bold text-white shadow-lg backdrop-blur-sm"
              >
                {num}
              </motion.div>
            ))
          ) : (
            <div className="text-white/20 flex flex-col items-center gap-4">
              <Dice5 className="w-12 h-12 opacity-50" />
              <p className="font-medium">No numbers generated yet</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
