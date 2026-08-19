'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  SlidersHorizontal,
  X,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { TOOLS, CATEGORIES, Tool, ToolCategory } from '@/lib/tools-registry';
import { cn } from '@/lib/utils';
import { ToolIcon } from '@/components/ui/ToolIcon';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/States';

export default function ToolsCatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'client' | 'ai' | 'pro'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'name-asc' | 'name-desc'>('default');

  const filteredTools = useMemo(() => {
    let list = TOOLS;

    // Filter by Category
    if (selectedCategory !== 'all') {
      list = list.filter(t => t.category === selectedCategory);
    }

    // Filter by Type
    if (selectedFilter === 'client') {
      list = list.filter(t => t.processingType === 'client');
    } else if (selectedFilter === 'ai') {
      list = list.filter(t => t.isAI);
    } else if (selectedFilter === 'pro') {
      list = list.filter(t => t.isPro);
    }

    // Search query
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q)) ||
        t.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'name-asc') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      list = [...list].sort((a, b) => b.name.localeCompare(a.name));
    }

    return list;
  }, [searchQuery, selectedCategory, selectedFilter, sortBy]);

  const activeCategoryMeta = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 sm:px-6">
      <div className="max-w-[1280px] mx-auto space-y-10">
        
        {/* Page Header */}
        <header className="text-center max-w-3xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary-400 shadow-sm">
            <Layers size={14} />
            <span>Complete Utility Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Explore All 42+ Tools & Utilities
          </h1>

          <p className="text-sm sm:text-base text-text-tertiary leading-relaxed">
            High-speed, browser-first instruments for file processing, cryptography, text manipulation, and development without server tracking.
          </p>
        </header>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-6 rounded-2xl border border-white/[0.08] bg-surface-card shadow-[var(--shadow-raised-md)] space-y-4">
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter tools by keyword, format, tag..."
                className="w-full bg-surface-inset border border-white/10 rounded-xl pl-10 pr-9 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 shadow-[var(--shadow-inset-sm)] transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Filter Tags & Sorting */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
              {/* Type Filters */}
              <div className="flex items-center gap-1 bg-surface-inset p-1 rounded-xl border border-white/[0.06]">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'client', label: '100% Private' },
                  { id: 'ai', label: 'AI Powered' },
                  { id: 'pro', label: 'Advanced' },
                ].map((flt) => (
                  <button
                    key={flt.id}
                    onClick={() => setSelectedFilter(flt.id as any)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                      selectedFilter === flt.id 
                        ? "bg-primary text-black shadow-sm" 
                        : "text-text-secondary hover:text-white"
                    )}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="relative flex items-center gap-1.5 bg-surface-inset px-3 py-1.5 rounded-xl border border-white/[0.06] text-xs font-medium text-text-secondary">
                <ArrowUpDown size={13} className="text-text-muted" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-white outline-none cursor-pointer pr-2"
                >
                  <option value="default" className="bg-[#0E1118]">Featured</option>
                  <option value="name-asc" className="bg-[#0E1118]">Name (A-Z)</option>
                  <option value="name-desc" className="bg-[#0E1118]">Name (Z-A)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar pt-2 border-t border-white/[0.06]">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count = cat.id === 'all' 
                ? TOOLS.length 
                : TOOLS.filter(t => t.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0",
                    isActive
                      ? "bg-primary/15 border-primary/40 text-primary-300 shadow-[var(--shadow-raised-sm)]"
                      : "bg-surface-inset border-white/[0.05] text-text-secondary hover:text-white hover:border-white/15"
                  )}
                >
                  <ToolIcon name={cat.icon} className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px]",
                    isActive ? "bg-primary text-black font-bold" : "bg-white/10 text-text-muted"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-text-muted px-1">
          <p>
            Showing <span className="font-bold text-white">{filteredTools.length}</span> tools in <span className="font-bold text-primary-400">{activeCategoryMeta?.label}</span>
          </p>
          {searchQuery && (
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedFilter('all'); }}
              className="text-primary-400 hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Tools Grid */}
        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredTools.map((tool) => (
              <motion.div
                key={tool.slug}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col"
              >
                <div className="flex flex-col h-full rounded-2xl border border-white/[0.08] bg-surface-card p-5 hover:border-primary/40 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden shadow-[var(--shadow-raised-sm)]">
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-surface-inset border border-white/10 flex items-center justify-center text-primary-400 group-hover:scale-105 group-hover:border-primary/30 transition-all">
                      <ToolIcon name={tool.icon} className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      {tool.processingType === 'client' && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <ShieldCheck size={10} /> Local
                        </span>
                      )}
                      {tool.isAI && (
                        <span className="px-2 py-0.5 rounded-full bg-accent-pink/15 border border-accent-pink/30 text-[9px] font-bold text-accent-pink uppercase tracking-wider">
                          AI
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tool Details */}
                  <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors mb-1.5">
                    {tool.name}
                  </h3>

                  <p className="text-xs text-text-tertiary leading-[1.6] mb-4 flex-1">
                    {tool.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tool.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.05] text-text-muted">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Launch CTA */}
                  <Link
                    href={`/tools/${tool.slug}`}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 bg-primary/10 text-primary-300 border border-primary/25 hover:bg-primary hover:text-black hover:border-primary mt-auto shadow-sm group/btn"
                  >
                    <span>Launch Tool</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching tools found"
            description={`No tools found matching "${searchQuery}". Try searching for another keyword or browse by category.`}
            action={
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedFilter('all'); }}
                className="btn-primary text-xs py-2 px-4"
              >
                Clear all filters
              </button>
            }
          />
        )}
      </div>
    </div>
  );
}
