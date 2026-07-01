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
  UserCircle, 
  Share2, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Globe,
  Zap,
  ChevronRight,
  Fingerprint,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AIErrorMessage from '@/components/ui/AIErrorMessage';
import { safeFetch } from '@/lib/fetch-utils';
import { cn } from '@/lib/utils';

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
      const data = await safeFetch('/api/ai/usage?tool=ai-bio-generator');
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
      const data = await safeFetch('/api/ai/bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords, platform, tone }),
      });

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Panel: Identity Configuration (5 Columns) */}
      <div className="lg:col-span-5 space-y-6">
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Fingerprint size={120} />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.6)]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 font-outfit">
                Identity Configuration
              </h2>
            </div>

            {/* Input Section */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={12} className="text-violet-400" />
                Profile Intelligence
              </label>
              <textarea
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="e.g. Software engineer, coffee lover, world traveler based in NYC..."
                className="w-full h-40 bg-white/[0.02] border border-white/[0.05] rounded-md px-4 py-3 focus:outline-none focus:border-violet-400/50 transition-all resize-none text-sm text-white/80 leading-relaxed font-inter custom-scrollbar"
              />
            </div>

            {/* Platform Selector */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">
                Target Protocol (Platform)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {platforms.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setPlatform(p.name)}
                    className={cn(
                      "flex items-center justify-center gap-2 px-3 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all border",
                      platform === p.name 
                        ? "bg-violet-400/10 border-violet-400/30 text-violet-400 shadow-[0_0_15px_rgba(167,139,250,0.1)]" 
                        : "bg-white/[0.02] border-white/[0.05] text-white/40 hover:bg-white/[0.05] hover:text-white"
                    )}
                  >
                    {p.icon}
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Tone Selector */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">
                Persona Aesthetic (Tone)
              </label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest transition-all border",
                      tone === t 
                        ? "border-violet-400/50 text-violet-400 bg-violet-400/5" 
                        : "bg-white/[0.02] border-white/[0.05] text-white/40 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handleGenerate}
              disabled={!keywords.trim() || isLoading || usage.count >= usage.limit}
              className="w-full py-4 rounded-md bg-violet-400 text-black font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-violet-400/20 flex items-center justify-center gap-3 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-violet-300 transition-all group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Synthesizing...
                </>
              ) : (
                <>
                  <Zap size={16} fill="currentColor" />
                  Generate Identity
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
              <span className="text-[10px] font-mono text-white/40 tracking-tighter">BIO_ENGINE: VER_2.4</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] font-mono text-white/40 block">CREDITS</span>
                <span className="text-xs font-mono font-bold text-white">{usage.count}/{usage.limit}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Info Module */}
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md">
          <div className="flex items-center gap-2 mb-4">
            <Info size={14} className="text-violet-400" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Identity Optimization</h3>
          </div>
          <div className="space-y-3 text-[11px] text-white/40 leading-relaxed font-inter">
            <p><strong className="text-violet-400/80">Platform Integrity:</strong> Each platform has specific character limits and stylistic conventions. AI automatically adapts the output.</p>
            <p><strong className="text-violet-400/80">Tone Mapping:</strong> Select &quot;Catchy&quot; for high engagement, or &quot;Professional&quot; for credibility-first environments like LinkedIn.</p>
          </div>
        </section>
      </div>

      {/* Right Panel: Generated Profiles (7 Columns) */}
      <div className="lg:col-span-7 h-full">
        <div className="glass-card border-white/[0.05] bg-black/40 p-8 rounded-md min-h-[600px] flex flex-col relative overflow-hidden h-full">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-400/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-violet-400/10 flex items-center justify-center border border-violet-400/20">
                <UserCircle size={16} className="text-violet-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Generated Profiles</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Neural Outputs // Identity Stack</p>
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar pr-2">
            <AnimatePresence mode="popLayout">
              {results.length > 0 ? (
                results.map((result, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.98, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-white/[0.03] border border-white/[0.05] rounded-md p-6 hover:bg-white/[0.05] hover:border-violet-400/30 transition-all shadow-inner"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold text-violet-400 uppercase tracking-widest px-2 py-0.5 bg-violet-400/10 rounded-full border border-violet-400/20">
                          {result.type}
                        </span>
                        <span className="text-[9px] text-white/20 font-mono">PROFILE_{idx + 1}.EXE</span>
                      </div>
                      <button
                        onClick={() => handleCopy(result.text, idx)}
                        className="p-2 rounded-md bg-black/40 border border-white/[0.05] text-white/40 hover:text-violet-400 hover:border-violet-400/30 transition-all opacity-0 group-hover:opacity-100"
                        title="Copy to Clipboard"
                      >
                        {copiedIndex === idx ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <p className="text-base text-white/90 leading-relaxed font-inter italic border-l-2 border-violet-400/20 pl-4">
                      &quot;{result.text}&quot;
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <div className="w-20 h-20 rounded-md bg-white/[0.02] border border-white/[0.05] flex items-center justify-center text-white/5 mb-6 relative">
                    <UserCircle size={40} className="relative z-10" />
                    <div className="absolute inset-0 bg-violet-400/5 blur-xl rounded-full" />
                  </div>
                  <h3 className="text-sm font-bold text-white/40 uppercase tracking-[0.2em] mb-2 font-outfit">
                    {isLoading ? "Synthesizing Identity..." : "Awaiting Parameters"}
                  </h3>
                  <p className="text-[11px] text-white/20 max-w-xs mx-auto leading-relaxed uppercase tracking-widest font-mono">
                    {isLoading 
                      ? "The identity engine is processing your keywords. Estimated completion: < 3s" 
                      : "Configure your profile intelligence in the left module to generate identity variations."}
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

export default AiBioGenerator;
