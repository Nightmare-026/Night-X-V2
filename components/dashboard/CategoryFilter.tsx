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
    <div className="w-full relative">
      <div 
        ref={scrollRef}
        className="flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar select-none"
      >
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          const count = toolCounts[category.id] || 0;

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "relative flex items-center gap-2.5 px-4 py-2 rounded-md text-xs font-bold transition-all shrink-0 border",
                "font-outfit uppercase tracking-wider",
                isActive 
                  ? "bg-white/[0.05] text-white border-accent-blue/50" 
                  : "bg-white/[0.02] text-white/30 border-white/[0.05] hover:text-white hover:border-white/20"
              )}
            >
              <span className="text-sm">{category.icon}</span>
              <span>{category.label}</span>
              
              {count > 0 && (
                <span className={cn(
                  "ml-1 text-[10px] opacity-40 font-normal",
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export default CategoryFilter;
