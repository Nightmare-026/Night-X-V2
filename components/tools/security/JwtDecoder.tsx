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
, ShieldCheck} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

interface DecodedToken {
  header: any;
  payload: any;
  signature: string;
  isExpired?: boolean;
}

function decodeBase64Url(str: string) {
  try {
    // Replace non-url safe characters and add padding
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = base64.length % 4;
    const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
    return decodeURIComponent(atob(padded).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  } catch (e) {
    return null;
  }
}

function decodeToken(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const headerStr = decodeBase64Url(parts[0]);
    const payloadStr = decodeBase64Url(parts[1]);
    
    if (!headerStr || !payloadStr) return null;

    const header = JSON.parse(headerStr);
    const payload = JSON.parse(payloadStr);
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
  const { toast } = useToast();
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
      setError('Invalid cryptographic structure. Expected: header.payload.signature');
    }
  }, [token]);

  const handleCopy = async (data: any, label: string) => {
    const text = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const success = await copyToClipboard(text);
    if (success) {
      toast(`${label} copied to clipboard`, "success");
    }
  };

  const JsonBlock = ({ title, data, icon: Icon, colorClass }: { title: string; data: any; icon: any; colorClass: string }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-md bg-white/5", colorClass)}>
            <Icon size={14} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{title}</span>
        </div>
        <button 
          onClick={() => handleCopy(data, title)}
          className="p-2 hover:bg-white/5 text-white/20 hover:text-white rounded-md transition-all"
        >
          <Copy size={14} />
        </button>
      </div>
      <div className="relative group">
        <pre className="w-full bg-black/60 border border-white/[0.05] rounded-md p-6 font-mono text-[11px] leading-relaxed overflow-x-auto text-white/80 scrollbar-hide">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Key className="text-emerald-400" size={16} />
                <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Token Registry</h3>
              </div>
              {token && (
                <button 
                  onClick={() => setToken('')}
                  className="text-[10px] font-bold text-white/20 hover:text-red-400 uppercase tracking-widest transition-colors"
                >
                  Flush
                </button>
              )}
            </div>

            <textarea
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste header.payload.signature..."
              className="w-full h-80 bg-black/40 border border-white/[0.05] rounded-md p-6 text-white font-mono text-xs focus:outline-none focus:border-emerald-400/50 transition-all resize-none leading-relaxed"
            />

            {error ? (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-3">
                <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold text-red-400/60 uppercase tracking-widest">{error}</p>
              </div>
            ) : decoded ? (
              <div className="p-4 bg-emerald-400/10 border border-emerald-400/20 rounded-md flex items-center gap-3">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Valid Syntax Verified</p>
              </div>
            ) : (
              <div className="p-6 bg-emerald-400/5 border border-emerald-400/10 rounded-md space-y-4">
                <div className="flex items-center gap-3 text-emerald-400">
                  <Database size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Inspection Protocol</span>
                </div>
                <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                  Decode any JSON Web Token to inspect internal claims and headers instantly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden min-h-[600px] flex flex-col">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full flex-1">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-emerald-400 uppercase mb-2">Object Inspection</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Decoded Clusters</h2>
                </div>
                {decoded?.isExpired && (
                  <div className="flex items-center gap-2 bg-red-500/10 px-4 py-2 rounded-md border border-red-500/20">
                    <Clock size={14} className="text-red-400" />
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Expired</span>
                  </div>
                )}
              </div>

              {decoded ? (
                <div className="space-y-12">
                  <JsonBlock 
                    title="Header Analysis" 
                    data={decoded.header} 
                    icon={Cpu} 
                    colorClass="text-emerald-400"
                  />
                  <JsonBlock 
                    title="Payload Clusters" 
                    data={decoded.payload} 
                    icon={User} 
                    colorClass="text-emerald-400"
                  />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="p-2 rounded-md bg-white/5 text-white/40">
                        <Lock size={14} />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Signature Block</span>
                    </div>
                    <div className="p-6 bg-black/60 border border-white/[0.05] rounded-md font-mono text-[10px] break-all text-white/20 select-none leading-relaxed">
                      {decoded.signature}
                      <div className="mt-4 flex items-center gap-3 p-4 bg-emerald-400/5 rounded-md border border-emerald-400/10">
                        <Unlock size={12} className="text-emerald-400/40" />
                        <p className="text-[10px] text-emerald-400/40 font-bold uppercase tracking-widest">Signature is cryptographically non-invertible.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/[0.05] space-y-6">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Claim Verification</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-md">
                        <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center text-emerald-400 shrink-0">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Expiration</p>
                          <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
                            {decoded.payload.exp 
                              ? new Date(decoded.payload.exp * 1000).toLocaleString() 
                              : 'Null Expiry'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.05] rounded-md">
                        <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center text-emerald-400 shrink-0">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Identity</p>
                          <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest truncate max-w-[150px]">
                            {decoded.payload.iss || 'Anonymous'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-10 space-y-4 py-20">
                  <Search size={48} strokeWidth={1} />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Registry Awaiting Feed</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
