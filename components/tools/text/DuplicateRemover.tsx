'use client';
import { cn } from '@/lib/utils';

import React, { useState, useEffect } from 'react';
import { Trash2, Copy, Check, RotateCcw, AlertCircle, Info, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DuplicateRemover = () => {
  const [text, setText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [stats, setStats] = useState({ original: 0, unique: 0, removed: 0 });
  const [copied, setCopied] = useState(false);

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

  const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={cn(
        "flex items-center justify-between p-3 rounded-md border transition-all w-full",
        value ? "bg-accent-blue/5 border-accent-blue/30 text-white" : "bg-white/[0.01] border-white/[0.05] text-white/20 hover:border-white/10"
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest font-inter">{label}</span>
      <div className={cn(
        "w-6 h-3 rounded-full relative transition-colors",
        value ? "bg-accent-blue" : "bg-white/10"
      )}>
        <div className={cn(
          "absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all",
          value ? "left-3.5" : "left-0.5"
        )} />
      </div>
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Area */}
      <div className="lg:col-span-8 space-y-4">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Filter className="text-accent-blue" size={16} />
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
                onClick={() => { setText(''); setStats({ original: 0, unique: 0, removed: 0 }); }}
                className="p-2 text-white/20 hover:text-white transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste items here (one per line)..."
            className="w-full h-[500px] bg-black/40 border border-white/[0.05] rounded-md px-6 py-5 focus:outline-none focus:border-accent-blue transition-all resize-none text-white/90 font-mono text-sm leading-relaxed font-inter"
          />
          <button
            onClick={handleRemove}
            disabled={!text}
            className="w-full py-4 bg-accent-blue text-white rounded-md font-bold text-xs uppercase tracking-widest hover:bg-accent-blue/90 transition-all disabled:opacity-50 font-inter"
          >
            <Trash2 size={16} className="inline mr-2" />
            Clear Duplicates
          </button>
        </div>
      </div>

      {/* Options & Stats */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Filter className="text-accent-blue" size={16} />
            <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Options</h2>
          </div>
          <div className="space-y-2">
            <Toggle label="Case Sensitive" value={caseSensitive} onChange={() => setCaseSensitive(!caseSensitive)} />
            <Toggle label="Trim Whitespace" value={trimLines} onChange={() => setTrimLines(!trimLines)} />
          </div>
        </div>

        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Info className="text-accent-blue" size={16} />
            <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Statistics</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 border border-white/[0.05] bg-white/[0.01] rounded-md text-center space-y-1">
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Initial</p>
              <p className="text-xl font-bold text-white font-inter">{currentTotal}</p>
            </div>
            <div className="p-4 border border-white/[0.05] bg-white/[0.01] rounded-md text-center space-y-1">
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Unique</p>
              <p className="text-xl font-bold text-green-500 font-inter">{stats.unique}</p>
            </div>
            <div className="p-4 border border-white/[0.05] bg-white/[0.01] rounded-md text-center space-y-1">
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Removed</p>
              <p className="text-xl font-bold text-red-500 font-inter">{stats.removed}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuplicateRemover;
