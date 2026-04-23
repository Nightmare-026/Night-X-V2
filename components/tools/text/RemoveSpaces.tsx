'use client';

import React, { useState } from 'react';
import { Scissors, Copy, Check, RotateCcw, AlignJustify } from 'lucide-react';
import { motion } from 'framer-motion';

const RemoveSpaces = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const actions = [
    { name: 'Remove All Spaces', fn: (s: string) => s.replace(/\s+/g, '') },
    { name: 'Remove Extra Spaces', fn: (s: string) => s.replace(/\s+/g, ' ').trim() },
    { name: 'Remove Line Breaks', fn: (s: string) => s.replace(/\n/g, ' ') },
    { name: 'Trim Each Line', fn: (s: string) => s.split('\n').map(line => line.trim()).join('\n') },
    { name: 'Remove Empty Lines', fn: (s: string) => s.split('\n').filter(line => line.trim() !== '').join('\n') },
    { name: 'Compact (All in One)', fn: (s: string) => s.replace(/\s+/g, ' ').trim() },
  ];

  const applyAction = (fn: (s: string) => string) => {
    if (!text) return;
    setText(fn(text));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Input Text</label>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="p-2 text-white/40 hover:text-white transition-colors disabled:opacity-0"
              title="Copy"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
            <button
              onClick={() => setText('')}
              className="p-2 text-white/40 hover:text-white transition-colors"
              title="Clear"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text with messy spacing or line breaks..."
          className="w-full h-64 bg-black/30 border border-white/10 rounded-xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none text-white/90 leading-relaxed text-lg custom-scrollbar"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((a) => (
          <button
            key={a.name}
            onClick={() => applyAction(a.fn)}
            className="flex items-center justify-center gap-2 px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white hover:border-red-500/50 transition-all active:scale-[0.98]"
          >
            <Scissors size={14} className="text-red-400" />
            {a.name}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
          <AlignJustify size={18} className="text-red-400" />
          Text Cleaning Guide
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-white/60 leading-relaxed">
          <p>
            <strong>Remove All Spaces:</strong> Great for creating IDs or cleaning copy-pasted numbers/codes.
          </p>
          <p>
            <strong>Remove Extra Spaces:</strong> Normalizes text by removing multiple consecutive spaces and trailing whitespace.
          </p>
          <p>
            <strong>Remove Empty Lines:</strong> Cleans up lists or code by removing blank lines.
          </p>
          <p>
            <strong>Compact:</strong> Reduces the entire text block to a single line with single spacing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RemoveSpaces;
