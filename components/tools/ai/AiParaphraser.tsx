'use client';

import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Copy, 
  Check, 
  RotateCcw, 
  Sparkles, 
  Loader2, 
  Info, 
  Languages, 
  History,
  Brain,
  Cpu,
  Layers,
  Zap,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIErrorMessage from '@/components/ui/AIErrorMessage';
import { safeFetch } from '@/lib/fetch-utils';
import { cn } from '@/lib/utils';

const AiParaphraser = () => {
  const [text, setText] = useState('');
  const [tone, setTone] = useState('Standard');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ tone: string; text: string }[]>([]);
  const [usage, setUsage] = useState({ count: 0, limit: 30 });
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchUsage = async () => {
    try {
      const data = await safeFetch('/api/ai/usage?tool=ai-paraphraser');
      setUsage({ count: data.count, limit: data.limit });
    } catch (err) {
      console.error('Error fetching usage:', err);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const handleParaphrase = async () => {
    if (!text.trim() || isLoading || usage.count >= usage.limit) return;

    setIsLoading(true);
    setError('');
    setResults([]);

    try {
      const data = await safeFetch('/api/ai/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, tone }),
      });

      setResults(data.variations || []);
      fetchUsage();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const tones = ['Standard', 'Formal', 'Creative', 'Casual', 'Academic', 'Shorten', 'Expand'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Panel: Semantic Parameters (5 Columns) */}
      <div className="lg:col-span-5 space-y-6">
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Brain size={120} />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 font-outfit">
                Semantic Parameters
              </h2>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                  <Languages size={12} />
                  Source Intelligence
                </label>
                <button
                  onClick={() => setText('')}
                  className="p-1.5 text-white/20 hover:text-red-400 transition-colors"
                  title="Reset Input"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
              
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Initialize semantic input here..."
                className="w-full h-64 bg-white/[0.02] border border-white/[0.05] rounded-md px-4 py-3 focus:outline-none focus:border-violet-400/50 transition-all resize-none text-sm text-white/80 leading-relaxed font-inter custom-scrollbar"
              />
            </div>

            {/* Tone Selector */}
            <div className="space-y-4 pt-2">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">
                Rewrite Protocol (Tone)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      "px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border",
                      tone === t 
                        ? "bg-violet-400/10 border-violet-400/30 text-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.1)]" 
                        : "bg-white/[0.02] border-white/[0.05] text-white/40 hover:bg-white/[0.05] hover:text-white"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleParaphrase}
              disabled={!text.trim() || isLoading || usage.count >= usage.limit}
              className="w-full py-4 rounded-md bg-violet-400 text-black font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-violet-400/20 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-violet-300 transition-all group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Processing Matrix...
                </>
              ) : (
                <>
                  <Zap size={16} fill="currentColor" />
                  Execute Rewrite
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {error && <AIErrorMessage error={error} />}
          </div>

          {/* Footer Trace */}
          <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-between opacity-50">
            <div className="flex items-center gap-2">
              <Cpu size={12} className="text-violet-400" />
              <span className="text-[10px] font-mono text-white/40 tracking-tighter">ENGINE: GPT-4O-PRO</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-white/40 block">QUOTA</span>
                <span className="text-xs font-mono font-bold text-white">{usage.count}/{usage.limit}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Module */}
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md">
          <div className="flex items-center gap-2 mb-4">
            <Info size={14} className="text-violet-400" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Optimizing AI Output</h3>
          </div>
          <div className="space-y-3 text-[11px] text-white/40 leading-relaxed font-inter">
            <p><strong className="text-violet-400/80">Formal Protocol:</strong> Recommended for technical documentation, cross-departmental reports, and high-stakes communication.</p>
            <p><strong className="text-violet-400/80">Creative Protocol:</strong> Best for brand identity work, social storytelling, and breaking through generic messaging.</p>
            <p><strong className="text-violet-400/80">Context Integrity:</strong> Ensure your input maintains logical coherence for the highest quality neural transformation.</p>
          </div>
        </section>
      </div>

      {/* Right Panel: Rephrasing Engine (7 Columns) */}
      <div className="lg:col-span-7 h-full">
        <div className="glass-card border-white/[0.05] bg-black/40 p-8 rounded-md min-h-[600px] flex flex-col relative overflow-hidden h-full">
          {/* Subtle Background Detail */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-violet-400/10 flex items-center justify-center border border-violet-400/20">
                <Layers size={16} className="text-violet-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Neural Variations</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Output Stack // Variations Generated</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pr-2">
            <AnimatePresence mode="popLayout">
              {results.length > 0 ? (
                results.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-white/[0.03] border border-white/[0.05] rounded-md p-6 hover:bg-white/[0.05] hover:border-violet-400/30 transition-all shadow-inner"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-violet-400/10 text-violet-400 font-bold uppercase tracking-tighter border border-violet-400/20">
                          {result.tone}
                        </span>
                        <span className="text-[9px] text-white/20 font-mono">VAR_{idx + 1}.LOG</span>
                      </div>
                      <button
                        onClick={() => handleCopy(result.text, idx)}
                        className="p-2 rounded-md bg-black/40 border border-white/[0.05] text-white/40 hover:text-violet-400 hover:border-violet-400/30 transition-all opacity-0 group-hover:opacity-100"
                        title="Copy to Clipboard"
                      >
                        {copiedIndex === idx ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed font-inter italic">
                      &quot;{result.text}&quot;
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-20 h-20 rounded-md bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-white/5 mb-6 relative">
                    <Sparkles size={40} className="relative z-10" />
                    <div className="absolute inset-0 bg-violet-400/5 blur-xl rounded-full" />
                  </div>
                  <h3 className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-2 font-outfit">
                    {isLoading ? "Analyzing Semantic Matrix..." : "Awaiting Matrix Initialization"}
                  </h3>
                  <p className="text-[11px] text-white/20 max-w-xs mx-auto leading-relaxed uppercase tracking-widest font-mono">
                    {isLoading 
                      ? "Neural nodes are processing your request. Estimated completion: < 2s" 
                      : "Enter source text in the left control module to generate neural rephrasing variations."}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};




export default AiParaphraser;
