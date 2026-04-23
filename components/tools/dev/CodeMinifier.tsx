'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Copy, 
  Check, 
  Trash2, 
  FileCode,
  Shrink,
  Layout,
  Code
} from 'lucide-react';

type Language = 'html' | 'css' | 'javascript';

export default function CodeMinifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ original: number; minified: number; savings: number } | null>(null);

  const minifyJS = (code: string) => {
    return code
      .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s?([\{\}\(\)\[\]\+\-\*\/=;!,<>])\s?/g, '$1') // Remove spaces around operators
      .trim();
  };

  const minifyCSS = (code: string) => {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s?([\{\}:;,])\s?/g, '$1') // Remove spaces around delimiters
      .replace(/;}/g, '}') // Remove last semicolon in block
      .trim();
  };

  const minifyHTML = (code: string) => {
    return code
      .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/>\s+</g, '><') // Remove spaces between tags
      .trim();
  };

  const handleMinify = () => {
    if (!input.trim()) return;

    let minified = '';
    switch (language) {
      case 'javascript':
        minified = minifyJS(input);
        break;
      case 'css':
        minified = minifyCSS(input);
        break;
      case 'html':
        minified = minifyHTML(input);
        break;
    }

    setOutput(minified);
    
    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([minified]).size;
    const savings = originalSize > 0 ? ((originalSize - minifiedSize) / originalSize) * 100 : 0;
    
    setStats({
      original: originalSize,
      minified: minifiedSize,
      savings: Math.max(0, savings)
    });
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header / Language Selection */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="flex gap-2">
          {(['javascript', 'css', 'html'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                language === lang 
                  ? 'bg-accent-cyan text-black font-bold shadow-lg shadow-cyan-500/20' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        {stats && (
          <div className="flex gap-6 text-sm">
            <div className="flex flex-col items-end">
              <span className="text-white/40 text-[10px] uppercase">Reduction</span>
              <span className="text-green-400 font-bold">{stats.savings.toFixed(1)}%</span>
            </div>
            <div className="flex flex-col items-end border-l border-white/10 pl-6">
              <span className="text-white/40 text-[10px] uppercase">Final Size</span>
              <span className="text-white font-mono">{formatSize(stats.minified)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-medium text-white/60 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-accent-cyan" />
              Source Code
            </label>
            <button 
              onClick={() => { setInput(''); setOutput(''); setStats(null); }}
              className="text-white/40 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${language.toUpperCase()} code here...`}
            className="w-full h-[350px] bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-medium text-white/60 flex items-center gap-2">
              <Shrink className="w-4 h-4 text-green-400" />
              Minified Output
            </label>
            <button
              onClick={handleCopy}
              disabled={!output}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                copied 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10 disabled:opacity-50'
              }`}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Minified code will appear here..."
            className="w-full h-[350px] bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-sm focus:outline-none transition-all resize-none text-white/80"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleMinify}
          disabled={!input.trim()}
          className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl font-syne font-bold text-lg shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all disabled:opacity-50"
        >
          Minify Now <Zap className="inline-block ml-2 w-5 h-5 fill-current" />
        </motion.button>
      </div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
          <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 text-cyan-400">
            <Code className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold mb-2">JS Compression</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Removes comments, extra whitespace, and collapses multi-line statements to reduce file size.
          </p>
        </div>
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
          <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 text-purple-400">
            <Layout className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold mb-2">CSS Optimization</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Strips comments and redundant spacing around selectors and rules for faster style loading.
          </p>
        </div>
        <div className="bg-white/5 p-5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
          <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center mb-4 text-orange-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold mb-2">HTML Cleaning</h3>
          <p className="text-xs text-white/40 leading-relaxed">
            Eliminates unnecessary line breaks and attribute spacing to improve LCP scores.
          </p>
        </div>
      </div>
    </div>
  );
}
