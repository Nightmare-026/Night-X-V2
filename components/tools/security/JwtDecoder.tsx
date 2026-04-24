'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Terminal, 
  Lock, 
  Unlock, 
  Copy, 
  AlertCircle, 
  Cpu, 
  Clock, 
  User, 
  Key,
  Database,
  Hash,
  RefreshCw,
  Search,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface DecodedToken {
  header: any;
  payload: any;
  signature: string;
  isExpired?: boolean;
}

function decodeToken(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));
    const signature = parts[2];

    let isExpired = false;
    if (payload.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      isExpired = payload.exp < currentTime;
    }

    return { header, payload, signature, isExpired };
  } catch (e) {
    return null;
  }
}

export default function JwtDecoder() {
  const { addToast } = useToast();
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<DecodedToken | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setDecoded(null);
      setError(null);
      return;
    }

    const result = decodeToken(token);
    if (result) {
      setDecoded(result);
      setError(null);
    } else {
      setDecoded(null);
      setError('Invalid JWT format. Expected: header.payload.signature');
    }
  }, [token]);

  const handleCopy = async (data: any, label: string) => {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const success = await copyToClipboard(text);
    if (success) {
      addToast(`${label} copied to clipboard`, "success");
    }
  };

  const JsonBlock = ({ title, data, icon: Icon, colorClass, label }: { title: string; data: any; icon: any; colorClass: string; label: string }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-white/5", colorClass)}>
            <Icon size={14} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{title}</span>
        </div>
        <button 
          onClick={() => handleCopy(data, title)}
          className="p-2 hover:bg-white/5 text-white/20 hover:text-white rounded-lg transition-all"
        >
          <Copy size={14} />
        </button>
      </div>
      <div className="relative group">
        <div className={cn("absolute -inset-0.5 rounded-2xl blur opacity-20 transition-opacity group-hover:opacity-40", colorClass.replace('text-', 'bg-'))} />
        <pre className="relative w-full bg-black/60 border border-white/10 rounded-2xl p-6 font-mono text-[11px] leading-relaxed overflow-x-auto text-white/80 scrollbar-hide">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden"
          >
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent-purple/10 text-accent-purple">
                    <Key size={18} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">JWT Input</h3>
                </div>
                {token && (
                  <button 
                    onClick={() => setToken('')}
                    className="text-[10px] font-black text-white/20 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple/20 to-accent-cyan/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <textarea
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste your JWT here (header.payload.signature)"
                  className="relative w-full h-80 bg-black/40 border border-white/10 rounded-2xl p-6 text-white font-mono text-xs focus:outline-none focus:border-accent-purple transition-all resize-none leading-relaxed"
                />
              </div>

              {error ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3"
                >
                  <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium text-red-200/60 leading-relaxed">{error}</p>
                </motion.div>
              ) : decoded ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3"
                >
                  <Shield size={18} className="text-emerald-400 shrink-0" />
                  <p className="text-[11px] font-bold text-emerald-200/60 uppercase tracking-widest">Valid structure detected</p>
                </motion.div>
              ) : (
                <div className="p-6 bg-black/40 rounded-3xl border border-white/5 space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 flex items-center gap-2">
                    <Database size={12} />
                    Debug Protocol
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-[10px] text-white/30">
                      <div className="w-1 h-1 rounded-full bg-accent-purple" />
                      Header contains algorithm info
                    </li>
                    <li className="flex items-center gap-2 text-[10px] text-white/30">
                      <div className="w-1 h-1 rounded-full bg-accent-cyan" />
                      Payload contains claims (iss, sub, exp)
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden group min-h-[600px]"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-purple/5 blur-[120px] rounded-full group-hover:bg-accent-purple/10 transition-all duration-1000" />
            
            <div className="relative z-10 flex flex-col h-full w-full">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black tracking-[0.2em] text-accent-cyan uppercase mb-2">Token Analysis</div>
                  <h2 className="text-2xl font-bold font-syne">Decoded Objects</h2>
                </div>
                {decoded?.isExpired && (
                  <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-xl border border-red-500/20">
                    <Clock size={14} className="text-red-400" />
                    <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">EXPIRED</span>
                  </div>
                )}
              </div>

              {decoded ? (
                <div className="space-y-12">
                  <JsonBlock 
                    title="Header (Algorithm & Token Type)" 
                    data={decoded.header} 
                    icon={Cpu} 
                    colorClass="text-accent-purple"
                    label="header"
                  />
                  <JsonBlock 
                    title="Payload (Data & Claims)" 
                    data={decoded.payload} 
                    icon={User} 
                    colorClass="text-accent-cyan"
                    label="payload"
                  />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="p-2 rounded-lg bg-white/5 text-indigo-400">
                        <Lock size={14} />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Signature</span>
                    </div>
                    <div className="p-6 bg-black/60 border border-white/10 rounded-2xl font-mono text-[10px] break-all text-white/30 select-none">
                      {decoded.signature}
                      <div className="mt-4 flex items-center gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                        <Unlock size={12} className="text-white/20" />
                        <p className="text-[9px] text-white/40 font-medium">Signature cannot be decoded without secret key.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center gap-6 opacity-20 py-20">
                  <div className="p-10 rounded-full bg-white/5 border border-white/5">
                    <Search size={48} strokeWidth={1} />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-bold uppercase tracking-widest">Awaiting Token</p>
                    <p className="text-[10px] font-medium max-w-[200px]">Paste a valid JWT in the input field to begin the deep inspection</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {decoded && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#1A1C25] to-[#0D0F18] border border-white/10 p-8 rounded-[32px] space-y-6"
            >
              <h4 className="text-xs font-black uppercase tracking-widest text-white/80">Claim Verification</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-purple shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/20 uppercase">Expiration</p>
                    <p className="text-xs font-bold text-white/70">
                      {decoded.payload.exp 
                        ? new Date(decoded.payload.exp * 1000).toLocaleString() 
                        : 'No expiry claim found'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-accent-cyan shrink-0">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/20 uppercase">Issuer</p>
                    <p className="text-xs font-bold text-white/70">{decoded.payload.iss || 'Anonymous Issuer'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
