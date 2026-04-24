'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, RefreshCw, Copy, Shield, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

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
  if (!pw) return { label: 'None', score: 0, color: 'bg-white/10' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: 'Weak', score, color: 'bg-red-500' };
  if (score === 2) return { label: 'Fair', score, color: 'bg-amber-500' };
  if (score === 3) return { label: 'Good', score, color: 'bg-yellow-400' };
  if (score === 4) return { label: 'Strong', score, color: 'bg-emerald-500' };
  return { label: 'Very Strong', score, color: 'bg-emerald-400' };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(true);
  const [copied, setCopied] = useState(false);

  const isValid = upper || lower || numbers || symbols;

  const generate = useCallback(() => {
    if (!isValid) return;
    setPassword(generatePassword(length, { upper, lower, numbers, symbols }));
  }, [length, upper, lower, numbers, symbols, isValid]);

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = getStrength(password);

  const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <span className="text-sm text-white/70">{label}</span>
      <button
        onClick={onChange}
        className={`w-11 h-6 rounded-full relative transition-all ${value ? 'bg-violet-600' : 'bg-white/10'}`}
      >
        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${value ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Password Display */}
      <div className="glass-card rounded-2xl border border-white/10 p-5 space-y-4">
        <div className="flex items-center gap-2 bg-black/30 rounded-xl px-4 py-3 min-h-[52px]">
          <Shield size={16} className="text-violet-400 shrink-0" />
          <span className="flex-1 font-mono text-base text-white/90 tracking-widest break-all">
            {showPw ? (password || <span className="text-white/25 text-sm not-italic">{!isValid ? 'Select an option...' : 'Click Generate…'}</span>) : '•'.repeat(password.length || 12)}
          </span>
          <button onClick={() => setShowPw(!showPw)} className="text-white/40 hover:text-white/70 transition-colors">
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* Strength bar */}
        {password && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-white/40">
              <span>Strength</span>
              <span className={strength.score >= 4 ? 'text-emerald-400' : strength.score >= 3 ? 'text-yellow-400' : 'text-red-400'}>{strength.label}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${strength.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${(strength.score / 5) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="glass-card rounded-2xl border border-white/10 p-5 space-y-2">
        {/* Length */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-white/60">Length</span>
            <span className="text-violet-400 font-bold">{length}</span>
          </div>
          <input
            type="range" min={6} max={64} value={length}
            onChange={e => setLength(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-xs text-white/25"><span>6</span><span>64</span></div>
        </div>
        <Toggle label="Uppercase (A-Z)" value={upper} onChange={() => setUpper(!upper)} />
        <Toggle label="Lowercase (a-z)" value={lower} onChange={() => setLower(!lower)} />
        <Toggle label="Numbers (0-9)" value={numbers} onChange={() => setNumbers(!numbers)} />
        <Toggle label="Symbols (!@#$…)" value={symbols} onChange={() => setSymbols(!symbols)} />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={generate}
          disabled={!isValid}
          className="py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RefreshCw size={16} />
          Generate
        </button>
        <button
          onClick={handleCopy}
          disabled={!password}
          className="py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40"
        >
          <Copy size={16} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}
