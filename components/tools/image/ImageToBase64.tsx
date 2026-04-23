'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Upload, Copy, Download, RefreshCw, Image as ImageIcon, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    a.href = URL.createObjectURL(blob);
    a.download = `${inputFile?.name || 'image'}_base64.txt`;
    a.click();
  };

  const reset = () => { setInputFile(null); setBase64(null); setDataUrl(null); };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      {!inputFile ? (
        <div
          onDrop={handleDrop} onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="glass-card rounded-2xl border-2 border-dashed border-white/20 hover:border-violet-500/50 p-16 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-violet-500/10 flex items-center justify-center transition-all">
            <Code2 size={28} className="text-white/30 group-hover:text-violet-400 transition-colors" />
          </div>
          <div className="text-center">
            <p className="text-white/70 font-medium">Drop an image to convert to Base64</p>
            <p className="text-white/30 text-sm mt-1">PNG, JPG, GIF, WEBP, SVG supported</p>
          </div>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-white/10 p-4 flex items-center gap-4">
          <img src={dataUrl!} alt="Preview" className="w-16 h-16 object-cover rounded-xl" />
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-sm font-medium truncate">{inputFile.name}</p>
            <p className="text-white/40 text-xs">{(inputFile.size / 1024).toFixed(1)} KB → {((base64?.length || 0) / 1024).toFixed(1)} KB Base64</p>
          </div>
          <button onClick={reset} className="text-xs text-white/40 hover:text-red-400 transition-colors">Remove</button>
        </div>
      )}

      {/* Output */}
      <AnimatePresence>
        {base64 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl border border-white/10 overflow-hidden">
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b border-white/10">
              <span className="text-sm text-white/60 font-medium mr-auto">Output Format</span>
              {(['dataurl', 'raw'] as const).map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${format === f ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'}`}>
                  {f === 'dataurl' ? 'Data URL' : 'Raw Base64'}
                </button>
              ))}
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition-all">
                <Copy size={13} />{copiedFull ? 'Copied!' : 'Copy'}
              </button>
              <button onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 text-xs transition-all">
                <Download size={13} />Save .txt
              </button>
            </div>
            <textarea
              readOnly value={output || ''}
              rows={8}
              className="w-full bg-transparent text-emerald-300/80 text-xs font-mono p-4 resize-none outline-none"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
