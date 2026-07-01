'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Command, Lock, Sparkles, History } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TOOLS, Tool } from '@/lib/tools-registry';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { status } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);

  // High-performance fuzzy-ish search
  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === '') return TOOLS.filter(t => t.isPublic).slice(0, 6); // Show popular/public tools by default

    return TOOLS.filter(tool => {
      const nameMatch = tool.name.toLowerCase().includes(q);
      const descMatch = tool.description.toLowerCase().includes(q);
      const tagMatch = tool.tags.some(tag => tag.toLowerCase().includes(q));
      const categoryMatch = tool.category.toLowerCase().includes(q);
      return nameMatch || descMatch || tagMatch || categoryMatch;
    }).sort((a, b) => {
      // Prioritize name matches
      const aName = a.name.toLowerCase().startsWith(q);
      const bName = b.name.toLowerCase().startsWith(q);
      if (aName && !bName) return -1;
      if (!aName && bName) return 1;
      return 0;
    }).slice(0, 8);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSelect = (slug: string, isPublic: boolean) => {
    if (!isPublic && status !== 'authenticated') {
      router.push(`/auth/signin?callbackUrl=/tools/${slug}`);
    } else {
      router.push(`/tools/${slug}`);
    }
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
            handleSelect(filteredTools[selectedIndex].slug, filteredTools[selectedIndex].isPublic);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex, status]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-start justify-center pt-[15vh] px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#06080F]/80 backdrop-blur-[40px]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -20 }}
            className="w-full max-w-2xl overflow-hidden glass-modal border border-primary/20 shadow-[0_32px_120px_-16px_rgba(0,0,0,0.8)] relative z-[2100] bg-[#0A0A0F]/95 rounded-[20px]"
          >
            {/* Search Input Area */}
            <div className="relative flex items-center px-7 py-6 border-b border-white/5 bg-white/[0.01]">
              <Search className="w-5 h-5 text-primary/60 mr-4" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tools, AI models, or utilities..."
                className="flex-1 bg-transparent border-none text-white outline-none placeholder:text-white/20 text-[1.125rem] font-medium"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <div className="flex items-center gap-3">
                <kbd className="hidden sm:flex px-2 py-1 rounded-[6px] border border-white/10 bg-white/5 text-[10px] text-white/40 font-mono font-bold">ESC</kbd>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-full text-white/20 hover:text-white transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-3">
              {filteredTools.length > 0 ? (
                <div className="space-y-6 pb-2">
                  {/* Categorized grouping if query is empty */}
                  {query.trim() === '' ? (
                    ['Popular', 'Image', 'AI', 'Security'].map(cat => {
                      const toolsInCat = TOOLS.filter(t => 
                        cat === 'Popular' ? t.isPublic : t.category.toLowerCase().includes(cat.toLowerCase())
                      ).slice(0, 4);
                      
                      if (toolsInCat.length === 0) return null;

                      return (
                        <div key={cat} className="space-y-2">
                          <h3 className="px-4 text-[0.6875rem] font-black uppercase tracking-[0.15em] text-white/30 flex items-center gap-2">
                            {cat === 'Popular' ? <Sparkles size={11} className="text-primary-400" /> : null}
                            {cat} Tools
                          </h3>
                          <div className="space-y-1">
                            {toolsInCat.map((tool, idx) => {
                              const overallIndex = filteredTools.findIndex(t => t.slug === tool.slug);
                              return (
                                <SearchItem 
                                  key={tool.slug}
                                  tool={tool}
                                  isSelected={selectedIndex === overallIndex}
                                  onSelect={() => handleSelect(tool.slug, tool.isPublic)}
                                  onHover={() => setSelectedIndex(overallIndex)}
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="space-y-1">
                      <p className="px-4 py-2 text-[0.6875rem] font-black uppercase tracking-[0.15em] text-white/30">
                        Search Results ({filteredTools.length})
                      </p>
                      {filteredTools.map((tool, index) => (
                        <SearchItem 
                          key={tool.slug}
                          tool={tool}
                          isSelected={selectedIndex === index}
                          onSelect={() => handleSelect(tool.slug, tool.isPublic)}
                          onHover={() => setSelectedIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-24 text-center">
                  <div className="w-20 h-20 bg-white/[0.02] rounded-[24px] flex items-center justify-center mx-auto mb-6 text-white/5 border border-white/5 rotate-12">
                    <Search size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white/80 font-bold text-lg">No results for &quot;{query}&quot;</h3>
                  <p className="text-white/30 text-sm mt-2 max-w-[280px] mx-auto leading-relaxed">
                    Try checking the spelling or use broader keywords to find what you need.
                  </p>
                </div>
              )}
            </div>

            {/* Footer / Shortcuts */}
            <div className="px-7 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[10px] text-white/30 font-bold uppercase tracking-[0.15em]">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px]">↑↓</kbd> 
                  Navigate
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px]">ENTER</kbd> 
                  Select
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-primary/40">
                <Command size={12} />
                <span>Quick Access</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function SearchItem({ tool, isSelected, onSelect, onHover }: { 
  tool: Tool, 
  isSelected: boolean, 
  onSelect: () => void, 
  onHover: () => void 
}) {
  return (
    <button
      onClick={onSelect}
      onMouseEnter={onHover}
      className={cn(
        "w-full flex items-center justify-between px-4 py-3.5 rounded-[12px] transition-all duration-200 group relative overflow-hidden",
        isSelected 
          ? "bg-primary/10 border border-primary/30 shadow-[0_0_20px_-10px_rgba(139,92,246,0.4)]" 
          : "hover:bg-white/[0.02] border border-transparent"
      )}
    >
      <div className="flex items-center gap-4 relative z-10">
        <div className={cn(
          "w-11 h-11 rounded-[10px] flex items-center justify-center text-xl transition-all duration-300",
          isSelected 
            ? "bg-primary/20 scale-105 shadow-inner" 
            : "bg-white/5 grayscale-[0.8] opacity-50 group-hover:opacity-100 group-hover:grayscale-0"
        )}>
          {tool.icon}
        </div>
        
        <div className="text-left">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={cn(
              "text-[0.9375rem] font-bold transition-colors",
              isSelected ? "text-white" : "text-white/60 group-hover:text-white"
            )}>
              {tool.name}
            </span>
            {tool.isAI && (
              <span className="bg-gradient-primary px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-white shadow-sm">
                AI
              </span>
            )}
            {!tool.isPublic && (
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-black uppercase text-white/30">
                <Lock size={8} />
                Pro
              </div>
            )}
          </div>
          <p className="text-[0.8125rem] text-text-tertiary truncate max-w-[200px] sm:max-w-[340px] font-medium">
            {tool.description}
          </p>
        </div>
      </div>

      <div className={cn(
        "flex items-center gap-2 transition-all duration-300 relative z-10",
        isSelected ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
      )}>
        <ArrowRight size={16} className="text-primary" />
      </div>
    </button>
  );
}
