'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TOOLS, CATEGORIES, ToolCategory } from '@/lib/tools-registry';
import { cn } from '@/lib/utils';
import { ToolIcon } from '@/components/ui/ToolIcon';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isMac, setIsMac] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(navigator.userAgent.toUpperCase().indexOf('MAC') >= 0);
    }
  }, []);

  const filteredTools = useMemo(() => {
    let pool = TOOLS;
    if (selectedCategory !== 'all') {
      pool = pool.filter(t => t.category === selectedCategory);
    }

    const q = query.trim().toLowerCase();
    if (q === '') {
      return pool.slice(0, 8);
    }

    return pool.filter(tool => {
      const nameMatch = tool.name.toLowerCase().includes(q);
      const descMatch = tool.description.toLowerCase().includes(q);
      const tagMatch = tool.tags.some(tag => tag.toLowerCase().includes(q));
      const categoryMatch = tool.category.toLowerCase().includes(q);
      return nameMatch || descMatch || tagMatch || categoryMatch;
    }).sort((a, b) => {
      const aName = a.name.toLowerCase().startsWith(q);
      const bName = b.name.toLowerCase().startsWith(q);
      if (aName && !bName) return -1;
      if (!aName && bName) return 1;
      return 0;
    }).slice(0, 8);
  }, [query, selectedCategory]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedCategory('all');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, selectedCategory]);

  const handleSelect = (slug: string) => {
    router.push(`/tools/${slug}`);
    onClose();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredTools.length));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
          break;
        case 'Enter':
          if (filteredTools[selectedIndex]) {
            handleSelect(filteredTools[selectedIndex].slug);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[10vh] sm:pt-[14vh] px-4" role="dialog" aria-modal="true" aria-label="Tool Search">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#06080C]/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl rounded-2xl border border-white/10 bg-surface-base shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden"
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/[0.08] bg-surface-card">
              <Search className="w-4 h-4 text-primary mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 42+ tools by name, tag, or format..."
                className="w-full bg-transparent text-white placeholder:text-text-muted text-sm sm:text-base outline-none font-medium"
                aria-label="Search all tools"
              />
              {query && (
                <button 
                  onClick={() => setQuery('')}
                  className="p-1 text-text-muted hover:text-white rounded mr-2"
                  aria-label="Clear search input"
                >
                  <X size={15} />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-[10px] text-text-muted font-mono font-semibold">ESC</kbd>
            </div>

            {/* Category Filter Chips */}
            <div className="px-4 py-2 bg-surface-inset border-b border-white/[0.06] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategory('all')}
                className={cn(
                  "px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                  selectedCategory === 'all'
                    ? "bg-primary text-black font-bold shadow-sm"
                    : "bg-surface-card text-text-secondary hover:text-white hover:bg-surface-hover"
                )}
              >
                All Tools
              </button>
              {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                    selectedCategory === cat.id
                      ? "bg-primary text-black font-bold shadow-sm"
                      : "bg-surface-card text-text-secondary hover:text-white hover:bg-surface-hover"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 custom-scrollbar space-y-1">
              {filteredTools.length > 0 ? (
                filteredTools.map((tool, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={tool.slug}
                      onClick={() => handleSelect(tool.slug)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer transition-all",
                        isSelected 
                          ? "bg-primary/15 border border-primary/30 text-white shadow-sm" 
                          : "hover:bg-white/[0.04] border border-transparent text-text-secondary"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center border shrink-0 transition-colors",
                          isSelected 
                            ? "bg-primary text-black border-primary font-bold" 
                            : "bg-surface-card border-white/10 text-primary"
                        )}>
                          <ToolIcon name={tool.icon} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={cn("text-xs sm:text-sm font-bold truncate", isSelected ? "text-white" : "text-text-primary")}>
                              {tool.name}
                            </span>
                            {tool.isAI && (
                              <span className="px-1.5 py-0.2 bg-accent-pink/15 border border-accent-pink/30 rounded text-[9px] font-bold text-accent-pink uppercase">
                                AI
                              </span>
                            )}
                            {tool.processingType === 'client' && (
                              <span className="px-1.5 py-0.2 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-bold text-emerald-400 uppercase hidden sm:inline-block">
                                Local
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-text-tertiary truncate max-w-[340px] sm:max-w-[420px]">
                            {tool.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-semibold text-text-muted capitalize hidden md:inline-block">
                          {tool.category}
                        </span>
                        <ArrowRight size={13} className={cn("transition-transform", isSelected ? "text-primary translate-x-0.5" : "text-white/20")} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-12 text-center text-text-muted space-y-1.5">
                  <p className="text-sm font-semibold text-white">No tools match &ldquo;{query}&rdquo;</p>
                  <p className="text-xs">Try searching for keywords like &ldquo;compress&rdquo;, &ldquo;hash&rdquo;, &ldquo;json&rdquo;, or &ldquo;qr&rdquo;.</p>
                </div>
              )}
            </div>

            {/* Bottom Keyboard Guide */}
            <div className="px-4 py-2 border-t border-white/[0.06] bg-surface-card flex items-center justify-between text-[10px] text-text-muted">
              <div className="flex items-center gap-3">
                <span><kbd className="font-mono bg-white/[0.06] px-1 py-0.5 rounded border border-white/10">↑</kbd> <kbd className="font-mono bg-white/[0.06] px-1 py-0.5 rounded border border-white/10">↓</kbd> navigate</span>
                <span><kbd className="font-mono bg-white/[0.06] px-1 py-0.5 rounded border border-white/10">↵</kbd> launch</span>
              </div>
              <span className="text-primary font-semibold">{filteredTools.length} tools</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
