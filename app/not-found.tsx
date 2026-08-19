'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, Compass, ArrowRight, Zap, Shield, FileText } from 'lucide-react';
import { useSearch } from '@/components/providers/SearchProvider';

export default function NotFound() {
  const { openSearch } = useSearch();

  const suggestedTools = [
    { name: 'Image Compressor', slug: 'image-compressor', icon: Zap },
    { name: 'JSON Formatter', slug: 'json-formatter', icon: FileText },
    { name: 'Password Generator', slug: 'password-generator', icon: Shield },
    { name: 'QR Code Generator', slug: 'qr-generator', icon: Compass },
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 py-16 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="relative z-10 max-w-xl w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          <div className="inline-flex items-center justify-center px-3.5 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-bold text-primary-400 uppercase tracking-widest mb-2 shadow-[var(--shadow-raised-sm)]">
            404 Error • Route Not Found
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Lost in the Workspace?
          </h1>
          
          <p className="text-text-secondary text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The page or tool you are searching for does not exist, was renamed, or has moved to a new destination.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link 
              href="/tools" 
              className="btn-primary px-6 py-3 text-xs sm:text-sm font-bold shadow-[0_4px_20px_rgba(34,197,94,0.4)] inline-flex items-center gap-2"
            >
              <Compass size={16} />
              <span>Browse All 42 Tools</span>
            </Link>
            
            <button 
              onClick={openSearch}
              className="btn-secondary px-5 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2"
            >
              <Search size={15} />
              <span>Quick Search</span>
              <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-text-muted">⌘K</kbd>
            </button>

            <Link 
              href="/" 
              className="btn-secondary px-5 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2"
            >
              <Home size={15} />
              <span>Return Home</span>
            </Link>
          </div>
        </motion.div>

        {/* Quick Launch Recommendations */}
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 space-y-3 shadow-[var(--shadow-raised-sm)] text-left">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Popular Workspace Utilities
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            {suggestedTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="p-3 rounded-xl bg-surface-inset border border-white/[0.05] hover:border-primary/40 hover:bg-surface-elevated transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <tool.icon size={15} className="text-primary-400" />
                  <span className="text-xs font-bold text-white group-hover:text-primary-300 transition-colors">{tool.name}</span>
                </div>
                <ArrowRight size={12} className="text-text-muted group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
