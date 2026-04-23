'use client';

import React, { useState, useEffect } from 'react';
import { Ticket, Search, Clock, ShieldCheck, AlertCircle, Copy, Check, Info } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { motion, AnimatePresence } from 'framer-motion';

const JwtDecoder = () => {
  const [token, setToken] = useState('');
  const [decoded, setDecoded] = useState<{ header: any; payload: any } | null>(null);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDecode = React.useCallback(() => {
    if (!token) {
      setDecoded(null);
      setError('');
      return;
    }

    try {
      const header = jwtDecode(token, { header: true });
      const payload = jwtDecode(token);
      setDecoded({ header, payload });
      setError('');
    } catch (err) {
      setError('Invalid JWT format. A valid JWT consists of three parts separated by dots.');
      setDecoded(null);
    }
  }, [token]);

  useEffect(() => {
    handleDecode();
  }, [handleDecode]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(JSON.stringify(text, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatExp = (exp: number) => {
    if (!exp) return 'N/A';
    const date = new Date(exp * 1000);
    return date.toLocaleString();
  };

  const isExpired = (exp: number) => {
    if (!exp) return false;
    return Date.now() >= exp * 1000;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Input Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <label className="block text-xs text-white/40 mb-3 font-bold uppercase tracking-widest flex items-center gap-2">
          <Ticket size={14} className="text-red-400" />
          Encoded JWT Token
        </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your JWT token here (encoded)..."
          className="w-full h-32 bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none font-mono text-sm text-red-400 break-all"
        />
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 flex items-center gap-2 text-red-400 text-xs bg-red-400/10 p-2 rounded-lg border border-red-400/20"
            >
              <AlertCircle size={14} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decoded Sections */}
      <AnimatePresence mode="wait">
        {decoded ? (
          <motion.div
            key="decoded-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold flex items-center gap-2">
                  <Search size={14} className="text-blue-400" />
                  Header
                </span>
                <button
                  onClick={() => handleCopy(decoded.header, 'header')}
                  className="text-white/20 hover:text-white transition-colors"
                >
                  {copiedId === 'header' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
              <pre className="bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-xs text-blue-300 overflow-x-auto custom-scrollbar min-h-[150px]">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Payload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs text-white/40 uppercase tracking-widest font-bold flex items-center gap-2">
                  <Search size={14} className="text-purple-400" />
                  Payload
                </span>
                <button
                  onClick={() => handleCopy(decoded.payload, 'payload')}
                  className="text-white/20 hover:text-white transition-colors"
                >
                  {copiedId === 'payload' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                </button>
              </div>
              <pre className="bg-white/5 border border-white/10 rounded-2xl p-6 font-mono text-xs text-purple-300 overflow-x-auto custom-scrollbar min-h-[150px]">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>

            {/* Stats/Status Card */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isExpired(decoded.payload.exp) ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-xs text-white/40 uppercase font-bold tracking-widest">Expiration Time</p>
                  <p className="text-lg font-mono text-white">{formatExp(decoded.payload.exp)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-black/20 px-4 py-2 rounded-xl border border-white/5">
                {isExpired(decoded.payload.exp) ? (
                  <>
                    <AlertCircle size={18} className="text-red-500" />
                    <span className="text-sm font-medium text-red-400">Token Expired</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} className="text-green-500" />
                    <span className="text-sm font-medium text-green-400">Token Active</span>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-64 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-white/10"
          >
            <Ticket size={48} className="mb-4 opacity-5" />
            <p className="text-sm font-medium tracking-wide">Enter a JWT to start decoding</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
          <Info size={18} className="text-red-400" />
          Security Notice
        </h4>
        <p className="text-sm text-white/60 leading-relaxed">
          Decoding a JWT allows you to see the information it carries (claims). However, it does <strong>not</strong> verify the signature. Verification requires the private secret key or public certificate used to sign the token.
          <br /><br />
          <span className="text-red-400/80 font-medium">Never paste sensitive production tokens into online tools unless you trust them. All decoding here happens locally in your browser.</span>
        </p>
      </div>
    </div>
  );
};

export default JwtDecoder;
