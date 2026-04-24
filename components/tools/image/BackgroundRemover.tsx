'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { Upload, Download, RefreshCw, Loader2, Image as ImageIcon, Settings, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      const texts = ['Loading AI model...', 'Processing image...', 'Detecting subject...', 'Removing background...', 'Refining edges...'];
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
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
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
        setError("Please drop a valid image file.");
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
      setError(err.message || 'Failed to process image. Make sure the image has a clear subject.');
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
        link.download = `white-bg-${inputFile.name.split('.')[0]}.png`;
        link.click();
      };
      img.src = outputPreview;
    } else {
      const link = document.createElement('a');
      link.href = outputPreview;
      link.download = `no-bg-${inputFile.name.split('.')[0]}.png`;
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

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (inputPreview) URL.revokeObjectURL(inputPreview);
      if (outputPreview) URL.revokeObjectURL(outputPreview);
    };
  }, [inputPreview, outputPreview]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 rounded-2xl bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center border border-accent-purple/20"
          >
            <div className="w-24 h-24 mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
              <div className="absolute inset-0 rounded-full border-4 border-accent-purple border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-accent-purple">
                <Sparkles size={32} />
              </div>
            </div>
            <h3 className="text-2xl font-syne font-bold text-white mb-2">AI Magic in Progress</h3>
            <p className="text-white/60">{progressText}</p>
            
            <div className="mt-8 bg-accent-purple/10 border border-accent-purple/20 px-6 py-3 rounded-xl flex items-center gap-3 text-accent-purple/80 text-sm max-w-sm text-center">
              <AlertTriangle size={16} className="flex-shrink-0" />
              <p>This process runs entirely in your browser. No images are uploaded to our servers.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* INPUT PANEL */}
      <div className="glass-card p-6 flex flex-col h-full border border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="text-accent-cyan" size={20} />
          <h2 className="text-xl font-syne font-bold">Input</h2>
        </div>

        {!inputFile ? (
          <div 
            className="flex-grow flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 hover:border-accent-purple/50 rounded-2xl transition-all group bg-white/[0.01]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileChange}
              title=""
            />
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 mb-4 group-hover:scale-110 group-hover:text-accent-purple transition-all">
              <Upload size={32} />
            </div>
            <p className="text-lg font-medium text-center">Drag & drop your image here</p>
            <p className="text-sm text-white/40 mt-2">or click to browse</p>
          </div>
        ) : (
          <div className="space-y-6 flex-grow flex flex-col">
            <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 aspect-video flex-shrink-0 flex items-center justify-center">
              {inputPreview && (
                <img src={inputPreview} alt="Original" className="w-full h-full object-contain" />
              )}
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
              <div className="flex items-center gap-3 overflow-hidden">
                <ImageIcon className="text-white/40 flex-shrink-0" size={20} />
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{inputFile.name}</p>
                  <p className="text-xs text-white/50">{formatBytes(inputFile.size)}</p>
                </div>
              </div>
            </div>

            <div className="flex-grow flex flex-col justify-end">
              <div className="pt-4 flex gap-4">
                <button 
                  onClick={reset}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
                  title="Reset"
                >
                  <RefreshCw size={20} />
                </button>
                <button 
                  onClick={removeBg}
                  disabled={isProcessing}
                  className="flex-grow py-3 rounded-xl bg-gradient-to-r from-accent-purple to-accent-pink text-white font-bold hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Sparkles size={18} />
                  Remove Background
                </button>
              </div>
              {error && <p className="text-red-400 text-sm text-center mt-3">{error}</p>}
            </div>
          </div>
        )}
      </div>

      {/* OUTPUT PANEL */}
      <div className="glass-card p-6 flex flex-col h-full border border-white/10 bg-white/[0.02]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent-purple" size={20} />
            <h2 className="text-xl font-syne font-bold">Output</h2>
          </div>
          
          {outputPreview && (
            <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
              <button 
                onClick={() => setPreviewBg('transparent')}
                className={`px-3 py-1 text-xs font-bold rounded transition-all ${previewBg === 'transparent' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}
              >
                Transp.
              </button>
              <button 
                onClick={() => setPreviewBg('white')}
                className={`px-3 py-1 text-xs font-bold rounded transition-all ${previewBg === 'white' ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white'}`}
              >
                White
              </button>
            </div>
          )}
        </div>

        {!outputBlob ? (
          <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <p className="text-white/30 text-sm">Your AI processed image will appear here</p>
          </div>
        ) : (
          <div className="space-y-6 flex-grow flex flex-col">
            <div className={`relative rounded-2xl overflow-hidden border border-white/10 aspect-video flex-shrink-0 flex items-center justify-center ${previewBg === 'transparent' ? "checkerboard" : "bg-white"}`}>
              {outputPreview && (
                <img src={outputPreview} alt="No Background" className="w-full h-full object-contain" />
              )}
            </div>

            <div className="glass-card p-6 border border-accent-purple/20 bg-accent-purple/5 rounded-2xl flex-grow flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-accent-purple/20 flex items-center justify-center text-accent-purple mb-2">
                <Sparkles size={32} />
              </div>
              <div className="text-center">
                <h3 className="text-xl font-syne font-bold text-white mb-1">Background Removed!</h3>
                <p className="text-sm text-white/60">Your image is ready to download.</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-auto">
              <button 
                onClick={() => handleDownload(false)}
                className="w-full py-3 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Download size={18} />
                Download Transparent PNG
              </button>
              <button 
                onClick={() => handleDownload(true)}
                className="w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 border border-white/10 transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Download size={18} />
                Download with White Background
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
