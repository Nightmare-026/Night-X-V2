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
      className="glass-card p-6 md:p-8 group cursor-pointer flex flex-col h-full border-white/10 hover:border-white/20 relative overflow-hidden"
      onClick={() => router.push(`/tools/${tool.slug}`)}
      onMouseEnter={() => preloadTool(tool.slug)}
    >
      {/* Icon Glow Effect */}
      <div 
        className="absolute -top-12 -left-12 w-24 h-24 blur-[60px] opacity-20 pointer-events-none transition-opacity group-hover:opacity-40"
        style={{ backgroundColor: color }}
      />
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

      <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
        <span 
          className="text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1 rounded-md bg-white/5 border border-white/5"
          style={{ color, backgroundColor: `${color}11` }}
        >
          {tool.category}
        </span>
        
        <div className="flex items-center gap-2 text-white/50 group-hover:text-white transition-all text-sm font-bold">
          <span className="hidden sm:inline">Open Tool</span>
          <div className="w-8 h-8 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan group-hover:bg-accent-cyan group-hover:text-white transition-all shadow-lg shadow-accent-cyan/10 group-hover:shadow-accent-cyan/40">
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default ToolCard;
