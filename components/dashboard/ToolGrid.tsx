'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { TOOLS, ToolCategory, searchTools } from '@/lib/tools-registry';
import ToolCard from './ToolCard';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX, FilterX, RotateCcw } from 'lucide-react';
import CategoryFilter from './CategoryFilter';

export default function ToolGrid() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ToolCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleSearch = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setSearchQuery(detail || '');
    };

    window.addEventListener('tool-search', handleSearch);
    return () => window.removeEventListener('tool-search', handleSearch);
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    const query = searchParams.get('search');

    if (category && ['image', 'security', 'text', 'developer', 'utility', 'life', 'ai', 'all'].includes(category)) {
      setActiveCategory(category as ToolCategory | 'all');
    }

    if (query !== null) {
      setSearchQuery(query);
      window.dispatchEvent(new CustomEvent('tool-search-sync', { detail: query }));
    }
  }, [searchParams]);

  const filteredTools = useMemo(() => {
    let result = TOOLS;

    if (searchQuery.trim()) {
      result = searchTools(searchQuery);
    }

    if (activeCategory !== 'all') {
      result = result.filter((tool) => tool.category === activeCategory);
    }

    return result;
  }, [searchQuery, activeCategory]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setActiveCategory('all');
    window.dispatchEvent(new CustomEvent('tool-search-sync', { detail: '' }));
  }, []);

  const toolCounts = useMemo(() => {
    return TOOLS.reduce((acc, tool) => {
      acc[tool.category] = (acc[tool.category] || 0) + 1;
      acc.all = (acc.all || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="h-10 w-64 bg-white/5 animate-pulse rounded-full mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="glass-card h-64 w-full animate-pulse opacity-50" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          toolCounts={toolCounts}
        />
      </div>

      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-syne font-bold flex items-center gap-2">
          {activeCategory === 'all' ? 'All Tools' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Tools`}
          <span className="text-white/40 text-sm font-dm-sans font-normal" aria-live="polite">
            ({filteredTools.length} found)
          </span>
        </h2>

        {(searchQuery || activeCategory !== 'all') && (
          <button
            onClick={clearFilters}
            className="text-xs font-medium text-white/40 hover:text-white flex items-center gap-1 transition-colors shrink-0"
          >
            <RotateCcw size={12} />
            Clear Filters
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {filteredTools.length > 0 ? (
          <motion.div
            key="grid"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredTools.map((tool) => (
              <motion.div key={tool.slug} variants={itemVariants} layout>
                <ToolCard tool={tool} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-20 glass-card"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
              {searchQuery ? <SearchX className="text-white/20" size={40} /> : <FilterX className="text-white/20" size={40} />}
            </div>
            <h3 className="text-xl font-bold mb-2">No tools found</h3>
            <p className="text-white/40 mb-6 text-center max-w-xs">
              We couldn&apos;t find any tools matching your {searchQuery ? 'search' : 'filters'}. Try something else.
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Reset All Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
