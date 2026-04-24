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
  const { addToast } = useToast();
  const [type, setType] = useState<QRType>('url');
  const [input, setInput] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(300);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // WiFi specific states
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
      addToast("Failed to generate QR code", "error");
    } finally {
      setIsGenerating(false);
    }
  }, [input, type, color, bgColor, size, ssid, password, encryption, addToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateQR();
    }, 400);
    return () => clearTimeout(timer);
  }, [generateQR]);

  const handleDownload = () => {
    if (!qrUrl) return;
    downloadFile(qrUrl, `nightx-qr-${Date.now()}.png`);
    addToast("QR Code downloaded successfully!", "success");
  };

  const handleCopyContent = async () => {
    const content = type === 'wifi' ? `SSID: ${ssid}` : input;
    const success = await copyToClipboard(content);
    if (success) {
      addToast("Content copied to clipboard", "success");
    }
  };

  const handleReset = () => {
    setInput('');
    setSsid('');
    setPassword('');
    setQrUrl('');
    addToast("Fields cleared", "info");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Input Configuration Panel (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden"
          >
            <div className="p-8 space-y-8">
              {/* Type Selector */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-accent-purple/10 text-accent-purple">
                    <Smartphone size={18} />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">Select Content Type</h3>
                </div>
                
                <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                  {(['url', 'text', 'wifi'] as QRType[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      className={cn(
                        "flex-1 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2",
                        type === t 
                          ? "bg-accent-purple text-white shadow-lg shadow-accent-purple/20" 
                          : "text-white/40 hover:text-white/60 hover:bg-white/5"
                      )}
                    >
                      {t === 'url' && <LinkIcon size={14} />}
                      {t === 'text' && <Type size={14} />}
                      {t === 'wifi' && <Wifi size={14} />}
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Inputs */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {type === 'wifi' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Network Name (SSID)</label>
                        <input
                          type="text"
                          value={ssid}
                          onChange={(e) => setSsid(e.target.value)}
                          placeholder="My Home WiFi"
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-accent-purple transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Password</label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-accent-purple transition-all"
                        />
                      </div>
                      <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Encryption</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['WPA', 'WEP', 'nopass'].map((enc) => (
                            <button
                              key={enc}
                              onClick={() => setEncryption(enc)}
                              className={cn(
                                "py-3 rounded-xl text-[10px] font-bold border transition-all",
                                encryption === enc 
                                  ? "bg-accent-purple/20 border-accent-purple text-accent-purple" 
                                  : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
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
                      <label className="text-[10px] font-bold text-white/40 uppercase ml-2">
                        {type === 'url' ? 'Destination URL' : 'Content Text'}
                      </label>
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={type === 'url' ? 'https://example.com' : 'Enter your message here...'}
                        className="w-full h-40 bg-black/40 border border-white/10 rounded-3xl p-5 text-sm focus:outline-none focus:border-accent-purple transition-all resize-none"
                      />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-bold hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/5"
                >
                  <Trash2 size={14} />
                  Reset
                </button>
                <button
                  onClick={handleCopyContent}
                  disabled={!input && !ssid}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 text-white/60 text-xs font-bold hover:bg-white/10 hover:text-white transition-all border border-white/5 disabled:opacity-50"
                >
                  <Copy size={14} />
                  Copy Input
                </button>
              </div>
            </div>
          </motion.div>

          {/* Customization Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent-cyan/10 text-accent-cyan">
                  <Palette size={18} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">Customization</h3>
              </div>
              <div className="text-[10px] font-bold text-white/20 bg-white/5 px-2 py-1 rounded-md uppercase">
                High Quality
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] text-white/40 uppercase font-bold block ml-1">Color Palette</label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-[9px] text-white/20 uppercase font-bold ml-1">Foreground</span>
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-white/10">
                      <input 
                        type="color" 
                        value={color} 
                        onChange={(e) => setColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none"
                      />
                      <span className="text-xs font-mono text-white/60">{color.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[9px] text-white/20 uppercase font-bold ml-1">Background</span>
                    <div className="flex items-center gap-3 bg-black/40 p-3 rounded-2xl border border-white/10">
                      <input 
                        type="color" 
                        value={bgColor} 
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-none"
                      />
                      <span className="text-xs font-mono text-white/60">{bgColor.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-[10px] text-white/40 uppercase font-bold ml-1">
                  <span>Dimension</span>
                  <span className="text-accent-cyan">{size}x{size}px</span>
                </div>
                <div className="p-6 bg-black/40 rounded-3xl border border-white/10">
                  <input 
                    type="range" 
                    min="100" 
                    max="1000" 
                    step="50"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full accent-accent-purple"
                  />
                  <div className="flex justify-between mt-2 px-1">
                    <span className="text-[8px] text-white/20 font-bold">100px</span>
                    <span className="text-[8px] text-white/20 font-bold">1000px</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Preview Panel (5 Columns) */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 p-8 rounded-[40px] border border-white/10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group min-h-[500px]"
          >
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-purple/10 blur-[120px] rounded-full group-hover:bg-accent-purple/20 transition-all duration-1000" />
            
            <div className="relative z-10 w-full flex flex-col items-center">
              <div className="mb-8">
                <div className="text-[10px] font-black tracking-[0.2em] text-accent-cyan uppercase mb-2">Live Preview</div>
                <h2 className="text-xl font-bold font-syne">Generated QR</h2>
              </div>

              <div className="relative p-8 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] group-hover:scale-[1.02] transition-transform duration-500">
                {qrUrl ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative"
                  >
                    <img 
                      src={qrUrl} 
                      alt="QR Code" 
                      className="w-full max-w-[280px] aspect-square rounded-xl"
                    />
                    <div className="absolute -top-3 -right-3 bg-accent-cyan text-black text-[9px] font-black px-2 py-1 rounded-lg shadow-lg uppercase tracking-tighter">
                      Ready
                    </div>
                  </motion.div>
                ) : (
                  <div className="w-[280px] h-[280px] flex flex-col items-center justify-center text-black/10 border-4 border-dashed border-black/5 rounded-2xl">
                    <QrCode size={64} strokeWidth={1} className="mb-4 opacity-50" />
                    <p className="text-xs font-bold uppercase tracking-widest opacity-40 px-8">Waiting for input...</p>
                  </div>
                )}
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4 w-full">
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownload}
                  disabled={!qrUrl}
                  className="flex items-center justify-center gap-3 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl disabled:opacity-30 disabled:grayscale transition-all"
                >
                  <Download size={16} />
                  Download
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyContent}
                  disabled={!qrUrl}
                  className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-all disabled:opacity-30"
                >
                  <Share2 size={16} />
                  Share
                </motion.button>
              </div>

              {isGenerating && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-[40px]">
                  <RefreshCw className="w-10 h-10 text-accent-purple animate-spin mb-4" />
                  <span className="text-xs font-bold uppercase tracking-widest text-white/70">Refining QR...</span>
                </div>
              )}
            </div>
          </motion.div>

          <div className="bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 p-6 rounded-[32px] border border-white/10 space-y-3">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-white/40">
              <Settings2 className="w-4 h-4 text-accent-cyan" />
              Scan Optimization
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-[11px] text-white/50">
                <div className="w-1 h-1 rounded-full bg-accent-cyan mt-1.5 shrink-0" />
                <p>High contrast colors (dark foreground on light background) provide the fastest scan rates.</p>
              </div>
              <div className="flex items-start gap-2 text-[11px] text-white/50">
                <div className="w-1 h-1 rounded-full bg-accent-cyan mt-1.5 shrink-0" />
                <p>Error correction is set to <span className="text-white/70 font-bold">Level H (30%)</span>, allowing for logos or damage.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
