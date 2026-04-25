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
    // Log to console but could also send to Sentry/LogRocket
    console.error("Critical Runtime Error:", error);
  }, [error]);

  return (
    <html>
      <body className="min-h-screen bg-[#06080F] text-white flex flex-col items-center justify-center p-6 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg w-full glass-card border-red-500/20 p-8 md:p-12 text-center relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-red-500/10 blur-[100px] pointer-events-none" />

          <div className="relative z-10">
            <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-8 rotate-3 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
              <AlertCircle className="w-10 h-10" />
            </div>
            
            <h1 className="text-4xl font-bold font-syne mb-4 tracking-tight">System Interrupted</h1>
            <p className="text-white/50 text-lg mb-8 leading-relaxed">
              We encountered a critical error while processing your request. The session has been safely isolated.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => reset()}
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all font-bold group"
              >
                <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                Reload System
              </button>
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-accent-purple text-white rounded-2xl transition-all font-bold shadow-xl shadow-accent-purple/20 hover:shadow-accent-purple/40 hover:-translate-y-0.5"
              >
                <Home className="w-5 h-5" />
                Safe Exit
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t border-white/5">
              <Link 
                href="/support"
                className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white/30 hover:text-accent-purple transition-colors"
              >
                <MessageCircle size={14} />
                Contact Mission Control
              </Link>
            </div>
          </div>
        </motion.div>
      </body>
    </html>
  );
}
