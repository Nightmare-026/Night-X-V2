'use client';
import { cn } from '@/lib/utils';

import React, { useState, useEffect } from 'react';
import { Type, ArrowLeftRight, Copy, Check, RotateCcw, AlertCircle, FileText, Download , Zap} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Base64Codec = () => {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [realtime, setRealtime] = useState(true);

  const process = (val: string, currentMode: 'encode' | 'decode') => {
    if (!val) {
      setOutput('');
      setError('');
      return;
    }

    try {
      setError('');
      if (currentMode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(val))));
      } else {
        setOutput(decodeURIComponent(escape(atob(val))));
      }
    } catch (err) {
      setError('Invalid character sequence for decryption.');
      setOutput('');
    }
  };

  useEffect(() => {
    if (realtime) {
      process(input, mode);
    }
  }, [input, mode, realtime]);

  const handleModeToggle = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    if (output && !error) {
      setInput(output);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base64-${mode === 'encode' ? 'encoded' : 'decoded'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Interface */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md overflow-hidden">
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-emerald-400/10 text-emerald-400">
                    <Type size={16} />
                  </div>
                  <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Input Stream</h3>
                </div>
                <div className="flex bg-black/40 p-1 rounded-md border border-white/[0.05]">
                  <button
                    onClick={() => setMode('encode')}
                    className={cn(
                      "px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all",
                      mode === 'encode' ? "bg-emerald-400 text-black shadow-lg" : "text-white/20 hover:text-white/40"
                    )}
                  >
                    Encrypt
                  </button>
                  <button
                    onClick={() => setMode('decode')}
                    className={cn(
                      "px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest transition-all",
                      mode === 'decode' ? "bg-emerald-400 text-black shadow-lg" : "text-white/20 hover:text-white/40"
                    )}
                  >
                    Decrypt
                  </button>
                </div>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'encode' ? 'Paste plaintext payload...' : 'Paste Base64 ciphertext...'}
                className="w-full h-48 bg-black/20 border border-white/[0.05] rounded-md p-6 focus:outline-none focus:border-emerald-400/50 transition-all resize-none font-mono text-sm leading-relaxed text-white/80"
              />
            </div>

            <div className="h-px bg-white/[0.05]" />

            <div className="p-8 space-y-6 bg-black/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-emerald-400/10 text-emerald-400">
                    <FileText size={16} />
                  </div>
                  <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Compiled Output</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownload}
                    disabled={!output || !!error}
                    className="p-2.5 bg-white/[0.02] border border-white/[0.05] text-white/20 hover:text-emerald-400 rounded-md transition-all disabled:opacity-0"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={handleCopy}
                    disabled={!output || !!error}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-400 text-black rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-300 transition-all disabled:opacity-0"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Execute Copy'}
                  </button>
                </div>
              </div>

              <div className="relative min-h-[200px]">
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-red-500/5 border border-red-500/10 rounded-md p-8 flex flex-col items-center justify-center text-center gap-3"
                    >
                      <AlertCircle size={24} className="text-red-400" />
                      <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest">{error}</p>
                    </motion.div>
                  ) : (
                    <div className="w-full h-full min-h-[200px] bg-[#080808] border border-white/[0.05] rounded-md p-6 font-mono text-sm leading-relaxed text-white break-all overflow-y-auto custom-scrollbar">
                      {output || (
                        <span className="text-white/5 lowercase tracking-normal italic">
                          awaiting stream input...
                        </span>
                      )}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center gap-3">
              <RotateCcw className="text-emerald-400" size={16} />
              <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Protocol Engine</h3>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setRealtime(!realtime)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-md border transition-all w-full",
                  realtime 
                    ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" 
                    : "bg-white/[0.01] border-white/[0.05] text-white/20 hover:text-white/40 hover:border-white/10"
                )}
              >
                <div className="flex items-center gap-3">
                  <RotateCcw size={14} className={realtime ? "text-emerald-400" : "text-white/10"} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Real-time Sync</span>
                </div>
                <div className={cn(
                  "w-6 h-3 rounded-full relative transition-colors",
                  realtime ? "bg-emerald-400" : "bg-white/10"
                )}>
                  <div className={cn(
                    "absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all",
                    realtime ? "left-3.5" : "left-0.5"
                  )} />
                </div>
              </button>

              <button
                onClick={() => { setInput(''); setOutput(''); setError(''); }}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white/[0.02] border border-white/[0.05] text-white/40 hover:text-white rounded-md font-bold text-[10px] uppercase tracking-widest transition-all"
              >
                <RotateCcw size={14} />
                Flush Registry
              </button>
            </div>
          </div>

          <div className="bg-emerald-400/5 border border-emerald-400/10 rounded-md p-6 space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <Zap size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Codec Intelligence</span>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Standard</p>
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">UTF-8 Compliant</p>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                Our synthesis engine handles complex Unicode sequences and emojis with zero data loss.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Base64Codec;
