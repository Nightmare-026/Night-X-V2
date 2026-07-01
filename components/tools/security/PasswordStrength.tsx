'use client';
import { cn } from '@/lib/utils';

import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldAlert, Eye, EyeOff, Copy, Check, Info , Lock, Clock, AlertCircle, Database} from 'lucide-react';
import zxcvbn from 'zxcvbn';
import { motion, AnimatePresence } from 'framer-motion';

export default function PasswordStrength() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (password) {
      setResult(zxcvbn(password));
    } else {
      setResult(null);
    }
  }, [password]);

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    switch (score) {
      case 0: return 'bg-red-500';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-emerald-400';
      case 4: return 'bg-emerald-500';
      default: return 'bg-white/5';
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 0: return 'Critical Weakness';
      case 1: return 'Vulnerable';
      case 2: return 'Suboptimal';
      case 3: return 'Secure';
      case 4: return 'Hardened';
      default: return 'Awaiting Input';
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Input & Settings */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="text-emerald-400" size={16} />
                <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Entropy Input</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 hover:bg-white/5 rounded-md transition-colors text-white/40 hover:text-white"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button
                  onClick={handleCopy}
                  disabled={!password}
                  className="p-2 hover:bg-white/5 rounded-md transition-colors text-white/40 hover:text-white disabled:opacity-20"
                  title="Copy password"
                >
                  {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Analyze password strength..."
                className="w-full bg-black/40 border border-white/[0.05] rounded-md px-6 py-5 text-lg font-mono focus:outline-none focus:border-emerald-400/50 transition-all"
              />
              <p className="text-[10px] text-white/20 uppercase font-bold tracking-widest px-1">
                {password.length} Characters Detected
              </p>
            </div>

            {/* Privacy Badge */}
            <div className="p-4 bg-emerald-400/5 border border-emerald-400/10 rounded-md flex items-start gap-3">
              <Lock size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Privacy Protocol</p>
                <p className="text-[10px] text-white/40 leading-relaxed font-inter mt-1">
                  Local-only execution. Cryptographic entropy remains in browser memory.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Analysis */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden min-h-[500px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 space-y-12">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase mb-2">Security Evaluation</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Entropy Breakdown</h2>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Status</div>
                  <div className={cn(
                    "text-xs font-bold uppercase tracking-widest",
                    result ? (result.score < 2 ? "text-red-400" : "text-emerald-400") : "text-white/20"
                  )}>
                    {getScoreLabel(result?.score ?? -1)}
                  </div>
                </div>
              </div>

              {/* Strength Meter (5-segment) */}
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div 
                      key={i}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        result && i <= result.score ? getScoreColor(result.score) : "bg-white/5"
                      )}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/20">
                  <span>Weak</span>
                  <span>Hardened</span>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  >
                    {/* Crack Times */}
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Clock size={12} />
                        Crack Latency
                      </h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Online Attack', value: result.crack_times_display.online_no_throttling_10_per_second },
                          { label: 'Offline (Fast)', value: result.crack_times_display.offline_fast_hashing_1e10_per_second },
                          { label: 'Offline (Slow)', value: result.crack_times_display.offline_slow_hashing_1e4_per_second },
                        ].map((item, idx) => (
                          <div key={idx} className="flex justify-between items-end border-b border-white/[0.03] pb-2">
                            <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{item.label}</span>
                            <span className="text-xs font-mono text-white/80">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Suggestions */}
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <Info size={12} />
                        Protocol Suggestions
                      </h3>
                      <div className="space-y-4">
                        {result.feedback.warning && (
                          <div className="flex gap-3 text-red-400 bg-red-400/5 p-4 rounded-md border border-red-400/10 text-[10px] font-bold uppercase tracking-widest">
                            <AlertCircle size={14} className="shrink-0" />
                            <p className="leading-relaxed">{result.feedback.warning}</p>
                          </div>
                        )}
                        
                        {result.feedback.suggestions.length > 0 ? (
                          <div className="space-y-3">
                            {result.feedback.suggestions.map((suggestion: string, idx: number) => (
                              <div key={idx} className="flex gap-3 text-white/60 text-[10px] font-inter uppercase tracking-widest">
                                <Check size={12} className="text-emerald-400 shrink-0 mt-0.5" />
                                <p className="leading-relaxed">{suggestion}</p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex gap-3 text-emerald-400 bg-emerald-400/5 p-4 rounded-md border border-emerald-400/10 text-[10px] font-bold uppercase tracking-widest">
                            <ShieldCheck size={14} className="shrink-0" />
                            <p className="leading-relaxed">Optimal entropy detected. No modifications required.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-10 space-y-4">
                    <Database size={48} strokeWidth={1} />
                    <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Entropy Feed</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

