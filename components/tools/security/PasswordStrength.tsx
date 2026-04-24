'use client';

import React, { useState, useEffect } from 'react';
import { Shield, ShieldCheck, ShieldAlert, Eye, EyeOff, Copy, Check, Info } from 'lucide-react';
import zxcvbn from 'zxcvbn';
import { motion, AnimatePresence } from 'framer-motion';

const PasswordStrength = () => {
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
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 0: return 'Very Weak';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Strong';
      case 4: return 'Ultra Secure';
      default: return 'Enter Password';
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to check..."
            className={`w-full bg-black/20 border border-white/10 rounded-xl px-4 py-4 pr-24 focus:outline-none focus:ring-2 transition-all text-lg font-mono ${
              !result ? 'focus:ring-white/20' : 
              result.score === 0 ? 'focus:ring-red-500/50' :
              result.score === 1 ? 'focus:ring-orange-500/50' :
              result.score === 2 ? 'focus:ring-yellow-500/50' :
              result.score === 3 ? 'focus:ring-blue-500/50' :
              'focus:ring-green-500/50'
            }`}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={handleCopy}
              disabled={!password}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60 disabled:opacity-50"
              title="Copy password"
            >
              {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-white/60">Strength Score</span>
            <span className={`font-semibold ${result ? 'text-white' : 'text-white/30'}`}>
              {result ? getScoreLabel(result.score) : '---'}
            </span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result ? (result.score + 1) * 20 : 0}%` }}
              className={`h-full transition-colors duration-500 ${result ? getScoreColor(result.score) : 'bg-transparent'}`}
            />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Crack Times */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white/80 font-medium mb-4 flex items-center gap-2">
                <Shield size={18} className="text-red-400" />
                Estimated Crack Time
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Online (No Throttling)</span>
                  <span className="text-white font-mono">{result.crack_times_display.online_no_throttling_10_per_second}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Online (Throttled)</span>
                  <span className="text-white font-mono">{result.crack_times_display.online_throttling_100_per_hour}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Offline (Fast Hashing)</span>
                  <span className="text-white font-mono">{result.crack_times_display.offline_fast_hashing_1e10_per_second}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Offline (Slow Hashing)</span>
                  <span className="text-white font-mono">{result.crack_times_display.offline_slow_hashing_1e4_per_second}</span>
                </div>
              </div>
            </div>

            {/* Feedback & Suggestions */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white/80 font-medium mb-4 flex items-center gap-2">
                <Info size={18} className="text-blue-400" />
                Security Analysis
              </h3>
              <div className="space-y-4">
                {result.feedback.warning && (
                  <div className="flex gap-3 text-red-400 bg-red-400/10 p-3 rounded-xl text-sm border border-red-400/20">
                    <ShieldAlert size={18} className="shrink-0" />
                    <p>{result.feedback.warning}</p>
                  </div>
                )}
                
                {result.feedback.suggestions.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-white/40 uppercase tracking-wider font-bold">Suggestions</p>
                    {result.feedback.suggestions.map((suggestion: string, idx: number) => (
                      <div key={idx} className="flex gap-3 text-white/60 text-sm">
                        <Check size={16} className="text-green-500 shrink-0" />
                        <p>{suggestion}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex gap-3 text-green-400 bg-green-400/10 p-3 rounded-xl text-sm border border-green-400/20">
                    <ShieldCheck size={18} className="shrink-0" />
                    <p>Excellent! This password is very difficult to crack.</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
        <h3 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
          <Info size={18} />
          Why check strength?
        </h3>
        <p className="text-sm text-white/60 leading-relaxed">
          This tool uses the <strong>zxcvbn</strong> algorithm (developed by Dropbox) to estimate how long it would take for a computer to guess your password. It considers common patterns, dictionary words, and sequences, providing a much more realistic score than simple character counts.
          <br /><br />
          <span className="text-white/40 italic">Note: All processing is done locally in your browser. Your password is never sent to any server.</span>
        </p>
      </div>
    </div>
  );
};

export default PasswordStrength;
