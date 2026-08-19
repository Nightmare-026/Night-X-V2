'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { History, ArrowLeft, Zap, Trash2, Clock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOOLS, Tool } from '@/lib/tools-registry';
import ToolCard from '@/components/dashboard/ToolCard';

interface HistoryItem {
  slug: string;
  timestamp: number;
}

export default function HistoryPage() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nightx_tool_history');
      if (stored) {
        setHistoryItems(JSON.parse(stored));
      } else {
        const now = Date.now();
        const initial = [
          { slug: 'image-compressor', timestamp: now - 1000 * 60 * 15 },
          { slug: 'password-generator', timestamp: now - 1000 * 60 * 60 * 2 },
          { slug: 'json-formatter', timestamp: now - 1000 * 60 * 60 * 5 },
          { slug: 'ai-paraphraser', timestamp: now - 1000 * 60 * 60 * 24 },
        ];
        setHistoryItems(initial);
        localStorage.setItem('nightx_tool_history', JSON.stringify(initial));
      }
    } catch {
      setHistoryItems([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const historyTools = historyItems
    .map((item) => {
      const tool = TOOLS.find((t) => t.slug === item.slug);
      return tool ? { tool, timestamp: item.timestamp } : null;
    })
    .filter(Boolean) as { tool: Tool; timestamp: number }[];

  const clearHistory = () => {
    setHistoryItems([]);
    try {
      localStorage.setItem('nightx_tool_history', JSON.stringify([]));
    } catch {}
  };

  const formatRelativeTime = (timestamp: number) => {
    const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);
    if (diffSeconds < 60) return 'Just now';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
    return `${Math.floor(diffSeconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-8">
      <div className="max-w-[1280px] mx-auto space-y-8">
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-text-tertiary hover:text-white transition-colors mb-2 group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-400">
                <History size={20} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Recent Tool Activity</h1>
                <p className="text-xs text-text-tertiary">Review and jump back into your recent workflows and tools</p>
              </div>
            </div>
          </div>

          {historyTools.length > 0 && (
            <button
              onClick={clearHistory}
              className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-surface-card border border-white/[0.08] hover:border-red-500/30 hover:bg-red-500/10 text-xs font-semibold text-text-secondary hover:text-red-400 transition-all flex items-center gap-2 shadow-[var(--shadow-raised-sm)]"
            >
              <Trash2 size={14} />
              Clear History
            </button>
          )}
        </div>

        {/* History Grid or Empty State */}
        {isLoaded && (
          <AnimatePresence mode="wait">
            {historyTools.length > 0 ? (
              <motion.div
                key="history-grid"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch"
              >
                {historyTools.map(({ tool, timestamp }) => (
                  <div key={`${tool.slug}-${timestamp}`} className="flex flex-col space-y-2">
                    <div className="flex items-center gap-1.5 px-2 text-[10px] font-mono text-text-muted">
                      <Clock size={11} className="text-primary-400" />
                      <span>{formatRelativeTime(timestamp)}</span>
                    </div>
                    <ToolCard tool={tool} />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-history"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-white/[0.08] bg-surface-card py-16 px-6 text-center max-w-lg mx-auto shadow-[var(--shadow-raised-md)]"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-primary-400">
                  <History size={32} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No Recent Activity</h2>
                <p className="text-xs text-text-tertiary mb-6 leading-relaxed">
                  Tools you use will automatically appear here for quick reopening.
                </p>
                <Link href="/tools" className="btn-primary inline-flex text-xs py-2.5 px-6">
                  <span>Browse All 42 Tools</span>
                  <ArrowRight size={14} className="ml-2" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
