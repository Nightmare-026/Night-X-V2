'use client';

import React, { useState } from 'react';
import { Lock, Unlock, Key, Copy, Check, RotateCcw, ShieldCheck, AlertCircle, EyeOff, Eye } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { motion, AnimatePresence } from 'framer-motion';

const TextObfuscator = () => {
  const [mode, setMode] = useState<'obfuscate' | 'deobfuscate'>('obfuscate');
  const [inputText, setInputText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!inputText || !secretKey) {
      setError('Please provide both text and a secret key.');
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
      setError('Processing failed. Please check your secret key and input data.');
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
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Mode Selector */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-full max-w-sm mx-auto">
        <button
          onClick={() => setMode('obfuscate')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
            mode === 'obfuscate' ? 'bg-accent-purple text-white shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <EyeOff size={18} />
          Obfuscate
        </button>
        <button
          onClick={() => setMode('deobfuscate')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
            mode === 'deobfuscate' ? 'bg-accent-cyan text-white shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <Eye size={18} />
          De-obfuscate
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Input Controls */}
        <div className="glass-card border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
          <div>
            <label className="block text-sm text-white/40 mb-2 font-medium uppercase tracking-wider font-syne">Security Key</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your security protocol key..."
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-accent-purple/50 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/40 mb-2 font-medium uppercase tracking-wider font-syne">
              {mode === 'obfuscate' ? 'Plaintext to Secure' : 'Obfuscated Protocol Data'}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={mode === 'obfuscate' ? 'Enter text to be secured...' : 'Paste the obfuscated string here...'}
              className="w-full h-32 bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-accent-purple/50 transition-all resize-none font-mono text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleProcess}
              className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                mode === 'obfuscate' 
                  ? 'bg-gradient-to-r from-accent-purple to-purple-600 text-white shadow-lg shadow-accent-purple/20 hover:shadow-accent-purple/40' 
                  : 'bg-gradient-to-r from-accent-cyan to-cyan-600 text-white shadow-lg shadow-accent-cyan/20 hover:shadow-accent-cyan/40'
              }`}
            >
              {mode === 'obfuscate' ? <Lock size={20} /> : <Unlock size={20} />}
              {mode === 'obfuscate' ? 'Secure Protocol' : 'Reveal Protocol'}
            </button>
            <button
              onClick={handleReset}
              className="p-4 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all"
              title="Reset"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Result Area */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-3 text-red-400"
            >
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          ) : result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="glass-card border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-white/40 uppercase tracking-wider font-bold font-syne">Processed Output</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors bg-white/5 px-3 py-2 rounded-lg border border-white/10"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy Result'}
                </button>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-sm break-all text-white/90 leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
                {result}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-accent-purple/60 bg-accent-purple/5 p-2 rounded-lg border border-accent-purple/10">
                <ShieldCheck size={14} />
                Local browser processing secured by Night X Protocol.
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="glass-card border border-white/10 rounded-2xl p-6">
        <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2 font-syne">
          <ShieldCheck size={18} className="text-accent-purple" />
          Security Architecture
        </h4>
        <div className="space-y-4 text-sm text-white/60 leading-relaxed font-dm-sans">
          <p>
            This tool implements <strong>AES-256 Protocol</strong> to obfuscate data locally within your environment.
          </p>
          <ul className="list-disc list-inside space-y-1 marker:text-accent-purple">
            <li>Sovereign Processing: No data is transmitted to external servers.</li>
            <li>Zero-Knowledge: Your security keys are never cached or logged.</li>
            <li>Ephemeral State: Data exists only in local memory during the session.</li>
          </ul>
          <p className="text-xs text-white/30 italic bg-white/5 p-3 rounded-xl border border-white/10">
            Disclaimer: Night X does not store recovery keys. If the protocol key is lost, data recovery is mathematically impossible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextObfuscator;
