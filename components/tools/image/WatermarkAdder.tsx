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
  Sparkles,
  Zap,
  MousePointer2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, downloadFile } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

type WatermarkType = 'text' | 'image';
type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'tile';

export default function WatermarkAdder() {
  const { addToast } = useToast();
  const [inputFile, setInputFile] = useState<File | null>(null);
  const [inputPreview, setInputPreview] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Watermark settings
  const [type, setType] = useState<WatermarkType>('text');
  const [text, setText] = useState('© Night X');
  const [watermarkImage, setWatermarkImage] = useState<File | null>(null);
  const [watermarkImagePreview, setWatermarkImagePreview] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(32);
  const [opacity, setOpacity] = useState(0.5);
  const [position, setPosition] = useState<Position>('bottom-right');
  const [color, setColor] = useState('#ffffff');
  const [imageSize, setImageSize] = useState(20); // 10-50% of main image

  const mainInputRef = useRef<HTMLInputElement>(null);
  const watermarkInputRef = useRef<HTMLInputElement>(null);

  const processMainFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast("Please upload an image file", "error");
      return;
    }
    // Cleanup old preview if it exists
    if (inputPreview) URL.revokeObjectURL(inputPreview);
    
    setInputFile(file);
    setInputPreview(URL.createObjectURL(file));
    setOutputUrl(null);
    addToast("Image uploaded", "success");
  };

  const processWatermarkFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast("Please upload an image file for watermark", "error");
      return;
    }
    // Cleanup old preview if it exists
    if (watermarkImagePreview) URL.revokeObjectURL(watermarkImagePreview);

    setWatermarkImage(file);
    setWatermarkImagePreview(URL.createObjectURL(file));
    addToast("Watermark logo ready", "success");
  };

  // Cleanup on unmount
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
      addToast("Please upload a watermark logo", "error");
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
        ctx.font = `bold ${fontSize}px Syne, Inter, sans-serif`;
        const metrics = ctx.measureText(text);
        const tw = metrics.width;
        const th = fontSize;
        const pad = canvas.width * 0.03; // 3% padding

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
          addToast("Watermark applied successfully!", "success");
        }
        setIsProcessing(false);
      }, 'image/png');
    } catch (err) {
      console.error(err);
      addToast("Failed to process image", "error");
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
    downloadFile(outputUrl, `watermarked_${inputFile?.name || 'image.png'}`);
    addToast("Image downloaded", "success");
  };

  const positions: { key: Position; label: string }[] = [
    { key: 'top-left', label: '↖' }, { key: 'top-center', label: '↑' }, { key: 'top-right', label: '↗' },
    { key: 'middle-left', label: '←' }, { key: 'center', label: '⊙' }, { key: 'middle-right', label: '→' },
    { key: 'bottom-left', label: '↙' }, { key: 'bottom-center', label: '↓' }, { key: 'bottom-right', label: '↘' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Settings Panel (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden"
          >
            <div className="p-8 space-y-8">
              {!inputFile ? (
                <div
                  onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) processMainFile(f); }}
                  onDragOver={e => e.preventDefault()}
                  onClick={() => mainInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-[32px] p-16 flex flex-col items-center justify-center gap-6 cursor-pointer hover:border-accent-purple/50 hover:bg-accent-purple/5 transition-all group"
                >
                  <div className="w-20 h-20 rounded-[24px] bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Upload size={32} className="text-white/20 group-hover:text-accent-purple transition-colors" />
                  </div>
                  <div className="text-center">
                    <h4 className="text-lg font-bold text-white/80">Drop background image</h4>
                    <p className="text-white/30 text-sm mt-1">High resolution PNG, JPG supported</p>
                  </div>
                  <input ref={mainInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processMainFile(f); }} />
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-accent-purple/10 text-accent-purple rounded-xl">
                        <ImageIcon size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white truncate max-w-[200px]">{inputFile.name}</p>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Target Image</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { 
                        if (inputPreview) URL.revokeObjectURL(inputPreview);
                        if (outputUrl) URL.revokeObjectURL(outputUrl);
                        setInputFile(null); 
                        setInputPreview(null); 
                        setOutputUrl(null); 
                      }}
                      className="p-3 hover:bg-red-500/10 text-white/20 hover:text-red-400 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5">
                      <button onClick={() => setType('text')} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all", type === 'text' ? 'bg-accent-purple text-white shadow-lg' : 'text-white/40 hover:text-white/60')}>
                        <Type size={16} /> Text Mark
                      </button>
                      <button onClick={() => setType('image')} className={cn("flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all", type === 'image' ? 'bg-accent-purple text-white shadow-lg' : 'text-white/40 hover:text-white/60')}>
                        <ImageIcon size={16} /> Logo Mark
                      </button>
                    </div>

                    <div className="space-y-6">
                      {type === 'text' ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Watermark Content</label>
                            <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-accent-purple" />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Color</label>
                              <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-2xl p-2.5">
                                <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none" />
                                <span className="text-xs font-mono text-white/60">{color.toUpperCase()}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase ml-1">
                                <span>Size</span>
                                <span className="text-accent-purple">{fontSize}px</span>
                              </div>
                              <div className="p-4 bg-black/40 rounded-2xl border border-white/10">
                                <input type="range" min={12} max={200} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-accent-purple" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                          <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Watermark Image</label>
                          {!watermarkImage ? (
                            <div onClick={() => watermarkInputRef.current?.click()} className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center gap-3 hover:bg-white/5 cursor-pointer transition-all group">
                              <Upload size={24} className="text-white/20 group-hover:text-accent-purple transition-colors" />
                              <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Select Logo</p>
                              <input ref={watermarkInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processWatermarkFile(f); }} />
                            </div>
                          ) : (
                            <div className="flex items-center gap-6 bg-black/40 border border-white/10 rounded-[24px] p-5">
                              <div className="relative">
                                <img src={watermarkImagePreview!} className="w-20 h-20 rounded-xl object-contain bg-white/5 p-2 shadow-xl" />
                                <button onClick={() => { setWatermarkImage(null); setWatermarkImagePreview(null); }} className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-400 transition-all">
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              <div className="flex-1 space-y-3">
                                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase">
                                  <span>Relative Size</span>
                                  <span className="text-accent-cyan">{imageSize}%</span>
                                </div>
                                <input type="range" min={5} max={80} value={imageSize} onChange={e => setImageSize(Number(e.target.value))} className="w-full accent-accent-cyan" />
                                <p className="text-[9px] text-white/20 font-medium">Size is relative to background dimensions.</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Anchor Position</label>
                            <button onClick={() => setPosition('tile')} className={cn("flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border", position === 'tile' ? 'bg-accent-purple border-accent-purple text-white shadow-lg' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10')}>
                              <LayoutGrid size={12} /> TILE MODE
                            </button>
                          </div>
                          <div className="grid grid-cols-3 gap-2 w-full max-w-[150px] mx-auto md:mx-0">
                            {positions.map(p => (
                              <button key={p.key} onClick={() => setPosition(p.key)} className={cn("w-full aspect-square rounded-xl flex items-center justify-center transition-all border", position === p.key ? 'bg-accent-purple border-accent-purple text-white shadow-lg' : 'bg-white/5 border-white/5 text-white/20 hover:bg-white/10')}>
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase ml-2">
                            <span>Transparency</span>
                            <span className="text-accent-cyan">{Math.round(opacity * 100)}%</span>
                          </div>
                          <div className="p-6 bg-black/40 rounded-3xl border border-white/10">
                            <input type="range" min={0} max={100} value={opacity * 100} onChange={e => setOpacity(Number(e.target.value) / 100)} className="w-full accent-accent-cyan" />
                          </div>
                          <button 
                            onClick={applyWatermark} 
                            disabled={isProcessing || !inputFile} 
                            className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl transition-all hover:bg-accent-purple hover:text-white disabled:opacity-30"
                          >
                            {isProcessing ? <RefreshCw size={18} className="animate-spin" /> : <Droplets size={18} />}
                            {isProcessing ? 'Baking Mark...' : 'Apply & Preview'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Preview Panel (5 Columns) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group min-h-[500px]"
          >
            {/* Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-purple/5 blur-[120px] rounded-full group-hover:bg-accent-purple/10 transition-all duration-1000" />
            
            <div className="relative z-10 w-full flex flex-col items-center h-full">
              <div className="mb-8">
                <div className="text-[10px] font-black tracking-[0.2em] text-accent-cyan uppercase mb-2">Live Canvas</div>
                <h2 className="text-xl font-bold font-syne">Watermark Preview</h2>
              </div>

              <div className="flex-1 flex items-center justify-center w-full relative">
                <AnimatePresence mode="wait">
                  {outputUrl ? (
                    <motion.div
                      key="output"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative p-2 bg-white rounded-[32px] shadow-2xl overflow-hidden"
                    >
                      <img src={outputUrl} alt="Result" className="max-w-full max-h-[350px] object-contain rounded-2xl" />
                      <div className="absolute top-4 right-4 bg-accent-purple text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-xl uppercase tracking-widest border border-white/20">
                        Processed
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center gap-6 opacity-20"
                    >
                      <div className="p-10 rounded-full bg-white/5 border border-white/5">
                        <ImageIcon size={64} strokeWidth={1} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold uppercase tracking-widest">No Output</p>
                        <p className="text-[10px] font-medium max-w-[200px]">Configure your mark and click apply to see the result</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {outputUrl && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 grid grid-cols-2 gap-4 w-full"
                >
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-3 py-4 bg-accent-cyan text-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition-all hover:scale-105 active:scale-95"
                  >
                    <Download size={16} />
                    Download
                  </button>
                  <button
                    onClick={() => { setOutputUrl(null); applyWatermark(); }}
                    className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
                  >
                    <RefreshCw size={16} />
                    Re-Apply
                  </button>
                </motion.div>
              )}
            </div>

            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[40px]">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-accent-purple/20 border-t-accent-purple rounded-full animate-spin" />
                  <Droplets size={24} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white animate-bounce" />
                </div>
                <span className="mt-4 text-xs font-black uppercase tracking-[0.3em] text-white/70">Baking Watermark...</span>
              </div>
            )}
          </motion.div>

          <div className="bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 p-6 rounded-[32px] border border-white/10 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-white/40">
              <Zap size={14} className="text-yellow-400" />
              Pro Features
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-white/5 text-accent-cyan">
                  <MousePointer2 size={12} />
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  <span className="text-white/70 font-bold">Smart Clipping:</span> Automatically adjusts mark visibility based on background luminosity.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1.5 rounded-lg bg-white/5 text-accent-purple">
                  <Sparkles size={12} />
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed">
                  <span className="text-white/70 font-bold">Retina Ready:</span> Generates 2x resolution marks for crisp display on high-DPI screens.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
