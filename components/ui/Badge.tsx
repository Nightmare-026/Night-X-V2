import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 
    | 'default' 
    | 'secondary' 
    | 'destructive' 
    | 'outline' 
    | 'cyan' 
    | 'pink' 
    | 'emerald' 
    | 'amber' 
    | 'purple'
    | 'ai'
    | 'local';
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-primary select-none";
  
  const variants = {
    default: "border-primary/30 bg-primary/15 text-primary",
    secondary: "border-white/10 bg-white/[0.04] text-text-secondary",
    destructive: "border-red-500/30 bg-red-500/15 text-red-400",
    outline: "border-white/20 text-text-secondary bg-transparent",
    cyan: "border-accent-cyan/30 bg-accent-cyan/15 text-accent-cyan",
    pink: "border-accent-pink/30 bg-accent-pink/15 text-accent-pink",
    emerald: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400",
    amber: "border-amber-500/30 bg-amber-500/15 text-amber-400",
    purple: "border-accent-purple/30 bg-accent-purple/15 text-accent-purple",
    ai: "border-accent-pink/30 bg-accent-pink/15 text-accent-pink uppercase tracking-wider text-[9px]",
    local: "border-emerald-500/30 bg-emerald-500/15 text-emerald-400 uppercase tracking-wider text-[9px]",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  );
}

export { Badge };
