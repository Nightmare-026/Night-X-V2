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
      name: 'Sort Alphabetical (A-Z)', 
      icon: <SortAsc size={16} />,
      fn: (s: string) => getLines(s).sort((a, b) => a.localeCompare(b)).join('\n') 
    },
    { 
      name: 'Sort Alphabetical (Z-A)', 
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
      name: 'Reverse Current List', 
      icon: <RotateCcw size={16} />,
      fn: (s: string) => getLines(s).reverse().join('\n') 
    },
    { 
      name: 'Shuffle (Randomize)', 
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

  const lineCount = getLines(text).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Editor Area */}
      <div className="lg:col-span-8 space-y-4">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ListOrdered className="text-accent-blue" size={16} />
              <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Input List</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!text}
                className="p-2 text-white/20 hover:text-white transition-colors disabled:opacity-0"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
              </button>
              <button
                onClick={() => setText('')}
                className="p-2 text-white/20 hover:text-white transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter items line by line...&#10;Apple&#10;Orange&#10;Banana"
            className="w-full h-[500px] bg-black/40 border border-white/[0.05] rounded-md px-6 py-5 focus:outline-none focus:border-accent-blue transition-all resize-none text-white/90 font-mono text-sm leading-relaxed custom-scrollbar"
          />
        </div>
      </div>

      {/* Actions Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="text-accent-blue" size={16} />
            <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Sort Options</h2>
          </div>
          <div className="flex flex-col gap-2">
            {sorts.map((s) => (
              <button
                key={s.name}
                onClick={() => applySort(s.fn)}
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-md text-[10px] font-bold uppercase tracking-widest text-white/40 hover:bg-accent-blue/5 hover:border-accent-blue/30 hover:text-white transition-all text-left font-inter group"
              >
                {s.name}
                <div className="text-accent-blue/40 group-hover:text-accent-blue transition-colors">
                  {s.icon}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Card */}
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
            <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">List Metrics</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white/[0.02] p-4 rounded-md border border-white/[0.05]">
              <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold block mb-1">Total Items</span>
              <span className="text-2xl font-outfit font-bold text-white">{lineCount}</span>
            </div>
          </div>
          <p className="text-[10px] text-white/30 font-inter uppercase tracking-wide leading-relaxed">
            Items are detected based on line breaks. Ensure each entry is on its own line.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextSorter;
