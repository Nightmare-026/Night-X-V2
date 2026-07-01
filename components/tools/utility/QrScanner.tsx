'use client';
import { cn } from '@/lib/utils';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Copy, Check, ExternalLink, RefreshCw, Maximize2, ShieldCheck, Upload, Image as ImageIcon } from 'lucide-react';
import jsQR from 'jsqr';

export default function QrScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<number>();

  const startScanner = async () => {
    setScanning(true);
    setResult(null);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        videoRef.current.play();
        requestRef.current = requestAnimationFrame(scanFrame);
      }
    } catch (err: any) {
      setError(err.message || 'Could not access camera');
      setScanning(false);
    }
  };

  const stopScanner = () => {
    setScanning(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code) {
            setResult(code.data);
            setError(null);
          } else {
            setError('No valid QR code detected in this image.');
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current || !scanning) return;

    if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      
      if (context) {
        canvas.height = videoRef.current.videoHeight;
        canvas.width = videoRef.current.videoWidth;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });

        if (code) {
          setResult(code.data);
          stopScanner();
          return;
        }
      }
    }
    requestRef.current = requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    return () => stopScanner();
  }, []);

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isUrl = result?.startsWith('http') || result?.startsWith('https');

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Primary Viewport Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md overflow-hidden relative min-h-[500px] flex items-center justify-center">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} 
            />

            <video 
              ref={videoRef} 
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-700",
                scanning ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
            />
            <canvas ref={canvasRef} className="hidden" />

            <AnimatePresence mode="wait">
              {!scanning && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="relative z-10 w-full max-w-md p-8 text-center space-y-8"
                >
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-accent-blue/20 blur-2xl rounded-full" />
                    <div className="relative w-20 h-20 bg-accent-blue/10 rounded-md border border-accent-blue/30 flex items-center justify-center mx-auto mb-2">
                      <Camera className="w-10 h-10 text-accent-blue" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Optical Intake</h3>
                    <p className="text-[10px] font-inter font-medium text-white/30 uppercase tracking-[0.2em] leading-relaxed">
                      Initialize the camera or provide a high-resolution image to begin the decryption sequence.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={startScanner}
                      className="w-full py-4 bg-white text-black rounded-md font-bold text-[10px] uppercase tracking-widest hover:bg-white/90 transition-all shadow-xl flex items-center justify-center gap-2"
                    >
                      <Camera size={14} />
                      Initialize Scanner
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-4 bg-white/[0.02] border border-white/[0.05] text-white/40 rounded-md font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Upload size={14} />
                      Upload Payload
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileUpload}
                    />
                  </div>
                </motion.div>
              )}

              {scanning && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 pointer-events-none z-20"
                >
                  <div className="absolute inset-0 border-[40px] md:border-[80px] border-black/40 backdrop-blur-[2px]" />
                  
                  {/* Reticle */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80">
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-accent-blue rounded-tl-md" />
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-accent-blue rounded-tr-md" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-accent-blue rounded-bl-md" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-accent-blue rounded-br-md" />
                    
                    {/* Scanning line animation */}
                    <motion.div 
                      animate={{ top: ['10%', '90%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute left-[10%] right-[10%] h-[1px] bg-accent-blue shadow-[0_0_20px_rgba(59,130,246,1)] z-30"
                    />
                  </div>

                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-auto">
                    <button
                      onClick={stopScanner}
                      className="px-8 py-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-md text-[10px] font-bold uppercase tracking-widest backdrop-blur-md hover:bg-red-500/20 transition-all"
                    >
                      Terminate Session
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 bg-black/90 backdrop-blur-xl space-y-6">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <CameraOff className="w-8 h-8 text-red-500" />
                </div>
                <div className="text-center space-y-2">
                  <h4 className="text-sm font-outfit font-bold text-white uppercase tracking-widest">Access Denied</h4>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest leading-relaxed max-w-xs mx-auto">{error}</p>
                </div>
                <button 
                  onClick={startScanner}
                  className="px-6 py-2 bg-white text-black rounded-md text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  Re-Attempt
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results / Sidebar Area */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-accent-blue" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-white/80">Decoded Payload</h3>
              </div>
              {result && (
                <button
                  onClick={() => setResult(null)}
                  className="text-[10px] text-white/20 hover:text-white uppercase font-bold tracking-widest transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="p-4 bg-black/40 rounded-md border border-white/[0.05] font-mono text-[11px] break-all text-white/80 leading-relaxed min-h-[120px]">
                    {result}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <button
                      onClick={handleCopy}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white/[0.02] border border-white/[0.05] text-white/40 rounded-md font-bold text-[10px] uppercase tracking-widest hover:text-white transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-green-400" />
                          <span className="text-green-400">Copied to Buffer</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Duplicate to Clipboard
                        </>
                      )}
                    </button>
                    {isUrl && (
                      <a
                        href={result}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 bg-accent-blue text-white rounded-md font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-accent-blue/10 hover:bg-accent-blue/90 transition-all"
                      >
                        <ExternalLink size={12} />
                        Execute Navigation
                      </a>
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 opacity-20">
                  <Maximize2 size={32} strokeWidth={1} />
                  <p className="text-[10px] font-bold uppercase tracking-widest max-w-[140px]">
                    Awaiting scan or payload upload...
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-6 space-y-4">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-accent-blue" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/80">Optimization</h4>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-accent-blue mt-1.5" />
                <p className="text-[10px] text-white/30 uppercase tracking-wide font-inter leading-relaxed">Ensure adequate lighting and high-contrast environments for instant decryption.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1 h-1 rounded-full bg-accent-blue mt-1.5" />
                <p className="text-[10px] text-white/30 uppercase tracking-wide font-inter leading-relaxed">Supported formats include URL, WiFi, plain text, and contact cards.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
