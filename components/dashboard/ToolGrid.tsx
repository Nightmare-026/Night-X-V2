'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { TOOLS, ToolCategory, searchTools } from '@/lib/tools-registry';
import ToolCard from './ToolCard';
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
    }, 200);
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

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="h-9 w-64 bg-white/5 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-44 rounded-2xl bg-surface-card border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          toolCounts={toolCounts}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
          <span>{activeCategory === 'all' ? 'All Workspace Tools' : `${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)} Tools`}</span>
          <span className="text-text-muted text-xs font-normal">
            ({filteredTools.length} available)
          </span>
        </h2>

        {(searchQuery || activeCategory !== 'all') && (
          <button
            onClick={clearFilters}
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 transition-colors shrink-0"
          >
            <RotateCcw size={12} />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {filteredTools.map((tool) => (
            <div key={tool.slug} className="h-full">
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 p-8 rounded-2xl border border-dashed border-white/10 bg-surface-card/50 text-center">
          <div className="w-14 h-14 rounded-2xl bg-surface-inset border border-white/10 flex items-center justify-center mb-3 text-text-muted">
            {searchQuery ? <SearchX size={26} /> : <FilterX size={26} />}
          </div>
          <h3 className="text-base font-bold text-white mb-1">No matching tools</h3>
          <p className="text-xs text-text-tertiary mb-5 max-w-xs">
            We couldn&apos;t find any tools matching your {searchQuery ? 'search query' : 'category filter'}.
          </p>
          <button onClick={clearFilters} className="btn-primary text-xs py-2 px-4">
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
