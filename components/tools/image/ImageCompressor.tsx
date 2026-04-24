'use client';

import React, { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, Download, RefreshCw, Loader2, Image as ImageIcon, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (inputPreview) URL.revokeObjectURL(inputPreview);
      if (outputPreview) URL.revokeObjectURL(outputPreview);

      setInputFile(file);
      setInputPreview(URL.createObjectURL(file));
      setOutputBlob(null);
      setOutputPreview(null);
      setError(null);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        if (inputPreview) URL.revokeObjectURL(inputPreview);
        if (outputPreview) URL.revokeObjectURL(outputPreview);

        setInputFile(file);
        setInputPreview(URL.createObjectURL(file));
        setOutputBlob(null);
        setOutputPreview(null);
        setError(null);
      } else {
        setError("Please drop a valid image file.");
      }
    }
  }, [inputPreview, outputPreview]);

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
    link.download = `compressed-${inputFile.name}`;
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

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (inputPreview) URL.revokeObjectURL(inputPreview);
      if (outputPreview) URL.revokeObjectURL(outputPreview);
    };
  }, [inputPreview, outputPreview]);

  const savingsPercentage = outputBlob && inputFile 
    ? Math.round(((inputFile.size - outputBlob.size) / inputFile.size) * 100) 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* INPUT PANEL */}
      <div className="glass-card p-6 flex flex-col h-full border border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="text-accent-cyan" size={20} />
          <h2 className="text-xl font-syne font-bold">Input</h2>
        </div>

        {!inputFile ? (
          <div 
            className="flex-grow flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 hover:border-accent-cyan/50 rounded-2xl transition-all group bg-white/[0.01]"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept="image/jpeg, image/png, image/webp" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleFileChange}
              title=""
            />
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 mb-4 group-hover:scale-110 group-hover:text-accent-cyan transition-all">
              <Upload size={32} />
            </div>
            <p className="text-lg font-medium text-center">Drag & drop your image here</p>
            <p className="text-sm text-white/40 mt-2">or click to browse</p>
            <p className="text-xs text-white/30 mt-6">Supports JPG, PNG, WEBP</p>
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

            <div className="space-y-6 flex-grow">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-white/70">Quality: {Math.round(quality * 100)}%</label>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.1" 
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full accent-accent-cyan"
                />
                <div className="flex justify-between text-xs text-white/30 uppercase tracking-widest">
                  <span>Smallest Size</span>
                  <span>Best Quality</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-white/70">Max Width (optional)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 1920" 
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-white/20"
                />
              </div>
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
                onClick={compressImage}
                disabled={isProcessing}
                className="flex-grow py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-bold hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Compressing...
                  </>
                ) : (
                  'Compress Image'
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
            <p className="text-white/30 text-sm">Your compressed image will appear here</p>
          </div>
        ) : (
          <div className="space-y-6 flex-grow flex flex-col">
            <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 aspect-video flex-shrink-0 flex items-center justify-center">
              {outputPreview && (
                <img src={outputPreview} alt="Compressed" className="w-full h-full object-contain" />
              )}
            </div>

            <div className="glass-card p-6 border border-accent-pink/20 bg-accent-pink/5 rounded-2xl flex-grow flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <p className="text-sm text-white/50 uppercase tracking-widest mb-1">Compression Result</p>
                <div className="flex items-center justify-center gap-3 text-lg font-medium">
                  <span className="text-white/60 line-through">{formatBytes(inputFile!.size)}</span>
                  <span className="text-white/40">→</span>
                  <span className="text-green-400 font-bold">{formatBytes(outputBlob.size)}</span>
                </div>
              </div>

              {savingsPercentage > 0 && (
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-syne font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-purple"
                  >
                    Saved {savingsPercentage}%
                  </motion.div>
                </div>
              )}
            </div>

            <button 
              onClick={handleDownload}
              className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2 text-lg mt-auto"
            >
              <Download size={20} />
              Download Compressed Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
