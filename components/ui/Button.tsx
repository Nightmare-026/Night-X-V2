import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'neu-raised' | 'neu-inset';
  size?: 'default' | 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer active:scale-[0.98]";
    
    const variants = {
      default: "bg-gradient-primary text-white shadow-[0_4px_14px_rgba(22,163,74,0.35)] hover:shadow-[0_8px_24px_rgba(34,197,94,0.45)] hover:-translate-y-0.5",
      primary: "bg-gradient-primary text-white shadow-[0_4px_14px_rgba(22,163,74,0.35)] hover:shadow-[0_8px_24px_rgba(34,197,94,0.45)] hover:-translate-y-0.5",
      secondary: "bg-surface-card text-text-primary border border-border hover:border-border-hover hover:bg-surface-hover shadow-[var(--shadow-raised-sm)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5",
      ghost: "hover:bg-white/[0.06] text-text-secondary hover:text-white",
      outline: "border border-border hover:border-border-hover bg-transparent text-text-secondary hover:text-white hover:bg-white/[0.04]",
      danger: "bg-red-500/15 text-red-400 border border-red-500/25 hover:bg-red-500/25 shadow-sm",
      'neu-raised': "bg-surface-base text-text-primary border border-border/80 shadow-[var(--shadow-raised-sm)] hover:shadow-[var(--shadow-hover)] hover:-translate-y-0.5",
      'neu-inset': "bg-surface-inset text-text-primary border border-white/5 shadow-[var(--shadow-inset-sm)]",
    };

    const sizes = {
      default: "h-10 px-4 py-2 text-sm",
      sm: "h-8 rounded-lg px-3 text-xs gap-1.5",
      md: "h-11 rounded-xl px-5 text-sm gap-2",
      lg: "h-12 rounded-xl px-7 text-base gap-2.5 font-bold",
      xl: "h-14 rounded-2xl px-8 text-base gap-3 font-bold",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Processing...</span>
          </span>
        ) : children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
