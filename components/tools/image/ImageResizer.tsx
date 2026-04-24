import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, RefreshCw, Loader2, Image as ImageIcon, Settings, Link as LinkIcon, Unlink, FileImage, AlertCircle, CheckCircle2 } from 'lucide-react';
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
      toast("Please upload a valid image file.", "error");
      return;
    }
    
    // Cleanup old URLs
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
      toast("Image uploaded successfully!", "success");
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
  }, [inputPreview, outputPreview]); // Added dependencies

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
    toast(`Preset applied: ${w}x${h}`, "info");
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
      ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      const mimeType = inputFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
      
      canvas.toBlob((blob) => {
        if (blob) {
          if (outputPreview) URL.revokeObjectURL(outputPreview);
          setOutputBlob(blob);
          setOutputPreview(URL.createObjectURL(blob));
          setOutWidth(targetWidth);
          setOutHeight(targetHeight);
          toast("Image resized successfully!", "success");
        } else {
          setError("Failed to resize image.");
          toast("Resize failed.", "error");
        }
        setIsProcessing(false);
      }, mimeType, 0.95);
    };
    img.onerror = () => {
      setError("Failed to load image for resizing.");
      setIsProcessing(false);
    };
    img.src = inputPreview;
  };

  const handleDownload = () => {
    if (!outputBlob || !inputFile) return;
    const url = URL.createObjectURL(outputBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nightx-resized-${inputFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast("Download started!", "success");
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
    toast("Reset complete", "info");
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (inputPreview) URL.revokeObjectURL(inputPreview);
      if (outputPreview) URL.revokeObjectURL(outputPreview);
    };
  }, [inputPreview, outputPreview]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* INPUT PANEL */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-6 flex flex-col border border-white/10 bg-white/[0.02] shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-cyan/20 text-accent-cyan">
              <Settings size={20} />
            </div>
            <h2 className="text-xl font-syne font-bold tracking-tight">Configuration</h2>
          </div>
          {inputFile && (
            <button 
              onClick={reset}
              className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-red-400 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} /> Clear
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {!inputFile ? (
            <motion.div 
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative group"
            >
              <div 
                className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 group-hover:border-accent-cyan/50 rounded-3xl transition-all bg-white/[0.01] hover:bg-accent-cyan/[0.02] cursor-pointer"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 mb-6 group-hover:text-accent-cyan group-hover:bg-accent-cyan/10 transition-all shadow-xl"
                >
                  <Upload size={36} />
                </motion.div>
                <p className="text-xl font-syne font-bold text-center mb-2">Drop your image here</p>
                <p className="text-sm text-white/40 text-center">Supports PNG, JPG, WebP up to 10MB</p>
                
                <div className="mt-8 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/60 group-hover:text-white transition-colors">
                  <FileImage size={14} />
                  <span>Click to browse files</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 aspect-video flex items-center justify-center group shadow-inner">
                {inputPreview && (
                  <img src={inputPreview} alt="Original" className="w-full h-full object-contain" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                   <p className="text-xs text-white/70 font-medium">Original Resolution: {origWidth} × {origHeight}px</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
                <div className="md:col-span-3 space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Width (px)</label>
                  <input 
                    type="number" 
                    value={targetWidth}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    placeholder="Auto"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-accent-cyan focus:ring-4 focus:ring-accent-cyan/10 transition-all"
                  />
                </div>
                
                <div className="md:col-span-1 flex justify-center pb-2">
                  <button 
                    onClick={() => setLockAspect(!lockAspect)}
                    className={cn(
                      "p-3 rounded-xl border transition-all",
                      lockAspect 
                        ? "bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan" 
                        : "bg-white/5 border-white/10 text-white/20 hover:text-white"
                    )}
                    title={lockAspect ? 'Unlock Aspect Ratio' : 'Lock Aspect Ratio'}
                  >
                    {lockAspect ? <LinkIcon size={18} /> : <Unlink size={18} />}
                  </button>
                </div>

                <div className="md:col-span-3 space-y-2">
                  <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Height (px)</label>
                  <input 
                    type="number" 
                    value={targetHeight}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    placeholder="Auto"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:border-accent-cyan focus:ring-4 focus:ring-accent-cyan/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-4 block ml-1">Popular Presets</label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset.width, preset.height)}
                      className="px-4 py-2 text-xs font-bold rounded-xl bg-white/5 border border-white/10 hover:bg-accent-cyan/10 hover:border-accent-cyan/30 hover:text-accent-cyan transition-all"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  onClick={resizeImage}
                  disabled={isProcessing || !targetWidth || !targetHeight}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-black uppercase tracking-widest hover:shadow-[0_0_30px_rgba(45,212,191,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-sm shadow-xl"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Processing Engine...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={18} />
                      Generate Resized Output
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400"
            >
              <AlertCircle size={18} />
              <p className="text-xs font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* OUTPUT PANEL */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="glass-card p-6 flex flex-col border border-white/10 bg-white/[0.02] shadow-2xl lg:min-h-[600px]"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-accent-pink/20 text-accent-pink">
            <Download size={20} />
          </div>
          <h2 className="text-xl font-syne font-bold tracking-tight">Output Result</h2>
        </div>

        <AnimatePresence mode="wait">
          {!outputBlob ? (
            <motion.div 
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01] p-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/10 mb-4">
                <ImageIcon size={32} />
              </div>
              <p className="text-white/30 text-sm font-medium">Resized version will appear here<br/>after you click generate.</p>
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 flex-grow flex flex-col"
            >
              <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 aspect-video flex items-center justify-center checkerboard group shadow-inner">
                {outputPreview && (
                  <img src={outputPreview} alt="Resized" className="w-full h-full object-contain shadow-2xl" />
                )}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-accent-pink text-[10px] font-black uppercase tracking-wider text-white shadow-lg">
                  Processed
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-5 border border-white/5 bg-white/5 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Final Dimensions</p>
                  <p className="text-lg font-syne font-bold text-white">
                    {outWidth} × {outHeight}
                  </p>
                </div>
                
                <div className="glass-card p-5 border border-white/5 bg-white/5 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">File Size</p>
                  <p className="text-lg font-syne font-bold text-accent-pink">
                    {formatBytes(outputBlob.size)}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-6 space-y-4">
                <div className="p-4 rounded-xl bg-accent-pink/10 border border-accent-pink/20 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent-pink/20 text-accent-pink">
                    <CheckCircle2 size={16} />
                  </div>
                  <p className="text-xs text-accent-pink/80 font-medium">Optimization complete. The output is ready for download.</p>
                </div>
                
                <button 
                  onClick={handleDownload}
                  className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-accent-cyan hover:text-white transition-all shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] text-sm"
                >
                  <Download size={20} />
                  Download Assets
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
