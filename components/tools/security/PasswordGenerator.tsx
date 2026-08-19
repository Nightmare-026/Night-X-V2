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
    if (!isValid) return;
    const pw = generatePassword(length, { upper, lower, numbers, symbols });
    setPassword(pw);
  }, [length, upper, lower, numbers, symbols, isValid]);

  React.useEffect(() => {
    generate();
  }, [generate]);

  const handleCopy = async () => {
    if (!password) return;
    const success = await copyToClipboard(password);
    if (success) {
      toast("Copied to clipboard", "success");
    }
  };

  const strength = getStrength(password);

  const Toggle = ({ label, value, onChange, icon: Icon }: { label: string; value: boolean; onChange: () => void, icon: any }) => (
    <button
      onClick={onChange}
      className={cn(
        "flex items-center justify-between p-4 rounded-md border transition-all w-full",
        value 
          ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" 
          : "bg-white/[0.01] border-white/[0.05] text-white/20 hover:text-white/40 hover:border-white/10"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon size={14} className={value ? "text-emerald-400" : "text-white/10"} />
        <span className="text-[10px] font-bold uppercase tracking-widest font-inter">{label}</span>
      </div>
      <div className={cn(
        "w-6 h-3 rounded-full relative transition-colors",
        value ? "bg-emerald-400" : "bg-white/10"
      )}>
        <div className={cn(
          "absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all",
          value ? "left-3.5" : "left-0.5"
        )} />
      </div>
    </button>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Settings Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Lock className="text-emerald-400" size={16} />
              <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Security Protocol</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest font-inter">
                  <span>Length</span>
                  <span className="text-emerald-400">{length} Units</span>
                </div>
                <div className="px-4 py-8 bg-black/40 rounded-md border border-white/[0.05]">
                  <input 
                    type="range" min={8} max={64} value={length}
                    onChange={e => setLength(Number(e.target.value))}
                    className="w-full h-1 bg-white/[0.05] rounded-full appearance-none accent-emerald-400 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Toggle label="Uppercase" value={upper} onChange={() => setUpper(!upper)} icon={Type} />
                <Toggle label="Lowercase" value={lower} onChange={() => setLower(!lower)} icon={Type} />
                <Toggle label="Numbers" value={numbers} onChange={() => setNumbers(!numbers)} icon={Hash} />
                <Toggle label="Symbols" value={symbols} onChange={() => setSymbols(!symbols)} icon={Sparkles} />
              </div>

              <button
                onClick={generate}
                disabled={!isValid || isGenerating}
                className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-400 text-black rounded-md font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-emerald-300 disabled:opacity-30 shadow-xl"
              >
                {isGenerating ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    Synthesize Key
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-6 bg-emerald-400/5 border border-emerald-400/10 rounded-md">
            <div className="flex items-center gap-3 mb-3 text-emerald-400">
              <Zap size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Randomness Engine</span>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-inter leading-relaxed">
              Powered by window.crypto.getRandomValues() for absolute cryptographic security.
            </p>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 min-h-[500px] flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full flex-1">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase mb-2">Registry</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Shielded Key</h2>
                </div>
                {password && (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-3 bg-white/[0.02] hover:bg-white/[0.05] text-white/40 hover:text-white rounded-md border border-white/[0.05] transition-all"
                    >
                      <Copy size={16} />
                    </button>
                    <button 
                      onClick={() => setShowPw(!showPw)}
                      className="p-3 bg-white/[0.02] hover:bg-white/[0.05] text-white/40 hover:text-white rounded-md border border-white/[0.05] transition-all"
                    >
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col items-center justify-center space-y-12 py-12">
                <div className="w-full relative group">
                  <div className="absolute -inset-1 bg-emerald-400/10 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-md" />
                  <div className="relative p-10 bg-black/60 border border-white/[0.1] rounded-md backdrop-blur-sm group-hover:border-emerald-400/30 transition-all flex items-center justify-center min-h-[140px]">
                    <span className="font-mono text-2xl md:text-3xl text-white tracking-[0.2em] break-all block text-center leading-relaxed">
                      {showPw 
                        ? (password || <span className="text-white/5 lowercase tracking-normal">awaiting synthesis...</span>) 
                        : (password ? '•'.repeat(password.length) : '••••••••••••••••')}
                    </span>
                  </div>
                </div>

                {password && (
                  <div className="w-full space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <div className="flex items-center gap-3">
                        <div className={cn("transition-colors", strength.label === 'Secure' ? "text-emerald-400" : "text-white/40")}>
                          {strength.icon}
                        </div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest font-inter">
                          Integrity Level: <span className="text-white/80">{strength.label}</span>
                        </span>
                      </div>
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                        Score: {strength.score}/5
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-1.5 h-1.5">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className={cn(
                            "rounded-full transition-all duration-700",
                            i < strength.score 
                              ? strength.color 
                              : "bg-white/5"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {password && (
                <div className="mt-auto pt-12">
                  <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-md bg-emerald-400/10 flex items-center justify-center">
                        <Shield size={16} className="text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase text-white/30 tracking-widest">Buffer</div>
                        <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Ready for deployment</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-6 py-3 bg-white text-black rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-white/90 transition-all shadow-lg"
                      >
                        Execute Copy
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!password && (
                <div className="flex-1 flex flex-col items-center justify-center opacity-10 space-y-4">
                  <Lock size={48} strokeWidth={1} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Registry Locked</p>
                </div>
              )}
            </div>

            {isGenerating && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mb-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">Encrypting...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
