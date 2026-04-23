'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, Copy, Check, ExternalLink, Zap, AlertCircle, History } from 'lucide-react';

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ shortUrl: string; shortCode: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity" />
          <div className="relative p-2 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-2 backdrop-blur-xl">
            <div className="pl-4 text-white/20">
              <Link className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a long link (e.g. https://very-long-url.com/path...)"
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 py-4 text-white placeholder:text-white/20"
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-900/20 flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Shorten
                </>
              )}
            </button>
          </div>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-white/10 rounded-3xl space-y-6"
            >
              <div className="space-y-2">
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Shortened Link</p>
                <div className="flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-white/5">
                  <span className="flex-1 font-mono text-xl text-white truncate">{result.shortUrl}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                    <a
                      href={result.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-white/40 text-sm px-2">
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span>Instant Redirect</span>
                </div>
                <span>&bull;</span>
                <div className="flex items-center gap-1">
                  <History className="w-3 h-3 text-purple-400" />
                  <span>Basic Click Count</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
          <h4 className="font-bold text-white">Simple Short Codes</h4>
          <p className="text-xs text-white/40">Night X creates a generated short code automatically for each link.</p>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
          <h4 className="font-bold text-white">Click Counter</h4>
          <p className="text-xs text-white/40">Each short URL keeps a basic redirect count for lightweight insight.</p>
        </div>
        <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-2">
          <h4 className="font-bold text-white">Fast Redirects</h4>
          <p className="text-xs text-white/40">Use shortened links in messages, bios, docs, and QR codes.</p>
        </div>
      </div>
    </div>
  );
}
