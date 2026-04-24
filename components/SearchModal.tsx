'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Zap, ArrowRight, Command } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { TOOLS } from '@/lib/tools-registry';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTools = query.trim() === '' 
    ? TOOLS.slice(0, 5) 
    : TOOLS.filter(tool => 
        tool.name.toLowerCase().includes(query.toLowerCase()) || 
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev + 1) % filteredTools.length);
      }
      if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev - 1 + filteredTools.length) % filteredTools.length);
      }
      if (e.key === 'Enter' && filteredTools[selectedIndex]) {
        handleSelect(`/tools/${filteredTools[selectedIndex].slug}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredTools, selectedIndex]);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[70] flex items-start justify-center pt-24 px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl overflow-hidden glass-card border border-white/10 shadow-2xl pointer-events-auto"
            >
              <div className="flex items-center px-6 py-4 border-b border-white/10">
                <Search className="w-5 h-5 text-white/40 mr-4" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search protocol tools, AI features, or utilities..."
                  className="flex-1 bg-transparent border-none text-white outline-none placeholder:text-white/30 text-lg"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded border border-white/10 bg-white/5 text-[10px] text-white/40">
                    <Command size={10} />
                    <span>K</span>
                  </div>
                  <button 
                    onClick={onClose}
                    className="p-1 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto p-2">
                {filteredTools.length > 0 ? (
                  <div className="space-y-1">
                    <p className="px-4 py-2 text-[10px] uppercase tracking-widest font-bold text-white/20">
                      {query.trim() === '' ? 'Recommended Tools' : 'Search Results'}
                    </p>
                    {filteredTools.map((tool, index) => (
                      <button
                        key={tool.slug}
                        onClick={() => handleSelect(`/tools/${tool.slug}`)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                          selectedIndex === index ? "bg-accent-purple/20 border border-accent-purple/30" : "hover:bg-white/5 border border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            selectedIndex === index ? "bg-accent-purple/20 text-accent-purple" : "bg-white/5 text-white/40"
                          )}>
                            <Zap size={18} />
                          </div>
                          <div className="text-left">
                            <p className={cn(
                              "text-sm font-bold transition-colors",
                              selectedIndex === index ? "text-white" : "text-white/70"
                            )}>{tool.name}</p>
                            <p className="text-xs text-white/30 truncate max-w-[300px]">{tool.description}</p>
                          </div>
                        </div>
                        <ArrowRight size={14} className={cn(
                          "transition-all",
                          selectedIndex === index ? "text-accent-purple translate-x-0 opacity-100" : "text-white/0 -translate-x-2 opacity-0"
                        )} />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white/20">
                      <Search size={24} />
                    </div>
                    <p className="text-white/60 font-medium">No results found for &quot;{query}&quot;</p>
                    <p className="text-white/30 text-xs mt-1">Try searching for &quot;image&quot;, &quot;text&quot;, or &quot;security&quot;</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white/5 border-t border-white/5 flex items-center justify-between text-[10px] text-white/30 uppercase tracking-widest font-bold">
                <div className="flex gap-4">
                  <span className="flex items-center gap-1"><Command size={10} /> + K to Open</span>
                  <span className="flex items-center gap-1">↑↓ to Navigate</span>
                </div>
                <span>Night X Search Protocol v2.0</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
