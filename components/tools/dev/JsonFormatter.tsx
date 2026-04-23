'use client';

import React, { useState } from 'react';
import { Copy, Minimize2, Maximize2, CheckCircle, XCircle, Braces } from 'lucide-react';
import { motion } from 'framer-motion';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);

  const parse = (raw: string): { ok: true; data: unknown } | { ok: false; msg: string } => {
    try {
      return { ok: true, data: JSON.parse(raw) };
    } catch (e: any) {
      return { ok: false, msg: e.message };
    }
  };

  const format = () => {
    if (!input.trim()) return;
    const result = parse(input);
    if (result.ok) {
      setOutput(JSON.stringify(result.data, null, indent));
      setIsValid(true);
      setError(null);
    } else {
      setIsValid(false);
      setError(result.msg);
      setOutput('');
    }
  };

  const minify = () => {
    if (!input.trim()) return;
    const result = parse(input);
    if (result.ok) {
      setOutput(JSON.stringify(result.data));
      setIsValid(true);
      setError(null);
    } else {
      setIsValid(false);
      setError(result.msg);
      setOutput('');
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-xl border border-white/10">
          <span className="text-xs text-white/50">Indent</span>
          {[2, 4].map(n => (
            <button
              key={n}
              onClick={() => setIndent(n)}
              className={`w-8 h-7 rounded-lg text-xs font-mono font-bold transition-all ${indent === n ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          onClick={format}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all"
        >
          <Maximize2 size={15} />
          Beautify
        </button>
        <button
          onClick={minify}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all"
        >
          <Minimize2 size={15} />
          Minify
        </button>
        {isValid !== null && (
          <div className={`flex items-center gap-1.5 text-xs font-medium ${isValid ? 'text-emerald-400' : 'text-red-400'}`}>
            {isValid ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {isValid ? 'Valid JSON' : 'Invalid JSON'}
          </div>
        )}
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
              <Braces size={15} />
              Input JSON
            </div>
            <button
              onClick={() => { setInput(''); setOutput(''); setIsValid(null); setError(null); }}
              className="text-xs text-white/40 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={'{\n  "paste": "your JSON here"\n}'}
            rows={16}
            className="w-full bg-transparent text-white/90 p-4 resize-none outline-none placeholder:text-white/20 text-sm font-mono flex-1"
          />
        </div>

        {/* Output */}
        <div className="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-white/60 text-sm font-medium">Output</span>
            <button
              onClick={handleCopy}
              disabled={!output}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition-all disabled:opacity-40"
            >
              <Copy size={13} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          {error ? (
            <div className="p-4 flex items-start gap-3">
              <XCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-red-400 text-sm font-medium mb-1">Syntax Error</p>
                <p className="text-red-400/70 text-xs font-mono">{error}</p>
              </div>
            </div>
          ) : (
            <pre className="p-4 text-emerald-300/90 text-sm font-mono overflow-auto whitespace-pre-wrap flex-1">
              {output || <span className="text-white/20">Formatted output will appear here…</span>}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
