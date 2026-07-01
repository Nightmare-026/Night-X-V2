'use client';
import { cn } from '@/lib/utils';

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
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Premium Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-6 bg-white/[0.02] border border-white/[0.05] p-4 rounded-md">
        <div className="flex bg-white/[0.02] p-1 rounded-md border border-white/[0.05]">
          <button
            onClick={() => setViewMode('split')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
              viewMode === 'split' ? "bg-accent-blue text-white shadow-lg" : "text-white/20 hover:text-white"
            )}
          >
            <Columns size={14} />
            Split
          </button>
          <button
            onClick={() => setViewMode('inline')}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
              viewMode === 'inline' ? "bg-accent-blue text-white shadow-lg" : "text-white/20 hover:text-white"
            )}
          >
            <List size={14} />
            Inline
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Additions</span>
              <span className="text-sm font-outfit font-bold text-green-400">{stats.added}</span>
            </div>
            <div className="w-px h-8 bg-white/[0.05]" />
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Deletions</span>
              <span className="text-sm font-outfit font-bold text-red-400">{stats.removed}</span>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="p-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-md text-white/20 hover:text-white transition-all"
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
            <label className="text-[10px] text-white/20 uppercase tracking-widest font-bold font-inter">Original Document</label>
          </div>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            placeholder="Paste source text..."
            className="w-full h-48 bg-black/40 border border-white/[0.05] rounded-md p-6 focus:outline-none focus:border-accent-blue/50 transition-all resize-none font-mono text-sm text-white/60 custom-scrollbar leading-relaxed"
          />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="w-1.5 h-1.5 rounded-full bg-accent-blue/40" />
            <label className="text-[10px] text-white/20 uppercase tracking-widest font-bold font-inter">Modified Document</label>
          </div>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            placeholder="Paste updated text..."
            className="w-full h-48 bg-black/40 border border-white/[0.05] rounded-md p-6 focus:outline-none focus:border-accent-blue/50 transition-all resize-none font-mono text-sm text-white/60 custom-scrollbar leading-relaxed"
          />
        </div>
      </div>

      {/* Comparison View */}
      <div className="bg-white/[0.02] border border-white/[0.05] rounded-md overflow-hidden">
        <div className="bg-white/[0.02] px-6 py-3 border-b border-white/[0.05] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRight size={14} className="text-accent-blue" />
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-inter">Line-by-Line Comparison</span>
          </div>
        </div>
        
        <div className="p-8 overflow-x-auto custom-scrollbar bg-black/40 min-h-[300px]">
          {diffResult.length > 0 && (original || modified) ? (
            <div className="font-mono text-sm leading-relaxed space-y-1">
              {diffResult.map((change, i) => (
                <div
                  key={i}
                  className={cn(
                    "px-4 py-1.5 rounded-sm border-l-2 transition-colors",
                    change.added ? "bg-green-500/5 text-green-400 border-green-500/50" :
                    change.removed ? "bg-red-500/5 text-red-400 border-red-500/50" :
                    "text-white/20 border-transparent"
                  )}
                >
                  <pre className="whitespace-pre-wrap break-all font-mono">
                    <span className="inline-block w-4 opacity-30 select-none">
                      {change.added ? '+' : change.removed ? '-' : ' '}
                    </span>
                    {change.value}
                  </pre>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center space-y-4">
              <Shield size={32} className="text-white/5" />
              <p className="text-[10px] text-white/10 uppercase tracking-widest font-bold">Awaiting Input Data</p>
            </div>
          )}
        </div>
      </div>

      {/* Information Footer */}
      <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-md flex items-start gap-4">
        <AlertCircle size={20} className="text-accent-blue shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-outfit">Differential Analysis</h4>
          <p className="text-[10px] text-white/30 font-inter uppercase tracking-wide leading-relaxed">
            Comparing assets line-by-line using standard Myers diff algorithm. Additions are marked in emerald, removals in crimson.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TextDiff;
