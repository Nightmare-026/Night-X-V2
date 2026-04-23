'use client';

import React, { useState, useEffect } from 'react';
import { Send, Copy, Check, RotateCcw, Sparkles, Loader2, Info, UserCircle, Share2, Instagram, Linkedin, Twitter, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIErrorMessage from '@/components/ui/AIErrorMessage';

const AiBioGenerator = () => {
  const [keywords, setKeywords] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [tone, setTone] = useState('Catchy');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{ type: string; text: string }[]>([]);
  const [usage, setUsage] = useState({ count: 0, limit: 30 });
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/ai/usage?tool=ai-bio-generator');
      const data = await res.json();
      setUsage({ count: data.count, limit: data.limit });
    } catch (err) {
      console.error('Error fetching usage:', err);
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const handleGenerate = async () => {
    if (!keywords.trim() || isLoading || usage.count >= usage.limit) return;

    setIsLoading(true);
    setError('');
    setResults([]);

    try {
      const res = await fetch('/api/ai/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords, platform, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate bios');
      }

      setResults(data.bios || []);
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

  const platforms = [
    { name: 'Instagram', icon: <Instagram size={14} /> },
    { name: 'Twitter', icon: <Twitter size={14} /> },
    { name: 'LinkedIn', icon: <Linkedin size={14} /> },
    { name: 'TikTok', icon: <Share2 size={14} /> },
    { name: 'Portfolio', icon: <Globe size={14} /> }
  ];

  const tones = ['Catchy', 'Professional', 'Minimalist', 'Funny', 'Mysterious'];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Usage Header */}
      <div className="flex justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan">
            <UserCircle size={20} />
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
              className="h-full bg-accent-cyan"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-white/40 uppercase tracking-widest font-bold flex items-center gap-2">
              <Sparkles size={14} className="text-accent-cyan" />
              TELL AI ABOUT YOURSELF
            </label>
            <textarea
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. Software engineer, coffee lover, world traveler based in NYC..."
              className="w-full h-40 bg-black/30 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 transition-all resize-none text-white/90 leading-relaxed font-light custom-scrollbar"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Target Platform</label>
            <div className="grid grid-cols-3 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setPlatform(p.name)}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    platform === p.name 
                    ? 'bg-accent-cyan text-black font-bold' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {p.icon}
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Vibe / Tone</label>
            <div className="flex flex-wrap gap-2">
              {tones.map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    tone === t 
                    ? 'border-accent-cyan text-accent-cyan border' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-transparent'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!keywords.trim() || isLoading || usage.count >= usage.limit}
            className="w-full py-4 rounded-xl bg-accent-cyan text-black font-bold text-sm shadow-lg shadow-accent-cyan/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-cyan/90 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Generating...
              </>
            ) : (
              <>
                <Send size={18} />
                GENERATE BIOS
              </>
            )}
          </button>
          
          {error && (
            <AIErrorMessage error={error} />
          )}
        </div>

        {/* Results Panel */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
          <label className="text-xs text-white/40 uppercase tracking-widest font-bold mb-4">
            GENERATED BIOS
          </label>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] no-scrollbar pr-2">
            <AnimatePresence mode="popLayout">
              {results.length > 0 ? (
                results.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-white/5 border border-white/5 rounded-2xl p-5 hover:bg-white/[0.07] transition-all"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-accent-cyan uppercase tracking-tighter">
                        {result.type}
                      </span>
                      <button
                        onClick={() => handleCopy(result.text, idx)}
                        className="p-2 bg-black/40 rounded-lg text-white/40 hover:text-white transition-all border border-white/5"
                        title="Copy Bio"
                      >
                        {copiedIndex === idx ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-base text-white/90 leading-relaxed font-light italic">
                      &quot;{result.text}&quot;
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-20">
                  <UserCircle size={64} className="mb-4" />
                  <p className="text-sm font-medium italic">
                    {isLoading ? "Brewing your personality..." : "Your future bios will appear here"}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
          <Info size={18} className="text-accent-cyan" />
          Optimizing your Bio
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/60 leading-relaxed">
          <p>• <b>Instagram:</b> Keep it visual and use line breaks. Emojis help define your personality quickly.</p>
          <p>• <b>LinkedIn:</b> Focus on achievements and value proposition. Professional but approachable works best.</p>
          <p>• <b>Twitter:</b> Short, punchy, and include your current project or obsession.</p>
          <p>• <b>TikTok:</b> Use trending keywords and a strong call to action (CTA).</p>
        </div>
      </div>
    </div>
  );
};

export default AiBioGenerator;
