'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  Loader2, 
  Image as ImageIcon, 
  Settings, 
  Zap, 
  ChevronRight, 
  Layers,
  ArrowRightLeft,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function JPGPNGConverter() {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/png');
  const [quality, setQuality] = useState(0.9);
  
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputPreview, setOutputPreview] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFormatLabel = (mimeType: string) => {
    if (mimeType === 'image/jpeg') return 'JPG';
    if (mimeType === 'image/png') return 'PNG';
    if (mimeType === 'image/webp') return 'WEBP';
    return mimeType.split('/')[1]?.toUpperCase() || 'UNKNOWN';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        processFile(file);
      } else {
        setError("Invalid format. Please use images.");
      }
    }
  }, []);

  const processFile = (file: File) => {
    if (inputPreview) URL.revokeObjectURL(inputPreview);
    if (outputPreview) URL.revokeObjectURL(outputPreview);
    
    setInputFile(file);
    const url = URL.createObjectURL(file);
    setInputPreview(url);
    setOutputBlob(null);
    setOutputPreview(null);
    setError(null);
    
    if (file.type === 'image/jpeg') setTargetFormat('image/png');
    else if (file.type === 'image/png') setTargetFormat('image/jpeg');
    else setTargetFormat('image/jpeg');
  };

  const convertImage = () => {
    if (!inputPreview || !inputFile) return;
    setIsProcessing(true);
    setError(null);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      if (targetFormat === 'image/jpeg' && ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx?.drawImage(img, 0, 0);
      
      const outputQuality = targetFormat === 'image/png' ? undefined : quality;
      
      canvas.toBlob((blob) => {
        if (blob) {
          if (outputPreview) URL.revokeObjectURL(outputPreview);
          setOutputBlob(blob);
          setOutputPreview(URL.createObjectURL(blob));
        } else {
          setError("Engine error during transcoding.");
        }
        setIsProcessing(false);
      }, targetFormat, outputQuality);
    };
    img.onerror = () => {
      setError("Source stream load failure.");
      setIsProcessing(false);
    };
    img.src = inputPreview;
  };

  const handleDownload = () => {
    if (!outputBlob || !inputFile) return;
    const url = URL.createObjectURL(outputBlob);
    const link = document.createElement('a');
    link.href = url;
    
    const ext = targetFormat === 'image/jpeg' ? 'jpg' : targetFormat === 'image/png' ? 'png' : 'webp';
    link.download = `${inputFile.name.split('.')[0]}-transmuted.${ext}`;
    
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
    setError(null);
  };

  useEffect(() => {
    return () => {
      if (inputPreview) URL.revokeObjectURL(inputPreview);
      if (outputPreview) URL.revokeObjectURL(outputPreview);
    };
  }, [inputPreview, outputPreview]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
      
      {/* Left Panel: Format Transmutation (5 Columns) */}
      <div className="lg:col-span-5 space-y-6">
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 font-outfit">
                Format Transmutation
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
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center text-white/20 mb-4 group-hover:text-cyan-400 transition-colors border border-white/10">
                  <Upload size={20} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Load Source Buffer</p>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter italic">Image Input</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Format Selector Hub */}
                <div className="space-y-4">
                  <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Target Protocol</label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 rounded border border-white/5">
                    {(['image/png', 'image/jpeg', 'image/webp'] as const).map(fmt => (
                      <button 
                        key={fmt}
                        onClick={() => setTargetFormat(fmt)}
                        className={cn(
                          "py-2.5 rounded text-[10px] font-bold transition-all font-mono uppercase",
                          targetFormat === fmt 
                            ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20" 
                            : "text-white/30 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {getFormatLabel(fmt)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Engine Parameters */}
                <AnimatePresence mode="wait">
                  {targetFormat !== 'image/png' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="flex justify-between items-center">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Encoder Quality</label>
                        <span className="text-[10px] font-mono text-cyan-400">{Math.round(quality * 100)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.1" 
                        max="1.0" 
                        step="0.05" 
                        value={quality}
                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                        className="w-full h-1 bg-white/5 rounded-full appearance-none accent-cyan-400 cursor-pointer"
                      />
                    </motion.div>
                  )}
                  
                  {targetFormat === 'image/png' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 rounded bg-cyan-400/5 border border-cyan-400/10 flex items-start gap-3"
                    >
                      <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                      <p className="text-[10px] leading-relaxed text-cyan-400/60 font-inter italic">
                        PNG encoding preserves alpha transparency. Lossless mode engaged. Output files may be larger.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Source Metadata Card */}
                <div className="flex items-center justify-between p-4 rounded-md bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="text-cyan-400" size={16} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white/80 truncate uppercase tracking-widest">{inputFile.name}</p>
                      <p className="text-[9px] font-mono text-white/30">{getFormatLabel(inputFile.type)} // {formatBytes(inputFile.size)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={reset}
                    className="p-2 rounded bg-white/5 border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/20 transition-all"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>

                {/* Execution Trigger */}
                <button 
                  onClick={convertImage}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-md bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-400/20 flex items-center justify-center gap-3 hover:bg-cyan-300 transition-all group disabled:opacity-30"
                >
                  {isProcessing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Zap size={16} fill="currentColor" />
                      Execute Transmutation
                      <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Technical Specification */}
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md">
          <div className="flex items-center gap-2 mb-4">
            <ArrowRightLeft size={14} className="text-cyan-400" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Encoder Manifest</h3>
          </div>
          <div className="space-y-3 text-[11px] text-white/40 leading-relaxed font-inter italic">
            <p><strong className="text-cyan-400/80 uppercase tracking-tighter not-italic">Universal Transcoding:</strong> Seamless switching between raster protocols while maintaining color space integrity.</p>
            <p><strong className="text-cyan-400/80 uppercase tracking-tighter not-italic">Buffer Integrity:</strong> All transformations occur within the browser sandbox. No server-side storage persistent.</p>
          </div>
        </section>
      </div>

      {/* Right Panel: Transmuted Stream (7 Columns) */}
      <div className="lg:col-span-7 h-full flex flex-col">
        <div className="glass-card border-white/[0.05] bg-black/40 p-8 rounded-md flex-1 flex flex-col relative overflow-hidden shadow-2xl min-h-[600px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                <Layers size={16} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Transmuted Output</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Encoded Buffer // Visual Result</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="relative rounded-md overflow-hidden bg-black/60 border border-white/10 flex-1 min-h-[350px] flex items-center justify-center group mb-6 shadow-inner checkerboard">
              <AnimatePresence mode="wait">
                {outputPreview ? (
                  <motion.img 
                    key="output"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    src={outputPreview} 
                    alt="Transmuted" 
                    className="w-full h-full object-contain p-4 drop-shadow-[0_0_30px_rgba(34,211,238,0.15)]" 
                  />
                ) : (
                  <motion.div 
                    key="placeholder"
                    className="flex flex-col items-center justify-center opacity-10"
                  >
                    <ImageIcon size={60} className="mb-4" />
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Awaiting Transmutation Loop</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute top-4 left-4">
                <span className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[9px] font-mono text-white/40 uppercase tracking-widest">
                  Result_Preview
                </span>
              </div>
            </div>

            {outputBlob && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 pt-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 border border-white/[0.05] bg-white/[0.01] rounded-md flex flex-col items-center justify-center text-center">
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2">Protocol Shift</span>
                    <div className="flex items-center gap-3 font-outfit font-black text-white text-xl uppercase tracking-tighter">
                      <span className="text-white/40">{getFormatLabel(inputFile!.type)}</span>
                      <ChevronRight size={16} className="text-cyan-400" />
                      <span>{getFormatLabel(targetFormat)}</span>
                    </div>
                  </div>
                  <div className="p-6 border border-cyan-400/20 bg-cyan-400/5 rounded-md flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Zap size={30} className="text-cyan-400" />
                    </div>
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2 font-bold">New Payload</span>
                    <div className="flex items-center gap-2">
                       <span className="text-xl font-bold text-cyan-400 font-mono tracking-tighter">{formatBytes(outputBlob.size)}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleDownload}
                  className="w-full py-4 rounded-md bg-white text-black font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-50 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                >
                  <Download size={14} />
                  Extract Transmuted Stream
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      {error && <div className="lg:col-span-12 p-4 rounded bg-red-400/10 border border-red-400/20 text-red-400 text-[10px] font-bold uppercase text-center tracking-widest font-mono">{error}</div>}
    </div>
  );
}
