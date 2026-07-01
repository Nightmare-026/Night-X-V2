'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Trash2, FileText, Clock, Eye, Type } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WordCounter() {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const stats = useMemo(() => {
    const chars = text.length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const sentences = text === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = text === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const lines = text === '' ? 0 : text.split('\n').length;
    const readingTime = words > 0 ? Math.max(1, Math.round(words / 200)) : 0;
    return { chars, words, sentences, paragraphs, lines, readingTime };
  }, [text]);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statItems = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.chars },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Lines', value: stats.lines },
    { label: 'Read Time', value: `${stats.readingTime}m` },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Input */}
      <div className="lg:col-span-8 space-y-4">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] overflow-hidden focus-within:border-accent-blue/30 transition-colors">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.05] bg-white/[0.01]">
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Input Text</span>
            <div className="flex gap-2">
              <button
                onClick={() => setText('')}
                className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                title="Clear"
              >
                <Trash2 size={14} />
              </button>
              <button
                onClick={handleCopy}
                className="p-1.5 text-white/20 hover:text-accent-blue transition-colors"
                title="Copy"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-[400px] bg-transparent p-6 text-sm text-white/80 outline-none resize-none font-inter leading-relaxed placeholder:text-white/10"
          />
        </div>
      </div>

      {/* Right Column: Results/Stats */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-6">Real-time Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            {statItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-[10px] font-bold text-white/20 uppercase tracking-tight">{item.label}</p>
                <p className="text-xl font-outfit font-bold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-white/[0.05] bg-accent-blue/5 p-6">
          <div className="flex items-center gap-3 mb-2 text-accent-blue">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">Efficiency</span>
          </div>
          <p className="text-xs text-white/40 leading-relaxed font-inter">
            Processing large volumes of text? Use our PRO tools for bulk analysis and API access.
          </p>
        </div>
      </div>
    </div>
  );
}
