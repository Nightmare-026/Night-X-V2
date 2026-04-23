'use client';

import React, { useState, useEffect } from 'react';
import { Link, ExternalLink, Copy, Check, RotateCcw, AlertCircle, ArrowLeftRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UrlEncoder = () => {
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
      setError('Invalid percent-encoded string.');
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
      setError('Cannot open as a valid URL.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Mode Switcher */}
      <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 w-fit mx-auto">
        <button
          onClick={() => setMode('encode')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === 'encode' ? 'bg-red-500 text-white shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          Encode
        </button>
        <button
          onClick={() => {
            setMode(mode === 'encode' ? 'decode' : 'encode');
            if (output && !error) setInput(output);
          }}
          className="px-3 text-white/20 hover:text-white transition-colors"
        >
          <ArrowLeftRight size={16} />
        </button>
        <button
          onClick={() => setMode('decode')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all ${
            mode === 'decode' ? 'bg-red-500 text-white shadow-lg' : 'text-white/60 hover:text-white'
          }`}
        >
          Decode
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-3">
          <label className="text-xs text-white/40 uppercase tracking-widest font-bold flex items-center gap-2 px-2">
            <Link size={14} />
            Input URL/Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Paste URL or text to encode...' : 'Paste percent-encoded string...'}
            className="w-full h-48 bg-black/20 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none font-mono text-sm text-white/80"
          />
        </div>

        {/* Output */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <label className="text-xs text-white/40 uppercase tracking-widest font-bold flex items-center gap-2">
              <Check size={14} />
              Result
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleOpen}
                disabled={!output || !!error}
                className="p-1.5 text-white/40 hover:text-white transition-colors disabled:opacity-0"
                title="Open Link"
              >
                <ExternalLink size={16} />
              </button>
              <button
                onClick={handleCopy}
                disabled={!output || !!error}
                className="p-1.5 text-white/40 hover:text-white transition-colors disabled:opacity-0"
                title="Copy"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <div className="relative h-48">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-red-500/5 border border-red-500/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2"
                >
                  <AlertCircle size={24} className="text-red-500" />
                  <p className="text-red-400 text-xs font-medium">{error}</p>
                </motion.div>
              ) : (
                <div className="w-full h-full bg-white/5 border border-white/10 rounded-2xl p-4 font-mono text-sm break-all overflow-y-auto custom-scrollbar text-white/90">
                  {output || <span className="text-white/10 italic">Waiting for input...</span>}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
          <Link size={18} className="text-blue-400" />
          Percent Encoding
        </h4>
        <p className="text-sm text-white/60 leading-relaxed">
          Certain characters have special meanings in URLs (like <code>?</code>, <code>&</code>, and <code>=</code>). Percent encoding replaces these characters with a <code>%</code> followed by their hexadecimal value, ensuring URLs are transmitted correctly over the internet without being misinterpreted.
        </p>
      </div>
    </div>
  );
};

export default UrlEncoder;
