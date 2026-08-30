'use client';

import React, { useRef } from 'react';
import { CATEGORIES, ToolCategory } from '@/lib/tools-registry';
import { cn } from '@/lib/utils';
import { ToolIcon } from '@/components/ui/ToolIcon';

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
        className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none"
      >
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id;
          const count = toolCounts[category.id] || 0;

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={cn(
                "relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 border",
                isActive 
                  ? "bg-primary/20 text-primary border-primary/40 font-bold shadow-sm" 
                  : "bg-surface-card text-text-secondary border-white/[0.06] hover:text-white hover:border-white/15"
              )}
            >
              <ToolIcon name={category.icon} className="w-3.5 h-3.5" />
              <span>{category.label}</span>
              
              {count > 0 && (
                <span className={cn(
                  "ml-0.5 text-[10px] px-1.5 py-0.2 rounded-full",
                  isActive ? "bg-primary text-black font-bold" : "bg-white/10 text-text-muted"
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
