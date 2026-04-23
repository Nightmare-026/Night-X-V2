'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Trash2, FileText, Clock, Eye, Type } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const lines = text === '' ? 0 : text.split('\n').length;
    const readingTime = Math.max(1, Math.round(words / 200));
    const speakingTime = Math.max(1, Math.round(words / 130));
    return { chars, charsNoSpaces, words, sentences, paragraphs, lines, readingTime, speakingTime };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statCards = [
    { label: 'Words', value: stats.words, icon: <Type size={18} />, color: 'from-violet-500 to-purple-600' },
    { label: 'Characters', value: stats.chars, icon: <FileText size={18} />, color: 'from-blue-500 to-cyan-500' },
    { label: 'Chars (no spaces)', value: stats.charsNoSpaces, icon: <FileText size={18} />, color: 'from-emerald-500 to-teal-500' },
    { label: 'Sentences', value: stats.sentences, icon: <FileText size={18} />, color: 'from-amber-500 to-orange-500' },
    { label: 'Paragraphs', value: stats.paragraphs, icon: <FileText size={18} />, color: 'from-rose-500 to-pink-500' },
    { label: 'Lines', value: stats.lines, icon: <FileText size={18} />, color: 'from-indigo-500 to-blue-500' },
    { label: 'Reading Time', value: `~${stats.readingTime} min`, icon: <Clock size={18} />, color: 'from-teal-500 to-emerald-600' },
    { label: 'Speaking Time', value: `~${stats.speakingTime} min`, icon: <Eye size={18} />, color: 'from-pink-500 to-rose-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="glass-card p-4 rounded-xl border border-white/10 flex flex-col gap-2"
          >
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white`}>
              {card.icon}
            </div>
            <p className="text-2xl font-syne font-bold text-white">{card.value}</p>
            <p className="text-xs text-white/50">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Text Input */}
      <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <span className="text-sm font-medium text-white/70">Your Text</span>
          <div className="flex gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition-all disabled:opacity-40"
            >
              <Copy size={13} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            <button
              onClick={() => setText('')}
              disabled={!text}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 text-xs transition-all disabled:opacity-40"
            >
              <Trash2 size={13} />
              Clear
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here to get real-time statistics…"
          rows={14}
          className="w-full bg-transparent text-white/90 p-4 resize-none outline-none placeholder:text-white/25 text-sm leading-relaxed font-mono"
        />
      </div>
    </div>
  );
}
