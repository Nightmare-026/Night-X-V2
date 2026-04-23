'use client';

import React, { useState, useEffect } from 'react';
import { Type, ArrowLeftRight, Copy, Check, RotateCcw, AlertCircle, FileText, Download } from 'lucide-react';
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
      setError('Invalid Base64 string for decoding.');
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
    // Swap input and output if there's content
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
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('encode')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === 'encode' ? 'bg-red-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Encode
          </button>
          <button
            onClick={handleModeToggle}
            className="p-2 text-white/40 hover:text-white transition-colors"
            title="Swap Mode"
          >
            <ArrowLeftRight size={18} />
          </button>
          <button
            onClick={() => setMode('decode')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              mode === 'decode' ? 'bg-red-500 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            Decode
          </button>
        </div>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div 
              className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${realtime ? 'bg-red-500' : 'bg-white/10'}`}
              onClick={() => setRealtime(!realtime)}
            >
              <motion.div 
                animate={{ x: realtime ? 20 : 0 }}
                className="w-3 h-3 bg-white rounded-full shadow-sm"
              />
            </div>
            <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">Real-time</span>
          </label>
          <button
            onClick={() => { setInput(''); setOutput(''); setError(''); }}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors"
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Pane */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-white/40 uppercase tracking-widest font-bold flex items-center gap-2">
              <Type size={14} />
              Input
            </span>
          </div>
          <div className="relative group">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'Type or paste text to encode...' : 'Paste Base64 string to decode...'}
              className="w-full h-[300px] bg-black/20 border border-white/10 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none font-mono text-sm leading-relaxed text-white/80"
            />
          </div>
        </div>

        {/* Output Pane */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-2">
            <span className="text-xs text-white/40 uppercase tracking-widest font-bold flex items-center gap-2">
              <FileText size={14} />
              Output
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleDownload}
                disabled={!output || !!error}
                className="p-1.5 text-white/40 hover:text-white transition-colors disabled:opacity-0"
                title="Download"
              >
                <Download size={16} />
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
          <div className="relative group h-[300px]">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-red-500/5 border border-red-500/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3"
                >
                  <AlertCircle size={32} className="text-red-500" />
                  <p className="text-red-400 text-sm font-medium">{error}</p>
                </motion.div>
              ) : (
                <div className="w-full h-full bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-sm leading-relaxed text-white break-all overflow-y-auto custom-scrollbar">
                  {output || (
                    <span className="text-white/20 italic">
                      Waiting for input...
                    </span>
                  )}
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
        <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
          <AlertCircle size={18} className="text-red-400" />
          Pro Tip: UTF-8 Support
        </h4>
        <p className="text-sm text-white/60 leading-relaxed">
          This encoder uses a robust method to handle <strong>Unicode (UTF-8)</strong> characters. Unlike many basic encoders that crash with emojis or special symbols, Night X ensures your data is encoded and decoded accurately across different platforms.
        </p>
      </div>
    </div>
  );
};

export default Base64Codec;
