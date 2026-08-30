"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#080A0E]/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="relative w-12 h-12">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-white/10 border-t-primary"
        />
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-white/10 border-b-accent-cyan"
        />
        {/* Center Indicator */}
        <div className="absolute inset-0 m-auto w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
      </div>
      <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/80 animate-pulse font-mono">
        Initializing Workspace
      </p>
    </div>
  );
}
