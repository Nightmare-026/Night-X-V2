'use client';
import { cn } from '@/lib/utils';

import React, { useState, useEffect } from 'react';
import { Link, ExternalLink, Copy, Check, RotateCcw, AlertCircle, ArrowLeftRight , ShieldCheck} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UrlEncoder() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const process = (val: string, currentMode: 'encode' | 'decode') => {
    if (!val) {
      setOutput('');
      setError('');
      return;
    }

    try {
      setError('');
      if (currentMode === 'encode') {
        setOutput(encodeURIComponent(val));
      } else {
        setOutput(decodeURIComponent(val));
      }
    } catch (err) {
      setError('Invalid percent-encoded payload.');
      setOutput('');
    }
  };

  useEffect(() => {
    process(input, mode);
  }, [input, mode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpen = () => {
    try {
      const url = output.startsWith('http') ? output : `https://${output}`;
      window.open(url, '_blank');
    } catch (e) {
      setError('Cannot resolve valid URL target.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Protocol Control */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Link className="text-emerald-400" size={16} />
              <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Protocol Control</h3>
            </div>

            {/* Mode Switch */}
            <div className="flex bg-black/40 p-1 rounded-md border border-white/[0.05]">
              <button
                onClick={() => setMode('encode')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                  mode === 'encode' ? "bg-emerald-400 text-black" : "text-white/40 hover:text-white"
                )}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                  mode === 'decode' ? "bg-emerald-400 text-black" : "text-white/40 hover:text-white"
                )}
              >
                Decode
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Source Payload</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? 'Paste URL or text...' : 'Paste percent-encoded string...'}
                className="w-full h-48 bg-black/40 border border-white/[0.05] rounded-md px-6 py-5 text-sm font-mono focus:outline-none focus:border-emerald-400/50 transition-all resize-none"
              />
            </div>

            <div className="p-6 bg-emerald-400/5 border border-emerald-400/10 rounded-md space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <ArrowLeftRight size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Protocol Intelligence</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                Ensures cross-platform character compatibility via hexadecimal URI mapping.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Result Viewport */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden min-h-[500px] flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full flex-1">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase mb-2">Transcoded Output</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Processed Payload</h2>
                </div>
                {output && !error && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleOpen}
                      className="p-2 text-white/40 hover:text-emerald-400 transition-colors"
                      title="Open as Link"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/[0.05] transition-all"
                    >
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/40" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{copied ? 'Copied' : 'Export'}</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-8">
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-red-500/5 border border-red-500/10 rounded-md flex items-center gap-4 text-red-400"
                    >
                      <AlertCircle size={20} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">{error}</p>
                    </motion.div>
                  ) : (
                    <div className="w-full h-48 bg-black/60 border border-white/[0.05] rounded-md p-6 font-mono text-sm break-all overflow-y-auto text-white/80 scrollbar-hide">
                      {output || <span className="text-white/10 italic">Awaiting Protocol Feed...</span>}
                    </div>
                  )}
                </AnimatePresence>

                <div className="pt-8 border-t border-white/[0.05] space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Architecture Note</h4>
                  <div className="space-y-4">
                    <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                      Percent encoding replaces special characters (like ?, &, =) with % followed by their hexadecimal value. This ensures URLs are transmitted without structural misinterpretation.
                    </p>
                    <div className="flex items-center gap-3 p-4 bg-emerald-400/5 rounded-md border border-emerald-400/10">
                      <ShieldCheck size={14} className="text-emerald-400/40" />
                      <p className="text-[10px] text-emerald-400/40 font-bold uppercase tracking-widest">Sovereign browser-level encoding active.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

