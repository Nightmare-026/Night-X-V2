'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { 
  Upload, 
  Download, 
  RefreshCw, 
  Loader2, 
  Image as ImageIcon, 
  Settings, 
  Sparkles, 
  AlertTriangle,
  Zap,
  ChevronRight,
  Maximize2,
  Trash2,
  Monitor,
  Cpu,
  Layers
, Check} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function BackgroundRemover() {
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  
  const [outputBlob, setOutputBlob] = useState<Blob | null>(null);
  const [outputPreview, setOutputPreview] = useState<string | null>(null);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [previewBg, setPreviewBg] = useState<'transparent' | 'white'>('transparent');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      const texts = ['Initializing AI...', 'Warming Model...', 'Segmenting Pixels...', 'Removing Background...', 'Refining Edges...'];
      let i = 0;
      setProgressText(texts[0]);
      interval = setInterval(() => {
        i = (i + 1) % texts.length;
        setProgressText(texts[i]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        setError("Invalid format. Please use image files.");
      }
    }
  }, []);

  const processFile = (file: File) => {
    setInputFile(file);
    const url = URL.createObjectURL(file);
    setInputPreview(url);
    setOutputBlob(null);
    setOutputPreview(null);
    setError(null);
  };

  const removeBg = async () => {
    if (!inputFile) return;

    try {
      setIsProcessing(true);
      setError(null);
      
      const blob = await removeBackground(inputFile, {
        progress: (key, current, total) => {
          console.log(`Background removal progress: ${key} ${current}/${total}`);
        },
        model: 'isnet_fp16',
      });

      setOutputBlob(blob);
      setOutputPreview(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process image. Make sure the subject is clear.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (withWhiteBg = false) => {
    if (!outputPreview || !inputFile) return;
    
    if (withWhiteBg) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.fillStyle = '#FFFFFF';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
        ctx!.drawImage(img, 0, 0);
        
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `cleared-${inputFile.name.split('.')[0]}-white.png`;
        link.click();
      };
      img.src = outputPreview;
    } else {
      const link = document.createElement('a');
      link.href = outputPreview;
      link.download = `cleared-${inputFile.name.split('.')[0]}.png`;
      link.click();
    }
  };

  const reset = useCallback(() => {
    if (inputPreview) URL.revokeObjectURL(inputPreview);
    if (outputPreview) URL.revokeObjectURL(outputPreview);
    setInputFile(null);
    setInputPreview(null);
    setOutputBlob(null);
    setOutputPreview(null);
    setError(null);
  }, [inputPreview, outputPreview]);

  useEffect(() => {
    return () => {
      if (inputPreview) URL.revokeObjectURL(inputPreview);
      if (outputPreview) URL.revokeObjectURL(outputPreview);
    };
  }, [inputPreview, outputPreview]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
      {/* Processing Overlay Scoped to Grid */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 rounded-md bg-black/80 backdrop-blur-md flex flex-col items-center justify-center border border-cyan-400/20"
          >
            <div className="w-24 h-24 mb-8 relative">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/10" />
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                <Sparkles size={32} />
              </div>
            </div>
            <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-[0.3em] mb-3">AI Synthesis</h3>
            <p className="text-[10px] font-mono text-cyan-400/60 uppercase tracking-widest animate-pulse">{progressText}</p>
            
            <div className="mt-12 bg-cyan-400/5 border border-cyan-400/20 px-6 py-4 rounded-md flex items-center gap-3 text-cyan-400/80 text-[10px] max-w-sm text-center uppercase tracking-widest font-mono">
              <Monitor size={14} className="flex-shrink-0" />
              <p>Edge Isolation Active // Local GPU Acceleration</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Panel: Semantic Decomposition (5 Columns) */}
      <div className="lg:col-span-5 space-y-6">
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 font-outfit">
                Semantic Decomposition
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
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">Drag image here</p>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter italic">or click to initiate sequence</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Source Preview */}
                <div className="relative rounded-md overflow-hidden bg-black/60 border border-white/10 aspect-[4/3] flex items-center justify-center group">
                  {inputPreview && (
                    <img src={inputPreview} alt="Original" className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity" />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[9px] font-mono text-white/40 uppercase tracking-widest">
                      Source_Stream
                    </span>
                  </div>
                </div>

                {/* File Metadata */}
                <div className="flex items-center justify-between p-4 rounded-md bg-white/[0.02] border border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    <ImageIcon className="text-cyan-400" size={16} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-white/80 truncate uppercase tracking-widest">{inputFile.name}</p>
                      <p className="text-[9px] font-mono text-white/30">{formatBytes(inputFile.size)} // {inputFile.type.split('/')[1].toUpperCase()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={reset}
                    className="p-2 rounded bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Action Trigger */}
                <button 
                  onClick={removeBg}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-md bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-400/20 flex items-center justify-center gap-3 hover:bg-cyan-300 transition-all group disabled:opacity-30"
                >
                  <Zap size={16} fill="currentColor" />
                  Decompose Background
                  <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Intelligence Module */}
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={14} className="text-cyan-400" />
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Processing Core</h3>
          </div>
          <div className="space-y-3 text-[11px] text-white/40 leading-relaxed font-inter">
            <p><strong className="text-cyan-400/80 uppercase tracking-tighter">Client Isolation:</strong> The AI model executes entirely within your browser sandbox. Your data never leaves your environment.</p>
            <p><strong className="text-cyan-400/80 uppercase tracking-tighter">Edge Detection:</strong> Uses ISNet Neural Architecture for pixel-perfect subject isolation and edge feathering.</p>
          </div>
        </section>
      </div>

      {/* Right Panel: Refined Synthetic Output (7 Columns) */}
      <div className="lg:col-span-7">
        <div className="glass-card border-white/[0.05] bg-black/40 p-8 rounded-md min-h-[600px] flex flex-col relative overflow-hidden h-full">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                <Maximize2 size={16} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Refined Output</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Synthetic Reconstitution // Neural Buffer</p>
              </div>
            </div>
            
            {outputPreview && (
              <div className="flex bg-white/5 p-1 rounded border border-white/10">
                <button 
                  onClick={() => setPreviewBg('transparent')}
                  className={cn(
                    "px-3 py-1 text-[9px] font-bold rounded uppercase tracking-widest transition-all",
                    previewBg === 'transparent' ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/20" : "text-white/40 hover:text-white"
                  )}
                >
                  Alpha
                </button>
                <button 
                  onClick={() => setPreviewBg('white')}
                  className={cn(
                    "px-3 py-1 text-[9px] font-bold rounded uppercase tracking-widest transition-all",
                    previewBg === 'white' ? "bg-white text-black" : "text-white/40 hover:text-white"
                  )}
                >
                  White
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col space-y-6">
            <div className={cn(
              "relative rounded-md overflow-hidden border border-white/10 aspect-video flex items-center justify-center transition-all",
              previewBg === 'transparent' ? "checkerboard bg-black/20" : "bg-white"
            )}>
              {outputPreview ? (
                <motion.img 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  src={outputPreview} 
                  alt="Synthetic Output" 
                  className="w-full h-full object-contain p-4 drop-shadow-2xl" 
                />
              ) : (
                <div className="flex flex-col items-center justify-center opacity-10">
                  <Cpu size={60} className="mb-4" />
                  <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Awaiting Reconstitution</p>
                </div>
              )}
            </div>

            {outputBlob && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4 pt-4 mt-auto"
              >
                <div className="p-6 border border-cyan-400/20 bg-cyan-400/5 rounded-md flex items-center gap-6">
                  <div className="h-12 w-12 rounded-full bg-cyan-400/20 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <Check size={24} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-1">Isolation Complete</h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">Neural network has processed {inputFile?.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleDownload(false)}
                    className="py-4 rounded-md bg-white text-black font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-50 transition-all flex items-center justify-center gap-3"
                  >
                    <Download size={14} />
                    Export Transparent
                  </button>
                  <button 
                    onClick={() => handleDownload(true)}
                    className="py-4 rounded-md bg-white/5 border border-white/10 text-white font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
                  >
                    <Download size={14} />
                    Export White BG
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .checkerboard {
          background-image: linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%);
          background-size: 20px 20px;
          background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
        }
      `}</style>
    </div>
  );
}

