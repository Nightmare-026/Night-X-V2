'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Eye, 
  EyeOff, 
  LogIn, 
  Loader2,
  Clock,
  Zap as ZapIcon,
  Shield,
  LayoutDashboard,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { AnimatePresence } from 'framer-motion';

function SigninForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shakeVariants = {
    error: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  // Redirect if already logged in
  React.useEffect(() => {
    if (status === 'authenticated') {
      router.push(callbackUrl);
    }
  }, [status, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          setError("Invalid email or password");
          toast("Login failed. Please check your credentials.", "error");
        } else {
          setError("Something went wrong. Please try again.");
          toast("An unexpected error occurred during sign in.", "error");
        }
      } else {
        toast("Welcome back! Redirecting...", "success");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred");
      toast("Connection error. Please check your internet.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: <ZapIcon size={20} />, text: "40+ Pro Tools" },
    { icon: <Clock size={20} />, text: "Instant Processing" },
    { icon: <Shield size={20} />, text: "Encrypted Data" },
    { icon: <LayoutDashboard size={20} />, text: "Unified Hub" },
  ];

  return (
    <div className="min-h-screen flex bg-background">
      
      {/* Left Side: Visuals (Desktop only) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#06080F] border-r border-white/5">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[20%] right-[-5%] w-[60%] h-[60%] rounded-full bg-accent-cyan blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-accent-purple blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 w-full flex flex-col justify-center px-16 xl:px-24">
          <h1 className="text-5xl xl:text-6xl font-bold font-syne text-white leading-tight mb-8">
            Welcome back.<br />
            <span className="text-accent-cyan">40+ tools await.</span>
          </h1>
          
          <div className="grid grid-cols-2 gap-6 max-w-md">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md flex flex-col gap-3"
              >
                <div className="text-accent-purple">{stat.icon}</div>
                <span className="text-sm font-medium text-white/70">{stat.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Signin Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 md:p-12 w-full">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px]"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <Zap className="w-8 h-8 text-accent-purple fill-accent-purple/20" />
              <span className="text-2xl font-bold font-syne text-white">Night X</span>
            </Link>
            <h2 className="text-3xl font-bold font-syne text-white">Sign In</h2>
            <p className="text-white/40 mt-2">Access your workspace and tools.</p>
          </div>

          {/* Google Button */}
          <button 
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-black font-semibold rounded-xl hover:bg-white/90 transition-all mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-white/20 font-medium">or email & password</span>
            </div>
          </div>

          {/* Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            animate={error ? "error" : ""}
            variants={shakeVariants}
          >
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5 ml-1">Email Address</label>
              <input 
                type="email" 
                placeholder="john@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-sm font-medium text-white/60">Password</label>
                <Link href="/auth/forgot-password" className="text-xs text-white/30 hover:text-accent-cyan hover:underline transition-colors">
                  Need password help?
                </Link>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-accent-purple transition-colors"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20 flex items-center gap-3"
                >
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={isLoading}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-4 bg-accent-cyan text-black font-bold rounded-xl transition-all shadow-xl shadow-accent-cyan/10 mt-2",
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98] hover:bg-white"
              )}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <LogIn size={18} /></>}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-8">
            Don&apos;t have an account? <Link href="/auth/signup" className="text-white hover:text-accent-cyan font-semibold hover:underline">Create one</Link>
          </p>
          <p className="text-center text-white/25 text-xs mt-3">
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
