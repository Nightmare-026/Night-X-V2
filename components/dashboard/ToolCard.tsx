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

const categoryColors: Record<string, string> = {
  image: 'rgb(var(--accent-cyan))',
  security: 'rgb(var(--accent-red))',
  text: 'rgb(var(--accent-green))',
  developer: 'rgb(var(--accent-purple))',
  utility: 'rgb(var(--accent-gold))',
  life: 'rgb(var(--accent-orange))',
  ai: 'rgb(var(--accent-pink))',
};

const ToolCard = React.memo(function ToolCard({ tool }: ToolCardProps) {
  const router = useRouter();
  const color = categoryColors[tool.category] || 'rgb(var(--accent-purple))';

  return (
    <motion.div
      layout
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass-card p-5 group cursor-pointer flex flex-col h-full border-white/10 hover:border-white/20"
      onClick={() => router.push(`/tools/${tool.slug}`)}
      onMouseEnter={() => preloadTool(tool.slug)}
    >
      <div className="flex justify-between items-start mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl glass-effect"
          style={{ boxShadow: `0 0 15px ${color}22` }}
        >
          {tool.icon}
        </div>
        
        <div className="flex gap-2">
          {tool.isAI && (
            <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-accent-pink/20 text-accent-pink flex items-center gap-1 border border-accent-pink/30">
              <Sparkles size={10} />
              AI
            </span>
          )}
          {tool.isNew && (
            <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-accent-green/20 text-accent-green border border-accent-green/30">
              NEW
            </span>
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold mb-2 font-syne group-hover:text-glow-purple transition-all duration-300">
        {tool.name}
      </h3>
      
      <p className="text-white/60 text-sm mb-6 line-clamp-2 font-dm-sans flex-grow">
        {tool.description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <span 
          className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/5"
          style={{ color }}
        >
          {tool.category}
        </span>
        
        <div className="flex items-center gap-1 text-white/40 group-hover:text-white transition-colors text-xs font-medium">
          Open Tool
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
});

export default ToolCard;
