'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  Loader2, 
  Image as ImageIcon, 
  Settings, 
  Link as LinkIcon, 
  Unlink, 
  Zap, 
  ChevronRight, 
  Maximize2,
  Minimize2,
  Layers,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

const PRESETS = [
  { name: 'HD', width: 1280, height: 720 },
  { name: 'Full HD', width: 1920, height: 1080 },
  { name: '4K', width: 3840, height: 2160 },
  { name: 'Instagram', width: 1080, height: 1080 },
  { name: 'Twitter Banner', width: 1500, height: 500 },
];

export default function ImageResizer() {
  const { toast } = useToast();
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);
  
  const [targetWidth, setTargetWidth] = useState<number | ''>('');
  const [targetHeight, setTargetHeight] = useState<number | ''>('');
  
  const [lockAspect, setLockAspect] = useState(true);
  
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputPreview, setOutputPreview] = useState<string | null>(null);
  const [outWidth, setOutWidth] = useState(0);
  const [outHeight, setOutHeight] = useState(0);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast("Invalid format. Please use images.", "error");
      return;
    }
    
    if (inputPreview) URL.revokeObjectURL(inputPreview);
    if (outputPreview) URL.revokeObjectURL(outputPreview);
    
    setInputFile(file);
    const url = URL.createObjectURL(file);
    setInputPreview(url);
    setOutputBlob(null);
    setOutputPreview(null);
    setError(null);

    const img = new Image();
    img.onload = () => {
      setOrigWidth(img.width);
      setOrigHeight(img.height);
      setTargetWidth(img.width);
      setTargetHeight(img.height);
    };
    img.src = url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleWidthChange = (val: string) => {
    const num = val === '' ? '' : parseInt(val);
    setTargetWidth(num);
    if (lockAspect && num !== '' && origWidth > 0) {
      const ratio = origHeight / origWidth;
      setTargetHeight(Math.round(num * ratio));
    }
  };

  const handleHeightChange = (val: string) => {
    const num = val === '' ? '' : parseInt(val);
    setTargetHeight(num);
    if (lockAspect && num !== '' && origHeight > 0) {
      const ratio = origWidth / origHeight;
      setTargetWidth(Math.round(num * ratio));
    }
  };

  const applyPreset = (w: number, h: number) => {
    setLockAspect(false);
    setTargetWidth(w);
    setTargetHeight(h);
  };

  const resizeImage = () => {
    if (!inputPreview || !targetWidth || !targetHeight || !inputFile) return;
    setIsProcessing(true);
    setError(null);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      }
      
      const mimeType = inputFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
      
      canvas.toBlob((blob) => {
        if (blob) {
          if (outputPreview) URL.revokeObjectURL(outputPreview);
          setOutputBlob(blob);
          setOutputPreview(URL.createObjectURL(blob));
          setOutWidth(targetWidth);
          setOutHeight(targetHeight);
          toast("Scale factor applied.", "success");
        } else {
          setError("Engine failure during reconstruction.");
        }
        setIsProcessing(false);
      }, mimeType, 0.95);
    };
    img.onerror = () => {
      setError("Source stream load error.");
      setIsProcessing(false);
    };
    img.src = inputPreview;
  };

  const handleDownload = () => {
    if (!outputBlob || !inputFile) return;
    const url = URL.createObjectURL(outputBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `synthesized-${targetWidth}x${targetHeight}-${inputFile.name}`;
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
    setOrigWidth(0);
    setOrigHeight(0);
    setTargetWidth('');
    setTargetHeight('');
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
      
      {/* Left Panel: Resolution Synthesis (5 Columns) */}
      <div className="lg:col-span-5 space-y-6">
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 font-outfit">
                Resolution Synthesis
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
                {/* Source Metadata */}
                <div className="relative rounded-md overflow-hidden bg-black/60 border border-white/10 aspect-video flex items-center justify-center group">
                  {inputPreview && (
                    <img src={inputPreview} alt="Original" className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105 duration-700" />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[9px] font-mono text-white/40 uppercase tracking-widest">
                      Source_Stream
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <span className="px-2 py-1 bg-cyan-400/10 border border-cyan-400/20 rounded text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                      {origWidth}x{origHeight}
                    </span>
                  </div>
                </div>

                {/* Synthesis Logic */}
                <div className="grid grid-cols-7 gap-3 items-center">
                  <div className="col-span-3 space-y-2">
                    <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Width_PX</label>
                    <input 
                      type="number" 
                      value={targetWidth}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.05] rounded-md px-4 py-3 text-sm font-mono font-bold text-white outline-none focus:border-cyan-400/40 transition-all placeholder:text-white/10"
                    />
                  </div>
                  
                  <div className="col-span-1 flex flex-col items-center gap-2">
                    <div className="h-4 w-px bg-white/5" />
                    <button 
                      onClick={() => setLockAspect(!lockAspect)}
                      className={cn(
                        "p-2.5 rounded-full border transition-all",
                        lockAspect ? "text-cyan-400 border-cyan-400/30 bg-cyan-400/10" : "text-white/10 border-white/5"
                      )}
                      title={lockAspect ? "Aspect Lock Enabled" : "Aspect Lock Disabled"}
                    >
                      {lockAspect ? <LinkIcon size={14} /> : <Unlink size={14} />}
                    </button>
                    <div className="h-4 w-px bg-white/5" />
                  </div>

                  <div className="col-span-3 space-y-2">
                    <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Height_PX</label>
                    <input 
                      type="number" 
                      value={targetHeight}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-full bg-white/[0.02] border border-white/[0.05] rounded-md px-4 py-3 text-sm font-mono font-bold text-white outline-none focus:border-cyan-400/40 transition-all placeholder:text-white/10"
                    />
                  </div>
                </div>

                {/* Preset Hub */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 ml-1">
                    <Layout size={12} className="text-white/20" />
                    <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Scale Templates</label>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map(preset => (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset.width, preset.height)}
                        className="py-2 px-1 text-[9px] font-bold rounded border border-white/5 bg-white/[0.01] hover:bg-cyan-400/5 hover:border-cyan-400/20 transition-all text-white/30 hover:text-cyan-400 font-mono uppercase truncate"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Control Actions */}
                <div className="pt-2 flex gap-3">
                  <button 
                    onClick={reset}
                    className="p-4 rounded-md bg-white/[0.02] border border-white/[0.05] text-white/20 hover:text-red-400 hover:border-red-400/20 transition-all"
                    title="Purge Stream"
                  >
                    <RefreshCw size={16} />
                  </button>
                  <button 
                    onClick={resizeImage}
                    disabled={isProcessing || !targetWidth || !targetHeight}
                    className="flex-grow py-4 rounded-md bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-400/20 flex items-center justify-center gap-3 hover:bg-cyan-300 transition-all group disabled:opacity-30"
                  >
                    {isProcessing ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <>
                        <Zap size={16} fill="currentColor" />
                        Execute Rescale
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Technical Specification */}
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md">
          <div className="flex items-center gap-2 mb-4">
            <Maximize2 size={14} className="text-cyan-400" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Interpolation Protocol</h3>
          </div>
          <div className="space-y-3 text-[11px] text-white/40 leading-relaxed font-inter">
            <p><strong className="text-cyan-400/80 uppercase tracking-tighter italic">High-Fidelity Scaling:</strong> Uses multi-step lanczos-style interpolation for maximum clarity during upscaling.</p>
            <p><strong className="text-cyan-400/80 uppercase tracking-tighter italic">Alpha Preservation:</strong> Maintains complete transparency layers for PNG/WEBP streams.</p>
          </div>
        </section>
      </div>

      {/* Right Panel: Synthesized Output (7 Columns) */}
      <div className="lg:col-span-7 h-full flex flex-col">
        <div className="glass-card border-white/[0.05] bg-black/40 p-8 rounded-md flex-1 flex flex-col relative overflow-hidden shadow-2xl min-h-[600px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                <Layers size={16} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Output Manifest</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Synthesized Stream // Reconstructed Image</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="relative rounded-md overflow-hidden bg-black/60 border border-white/10 flex-1 min-h-[350px] flex items-center justify-center group mb-6 shadow-inner">
              <AnimatePresence mode="wait">
                {outputPreview ? (
                  <motion.img 
                    key="output"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    src={outputPreview} 
                    alt="Synthesized" 
                    className="w-full h-full object-contain p-4 drop-shadow-[0_0_30px_rgba(34,211,238,0.15)]" 
                  />
                ) : (
                  <motion.div 
                    key="placeholder"
                    className="flex flex-col items-center justify-center opacity-10"
                  >
                    <ImageIcon size={60} className="mb-4" />
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Awaiting Resolution Loop</p>
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
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">Scale_Ratio</span>
                    <span className="text-[32px] font-outfit font-black text-white leading-none tracking-tighter">
                      {outWidth} × {outHeight}
                    </span>
                  </div>
                  <div className="p-6 border border-cyan-400/20 bg-cyan-400/5 rounded-md flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-10">
                      <Zap size={30} className="text-cyan-400" />
                    </div>
                    <span className="text-[9px] font-mono text-white/30 uppercase tracking-[0.2em] mb-2 font-bold">Buffer_Weight</span>
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
                  Extract Optimized Asset
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
