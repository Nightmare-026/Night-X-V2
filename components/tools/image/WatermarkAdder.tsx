'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, Download, Loader2, Image as ImageIcon, Type, Droplets, Grid3X3, LayoutGrid, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type WatermarkType = 'text' | 'image';
type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'tile';

export default function WatermarkAdder() {
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
    setInputFile(file);
    setInputPreview(URL.createObjectURL(file));
    setOutputUrl(null);
  };

  const processWatermarkFile = (file: File) => {
    setWatermarkImage(file);
    setWatermarkImagePreview(URL.createObjectURL(file));
  };

  const applyWatermark = async () => {
    if (!inputPreview) return;
    if (type === 'image' && !watermarkImagePreview) return;

    setIsProcessing(true);
    
    try {
      const mainImg = await loadImage(inputPreview);
      const canvas = document.createElement('canvas');
      canvas.width = mainImg.naturalWidth;
      canvas.height = mainImg.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(mainImg, 0, 0);

      ctx.globalAlpha = opacity;

      if (type === 'text') {
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px Inter, sans-serif`;
        const metrics = ctx.measureText(text);
        const tw = metrics.width;
        const th = fontSize;
        const pad = canvas.width * 0.03; // 3% padding

        if (position === 'tile') {
          const stepX = tw * 2;
          const stepY = th * 3;
          for (let x = 0; x < canvas.width; x += stepX) {
            for (let y = 0; y < canvas.height; y += stepY) {
              ctx.save();
              ctx.translate(x, y);
              ctx.rotate(-Math.PI / 4);
              ctx.fillText(text, 0, 0);
              ctx.restore();
            }
          }
        } else {
          let x = 0, y = 0;
          const coords = calculatePosition(position, canvas.width, canvas.height, tw, th, pad);
          ctx.fillText(text, coords.x, coords.y + th); // Add th because fillText uses baseline
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
        if (blob) setOutputUrl(URL.createObjectURL(blob));
        setIsProcessing(false);
      }, 'image/png');
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
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
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `watermarked_${inputFile?.name || 'image.png'}`;
    a.click();
  };

  const positions: { key: Position; label: string }[] = [
    { key: 'top-left', label: '↖' }, { key: 'top-center', label: '↑' }, { key: 'top-right', label: '↗' },
    { key: 'middle-left', label: '←' }, { key: 'center', label: '⊙' }, { key: 'middle-right', label: '→' },
    { key: 'bottom-left', label: '↙' }, { key: 'bottom-center', label: '↓' }, { key: 'bottom-right', label: '↘' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Settings */}
      <div className="space-y-4">
        {!inputFile ? (
          <div
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) processMainFile(f); }}
            onDragOver={e => e.preventDefault()}
            onClick={() => mainInputRef.current?.click()}
            className="glass-card rounded-2xl border-2 border-dashed border-white/20 hover:border-violet-500/50 p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group min-h-[220px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-violet-500/10 flex items-center justify-center transition-all">
              <Upload size={28} className="text-white/30 group-hover:text-violet-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-white/70 font-medium">Drop background image here</p>
              <p className="text-white/30 text-sm mt-1">PNG, JPG, WEBP supported</p>
            </div>
            <input ref={mainInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processMainFile(f); }} />
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-white/10 p-5 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <ImageIcon size={20} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white truncate max-w-[150px]">{inputFile.name}</p>
                  <p className="text-xs text-white/40">Background Image</p>
                </div>
              </div>
              <button onClick={() => { setInputFile(null); setInputPreview(null); setOutputUrl(null); }} className="p-2 rounded-lg hover:bg-red-500/10 text-white/30 hover:text-red-400 transition-all">
                <Trash2 size={18} />
              </button>
            </div>

            {/* Mode Selector */}
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
              <button onClick={() => setType('text')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${type === 'text' ? 'bg-violet-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}>
                <Type size={16} /> Text
              </button>
              <button onClick={() => setType('image')} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${type === 'image' ? 'bg-violet-600 text-white shadow-lg' : 'text-white/50 hover:text-white'}`}>
                <ImageIcon size={16} /> Image
              </button>
            </div>

            {/* Config Panels */}
            <div className="space-y-4">
              {type === 'text' ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Watermark Text</label>
                    <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-violet-500/50 transition-colors" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Color</label>
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-2 py-1.5">
                        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none" />
                        <span className="text-xs font-mono text-white/60">{color.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Font Size: <span className="text-violet-400">{fontSize}px</span></label>
                      <input type="range" min={12} max={120} value={fontSize} onChange={e => setFontSize(Number(e.target.value))} className="w-full accent-violet-500 mt-2" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Watermark Image</label>
                  {!watermarkImage ? (
                    <div onClick={() => watermarkInputRef.current?.click()} className="border border-dashed border-white/10 rounded-xl p-6 flex flex-col items-center gap-2 hover:bg-white/5 cursor-pointer transition-all">
                      <Upload size={20} className="text-white/20" />
                      <p className="text-xs text-white/40">Upload logo/mark</p>
                      <input ref={watermarkInputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) processWatermarkFile(f); }} />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-3">
                      <img src={watermarkImagePreview!} className="w-12 h-12 rounded object-contain bg-black/20" />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs text-white/70 truncate">{watermarkImage.name}</p>
                        <button onClick={() => { setWatermarkImage(null); setWatermarkImagePreview(null); }} className="text-[10px] text-red-400 hover:underline">Remove</button>
                      </div>
                      <div className="w-24">
                        <label className="text-[10px] text-white/30 block">Size: {imageSize}%</label>
                        <input type="range" min={5} max={50} value={imageSize} onChange={e => setImageSize(Number(e.target.value))} className="w-full accent-violet-500" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Position</label>
                  <button onClick={() => setPosition('tile')} className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all ${position === 'tile' ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                    <LayoutGrid size={14} /> Tile Mode
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full max-w-[180px] mx-auto">
                  {positions.map(p => (
                    <button key={p.key} onClick={() => setPosition(p.key)} className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all ${position === p.key ? 'bg-violet-600 text-white shadow-lg' : 'bg-white/5 text-white/30 hover:bg-white/10 border border-white/5'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Opacity: <span className="text-violet-400">{Math.round(opacity * 100)}%</span></label>
                <input type="range" min={0} max={100} value={opacity * 100} onChange={e => setOpacity(Number(e.target.value) / 100)} className="w-full accent-violet-500" />
              </div>

              <button onClick={applyWatermark} disabled={isProcessing} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-900/20 disabled:opacity-50">
                {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Droplets size={20} />}
                {isProcessing ? 'Processing...' : 'Apply Watermark'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: Preview */}
      <div className="flex flex-col h-full">
        <AnimatePresence mode="wait">
          {outputUrl ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="glass-card rounded-2xl border border-emerald-500/30 overflow-hidden flex-1 flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-emerald-500/5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold text-emerald-400">Preview Result</span>
                </div>
                <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-900/20">
                  <Download size={14} /> Download Image
                </button>
              </div>
              <div className="flex-1 flex items-center justify-center p-6 bg-black/20">
                <img src={outputUrl} alt="Watermarked Result" className="max-w-full max-h-[500px] object-contain rounded-lg shadow-2xl" />
              </div>
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-4 flex-1 min-h-[400px] text-center p-8">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <ImageIcon size={40} className="text-white/10" />
              </div>
              <div>
                <p className="text-white/50 font-medium">No Preview Available</p>
                <p className="text-white/20 text-xs mt-1 max-w-[200px]">Upload an image and apply your watermark to see the results here</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
