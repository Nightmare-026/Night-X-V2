'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  Loader2, 
  Image as ImageIcon, 
  Type, 
  Droplets, 
  Grid3X3, 
  LayoutGrid, 
  Trash2,
  RefreshCw,
  Zap,
  MousePointer2,
  ChevronRight,
  Settings,
  Layers,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, downloadFile } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

type WatermarkType = 'text' | 'image';
type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'tile';

const POSITIONS: { key: Position; label: string }[] = [
  { key: 'top-left', label: 'TL' }, { key: 'top-center', label: 'TC' }, { key: 'top-right', label: 'TR' },
  { key: 'middle-left', label: 'ML' }, { key: 'center', label: 'CTR' }, { key: 'middle-right', label: 'MR' },
  { key: 'bottom-left', label: 'BL' }, { key: 'bottom-center', label: 'BC' }, { key: 'bottom-right', label: 'BR' },
];

export default function WatermarkAdder() {
  const { toast } = useToast();
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Watermark settings
  const [type, setType] = useState<WatermarkType>('text');
  const [text, setText] = useState('(c) Night X');
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkImagePreview, setWatermarkImagePreview] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState<Position>('bottom-right');
  const [color, setColor] = useState('#ffffff');
  const [imageSize, setImageSize] = useState(20);

  const mainInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const processMainFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (inputPreview) URL.revokeObjectURL(inputPreview);
    setInputFile(file);
    setInputPreview(URL.createObjectURL(file));
    setOutputUrl(null);
  };

  const processWatermarkFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (watermarkImagePreview) URL.revokeObjectURL(watermarkImagePreview);
    setWatermarkImage(file);
    setWatermarkImagePreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (inputPreview) URL.revokeObjectURL(inputPreview);
      if (watermarkImagePreview) URL.revokeObjectURL(watermarkImagePreview);
      if (outputUrl) URL.revokeObjectURL(outputUrl);
    };
  }, [inputPreview, watermarkImagePreview, outputUrl]);

  const applyWatermark = async () => {
    if (!inputPreview) return;
    if (type === 'image' && !watermarkImagePreview) {
      toast("Please upload a watermark logo", "error");
      return;
    }

    setIsProcessing(true);
    
    try {
      const mainImg = await loadImage(inputPreview);
      const canvas = document.createElement('canvas');
      canvas.width = mainImg.naturalWidth;
      canvas.height = mainImg.naturalHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
      ctx.drawImage(mainImg, 0, 0);

      ctx.globalAlpha = opacity;

      if (type === 'text') {
        ctx.fillStyle = color;
        ctx.font = `bold ${fontSize}px font-outfit, sans-serif`;
        const metrics = ctx.measureText(text);
        const tw = metrics.width;
        const th = fontSize;
        const pad = canvas.width * 0.03;

        if (position === 'tile') {
          const stepX = tw * 2;
          const stepY = th * 4;
          ctx.rotate(-Math.PI / 4);
          for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
            for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
              ctx.fillText(text, x, y);
            }
          }
        } else {
          const coords = calculatePosition(position, canvas.width, canvas.height, tw, th, pad);
          ctx.fillText(text, coords.x, coords.y + th);
        }
      } else if (type === 'image' && watermarkImagePreview) {
        const wmImg = await loadImage(watermarkImagePreview);
        const wmWidth = canvas.width * (imageSize / 100);
        const wmHeight = (wmImg.naturalHeight / wmImg.naturalWidth) * wmWidth;
        const pad = canvas.width * 0.03;

        if (position === 'tile') {
          const stepX = wmWidth * 2;
          const stepY = wmHeight * 2;
          for (let x = 0; x < canvas.width; x += stepX) {
            for (let y = 0; y < canvas.height; y += stepY) {
              ctx.drawImage(wmImg, x, y, wmWidth, wmHeight);
            }
          }
        } else {
          const coords = calculatePosition(position, canvas.width, canvas.height, wmWidth, wmHeight, pad);
          ctx.drawImage(wmImg, coords.x, coords.y, wmWidth, wmHeight);
        }
      }

      canvas.toBlob(blob => {
        if (blob) {
          if (outputUrl) URL.revokeObjectURL(outputUrl);
          setOutputUrl(URL.createObjectURL(blob));
          toast("Composite rendered", "success");
        }
        setIsProcessing(false);
      }, 'image/png');
    } catch (err) {
      console.error(err);
      toast("Process failure", "error");
      setIsProcessing(false);
    }
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const calculatePosition = (pos: Position, cw: number, ch: number, tw: number, th: number, pad: number) => {
    let x = pad, y = pad;
    switch (pos) {
      case 'top-left': x = pad; y = pad; break;
      case 'top-center': x = (cw - tw) / 2; y = pad; break;
      case 'top-right': x = cw - tw - pad; y = pad; break;
      case 'middle-left': x = pad; y = (ch - th) / 2; break;
      case 'center': x = (cw - tw) / 2; y = (ch - th) / 2; break;
      case 'middle-right': x = cw - tw - pad; y = (ch - th) / 2; break;
      case 'bottom-left': x = pad; y = ch - th - pad; break;
      case 'bottom-center': x = (cw - tw) / 2; y = ch - th - pad; break;
      case 'bottom-right': x = cw - tw - pad; y = ch - th - pad; break;
    }
    return { x, y };
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    downloadFile(outputUrl, `marked_${inputFile?.name || 'image.png'}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
      
      {/* Left Panel: Branding Manifest (5 Columns) */}
      <div className="lg:col-span-5 space-y-6">
        <section className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md relative overflow-hidden h-full flex flex-col min-h-[600px]">
          <div className="relative z-10 flex-1 flex flex-col space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 font-outfit">
                  Branding Manifest
                </h2>
              </div>
              {inputFile && (
                <button 
                  onClick={() => { setInputFile(null); setInputPreview(null); setOutputUrl(null); }}
                  className="text-[9px] font-bold uppercase tracking-widest text-white/20 hover:text-red-400 transition-colors"
                >
                  Purge Stream
                </button>
              )}
            </div>

            {!inputFile ? (
              <div 
                className="group relative flex-1 flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-cyan-400/40 rounded-md transition-all bg-white/[0.01] cursor-pointer"
                onClick={() => mainInputRef.current?.click()}
              >
                <input ref={mainInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processMainFile(f); }} />
                <div className="w-16 h-16 rounded bg-white/5 flex items-center justify-center text-white/20 mb-6 group-hover:text-cyan-400 transition-colors border border-white/10">
                  <ImageIcon size={24} />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2">Initialize Composite</p>
                <p className="text-[9px] font-mono text-white/20 uppercase tracking-tighter italic">Source Image Buffer</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col space-y-6">
                {/* Mode Selector */}
                <div className="flex p-1 bg-white/5 rounded border border-white/5">
                  <button onClick={() => setType('text')} className={cn("flex-1 py-2 rounded text-[10px] font-bold transition-all font-mono uppercase", type === 'text' ? "bg-cyan-400 text-black shadow-lg" : "text-white/30 hover:text-white")}>
                    Alpha Text
                  </button>
                  <button onClick={() => setType('image')} className={cn("flex-1 py-2 rounded text-[10px] font-bold transition-all font-mono uppercase", type === 'image' ? "bg-cyan-400 text-black shadow-lg" : "text-white/30 hover:text-white")}>
                    Logo Matrix
                  </button>
                </div>

                {/* Configuration Stack */}
                <div className="space-y-6 flex-1">
                  {type === 'text' ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Signature String</label>
                        <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full bg-white/[0.03] border border-white/10 rounded p-4 text-xs text-white focus:border-cyan-400/50 outline-none transition-all font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Scale (PX)</label>
                          <input type="number" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full bg-white/[0.03] border border-white/10 rounded p-3 text-xs text-white focus:border-cyan-400/50 outline-none font-mono" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Hex Code</label>
                          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded p-1">
                            <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded border-none bg-transparent cursor-pointer" />
                            <span className="text-[10px] font-mono text-white/60 uppercase">{color}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Logo Payload</label>
                      {!watermarkImage ? (
                        <div onClick={() => watermarkInputRef.current?.click()} className="border border-dashed border-white/10 rounded p-8 flex flex-col items-center gap-2 hover:bg-white/5 cursor-pointer transition-all group">
                          <Upload size={16} className="text-white/20 group-hover:text-cyan-400 transition-colors" />
                          <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Select Mark</p>
                          <input ref={watermarkInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processWatermarkFile(f); }} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded p-4">
                          <img src={watermarkImagePreview!} className="w-12 h-12 rounded object-contain bg-black/40 border border-white/10 p-1" />
                          <div className="flex-1">
                            <p className="text-[10px] font-bold text-white/80 truncate uppercase tracking-widest">{watermarkImage.name}</p>
                            <button onClick={() => { setWatermarkImage(null); setWatermarkImagePreview(null); }} className="text-[8px] font-bold text-red-400 uppercase tracking-[0.2em] mt-1 hover:text-red-300 transition-colors">Discard</button>
                          </div>
                          <div className="w-24 space-y-1">
                            <span className="text-[8px] font-mono text-white/30 uppercase tracking-widest">Scale: {imageSize}%</span>
                            <input type="range" min={5} max={80} value={imageSize} onChange={e => setImageSize(Number(e.target.value))} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-cyan-400 cursor-pointer" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Anchor Matrix */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Anchor Matrix</label>
                      <button onClick={() => setPosition('tile')} className={cn("px-2 py-1 rounded text-[8px] font-bold transition-all border", position === 'tile' ? "bg-cyan-400 text-black border-cyan-400" : "bg-white/5 border-white/5 text-white/40")}>TILE_MODE</button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 w-full max-w-[120px] mx-auto lg:mx-0">
                      {POSITIONS.map(p => (
                        <button key={p.key} onClick={() => setPosition(p.key)} className={cn("aspect-square rounded border transition-all flex items-center justify-center text-[8px] font-mono", position === p.key ? "bg-cyan-400 text-black border-cyan-400 shadow-lg shadow-cyan-400/10" : "bg-white/5 border-white/5 text-white/30 hover:text-white/60")}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Luminosity / Opacity */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em]">Alpha Density</label>
                      <span className="text-[10px] font-mono text-cyan-400">{Math.round(opacity * 100)}%</span>
                    </div>
                    <input type="range" min={0} max={100} value={opacity * 100} onChange={e => setOpacity(Number(e.target.value) / 100)} className="w-full h-1 bg-white/5 rounded-full appearance-none accent-cyan-400 cursor-pointer" />
                  </div>
                </div>

                <button 
                  onClick={applyWatermark} 
                  disabled={isProcessing || !inputFile} 
                  className="w-full py-4 rounded-md bg-cyan-400 text-black font-bold text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-400/20 flex items-center justify-center gap-3 hover:bg-cyan-300 transition-all group disabled:opacity-30 mt-auto"
                >
                  {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <><Zap size={16} fill="currentColor" /> Apply Composite <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></>}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Right Panel: Layered Composite (7 Columns) */}
      <div className="lg:col-span-7 h-full flex flex-col">
        <div className="glass-card border-white/[0.05] bg-black/40 p-8 rounded-md flex-1 flex flex-col relative overflow-hidden shadow-2xl min-h-[600px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />
          
          <div className="flex items-center justify-between mb-8 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                <Layers size={16} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Layered Composite</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Baking Stream // Visual Result</p>
              </div>
            </div>
            {outputUrl && (
              <button 
                onClick={handleDownload}
                className="flex items-center gap-2 px-6 py-2.5 rounded bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-cyan-50 transition-all shadow-lg"
              >
                <Download size={14} /> Extract Stream
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col">
            <div className="relative rounded-md overflow-hidden bg-black/60 border border-white/10 flex-1 min-h-[400px] flex items-center justify-center group mb-6 shadow-inner checkerboard">
              <AnimatePresence mode="wait">
                {outputUrl ? (
                  <motion.img 
                    key="output"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    src={outputUrl} 
                    alt="Composite" 
                    className="w-full h-full object-contain p-4 drop-shadow-[0_0_40px_rgba(34,211,238,0.15)]" 
                  />
                ) : (
                  <motion.div 
                    key="placeholder"
                    className="flex flex-col items-center justify-center opacity-10"
                  >
                    <Grid3X3 size={60} className="mb-4" />
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em]">Awaiting Composite Loop</p>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="absolute top-4 left-4">
                <span className="px-2 py-1 bg-black/60 border border-white/10 rounded text-[9px] font-mono text-white/40 uppercase tracking-widest">
                  Result_Stream
                </span>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded bg-white/[0.02] border border-white/[0.05] space-y-2">
                <div className="flex items-center gap-2 text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
                  <Zap size={12} /> Smart Masking
                </div>
                <p className="text-[10px] text-white/30 italic leading-relaxed">
                  Composite engine preserves luminance data while injecting watermark layers.
                </p>
              </div>
              <div className="p-4 rounded bg-white/[0.02] border border-white/[0.05] space-y-2">
                <div className="flex items-center gap-2 text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
                  <Settings size={12} /> Metadata Sync
                </div>
                <p className="text-[10px] text-white/30 italic leading-relaxed">
                  Exported streams maintain original color profiles and EXIF orientation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
