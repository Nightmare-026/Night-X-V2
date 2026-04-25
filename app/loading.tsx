"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-[#06080F]/80 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div className="relative w-16 h-16">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-white/5 border-t-accent-purple"
        />
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-white/5 border-b-accent-cyan"
        />
        {/* Center Pulsing Logo */}
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        />
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 animate-pulse"
      >
        Initializing Night X
      </motion.p>
    </div>
  );
}
