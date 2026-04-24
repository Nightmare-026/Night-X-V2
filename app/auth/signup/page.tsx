'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  ImageIcon, 
  Type, 
  Lock, 
  Globe, 
  Sparkles,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { AnimatePresence } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms_accepted: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [strength, setStrength] = useState(0); // 0-4

  const shakeVariants = {
    error: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    }
  };

  // Password strength logic
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

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Automatically sign in after registration
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but failed to sign in. Please sign in manually.");
        addToast("Account created! Please sign in.", "success");
        router.push('/auth/signin');
      } else {
        addToast("Welcome to Night X! Your account is ready.", "success");
        router.push('/dashboard?welcome=true');
      }
    } catch (err: any) {
      setError(err.message);
      addToast(err.message || "Registration failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "40+ Utility Tools, Free to Use",
    "No Credit Card Required",
    "Privacy First Processing",
    "Lightning Fast Performance"
  ];

  const categories = [
    { icon: <ImageIcon size={18} />, label: "Images" },
    { icon: <Type size={18} />, label: "Text" },
    { icon: <ShieldCheck size={18} />, label: "Security" },
    { icon: <Cpu size={18} />, label: "Dev Tools" },
    { icon: <Globe size={18} />, label: "Web Utilities" },
    { icon: <Zap size={18} />, label: "Daily Life" },
    { icon: <Sparkles size={18} />, label: "AI Magic" },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      
      {/* Left Side: Benefits (Desktop only) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-[#06080F] border-r border-white/5">
        {/* Animated Background Mesh */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-accent-purple blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-accent-cyan blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 w-full flex flex-col justify-center px-16 xl:px-24">
          <h1 className="text-5xl xl:text-6xl font-bold font-syne text-white leading-tight mb-8">
            Your toolkit.<br />
            <span className="text-accent-purple">All in one place.</span>
          </h1>
          
          <div className="space-y-6 mb-12">
            {benefits.map((benefit, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 text-white/70"
              >
                <div className="p-1 rounded-full bg-accent-purple/10 text-accent-purple">
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-lg font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                <div className="text-accent-cyan">{cat.icon}</div>
                <span className="text-sm text-white/50">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Signup Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 md:p-12 relative">
        {/* Mobile-only background elements */}
        <div className="lg:hidden absolute inset-0 -z-10 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-accent-purple/20 blur-[100px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <Zap className="w-8 h-8 text-accent-purple fill-accent-purple/20" />
              <span className="text-2xl font-bold font-syne text-white">Night X</span>
            </Link>
            <h2 className="text-3xl font-bold font-syne text-white">Create Account</h2>
            <p className="text-white/40 mt-2">Get started with your free digital toolkit.</p>
          </div>

          {/* Google Button */}
          <button 
            onClick={() => signIn('google')}
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
              <span className="bg-background px-4 text-white/20 font-medium">or continue with email</span>
            </div>
          </div>

          {/* Registration Form */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-4"
            animate={error ? "error" : ""}
            variants={shakeVariants}
          >
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5 ml-1">Full Name</label>
              <input 
                type="text" 
                placeholder="John Doe"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

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

            <div className="relative">
              <label className="block text-sm font-medium text-white/60 mb-1.5 ml-1">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="........"
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
              
              {/* Strength Meter */}
              <div className="mt-2 h-1 w-full bg-white/5 rounded-full overflow-hidden flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "h-full flex-1 transition-all duration-500",
                      i < strength 
                        ? (strength <= 1 ? "bg-red-500" : strength === 2 ? "bg-orange-500" : strength === 3 ? "bg-yellow-500" : "bg-green-500")
                        : "bg-transparent"
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] text-white/20 mt-1 uppercase tracking-wider font-bold">
                Strength: {strength === 0 ? "Empty" : strength === 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5 ml-1">Confirm Password</label>
              <input 
                type="password" 
                placeholder="........"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple transition-colors"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            <div className="flex items-start gap-3 py-2">
              <input 
                type="checkbox" 
                id="terms"
                className="mt-1 accent-accent-purple w-4 h-4"
                required
                checked={formData.terms_accepted}
                onChange={(e) => setFormData({ ...formData, terms_accepted: e.target.checked })}
              />
              <label htmlFor="terms" className="text-sm text-white/40 leading-snug">
                I agree to the <Link href="/terms" className="text-accent-cyan hover:underline">Terms & Conditions</Link> and <Link href="/privacy" className="text-accent-cyan hover:underline">Privacy Policy</Link>.
              </label>
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
              disabled={isLoading || !formData.terms_accepted}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-4 bg-accent-purple text-white font-bold rounded-xl transition-all shadow-xl shadow-accent-purple/20",
                (isLoading || !formData.terms_accepted) ? "opacity-50 cursor-not-allowed grayscale" : "hover:scale-[1.02] active:scale-[0.98]"
              )}
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </motion.form>

          <p className="text-center text-white/40 text-sm mt-8">
            Already have an account? <Link href="/auth/signin" className="text-white hover:text-accent-purple font-semibold hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
