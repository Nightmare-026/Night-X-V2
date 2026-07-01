'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, ShieldAlert, Zap, ArrowRight, Shield } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#030303]">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[480px]"
      >
        {/* Branding Hub */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="group flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-black border border-white/10 rounded-md flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.2)]">
              <Zap className="text-violet-500 fill-violet-500" size={24} />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tighter text-white uppercase">Access<span className="text-violet-500">_Recovery</span></h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/20 mt-1">Protocol Initialization</p>
            </div>
          </Link>
        </div>

        {/* Main Interface Card */}
        <div className="glass-card bg-black/40 backdrop-blur-2xl border-white/5 p-10 rounded-md shadow-2xl relative overflow-hidden group text-center">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          
          <div className="w-20 h-20 bg-violet-600/10 border border-violet-500/20 rounded-md flex items-center justify-center mx-auto mb-8 shadow-xl">
            <ShieldAlert size={32} className="text-violet-500" />
          </div>

          <div className="mb-10 space-y-4">
            <h2 className="text-xl font-bold text-white font-outfit uppercase tracking-wider">Access Buffer Locked</h2>
            <p className="text-xs text-white/40 leading-relaxed uppercase tracking-tighter font-medium">
              Manual recovery protocols are currently required for this instance. Direct reset cycles are restricted to administrative oversight.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-md border border-white/5 bg-white/[0.02] text-left group/meta">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Support Channel</p>
                  <a href="mailto:support@night-x.app" className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors">
                    support@night-x.app
                  </a>
                </div>
              </div>
            </div>

            <Link
              href="/auth/signin"
              className="w-full h-12 bg-violet-600 text-white rounded-md font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-violet-500 transition-all shadow-lg shadow-violet-900/40 group/btn active:scale-[0.98]"
            >
              Authenticate Session
              <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform opacity-50" />
            </Link>

            <Link
              href="/contact"
              className="w-full h-12 bg-white/[0.02] border border-white/5 text-white/40 hover:text-white rounded-md font-bold text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft size={12} /> Open Support Portal
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-white/[0.03] flex items-center justify-center gap-4 text-white/10">
            <Shield size={12} />
            <span className="text-[8px] font-bold uppercase tracking-[0.3em]">Identity Governance Protocol</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
