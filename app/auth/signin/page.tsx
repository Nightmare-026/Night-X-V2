'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Zap, 
  Eye, 
  EyeOff, 
  LogIn, 
  Loader2,
  Clock,
  Shield,
  LayoutDashboard,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmail, signInWithGoogle } from '@/lib/auth';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectPath = searchParams.get('redirect') || '/dashboard';

  useEffect(() => {
    if (searchParams.get('error')) {
      setError('Authentication failed. Please try again.');
    }
  }, [searchParams]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await signInWithEmail(email, password);
      if (signInError) {
        setError(signInError.message);
        toast(signInError.message, "error");
      } else {
        toast("Welcome back!", "success");
        router.push(redirectPath);
      }
    } catch (err: any) {
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: signInError } = await signInWithGoogle();
      if (signInError) {
        setError(signInError.message);
        toast(signInError.message, "error");
      } else {
        toast("Welcome back!", "success");
        router.push(redirectPath);
      }
    } catch (err: any) {
      setError(err.message);
      toast(err.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: <Zap size={20} />, text: "40+ Pro Tools" },
    { icon: <Clock size={20} />, text: "Instant Processing" },
    { icon: <Shield size={20} />, text: "Encrypted Data" },
    { icon: <LayoutDashboard size={20} />, text: "Unified Hub" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      
      {/* Left Side: Visuals (Desktop only) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#06080F] border-r border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-accent-purple rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(147,51,234,0.3)] group-hover:scale-105 transition-transform">
                <Zap className="text-white fill-white" size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">NIGHT<span className="text-accent-purple">X</span></span>
            </Link>
          </div>

          <div className="max-w-md">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black text-white leading-tight mb-6"
            >
              The Modern <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-blue">Developer Hub</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-white/50 mb-12 leading-relaxed"
            >
              Access a professional suite of tools designed for the modern web. High performance, zero bloat, pure productivity.
            </motion.p>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.text}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10"
                >
                  <div className="text-accent-purple">{stat.icon}</div>
                  <span className="text-sm font-medium text-white/70">{stat.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="text-white/20 text-sm font-medium">
            &copy; 2026 Anti Gravity. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side: Sign-In Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 lg:p-16 relative">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-black text-white">Welcome Back</h2>
            <p className="text-white/40 font-medium">Sign in to your professional workspace</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-sm"
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}

          <div className="space-y-4">
            <button 
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-14 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-white/90 disabled:opacity-50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold text-white/20 uppercase tracking-widest">or email</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Email Address</label>
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:outline-none focus:border-accent-purple/50 transition-colors"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-white/40 uppercase ml-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white focus:outline-none focus:border-accent-purple/50 transition-colors"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-accent-purple text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-accent-purple/90 disabled:opacity-50 transition-all shadow-lg shadow-accent-purple/20"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <LogIn size={20} />}
                Sign In
              </button>
            </form>
          </div>

          <p className="text-center text-white/40 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-accent-purple font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 text-center"
        >
          <p className="text-center text-white/25 text-[10px] uppercase font-bold tracking-widest mb-2">Powered by NightX infrastructure</p>
          <p className="text-center text-white/25 text-xs">
            Google sign-in is the fastest option. Password resets are handled manually for now.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function SigninPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-accent-purple" /></div>}>
      <SigninForm />
    </Suspense>
  );
}
