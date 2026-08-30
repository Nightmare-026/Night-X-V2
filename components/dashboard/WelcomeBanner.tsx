'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';

export default function WelcomeBanner() {
  const searchParams = useSearchParams();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get('welcome') === 'true') {
      setIsVisible(true);
      const timeout = setTimeout(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete('welcome');
        window.history.replaceState({}, '', url.toString());
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [searchParams]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="rounded-2xl border border-primary/30 bg-gradient-to-r from-surface-elevated to-surface-card p-5 shadow-[var(--shadow-raised-sm)]"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 border border-primary/30 text-primary shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Welcome to Night X Workspace!</h2>
                <p className="text-xs text-text-secondary">
                  Your private suite of 42+ developer, security, media, and AI tools is ready.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="rounded-lg bg-white/[0.04] p-1.5 text-text-muted hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
