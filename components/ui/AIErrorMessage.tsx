'use client';

import React from 'react';
import { AlertCircle, Terminal, LifeBuoy, UserCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIErrorMessageProps {
  error: string;
}

export default function AIErrorMessage({ error }: AIErrorMessageProps) {
  const isKeyMissing = error.toLowerCase().includes('api key') || error.toLowerCase().includes('token');
  const isLimitReached = error.toLowerCase().includes('limit reached');
  const isUnauthorized = error.toLowerCase().includes('unauthorized') || error.toLowerCase().includes('login');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl"
    >
      {/* Decorative background glow */}
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-red-500/10 blur-[50px]" />
      
      <div className="relative flex items-start gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
          <AlertCircle size={28} />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="font-syne text-lg font-bold tracking-tight text-white">
              {isKeyMissing 
                ? "Provider Configuration Needed" 
                : isLimitReached 
                  ? "Usage Limit Exceeded" 
                  : isUnauthorized 
                    ? "Authorization Required" 
                    : "AI Service Connection Issue"}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-white/50">
              {isKeyMissing 
                ? "The AI processing engine is waiting for secure API credentials. Please contact the administrator to finalize setup." 
                : isUnauthorized
                  ? "You have reached an AI-protected tool. Sign in to unlock advanced paraphrasing and generation features."
                  : error}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 pt-2">
            {isUnauthorized ? (
              <a 
                href="/auth/signin" 
                className="group flex items-center gap-2 rounded-xl bg-accent-purple px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(124,110,250,0.4)] active:scale-95"
              >
                <UserCircle size={16} />
                Sign In Now
              </a>
            ) : (
              <>
                <button 
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white/60 border border-white/10 transition-all hover:bg-white/10 hover:text-white"
                >
                  <Terminal size={14} />
                  Retry Process
                </button>
                <a 
                  href="/support" 
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/30 hover:text-accent-cyan transition-colors"
                >
                  <LifeBuoy size={14} />
                  Get Assistance
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
