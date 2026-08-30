'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, RefreshCcw } from 'lucide-react';
import BrandWordmark from '@/components/ui/BrandWordmark';

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: "There is a temporary issue with the authentication service. Please try again shortly.",
    AccessDenied: "Access was denied. Please verify your credentials or permissions.",
    Verification: "The verification link has expired or has already been used.",
    Default: "An unexpected authentication error occurred. Please sign in again."
  };

  const message = error ? (errorMessages[error] || errorMessages.Default) : errorMessages.Default;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-[#080A0E] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-500/8 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="text-center mb-7">
          <Link href="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <BrandWordmark size="lg" />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-md)] space-y-5 text-center">
          <div className="w-14 h-14 bg-red-500/10 text-red-400 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-white">Authentication Failed</h1>
            <p className="text-text-tertiary text-xs leading-relaxed max-w-xs mx-auto">
              {message}
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/auth/signin"
              className="btn-primary w-full text-xs font-semibold py-2.5 flex items-center justify-center gap-2"
            >
              <RefreshCcw size={14} />
              <span>Try Signing In Again</span>
            </Link>
            <Link
              href="/"
              className="btn-secondary w-full text-xs font-semibold py-2.5 flex items-center justify-center gap-2"
            >
              <ArrowLeft size={14} />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#080A0E]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
