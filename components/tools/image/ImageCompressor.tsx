'use client';

import React, { useState, useCallback, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  Loader2, 
  Image as ImageIcon, 
  Settings, 
  Zap, 
  ChevronRight, 
  Trash2,
  Maximize2,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ImageCompressor() {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputPreview, setOutputPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processFile(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        processFile(file);
      } else {
        setError("Invalid format. Please use image files.");
      }
    }
  }, []);

  const processFile = (file: File) => {
    if (inputPreview) URL.revokeObjectURL(inputPreview);
    if (outputPreview) URL.revokeObjectURL(outputPreview);

    setInputFile(file);
    setInputPreview(URL.createObjectURL(file));
    setOutputBlob(null);
    setOutputPreview(null);
    setError(null);
  };

  const compressImage = async () => {
    if (!inputFile) return;
    setIsProcessing(true);
    setError(null);

    const options = {
      maxSizeMB: quality < 0.5 ? 0.5 : 2,
      maxWidthOrHeight: maxWidth ? parseInt(maxWidth) : 1920,
      useWebWorker: true,
      initialQuality: quality,
    };

    try {
      const compressedFile = await imageCompression(inputFile, options);
      if (outputPreview) URL.revokeObjectURL(outputPreview);
      setOutputBlob(compressedFile);
      setOutputPreview(URL.createObjectURL(compressedFile));
    } catch (err: any) {
      setError(err.message || "Failed to compress image.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!outputBlob || !inputFile) return;
    const url = URL.createObjectURL(outputBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `optimized-${inputFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    if (inputPreview) URL.revokeObjectURL(inputPreview);
    if (outputPreview) URL.revokeObjectURL(outputPreview);
    setInputFile(null);
    setInputPreview(null);
    setOutputBlob(null);
    setOutputPreview(null);
    setQuality(0.8);
    setMaxWidth('');
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (inputPreview) URL.revokeObjectURL(inputPreview);
      if (outputPreview) URL.revokeObjectURL(outputPreview);
    };
  }, [inputPreview, outputPreview]);

  const savingsPercentage = outputBlob && inputFile 
    ? Math.round(((inputFile.size - outputBlob.size) / inputFile.size) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
      
      {/* Left Panel: Source Optimization (5 Columns) */}
      <div className="lg:col-span-5 space-y-6">
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 font-outfit">
                Source Optimization
              </h2>
            </div>

            {!inputFile ? (
              <div 
                className="group relative flex flex-col items-center justify-center py-20 px-6 border border-dashed border-white/10 hover:border-cyan-400/40 rounded-md transition-all bg-white/[0.01]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  accept="image/jpeg, image/png, image/webp" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center text-white/20 mb-4 group-hover:text-cyan-400 transition-colors border border-white/10">
                  <Upload size={20} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Upload Original</p>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter italic">Source Stream</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Configuration Stack */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2">
                        <Sliders size={12} className="text-cyan-400" />
                        Compression Factor
                      </label>
                      <span className="text-xs font-mono font-bold text-cyan-400">{Math.round(quality * 100)}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.1" 
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full h-1 bg-white/5 rounded-full appearance-none accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest block">
                      Max Dimension (PX)
                    </label>
                    <input 
                      type="number" 
                      placeholder="Automatic (1920px max)" 
                      value={maxWidth}
                      onChange={(e) => setMaxWidth(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.05] rounded-md px-4 py-3 text-xs outline-none focus:border-cyan-400/40 transition-all font-mono placeholder:text-white/10"
                    />
                  </div>
                </div>

                {/* File Metadata Card */}
                <div className="flex items-center justify-between p-4 rounded-md bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="text-cyan-400" size={16} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white/80 truncate uppercase tracking-widest">{inputFile.name}</p>
                      <p className="text-[9px] font-mono text-white/30">{formatBytes(inputFile.size)} // ORIGINAL</p>
                    </div>
                  </div>
                  <button 
                    onClick={reset}
                    className="p-2 rounded bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/20 transition-all"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>

                {/* Action Trigger */}
                <button 
                  onClick={compressImage}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-md bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-400/20 flex items-center justify-center gap-3 hover:bg-cyan-300 transition-all group disabled:opacity-30"
                >
                  {isProcessing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Zap size={16} fill="currentColor" />
                      Execute Compression
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Intelligence Module */}
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={14} className="text-cyan-400" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Compression Engine</h3>
          </div>
          <div className="space-y-3 text-[11px] text-white/40 leading-relaxed font-inter">
            <p><strong className="text-cyan-400/80 uppercase tracking-tighter">Lossless Buffer:</strong> The algorithm prioritizes visual fidelity while stripping unnecessary metadata and bloating.</p>
            <p><strong className="text-cyan-400/80 uppercase tracking-tighter">Local Stream:</strong> Processing occurs in-memory via WebWorkers, ensuring zero data transmission.</p>
          </div>
        </section>
      </div>

      {/* Right Panel: Optimized Result (7 Columns) */}
      <div className="lg:col-span-7 h-full flex flex-col">
        <div className="glass-card border-white/[0.05] bg-black/40 p-8 rounded-md flex-1 flex flex-col relative overflow-hidden shadow-2xl min-h-[600px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                <Maximize2 size={16} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Optimized Stream</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Compressed Buffer // Neural Output</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="relative rounded-md overflow-hidden bg-black/60 border border-white/10 flex-1 min-h-[300px] flex items-center justify-center group mb-6">
              {outputPreview ? (
                <motion.img 
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={outputPreview} 
                  alt="Optimized" 
                  className="w-full h-full object-contain p-4 drop-shadow-2xl" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center opacity-10">
                  <ImageIcon size={60} className="mb-4" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Awaiting Optimization</p>
                </div>
              )}
              <div className="absolute top-4 left-4">
                <span className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[9px] font-mono text-white/40 uppercase tracking-widest">
                  Result_Preview
                </span>
              </div>
            </div>

            {outputBlob && inputFile && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 border border-cyan-400/20 bg-cyan-400/5 rounded-md flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest mb-1">Payload Reduction</span>
                    <span className="text-[48px] font-outfit font-black text-white leading-none tracking-tighter">
                      -{savingsPercentage}%
                    </span>
                  </div>
                  <div className="p-6 border border-white/[0.05] bg-white/[0.01] rounded-md flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-3 text-[10px] font-mono text-white/30 uppercase tracking-widest mb-2">
                       {formatBytes(inputFile.size)} <ChevronRight size={10} /> {formatBytes(outputBlob.size)}
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                       <span className="text-xs font-bold text-white uppercase tracking-widest">Optimized Buffer</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleDownload}
                  className="w-full py-4 rounded-md bg-white text-black font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-50 transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <Download size={14} />
                  Download Optimized Stream
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      {error && <div className="lg:col-span-12 p-4 rounded bg-red-400/10 border border-red-400/20 text-red-400 text-[10px] font-bold uppercase text-center tracking-widest">{error}</div>}
    </div>
  );
}

