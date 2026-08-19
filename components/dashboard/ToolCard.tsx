'use client';

import React from 'react';
import { Tool } from '@/lib/tools-registry';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, Sparkles, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { preloadTool } from '@/lib/performance';
import { ToolIcon } from '@/components/ui/ToolIcon';

interface ToolCardProps {
  tool: Tool;
}

const categoryColorMap: Record<string, string> = {
  image: 'text-primary-400',
  security: 'text-red-400',
  text: 'text-emerald-400',
  developer: 'text-accent-cyan',
  utility: 'text-accent-amber',
  life: 'text-accent-purple',
  ai: 'text-accent-pink',
};

const ToolCard = React.memo(function ToolCard({ tool }: ToolCardProps) {
  const router = useRouter();
  const colorClass = categoryColorMap[tool.category] || 'text-primary-400';

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-surface-card p-5 hover:border-primary/40 hover:shadow-[var(--shadow-hover)] transition-all duration-300 shadow-[var(--shadow-raised-sm)]"
      onClick={() => router.push(`/tools/${tool.slug}`)}
      onMouseEnter={() => preloadTool(tool.slug)}
    >
      <div className="mb-4 flex items-start justify-between relative z-10">
        <div 
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface-inset text-primary-400 border border-white/10 shadow-[var(--shadow-inset-sm)] transition-transform group-hover:scale-105"
        >
          <ToolIcon name={tool.icon} className="w-5 h-5" />
        </div>
        
        <div className="flex gap-1.5">
          {tool.processingType === 'client' && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-emerald-400">
              <ShieldCheck size={9} />
              Local
            </span>
          )}
          {tool.isAI && (
            <span className="flex items-center gap-1 rounded-full bg-accent-pink/15 border border-accent-pink/30 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-accent-pink">
              <Sparkles size={8} fill="currentColor" />
              AI
            </span>
          )}
        </div>
      </div>

      <div className="flex-grow space-y-1.5 relative z-10">
        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-primary-300 transition-colors">
          {tool.name}
        </h3>
        <p className="line-clamp-2 text-xs leading-[1.6] text-text-tertiary">
          {tool.description}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-3.5 relative z-10">
        <span className={cn("text-[10px] font-bold uppercase tracking-wider", colorClass)}>
          {tool.category}
        </span>
        
        <div className="flex items-center gap-1 text-xs font-bold text-primary-400 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <span>Launch</span>
          <ArrowUpRight size={13} />
        </div>
      </div>
    </motion.div>
  );
});

export default ToolCard;
