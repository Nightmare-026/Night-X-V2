'use client';

import React, { useState, useCallback } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, copyToClipboard } from '@/lib/utils';
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
    setIsFormatting(true);
    setTimeout(() => {
      format(input, indentSize);
      setIsFormatting(false);
      if (!error && input) toast("JSON Formatted", "success");
    }, 300);
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
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Panel */}
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden"
          >
            <div className="p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent-purple/10 text-accent-purple">
                    <Terminal size={18} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">Source JSON</h3>
                </div>
                {input && (
                  <button 
                    onClick={() => { setInput(''); setOutput(''); setError(null); }}
                    className="text-[10px] font-black text-white/20 hover:text-red-400 uppercase tracking-widest transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple/20 to-accent-cyan/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='{ "key": "value" }'
                  className="relative w-full h-96 bg-black/40 border border-white/10 rounded-2xl p-6 text-white font-mono text-xs focus:outline-none focus:border-accent-purple transition-all resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase ml-1">
                  <span>Indentation</span>
                  <span className="text-accent-purple">{indentSize} Spaces</span>
                </div>
                <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                  {[2, 4, 8].map(size => (
                    <button
                      key={size}
                      onClick={() => { setIndentSize(size); if (input) format(input, size); }}
                      className={cn(
                        "flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all",
                        indentSize === size ? "bg-accent-purple text-white shadow-lg" : "text-white/20 hover:text-white/40"
                      )}
                    >
                      {size} Spaces
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleFormat}
                  disabled={!input || isFormatting}
                  className="flex items-center justify-center gap-2 py-4 bg-white text-black rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-accent-purple hover:text-white transition-all disabled:opacity-30"
                >
                  <AlignLeft size={16} />
                  Format
                </button>
                <button
                  onClick={minify}
                  disabled={!input}
                  className="flex items-center justify-center gap-2 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  <Code size={16} />
                  Minify
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 relative overflow-hidden group min-h-[600px]"
          >
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent-cyan/5 blur-[120px] rounded-full group-hover:bg-accent-cyan/10 transition-all duration-1000" />
            
            <div className="relative z-10 flex flex-col h-full w-full">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-black tracking-[0.2em] text-accent-cyan uppercase mb-2">Beautified Result</div>
                  <h2 className="text-2xl font-bold font-syne">Output JSON</h2>
                </div>
                <div className="flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                  <FileJson size={14} className="text-accent-cyan" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Valid JSON</span>
                </div>
              </div>

              <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                  {error ? (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-6"
                    >
                      <div className="p-6 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                        <AlertCircle size={40} />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-bold text-red-200/80 uppercase tracking-widest">Parse Error</p>
                        <p className="text-xs font-mono text-red-400/60 max-w-[300px] leading-relaxed">{error}</p>
                      </div>
                    </motion.div>
                  ) : output ? (
                    <motion.div
                      key="output"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full"
                    >
                      <pre className="w-full h-full bg-[#0D0F18] border border-white/5 rounded-[32px] p-8 font-mono text-[11px] leading-relaxed text-white/80 overflow-auto scrollbar-hide select-all">
                        {output}
                      </pre>
                      <button
                        onClick={handleCopy}
                        className="absolute bottom-6 right-6 flex items-center gap-3 px-6 py-3 bg-accent-cyan text-black rounded-2xl font-black text-[10px] uppercase tracking-wider shadow-2xl hover:scale-105 active:scale-95 transition-all"
                      >
                        <Copy size={16} />
                        Copy Result
                      </button>
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 opacity-20">
                      <div className="p-10 rounded-full bg-white/5 border border-white/5">
                        <FileJson size={64} strokeWidth={1} />
                      </div>
                      <div className="text-center space-y-1">
                        <p className="text-sm font-bold uppercase tracking-widest">Awaiting JSON</p>
                        <p className="text-[10px] font-medium max-w-[200px]">Format your raw data into a readable and structured JSON object</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {isFormatting && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[40px]">
                <div className="w-12 h-12 border-4 border-accent-purple/20 border-t-accent-purple rounded-full animate-spin mb-4" />
                <span className="text-xs font-black uppercase tracking-[0.3em] text-white/70">Beautifying...</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
