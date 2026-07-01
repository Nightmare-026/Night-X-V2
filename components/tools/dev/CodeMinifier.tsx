'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { cn } from '@/lib/utils';
import { 
  Zap, 
  Copy, 
  Check, 
  Trash2, 
  FileCode,
  Shrink,
  Layout,
  Code as CodeIcon,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';

type Language = 'html' | 'css' | 'javascript';

export default function CodeMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ original: number; minified: number; savings: number } | null>(null);

  const minifyJS = (code: string) => {
    return code
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s?([\{\}\(\)\[\]\+\-\*\/=;!,<>])\s?/g, '$1') // Remove spaces around operators
      .trim();
  };

  const minifyCSS = (code: string) => {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s?([\{\}:;,])\s?/g, '$1') // Remove spaces around delimiters
      .replace(/;}/g, '}') // Remove last semicolon in block
      .trim();
  };

  const minifyHTML = (code: string) => {
    return code
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/>\s+</g, '><') // Remove spaces between tags
      .trim();
  };

  const handleMinify = () => {
    if (!input.trim()) return;

    let minified = '';
    switch (language) {
      case 'javascript':
        minified = minifyJS(input);
        break;
      case 'css':
        minified = minifyCSS(input);
        break;
      case 'html':
        minified = minifyHTML(input);
        break;
    }

    setOutput(minified);
    
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([minified]).size;
    const savings = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize) * 100 : 0;
    
    setStats({
      original: originalSize,
      minified: minifiedSize,
      savings: Math.max(0, savings)
    });
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setStats(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Compression Logic */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shrink className="text-cyan-400" size={16} />
                <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Compression Logic</h3>
              </div>
              <button 
                onClick={handleClear}
                className="text-white/20 hover:text-red-400 transition-colors"
                title="Flush Buffer"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Language Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-black/40 rounded-md border border-white/[0.05]">
              {(['javascript', 'css', 'html'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "py-2.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                    language === lang ? "bg-cyan-400 text-black" : "text-white/40 hover:text-white"
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Stats Module */}
            {stats && (
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-1">
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Reduction</div>
                  <div className="text-lg font-outfit font-bold text-emerald-400 tracking-wider">-{stats.savings.toFixed(1)}%</div>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-1">
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Final Size</div>
                  <div className="text-lg font-outfit font-bold text-white tracking-wider">{formatSize(stats.minified)}</div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Source Payload</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Paste ${language.toUpperCase()} protocol...`}
                className="w-full h-64 bg-black/40 border border-white/[0.05] rounded-md px-6 py-5 text-sm font-mono focus:outline-none focus:border-cyan-400/50 transition-all resize-none scrollbar-hide"
              />
            </div>

            <button
              onClick={handleMinify}
              disabled={!input.trim()}
              className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 disabled:bg-white/5 disabled:text-white/20 text-black rounded-md font-outfit font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-400/10"
            >
              <Zap size={14} className="fill-current" />
              Compress Protocol
            </button>
          </div>
        </div>

        {/* Right Panel: Compressed Output */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden min-h-[600px] flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full flex-1">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase mb-2">Compressed Stream</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Optimized Payload</h2>
                </div>
                {output && (
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/[0.05] transition-all"
                  >
                    {copied ? <Check size={14} className="text-cyan-400" /> : <Copy size={14} className="text-white/40" />}
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{copied ? 'Copied' : 'Export'}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 space-y-8">
                <div className="w-full flex-1 min-h-[300px] bg-black/60 border border-white/[0.05] rounded-md p-6 font-mono text-sm overflow-y-auto text-white/80 scrollbar-hide">
                  {output ? (
                    <div className="break-all">{output}</div>
                  ) : (
                    <span className="text-white/10 italic">Awaiting Compression Feed...</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-white/[0.05]">
                  <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                    <div className="flex items-center gap-3 text-cyan-400">
                      <TrendingDown size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">LCP Optimization</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                      Reduces Largest Contentful Paint by stripping non-functional characters and comments.
                    </p>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <ShieldCheck size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Protocol</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                      All minification logic is executed within the local browser sandbox environment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
