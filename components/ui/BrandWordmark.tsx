import React from 'react';
import { cn } from '@/lib/utils';
import { Sparkles, Terminal } from 'lucide-react';

interface BrandWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
}

export default function BrandWordmark({ className, size = 'md', showIcon = true }: BrandWordmarkProps) {
  const sizeClasses = {
    sm: 'text-base font-bold',
    md: 'text-xl font-extrabold',
    lg: 'text-2xl font-black',
    xl: 'text-4xl font-black',
  };

  const iconContainerSizes = {
    sm: 'w-6 h-6 rounded-lg text-xs',
    md: 'w-8 h-8 rounded-xl text-sm',
    lg: 'w-10 h-10 rounded-xl text-base',
    xl: 'w-14 h-14 rounded-2xl text-xl',
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      {showIcon && (
        <div className={cn(
          "flex items-center justify-center font-black bg-gradient-to-br from-[#2ED66B] via-[#22C55E] to-[#16A34A] text-white shadow-[0_4px_14px_rgba(34,197,94,0.35)] group-hover:scale-105 group-hover:shadow-[0_6px_20px_rgba(34,197,94,0.5)] transition-all duration-300",
          iconContainerSizes[size]
        )}>
          NX
        </div>
      )}
      <span 
        className={cn(
          "tracking-tight text-white transition-colors flex items-center gap-1",
          sizeClasses[size]
        )}
      >
        <span>Night</span>
        <span className="text-primary-400 font-black">X</span>
      </span>
    </div>
  );
}
