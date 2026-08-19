import React from 'react';
import { cn } from '@/lib/utils';

export function PageShell({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("min-h-screen pt-24 pb-20 px-6", className)}>
      <div className="max-w-[1280px] mx-auto">
        {children}
      </div>
    </div>
  );
}

export function SectionHeader({ title, description, badge, align = 'left' }: { title: string, description?: string, badge?: string, align?: 'left' | 'center' }) {
  return (
    <div className={cn("mb-10 space-y-4", align === 'center' && "text-center")}>
      {badge && (
        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase border border-primary/20">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary">
        {title}
      </h2>
      {description && (
        <p className={cn("text-text-secondary text-base md:text-lg max-w-2xl", align === 'center' && "mx-auto")}>
          {description}
        </p>
      )}
    </div>
  );
}
