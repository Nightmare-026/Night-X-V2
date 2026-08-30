"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RotateCcw, Home, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical Runtime Error:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-[#080A0E] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-lg w-full rounded-2xl border border-red-500/20 bg-[#0E1118] p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 space-y-3.5">
            <div className="w-12 h-12 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-red-500/20 shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <h1 className="text-2xl font-bold tracking-tight text-white">System Interrupted</h1>
            <p className="text-text-secondary text-xs leading-relaxed max-w-sm mx-auto">
              A runtime anomaly was caught. Your browser data and local state remain safe in memory.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
              <button
                onClick={() => reset()}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold text-xs text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Workspace</span>
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-black font-bold text-xs rounded-xl transition-all shadow-md"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-white/[0.08]">
              <Link 
                href="/support"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-tertiary hover:text-primary transition-colors"
              >
                <MessageCircle size={12} />
                <span>Contact Night X Support</span>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
