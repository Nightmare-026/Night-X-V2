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

  const statCards = [
    { label: 'Total Characters', value: stats.total, icon: <Type size={18} />, color: 'text-blue-400' },
    { label: 'Without Spaces', value: stats.noSpaces, icon: <Fingerprint size={18} />, color: 'text-green-400' },
    { label: 'Spaces', value: stats.spaces, icon: <Space size={18} />, color: 'text-yellow-400' },
    { label: 'Lines', value: stats.lines, icon: <Hash size={18} />, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Input Area */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Character Analysis</label>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="p-2 text-white/40 hover:text-white transition-colors disabled:opacity-0"
              title="Copy Text"
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
          placeholder="Paste text to analyze characters..."
          className="w-full h-64 bg-black/30 border border-white/10 rounded-xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none text-white/90 leading-relaxed text-lg font-light custom-scrollbar"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center group hover:bg-white/[0.07] transition-all"
          >
            <div className={`mx-auto w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center mb-3 ${stat.color} group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-mono font-bold text-white mb-1">{stat.value}</p>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Composition */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <Binary size={18} className="text-blue-400" />
            COMPOSITION
          </h3>
          <div className="space-y-4">
            {[
              { label: 'Letters', value: stats.letters, color: 'bg-blue-400' },
              { label: 'Digits', value: stats.digits, color: 'bg-green-400' },
              { label: 'Special Characters', value: stats.special, color: 'bg-purple-400' }
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">{item.label}</span>
                  <span className="text-white font-mono">{item.value}</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
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
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <BarChart2 size={18} className="text-green-400" />
            TOP CHARACTERS
          </h3>
          {charFrequency.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {charFrequency.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-xs font-mono text-white">
                      {item.char}
                    </span>
                    <span className="text-[10px] text-white/40">{item.count}x</span>
                  </div>
                  <span className="text-[10px] font-mono text-white/60">{item.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-24 flex items-center justify-center text-white/20 text-xs italic">
              No characters to analyze
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
          <Info size={18} className="text-blue-400" />
          Why use a Character Counter?
        </h4>
        <p className="text-sm text-white/60 leading-relaxed">
          Character counting is crucial for social media posts (Twitter, Instagram), SEO meta descriptions, and programming constraints. Understanding the distribution of characters can also help in identifying patterns or ensuring specific formatting requirements are met.
        </p>
      </div>
    </div>
  );
};

export default CharacterCounter;
