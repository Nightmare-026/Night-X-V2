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
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="text-emerald-400" size={16} />
                <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Source Payload</h3>
              </div>
              {input && (
                <button 
                  onClick={() => { setInput(''); setHashes({}); }}
                  className="text-[10px] font-bold text-white/20 hover:text-red-400 uppercase tracking-widest transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="relative group">
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Paste payload here..."
                className="w-full h-64 bg-black/40 border border-white/[0.05] rounded-md p-6 text-white font-mono text-sm focus:outline-none focus:border-emerald-400/50 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/[0.02] rounded-md border border-white/[0.05] space-y-1">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Payload Size</p>
                <p className="text-lg font-outfit font-bold text-white/80 tracking-widest">{input.length} B</p>
              </div>
              <div className="p-4 bg-white/[0.02] rounded-md border border-white/[0.05] space-y-1">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Compiler</p>
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", isProcessing ? "bg-emerald-400 animate-pulse" : (input ? "bg-emerald-400" : "bg-white/10"))} />
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{isProcessing ? 'Active' : (input ? 'Stable' : 'Idle')}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-emerald-400/5 border border-emerald-400/10 rounded-md">
              <div className="flex items-center gap-3 mb-3 text-emerald-400">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Encryption Shield</span>
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-widest font-inter leading-relaxed">
                All hashing operations are executed in-situ via SubtleCrypto. No data transmission occurs.
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden min-h-[600px] flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full flex-1">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase mb-2">Digest Registry</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Cryptographic Hashes</h2>
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-md border border-white/[0.05]">
                  <Binary size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Hex Stream</span>
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
                      <div className="relative p-6 bg-black/40 border border-white/[0.05] rounded-md flex flex-col gap-4 transition-all group-hover/card:border-emerald-400/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-1.5 rounded-md bg-white/5", algo.color)}>
                              <Hash size={14} />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{algo.label}</span>
                            {algo.premium && <Sparkles size={12} className="text-yellow-400/50" />}
                            {algo.legacy && <span className="text-[8px] font-bold bg-red-500/10 text-red-400 px-2 py-0.5 rounded-sm border border-red-500/20 uppercase">Deprecated</span>}
                          </div>
                          <button 
                            onClick={() => hashes[algo.id] && handleCopy(hashes[algo.id], algo.id)}
                            disabled={!hashes[algo.id]}
                            className="p-2 hover:bg-white/5 text-white/20 hover:text-emerald-400 rounded-md transition-all disabled:opacity-0"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                        <div className="relative">
                          <div className="w-full bg-[#080808] border border-white/[0.05] rounded-md p-5 font-mono text-xs break-all text-white/80 min-h-[70px] flex items-center leading-relaxed tracking-wider">
                            {hashes[algo.id] ? (
                              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {hashes[algo.id]}
                              </motion.span>
                            ) : (
                              <span className="text-white/5 lowercase tracking-normal">awaiting payload...</span>
                            )}
                          </div>
                          {hashes[algo.id] && (
                            <div className="absolute bottom-2 right-2 flex items-center gap-1.5 px-2 py-1 bg-black/60 rounded-md border border-white/[0.05]">
                              <ShieldCheck size={10} className="text-emerald-400" />
                              <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Verified Integrity</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {!input && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-10 space-y-4 py-20">
                  <Search size={48} strokeWidth={1} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Registry Awaiting Feed</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-md flex items-center gap-4">
              <div className="p-3 bg-emerald-400/10 text-emerald-400 rounded-md">
                <Zap size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Instant Sync</h4>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-inter leading-relaxed mt-1">
                  Hashes re-calculate in real-time as input stream changes.
                </p>
              </div>
            </div>
            <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-md flex items-center gap-4">
              <div className="p-3 bg-emerald-400/10 text-emerald-400 rounded-md">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="text-[10px] font-bold text-white/80 uppercase tracking-widest">Standard Compliance</h4>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-inter leading-relaxed mt-1">
                  Supports SHA-1 through SHA-512 cryptographic standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
