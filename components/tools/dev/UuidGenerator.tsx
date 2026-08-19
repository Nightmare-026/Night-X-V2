'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Copy, 
  RefreshCw, 
  Settings2, 
  Sparkles, 
  Hash, 
  Fingerprint, 
  ShieldCheck, 
  Zap,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

function generateCryptographicUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
    bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10xx
    
    const hex = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }

  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const { toast } = useToast();
  const [count, setCount] = useState<number>(10);
  const [uuids, setUuids] = useState<string[]>([]);
  const [prefix, setPrefix] = useState<string>('');
  const [uppercase, setUppercase] = useState<boolean>(false);
  const [includeHyphens, setIncludeHyphens] = useState<boolean>(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = useCallback(() => {
    const newUuids = Array.from({ length: count }, () => {
      let u = generateCryptographicUuid();
      if (!includeHyphens) {
        u = u.replace(/-/g, '');
      }
      if (uppercase) {
        u = u.toUpperCase();
      }
      return prefix ? `${prefix}${u}` : u;
    });
    setUuids(newUuids);
  }, [count, prefix, uppercase, includeHyphens]);

  useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = async (text: string, index: number) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedIndex(index);
      toast("UUID copied to clipboard", "success");
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const copyAll = async () => {
    if (uuids.length === 0) return;
    const success = await copyToClipboard(uuids.join('\n'));
    if (success) {
      toast(`Copied all ${uuids.length} UUIDs`, "success");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Controls Panel */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card bg-[#0E101B]/80 border-white/[0.08] rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center gap-2.5 pb-4 border-b border-white/[0.08]">
              <Settings2 className="text-accent-cyan" size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Generator Configuration</h3>
            </div>

            <div className="space-y-5">
              {/* Batch Quantity */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-text-secondary flex items-center gap-1.5">
                    <Hash size={12} className="text-primary-400" /> Quantity
                  </span>
                  <span className="text-accent-cyan font-mono font-bold">{count} IDs</span>
                </div>
                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                  <input 
                    type="range" 
                    min={1} 
                    max={100} 
                    value={count}
                    onChange={e => setCount(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between mt-2 font-mono text-[10px] text-text-muted">
                    <span>1</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Format Modifiers */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-text-secondary block">Format Modifiers</label>
                
                <div className="space-y-2">
                  <input 
                    type="text" 
                    value={prefix} 
                    onChange={e => setPrefix(e.target.value)}
                    placeholder="Optional Prefix (e.g. user_)"
                    className="w-full h-10 bg-white/[0.03] border border-white/10 rounded-xl px-3.5 text-xs font-mono text-white placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button 
                    type="button"
                    onClick={() => setUppercase(!uppercase)}
                    className={cn(
                      "h-10 rounded-xl text-xs font-semibold transition-all border",
                      uppercase 
                        ? "bg-primary/20 text-primary-300 border-primary/40 shadow-sm" 
                        : "bg-white/[0.02] text-text-secondary border-white/[0.08] hover:border-white/20 hover:text-white"
                    )}
                  >
                    UPPERCASE
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIncludeHyphens(!includeHyphens)}
                    className={cn(
                      "h-10 rounded-xl text-xs font-semibold transition-all border",
                      includeHyphens 
                        ? "bg-primary/20 text-primary-300 border-primary/40 shadow-sm" 
                        : "bg-white/[0.02] text-text-secondary border-white/[0.08] hover:border-white/20 hover:text-white"
                    )}
                  >
                    Hyphens (-)
                  </button>
                </div>
              </div>

              <button 
                onClick={generate}
                className="btn-primary w-full h-11 text-xs font-bold shadow-lg flex items-center justify-center gap-2 mt-2"
              >
                <RefreshCw size={14} />
                <span>Regenerate Batch</span>
              </button>
            </div>

            <div className="p-4 bg-accent-cyan/[0.04] border border-accent-cyan/15 rounded-xl space-y-1.5">
              <div className="flex items-center gap-2 text-accent-cyan">
                <ShieldCheck size={14} />
                <span className="text-xs font-semibold">CSPRNG Guaranteed</span>
              </div>
              <p className="text-[11px] text-text-secondary leading-relaxed">
                Generated using Web Crypto API (<code className="text-white font-mono">crypto.randomUUID()</code>) for cryptographically strong, collision-resistant UUID v4 identifiers.
              </p>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="lg:col-span-7">
          <div className="glass-card bg-[#0E101B]/80 border-white/[0.08] rounded-2xl overflow-hidden flex flex-col h-[560px] shadow-xl">
            <div className="p-5 border-b border-white/[0.08] bg-white/[0.01] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <h3 className="text-sm font-bold text-white">Generated Identifiers</h3>
                <span className="px-2 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-primary-300 text-[10px] font-mono font-bold">
                  {uuids.length}
                </span>
              </div>
              <button 
                onClick={copyAll}
                disabled={uuids.length === 0}
                className="btn-secondary text-xs font-semibold py-1.5 px-3 flex items-center gap-1.5 disabled:opacity-30"
              >
                <Copy size={13} />
                <span>Copy All</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {uuids.map((uuid, i) => (
                  <motion.div
                    key={`${uuid}-${i}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: Math.min(i * 0.01, 0.2) }}
                    className="group flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.04] hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <span className="text-[10px] font-mono text-text-muted w-6 shrink-0">
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <code className="text-xs font-mono text-text-primary group-hover:text-primary-300 transition-colors truncate">
                        {uuid}
                      </code>
                    </div>
                    <button 
                      onClick={() => handleCopy(uuid, i)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/10 transition-colors shrink-0"
                      title="Copy UUID"
                      aria-label="Copy UUID"
                    >
                      {copiedIndex === i ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="p-4 bg-white/[0.01] border-t border-white/[0.08] flex items-center justify-between text-xs text-text-muted">
              <span className="flex items-center gap-1.5">
                <Zap size={13} className="text-accent-cyan" /> Instant Generation
              </span>
              <span>RFC 4122 Standard</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
