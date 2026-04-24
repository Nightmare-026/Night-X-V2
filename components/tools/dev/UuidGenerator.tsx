'use client';

import React, { useState, useCallback } from 'react';
import { 
  Dna, 
  Copy, 
  RefreshCw, 
  Settings2, 
  Sparkles, 
  Terminal,
  Database,
  Search,
  Check,
  Hash,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

function generateUuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const { toast } = useToast();
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [uppercase, setUppercase] = useState(false);

  const generate = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const newUuids = Array.from({ length: count }, () => {
        let u = generateUuidV4();
        if (uppercase) u = u.toUpperCase();
        return prefix ? `${prefix}${u}` : u;
      });
      setUuids(newUuids);
      setIsGenerating(false);
      addToast(`${count} IDs generated`, "success");
    }, 400);
  }, [count, prefix, uppercase, addToast]);

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast("ID copied", "success");
    }
  };

  const copyAll = async () => {
    if (uuids.length === 0) return;
    const success = await copyToClipboard(uuids.join('\n'));
    if (success) {
      toast("All IDs copied to clipboard", "success");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Settings Panel */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-purple/10 text-accent-purple">
                <Settings2 size={18} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">Generator Settings</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase ml-1">
                  <span>Batch Size</span>
                  <span className="text-accent-purple">{count} IDs</span>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border border-white/10">
                  <input 
                    type="range" min={1} max={100} value={count}
                    onChange={e => setCount(Number(e.target.value))}
                    className="w-full accent-accent-purple"
                  />
                  <div className="flex justify-between mt-2 px-1 font-mono text-[8px] text-white/20">
                    <span>1</span>
                    <span>25</span>
                    <span>50</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Prefix (Optional)</label>
                  <input 
                    type="text" value={prefix} onChange={e => setPrefix(e.target.value)} 
                    placeholder="e.g. user_"
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-accent-purple" 
                  />
                </div>

                <button
                  onClick={() => setUppercase(!uppercase)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group",
                    uppercase ? "bg-accent-purple/10 border-accent-purple/30 text-white" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", uppercase ? "bg-accent-purple/20 text-accent-purple" : "bg-black/20")}>
                      <Fingerprint size={14} />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest">Uppercase Output</span>
                  </div>
                  <div className={cn("w-2 h-2 rounded-full", uppercase ? "bg-accent-purple shadow-[0_0_8px_rgba(168,85,247,0.5)]" : "bg-white/10")} />
                </button>
              </div>

              <button
                onClick={generate}
                disabled={isGenerating}
                className={cn(
                  "w-full flex items-center justify-center gap-3 py-4 bg-accent-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-purple/20",
                  isGenerating ? "opacity-50" : "hover:scale-[1.02] active:scale-[0.98] hover:bg-white hover:text-black"
                )}
              >
                {isGenerating ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    <Dna size={18} />
                    Generate IDs
                  </>
                )}
              </button>
            </div>

            <div className="bg-gradient-to-br from-accent-purple/10 to-transparent p-6 rounded-2xl border border-white/5 space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-accent-purple flex items-center gap-2">
                <Sparkles size={12} />
                RFC 4122 Compliant
              </h4>
              <p className="text-[11px] text-white/40 leading-relaxed">
                Generates Version 4 UUIDs using a cryptographically strong pseudo-random number generator.
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden group min-h-[600px] flex flex-col"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/5 blur-[120px] rounded-full group-hover:bg-accent-cyan/10 transition-all duration-1000" />
            
            <div className="relative z-10 flex flex-col h-full w-full flex-1">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black tracking-[0.2em] text-accent-cyan uppercase mb-2">Unique Identifiers</div>
                  <h2 className="text-2xl font-bold font-syne">Generated Output</h2>
                </div>
                {uuids.length > 0 && (
                  <button 
                    onClick={copyAll}
                    className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black text-accent-cyan uppercase tracking-widest hover:bg-accent-cyan hover:text-black transition-all"
                  >
                    <Copy size={14} />
                    Copy All
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-2 scrollbar-hide max-h-[500px]">
                <AnimatePresence mode="popLayout">
                  {uuids.length > 0 ? (
                    uuids.map((id, index) => (
                      <motion.div
                        key={id + index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="group/item relative"
                      >
                        <div className="p-4 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-between group-hover/item:border-accent-purple/30 transition-all">
                          <div className="flex items-center gap-4">
                            <span className="text-[10px] font-mono text-white/10 w-4">{index + 1}</span>
                            <span className="font-mono text-xs md:text-sm text-white/80 tracking-wider truncate max-w-[250px] md:max-w-md">{id}</span>
                          </div>
                          <button 
                            onClick={() => handleCopy(id)}
                            className="p-2 hover:bg-white/5 text-white/20 hover:text-accent-purple rounded-lg transition-all"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center gap-6 opacity-20 py-20">
                      <div className="p-10 rounded-full bg-white/5 border border-white/5">
                        <Terminal size={48} strokeWidth={1} />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-bold uppercase tracking-widest">No IDs Generated</p>
                        <p className="text-[10px] font-medium max-w-[200px]">Click the generate button to create unique identifiers for your project</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {isGenerating && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[40px]">
                <div className="w-12 h-12 border-4 border-accent-purple/20 border-t-accent-purple rounded-full animate-spin mb-4" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-white/70">Sequencing IDs...</span>
              </div>
            )}
          </motion.div>

          <div className="bg-gradient-to-br from-[#1A1C25] to-[#0D0F18] border border-white/10 p-8 rounded-[32px] flex items-center gap-6">
            <div className="p-4 bg-accent-cyan/10 text-accent-cyan rounded-2xl">
              <Database size={24} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white/80 uppercase tracking-widest">Universal Uniqueness</h4>
              <p className="text-[11px] text-white/40 leading-relaxed mt-1">
                The probability of a duplicate is approximately 1 in 2^128. These are safe to use as primary keys in distributed databases.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
