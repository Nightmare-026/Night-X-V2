'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link as LinkIcon, 
  Copy, 
  Check, 
  ExternalLink, 
  Zap, 
  AlertCircle, 
  History, 
  Globe, 
  MousePointer2, 
  Share2,
  Trash2,
  ArrowRight
, RefreshCw} from 'lucide-react';
import { cn, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import AIErrorMessage from '@/components/ui/AIErrorMessage';

export default function UrlShortener() {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ shortUrl: string; shortCode: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      const success = await copyToClipboard(result.shortUrl);
      if (success) {
        toast("Shortened link copied", "success");
      }
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Interface */}
        <div className="lg:col-span-8 order-2 lg:order-1 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 min-h-[400px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 space-y-12">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-accent-blue uppercase mb-2">Accelerator</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Nano Link Engine</h2>
                </div>
                {url && (
                  <button
                    onClick={handleReset}
                    className="p-3 bg-white/[0.02] hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded-md border border-white/[0.05] transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-accent-blue/20 blur opacity-0 group-focus-within:opacity-100 transition-opacity rounded-md" />
                  <div className="relative flex items-center bg-black/40 border border-white/[0.1] rounded-md overflow-hidden transition-all focus-within:border-accent-blue/50">
                    <div className="pl-6 text-white/20">
                      <LinkIcon size={20} />
                    </div>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Enter long destination URL..."
                      className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-white text-base py-6 px-6 placeholder:text-white/10 font-inter"
                      required
                    />
                    <div className="p-2">
                      <button
                        type="submit"
                        disabled={loading || !url}
                        className="px-8 py-4 bg-white text-black disabled:opacity-30 rounded-md font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-white/90 flex items-center gap-3 whitespace-nowrap shadow-xl"
                      >
                        {loading ? (
                          <RefreshCw size={14} className="animate-spin" />
                        ) : (
                          <>
                            Synthesize
                            <Zap size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                {error && <AIErrorMessage error={error} />}
              </form>

              <AnimatePresence mode="wait">
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6 pt-12 border-t border-white/[0.05]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                        <Check size={12} className="text-accent-blue" />
                        Injection Complete
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleCopy}
                          className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] hover:bg-white/[0.05] text-white/60 hover:text-white rounded-md border border-white/[0.05] text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                          <Copy size={14} />
                          Buffer Copy
                        </button>
                        <a 
                          href={result.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-accent-blue/10 text-accent-blue rounded-md border border-accent-blue/20 text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-accent-blue hover:text-white"
                        >
                          <ExternalLink size={14} />
                          Execute
                        </a>
                      </div>
                    </div>

                    <div className="relative group/link">
                      <div className="absolute -inset-1 bg-accent-blue/5 blur opacity-0 group-hover/link:opacity-100 transition-opacity rounded-md" />
                      <div className="relative flex items-center justify-between p-8 bg-black/60 rounded-md border border-white/[0.1] backdrop-blur-sm group-hover:border-accent-blue/30 transition-all">
                        <span className="font-outfit text-3xl text-white tracking-tight truncate pr-8">
                          {result.shortUrl}
                        </span>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right hidden sm:block">
                            <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Protocol</div>
                            <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Secure TLS</div>
                          </div>
                          <div className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Globe className="text-accent-blue" size={16} />
              <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Link Intelligence</h3>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] space-y-4">
                <div className="flex items-center gap-3 text-accent-blue">
                  <MousePointer2 size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Safe Browsing</span>
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-wide leading-relaxed font-inter">
                  Real-time phishing detection and malicious content scanning active on all generated nodes.
                </p>
              </div>

              <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] space-y-4">
                <div className="flex items-center gap-3 text-accent-blue">
                  <History size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Instant Flux</span>
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-wide leading-relaxed font-inter">
                  Sub-10ms redirection latency powered by our global edge network delivery system.
                </p>
              </div>

              <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] space-y-4">
                <div className="flex items-center gap-3 text-accent-blue">
                  <Share2 size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Universal Node</span>
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-wide leading-relaxed font-inter">
                  Optimized for social metadata headers, ensuring rich previews across all major platforms.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-accent-blue/5 border border-accent-blue/10 rounded-md">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle size={14} className="text-accent-blue" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent-blue">Pro Status</span>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-inter">
              Unlimited synthesis active for authorized users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
