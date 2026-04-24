'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Settings, 
  Info, 
  AlertCircle,
  Hash,
  Type,
  Flag,
  Lightbulb,
  Copy,
  Check
} from 'lucide-react';

interface RegexMatch {
  index: number;
  length: number;
  text: string;
  groups: string[];
}

export default function RegexTester() {
  const [regexStr, setRegexStr] = useState('([a-zA-Z0-9._-]+)@([a-zA-Z0-9.-]+)\\.([a-zA-Z]{2,5})');
  const [flags, setFlags] = useState('gm');
  const [testText, setTestText] = useState('Support is available at help@nightx.com or contact our dev team at engineering-ops@utility.hub');
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const overlayRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (overlayRef.current) {
      overlayRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Common Regex Snippets
  const snippets = [
    { name: 'Email', pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' },
    { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
    { name: 'Phone', pattern: '^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$' },
    { name: 'Date (YYYY-MM-DD)', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
    { name: 'Password (Strong)', pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$' }
  ];

  useEffect(() => {
    if (!regexStr) {
      setMatches([]);
      setError(null);
      return;
    }

    try {
      const re = new RegExp(regexStr, flags);
      const newMatches: RegexMatch[] = [];
      let match;

      if (flags.includes('g')) {
        while ((match = re.exec(testText)) !== null) {
          if (match.index === re.lastIndex) re.lastIndex++; // Prevent infinite loop for zero-width matches
          newMatches.push({
            index: match.index,
            length: match[0].length,
            text: match[0],
            groups: match.slice(1)
          });
        }
      } else {
        match = re.exec(testText);
        if (match) {
          newMatches.push({
            index: match.index,
            length: match[0].length,
            text: match[0],
            groups: match.slice(1)
          });
        }
      }

      setMatches(newMatches);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setMatches([]);
    }
  }, [regexStr, flags, testText]);

  const toggleFlag = (f: string) => {
    setFlags(prev => prev.includes(f) ? prev.replace(f, '') : prev + f);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(regexStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render text with highlighting
  const highlightedText = useMemo(() => {
    if (matches.length === 0) return testText;

    const result = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      // Non-matching text
      result.push(testText.slice(lastIndex, match.index));
      // Highlighted matching text
      result.push(
        <span 
          key={i} 
          className="bg-accent-purple/30 border-b-2 border-accent-purple text-white relative group inline-block"
        >
          {match.text}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-black border border-white/20 p-2 rounded-lg text-[10px] whitespace-nowrap z-50 pointer-events-none shadow-2xl">
            Match #{i + 1} | Index: {match.index}
            {match.groups.length > 0 && (
              <div className="mt-1 border-t border-white/10 pt-1">
                {match.groups.map((g, gi) => (
                  <div key={gi} className="text-white/40">Group {gi + 1}: <span className="text-accent-cyan">{g}</span></div>
                ))}
              </div>
            )}
          </span>
        </span>
      );
      lastIndex = match.index + match.length;
    });

    result.push(testText.slice(lastIndex));
    return result;
  }, [testText, matches]);

  return (
    <div className="space-y-6">
      {/* Snippets Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {snippets.map((s) => (
          <button
            key={s.name}
            onClick={() => setRegexStr(s.pattern)}
            className="flex-shrink-0 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium transition-all"
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Regex Input Box */}
      <div className="bg-white/5 rounded-3xl border border-white/10 p-6 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-grow group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent-purple transition-colors">
              <span className="text-xl font-mono">/</span>
            </div>
            <input
              type="text"
              value={regexStr}
              onChange={(e) => setRegexStr(e.target.value)}
              placeholder="Enter regular expression..."
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-8 pr-12 font-mono text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder:text-white/10"
            />
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/20 group-focus-within:text-accent-purple transition-colors">
              <span className="text-xl font-mono">/</span>
            </div>
          </div>

          <div className="flex gap-1 bg-black/40 p-2 rounded-2xl border border-white/10">
            {['g', 'i', 'm', 's', 'u', 'y'].map((f) => (
              <button
                key={f}
                onClick={() => toggleFlag(f)}
                className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                  flags.includes(f) 
                    ? 'bg-accent-purple text-white shadow-lg shadow-purple-500/20' 
                    : 'text-white/20 hover:text-white/60'
                }`}
                title={`Flag: ${f}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="font-mono text-xs">{error}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/40 flex items-center gap-2 px-2">
              <Type className="w-4 h-4" />
              Test String
            </label>
            <div className="relative">
              {/* This is the underlying textarea */}
              <textarea
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                onScroll={handleScroll}
                placeholder="Enter text to test your regex..."
                className="w-full h-[300px] bg-black/40 border border-white/10 rounded-3xl p-6 font-mono text-base focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none text-transparent caret-white z-10"
              />
              {/* This is the overlay that shows highlighting */}
              <div 
                ref={overlayRef}
                className="absolute inset-0 p-6 font-mono text-base pointer-events-none whitespace-pre-wrap break-all overflow-y-auto no-scrollbar"
                aria-hidden="true"
              >
                {highlightedText}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Match Details */}
        <div className="space-y-4">
          <div className="bg-white/5 rounded-3xl border border-white/10 p-6 min-h-[350px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Hash className="w-4 h-4 text-accent-cyan" />
                Matches ({matches.length})
              </h3>
              <button 
                onClick={handleCopy}
                className="text-white/40 hover:text-white transition-colors"
                title="Copy Regex"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
              {matches.length === 0 ? (
                <div className="text-center py-12 text-white/20 flex flex-col items-center">
                  <Search className="w-10 h-10 mb-2 opacity-10" />
                  <p className="text-xs">No matches found</p>
                </div>
              ) : (
                matches.map((m, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className="p-3 bg-white/5 rounded-xl border border-white/5 text-sm"
                  >
                    <div className="flex justify-between text-[10px] text-white/20 mb-1">
                      <span>Match #{i + 1}</span>
                      <span>Index: {m.index}</span>
                    </div>
                    <div className="font-mono text-accent-cyan break-all">&quot;{m.text}&quot;</div>
                    {m.groups.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {m.groups.map((g, gi) => (
                          <div key={gi} className="text-[10px] flex gap-2">
                            <span className="text-white/20">Grp {gi + 1}:</span>
                            <span className="text-white/60 truncate italic">&quot;{g || 'empty'}&quot;</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-5 rounded-3xl border border-white/10">
            <h4 className="text-xs font-bold mb-3 flex items-center gap-2">
              <Lightbulb className="w-3 h-3 text-yellow-400" />
              Pro Tip
            </h4>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Use the <span className="text-accent-purple font-mono">g</span> flag for global matching, or <span className="text-accent-purple font-mono">i</span> for case-insensitive search. Hover over highlighted matches to see capture groups!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
