'use client';
import { cn } from '@/lib/utils';

import React, { useState } from 'react';
import { Lock, Unlock, Key, Copy, Check, RotateCcw, ShieldCheck, AlertCircle, EyeOff, Eye } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { motion, AnimatePresence } from 'framer-motion';

export default function TextObfuscator() {
  const [mode, setMode] = useState<'obfuscate' | 'deobfuscate'>('obfuscate');
  const [inputText, setInputText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!inputText || !secretKey) {
      setError('Key and Input required for protocol.');
      return;
    }

    try {
      setError('');
      if (mode === 'obfuscate') {
        const encrypted = CryptoJS.AES.encrypt(inputText, secretKey).toString();
        setResult(encrypted);
      } else {
        const bytes = CryptoJS.AES.decrypt(inputText, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) throw new Error('Invalid key or corrupted data');
        setResult(decrypted);
      }
    } catch (err) {
      setError('Cryptographic mismatch. Verify key integrity.');
      setResult('');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputText('');
    setSecretKey('');
    setResult('');
    setError('');
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Protocol Parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="text-emerald-400" size={16} />
                <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Protocol Parameters</h3>
              </div>
              <button
                onClick={handleReset}
                className="text-[10px] font-bold text-white/20 hover:text-red-400 uppercase tracking-widest transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Mode Switch */}
            <div className="flex bg-black/40 p-1 rounded-md border border-white/[0.05]">
              <button
                onClick={() => setMode('obfuscate')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                  mode === 'obfuscate' ? "bg-emerald-400 text-black" : "text-white/40 hover:text-white"
                )}
              >
                Obfuscate
              </button>
              <button
                onClick={() => setMode('deobfuscate')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                  mode === 'deobfuscate' ? "bg-emerald-400 text-black" : "text-white/40 hover:text-white"
                )}
              >
                De-obfuscate
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Security Key</label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={14} />
                  <input
                    type="password"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder="Enter cryptographic key..."
                    className="w-full bg-black/40 border border-white/[0.05] rounded-md pl-11 pr-4 py-4 text-sm font-mono focus:outline-none focus:border-emerald-400/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">
                  {mode === 'obfuscate' ? 'Plaintext Input' : 'Cyphertext Input'}
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={mode === 'obfuscate' ? 'Enter string to secure...' : 'Paste obfuscated data...'}
                  className="w-full h-40 bg-black/40 border border-white/[0.05] rounded-md px-6 py-5 text-sm font-mono focus:outline-none focus:border-emerald-400/50 transition-all resize-none"
                />
              </div>

              <button
                onClick={handleProcess}
                className="w-full py-5 bg-emerald-400 hover:bg-emerald-500 text-black rounded-md font-bold text-[10px] uppercase tracking-[0.2em] transition-all active:scale-[0.98]"
              >
                Execute Protocol
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Output & Architecture */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden min-h-[500px] flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full flex-1">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase mb-2">Cryptographic Stream</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Protocol Output</h2>
                </div>
                {result && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/[0.05] transition-all"
                  >
                    {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/40" />}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{copied ? 'Copied' : 'Export'}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-8">
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-6 bg-red-500/5 border border-red-500/10 rounded-md flex items-center gap-4 text-red-400"
                    >
                      <AlertCircle size={20} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">{error}</p>
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-6"
                    >
                      <div className="bg-black/60 rounded-md p-8 border border-white/[0.05] font-mono text-sm break-all text-white/80 leading-relaxed min-h-[200px]">
                        {result}
                      </div>
                      <div className="p-4 bg-emerald-400/5 border border-emerald-400/10 rounded-md flex items-center gap-3">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        <span className="text-[10px] font-bold text-emerald-400/60 uppercase tracking-widest">AES-256 Symmetric Seal Applied</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 opacity-10 space-y-4">
                      <Unlock size={48} strokeWidth={1} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Registry Awaiting Feed</p>
                    </div>
                  )}
                </AnimatePresence>

                <div className="pt-8 border-t border-white/[0.05] space-y-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Security Architecture</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Sovereign Encryption</p>
                      <p className="text-[10px] text-white/30 leading-relaxed font-inter uppercase">
                        All operations are isolated within the browser instance. No plaintext ever leaves local memory.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Protocol Disclaimer</p>
                      <p className="text-[10px] text-white/30 leading-relaxed font-inter uppercase italic">
                        Lost keys render data mathematically unrecoverable. Night X does not store protocol credentials.
                      </p>
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

