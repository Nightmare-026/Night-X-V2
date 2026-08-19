'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { cn, copyToClipboard } from '@/lib/utils';
import { 
  Code, 
  Copy, 
  Trash2, 
  RefreshCw, 
  AlignLeft, 
  FileJson,
  Zap,
  Sparkles,
  Terminal,
  Check,
  AlertCircle,
  Cpu,
  Layers,
  Code2
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function JsonFormatter() {
  const { toast } = useToast();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isFormatting, setIsFormatting] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const format = useCallback((val: string, indent: number) => {
    if (!val) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(val);
      const formatted = JSON.stringify(parsed, null, indent);
      setOutput(formatted);
      setError(null);
    } catch (e: any) {
      setError(e.message);
      setOutput('');
    }
  }, []);

  const handleFormat = () => {
    format(input, indentSize);
    if (!error && input) toast("JSON Formatted", "success");
  };

  const handleCopy = async () => {
    if (!output) return;
    const success = await copyToClipboard(output);
    if (success) {
      toast("Formatted JSON copied", "success");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
      toast("JSON Minified", "success");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Syntactic Source */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="text-cyan-400" size={16} />
                <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Syntactic Source</h3>
              </div>
              {input && (
                <button 
                  onClick={() => { setInput(''); setOutput(''); setError(null); }}
                  className="text-[10px] font-bold text-white/20 hover:text-cyan-400 uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  <Trash2 size={12} /> Clear
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Code size={10} /> Raw Data
                </label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='{ "protocol": "json", "status": "active" }'
                  className="w-full h-80 bg-black/40 border border-white/[0.05] rounded-md p-6 font-mono text-xs text-white/80 focus:outline-none focus:border-cyan-400/50 transition-all resize-none custom-scrollbar leading-relaxed"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-widest px-1">
                  <span>Indentation Model</span>
                  <span className="text-cyan-400">{indentSize} Spaces</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 4, 8].map(size => (
                    <button
                      key={size}
                      onClick={() => { setIndentSize(size); if (input) format(input, size); }}
                      className={cn(
                        "py-3 rounded-md border text-[10px] font-bold uppercase tracking-widest transition-all",
                        indentSize === size 
                          ? "bg-cyan-400/10 border-cyan-400/20 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.05)]" 
                          : "bg-white/5 border-white/10 text-white/20 hover:text-white/40"
                      )}
                    >
                      {size} SP
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={handleFormat}
                  disabled={!input || isFormatting}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-cyan-400 text-black rounded-md font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-300 transition-all disabled:opacity-30 disabled:grayscale"
                >
                  <AlignLeft size={14} />
                  Beautify Payload
                </button>
                <button
                  onClick={minify}
                  disabled={!input}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-white/80 rounded-md font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all disabled:opacity-30"
                >
                  <Zap size={14} />
                  Minify Payload
                </button>
              </div>
            </div>

            <div className="p-6 bg-cyan-400/5 border border-cyan-400/10 rounded-md space-y-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <Cpu size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Syntactic Engine</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                Deploying real-time JSON validation and prettification protocol with RFC 8259 compliance.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Beautified Payload */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 relative overflow-hidden flex flex-col min-h-[640px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase mb-2">Protocol Result</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Beautified Payload</h2>
                </div>
                
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-md border border-white/5">
                  <FileJson size={12} className="text-cyan-400" />
                  <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Validation Active</span>
                </div>
              </div>

              <div className="flex-1 bg-black/40 border border-white/[0.05] rounded-md p-8 font-mono text-sm relative overflow-hidden group">
                <div className="absolute top-4 right-4 text-[10px] font-bold text-white/10 uppercase tracking-widest select-none">
                  Output Viewport
                </div>
                
                <div className="h-full overflow-auto custom-scrollbar">
                  {error ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <div className="p-4 rounded-full bg-red-400/10 border border-red-400/20">
                        <AlertCircle className="text-red-400" size={24} />
                      </div>
                      <div className="space-y-1">
                        <div className="text-red-400 font-bold text-xs uppercase tracking-widest">Syntactic Error</div>
                        <div className="text-white/40 text-[10px] max-w-xs uppercase tracking-widest leading-relaxed">
                          {error}
                        </div>
                      </div>
                    </div>
                  ) : output ? (
                    <div className="text-white/80 whitespace-pre font-mono leading-relaxed selection:bg-cyan-400/30">
                      {output}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <Code2 className="text-white/10" size={48} />
                      <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest">
                        Awaiting Serialization...
                      </div>
                    </div>
                  )}
                </div>

                {output && !error && (
                  <button
                    onClick={handleCopy}
                    className="absolute bottom-6 right-6 flex items-center gap-3 px-6 py-3 bg-cyan-400 text-black rounded-md font-bold text-[10px] uppercase tracking-widest shadow-2xl hover:bg-cyan-300 transition-all active:scale-95"
                  >
                    <Copy size={14} />
                    Copy Payload
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-cyan-400">
                    <Sparkles size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Structure Polish</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Automatically correcting nested indentation and key alignment for maximum readability.
                  </p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-md space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <Check size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Integrity Check</span>
                  </div>
                  <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                    Ensuring all structural modifications preserve data types and nesting levels.
                  </p>
                </div>
              </div>
            </div>

            {isFormatting && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-md">
                <div className="w-10 h-10 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin mb-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/70">Refining Data...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
