'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Settings, 
  AlertCircle,
  Hash,
  Flag,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  Zap,
  Code2
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

  const snippets = [
    { name: 'Email', pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' },
    { name: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)' },
    { name: 'Phone', pattern: '^[+]?[(]?[0-9]{3}[)]?[-\\s.]?[0-9]{3}[-\\s.]?[0-9]{4,6}$' },
    { name: 'Date', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
    { name: 'Password', pattern: '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$' }
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
      let match: RegExpExecArray | null;

      if (flags.includes('g')) {
        let loopCount = 0;
        while ((match = re.exec(testText)) !== null && loopCount < 1000) {
          loopCount++;
          if (match.index === re.lastIndex) re.lastIndex++;
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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid Regular Expression';
      setError(message);
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

  const highlightedText = useMemo(() => {
    if (matches.length === 0) return testText;

    const result: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      if (match.index > lastIndex) {
        result.push(testText.slice(lastIndex, match.index));
      }
      result.push(
        <mark 
          key={i} 
          className="bg-primary/30 text-white border-b-2 border-primary rounded-sm px-0.5"
        >
          {match.text}
        </mark>
      );
      lastIndex = match.index + match.length;
    });

    if (lastIndex < testText.length) {
      result.push(testText.slice(lastIndex));
    }
    return result;
  }, [testText, matches]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Expression Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card bg-[#0E101B]/80 border-white/[0.08] rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <Terminal className="text-primary-400" size={16} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">Regular Expression</h3>
              </div>
              <button 
                onClick={handleCopy}
                className="text-xs font-semibold text-text-tertiary hover:text-white transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="space-y-5">
              {/* Regex Input Box */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary block">Pattern</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-text-muted font-mono text-base group-focus-within:text-primary-400 transition-colors">/</div>
                  <input
                    type="text"
                    value={regexStr}
                    onChange={(e) => setRegexStr(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-3 pl-8 pr-8 font-mono text-xs text-white focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <div className="absolute inset-y-0 right-3.5 flex items-center pointer-events-none text-text-muted font-mono text-base group-focus-within:text-primary-400 transition-colors">/</div>
                </div>
              </div>

              {/* Flags Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <Flag size={12} className="text-accent-cyan" /> Flags
                </label>
                <div className="flex gap-1.5 p-1.5 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                  {['g', 'i', 'm', 's', 'u', 'y'].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => toggleFlag(f)}
                      className={cn(
                        "flex-1 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition-all",
                        flags.includes(f) 
                          ? "bg-primary/25 text-primary-300 border border-primary/40" 
                          : "text-text-muted hover:text-white"
                      )}
                      title={`Flag: ${f}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Snippets */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-text-secondary flex items-center gap-1.5">
                  <Code2 size={12} className="text-accent-pink" /> Presets
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {snippets.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setRegexStr(s.pattern)}
                      className="px-2.5 py-1 bg-white/[0.03] border border-white/[0.08] rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:border-primary/30 transition-all"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span className="font-mono">{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Validation & Test Text */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card bg-[#0E101B]/80 border-white/[0.08] rounded-2xl p-6 relative flex flex-col min-h-[560px] shadow-xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white">Test String & Matches</h3>
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.04] rounded-lg border border-white/[0.06]">
                <Hash size={12} className="text-primary-400" />
                <span className="text-xs font-semibold text-white">{matches.length} Matches</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 flex flex-col">
              {/* Text Input Container */}
              <div className="relative flex-1 min-h-[160px] rounded-xl overflow-hidden border border-white/10 bg-white/[0.02]">
                <textarea
                  value={testText}
                  onChange={(e) => setTestText(e.target.value)}
                  onScroll={handleScroll}
                  placeholder="Enter test string here..."
                  className="w-full h-full p-4 font-mono text-xs bg-transparent text-transparent caret-white focus:outline-none resize-none z-10 relative leading-relaxed"
                />
                <div 
                  ref={overlayRef}
                  className="absolute inset-0 p-4 font-mono text-xs pointer-events-none whitespace-pre-wrap break-all overflow-y-auto leading-relaxed text-text-secondary z-0"
                  aria-hidden="true"
                >
                  {highlightedText}
                </div>
              </div>

              {/* Matches List */}
              <div className="h-56 bg-black/40 border border-white/[0.06] rounded-xl flex flex-col overflow-hidden">
                <div className="px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-xs text-text-muted">
                  <span className="font-semibold uppercase tracking-wider text-[10px]">Captured Matches & Groups</span>
                  <Settings size={12} />
                </div>
                <div className="flex-1 overflow-auto custom-scrollbar p-3 space-y-2">
                  {matches.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-text-muted space-y-1.5 py-6">
                      <Search size={20} />
                      <span className="text-xs">No matches found</span>
                    </div>
                  ) : (
                    matches.map((m, i) => (
                      <div key={i} className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:border-primary/30 transition-all space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-primary-300">Match #{i + 1}</span>
                          <span className="font-mono text-[10px] text-text-muted">Index: {m.index}</span>
                        </div>
                        <div className="font-mono text-xs text-white break-all bg-black/50 p-2 rounded-lg">
                          &quot;{m.text}&quot;
                        </div>
                        {m.groups.length > 0 && (
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            {m.groups.map((g, gi) => (
                              <div key={gi} className="text-[10px] font-mono text-text-tertiary flex gap-1.5">
                                <span className="text-accent-cyan">Group {gi + 1}:</span>
                                <span className="truncate text-white/80">{g || 'undefined'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
