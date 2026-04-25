'use client';

import React, { useState, useEffect } from 'react';
import { Send, Copy, Check, RotateCcw, Sparkles, Loader2, Info, Languages, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIErrorMessage from '@/components/ui/AIErrorMessage';
import { safeFetch } from '@/lib/fetch-utils';

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
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Usage Header */}
      <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-purple/20 flex items-center justify-center text-accent-purple">
            <Sparkles size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold">AI Usage</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest">Free Daily Credits</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-mono font-bold text-white">{usage.count}/{usage.limit}</p>
          <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(usage.count / usage.limit) * 100}%` }}
              className="h-full bg-gradient-to-r from-accent-purple to-accent-cyan"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs text-white/40 uppercase tracking-widest font-bold flex items-center gap-2">
              <Languages size={14} />
              SOURCE TEXT
            </label>
            <button
              onClick={() => setText('')}
              className="p-1.5 text-white/40 hover:text-white transition-colors"
              title="Clear"
            >
              <RotateCcw size={16} />
            </button>
          </div>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the text you want to rewrite..."
            className="w-full h-80 bg-black/30 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-accent-purple/50 transition-all resize-none text-white/90 leading-relaxed font-light custom-scrollbar"
          />

          <div className="space-y-3">
            <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Select Tone</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    tone === t 
                    ? 'bg-accent-purple text-white' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleParaphrase}
            disabled={!text.trim() || isLoading || usage.count >= usage.limit}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-white font-bold text-sm shadow-lg shadow-accent-purple/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Paraphrasing...
              </>
            ) : (
              <>
                <Send size={18} />
                REWRITE WITH AI
              </>
            )}
          </button>
          
          {error && (
            <AIErrorMessage error={error} />
          )}
        </div>

        {/* Results Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
          <label className="text-xs text-white/40 uppercase tracking-widest font-bold flex items-center gap-2 mb-4">
            <History size={14} />
            AI VARIATIONS
          </label>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] no-scrollbar pr-2">
            <AnimatePresence mode="popLayout">
              {results.length > 0 ? (
                results.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-white/5 border border-white/5 rounded-xl p-4 hover:border-accent-purple/30 transition-all"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent-purple/10 text-accent-purple font-bold uppercase">
                        {result.tone}
                      </span>
                      <button
                        onClick={() => handleCopy(result.text, idx)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-white/40 hover:text-white transition-all"
                        title="Copy Variation"
                      >
                        {copiedIndex === idx ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-sm text-white/70 leading-relaxed font-light">
                      {result.text}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/10 mb-4 border border-white/5">
                    <Sparkles size={32} />
                  </div>
                  <p className="text-sm text-white/20 font-medium italic">
                    {isLoading ? "Analyzing and rewriting..." : "Enter text and click rewrite to see magic"}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
          <Info size={18} className="text-accent-purple" />
          Pro Tips for Paraphrasing
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/60 leading-relaxed">
          <p>• Select <b>Formal</b> for business emails, reports, or academic papers to maintain a professional standard.</p>
          <p>• Use <b>Creative</b> mode for blog posts, social media, or storytelling to add flair and unique expression.</p>
          <p>• Try <b>Shorten</b> when you need to be concise or meet character limits without losing the core message.</p>
          <p>• All AI processing is private and happens securely via our advanced language models.</p>
        </div>
      </div>
    </div>
  );
};

export default AiParaphraser;
