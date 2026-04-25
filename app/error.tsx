"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, Home, LifeBuoy } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full glass-card p-10 border-white/5 relative overflow-hidden"
      >
        {/* Subtle Gradient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent-purple/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-accent-purple/10 text-accent-purple rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-6 border border-accent-purple/20">
            <AlertTriangle className="w-8 h-8" />
          </div>
          
          <h2 className="text-3xl font-bold font-syne mb-3 text-white">Something Stalled</h2>
          <p className="text-white/50 mb-8 font-dm-sans leading-relaxed">
            The application encountered an unexpected state. We&apos;ve logged the details and are ready to recover.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="w-full px-6 py-4 bg-accent-purple text-white rounded-xl transition-all font-bold shadow-lg shadow-accent-purple/20 hover:shadow-accent-purple/40 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/dashboard"
                className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-bold text-xs text-white/70 flex items-center justify-center gap-2"
              >
                <Home size={14} /> Dashboard
              </Link>
              <Link
                href="/support"
                className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-bold text-xs text-white/70 flex items-center justify-center gap-2"
              >
                <LifeBuoy size={14} /> Support
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
