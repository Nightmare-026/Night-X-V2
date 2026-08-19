'use client';

import React, { useState, useEffect } from 'react';
import { Type, Hash, Space, Fingerprint, Binary, Copy, Check, RotateCcw, Info, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';

const CharacterCounter = () => {
  const { toast } = useToast();
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

    // Calculate character frequency (top 8)
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
      .slice(0, 8);

    setCharFrequency(sortedFreq);
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast('Text copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Input Area */}
      <div className="lg:col-span-8 space-y-4">
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 space-y-4 shadow-[var(--shadow-raised-sm)]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Type className="text-primary-400" size={16} />
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Text Buffer Analysis</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!text}
                className="p-2 bg-surface-inset border border-white/10 hover:border-primary/40 rounded-xl text-text-muted hover:text-white transition-all disabled:opacity-30 flex items-center gap-1 text-xs"
                aria-label="Copy input text"
              >
                {copied ? <Check size={14} className="text-primary-400" /> : <Copy size={14} />}
                <span className="text-[11px] font-semibold">{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => setText('')}
                disabled={!text}
                className="p-2 bg-surface-inset border border-white/10 hover:border-red-500/40 rounded-xl text-text-muted hover:text-red-400 transition-all disabled:opacity-30 text-xs"
                aria-label="Clear text"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here to see real-time character, line, whitespace, and frequency metrics..."
            className="w-full h-80 bg-surface-inset border border-white/10 rounded-xl p-4 focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 shadow-[var(--shadow-inset-sm)] transition-all resize-none text-white text-xs sm:text-sm leading-relaxed"
          />
        </div>
      </div>

      {/* Analysis Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        {/* Core Metrics */}
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 space-y-4 shadow-[var(--shadow-raised-sm)]">
          <div className="flex items-center gap-2">
            <BarChart2 className="text-primary-400" size={16} />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">Core Metrics</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border border-white/[0.06] bg-surface-inset rounded-xl text-center space-y-0.5 shadow-[var(--shadow-inset-sm)]">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Total Chars</p>
              <p className="text-xl font-bold text-white font-mono">{stats.total}</p>
            </div>
            <div className="p-3 border border-white/[0.06] bg-surface-inset rounded-xl text-center space-y-0.5 shadow-[var(--shadow-inset-sm)]">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">No Spaces</p>
              <p className="text-xl font-bold text-primary-400 font-mono">{stats.noSpaces}</p>
            </div>
            <div className="p-3 border border-white/[0.06] bg-surface-inset rounded-xl text-center space-y-0.5 shadow-[var(--shadow-inset-sm)]">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Spaces</p>
              <p className="text-xl font-bold text-white font-mono">{stats.spaces}</p>
            </div>
            <div className="p-3 border border-white/[0.06] bg-surface-inset rounded-xl text-center space-y-0.5 shadow-[var(--shadow-inset-sm)]">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Lines</p>
              <p className="text-xl font-bold text-accent-cyan font-mono">{stats.lines}</p>
            </div>
          </div>
        </div>

        {/* Composition Breakdown */}
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 space-y-4 shadow-[var(--shadow-raised-sm)]">
          <div className="flex items-center gap-2">
            <Binary className="text-primary-400" size={16} />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">Composition</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Letters', value: stats.letters, color: 'bg-primary' },
              { label: 'Digits', value: stats.digits, color: 'bg-accent-cyan' },
              { label: 'Special Symbols', value: stats.special, color: 'bg-accent-pink' }
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-text-tertiary">{item.label}</span>
                  <span className="text-white font-mono">{item.value}</span>
                </div>
                <div className="h-1.5 w-full bg-surface-inset rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / (stats.total || 1)) * 100}%` }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Character Frequency */}
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 space-y-4 shadow-[var(--shadow-raised-sm)]">
          <div className="flex items-center gap-2">
            <Hash className="text-primary-400" size={16} />
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">Top Frequency</h2>
          </div>
          {charFrequency.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {charFrequency.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-surface-inset border border-white/[0.04]">
                  <span className="w-6 h-6 rounded bg-surface-card border border-white/10 flex items-center justify-center text-xs font-mono text-primary-400 font-bold">
                    {item.char === ' ' ? '␣' : item.char}
                  </span>
                  <span className="text-[10px] font-mono text-text-secondary">{item.count}× ({item.percentage.toFixed(0)}%)</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-text-muted italic">
              Type or paste text to compute character frequency.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterCounter;
