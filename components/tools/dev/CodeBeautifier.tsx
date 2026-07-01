import { AnimatePresence , motion} from 'framer-motion';
'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { cn } from '@/lib/utils';
import { 
  Code2, 
  Copy, 
  Check, 
  Trash2, 
  Settings2,
  FileCode2,
  FileJson,
  Braces,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import * as prettier from 'prettier/standalone';
import * as parserHtml from 'prettier/plugins/html';
import * as parserCss from 'prettier/plugins/postcss';
import * as parserBabel from 'prettier/plugins/babel';
import * as parserEstree from 'prettier/plugins/estree';

type Language = 'html' | 'css' | 'javascript' | 'json';

export default function CodeBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);

  const formatCode = async () => {
    if (!input.trim()) return;
    setError(null);
    setIsFormatting(true);

    try {
      let parser = '';
      let plugins = [];

      switch (language) {
        case 'html':
          parser = 'html';
          plugins = [parserHtml];
          break;
        case 'css':
          parser = 'css';
          plugins = [parserCss];
          break;
        case 'javascript':
          parser = 'babel';
          plugins = [parserBabel, parserEstree];
          break;
        case 'json':
          parser = 'json';
          plugins = [parserBabel, parserEstree];
          break;
      }

      const formatted = await prettier.format(input, {
        parser,
        plugins,
        tabWidth: indentSize,
        semi: true,
        singleQuote: true,
      });

      setOutput(formatted);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Syntax parsing failed. Please check the source protocol.');
    } finally {
      setIsFormatting(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Protocol Parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Code2 className="text-cyan-400" size={16} />
                <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Protocol Parameters</h3>
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
            <div className="grid grid-cols-2 gap-2 p-1 bg-black/40 rounded-md border border-white/[0.05]">
              {(['javascript', 'html', 'css', 'json'] as Language[]).map((lang) => (
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

            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Indentation Strategy</label>
                <select
                  value={indentSize}
                  onChange={(e) => setIndentSize(Number(e.target.value))}
                  className="bg-transparent border-none text-[10px] font-bold text-cyan-400 uppercase tracking-widest focus:ring-0 cursor-pointer"
                >
                  <option value={2} className="bg-neutral-900">2 Spaces</option>
                  <option value={4} className="bg-neutral-900">4 Spaces</option>
                  <option value={8} className="bg-neutral-900">8 Spaces</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">Source Code Payload</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Paste ${language.toUpperCase()} protocol here...`}
                  className="w-full h-64 bg-black/40 border border-white/[0.05] rounded-md px-6 py-5 text-sm font-mono focus:outline-none focus:border-cyan-400/50 transition-all resize-none scrollbar-hide"
                />
              </div>
            </div>

            <button
              onClick={formatCode}
              disabled={!input.trim() || isFormatting}
              className="w-full py-4 bg-cyan-400 hover:bg-cyan-300 disabled:bg-white/5 disabled:text-white/20 text-black rounded-md font-outfit font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-400/10"
            >
              {isFormatting ? (
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  <Sparkles size={14} />
                  Refine Syntactic Structure
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel: Syntactic Refinement */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden min-h-[600px] flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full flex-1">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase mb-2">Refined Protocol</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Syntactic Output</h2>
                </div>
                {output && !error && (
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
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-red-500/5 border border-red-500/10 rounded-md flex items-center gap-4 text-red-400"
                    >
                      <Trash2 size={20} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">{error}</p>
                    </motion.div>
                  ) : (
                    <div className="w-full flex-1 min-h-[300px] bg-black/60 border border-white/[0.05] rounded-md p-6 font-mono text-sm overflow-y-auto text-white/80 scrollbar-hide">
                      {output ? (
                        <pre className="whitespace-pre-wrap">{output}</pre>
                      ) : (
                        <span className="text-white/10 italic">Awaiting Syntactic Feed...</span>
                      )}
                    </div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-white/[0.05]">
                  <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                    <div className="flex items-center gap-3 text-cyan-400">
                      <Zap size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Prettier Engine</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                      Leverages industry-standard AST parsing for consistent formatting across protocols.
                    </p>
                  </div>
                  <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <ShieldCheck size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Privacy Protocol</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                      Processing is executed locally within the Sovereign sandbox environment.
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
