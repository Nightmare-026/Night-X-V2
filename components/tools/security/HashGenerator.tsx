'use client';

import React, { useState, useEffect } from 'react';
import { Hash, Copy, Check, Info, Shield, RefreshCw } from 'lucide-react';
import CryptoJS from 'crypto-js';
import { motion } from 'framer-motion';

const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [salt, setSalt] = useState('');
  const [showSalt, setShowSalt] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const hashes = [
    { name: 'MD5', method: CryptoJS.MD5 },
    { name: 'SHA-1', method: CryptoJS.SHA1 },
    { name: 'SHA-256', method: CryptoJS.SHA256 },
    { name: 'SHA-512', method: CryptoJS.SHA512 },
    { name: 'SHA-3', method: CryptoJS.SHA3 },
    { name: 'RIPEMD-160', method: CryptoJS.RIPEMD160 },
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateHash = (method: any) => {
    if (!input) return '';
    const saltedInput = salt ? input + salt : input;
    return method(saltedInput).toString();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Input Section */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm space-y-4">
        <div>
          <label className="block text-sm text-white/40 mb-2 font-medium uppercase tracking-wider">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type text to generate hashes..."
            className="w-full h-32 bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none font-mono text-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            onClick={() => setShowSalt(!showSalt)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              showSalt ? 'bg-red-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Shield size={16} />
            {showSalt ? 'Hide Salt' : 'Add Secret Salt'}
          </button>
          <button
            onClick={() => { setInput(''); setSalt(''); }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-white/5 text-white/60 hover:bg-white/10 transition-all"
          >
            <RefreshCw size={16} />
            Reset
          </button>
        </div>

        {showSalt && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pt-2"
          >
            <label className="block text-sm text-white/40 mb-2 font-medium uppercase tracking-wider">Secret Salt (Optional)</label>
            <input
              type="password"
              value={salt}
              onChange={(e) => setSalt(e.target.value)}
              placeholder="Enter salt to strengthen hash..."
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-mono"
            />
            <p className="text-[10px] text-white/30 mt-1 italic">Salt is appended to your input before hashing.</p>
          </motion.div>
        )}
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hashes.map((hash) => {
          const result = generateHash(hash.method);
          return (
            <div key={hash.name} className="bg-white/5 border border-white/10 rounded-2xl p-5 group hover:border-white/20 transition-all">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-md">
                  {hash.name}
                </span>
                <button
                  onClick={() => handleCopy(result, hash.name)}
                  disabled={!result}
                  className="p-1.5 text-white/20 hover:text-white transition-colors disabled:opacity-0"
                >
                  {copiedId === hash.name ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
              </div>
              <div className="bg-black/30 rounded-xl p-3 border border-white/5 font-mono text-xs break-all text-white/70 min-h-[48px] flex items-center">
                {result || <span className="text-white/10 italic">Enter input above...</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h4 className="text-white/80 font-medium mb-3 flex items-center gap-2">
          <Info size={18} className="text-blue-400" />
          What is Hashing?
        </h4>
        <p className="text-sm text-white/60 leading-relaxed">
          Hashing is a <strong>one-way process</strong>. Unlike encryption, you cannot &quot;decrypt&quot; a hash back to its original text. It is used for verifying data integrity, storing passwords securely, and digital signatures.
          <br /><br />
          MD5 and SHA-1 are now considered cryptographically weak but are still used for non-security checksums. For sensitive data, always use <strong>SHA-256</strong> or higher.
        </p>
      </div>
    </div>
  );
};

export default HashGenerator;
