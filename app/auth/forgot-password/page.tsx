'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, ShieldAlert, Zap } from 'lucide-react';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-purple blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-cyan blur-[120px]" />
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
          <h2 className="text-3xl font-bold font-syne text-white">Password Help</h2>
          <p className="text-white/40 mt-2">
            Self-serve password reset is not enabled on this deployment yet.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-3 text-center">
            <h3 className="text-xl font-bold text-white">Use one of these options</h3>
            <p className="text-white/45 text-sm">
              If you signed up with Google, go back and continue with Google. If you created an email-password account, contact support to reset access manually.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
            <div className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 text-accent-cyan" />
              <div>
                <p className="font-medium text-white">Support email</p>
                <a href="mailto:sunlight002614@gmail.com" className="text-accent-cyan hover:underline">
                  sunlight002614@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/auth/signin"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-accent-purple text-white font-semibold transition-colors hover:bg-accent-purple/90"
            >
              Back to Sign In
            </Link>
            <Link
              href="/contact"
              className="w-full flex items-center justify-center gap-2 py-3 text-white/50 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Open Contact Page
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
