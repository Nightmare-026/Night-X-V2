'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import BrandWordmark from '@/components/ui/BrandWordmark';
import { useToast } from '@/components/ui/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        toast('Password recovery instructions sent!', 'success');
      } else {
        setIsSubmitted(true);
      }
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#080A0E]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/8 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        <div className="flex justify-center mb-7">
          <Link href="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <BrandWordmark size="lg" />
          </Link>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-md)] relative overflow-hidden">
          <div className="mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Reset Password</h1>
            <p className="text-xs text-text-tertiary">Enter your account email to receive recovery instructions</p>
          </div>

          {isSubmitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Check Your Inbox</h3>
                <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">
                  If an account exists for <span className="font-semibold text-white">{email}</span>, we have dispatched a secure password reset link.
                </p>
              </div>
              <Link
                href="/auth/signin"
                className="btn-primary w-full text-xs font-semibold py-2.5 inline-flex items-center justify-center gap-2 mt-4"
              >
                <span>Back to Sign In</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary block">Email Address</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-10 bg-surface-inset border border-white/10 rounded-xl pl-9 pr-4 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary/60 shadow-inner transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full h-10 text-xs font-bold shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/auth/signin"
                  className="text-xs text-text-tertiary hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowLeft size={13} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
