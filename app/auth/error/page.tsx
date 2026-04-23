'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, RefreshCcw, Zap } from 'lucide-react';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: "There is a problem with the server configuration. Please try again later.",
    AccessDenied: "Access was denied. You may not have permission to view this page.",
    Verification: "The verification link has expired or has already been used.",
    Default: "An unexpected authentication error occurred."
  };

  const message = error ? (errorMessages[error] || errorMessages.Default) : errorMessages.Default;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-500 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-purple blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <Zap className="w-8 h-8 text-accent-purple fill-accent-purple/20" />
            <span className="text-2xl font-bold font-syne text-white">Night X</span>
          </Link>
          <h2 className="text-3xl font-bold font-syne text-white">Auth Error</h2>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 backdrop-blur-xl">
          <div className="w-20 h-20 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-2">
            <ShieldAlert className="w-10 h-10" />
          </div>

          <div className="space-y-3 text-center">
            <h3 className="text-xl font-bold text-white">Authentication Failed</h3>
            <p className="text-white/50 text-sm leading-relaxed">
              {message}
            </p>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Link
              href="/auth/signin"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-accent-purple text-white font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <RefreshCcw size={18} /> Try Signing In Again
            </Link>
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 py-3 text-white/40 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Back to Homepage
            </Link>
          </div>
        </div>
        
        <p className="text-center mt-8 text-xs text-white/20">
          Error Code: <span className="font-mono text-white/40">{error || 'Unknown'}</span>
        </p>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><RefreshCcw className="w-8 h-8 animate-spin text-accent-purple" /></div>}>
      <ErrorContent />
    </Suspense>
  );
}
