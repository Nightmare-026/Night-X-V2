'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { 
  Upload, 
  Copy, 
  Download, 
  RefreshCw, 
  Image as ImageIcon, 
  Code2, 
  Check, 
  Zap, 
  ChevronRight, 
  Terminal,
  Layers,
  FileCode,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ImageToBase64() {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [base64, setBase64] = useState<string | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [format, setFormat] = useState<'dataurl' | 'raw'>('dataurl');
  const [copiedFull, setCopiedFull] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setInputFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setDataUrl(url);
      setBase64(url.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) processFile(file);
  }, []);

  const output = format === 'dataurl' ? dataUrl : base64;
  const isTooLong = (output?.length || 0) > 25000;
  const displayedOutput = isTooLong 
    ? output?.slice(0, 25000) + '\n\n/* OUTPUT TRUNCATED FOR RENDERING PERFORMANCE. USE COPY OR EXTRACT BUTTONS FOR FULL PAYLOAD */' 
    : output;

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const a = document.createElement('a');
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = `${inputFile?.name.split('.')[0] || 'image'}_base64.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const reset = () => { 
    setInputFile(null); 
    setBase64(null); 
    setDataUrl(null); 
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
      
      {/* Left Panel: String Serializer (5 Columns) */}
      <div className="lg:col-span-5 space-y-6">
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md relative overflow-hidden h-full flex flex-col min-h-[500px]">
          <div className="relative z-10 flex-1 flex flex-col space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 font-outfit">
                  String Serializer
                </h2>
              </div>
              {inputFile && (
                <button 
                  onClick={reset}
                  className="text-[9px] font-bold uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors"
                >
                  Purge Stream
                </button>
              )}
            </div>

            {!inputFile ? (
              <div 
                className="group relative flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-cyan-400/40 rounded-md transition-all bg-white/[0.01] cursor-pointer"
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input 
                  ref={inputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }}
                />
                <div className="w-16 h-16 rounded bg-white/5 flex items-center justify-center text-white/20 mb-6 group-hover:text-cyan-400 transition-colors border border-white/10">
                  <FileCode size={24} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Initialize Serialization</p>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter italic">Image Input Loop</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-6">
                {/* Source Manifest */}
                <div className="relative rounded-md overflow-hidden bg-black/60 border border-white/10 p-4 flex flex-col items-center gap-4 group shadow-inner checkerboard">
                  <img 
                    src={dataUrl!} 
                    alt="Source" 
                    className="max-h-[200px] object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]" 
                  />
                  <div className="w-full flex items-center justify-between px-2 pt-2 border-t border-white/5">
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white/80 truncate uppercase tracking-widest">{inputFile.name}</p>
                      <p className="text-[9px] font-mono text-white/30 uppercase">{formatBytes(inputFile.size)} // {inputFile.type}</p>
                    </div>
                  </div>
                </div>

                {/* Protocol Selection */}
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Output Schema</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded border border-white/5">
                    {(['dataurl', 'raw'] as const).map(f => (
                      <button 
                        key={f}
                        onClick={() => setFormat(f)}
                        className={cn(
                          "py-2.5 rounded text-[10px] font-bold transition-all font-mono uppercase",
                          format === f 
                            ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20" 
                            : "text-white/30 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {f === 'dataurl' ? 'Data URL' : 'Raw Base64'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Technical Note */}
                <div className="p-4 rounded bg-cyan-400/5 border border-cyan-400/10 flex items-start gap-3">
                  <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] leading-relaxed text-cyan-400/60 font-inter italic">
                    Serialization complete. The resulting buffer is encoded as a base64 string, suitable for embedding in HTML, CSS, or JSON payloads.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Right Panel: Serialized Buffer (7 Columns) */}
      <div className="lg:col-span-7 h-full flex flex-col">
        <div className="glass-card border-white/[0.05] bg-black/40 p-8 rounded-md flex-1 flex flex-col relative overflow-hidden shadow-2xl min-h-[600px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                <Terminal size={16} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Serialized Payload</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Stream Output // Base64 Buffer</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy}
                disabled={!output}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest transition-all",
                  copiedFull ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-white/5 text-white/60 hover:text-white border border-white/10"
                )}
              >
                {copiedFull ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy Buffer</>}
              </button>
              <button 
                onClick={handleDownload}
                disabled={!output}
                className="flex items-center gap-2 px-4 py-2 rounded bg-cyan-400 text-black text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-400/10"
              >
                <Download size={12} /> Extract .txt
              </button>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="relative flex-1 rounded-md border border-white/10 bg-black/40 overflow-hidden group">
              <div className="absolute top-4 left-4 z-10">
                <span className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[9px] font-mono text-white/40 uppercase tracking-widest">
                  Payload_Stream
                </span>
              </div>
              
              <textarea
                readOnly
                value={displayedOutput || ''}
                placeholder="Awaiting stream initialization..."
                className="w-full h-full bg-transparent text-cyan-400/70 text-xs font-mono p-10 pt-16 resize-none outline-none selection:bg-cyan-400/20"
              />

              <AnimatePresence>
                {isTooLong && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-6 right-6 p-3 rounded bg-red-400/10 border border-red-400/20 backdrop-blur-md max-w-[300px]"
                  >
                    <p className="text-[9px] font-bold text-red-400 uppercase tracking-widest leading-relaxed">
                      [BUFFER_OVERFLOW] Rendering limited for stability. Full payload available via Extract or Copy.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {output && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 rounded bg-white/[0.02] border border-white/[0.05] flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">Character_Count</span>
                    <span className="text-sm font-bold text-white font-mono tracking-tighter">{output.length.toLocaleString()}</span>
                  </div>
                  <div className="h-6 w-px bg-white/10" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">Compression_Ratio</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono tracking-tighter">1.33x Expansion</span>
                  </div>
                </div>
                <div className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em] italic">
                  Encoded via rfc4648
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
