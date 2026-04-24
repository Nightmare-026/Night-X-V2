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
} from 'lucide-react';
import { cn, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import AIErrorMessage from '@/components/ui/AIErrorMessage';

export default function UrlShortener() {
  const { addToast } = useToast();
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
      addToast("URL shortened successfully!", "success");
    } catch (err: any) {
      setError(err.message);
      addToast(err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      const success = await copyToClipboard(result.shortUrl);
      if (success) {
        addToast("Shortened link copied!", "success");
      }
    }
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
    setError(null);
    addToast("Form cleared", "info");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      {/* Main Input Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-[40px] blur-2xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
        
        <div className="relative bg-white/5 border border-white/10 rounded-[36px] p-2 backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
            <div className="flex-1 flex items-center gap-4 px-6 py-4">
              <div className={cn(
                "p-3 rounded-2xl transition-colors",
                loading ? "bg-accent-purple/20 text-accent-purple animate-pulse" : "bg-white/5 text-white/20"
              )}>
                <LinkIcon size={24} />
              </div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your long link here..."
                className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-white text-lg placeholder:text-white/10"
                required
              />
            </div>
            
            <div className="flex gap-2 p-2">
              {url && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-4 bg-white/5 hover:bg-red-500/10 text-white/40 hover:text-red-400 rounded-2xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              )}
              <button
                type="submit"
                disabled={loading || !url}
                className="px-8 py-4 bg-accent-purple hover:bg-white hover:text-black disabled:opacity-30 disabled:hover:bg-accent-purple disabled:hover:text-white text-white rounded-2xl font-black text-xs uppercase tracking-[0.1em] transition-all shadow-xl shadow-accent-purple/20 flex items-center gap-3 whitespace-nowrap"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Shorten Now
                    <Zap size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <AIErrorMessage error={error} />
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-1 rounded-[40px] bg-gradient-to-br from-accent-purple/20 via-accent-cyan/10 to-transparent border border-white/10"
          >
            <div className="bg-[#0A0C14] rounded-[38px] p-8 md:p-10 space-y-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="text-[10px] font-black tracking-[0.2em] text-accent-cyan uppercase mb-2">Success</div>
                  <h3 className="text-2xl font-bold font-syne">Your link is ready</h3>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/5 text-xs font-bold transition-all"
                  >
                    <Copy size={14} />
                    Copy Code
                  </button>
                  <a 
                    href={result.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-accent-cyan text-black rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    <ExternalLink size={14} />
                    Visit Link
                  </a>
                </div>
              </div>

              <div className="relative group/link overflow-hidden">
                <div className="absolute inset-0 bg-accent-cyan/5 opacity-0 group-hover/link:opacity-100 transition-opacity rounded-3xl" />
                <div className="relative flex items-center justify-between p-6 bg-black/40 rounded-3xl border border-white/5 backdrop-blur-sm">
                  <span className="font-mono text-xl md:text-3xl text-white tracking-tight truncate pr-4">
                    {result.shortUrl}
                  </span>
                  <div className="hidden md:flex items-center gap-2 text-white/20 font-bold uppercase text-[10px] tracking-widest shrink-0">
                    Active Link
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                  <div className="text-accent-purple"><Globe size={20} /></div>
                  <span className="text-white/70 text-xs font-bold">Universal Reach</span>
                  <p className="text-[10px] text-white/30 leading-tight">Optimized for social media, emails, and bios globally.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                  <div className="text-accent-cyan"><MousePointer2 size={20} /></div>
                  <span className="text-white/70 text-xs font-bold">Safe Browsing</span>
                  <p className="text-[10px] text-white/30 leading-tight">All links are scanned for malicious content and phishing.</p>
                </div>
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2">
                  <div className="text-yellow-400"><Zap size={20} /></div>
                  <span className="text-white/70 text-xs font-bold">Nano Redirect</span>
                  <p className="text-[10px] text-white/30 leading-tight">Sub-10ms server response time for instant redirection.</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-12 border-t border-white/5 text-center">
        <p className="text-sm text-white/20 font-medium">
          Trusted by <span className="text-white/40">Night-X</span> power users for daily link management.
        </p>
      </div>
    </div>
  );
}
