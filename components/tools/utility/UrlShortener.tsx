'use client';

import React, { useState, useEffect } from 'react';
import { 
  Link as LinkIcon, 
  Copy, 
  Check, 
  ExternalLink, 
  Zap, 
  Globe, 
  Share2,
  Trash2,
  QrCode,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface ShortenedLink {
  originalUrl: string;
  shortUrl: string;
  shortCode: string;
  createdAt: number;
}

export default function UrlShortener() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ shortUrl: string; shortCode: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<ShortenedLink[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nightx_short_links');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveToHistory = (item: ShortenedLink) => {
    const updated = [item, ...history.filter(h => h.shortCode !== item.shortCode)].slice(0, 10);
    setHistory(updated);
    try {
      localStorage.setItem('nightx_short_links', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          url: url.trim(),
          customCode: customAlias.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      setResult(data);
      saveToHistory({
        originalUrl: url.trim(),
        shortUrl: data.shortUrl,
        shortCode: data.shortCode,
        createdAt: Date.now()
      });
      toast("Short link created successfully!", "success");
    } catch (err: any) {
      setError(err.message || 'Error creating short URL');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (textToCopy?: string) => {
    const text = textToCopy || result?.shortUrl;
    if (text) {
      const success = await copyToClipboard(text);
      if (success) {
        setCopied(true);
        toast("Copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('nightx_short_links');
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Interface */}
        <div className="lg:col-span-8 space-y-5">
          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-sm)] space-y-6">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-white">Private Short Link Generator</h2>
              <p className="text-xs text-text-tertiary">
                Transform long, cumbersome URLs into clean, fast redirect links with zero tracking cookies.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="long-url" className="text-xs font-semibold text-text-secondary block">
                  Destination URL
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                    <LinkIcon size={16} />
                  </div>
                  <input
                    id="long-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/very-long-destination-url-here"
                    className="w-full h-11 bg-surface-inset border border-white/10 rounded-xl pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-text-muted outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 shadow-inner transition-all font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="custom-alias" className="text-xs font-semibold text-text-secondary flex justify-between">
                  <span>Custom Alias</span>
                  <span className="text-text-muted font-normal lowercase">(optional)</span>
                </label>
                <input
                  id="custom-alias"
                  type="text"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))}
                  placeholder="e.g. project-launch"
                  className="w-full h-10 bg-surface-inset border border-white/10 rounded-xl px-3.5 text-xs text-white placeholder:text-text-muted outline-none focus:border-primary/60 shadow-inner transition-all font-mono"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="btn-primary w-full h-11 text-xs font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-40"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Zap size={15} />}
                <span>{loading ? 'Creating Short URL...' : 'Shorten Link'}</span>
              </button>
            </form>

            {/* Result Box */}
            {result && (
              <div className="p-5 rounded-2xl bg-surface-inset border border-primary/30 space-y-4 shadow-sm animate-fade-in-up">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Check size={12} />
                    <span>Short Link Ready</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy()}
                      className="px-3 py-1.5 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <a
                      href={result.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-white/[0.05] hover:bg-white/10 text-white rounded-lg border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <ExternalLink size={13} />
                      <span>Open</span>
                    </a>
                  </div>
                </div>

                <div className="p-3 bg-surface-card rounded-xl border border-white/[0.08] flex items-center justify-between">
                  <span className="font-mono text-sm sm:text-base font-bold text-white truncate pr-4">
                    {result.shortUrl}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* History List */}
          {history.length > 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-6 shadow-[var(--shadow-raised-sm)] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Your Recent Short Links</h3>
                <button
                  onClick={clearHistory}
                  className="text-[11px] text-text-muted hover:text-red-400 flex items-center gap-1 transition-colors"
                >
                  <Trash2 size={12} />
                  <span>Clear</span>
                </button>
              </div>

              <div className="space-y-2">
                {history.map((item) => (
                  <div 
                    key={item.shortCode}
                    className="p-3 rounded-xl bg-surface-inset border border-white/[0.04] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-mono font-bold text-primary truncate">{item.shortUrl}</p>
                      <p className="text-[11px] text-text-muted truncate">{item.originalUrl}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(item.shortUrl)}
                      className="p-1.5 rounded-lg bg-surface-card border border-white/10 hover:border-primary/30 text-text-muted hover:text-white transition-colors shrink-0"
                      aria-label="Copy short link"
                    >
                      <Copy size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-6 shadow-[var(--shadow-raised-sm)] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
              <Globe size={14} className="text-primary" />
              <span>Link Capabilities</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-inset border border-white/[0.04] space-y-1">
                <p className="font-bold text-white">Safe Redirection</p>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Every link is validated against malicious protocols before redirection.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-inset border border-white/[0.04] space-y-1">
                <p className="font-bold text-white">High-Speed Edge Routing</p>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  Sub-30ms redirect latency using serverless edge handlers.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-inset border border-white/[0.04] space-y-1">
                <p className="font-bold text-white">Zero Tracking Cookies</p>
                <p className="text-[11px] text-text-muted leading-relaxed">
                  No invasive tracking pixels or cross-site fingerprinting.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
