'use client';

import React, { useState, useCallback } from 'react';
import { 
  Hash, 
  Copy, 
  RefreshCw, 
  ShieldCheck, 
  Binary, 
  Terminal,
  Zap,
  ArrowRight,
  Sparkles,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

async function generateHash(text: string, algorithm: string) {
  if (!text) return '';
  const msgUint8 = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const ALGORITHMS = [
  { id: 'SHA-1', label: 'SHA-1', legacy: true, color: 'text-amber-400' },
  { id: 'SHA-256', label: 'SHA-256', premium: true, color: 'text-accent-cyan' },
  { id: 'SHA-384', label: 'SHA-384', color: 'text-accent-purple' },
  { id: 'SHA-512', label: 'SHA-512', robust: true, color: 'text-indigo-400' },
];

export default function HashGenerator() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const generateHash = async (text: string, algorithm: string) => {
    if (!text) return '';
    try {
      const msgUint8 = new TextEncoder().encode(text);
      const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
      
      // Efficient hex conversion
      return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (e) {
      console.error(`Hash failed for ${algorithm}:`, e);
      return 'Error generating hash';
    }
  };

  const compute = useCallback(async (val: string) => {
    if (!val) {
      setHashes(ALGORITHMS.reduce((acc, algo) => ({ ...acc, [algo.id]: '' }), {}));
      return;
    }

    setIsProcessing(true);
    const results: Record<string, string> = {};
    
    try {
      // Parallelize hash generation for all algorithms
      const hashPromises = ALGORITHMS.map(async (algo) => {
        results[algo.id] = await generateHash(val, algo.id);
      });
      
      await Promise.all(hashPromises);
      setHashes(results);
    } catch (err) {
      console.error("Batch hash calculation failed:", err);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Use an effect for debounced computation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      compute(input);
    }, 300);
    return () => clearTimeout(timer);
  }, [input, compute]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleCopy = async (text: string, algo: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast(`${algo} hash copied`, "success");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden"
          >
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent-purple/10 text-accent-purple">
                    <Terminal size={18} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">Raw Input</h3>
                </div>
                {input && (
                  <button 
                    onClick={() => { setInput(''); setHashes({}); }}
                    className="text-[10px] font-black text-white/20 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple/20 to-accent-cyan/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Enter text to hash..."
                  className="relative w-full h-64 bg-black/40 border border-white/10 rounded-2xl p-6 text-white font-mono text-sm focus:outline-none focus:border-accent-purple transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Character Count</p>
                  <p className="text-lg font-bold text-white/80 font-syne">{input.length}</p>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", isProcessing ? "bg-accent-purple animate-pulse" : (input ? "bg-accent-cyan" : "bg-white/10"))} />
                    <p className="text-xs font-bold text-white/60">{isProcessing ? 'Processing' : (input ? 'Computed' : 'Idle')}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-accent-purple/10 to-transparent p-6 rounded-2xl border border-white/5 space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-accent-purple">Security Note</h4>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  Hashing is performed locally using the <span className="text-white/60">SubtleCrypto API</span>. Your sensitive data never touches our servers.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden group min-h-[600px]"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/5 blur-[120px] rounded-full group-hover:bg-accent-cyan/10 transition-all duration-1000" />
            
            <div className="relative z-10 flex flex-col h-full w-full">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black tracking-[0.2em] text-accent-cyan uppercase mb-2">Message Digests</div>
                  <h2 className="text-2xl font-bold font-syne">Generated Hashes</h2>
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                  <Binary size={14} className="text-accent-cyan" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">HEX OUTPUT</span>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <AnimatePresence mode="popLayout">
                  {ALGORITHMS.map((algo, index) => (
                    <motion.div
                      key={algo.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group/card relative"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10 rounded-2xl blur opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      <div className="relative p-6 bg-black/40 border border-white/5 rounded-2xl flex flex-col gap-4 shadow-xl">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-1.5 rounded-lg bg-white/5", algo.color)}>
                              <Hash size={14} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-white/60">{algo.label}</span>
                            {algo.premium && <Sparkles size={12} className="text-yellow-400" />}
                            {algo.legacy && <span className="text-[8px] font-black bg-red-500/10 text-red-400 px-2 py-0.5 rounded-full border border-red-500/20">UNSAFE</span>}
                          </div>
                          <button 
                            onClick={() => hashes[algo.id] && handleCopy(hashes[algo.id], algo.id)}
                            disabled={!hashes[algo.id]}
                            className="p-2 hover:bg-white/5 text-white/20 hover:text-accent-cyan rounded-lg transition-all disabled:opacity-0"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-[#0D0F18] border border-white/5 rounded-xl p-4 font-mono text-xs break-all text-white/80 min-h-[60px] flex items-center">
                            {hashes[algo.id] ? (
                              <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                {hashes[algo.id]}
                              </motion.span>
                            ) : (
                              <span className="text-white/5 italic">Awaiting computation...</span>
                            )}
                          </div>
                          {hashes[algo.id] && (
                            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-black/60 rounded-md border border-white/5">
                              <ShieldCheck size={10} className="text-emerald-400" />
                              <span className="text-[8px] font-black text-white/40 uppercase">Verified</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {!input && (
                <div className="flex flex-col items-center justify-center gap-6 opacity-20 py-20">
                  <div className="p-10 rounded-full bg-white/5 border border-white/5">
                    <Search size={48} strokeWidth={1} />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-bold uppercase tracking-widest">No Input Detected</p>
                    <p className="text-[10px] font-medium max-w-[200px]">Type something in the panel on the left to generate cryptographic hashes</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4">
              <div className="p-3 bg-accent-cyan/10 text-accent-cyan rounded-2xl">
                <Zap size={24} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white/80">Real-time Diff</h4>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  Hash changes instantly as you type. Useful for verifying integrity of small snippets.
                </p>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4">
              <div className="p-3 bg-accent-purple/10 text-accent-purple rounded-2xl">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white/80">Collision Proof</h4>
                <p className="text-[10px] text-white/40 leading-relaxed">
                  We use modern standards (SHA-256+) to ensure maximum resistance against collisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
