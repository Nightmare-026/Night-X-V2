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
    { name: 'Remove All Spaces', fn: (s: string) => s.replace(/\s+/g, ''), icon: <Scissors size={14} /> },
    { name: 'Remove Extra Spaces', fn: (s: string) => s.replace(/\s+/g, ' ').trim(), icon: <Scissors size={14} /> },
    { name: 'Remove Line Breaks', fn: (s: string) => s.replace(/\n/g, ' '), icon: <Scissors size={14} /> },
    { name: 'Trim Each Line', fn: (s: string) => s.split('\n').map(line => line.trim()).join('\n'), icon: <Scissors size={14} /> },
    { name: 'Remove Empty Lines', fn: (s: string) => s.split('\n').filter(line => line.trim() !== '').join('\n'), icon: <Scissors size={14} /> },
    { name: 'Compact (All in One)', fn: (s: string) => s.replace(/\s+/g, ' ').trim(), icon: <Scissors size={14} /> },
  ];

  const applyAction = (fn: (s: string) => string) => {
    if (!text) return;
    setText(fn(text));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Editor Area */}
      <div className="lg:col-span-8 space-y-4">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlignJustify className="text-accent-blue" size={16} />
              <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Input Text</h2>
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
            placeholder="Paste messy text here..."
            className="w-full h-[500px] bg-black/40 border border-white/[0.05] rounded-md px-6 py-5 focus:outline-none focus:border-accent-blue transition-all resize-none text-white/90 font-inter text-base leading-relaxed custom-scrollbar"
          />
        </div>
      </div>

      {/* Actions Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Scissors className="text-accent-blue" size={16} />
            <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Cleaning Actions</h2>
          </div>
          <div className="flex flex-col gap-2">
            {actions.map((a) => (
              <button
                key={a.name}
                onClick={() => applyAction(a.fn)}
                className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-md text-[10px] font-bold uppercase tracking-widest text-white/40 hover:bg-accent-blue/5 hover:border-accent-blue/30 hover:text-white transition-all text-left font-inter"
              >
                {a.name}
                <div className="text-accent-blue/40 group-hover:text-accent-blue transition-colors">
                  {a.icon}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <AlignJustify className="text-accent-blue" size={16} />
            <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Cleaning Tips</h2>
          </div>
          <div className="space-y-4">
            <p className="text-[10px] text-white/30 font-inter uppercase tracking-wide leading-relaxed">
              Use <span className="text-white/60">Remove Extra Spaces</span> for normal text cleanup. Use <span className="text-white/60">Remove All Spaces</span> for codes and identifiers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveSpaces;
