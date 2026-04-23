"use client";

import { motion } from "framer-motion";

export function ToolSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-4">
        <div className="h-10 bg-white/10 rounded-lg w-1/3 mx-auto" />
        <div className="h-4 bg-white/5 rounded-lg w-2/3 mx-auto" />
      </div>

      {/* Main Content Area Skeleton */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="h-40 bg-white/5 rounded-xl border border-dashed border-white/10" />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-white/5 rounded-xl" />
          <div className="h-12 bg-white/5 rounded-xl" />
        </div>

        <div className="space-y-3">
          <div className="h-4 bg-white/5 rounded w-1/4" />
          <div className="h-24 bg-white/5 rounded-xl" />
        </div>

        <div className="h-14 bg-white/10 rounded-xl" />
      </div>
    </div>
  );
}
