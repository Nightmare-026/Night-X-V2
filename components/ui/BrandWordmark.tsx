import React from 'react';
import { cn } from '@/lib/utils';

interface BrandWordmarkProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
}

export default function BrandWordmark({ className, size = 'md', showIcon = true }: BrandWordmarkProps) {
  const sizeClasses = {
    sm: 'text-base font-bold',
    md: 'text-lg font-extrabold',
    lg: 'text-2xl font-black',
    xl: 'text-3xl font-black',
  };

  const iconContainerSizes = {
    sm: 'w-6 h-6 rounded-lg text-xs',
    md: 'w-8 h-8 rounded-xl text-xs',
    lg: 'w-10 h-10 rounded-xl text-sm',
    xl: 'w-12 h-12 rounded-2xl text-base',
  };

  return (
    <div className={cn("inline-flex items-center gap-2.5 group select-none", className)}>
      {showIcon && (
        <div className={cn(
          "flex items-center justify-center font-black bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-[#080A0E] shadow-[0_2px_10px_rgba(245,158,11,0.3)] group-hover:scale-105 transition-transform duration-200",
          iconContainerSizes[size]
        )}>
          NX
        </div>
      )}
      <span 
        className={cn(
          "tracking-tight text-white transition-colors flex items-center gap-0.5",
          sizeClasses[size]
        )}
      >
        <span>Night</span>
        <span className="text-primary font-black ml-0.5">X</span>
      </span>
    </div>
  );
}
