'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, Download, Loader2, Image as ImageIcon, FileText, X, GripVertical, Settings2, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import jsPDF from 'jspdf';

type PageSize = 'a4' | 'letter' | 'auto';
type Orientation = 'portrait' | 'landscape';

interface ImageFile {
  file: File;
  url: string;
  id: string;
}

export default function ScreenshotToPDF() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  
  // PDF Settings
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [margin, setMargin] = useState(10); // in mm

  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (files: FileList | File[]) => {
    const newImgs = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({ file: f, url: URL.createObjectURL(f), id: Math.random().toString(36).slice(2) }));
    setImages(prev => [...prev, ...newImgs]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  }, []);

  const removeImage = (id: string) => setImages(prev => prev.filter(img => img.id !== id));

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    setProgress({ current: 0, total: images.length });

    try {
      let pdf: jsPDF | null = null;

      for (let i = 0; i < images.length; i++) {
        setProgress({ current: i + 1, total: images.length });
        
        const img = await loadImage(images[i].url);
        const imgW = img.width;
        const imgH = img.height;

        const currentFormat = pageSize === 'auto' ? [imgW, imgH] : pageSize;
        
        if (!pdf) {
          pdf = new jsPDF({ 
            orientation, 
            unit: 'mm', 
            format: currentFormat as any 
          });
        } else {
          pdf.addPage(currentFormat as any, orientation);
        }

        const pw = pdf.internal.pageSize.getWidth();
        const ph = pdf.internal.pageSize.getHeight();
        const usableW = pw - (margin * 2);
        const usableH = ph - (margin * 2);

        const ratio = Math.min(usableW / imgW, usableH / imgH);
        const finalW = imgW * ratio;
        const finalH = imgH * ratio;
        const x = (pw - finalW) / 2;
        const y = (ph - finalH) / 2;

        pdf.addImage(img, 'JPEG', x, y, finalW, finalH);
      }

      if (pdf) pdf.save('night-x-pdf.pdf');
    } catch (e) {
      console.error('PDF Generation Error:', e);
    } finally {
      setIsProcessing(false);
      setProgress({ current: 0, total: 0 });
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Settings & Upload */}
      <div className="lg:col-span-1 space-y-4">
        {!images.length ? (
          <div
            onDrop={handleDrop} onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="glass-card rounded-2xl border-2 border-dashed border-white/20 hover:border-violet-500/50 p-10 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 group-hover:bg-violet-500/10 flex items-center justify-center transition-all">
              <FileText size={32} className="text-white/30 group-hover:text-violet-400 transition-colors" />
            </div>
            <div className="text-center">
              <p className="text-white/70 font-medium">Drop screenshots here</p>
              <p className="text-white/30 text-sm mt-1">Combine multiple images into one PDF</p>
            </div>
            <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={e => { if (e.target.files) addFiles(e.target.files); }} />
          </div>
        ) : (
          <div className="glass-card rounded-2xl border border-white/10 p-5 space-y-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Settings2 size={18} className="text-violet-400" />
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">PDF Settings</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-white/50 uppercase">Page Size</label>
                <select 
                  value={pageSize} 
                  onChange={e => setPageSize(e.target.value as PageSize)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-violet-500/50 transition-all"
                >
                  <option value="a4" className="bg-slate-900">A4 Standard</option>
                  <option value="letter" className="bg-slate-900">Letter</option>
                  <option value="auto" className="bg-slate-900">Auto-fit to Image</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/50 uppercase">Orientation</label>
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                  <button onClick={() => setOrientation('portrait')} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${orientation === 'portrait' ? 'bg-violet-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>Portrait</button>
                  <button onClick={() => setOrientation('landscape')} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${orientation === 'landscape' ? 'bg-violet-600 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>Landscape</button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs text-white/50 uppercase">Margin</label>
                  <span className="text-xs text-violet-400 font-mono">{margin}mm</span>
                </div>
                <input type="range" min={0} max={40} value={margin} onChange={e => setMargin(Number(e.target.value))} className="w-full accent-violet-500" />
              </div>

              <div className="pt-4 space-y-3">
                <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
                  <p className="text-xs text-white/60 text-center italic">PDF will have <span className="text-violet-400 font-bold">{images.length}</span> pages</p>
                </div>
                <button
                  onClick={generatePDF}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-900/20 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <><Loader2 size={20} className="animate-spin" /> {progress.total > 0 ? `Page ${progress.current}/${progress.total}...` : 'Processing...'}</>
                  ) : (
                    <><Download size={20} /> Create PDF</>
                  )}
                </button>
                <button onClick={() => setImages([])} className="w-full py-2 text-xs text-white/30 hover:text-red-400 transition-colors">Clear All Images</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Reorder Grid */}
      <div className="lg:col-span-2">
        <AnimatePresence mode="wait">
          {images.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-sm text-white/40 font-medium">Drag to reorder pages</span>
                <button onClick={() => inputRef.current?.click()} className="text-xs text-violet-400 hover:underline flex items-center gap-1">
                  <Upload size={12} /> Add More
                </button>
              </div>
              
              <Reorder.Group axis="y" values={images} onReorder={setImages} className="space-y-3">
                {images.map((img, i) => (
                  <Reorder.Item
                    key={img.id}
                    value={img}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card rounded-xl border border-white/10 p-3 flex items-center gap-4 group cursor-grab active:cursor-grabbing"
                  >
                    <div className="text-white/20 group-hover:text-violet-500 transition-colors">
                      <GripVertical size={20} />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold flex-shrink-0 shadow-lg">
                      {i + 1}
                    </div>
                    <div className="w-20 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-white/5 bg-black/20">
                      <img src={img.url} alt="page" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-white/80 truncate">{img.file.name}</p>
                      <p className="text-[10px] text-white/30 uppercase tracking-tighter">Page {i + 1}</p>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); removeImage(img.id); }}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </Reorder.Item>
                ))}
              </Reorder.Group>
            </motion.div>
          ) : (
            <div className="glass-card rounded-2xl border border-white/5 flex flex-col items-center justify-center gap-4 h-full min-h-[400px] text-center p-8">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-2">
                <ImageIcon size={40} className="text-white/10" />
              </div>
              <div>
                <p className="text-white/50 font-medium">No Images Uploaded</p>
                <p className="text-white/20 text-xs mt-1 max-w-[240px]">Uploaded screenshots will appear here in a list. You can reorder them to change page sequence.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
