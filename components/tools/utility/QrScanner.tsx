'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CameraOff, Copy, Check, ExternalLink, RefreshCw, Maximize2, ShieldCheck } from 'lucide-react';
import jsQR from 'jsqr';

export default function QrScanner() {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
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
      <div className="max-w-xl mx-auto relative group">
        <div className="aspect-square relative overflow-hidden bg-black/60 border-2 border-white/10 rounded-3xl shadow-2xl">
          <video 
            ref={videoRef} 
            className={`w-full h-full object-cover ${!scanning && 'hidden'}`}
          />
          <canvas ref={canvasRef} className="hidden" />

          <AnimatePresence>
            {!scanning && !result && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-20 h-20 bg-purple-500/20 rounded-full flex items-center justify-center mb-6">
                  <Camera className="w-10 h-10 text-purple-400" />
                </div>
                <h3 className="text-xl font-syne font-bold mb-2">Camera Access Required</h3>
                <p className="text-white/40 mb-8 max-w-xs">
                  Grant permission to your camera to scan QR codes directly from your browser.
                </p>
                <button
                  onClick={startScanner}
                  className="px-8 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20"
                >
                  Start Scanning
                </button>
              </motion.div>
            )}

            {scanning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 pointer-events-none"
              >
                <div className="absolute inset-0 border-[60px] border-black/40" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-xl" />
                  
                  {/* Scanning line animation */}
                  <motion.div 
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-500 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                  />
                </div>
                <button
                  onClick={stopScanner}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full font-medium backdrop-blur-sm pointer-events-auto transition-all"
                >
                  Stop Scanner
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-red-500/10 backdrop-blur-md">
              <CameraOff className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-red-400 font-bold">{error}</p>
              <button 
                onClick={startScanner}
                className="mt-4 text-white underline"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto space-y-4"
          >
            <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-purple-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Decoded Content
                </span>
                <button
                  onClick={startScanner}
                  className="text-xs text-white/40 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Scan New
                </button>
              </div>
              
              <div className="p-4 bg-black/40 rounded-2xl font-mono text-sm break-all text-white/80 border border-white/5">
                {result}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopy}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-medium border border-white/10 transition-all"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Text
                    </>
                  )}
                </button>
                {isUrl && (
                  <a
                    href={result}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-purple-900/20"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Link
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
