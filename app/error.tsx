"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertOctagon, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <AlertOctagon className="w-12 h-12" />
        </div>
        
        <h1 className="text-4xl font-bold">500</h1>
        <h2 className="text-2xl font-semibold">Something went wrong!</h2>
        
        <p className="text-gray-400">
          A critical error occurred. Our team has been notified.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors font-medium text-white"
          >
            Return to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
