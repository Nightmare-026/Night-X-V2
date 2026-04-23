"use client";

import { motion } from "framer-motion";
import { SearchX, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-6"
      >
        <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <div className="absolute inset-0 border-2 border-dashed border-white/20 rounded-full animate-spin-slow" />
          <SearchX className="w-16 h-16 text-gray-400" />
        </div>
        
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-white">Page not found</h2>
        
        <p className="text-gray-400">
          The tool or page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="pt-8">
          <Link
            href="/dashboard"
            className="inline-flex px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-bold transition-colors items-center gap-2"
          >
            <Home className="w-5 h-5" /> Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
