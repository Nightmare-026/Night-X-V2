"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="relative w-24 h-24">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-t-2 border-blue-500 border-opacity-50"
        />
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-b-2 border-purple-500 border-opacity-50"
        />
        {/* Center Logo/Dot */}
        <motion.div
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"
        />
      </div>
    </div>
  );
}
