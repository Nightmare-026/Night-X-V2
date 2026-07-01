'use client';

import React, { useState, useEffect } from 'react';
import { Type, Hash, Space, Fingerprint, Binary, Copy, Check, RotateCcw, Info, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const CharacterCounter = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    noSpaces: 0,
    spaces: 0,
    lines: 0,
    digits: 0,
    letters: 0,
    special: 0
  });
  const [charFrequency, setCharFrequency] = useState<{ char: string; count: number; percentage: number }[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const total = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const spaces = total - noSpaces;
    const lines = text ? text.split(/\n/).length : 0;
    const digits = (text.match(/\d/g) || []).length;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const special = total - digits - letters - spaces;

    setStats({
      total,
      noSpaces,
      spaces,
      lines,
      digits,
      letters,
      special
    });

    // Calculate character frequency (top 10)
    const freq: Record<string, number> = {};
    const cleanText = text.replace(/\s/g, '').toLowerCase();
    for (const char of cleanText) {
      freq[char] = (freq[char] || 0) + 1;
    }

    const sortedFreq = Object.entries(freq)
      .map(([char, count]) => ({
        char,
        count,
        percentage: (count / (cleanText.length || 1)) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    setCharFrequency(sortedFreq);
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Area */}
      <div className="lg:col-span-8 space-y-4">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Type className="text-accent-blue" size={16} />
              <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Text Analysis</h2>
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
            placeholder="Start typing or paste your content here..."
            className="w-full h-[500px] bg-black/40 border border-white/[0.05] rounded-md px-6 py-5 focus:outline-none focus:border-accent-blue transition-all resize-none text-white/90 font-inter text-base leading-relaxed custom-scrollbar"
          />
        </div>
      </div>

      {/* Analysis Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        {/* Core Metrics */}
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <BarChart2 className="text-accent-blue" size={16} />
            <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Core Metrics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-white/[0.05] bg-white/[0.01] rounded-md text-center space-y-1">
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Total</p>
              <p className="text-xl font-bold text-white font-inter">{stats.total}</p>
            </div>
            <div className="p-4 border border-white/[0.05] bg-white/[0.01] rounded-md text-center space-y-1">
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">No Spaces</p>
              <p className="text-xl font-bold text-white font-inter">{stats.noSpaces}</p>
            </div>
            <div className="p-4 border border-white/[0.05] bg-white/[0.01] rounded-md text-center space-y-1">
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Spaces</p>
              <p className="text-xl font-bold text-white font-inter">{stats.spaces}</p>
            </div>
            <div className="p-4 border border-white/[0.05] bg-white/[0.01] rounded-md text-center space-y-1">
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Lines</p>
              <p className="text-xl font-bold text-white font-inter">{stats.lines}</p>
            </div>
          </div>
        </div>

        {/* Composition Breakdown */}
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Binary className="text-accent-blue" size={16} />
            <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Composition</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: 'Letters', value: stats.letters, color: 'bg-accent-blue' },
              { label: 'Digits', value: stats.digits, color: 'bg-green-500' },
              { label: 'Special', value: stats.special, color: 'bg-purple-500' }
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-[10px] uppercase tracking-wider font-inter">
                  <span className="text-white/40">{item.label}</span>
                  <span className="text-white font-bold">{item.value}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / (stats.total || 1)) * 100}%` }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Character Frequency */}
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Hash className="text-accent-blue" size={16} />
            <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Top Characters</h2>
          </div>
          {charFrequency.length > 0 ? (
            <div className="space-y-3">
              {charFrequency.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded border border-white/[0.05] bg-white/[0.02] flex items-center justify-center text-xs font-mono text-white group-hover:border-accent-blue transition-colors">
                      {item.char === ' ' ? '␣' : item.char}
                    </span>
                    <span className="text-[10px] text-white/40 font-inter">{item.count} occurrences</span>
                  </div>
                  <span className="text-[10px] font-mono text-accent-blue">{item.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-[10px] text-white/20 uppercase tracking-widest font-inter italic">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCounter;
