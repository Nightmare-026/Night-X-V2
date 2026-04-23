'use client';

import React, { useState } from 'react';
import { Type, Copy, Check, RotateCcw, ArrowRightLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CaseConverter = () => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const transforms = [
    { name: 'UPPERCASE', fn: (s: string) => s.toUpperCase() },
    { name: 'lowercase', fn: (s: string) => s.toLowerCase() },
    { name: 'Title Case', fn: (s: string) => s.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()) },
    { name: 'Sentence case', fn: (s: string) => s.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()) },
    { name: 'camelCase', fn: (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()) },
    { name: 'PascalCase', fn: (s: string) => s.toLowerCase().replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (m, chr) => chr.toUpperCase()) },
    { name: 'snake_case', fn: (s: string) => s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || '' },
    { name: 'kebab-case', fn: (s: string) => s.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('-') || '' },
    { name: 'aLtErNaTiNg cAsE', fn: (s: string) => s.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join('') },
  ];

  const applyTransform = (fn: (s: string) => string) => {
    if (!text) return;
    setText(fn(text));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs text-white/40 uppercase tracking-widest font-bold">Input Text</label>
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
          placeholder="Enter text to convert case..."
          className="w-full h-64 bg-black/30 border border-white/10 rounded-xl px-6 py-5 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none text-white/90 leading-relaxed text-lg custom-scrollbar"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {transforms.map((t) => (
          <button
            key={t.name}
            onClick={() => applyTransform(t.fn)}
            className="flex items-center justify-between px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white hover:border-white/20 transition-all active:scale-[0.98]"
          >
            {t.name}
            <ArrowRightLeft size={14} className="text-white/20" />
          </button>
        ))}
      </div>

      <div className="bg-blue-500/5 border border-blue-500/10 rounded-2xl p-6">
        <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2 text-blue-400">
          <Type size={18} />
          Case Conversion Guide
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-white/60 leading-relaxed">
          <div>
            <p className="font-bold text-white/40 mb-1 uppercase text-[10px]">Coding Cases</p>
            <p><strong>Snake Case:</strong> words joined by underscores (common in Python).</p>
            <p><strong>Camel Case:</strong> first word lower, others capitalized (common in JS).</p>
            <p><strong>Kebab Case:</strong> words joined by hyphens (common in CSS/URLs).</p>
          </div>
          <div>
            <p className="font-bold text-white/40 mb-1 uppercase text-[10px]">Writing Cases</p>
            <p><strong>Title Case:</strong> Capitalizes first letter of every word.</p>
            <p><strong>Sentence Case:</strong> Capitalizes first letter of every sentence.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;
