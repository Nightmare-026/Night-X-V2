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
      // Clean up URL after 1 second without removing other params
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
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="mb-8 relative overflow-hidden rounded-[32px] bg-gradient-to-r from-accent-purple to-accent-cyan p-1"
        >
          <div className="relative flex items-center justify-between gap-6 rounded-[31px] bg-[#06080F]/90 p-6 md:p-8 backdrop-blur-xl">
            <div className="flex items-center gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-purple/20 text-accent-purple">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-syne">Welcome to Night X!</h2>
                <p className="text-white/60 font-dm-sans">
                  You now have access to premium AI tools. Start by exploring the dashboard.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="rounded-full bg-white/5 p-2 text-white/40 transition-all hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
