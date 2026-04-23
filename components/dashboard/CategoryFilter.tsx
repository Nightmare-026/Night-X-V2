'use client';

import React, { useEffect, useRef } from 'react';
import { CATEGORIES, ToolCategory } from '@/lib/tools-registry';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CategoryFilterProps {
  activeCategory: ToolCategory | 'all';
  onCategoryChange: (category: ToolCategory | 'all') => void;
  toolCounts: Record<string, number>;
}

const CategoryFilter = React.memo(function CategoryFilter({
  activeCategory,
  onCategoryChange,
  toolCounts,
}: CategoryFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (id: ToolCategory | 'all') => {
    onCategoryChange(id);
    window.dispatchEvent(new CustomEvent('category-change', { detail: id }));
  };

  return (
    <div className="w-full mb-8 relative">
      <div 
        ref={scrollRef}
        className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide no-scrollbar select-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          const count = toolCounts[category.id] || 0;

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300",
                "border border-white/10 glass-card",
                isActive 
                  ? "text-white border-transparent" 
                  : "text-white/60 hover:text-white hover:border-white/20"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-category"
                  className="absolute inset-0 rounded-full z-0"
                  style={{ 
                    background: `linear-gradient(135deg, rgb(var(--accent-purple)), rgb(var(--accent-cyan)))`,
                    boxShadow: '0 4px 15px rgba(var(--accent-purple), 0.4)',
                    opacity: 1
                  }}
                  initial={false}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <span className="relative z-10 text-lg">{category.icon}</span>
              <span className="relative z-10">{category.label}</span>
              
              {count > 0 && (
                <span className={cn(
                  "relative z-10 ml-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold",
                  isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/40"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Scroll Indicators for mobile */}
      <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-[#06080F] to-transparent pointer-events-none md:hidden" />
    </div>
  );
});

export default CategoryFilter;
