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
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full rounded-3xl border border-red-500/20 bg-[#0E1118] p-8 md:p-12 text-center relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
        >
          <div className="relative z-10 space-y-4">
            <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.15)]">
              <AlertCircle className="w-8 h-8" />
            </div>
            
            <h1 className="text-3xl font-black tracking-tight text-white">System Interrupted</h1>
            <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
              A runtime anomaly was caught. Your browser data and local state remain safe in memory.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              <button
                onClick={() => reset()}
                className="flex items-center justify-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all font-bold text-xs group text-white"
              >
                <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                Reload Workspace
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20"
              >
                <Home className="w-4 h-4" />
                Safe Exit
              </Link>
            </div>

            <div className="pt-6 border-t border-white/[0.08]">
              <Link 
                href="/support"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-tertiary hover:text-emerald-400 transition-colors"
              >
                <MessageCircle size={13} />
                Contact Night X Support
              </Link>
            </div>
          </div>
        </motion.div>
      </body>
    </html>
  );
}
