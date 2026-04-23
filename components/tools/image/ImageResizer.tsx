'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Download, RefreshCw, Loader2, Image as ImageIcon, Settings, Link as LinkIcon, Unlink } from 'lucide-react';
import { motion } from 'framer-motion';

const PRESETS = [
  { name: 'HD', width: 1280, height: 720 },
  { name: 'Full HD', width: 1920, height: 1080 },
  { name: '4K', width: 3840, height: 2160 },
  { name: 'Instagram', width: 1080, height: 1080 },
  { name: 'Twitter Banner', width: 1500, height: 500 },
];

export default function ImageResizer() {
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

    const img = new Image();
    img.onload = () => {
      setOrigWidth(img.width);
      setOrigHeight(img.height);
      setTargetWidth(img.width);
      setTargetHeight(img.height);
    };
    img.src = url;
  };

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
      ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      const mimeType = inputFile.type === 'image/png' ? 'image/png' : 'image/jpeg';
      
      canvas.toBlob((blob) => {
        if (blob) {
          setOutputBlob(blob);
          setOutputPreview(URL.createObjectURL(blob));
          setOutWidth(targetWidth);
          setOutHeight(targetHeight);
        } else {
          setError("Failed to resize image.");
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
    link.download = `resized-${inputFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const reset = () => {
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* INPUT PANEL */}
      <div className="glass-card p-6 flex flex-col h-full border border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2 mb-6">
          <Settings className="text-accent-cyan" size={20} />
          <h2 className="text-xl font-syne font-bold">Input & Settings</h2>
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
                  <p className="text-xs text-white/50">Original: {origWidth} × {origHeight}px</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 flex-grow">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Width (px)</label>
                  <input 
                    type="number" 
                    value={targetWidth}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent-cyan/50 transition-colors"
                  />
                </div>
                
                <button 
                  onClick={() => setLockAspect(!lockAspect)}
                  className={`mt-6 p-3 rounded-xl border transition-all ${lockAspect ? 'bg-accent-cyan/20 border-accent-cyan/50 text-accent-cyan' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                  title={lockAspect ? 'Unlock Aspect Ratio' : 'Lock Aspect Ratio'}
                >
                  {lockAspect ? <LinkIcon size={20} /> : <Unlink size={20} />}
                </button>

                <div className="flex-1 space-y-2">
                  <label className="text-xs font-medium text-white/70 uppercase tracking-wider">Height (px)</label>
                  <input 
                    type="number" 
                    value={targetHeight}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent-cyan/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-white/70 uppercase tracking-wider mb-2 block">Presets</label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map(preset => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset.width, preset.height)}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-white/80"
                    >
                      {preset.name} ({preset.width}×{preset.height})
                    </button>
                  ))}
                </div>
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
                onClick={resizeImage}
                disabled={isProcessing || !targetWidth || !targetHeight}
                className="flex-grow py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-blue text-white font-bold hover:shadow-[0_0_20px_rgba(45,212,191,0.4)] transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Resizing...
                  </>
                ) : (
                  'Resize Image'
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
            <p className="text-white/30 text-sm">Your resized image will appear here</p>
          </div>
        ) : (
          <div className="space-y-6 flex-grow flex flex-col">
            <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 aspect-video flex-shrink-0 flex items-center justify-center bg-[url('/checkered.png')] bg-repeat">
              {outputPreview && (
                <img src={outputPreview} alt="Resized" className="w-full h-full object-contain bg-white/5" />
              )}
            </div>

            <div className="glass-card p-6 border border-accent-pink/20 bg-accent-pink/5 rounded-2xl flex-grow flex flex-col items-center justify-center space-y-4">
              <div className="text-center">
                <p className="text-sm text-white/50 uppercase tracking-widest mb-1">New Dimensions</p>
                <div className="text-2xl font-syne font-bold text-accent-pink">
                  {outWidth} × {outHeight}px
                </div>
              </div>
              
              <div className="text-center mt-2">
                <p className="text-sm text-white/50 uppercase tracking-widest mb-1">Estimated Size</p>
                <div className="text-lg font-medium text-white/80">
                  {formatBytes(outputBlob.size)}
                </div>
              </div>
            </div>

            <button 
              onClick={handleDownload}
              className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2 text-lg mt-auto"
            >
              <Download size={20} />
              Download Resized Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
