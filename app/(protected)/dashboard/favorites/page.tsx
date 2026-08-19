'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, ArrowLeft, Sparkles, Zap, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TOOLS, Tool } from '@/lib/tools-registry';
import ToolCard from '@/components/dashboard/ToolCard';

export default function FavoritesPage() {
  const [favoriteSlugs, setFavoriteSlugs] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nightx_favorites');
      if (stored) {
        setFavoriteSlugs(JSON.parse(stored));
      } else {
        setFavoriteSlugs(['image-compressor', 'json-formatter', 'password-generator', 'ai-paraphraser']);
      }
    } catch {
      setFavoriteSlugs(['image-compressor', 'json-formatter', 'password-generator']);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const favoriteTools = TOOLS.filter((tool) => favoriteSlugs.includes(tool.slug));

  const clearAllFavorites = () => {
    setFavoriteSlugs([]);
    try {
      localStorage.setItem('nightx_favorites', JSON.stringify([]));
    } catch {}
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
              <div className="w-10 h-10 rounded-xl bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center text-accent-amber">
                <Star size={20} fill="currentColor" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Favorite Tools</h1>
                <p className="text-xs text-text-tertiary">Quick access to your most-used utilities and workflows</p>
              </div>
            </div>
          </div>

          {favoriteTools.length > 0 && (
            <button
              onClick={clearAllFavorites}
              className="self-start sm:self-auto px-3.5 py-2 rounded-xl bg-surface-card border border-white/[0.08] hover:border-red-500/30 hover:bg-red-500/10 text-xs font-semibold text-text-secondary hover:text-red-400 transition-all flex items-center gap-2 shadow-[var(--shadow-raised-sm)]"
            >
              <Trash2 size={14} />
              Clear Favorites
            </button>
          )}
        </div>

        {/* Tools Grid or Empty State */}
        {isLoaded && (
          <AnimatePresence mode="wait">
            {favoriteTools.length > 0 ? (
              <motion.div
                key="favorites-grid"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 items-stretch"
              >
                {favoriteTools.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty-favorites"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-3xl border border-white/[0.08] bg-surface-card py-16 px-6 text-center max-w-lg mx-auto shadow-[var(--shadow-raised-md)]"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent-amber/10 border border-accent-amber/20 flex items-center justify-center mx-auto mb-4 text-accent-amber">
                  <Star size={32} />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">No Favorite Tools Yet</h2>
                <p className="text-xs text-text-tertiary mb-6 leading-relaxed">
                  Explore the catalog to pin your favorite instruments for one-click access.
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
