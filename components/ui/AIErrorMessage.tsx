'use client';

import React from 'react';
import { AlertCircle, Terminal, LifeBuoy } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIErrorMessageProps {
  error: string;
}

export default function AIErrorMessage({ error }: AIErrorMessageProps) {
  const isKeyMissing = error.toLowerCase().includes('api key') || error.toLowerCase().includes('token');
  const isLimitReached = error.toLowerCase().includes('limit reached');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 backdrop-blur-md"
    >
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
          <AlertCircle size={24} />
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="font-syne font-bold text-red-200">
            {isKeyMissing ? "Service Configuration Error" : isLimitReached ? "Daily Limit Reached" : "AI Service Interruption"}
          </h3>
          <p className="text-sm text-red-300/70 leading-relaxed font-dm-sans">
            {isKeyMissing 
              ? "The AI provider keys are currently not configured on this environment. If you are the administrator, please check your Vercel secrets." 
              : error}
          </p>
          
          <div className="pt-4 flex flex-wrap gap-3">
            <a 
              href="/feedback" 
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-300 hover:text-white transition-colors"
            >
              <LifeBuoy size={14} />
              Report Issue
            </a>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-300 hover:text-white transition-colors"
            >
              <Terminal size={14} />
              Retry Connection
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
