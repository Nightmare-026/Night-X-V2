"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#080A0E]/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="relative w-14 h-14">
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
        {/* Center Pulsing Indicator */}
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]"
        />
      </div>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-primary-400/80 animate-pulse font-mono"
      >
        Initializing Workspace
      </motion.p>
    </div>
  );
}
