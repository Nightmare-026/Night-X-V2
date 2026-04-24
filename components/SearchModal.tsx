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
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#06080F]/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="w-full max-w-2xl overflow-hidden glass-card border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative z-[110]"
          >
            {/* Search Input Area */}
            <div className="relative flex items-center px-6 py-5 border-b border-white/10 bg-white/[0.02]">
              <Search className="w-5 h-5 text-accent-purple/60 mr-4" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tools, AI models, or utilities..."
                className="flex-1 bg-transparent border-none text-white outline-none placeholder:text-white/20 text-lg font-medium"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
              />
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-md border border-white/10 bg-white/5 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                  <span className="opacity-50">ESC to close</span>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full text-white/30 hover:text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[440px] overflow-y-auto custom-scrollbar bg-gradient-to-b from-transparent to-black/20">
              {filteredTools.length > 0 ? (
                <div className="p-2">
                  <div className="px-4 py-3 flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 flex items-center gap-2">
                      {query.trim() === '' ? <Sparkles size={10} className="text-accent-purple" /> : <Search size={10} />}
                      {query.trim() === '' ? 'Recommended for you' : `Found ${filteredTools.length} tools`}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    {filteredTools.map((tool, index) => (
                      <button
                        key={tool.slug}
                        onClick={() => handleSelect(tool.slug, tool.isPublic)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden",
                          selectedIndex === index 
                            ? "bg-accent-purple/10 border border-accent-purple/30 shadow-[0_0_20px_-10px_rgba(168,85,247,0.4)]" 
                            : "hover:bg-white/[0.03] border border-transparent"
                        )}
                      >
                        {/* Selected Indicator Glow */}
                        {selectedIndex === index && (
                          <motion.div 
                            layoutId="search-glow"
                            className="absolute inset-0 bg-gradient-to-r from-accent-purple/5 via-transparent to-transparent opacity-50"
                          />
                        )}

                        <div className="flex items-center gap-4 relative z-10">
                          <div className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all duration-300",
                            selectedIndex === index 
                              ? "bg-accent-purple/20 scale-110 shadow-inner" 
                              : "bg-white/5 grayscale-[0.5] opacity-60 group-hover:opacity-100 group-hover:grayscale-0"
                          )}>
                            {tool.icon}
                          </div>
                          
                          <div className="text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className={cn(
                                "text-sm font-bold transition-colors",
                                selectedIndex === index ? "text-white" : "text-white/70 group-hover:text-white"
                              )}>
                                {tool.name}
                              </span>
                              
                              {tool.isAI && (
                                <span className="bg-gradient-to-r from-accent-purple to-accent-cyan px-1.5 py-0.5 rounded text-[8px] font-black uppercase text-white shadow-sm">
                                  AI
                                </span>
                              )}
                              
                              {!tool.isPublic && (
                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-black uppercase text-white/40">
                                  <Lock size={8} />
                                  Pro
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-white/30 truncate max-w-[200px] sm:max-w-[360px] font-medium leading-relaxed">
                              {tool.description}
                            </p>
                          </div>
                        </div>

                        <div className={cn(
                          "flex items-center gap-2 transition-all duration-300 relative z-10",
                          selectedIndex === index ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                        )}>
                          <span className="text-[9px] font-bold text-accent-purple/60 uppercase tracking-widest hidden sm:inline">Open Tool</span>
                          <ArrowRight size={14} className="text-accent-purple" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-white/[0.03] rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-white/10 border border-white/5 rotate-12">
                    <Search size={32} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-white/80 font-bold text-lg">No tools matched your search</h3>
                  <p className="text-white/30 text-sm mt-2 max-w-[280px] mx-auto leading-relaxed">
                    We couldn&apos;t find any tools matching &quot;<span className="text-accent-purple">{query}</span>&quot;. Try checking the spelling or use broader keywords.
                  </p>
                </div>
              )}
            </div>

            {/* Footer / Shortcuts */}
            <div className="px-6 py-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between text-[10px] text-white/30 font-bold uppercase tracking-[0.15em]">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px]">↑↓</kbd> 
                  to navigate
                </span>
                <span className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[9px]">ENTER</kbd> 
                  to select
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-accent-purple/40">
                <History size={12} />
                <span>Quick Access Protocol</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
