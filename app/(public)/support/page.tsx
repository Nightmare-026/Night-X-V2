'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Coffee, Heart, Star, Zap, Lock, Mail, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function SupportPage() {
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@night-x.app";

  const handleSupportClick = () => {
    setStatusMessage("Direct credit card and UPI payments are undergoing verification. If you wish to sponsor infrastructure or donate, please email us directly.");
  };

  const amounts = [
    { value: 100, label: "Rs 100", icon: <Coffee className="w-5 h-5" /> },
    { value: 500, label: "Rs 500", icon: <Star className="w-5 h-5" /> },
    { value: 1000, label: "Rs 1000", icon: <Zap className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen text-white pt-16 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pt-6"
        >
          <div className="inline-flex p-3.5 bg-primary/10 text-primary-400 border border-primary/20 rounded-2xl mb-2 shadow-sm">
            <Heart className="w-7 h-7 fill-current" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">Support Night X</h1>
          <p className="text-sm sm:text-base text-text-tertiary max-w-xl mx-auto leading-relaxed">
            If Night X saves you hours of work each week, you can support continuous open-source maintenance, domain hosting, and AI inference quotas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-white/[0.08] bg-surface-card p-6 sm:p-10 shadow-[var(--shadow-raised-md)] max-w-xl mx-auto space-y-6 text-left"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Choose Contribution Tier</label>
            <div className="grid grid-cols-3 gap-3">
              {amounts.map((amt) => (
                <button
                  key={amt.value}
                  onClick={() => {
                    setSelectedAmount(amt.value);
                    setCustomAmount("");
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                    selectedAmount === amt.value && !customAmount
                      ? "bg-primary/20 border-primary text-primary-300 shadow-[var(--shadow-raised-sm)]"
                      : "bg-surface-inset border-white/10 hover:border-white/20 text-text-tertiary"
                  }`}
                >
                  <div className="mb-2 text-primary-400">{amt.icon}</div>
                  <span className="font-bold text-sm text-white">{amt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Or Custom Amount (INR)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-muted text-sm font-bold">
                Rs
              </div>
              <input
                type="number"
                placeholder="Enter custom amount"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  setSelectedAmount(0);
                }}
                className="w-full bg-surface-inset border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 text-sm transition-all placeholder:text-text-muted shadow-[var(--shadow-inset-sm)]"
              />
            </div>
          </div>

          {statusMessage && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-4 text-xs text-primary-200 leading-relaxed">
              {statusMessage}
            </div>
          )}

          <Button
            onClick={handleSupportClick}
            variant="primary"
            className="w-full text-xs font-bold py-3.5 shadow-md"
          >
            <Heart className="w-4 h-4 fill-current mr-2" />
            Support Night X Platform
          </Button>

          <div className="pt-2 text-center text-[11px] text-text-muted flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-primary-400" />
            <span>Direct sponsor inquiries: <a href={`mailto:${supportEmail}`} className="text-primary-400 hover:underline">{supportEmail}</a></span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
