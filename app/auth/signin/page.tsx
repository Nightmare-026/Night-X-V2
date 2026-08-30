'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle,
  ArrowRight,
  Mail,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useToast } from '@/components/ui/Toast';
import BrandWordmark from '@/components/ui/BrandWordmark';

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rawCallback = searchParams.get('callbackUrl') || '/dashboard';
  const redirectPath = rawCallback.startsWith('/') && !rawCallback.startsWith('//') && !rawCallback.includes('\\') ? rawCallback : '/dashboard';

  useEffect(() => {
    if (searchParams.get('error')) {
      setError('Authentication failed. Please check your credentials and try again.');
    }
  }, [searchParams]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials. Please check your email and password.");
        toast("Sign in failed", "error");
      } else {
        toast("Welcome back!", "success");
        router.push(redirectPath);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      toast("Error", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn('google', { callbackUrl: redirectPath });
    } catch {
      setError("Google sign in failed.");
      toast("Error", "error");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#080A0E]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full dot-grid opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[420px]"
      >
        {/* Logo */}
        <div className="flex justify-center mb-7">
          <Link href="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <BrandWordmark size="lg" />
          </Link>
        </div>

        {/* Auth Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-md)] relative overflow-hidden">
          <div className="mb-6 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Welcome Back</h1>
            <p className="text-xs text-text-tertiary">Sign in to your private workspace</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-red-400 text-xs leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {/* Social Logins */}
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-10 bg-white text-black rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-white/[0.08]"></div>
              <span className="flex-shrink mx-3 text-[10px] font-bold text-text-muted uppercase tracking-wider">Or with email</span>
              <div className="flex-grow border-t border-white/[0.08]"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignIn} className="space-y-3.5">
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
                    className="w-full h-10 bg-surface-inset border border-white/10 rounded-xl pl-9 pr-4 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 shadow-inner transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center px-0.5">
                  <label className="text-xs font-semibold text-text-secondary">Password</label>
                  <Link href="/auth/forgot-password" className="text-xs font-semibold text-primary hover:underline transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 bg-surface-inset border border-white/10 rounded-xl pl-9 pr-10 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 shadow-inner transition-all"
                    placeholder="Enter your password"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full h-10 text-xs font-bold shadow-md flex items-center justify-center gap-2 mt-1"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In to Night X"}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center pt-5 border-t border-white/[0.08]">
            <p className="text-xs text-text-tertiary">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="text-primary font-bold hover:underline inline-flex items-center gap-1">
                <span>Create free account</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SigninPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#080A0E]">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <SigninForm />
    </Suspense>
  );
}
