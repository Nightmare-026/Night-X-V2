'use client';

import React, { useState, useEffect } from 'react';
import { Columns, List, Copy, Check, RotateCcw, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import * as diff from 'diff';
import { motion, AnimatePresence } from 'framer-motion';

const TextDiff = () => {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [viewMode, setViewMode] = useState<'split' | 'inline'>('split');
  const [diffResult, setDiffResult] = useState<diff.Change[]>([]);
  const [stats, setStats] = useState({ added: 0, removed: 0 });

  useEffect(() => {
    const changes = diff.diffLines(original, modified);
    setDiffResult(changes);
    
    let added = 0;
    let removed = 0;
    changes.forEach(change => {
      if (change.added) added += change.count || 0;
      if (change.removed) removed += change.count || 0;
    });
    setStats({ added, removed });
  }, [original, modified]);

  const handleReset = () => {
    setOriginal('');
    setModified('');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
        <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'split' ? 'bg-red-500 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            <Columns size={16} />
            Split
          </button>
          <button
            onClick={() => setViewMode('inline')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'inline' ? 'bg-red-500 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            <List size={16} />
            Inline
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-green-400">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              {stats.added} Additions
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              {stats.removed} Deletions
            </span>
          </div>
          <button
            onClick={handleReset}
            className="p-2 text-white/40 hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      {/* Input Panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold px-2">Original Text</label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste original version..."
            className="w-full h-48 bg-black/30 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none font-mono text-xs text-white/60 custom-scrollbar"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold px-2">Modified Text</label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste modified version..."
            className="w-full h-48 bg-black/30 border border-white/10 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none font-mono text-xs text-white/60 custom-scrollbar"
          />
        </div>
      </div>

      {/* Diff Result */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center gap-2">
          <ArrowRight size={16} className="text-red-400" />
          <span className="text-sm font-medium text-white/80">Comparison View</span>
        </div>
        
        <div className="p-6 overflow-x-auto custom-scrollbar">
          {diffResult.length > 0 && (original || modified) ? (
            <div className="font-mono text-sm leading-relaxed min-w-full">
              {diffResult.map((change, i) => (
                <div
                  key={i}
                  className={`px-3 py-0.5 rounded ${
                    change.added ? 'bg-green-500/10 text-green-400 border-l-4 border-green-500' :
                    change.removed ? 'bg-red-500/10 text-red-400 border-l-4 border-red-500' :
                    'text-white/40'
                  }`}
                >
                  <pre className="whitespace-pre-wrap break-all">
                    {change.added ? '+ ' : change.removed ? '- ' : '  '}
                    {change.value}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-white/10 italic">
              <Shield size={32} className="mb-2 opacity-10" />
              Compare two text blocks to see differences
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start gap-4 bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
        <AlertCircle size={20} className="text-red-400 shrink-0 mt-1" />
        <div className="text-sm text-white/60 leading-relaxed">
          <h4 className="text-white font-medium mb-1">How Diffing Works</h4>
          <p>
            This tool uses a line-by-line comparison algorithm to identify exactly what has changed between two versions of text. Green highlights represent new lines added to the modified version, while red highlights show lines that were removed from the original.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextDiff;
