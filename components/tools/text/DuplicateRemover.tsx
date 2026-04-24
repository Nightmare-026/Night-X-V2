'use client';

import React, { useState, useEffect } from 'react';
import { Trash2, Copy, Check, RotateCcw, AlertCircle, Info, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DuplicateRemover = () => {
  const [text, setText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [stats, setStats] = useState({ original: 0, unique: 0, removed: 0 });
  const [copied, setCopied] = useState(false);

  // Real-time stats based on current input
  const getLines = (val: string) => val.split('\n').filter(l => l.trim() !== '');
  const currentTotal = getLines(text).length;

  const handleRemove = () => {
    if (!text.trim()) return;

    const lines = text.split('\n');
    const uniqueLines: string[] = [];
    const seen = new Set<string>();

    lines.forEach(line => {
      const processedLine = trimLines ? line.trim() : line;
      if (processedLine === '') return;
      
      const compareVal = caseSensitive ? processedLine : processedLine.toLowerCase();
      if (!seen.has(compareVal)) {
        seen.add(compareVal);
        uniqueLines.push(processedLine);
      }
    });

    const newText = uniqueLines.join('\n');
    const uniqueCount = uniqueLines.length;
    
    setStats({
      original: currentTotal,
      unique: uniqueCount,
      removed: Math.max(0, currentTotal - uniqueCount)
    });
    setText(newText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Options */}
      <div className="flex flex-wrap items-center gap-6 bg-white/5 border border-white/10 p-5 rounded-2xl backdrop-blur-sm">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div 
            className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${caseSensitive ? 'bg-red-500' : 'bg-white/10'}`}
            onClick={() => setCaseSensitive(!caseSensitive)}
          >
            <motion.div animate={{ x: caseSensitive ? 20 : 0 }} className="w-3 h-3 bg-white rounded-full shadow-sm" />
          </div>
          <span className="text-sm text-white/60 group-hover:text-white transition-colors">Case Sensitive</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer group">
          <div 
            className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ${trimLines ? 'bg-red-500' : 'bg-white/10'}`}
            onClick={() => setTrimLines(!trimLines)}
          >
            <motion.div animate={{ x: trimLines ? 20 : 0 }} className="w-3 h-3 bg-white rounded-full shadow-sm" />
          </div>
          <span className="text-sm text-white/60 group-hover:text-white transition-colors">Trim Lines</span>
        </label>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs text-white/40 uppercase tracking-widest font-bold">List to Clean</label>
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
              onClick={() => { setText(''); setStats({ original: 0, unique: 0, removed: 0 }); }}
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
          placeholder="Paste items with duplicates...&#10;Email 1&#10;Email 2&#10;Email 1"
          className="w-full h-80 bg-black/30 border border-white/10 rounded-xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none text-white/90 font-mono text-sm leading-relaxed custom-scrollbar"
        />
        <button
          onClick={handleRemove}
          disabled={!text}
          className="w-full mt-4 py-4 bg-gradient-to-r from-red-600 to-red-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all active:scale-[0.99] disabled:opacity-50 disabled:grayscale"
        >
          <Trash2 size={20} />
          Remove Duplicates
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center group hover:bg-white/10 transition-colors">
          <p className="text-2xl font-mono font-bold text-white mb-1">{currentTotal}</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Total Items</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center group hover:bg-white/10 transition-colors">
          <p className="text-2xl font-mono font-bold text-green-400 mb-1">{stats.unique}</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Unique Items</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center group hover:bg-white/10 transition-colors">
          <p className="text-2xl font-mono font-bold text-red-400 mb-1">{stats.removed}</p>
          <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Duplicates Removed</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-start gap-4">
        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 shrink-0 mt-1">
          <Filter size={20} />
        </div>
        <div className="text-sm text-white/60 leading-relaxed">
          <h4 className="text-white font-medium mb-2">How it works</h4>
          <p>
            The Duplicate Remover scans your text line by line. When it finds an item that has appeared before, it filters it out, keeping only the first unique instance. This is perfect for cleaning mailing lists, logs, or large datasets.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DuplicateRemover;
