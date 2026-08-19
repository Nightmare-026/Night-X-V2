import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

export function LoadingState({ message = "Loading content...", className }: { message?: string, className?: string }) {
  return (
    <div className={cn("w-full h-full min-h-[260px] flex flex-col items-center justify-center p-8 rounded-2xl border border-white/[0.08] bg-surface-card text-center shadow-[var(--shadow-raised-sm)]", className)}>
      <Loader2 className="w-9 h-9 animate-spin text-primary-400 mb-3" />
      <p className="text-text-secondary text-sm font-medium">{message}</p>
    </div>
  );
}

export function EmptyState({ 
  title = "No items found", 
  description = "There is nothing to display here right now.", 
  icon: Icon = Inbox, 
  action 
}: { 
  title?: string, 
  description?: string, 
  icon?: any, 
  action?: React.ReactNode 
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-10 rounded-2xl border border-dashed border-white/15 bg-surface-base/50 text-center shadow-[var(--shadow-inset-sm)]">
      <div className="w-14 h-14 rounded-2xl bg-surface-card border border-white/10 flex items-center justify-center mb-4 text-text-tertiary shadow-[var(--shadow-raised-sm)]">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-text-primary mb-1">{title}</h3>
      <p className="text-xs text-text-tertiary max-w-sm mb-6 leading-relaxed">{description}</p>
      {action && action}
    </div>
  );
}

export function ErrorState({ 
  title = "Something went wrong", 
  message, 
  onRetry 
}: { 
  title?: string, 
  message: string, 
  onRetry?: () => void 
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center p-8 rounded-2xl border border-red-500/20 bg-red-500/[0.04] text-center shadow-[var(--shadow-raised-sm)]">
      <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-red-400 mb-1">{title}</h3>
      <p className="text-xs text-text-secondary max-w-md mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="secondary"
          size="sm"
          className="gap-2"
        >
          <RefreshCcw size={14} /> Try Again
        </Button>
      )}
    </div>
  );
}
