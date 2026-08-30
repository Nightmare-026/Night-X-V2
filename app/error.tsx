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
        className="max-w-md w-full rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-lg)] relative overflow-hidden"
      >
        <div className="relative z-10 space-y-4">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-amber-500/25 shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Something Stalled</h2>
          <p className="text-text-secondary text-xs leading-relaxed">
            The application encountered an unexpected runtime condition. You can safely retry or return to your dashboard.
          </p>

          <div className="pt-2 flex flex-col gap-2.5">
            <button
              onClick={() => reset()}
              className="btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Try Again</span>
            </button>
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/dashboard"
                className="btn-secondary py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Home size={13} /> Dashboard
              </Link>
              <Link
                href="/support"
                className="btn-secondary py-2 text-xs font-semibold flex items-center justify-center gap-1.5"
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
