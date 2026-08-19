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
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full rounded-3xl border border-white/[0.08] bg-surface-card p-8 sm:p-10 shadow-[var(--shadow-raised-lg)] relative overflow-hidden"
      >
        <div className="relative z-10 space-y-4">
          <div className="w-14 h-14 bg-accent-amber/10 text-accent-amber rounded-2xl flex items-center justify-center mx-auto mb-4 border border-accent-amber/25 shadow-[var(--shadow-raised-sm)]">
            <AlertTriangle className="w-7 h-7" />
          </div>
          
          <h2 className="text-2xl font-bold text-white tracking-tight">Something Stalled</h2>
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
            The application encountered an unexpected runtime condition. You can safely retry or return to your dashboard.
          </p>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => reset()}
              className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(34,197,94,0.35)]"
            >
              <RotateCcw className="w-4 h-4" /> Try Again
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                href="/dashboard"
                className="btn-secondary py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Home size={13} /> Dashboard
              </Link>
              <Link
                href="/support"
                className="btn-secondary py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <LifeBuoy size={13} /> Support Hub
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
