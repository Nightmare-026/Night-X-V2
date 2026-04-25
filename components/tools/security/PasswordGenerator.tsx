'use client';

import React, { useState, useCallback } from 'react';
import { 
  RefreshCw, 
  Copy, 
  Shield, 
  Eye, 
  EyeOff, 
  Zap, 
  Lock, 
  ShieldCheck, 
  ShieldAlert,
  Hash,
  Sparkles,
  Smartphone,
  Check,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

function generatePassword(length: number, opts: { upper: boolean; lower: boolean; numbers: boolean; symbols: boolean }) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const nums = '0123456789';
  const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  let chars = '';
  if (opts.upper) chars += upper;
  if (opts.lower) chars += lower;
  if (opts.numbers) chars += nums;
  if (opts.symbols) chars += syms;
  
  if (!chars) return '';
  
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr, v => chars[v % chars.length]).join('');
}

function getStrength(pw: string) {
  if (!pw) return { label: 'Empty', score: 0, color: 'bg-white/10', icon: <Lock size={14} /> };
  let score = 0;
  if (pw.length >= 12) score++;
  if (pw.length >= 20) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  
  if (score <= 2) return { label: 'Weak', score, color: 'bg-red-500', icon: <ShieldAlert size={14} className="text-red-400" /> };
  if (score === 3) return { label: 'Fair', score, color: 'bg-amber-500', icon: <Shield size={14} className="text-amber-400" /> };
  if (score === 4) return { label: 'Strong', score, color: 'bg-emerald-500', icon: <ShieldCheck size={14} className="text-emerald-400" /> };
  return { label: 'Secure', score, color: 'bg-accent-cyan', icon: <Zap size={14} className="text-accent-cyan" /> };
}

