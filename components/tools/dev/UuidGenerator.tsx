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
      toast(`${count} IDs generated`, "success");
    }, 400);
  }, [count, prefix, uppercase, toast]);

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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Prefix</label>
                  <input 
                    type="text" value={prefix} onChange={e => setPrefix(e.target.value)}
                    placeholder="e.g. user_"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-accent-purple/50 transition-colors"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={() => setUppercase(!uppercase)}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-[10px] font-bold uppercase transition-all",
                      uppercase ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/50" : "bg-white/5 text-white/40 border border-white/10"
                    )}
                  >
                    <Hash size={12} />
                    Uppercase
                  </button>
                </div>
              </div>

              <button 
                onClick={generate}
                disabled={isGenerating}
                className="w-full h-14 bg-gradient-to-r from-accent-purple to-accent-blue rounded-2xl text-sm font-bold flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-accent-purple/20"
              >
                {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles size={18} />}
                Generate UUIDs
              </button>
            </div>
          </motion.div>

          <div className="bg-gradient-to-br from-accent-purple/10 to-transparent border border-white/5 rounded-[32px] p-6">
            <h4 className="text-xs font-bold text-white/60 mb-2 flex items-center gap-2">
              <Terminal size={14} className="text-accent-purple" />
              What is UUID v4?
            </h4>
            <p className="text-[10px] text-white/40 leading-relaxed">
              A Version 4 UUID is a universally unique identifier that is generated using random numbers. 
              The probability of a duplicate is effectively zero.
            </p>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0B14] border border-white/10 rounded-[32px] overflow-hidden flex flex-col h-[600px]"
          >
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-blue/10 text-accent-blue">
                  <Database size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Generated IDs</h3>
                  <p className="text-[10px] text-white/40">RFC 4122 Compliant</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={copyAll}
                  disabled={uuids.length === 0}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase text-white/60 transition-all flex items-center gap-2"
                >
                  <Copy size={14} />
                  Copy All
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
              <AnimatePresence mode="popLayout">
                {uuids.length > 0 ? (
                  uuids.map((uuid, i) => (
                    <motion.div
                      key={uuid + i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-accent-purple/30 rounded-2xl transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono text-white/20 w-6">{(i + 1).toString().padStart(2, '0')}</span>
                        <code className="text-sm font-mono text-white/80 group-hover:text-accent-purple transition-colors">{uuid}</code>
                      </div>
                      <button 
                        onClick={() => handleCopy(uuid)}
                        className="p-2 text-white/20 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                      >
                        <Copy size={16} />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-white/20 space-y-4">
                    <div className="p-6 rounded-full bg-white/5 border border-white/5">
                      <Fingerprint size={48} className="opacity-20" />
                    </div>
                    <p className="text-sm font-medium">Click generate to start</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
