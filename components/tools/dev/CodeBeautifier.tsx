'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Copy, 
  Check, 
  Trash2, 
  Settings2,
  FileCode2,
  FileJson,
  Braces
} from 'lucide-react';
import * as prettier from 'prettier/standalone';
import * as parserHtml from 'prettier/plugins/html';
import * as parserCss from 'prettier/plugins/postcss';
import * as parserBabel from 'prettier/plugins/babel';
import * as parserEstree from 'prettier/plugins/estree';

type Language = 'html' | 'css' | 'javascript' | 'json';

export default function CodeBeautifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatCode = async () => {
    if (!input.trim()) return;
    setError(null);

    try {
      let parser = '';
      let plugins = [];

      switch (language) {
        case 'html':
          parser = 'html';
          plugins = [parserHtml];
          break;
        case 'css':
          parser = 'css';
          plugins = [parserCss];
          break;
        case 'javascript':
          parser = 'babel';
          plugins = [parserBabel, parserEstree];
          break;
        case 'json':
          parser = 'json';
          plugins = [parserBabel, parserEstree];
          break;
      }

      const formatted = await prettier.format(input, {
        parser,
        plugins,
        tabWidth: indentSize,
        semi: true,
        singleQuote: true,
      });

      setOutput(formatted);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to format code. Please check for syntax errors.');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/10">
        <div className="flex gap-2">
          {(['javascript', 'html', 'css', 'json'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                language === lang 
                  ? 'bg-accent-purple text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-white/40 flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            Indent:
          </label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value={8}>8 Spaces</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-medium text-white/60 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-accent-purple" />
              Source Code
            </label>
            <button 
              onClick={handleClear}
              className="text-white/40 hover:text-red-400 transition-colors p-1"
              title="Clear input"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${language.toUpperCase()} code here...`}
            className="w-full h-[400px] bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-2">
            <label className="text-sm font-medium text-white/60 flex items-center gap-2">
              <Braces className="w-4 h-4 text-accent-cyan" />
              Beautified Code
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
          <div className="relative group">
            <textarea
              value={output}
              readOnly
              placeholder="Beautified code will appear here..."
              className="w-full h-[400px] bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-sm focus:outline-none transition-all resize-none"
            />
            {error && (
              <div className="absolute inset-x-4 top-4 bg-red-500/10 border border-red-500/50 rounded-xl p-3">
                <p className="text-xs text-red-400 font-mono line-clamp-3">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={formatCode}
          disabled={!input.trim()}
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl font-syne font-bold text-lg shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Beautify Code ✨
        </motion.button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-start gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <FileCode2 className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1">Prettier Engine</h4>
            <p className="text-xs text-white/40">Uses industry-standard Prettier for consistent formatting.</p>
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-start gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-lg">
            <FileJson className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1">Multi-Format</h4>
            <p className="text-xs text-white/40">Support for HTML, CSS, JavaScript, and JSON code.</p>
          </div>
        </div>
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-start gap-3">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <Settings2 className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold mb-1">Custom Indent</h4>
            <p className="text-xs text-white/40">Choose between 2, 4, or 8 space indentation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
