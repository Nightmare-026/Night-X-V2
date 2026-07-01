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
import { 
  Upload, 
  Download, 
  RefreshCw, 
  Loader2, 
  Crop as CropIcon, 
  Image as ImageIcon, 
  Maximize2, 
  Zap, 
  ChevronRight,
  Maximize,
  Layers,
  Layout,
  Move
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const PRESETS = [
  { label: 'FREEFORM', aspect: undefined },
  { label: '1:1 SQUARE', aspect: 1 },
  { label: '4:3 TRADITIONAL', aspect: 4 / 3 },
  { label: '16:9 CINEMATIC', aspect: 16 / 9 },
  { label: '3:2 CLASSIC', aspect: 3 / 2 },
  { label: '9:16 VERTICAL', aspect: 9 / 16 },
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
      setCrop(undefined);
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(file);
      setOutputUrl(null);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const initialCrop = centerCrop(
      makeAspectCrop(
        { unit: '%', width: 80 },
        aspect || 1,
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
      setCompletedCrop(convertToPixelCrop(newCrop, width, height));
    } else if (!newAspect) {
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

    canvas.toBlob((blob) => {
      if (blob) {
        if (outputUrl) URL.revokeObjectURL(outputUrl);
        const url = URL.createObjectURL(blob);
        setOutputUrl(url);
      }
      setIsProcessing(false);
    }, 'image/png');
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    const link = document.createElement('a');
    link.download = `cropped-${imgName}`;
    link.href = outputUrl;
    link.click();
  };

  const handleReset = () => {
    if (outputUrl) URL.revokeObjectURL(outputUrl);
    setImgSrc('');
    setCrop(undefined);
    setCompletedCrop(undefined);
    setOutputUrl(null);
  };

  useEffect(() => {
    return () => {
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [outputUrl]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
      
      {/* Left Panel: Spatial Synthesis (5 Columns) */}
      <div className="lg:col-span-5 space-y-6">
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md relative overflow-hidden h-full flex flex-col min-h-[600px]">
          <div className="relative z-10 flex-1 flex flex-col space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 font-outfit">
                  Spatial Synthesis
                </h2>
              </div>
              {imgSrc && (
                <button 
                  onClick={handleReset}
                  className="text-[9px] font-bold uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors"
                >
                  Purge Stream
                </button>
              )}
            </div>

            {!imgSrc ? (
              <div 
                className="group relative flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-cyan-400/40 rounded-md transition-all bg-white/[0.01] cursor-pointer"
                onClick={() => inputRef.current?.click()}
              >
                <input 
                  ref={inputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden"
                  onChange={onSelectFile}
                />
                <div className="w-16 h-16 rounded bg-white/5 flex items-center justify-center text-white/20 mb-6 group-hover:text-cyan-400 transition-colors border border-white/10">
                  <Upload size={24} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Initialize Source</p>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter italic">JPG // PNG // WEBP</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-6">
                <div className="relative rounded-md overflow-hidden bg-black/60 border border-white/10 flex-1 flex items-center justify-center group min-h-[400px]">
                  <ReactCrop
                    crop={crop}
                    onChange={(c) => setCrop(c)}
                    onComplete={(c) => setCompletedCrop(c)}
                    aspect={aspect}
                    className="max-h-[500px]"
                  >
                    <img
                      ref={imgRef}
                      src={imgSrc}
                      alt="Source"
                      onLoad={onImageLoad}
                      className="max-w-full max-h-[500px] object-contain"
                    />
                  </ReactCrop>
                  <div className="absolute top-4 left-4">
                    <span className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[9px] font-mono text-white/40 uppercase tracking-widest">
                      Active_Canvas
                    </span>
                  </div>
                </div>

                {/* Spatial Metadata */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="px-4 py-3 rounded bg-white/[0.02] border border-white/[0.05] flex justify-between items-center">
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Origin_X</span>
                    <span className="text-xs font-mono font-bold text-white/80">{Math.round(completedCrop?.x || 0)}PX</span>
                  </div>
                  <div className="px-4 py-3 rounded bg-white/[0.02] border border-white/[0.05] flex justify-between items-center">
                    <span className="text-[9px] font-mono text-white/20 uppercase tracking-widest">Origin_Y</span>
                    <span className="text-xs font-mono font-bold text-white/80">{Math.round(completedCrop?.y || 0)}PX</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Right Panel: Decomposition Controls (7 Columns) */}
      <div className="lg:col-span-7 h-full flex flex-col">
        <div className="glass-card border-white/[0.05] bg-black/40 p-8 rounded-md flex-1 flex flex-col relative overflow-hidden shadow-2xl min-h-[600px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                <CropIcon size={16} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Decomposition Engine</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Spatial Control // Neural Extraction</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col space-y-8">
            {/* Aspect Ratio Grid */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Maximize size={12} className="text-cyan-400" />
                <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Aspect Constraints</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handlePresetClick(p.aspect)}
                    className={cn(
                      "py-3 rounded text-[9px] font-mono font-bold transition-all border uppercase",
                      aspect === p.aspect
                        ? "bg-cyan-400 text-black border-cyan-400 shadow-lg shadow-cyan-400/20"
                        : "bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:border-white/10"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview & Action Hub */}
            <div className="flex-1 flex flex-col">
              <div className="relative rounded-md overflow-hidden bg-black/60 border border-white/10 flex-1 min-h-[250px] flex items-center justify-center group mb-6 shadow-inner checkerboard">
                <AnimatePresence mode="wait">
                  {outputUrl ? (
                    <motion.img 
                      key="output"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      src={outputUrl} 
                      alt="Decomposed" 
                      className="w-full h-full object-contain p-4 drop-shadow-[0_0_30px_rgba(34,211,238,0.15)]" 
                    />
                  ) : (
                    <motion.div 
                      key="placeholder"
                      className="flex flex-col items-center justify-center opacity-10"
                    >
                      <ImageIcon size={48} className="mb-4" />
                      <p className="text-[9px] font-mono uppercase tracking-[0.3em]">Awaiting Decomposition</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="absolute top-4 left-4">
                  <span className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[9px] font-mono text-white/40 uppercase tracking-widest">
                    Decomposed_Result
                  </span>
                </div>
              </div>

              {/* Action Stack */}
              <div className="space-y-4">
                {completedCrop && (
                  <div className="flex items-center justify-center gap-6 py-2">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">Target_Width</span>
                      <span className="text-lg font-bold text-white tracking-tighter">{Math.round(completedCrop.width)}PX</span>
                    </div>
                    <div className="h-8 w-px bg-white/5" />
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-mono text-white/20 uppercase tracking-widest mb-1">Target_Height</span>
                      <span className="text-lg font-bold text-white tracking-tighter">{Math.round(completedCrop.height)}PX</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={generateCrop}
                    disabled={isProcessing || !completedCrop}
                    className="py-4 rounded-md bg-cyan-400 text-black font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-cyan-400/20 flex items-center justify-center gap-3 hover:bg-cyan-300 transition-all disabled:opacity-30"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <><Zap size={14} fill="currentColor" /> Apply Extraction</>}
                  </button>
                  <button
                    onClick={handleDownload}
                    disabled={!outputUrl}
                    className="py-4 rounded-md bg-white text-black font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-cyan-50 transition-all flex items-center justify-center gap-3 disabled:opacity-30"
                  >
                    <Download size={14} /> Extract Stream
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
