"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Coffee, Heart, Loader2, Lock, Star, Zap } from "lucide-react";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      on: (event: string, handler: (response: any) => void) => void;
      open: () => void;
    };
  }
}

export default function SupportPage() {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const paymentsEnabled = Boolean(process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID);

  useEffect(() => {
    if (!paymentsEnabled) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => setStatusMessage("Razorpay checkout could not be loaded on this device.");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [paymentsEnabled]);

  const handlePayment = async () => {
    setStatusMessage("Support & Payment feature is coming soon! Thank you for your interest.");
    return;
  };

  const amounts = [
    { value: 100, label: "Rs 100", icon: <Coffee className="w-5 h-5" /> },
    { value: 500, label: "Rs 500", icon: <Star className="w-5 h-5" /> },
    { value: 1000, label: "Rs 1000", icon: <Zap className="w-5 h-5" /> },
  ];

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background text-white flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/5 border border-white/10 p-12 rounded-3xl text-center max-w-lg w-full backdrop-blur-xl"
        >
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
          <p className="text-white/50 text-lg mb-8">
            Your support helps cover hosting, AI requests, and ongoing maintenance for Night X.
          </p>
          <button
            onClick={() => setPaymentSuccess(false)}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 transition-colors rounded-xl font-medium"
          >
            Support Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="inline-flex p-4 bg-red-500/10 text-red-500 rounded-full mb-6">
            <Heart className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 font-syne">Support Night X</h1>
          <p className="text-xl text-white/50 leading-relaxed max-w-2xl mx-auto font-dm-sans">
            If Night X saves you time, you can support hosting and development here. 
            <br />
            For sponsorship or business inquiries, contact <a href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@night-x.app"}`} className="text-accent-cyan hover:underline">{process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@night-x.app"}</a>.
            <br />
            <span className="inline-block mt-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium animate-pulse">Payment System Coming Soon</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 max-w-xl mx-auto backdrop-blur-xl"
        >
          <div className="grid grid-cols-3 gap-3 mb-6">
            {amounts.map((amt) => (
              <button
                key={amt.value}
                onClick={() => {
                  setSelectedAmount(amt.value);
                  setCustomAmount("");
                }}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                  selectedAmount === amt.value && !customAmount
                    ? "bg-blue-500/20 border-blue-500 text-blue-400"
                    : "bg-white/5 border-white/10 hover:bg-white/10 text-white/60"
                }`}
              >
                <div className="mb-2">{amt.icon}</div>
                <span className="font-medium text-lg">{amt.label}</span>
              </button>
            ))}
          </div>

          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-white/30">
              Rs
            </div>
            <input
              type="number"
              placeholder="Custom Amount"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(0);
              }}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all placeholder:text-white/25"
            />
          </div>

          {statusMessage && (
            <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {statusMessage}
            </div>
          )}

          <button
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-blue-600 to-accent-purple hover:from-blue-500 hover:to-accent-purple/80 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 text-lg shadow-lg shadow-blue-500/25"
          >
            <Heart className="w-5 h-5 fill-current" />
            Support Night X
          </button>

          <p className="mt-4 text-sm text-white/35 flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" /> Payments will be secured via Razorpay
          </p>
        </motion.div>
      </div>
    </div>
  );
}
