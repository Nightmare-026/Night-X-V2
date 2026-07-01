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
    <div className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full dot-grid opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[480px]"
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold text-xl shadow-glow-primary group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent tracking-tight">
              Night X
            </span>
          </Link>
        </div>

        {/* Auth Card */}
        <div className="glass-card p-8 md:p-10 rounded-[32px] border-white/[0.08] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-2">Create Account</h2>
            <p className="text-sm text-text-tertiary">Join 10,000+ users on Night X</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-red-400 text-xs leading-relaxed"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text-secondary ml-1">Email</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                  <Lock className="w-4 h-4" />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-12 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength Indicators */}
              <div className="flex gap-1.5 mt-2 px-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={cn("h-1 flex-1 rounded-full transition-all duration-500", i < strength ? "bg-primary" : "bg-white/5")} />
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-secondary ml-1">Confirm Password</label>
              <input 
                type="password" 
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full h-12 bg-white/[0.03] border border-white/10 rounded-2xl px-5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start gap-3 py-2 px-1">
              <div className="relative flex items-center justify-center mt-0.5">
                <input 
                  type="checkbox" 
                  id="terms"
                  required
                  checked={formData.terms_accepted}
                  onChange={(e) => setFormData({ ...formData, terms_accepted: e.target.checked })}
                  className="peer appearance-none w-5 h-5 rounded-lg border border-white/10 bg-white/5 checked:bg-primary checked:border-primary transition-all cursor-pointer"
                />
                <Check className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
              </div>
              <label htmlFor="terms" className="text-xs text-text-tertiary leading-relaxed cursor-pointer">
                I agree to the <Link href="/terms" className="text-primary hover:text-primary-400 font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:text-primary-400 font-bold">Privacy Policy</Link>.
              </label>
            </div>

            <div className="py-2 flex justify-center scale-90 md:scale-100">
              <Turnstile 
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken(null)}
                
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading || !formData.terms_accepted || !turnstileToken}
              className="w-full h-14 bg-gradient-primary text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-glow-primary disabled:opacity-50 mt-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
            </button>
          </form>

          <div className="mt-10 text-center pt-8 border-t border-white/[0.08]">
            <p className="text-sm text-text-tertiary">
              Already have an account? <br />
              <Link href="/auth/signin" className="text-primary font-bold hover:text-primary-400 transition-all inline-flex items-center mt-2 group/link">
                Sign In Instead <ArrowRight className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-12 text-center text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">
          <p>© {new Date().getFullYear()} Night X. All connections are secured.</p>
        </div>
      </motion.div>
    </div>
  );
}

