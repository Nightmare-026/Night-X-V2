'use client';

import React, { useState } from 'react';
import { Lock, Unlock, Key, Copy, Check, RotateCcw, ShieldCheck, AlertCircle } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { motion, AnimatePresence } from 'framer-motion';

const TextEncryptor = () => {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
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
      if (mode === 'encrypt') {
        const encrypted = CryptoJS.AES.encrypt(inputText, secretKey).toString();
        setResult(encrypted);
      } else {
        const bytes = CryptoJS.AES.decrypt(inputText, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        if (!decrypted) throw new Error('Invalid key or corrupted data');
        setResult(decrypted);
      }
    } catch (err) {
      setError('Decryption failed. Please check your secret key and input data.');
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
          onClick={() => setMode('encrypt')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
            mode === 'encrypt' ? 'bg-red-500 text-white shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <Lock size={18} />
          Encrypt
        </button>
        <button
          onClick={() => setMode('decrypt')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all ${
            mode === 'decrypt' ? 'bg-green-500 text-white shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          <Unlock size={18} />
          Decrypt
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Input Controls */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
          <div>
            <label className="block text-sm text-white/40 mb-2 font-medium uppercase tracking-wider">Secret Key</label>
            <div className="relative">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
              <input
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your private key..."
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-white/40 mb-2 font-medium uppercase tracking-wider">
              {mode === 'encrypt' ? 'Text to Encrypt' : 'Encrypted Message'}
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={mode === 'encrypt' ? 'Enter sensitive text...' : 'Paste the encrypted string here...'}
              className="w-full h-32 bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none font-mono text-sm"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleProcess}
              className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                mode === 'encrypt' 
                  ? 'bg-gradient-to-r from-red-600 to-red-400 text-white shadow-lg shadow-red-500/20 hover:shadow-red-500/40' 
                  : 'bg-gradient-to-r from-green-600 to-green-400 text-white shadow-lg shadow-green-500/20 hover:shadow-green-500/40'
              }`}
            >
              {mode === 'encrypt' ? <Lock size={20} /> : <Unlock size={20} />}
              {mode === 'encrypt' ? 'Secure Text' : 'Unlock Message'}
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
              className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-white/40 uppercase tracking-wider font-bold">Result</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 text-xs text-white/60 hover:text-white transition-colors bg-white/5 px-3 py-2 rounded-lg border border-white/10"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
              <div className="bg-black/40 rounded-xl p-4 border border-white/5 font-mono text-sm break-all text-white/90 leading-relaxed max-h-60 overflow-y-auto custom-scrollbar">
                {result}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-green-400/60 bg-green-400/5 p-2 rounded-lg border border-green-400/10">
                <ShieldCheck size={14} />
                AES-256 bit equivalent encryption processed locally.
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
          <ShieldCheck size={18} className="text-red-400" />
          Technical Details
        </h4>
        <div className="space-y-4 text-sm text-white/60 leading-relaxed">
          <p>
            This tool uses <strong>AES (Advanced Encryption Standard)</strong> to secure your data. AES is used worldwide by governments and security agencies to protect top-secret information.
          </p>
          <ul className="list-disc list-inside space-y-1 marker:text-red-500">
            <li>End-to-End Privacy: No data leaves your machine.</li>
            <li>Zero-Storage: We never store your text or your secret key.</li>
            <li>Browser-Based: All encryption happens in RAM only.</li>
          </ul>
          <p className="text-xs text-white/30 italic bg-white/5 p-3 rounded-xl border border-white/10">
            Warning: If you lose your secret key, there is no way to recover the encrypted text. Keep it safe!
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextEncryptor;
