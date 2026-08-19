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
  Search,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

const ALGORITHMS = [
  { id: 'SHA-1', label: 'SHA-1', legacy: true, color: 'text-accent-amber' },
  { id: 'SHA-256', label: 'SHA-256', premium: true, color: 'text-primary-400' },
  { id: 'SHA-384', label: 'SHA-384', color: 'text-accent-cyan' },
  { id: 'SHA-512', label: 'SHA-512', robust: true, color: 'text-emerald-400' },
];

export default function HashGenerator() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedAlgo, setCopiedAlgo] = useState<string | null>(null);

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
    }, 200);
    return () => clearTimeout(timer);
  }, [input, compute]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleCopy = async (text: string, algo: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedAlgo(algo);
      toast(`${algo} hash copied to clipboard`, "success");
      setTimeout(() => setCopiedAlgo(null), 1500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 space-y-4 shadow-[var(--shadow-raised-sm)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="text-primary-400" size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Source Payload</h3>
              </div>
              {input && (
                <button 
                  onClick={() => { setInput(''); setHashes({}); }}
                  className="text-[10px] font-bold text-text-muted hover:text-red-400 uppercase tracking-wider transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Type or paste text payload here to calculate hashes in real-time..."
                className="w-full h-56 bg-surface-inset border border-white/10 rounded-xl p-4 text-white font-mono text-xs focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 shadow-[var(--shadow-inset-sm)] transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface-inset rounded-xl border border-white/[0.06] space-y-0.5">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Payload Size</p>
                <p className="text-sm font-bold text-white font-mono">{input.length} Bytes</p>
              </div>
              <div className="p-3 bg-surface-inset rounded-xl border border-white/[0.06] space-y-0.5">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Digest Status</p>
                <div className="flex items-center gap-1.5 pt-0.5">
                  <div className={cn("w-2 h-2 rounded-full", isProcessing ? "bg-primary animate-pulse" : (input ? "bg-primary" : "bg-white/20"))} />
                  <p className="text-xs font-semibold text-text-secondary">{isProcessing ? 'Hashing...' : (input ? 'Computed' : 'Awaiting Input')}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
              <div className="flex items-center gap-2 mb-1 text-primary-400">
                <ShieldCheck size={14} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Zero Transmission Guarantee</span>
              </div>
              <p className="text-[11px] text-text-tertiary leading-relaxed">
                All hashing digests execute in-memory via the browser SubtleCrypto API.
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 space-y-4 shadow-[var(--shadow-raised-sm)] min-h-[480px] flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-primary-400 uppercase block">Digest Stream</span>
                <h2 className="text-base font-bold text-white">Cryptographic Hashes</h2>
              </div>
              <div className="flex items-center gap-1.5 bg-surface-inset px-3 py-1 rounded-lg border border-white/[0.06]">
                <Binary size={13} className="text-primary-400" />
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Hex Output</span>
              </div>
            </div>

            <div className="space-y-3 flex-1">
              {ALGORITHMS.map((algo, index) => (
                <div key={algo.id} className="p-4 rounded-xl bg-surface-inset border border-white/[0.06] space-y-2 hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("p-1 rounded-md bg-surface-card border border-white/10", algo.color)}>
                        <Hash size={12} />
                      </div>
                      <span className="text-xs font-bold text-white">{algo.label}</span>
                      {algo.premium && <span className="text-[9px] font-bold bg-primary/10 text-primary-400 px-1.5 py-0.2 rounded border border-primary/20">Standard</span>}
                      {algo.legacy && <span className="text-[9px] font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/20">Legacy</span>}
                    </div>

                    <button 
                      onClick={() => hashes[algo.id] && handleCopy(hashes[algo.id], algo.id)}
                      disabled={!hashes[algo.id]}
                      className="p-1.5 hover:bg-surface-card text-text-muted hover:text-white rounded-lg transition-all disabled:opacity-30 flex items-center gap-1 text-xs"
                      aria-label={`Copy ${algo.label}`}
                    >
                      {copiedAlgo === algo.id ? <Check size={13} className="text-primary-400" /> : <Copy size={13} />}
                      <span className="text-[11px] font-semibold">{copiedAlgo === algo.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <div className="p-3 bg-surface-card border border-white/[0.06] rounded-lg font-mono text-xs break-all text-text-primary min-h-[42px] flex items-center shadow-[var(--shadow-inset-sm)]">
                    {hashes[algo.id] || (
                      <span className="text-text-muted text-[11px] italic">Awaiting source payload...</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
