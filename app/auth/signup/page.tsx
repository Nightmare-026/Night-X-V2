'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Loader2,
  AlertCircle,
  User,
  Mail,
  Lock,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { Turnstile } from '@marsidev/react-turnstile';
import BrandWordmark from '@/components/ui/BrandWordmark';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms_accepted: false,
    website_url: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strength, setStrength] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  useEffect(() => {
    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/[0-9]/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;
    setStrength(score);
  }, [formData.password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!turnstileToken) {
      setError("Please complete the security check");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, turnstileToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created. Please sign in manually.");
        toast("Account created! Please sign in.", "success");
        router.push('/auth/signin');
      } else {
        toast("Welcome to Night X!", "success");
        router.push('/dashboard?welcome=true');
      }
    } catch (err: any) {
      setError(err.message);
      toast(err.message || "Registration failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden bg-[#080A0E]">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full dot-grid opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[460px]"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
            <BrandWordmark size="lg" />
          </Link>
        </div>

        {/* Auth Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-md)] relative overflow-hidden">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-1.5">Create Account</h1>
            <p className="text-xs text-text-tertiary">Join creators & engineers using Night X</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2.5 text-red-400 text-xs leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Full Name</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 bg-surface-inset border border-white/10 rounded-xl pl-9 pr-3 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary/60 shadow-[var(--shadow-inset-sm)] transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Email</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-10 bg-surface-inset border border-white/10 rounded-xl pl-9 pr-3 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary/60 shadow-[var(--shadow-inset-sm)] transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-10 bg-surface-inset border border-white/10 rounded-xl pl-9 pr-10 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary/60 shadow-[var(--shadow-inset-sm)] transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength Indicators */}
              <div className="flex gap-1 mt-1.5">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-300", i < strength ? "bg-primary" : "bg-white/5")} />
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary">Confirm Password</label>
              <input 
                type="password" 
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full h-10 bg-surface-inset border border-white/10 rounded-xl px-3 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-primary/60 shadow-[var(--shadow-inset-sm)] transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <input 
                type="checkbox" 
                id="terms"
                required
                checked={formData.terms_accepted}
                onChange={(e) => setFormData({ ...formData, terms_accepted: e.target.checked })}
                className="mt-0.5 accent-primary rounded cursor-pointer"
              />
              <label htmlFor="terms" className="text-[11px] text-text-tertiary leading-tight cursor-pointer">
                I agree to the <Link href="/terms" className="text-primary-400 font-semibold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary-400 font-semibold hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <div className="py-1 flex justify-center scale-90">
              <Turnstile 
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading || !formData.terms_accepted || !turnstileToken}
              className="btn-primary w-full h-11 text-xs font-bold shadow-lg flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Free Account"}
            </button>
          </form>

          <div className="mt-6 text-center pt-5 border-t border-white/[0.08]">
            <p className="text-xs text-text-tertiary">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary-400 font-bold hover:underline inline-flex items-center gap-1">
                <span>Sign in</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
