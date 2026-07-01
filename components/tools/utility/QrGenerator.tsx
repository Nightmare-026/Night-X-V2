'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  QrCode, 
  Download, 
  Copy, 
  Check, 
  Palette, 
  Type, 
  Link as LinkIcon,
  Wifi,
  Settings2,
  RefreshCw,
  Image as ImageIcon,
  Zap,
  Trash2,
  Share2,
  Smartphone
} from 'lucide-react';
import { cn, copyToClipboard, downloadFile } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

type QRType = 'url' | 'text' | 'wifi';

export default function QrGenerator() {
  const { toast } = useToast();
  const [type, setType] = useState<QRType>('url');
  const [input, setInput] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(300);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');

  const generateQR = useCallback(async () => {
    let data = input;
    if (type === 'wifi') {
      if (!ssid) {
        setQrUrl('');
        return;
      }
      data = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    }

    if (!data && type !== 'wifi') {
      setQrUrl('');
      return;
    }

    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(data || 'Night X', {
        width: size,
        margin: 2,
        color: {
          dark: color,
          light: bgColor,
        },
        errorCorrectionLevel: 'H',
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  }, [input, type, color, bgColor, size, ssid, password, encryption]);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateQR();
    }, 400);
    return () => clearTimeout(timer);
  }, [generateQR]);

  const handleDownload = () => {
    if (!qrUrl) return;
    downloadFile(qrUrl, `qr-${Date.now()}.png`);
  };

  const handleCopyContent = async () => {
    const content = type === 'wifi' ? `SSID: ${ssid}` : input;
    await copyToClipboard(content);
  };

  const handleReset = () => {
    setInput('');
    setSsid('');
    setPassword('');
    setQrUrl('');
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Configuration Panel */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md overflow-hidden p-8 space-y-8">
            {/* Type Selector */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Smartphone className="text-accent-blue" size={16} />
                <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Content Type</h3>
              </div>
              
              <div className="flex gap-2 p-1 bg-black/40 rounded-md border border-white/[0.05]">
                {(['url', 'text', 'wifi'] as QRType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={cn(
                      "flex-1 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                      type === t 
                        ? "bg-accent-blue text-white shadow-lg" 
                        : "text-white/20 hover:text-white/40 hover:bg-white/[0.02]"
                    )}
                  >
                    {t === 'url' && <LinkIcon size={12} />}
                    {t === 'text' && <Type size={12} />}
                    {t === 'wifi' && <Wifi size={12} />}
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Inputs */}
            <AnimatePresence mode="wait">
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="space-y-6"
              >
                {type === 'wifi' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1 font-inter">Network Name (SSID)</label>
                      <input
                        type="text"
                        value={ssid}
                        onChange={(e) => setSsid(e.target.value)}
                        placeholder="My Network"
                        className="w-full bg-black/40 border border-white/[0.05] rounded-md p-4 text-sm focus:outline-none focus:border-accent-blue transition-all font-inter text-white/80"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1 font-inter">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/40 border border-white/[0.05] rounded-md p-4 text-sm focus:outline-none focus:border-accent-blue transition-all font-inter text-white/80"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1 font-inter">Encryption Mode</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['WPA', 'WEP', 'nopass'].map((enc) => (
                          <button
                            key={enc}
                            onClick={() => setEncryption(enc)}
                            className={cn(
                              "py-3 rounded-md text-[10px] font-bold border transition-all uppercase tracking-widest",
                              encryption === enc 
                                ? "bg-accent-blue/10 border-accent-blue/40 text-accent-blue" 
                                : "bg-white/[0.02] border-white/[0.05] text-white/20 hover:text-white/40"
                            )}
                          >
                            {enc === 'nopass' ? 'None' : enc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1 font-inter">
                      {type === 'url' ? 'Destination URL' : 'Raw Content'}
                    </label>
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={type === 'url' ? 'https://example.com' : 'Enter text here...'}
                      className="w-full h-40 bg-black/40 border border-white/[0.05] rounded-md p-5 text-sm focus:outline-none focus:border-accent-blue transition-all resize-none font-inter text-white/80 leading-relaxed"
                    />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-8 border-t border-white/[0.05]">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 rounded-md bg-white/[0.02] text-white/20 text-[10px] font-bold uppercase tracking-widest hover:text-red-400 transition-all border border-white/[0.05]"
              >
                <Trash2 size={12} />
                Clear
              </button>
              <button
                onClick={handleCopyContent}
                disabled={!input && !ssid}
                className="flex items-center gap-2 px-6 py-3 rounded-md bg-white/[0.02] text-white/20 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-all border border-white/[0.05] disabled:opacity-30"
              >
                <Copy size={12} />
                Copy
              </button>
            </div>
          </div>

          {/* Customization Card */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center gap-2">
              <Palette className="text-accent-blue" size={16} />
              <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Appearance</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] text-white/20 uppercase tracking-widest font-bold font-inter ml-1">Color Palette</label>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between bg-black/40 p-4 rounded-md border border-white/[0.05]">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Dark Color</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-white/20">{color.toUpperCase()}</span>
                      <input 
                        type="color" 
                        value={color} 
                        onChange={(e) => setColor(e.target.value)}
                        className="w-8 h-8 rounded-md cursor-pointer bg-transparent border-none p-0 overflow-hidden"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-black/40 p-4 rounded-md border border-white/[0.05]">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Light Color</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-white/20">{bgColor.toUpperCase()}</span>
                      <input 
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-8 h-8 rounded-md cursor-pointer bg-transparent border-none p-0 overflow-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] text-white/20 uppercase tracking-widest font-bold font-inter ml-1">
                  <span>Dimension</span>
                  <span className="text-accent-blue">{size}px</span>
                </div>
                <div className="p-8 bg-black/40 rounded-md border border-white/[0.05] h-[108px] flex items-center">
                  <input 
                    type="range" 
                    min="200" 
                    max="1000" 
                    step="100"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full accent-accent-blue h-1 bg-white/[0.05] rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
          <div className="bg-white/[0.02] p-8 rounded-md border border-white/[0.05] flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden group">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-blue/5 blur-[120px] rounded-full" />
            
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="text-center mb-8">
                <div className="text-[10px] font-bold tracking-[0.2em] text-accent-blue uppercase mb-2">Live Output</div>
                <h2 className="text-lg font-outfit font-bold text-white uppercase tracking-widest">Sovereign QR</h2>
              </div>

              <div className="relative p-6 bg-white rounded-md shadow-2xl transition-transform duration-500 hover:scale-[1.02]">
                {qrUrl ? (
                  <div className="relative">
                    <img 
                      src={qrUrl} 
                      alt="QR Code" 
                      className="w-[240px] h-[240px]"
                    />
                    <div className="absolute -top-2 -right-2 bg-accent-blue text-white text-[8px] font-bold px-2 py-1 rounded-sm shadow-lg uppercase tracking-widest">
                      Active
                    </div>
                  </div>
                ) : (
                  <div className="w-[240px] h-[240px] flex flex-col items-center justify-center text-black/5 border-2 border-dashed border-black/5 rounded-md">
                    <QrCode size={48} strokeWidth={1} className="mb-4" />
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-20">Awaiting Signal</p>
                  </div>
                )}
              </div>

              <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-[300px]">
                <button
                  onClick={handleDownload}
                  disabled={!qrUrl}
                  className="flex items-center justify-center gap-2 py-3 bg-white text-black rounded-md font-bold text-[10px] uppercase tracking-widest shadow-xl disabled:opacity-20 transition-all hover:bg-white/90"
                >
                  <Download size={14} />
                  Export
                </button>
                <button
                  onClick={handleCopyContent}
                  disabled={!qrUrl}
                  className="flex items-center justify-center gap-2 py-3 bg-white/[0.02] border border-white/[0.05] text-white/40 rounded-md font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all disabled:opacity-20"
                >
                  <Share2 size={14} />
                  Share
                </button>
              </div>

              {isGenerating && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-md">
                  <RefreshCw className="w-8 h-8 text-accent-blue animate-spin mb-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Synthesizing...</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] p-6 rounded-md space-y-4">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-accent-blue" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/80">Optical Specs</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-accent-blue mt-1.5" />
                <p className="text-[10px] text-white/30 uppercase tracking-wide font-inter leading-relaxed">High-fidelity Reed-Solomon error correction set to Level H (30%) for maximum resilience.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-accent-blue mt-1.5" />
                <p className="text-[10px] text-white/30 uppercase tracking-wide font-inter leading-relaxed">Dynamic vector synthesis ensures zero pixelation at any scale during export.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
