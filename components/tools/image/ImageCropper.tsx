'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import ReactCrop, { 
  centerCrop, 
  makeAspectCrop, 
  Crop, 
  PixelCrop,
  convertToPixelCrop
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Upload, Download, RefreshCw, Loader2, Crop as CropIcon, Image as ImageIcon, Maximize, Move } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = [
  { label: 'Free', aspect: undefined },
  { label: '1:1', aspect: 1 },
  { label: '4:3', aspect: 4 / 3 },
  { label: '16:9', aspect: 16 / 9 },
  { label: '3:2', aspect: 3 / 2 },
  { label: '9:16', aspect: 9 / 16 },
];

export default function ImageCropper() {
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [imgName, setImgName] = useState('image.png');
  
  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImgName(file.name);
      setCrop(undefined); // Reset crop on new image
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(file);
      setOutputUrl(null);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    
    // Initial crop: center 80%
    const initialCrop = centerCrop(
      makeAspectCrop(
        { unit: '%', width: 80 },
        aspect || 1, // Default aspect if undefined
        width,
        height
      ),
      width,
      height
    );
    
    setCrop(initialCrop);
  };

  const handlePresetClick = (newAspect: number | undefined) => {
    setAspect(newAspect);
    if (imgRef.current && newAspect) {
      const { width, height } = imgRef.current;
      const newCrop = centerCrop(
        makeAspectCrop(
          { unit: '%', width: 80 },
          newAspect,
          width,
          height
        ),
        width,
        height
      );
      setCrop(newCrop);
      // Need to trigger completed crop update
      setCompletedCrop(convertToPixelCrop(newCrop, width, height));
    } else if (!newAspect) {
      // For free crop, we keep the current selection but unlock aspect
      setCrop(prev => prev ? { ...prev, aspect: undefined } : undefined);
    }
  };

  const generateCrop = async () => {
    if (!completedCrop || !imgRef.current) return;

    setIsProcessing(true);
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsProcessing(false);
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;

    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const base64Image = canvas.toDataURL('image/png');
    setOutputUrl(base64Image);
    setIsProcessing(false);
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const link = document.createElement('a');
    link.download = `cropped-${imgName}`;
    link.href = outputUrl;
    link.click();
  };

  const handleReset = () => {
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setOutputUrl(null);
  };

  return (
    <div className="space-y-8">
      <AnimatePresence mode="wait">
        {!imgSrc ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onClick={() => inputRef.current?.click()}
            className="glass-card rounded-3xl border-2 border-dashed border-white/10 hover:border-violet-500/50 p-12 flex flex-col items-center justify-center gap-6 cursor-pointer transition-all group min-h-[400px]"
          >
            <div className="w-20 h-20 rounded-2xl bg-violet-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="text-violet-400" size={32} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-syne font-bold text-white">Upload Image to Crop</h3>
              <p className="text-white/40 text-sm max-w-xs">
                Supports JPG, PNG, WEBP. All processing happens locally in your browser.
              </p>
            </div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onSelectFile}
              className="hidden"
            />
          </motion.div>
        ) : (
          <motion.div
            key="editor"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Editor Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden bg-black/40 flex items-center justify-center min-h-[400px] relative">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  className="max-h-[600px]"
                >
                  <img
                    ref={imgRef}
                    src={imgSrc}
                    alt="Source"
                    onLoad={onImageLoad}
                    className="max-w-full max-h-[600px] object-contain"
                  />
                </ReactCrop>
              </div>

              {/* Crop Info */}
              <div className="flex items-center justify-between px-2 text-xs font-mono text-white/40">
                <div className="flex gap-4">
                  <span>X: {Math.round(completedCrop?.x || 0)}px</span>
                  <span>Y: {Math.round(completedCrop?.y || 0)}px</span>
                </div>
                <div className="text-violet-400 font-bold">
                  Crop Area: {Math.round(completedCrop?.width || 0)} × {Math.round(completedCrop?.height || 0)}px
                </div>
              </div>
            </div>

            {/* Controls Sidebar */}
            <div className="space-y-6">
              <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-syne font-bold text-white/60 uppercase tracking-wider flex items-center gap-2">
                    <Maximize size={14} />
                    Aspect Ratio
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESETS.map((p) => (
                      <button
                        key={p.label}
                        onClick={() => handlePresetClick(p.aspect)}
                        className={`py-2 rounded-xl text-xs font-medium transition-all border ${
                          aspect === p.aspect
                            ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-500/20'
                            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:border-white/20'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 space-y-3">
                  <button
                    onClick={generateCrop}
                    disabled={isProcessing || !completedCrop}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-violet-900/20"
                  >
                    {isProcessing ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <CropIcon size={20} />
                    )}
                    Apply Crop
                  </button>

                  <button
                    onClick={handleReset}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 text-sm font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={14} />
                    Reset Image
                  </button>
                </div>
              </div>

              {/* Preview Box */}
              <AnimatePresence>
                {outputUrl && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card rounded-2xl border border-emerald-500/20 p-6 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-syne font-bold text-emerald-400 uppercase tracking-wider">Preview</h4>
                      <div className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                        PNG
                      </div>
                    </div>
                    <div className="rounded-lg overflow-hidden border border-white/5 bg-black/20 aspect-square flex items-center justify-center">
                      <img src={outputUrl} alt="Cropped Result" className="max-w-full max-h-full object-contain" />
                    </div>
                    <button
                      onClick={handleDownload}
                      className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20"
                    >
                      <Download size={18} />
                      Download Result
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
