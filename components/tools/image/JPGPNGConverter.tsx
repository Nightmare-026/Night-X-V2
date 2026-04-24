'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Download, RefreshCw, Loader2, Image as ImageIcon, Settings, FileType } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        setError("Please drop a valid image file.");
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
    
    // Auto-detect a good target format
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
      
      // If converting to JPEG, draw white background first (PNG/WEBP might have transparency)
      if (targetFormat === 'image/jpeg') {
        ctx!.fillStyle = '#FFFFFF';
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx?.drawImage(img, 0, 0);
      
      const outputQuality = targetFormat === 'image/png' ? undefined : quality;
      
      canvas.toBlob((blob) => {
        if (blob) {
          if (outputPreview) URL.revokeObjectURL(outputPreview);
          setOutputBlob(blob);
          setOutputPreview(URL.createObjectURL(blob));
        } else {
          setError("Failed to convert image format.");
        }
        setIsProcessing(false);
      }, targetFormat, outputQuality);
    };
    img.onerror = () => {
      setError("Failed to load image for conversion.");
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
    link.download = `${inputFile.name.split('.')[0]}-converted.${ext}`;
    
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

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (inputPreview) URL.revokeObjectURL(inputPreview);
      if (outputPreview) URL.revokeObjectURL(outputPreview);
    };
  }, [inputPreview, outputPreview]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* INPUT PANEL */}
      <div className="glass-card p-6 flex flex-col h-full border border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="text-accent-cyan" size={20} />
          <h2 className="text-xl font-syne font-bold">Input & Format</h2>
        </div>

        {!inputFile ? (
          <div 
            className="flex-grow flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 hover:border-accent-cyan/50 rounded-2xl transition-all group bg-white/[0.01]"
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
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 mb-4 group-hover:scale-110 group-hover:text-accent-cyan transition-all">
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
                  <p className="text-xs text-white/50">{getFormatLabel(inputFile.type)} • {formatBytes(inputFile.size)}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6 flex-grow">
              <div className="space-y-3">
                <label className="text-xs font-medium text-white/70 uppercase tracking-wider block">Target Format</label>
                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                  {(['image/png', 'image/jpeg', 'image/webp'] as const).map(fmt => (
                    <button 
                      key={fmt}
                      onClick={() => setTargetFormat(fmt)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                        targetFormat === fmt ? 'bg-white text-black shadow-lg' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      {getFormatLabel(fmt)}
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {targetFormat !== 'image/png' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <div className="flex justify-between items-center mt-2">
                      <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Quality: {Math.round(quality * 100)}%</label>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.05" 
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full accent-accent-cyan"
                    />
                  </motion.div>
                )}
                
                {targetFormat === 'image/png' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 text-xs text-accent-cyan flex items-start gap-2 mt-2"
                  >
                    <FileType size={14} className="mt-0.5 flex-shrink-0" />
                    <p>PNG format preserves transparency but usually results in larger file sizes. Quality is always 100%.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                onClick={reset}
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
                title="Reset"
              >
                <RefreshCw size={20} />
              </button>
              <button 
                onClick={convertImage}
                disabled={isProcessing}
                className="flex-grow py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-bold hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>Convert to {getFormatLabel(targetFormat)}</>
                )}
              </button>
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          </div>
        )}
      </div>

      {/* OUTPUT PANEL */}
      <div className="glass-card p-6 flex flex-col h-full border border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-6">
          <ImageIcon className="text-accent-pink" size={20} />
          <h2 className="text-xl font-syne font-bold">Output</h2>
        </div>

        {!outputBlob ? (
          <div className="flex-grow flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
            <p className="text-white/30 text-sm">Your converted image will appear here</p>
          </div>
        ) : (
          <div className="space-y-6 flex-grow flex flex-col">
            <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 aspect-video flex-shrink-0 flex items-center justify-center bg-[url('/checkered.png')] bg-repeat">
              {outputPreview && (
                <img src={outputPreview} alt="Converted" className="w-full h-full object-contain bg-white/5" />
              )}
            </div>

            <div className="glass-card p-6 border border-accent-pink/20 bg-accent-pink/5 rounded-2xl flex-grow flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <p className="text-sm text-white/50 uppercase tracking-widest mb-2">Conversion Result</p>
                <div className="flex items-center justify-center gap-4 text-xl font-bold font-syne">
                  <span className="text-white/60">{getFormatLabel(inputFile!.type)}</span>
                  <span className="text-accent-pink">→</span>
                  <span className="text-white">{getFormatLabel(targetFormat)}</span>
                </div>
              </div>
              
              <div className="text-center mt-2 flex items-center gap-4 text-sm text-white/60">
                <span>Original: {formatBytes(inputFile!.size)}</span>
                <span>•</span>
                <span className="text-white font-medium">New: {formatBytes(outputBlob.size)}</span>
              </div>
            </div>

            <button 
              onClick={handleDownload}
              className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2 text-lg mt-auto"
            >
              <Download size={20} />
              Download {getFormatLabel(targetFormat)} Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