export default function PasswordGenerator() {
  const { toast } = useToast();
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const isValid = upper || lower || numbers || symbols;

  const generate = useCallback(() => {
    if (!isValid) {
      toast("Please select at least one character set", "error");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      const pw = generatePassword(length, { upper, lower, numbers, symbols });
      setPassword(pw);
      setIsGenerating(false);
      toast("Secure password generated", "success");
    }, 400);
  }, [length, upper, lower, numbers, symbols, isValid, toast]);

  const handleCopy = async () => {
    if (!password) return;
    const success = await copyToClipboard(password);
    if (success) {
      toast("Password copied to clipboard", "success");
    }
  };

  const strength = getStrength(password);

  const Toggle = ({ label, value, onChange, icon: Icon }: { label: string; value: boolean; onChange: () => void, icon: any }) => (
    <button
      onClick={onChange}
      className={cn(
        "flex items-center justify-between p-4 rounded-2xl border transition-all w-full group",
        value ? "bg-accent-purple/10 border-accent-purple/30 text-white" : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg transition-colors", value ? "bg-accent-purple/20 text-accent-purple" : "bg-black/20")}>
          <Icon size={14} />
        </div>
        <span className="text-xs font-bold">{label}</span>
      </div>
      <div className={cn(
        "w-8 h-4 rounded-full relative transition-colors",
        value ? "bg-accent-purple" : "bg-white/10"
      )}>
        <div className={cn(
          "absolute top-1 w-2 h-2 rounded-full bg-white transition-all",
          value ? "left-5" : "left-1"
        )} />
      </div>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Settings Panel */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent-purple/10 text-accent-purple">
                <Lock size={18} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">Configuration</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase ml-1">
                  <span>Password Length</span>
                  <span className="text-accent-purple">{length} Characters</span>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border border-white/10">
                  <input 
                    type="range" min={8} max={64} value={length}
                    onChange={e => setLength(Number(e.target.value))}
                    className="w-full accent-accent-purple"
                  />
                  <div className="flex justify-between mt-2 px-1 font-mono text-[8px] text-white/20">
                    <span>8</span>
                    <span>16</span>
                    <span>32</span>
                    <span>64</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Toggle label="Uppercase (A-Z)" value={upper} onChange={() => setUpper(!upper)} icon={Type} />
                <Toggle label="Lowercase (a-z)" value={lower} onChange={() => setLower(!lower)} icon={Type} />
                <Toggle label="Numbers (0-9)" value={numbers} onChange={() => setNumbers(!numbers)} icon={Hash} />
                <Toggle label="Symbols (!@#$...)" value={symbols} onChange={() => setSymbols(!symbols)} icon={Sparkles} />
              </div>

              <button
                onClick={generate}
                disabled={!isValid || isGenerating}
                className={cn(
                  "w-full flex items-center justify-center gap-3 py-4 bg-accent-purple text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-purple/20",
                  (isGenerating || !isValid) ? "opacity-50" : "hover:scale-[1.02] active:scale-[0.98] hover:bg-white hover:text-black"
                )}
              >
                {isGenerating ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <>
                    <Zap size={18} />
                    Generate Key
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 flex flex-col relative overflow-hidden group min-h-[500px]"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent-purple/5 blur-[120px] rounded-full group-hover:bg-accent-purple/10 transition-all duration-1000" />
            
            <div className="relative z-10 flex flex-col h-full w-full">
              <div className="mb-12">
                <div className="text-[10px] font-black tracking-[0.2em] text-accent-cyan uppercase mb-2">Secure Output</div>
                <h2 className="text-2xl font-bold font-syne">Your Generated Password</h2>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="w-full relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple/20 to-accent-cyan/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative p-8 bg-[#0A0C14] border border-white/10 rounded-3xl flex items-center gap-4 group/box shadow-2xl">
                    <div className="flex-1 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.span 
                          key={password + showPw}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="font-mono text-xl md:text-3xl text-white tracking-[0.1em] break-all block"
                        >
                          {showPw 
                            ? (password || <span className="text-white/10 italic">Waiting for input...</span>) 
                            : (password ? '•'.repeat(password.length) : '••••••••••••••••')}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <button 
                      onClick={() => setShowPw(!showPw)}
                      className="p-3 hover:bg-white/5 text-white/20 hover:text-white rounded-xl transition-all shrink-0"
                    >
                      {showPw ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {password && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full space-y-4 bg-white/5 p-6 rounded-3xl border border-white/5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-lg bg-black/40", strength.color.replace('bg-', 'text-'))}>
                          {strength.icon}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest leading-none mb-1">Security Rating</p>
                          <p className="text-xs font-bold text-white/70">{strength.label} Strength</p>
                        </div>
                      </div>
                      <div className="text-[10px] font-black text-accent-cyan bg-accent-cyan/10 px-3 py-1 rounded-full uppercase tracking-widest">
                        Validated
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-black/40 overflow-hidden flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <motion.div 
                          key={i}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          className={cn(
                            "h-full flex-1 rounded-full transition-colors duration-500",
                            i < strength.score ? strength.color : "bg-white/5"
                          )}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {password && (
                <div className="mt-12 grid grid-cols-2 gap-4">
                  <button
                    onClick={handleCopy}
                    className="flex items-center justify-center gap-3 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    <Copy size={16} />
                    Copy Key
                  </button>
                  <button
                    onClick={generate}
                    className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
                  >
                    <RefreshCw size={16} />
                    Regenerate
                  </button>
                </div>
              )}
            </div>

            {isGenerating && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[40px]">
                <div className="w-12 h-12 border-4 border-accent-purple/20 border-t-accent-purple rounded-full animate-spin mb-4" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-white/70">Scrambling Bits...</span>
              </div>
            )}
          </motion.div>

          <div className="bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 p-6 rounded-[32px] border border-white/10 flex items-center gap-4">
            <div className="p-3 bg-accent-cyan/10 text-accent-cyan rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white/80">Quantum Safe Entropy</h4>
              <p className="text-[10px] text-white/40 leading-relaxed mt-1">
                Passwords are generated using cryptographically secure random number generators (Web Crypto API) and never leave your browser.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
