'use client';

import React from 'react';
import { Tool } from '@/lib/tools-registry';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { preloadTool } from '@/lib/performance';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ToolCardProps {
  tool: Tool;
}

const categoryColorMap: Record<string, string> = {
  image: 'text-primary-400',
  security: 'text-red-400',
  text: 'text-emerald-400',
  developer: 'text-accent-cyan',
  utility: 'text-accent-amber',
  life: 'text-blue-400',
  ai: 'text-accent-pink-light',
};

const ToolCard = React.memo(function ToolCard({ tool }: ToolCardProps) {
  const router = useRouter();
  const colorClass = categoryColorMap[tool.category] || 'text-primary-400';

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden glass-card p-6 bg-[#16161F]/60 hover:bg-[#1C1C28]/90 hover:border-primary/20 hover:shadow-[0_16px_35px_rgba(0,0,0,0.4),0_0_0_1px_rgba(139,92,246,0.12)]"
      onClick={() => router.push(`/tools/${tool.slug}`)}
      onMouseEnter={() => preloadTool(tool.slug)}
    >
      {/* Animated Corner Glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="mb-6 flex items-start justify-between relative z-10">
        <div 
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.03] text-2xl border border-white/[0.05] shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3"
        >
          {tool.icon}
        </div>
        
        <div className="flex gap-2">
          {tool.isAI && (
            <span className="flex items-center gap-1 rounded-full bg-accent-pink/10 border border-accent-pink/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-accent-pink-light shadow-sm">
              <Sparkles size={8} fill="currentColor" />
              AI
            </span>
          )}
          {tool.isNew && (
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-400 shadow-sm">
              NEW
            </span>
          )}
        </div>
      </div>

      <div className="flex-grow space-y-2 relative z-10">
        <h3 className="text-[1.0625rem] font-bold text-white tracking-tight group-hover:text-primary-400 transition-colors">
          {tool.name}
        </h3>
        <p className="line-clamp-2 text-[0.8125rem] leading-[1.6] text-text-tertiary font-medium">
          {tool.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-white/[0.05] pt-4 relative z-10">
        <span className={cn("text-[10px] font-black uppercase tracking-[0.15em] opacity-40 group-hover:opacity-100 transition-opacity", colorClass)}>
          {tool.category}
        </span>
        
        <div className="flex items-center gap-1.5 text-[0.75rem] font-bold text-primary-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          Try Now <ArrowUpRight size={14} />
        </div>
      </div>
    </motion.div>
  );
});

export default ToolCard;
