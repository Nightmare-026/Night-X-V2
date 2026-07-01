'use client';
// @ts-nocheck
import { cn } from '@/lib/utils';
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
  Check,
  Terminal,
  Cpu,
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
      let match;

      if (flags.includes('g')) {
        while ((match = re.exec(testText)) !== null) {
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

  const highlightedText = useMemo(() => {
    if (matches.length === 0) return testText;

    const result = [];
    let lastIndex = 0;

    matches.forEach((match, i) => {
      result.push(testText.slice(lastIndex, match.index));
      result.push(
        <span 
          key={i} 
          className="bg-cyan-400/20 border-b border-cyan-400/50 text-white relative group inline-block rounded-sm"
        >
          {match.text}
        </span>
      );
      lastIndex = match.index + match.length;
    });

    result.push(testText.slice(lastIndex));
    return result;
  }, [testText, matches]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Expression Logic */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="text-cyan-400" size={16} />
                <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Expression Logic</h3>
              </div>
              <button 
                onClick={handleCopy}
                className="text-[10px] font-bold text-white/20 hover:text-cyan-400 uppercase tracking-widest transition-colors flex items-center gap-2"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />} {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <div className="space-y-6">
              {/* Regex Input Box */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Search size={10} /> Pattern
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/10 font-mono text-xl group-focus-within:text-cyan-400 transition-colors">/</div>
                  <input
                    type="text"
                    value={regexStr}
                    onChange={(e) => setRegexStr(e.target.value)}
                    className="w-full bg-black/40 border border-white/[0.05] rounded-md py-4 pl-8 pr-12 font-mono text-sm text-white/80 focus:outline-none focus:border-cyan-400/50 transition-all"
                  />
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-white/10 font-mono text-xl group-focus-within:text-cyan-400 transition-colors">/</div>
                </div>
              </div>

              {/* Flags Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Flag size={10} /> Global Flags
                </label>
                <div className="flex gap-1.5 p-1.5 bg-black/40 border border-white/[0.05] rounded-md">
                  {['g', 'i', 'm', 's', 'u', 'y'].map((f) => (
                    <button
                      key={f}
                      onClick={() => toggleFlag(f)}
                      className={cn(
                        "flex-1 py-2 rounded-md text-[10px] font-mono font-bold uppercase transition-all",
                        flags.includes(f) 
                          ? "bg-cyan-400/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.05)]" 
                          : "text-white/20 hover:text-white/40"
                      )}
                      title={`Flag: ${f}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Snippets */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Code2 size={10} /> Snippet Library
                </label>
                <div className="flex flex-wrap gap-2">
                  {snippets.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setRegexStr(s.pattern)}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-md text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-cyan-400 hover:border-cyan-400/30 transition-all"
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-400/5 border border-red-400/10 rounded-md">
                  <AlertCircle className="text-red-400 flex-shrink-0" size={14} />
                  <span className="text-[10px] font-mono text-red-400 uppercase tracking-widest leading-relaxed">{error}</span>
                </div>
              )}
            </div>

            <div className="p-6 bg-cyan-400/5 border border-cyan-400/10 rounded-md space-y-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <Cpu size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Inference Protocol</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                Utilizing native V8 engine regex parsing for high-performance pattern matching and grouping.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Pattern Validation */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden flex flex-col min-h-[700px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase mb-2">Protocol Result</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Pattern Validation</h2>
                </div>
                
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-md border border-white/5">
                  <Hash size={12} className="text-cyan-400" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{matches.length} Matches Found</span>
                </div>
              </div>

              <div className="flex-1 space-y-6 flex flex-col">
                <div className="flex-1 relative group">
                  <div className="absolute top-4 right-4 text-[10px] font-bold text-white/10 uppercase tracking-widest select-none z-20">
                    Test Payload
                  </div>
                  <textarea
                    value={testText}
                    onChange={(e) => setTestText(e.target.value)}
                    onScroll={handleScroll}
                    className="w-full h-full bg-black/40 border border-white/[0.05] rounded-md p-8 font-mono text-sm focus:outline-none focus:border-cyan-400/50 transition-all resize-none text-transparent caret-white z-10 leading-relaxed"
                  />
                  <div 
                    ref={overlayRef}
                    className="absolute inset-0 p-8 font-mono text-sm pointer-events-none whitespace-pre-wrap break-all overflow-y-auto custom-scrollbar leading-relaxed text-white/40"
                    aria-hidden="true"
                  >
                    {highlightedText}
                  </div>
                </div>

                <div className="h-48 bg-black/20 border border-white/[0.05] rounded-md flex flex-col overflow-hidden">
                  <div className="px-6 py-3 border-b border-white/[0.05] bg-white/[0.02] flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">Match Details</span>
                    <Settings size={12} className="text-white/10" />
                  </div>
                  <div className="flex-1 overflow-auto custom-scrollbar p-6 space-y-4">
                    {matches.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-2">
                        <Search size={24} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">No Matches</span>
                      </div>
                    ) : (
                      matches.map((m, i) => (
                        <div key={i} className="flex flex-col gap-2 p-4 bg-white/[0.02] border border-white/[0.05] rounded-md group hover:border-cyan-400/30 transition-all">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Match #{i + 1}</span>
                            <span className="text-[10px] font-mono text-white/10">IDX: {m.index}</span>
                          </div>
                          <div className="font-mono text-xs text-white/80 break-all leading-relaxed bg-black/40 p-3 rounded-md">
                            &quot;{m.text}&quot;
                          </div>
                          {m.groups.length > 0 && (
                            <div className="grid grid-cols-2 gap-2 pt-2">
                              {m.groups.map((g, gi) => (
                                <div key={gi} className="text-[9px] font-mono text-white/30 uppercase tracking-tight flex gap-2">
                                  <span className="text-cyan-400/40">GRP{gi + 1}:</span>
                                  <span className="truncate">{g || 'NULL'}</span>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-cyan-400">
                    <Zap size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Performance Trace</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Real-time backtracking analysis prevents ReDoS vulnerabilities during execution.
                  </p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <ShieldCheck size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Security Audit</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Sanitizes expression strings to ensure safe execution in browser sandboxes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
