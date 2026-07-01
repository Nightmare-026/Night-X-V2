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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Area */}
      <div className="lg:col-span-8 space-y-4">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Type className="text-accent-blue" size={16} />
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
            placeholder="Paste your text here..."
            className="w-full h-[500px] bg-black/40 border border-white/[0.05] rounded-md px-6 py-5 focus:outline-none focus:border-accent-blue transition-all resize-none text-white/90 leading-relaxed text-lg font-inter"
          />
        </div>
      </div>

      {/* Actions & Info */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="text-accent-blue" size={16} />
            <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Transformations</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {transforms.map((t) => (
              <button
                key={t.name}
                onClick={() => applyTransform(t.fn)}
                className="flex items-center justify-between px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-md text-[10px] font-bold text-white/40 uppercase tracking-widest hover:bg-white/[0.05] hover:text-white hover:border-white/10 transition-all active:scale-[0.98] font-inter"
              >
                {t.name}
                <ArrowRightLeft size={12} className="opacity-20" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-md border border-accent-blue/10 bg-accent-blue/[0.02] p-6 space-y-4">
          <div className="flex items-center gap-2 text-accent-blue">
            <Type size={16} />
            <h3 className="text-xs font-outfit font-bold uppercase tracking-widest">Case Guide</h3>
          </div>
          <div className="space-y-4 text-[10px] text-white/40 leading-relaxed uppercase tracking-widest font-bold font-inter">
            <div>
              <p className="text-white/60 mb-1">Snake Case</p>
              <p className="font-normal normal-case">words_joined_by_underscores</p>
            </div>
            <div>
              <p className="text-white/60 mb-1">Camel Case</p>
              <p className="font-normal normal-case">firstWordLowerOthersCap</p>
            </div>
            <div>
              <p className="text-white/60 mb-1">Kebab Case</p>
              <p className="font-normal normal-case">words-joined-by-hyphens</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseConverter;
