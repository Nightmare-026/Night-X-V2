'use client';

import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import { motion } from 'framer-motion';
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
  Image as ImageIcon
} from 'lucide-react';

type QRType = 'text' | 'url' | 'wifi';

export default function QrGenerator() {
  const [type, setType] = useState<QRType>('url');
  const [input, setInput] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [color, setColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(300);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // WiFi specific states
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [encryption, setEncryption] = useState('WPA');

  const generateQR = React.useCallback(async () => {
    let data = input;
    if (type === 'wifi') {
      data = `WIFI:T:${encryption};S:${ssid};P:${password};;`;
    }

    if (!data && type !== 'wifi') {
      setQrUrl('');
      return;
    }

    try {
      const url = await QRCode.toDataURL(data || 'Night X', {
        width: size,
        margin: 2,
        color: {
          dark: color,
          light: bgColor,
        },
      });
      setQrUrl(url);
    } catch (err) {
      console.error(err);
    }
  }, [input, type, color, bgColor, size, ssid, password, encryption]);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateQR();
    }, 300);
    return () => clearTimeout(timer);
  }, [generateQR]);

  const downloadQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Configuration Side */}
        <div className="space-y-6">
          <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-6">
            <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/5">
              {(['url', 'text', 'wifi'] as QRType[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    type === t ? 'bg-accent-purple text-white shadow-lg' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {t === 'url' && <LinkIcon className="w-3 h-3" />}
                  {t === 'text' && <Type className="w-3 h-3" />}
                  {t === 'wifi' && <Wifi className="w-3 h-3" />}
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {type === 'wifi' ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Network Name (SSID)</label>
                    <input
                      type="text"
                      value={ssid}
                      onChange={(e) => setSsid(e.target.value)}
                      placeholder="My Home WiFi"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-white/40 uppercase ml-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['WPA', 'WEP', 'nopass'].map((enc) => (
                      <button
                        key={enc}
                        onClick={() => setEncryption(enc)}
                        className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${
                          encryption === enc ? 'bg-accent-purple/20 border-accent-purple text-accent-purple' : 'bg-white/5 border-white/10 text-white/40'
                        }`}
                      >
                        {enc === 'nopass' ? 'None' : enc}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 animate-in fade-in">
                  <label className="text-[10px] font-bold text-white/40 uppercase ml-2">
                    {type === 'url' ? 'Destination URL' : 'Content Text'}
                  </label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={type === 'url' ? 'https://example.com' : 'Enter message...'}
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-[32px] border border-white/10 space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-4 h-4 text-accent-cyan" />
              <h3 className="text-sm font-bold">Customization</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase block ml-1">QR Color</label>
                <div className="flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/10">
                  <input 
                    type="color" 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-xs font-mono text-white/60">{color.toUpperCase()}</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-white/40 uppercase block ml-1">Background</label>
                <div className="flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/10">
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-none"
                  />
                  <span className="text-xs font-mono text-white/60">{bgColor.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-[10px] text-white/40 uppercase ml-1">
                <span>Size</span>
                <span>{size}px</span>
              </div>
              <input 
                type="range" 
                min="100" 
                max="1000" 
                step="50"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-accent-purple"
              />
            </div>
          </div>
        </div>

        {/* Preview Side */}
        <div className="sticky top-24 space-y-6">
          <div className="bg-white/5 p-8 rounded-[40px] border border-white/10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-purple/20 blur-[100px] rounded-full group-hover:bg-accent-purple/30 transition-all duration-700" />
            
            <div className="relative z-10 p-6 bg-white rounded-3xl shadow-2xl">
              {qrUrl ? (
                <motion.img 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={qrUrl} 
                  alt="QR Code" 
                  className="w-full max-w-[300px] aspect-square rounded-xl"
                />
              ) : (
                <div className="w-[300px] h-[300px] flex flex-col items-center justify-center text-black/10 border-4 border-dashed border-black/5 rounded-xl">
                  <QrCode className="w-20 h-20 mb-4" />
                  <p className="text-sm font-bold italic">Preview will appear here</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-4 relative z-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadQR}
                disabled={!qrUrl}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-2xl font-bold shadow-xl disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </motion.button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-6 rounded-[32px] border border-white/10">
            <h4 className="text-xs font-bold mb-3 flex items-center gap-2 text-cyan-400">
              <Settings2 className="w-4 h-4" />
              Dynamic QR Tips
            </h4>
            <ul className="text-[11px] text-white/50 space-y-2 list-disc pl-4">
              <li>High contrast colors (dark on light) ensure better scan rates.</li>
              <li>Keep URLs short for simpler, cleaner QR patterns.</li>
              <li>WiFi QR codes let guests join your network without typing passwords.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
