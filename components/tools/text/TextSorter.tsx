'use client';

import React, { useState } from 'react';
import { ArrowUpDown, Copy, Check, RotateCcw, SortAsc, SortDesc, Shuffle, ListOrdered } from 'lucide-react';
import { motion } from 'framer-motion';

const TextSorter = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLines = (s: string) => s.split('\n').filter(line => line.length > 0);

  const sorts = [
    { 
      name: 'Sort A-Z', 
      icon: <SortAsc size={16} />,
      fn: (s: string) => getLines(s).sort((a, b) => a.localeCompare(b)).join('\n') 
    },
    { 
      name: 'Sort Z-A', 
      icon: <SortDesc size={16} />,
      fn: (s: string) => getLines(s).sort((a, b) => b.localeCompare(a)).join('\n') 
    },
    { 
      name: 'Sort Numerically', 
      icon: <ListOrdered size={16} />,
      fn: (s: string) => getLines(s).sort((a, b) => {
        const numA = parseFloat(a.replace(/[^0-9.-]+/g, ''));
        const numB = parseFloat(b.replace(/[^0-9.-]+/g, ''));
        return (isNaN(numA) ? 0 : numA) - (isNaN(numB) ? 0 : numB);
      }).join('\n') 
    },
    { 
      name: 'Sort by Length', 
      icon: <ArrowUpDown size={16} />,
      fn: (s: string) => getLines(s).sort((a, b) => a.length - b.length).join('\n') 
    },
    { 
      name: 'Reverse List', 
      icon: <RotateCcw size={16} />,
      fn: (s: string) => getLines(s).reverse().join('\n') 
    },
    { 
      name: 'Shuffle (Random)', 
      icon: <Shuffle size={16} />,
      fn: (s: string) => {
        const lines = getLines(s);
        for (let i = lines.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lines[i], lines[j]] = [lines[j], lines[i]];
        }
        return lines.join('\n');
      }
    },
  ];

  const applySort = (fn: (s: string) => string) => {
    if (!text) return;
    setText(fn(text));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs text-white/40 uppercase tracking-widest font-bold">List to Sort (one item per line)</label>
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
          placeholder="Enter items line by line...&#10;Apple&#10;Orange&#10;Banana"
          className="w-full h-80 bg-black/30 border border-white/10 rounded-xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none text-white/90 font-mono text-sm leading-relaxed custom-scrollbar"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {sorts.map((s) => (
          <button
            key={s.name}
            onClick={() => applySort(s.fn)}
            className="flex items-center gap-3 px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all active:scale-[0.98]"
          >
            <span className="text-red-400">{s.icon}</span>
            {s.name}
          </button>
        ))}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-4">
        <div className="p-3 bg-red-500/10 rounded-xl text-red-400 shrink-0">
          <ListOrdered size={24} />
        </div>
        <div>
          <h4 className="text-white font-medium mb-1">Items Detected: {getLines(text).length}</h4>
          <p className="text-sm text-white/40">Enter each item on a new line for the best results.</p>
        </div>
      </div>
    </div>
  );
};

export default TextSorter;
