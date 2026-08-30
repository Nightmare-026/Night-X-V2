'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, ShieldCheck, ArrowRight, Heart } from 'lucide-react';

export default function PricingPage() {
  const features = [
    "All 42 In-Browser Client Tools",
    "100% In-Memory Privacy (Zero Cloud Storage)",
    "Unlimited Client-Side Operations",
    "SubtleCrypto Cryptographic Hashes & Obfuscation",
    "WASM High-Speed Image Processing",
    "AI Workflow Assistant Integration",
    "Private Link Shortener with Analytics",
    "Saved Favorites & Execution History",
    "Zero Ads, Zero Trackers, Zero Paywalls",
  ];

  const faqs = [
    {
      q: "Is Night X really 100% free?",
      a: "Yes. All 42 tools and workspace capabilities run free of charge. There are no surprise credit card prompts, paywalls, or gated tiers."
    },
    {
      q: "How can Night X afford to be free?",
      a: "Because 95% of Night X tools execute directly on your device using WebAssembly and Web Crypto API, our cloud server load is minimal. We don't bear heavy server compute costs for operations your browser can handle locally."
    },
    {
      q: "Is my data stored or tracked on servers?",
      a: "No. Your images, files, passwords, code snippets, and payloads never leave your browser memory. Processing runs in transient browser memory."
    },
    {
      q: "Do I need an account to use the tools?",
      a: "No. 12 essential tools are instantly accessible without signing in. Creating a free account unlocks favorites persistence, history tracking, and the AI assistant."
    }
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-[1100px] mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Heart size={12} className="fill-primary" />
            <span>Open & Free Workspace</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            100% Free Sovereign Tools
          </h1>

          <p className="text-xs sm:text-sm text-text-tertiary max-w-lg mx-auto leading-relaxed">
            No subscriptions, no hidden tiers, and no monetization of your personal data. Built for productivity and privacy.
          </p>
        </div>

        {/* Free Plan Card */}
        <div className="max-w-xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-b from-surface-elevated to-surface-card p-6 sm:p-10 shadow-[var(--shadow-raised-md)] relative overflow-hidden space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Free Forever</span>
              <h2 className="text-xl sm:text-2xl font-black text-white">Universal Workspace Plan</h2>
            </div>
            <div className="text-right">
              <span className="text-3xl sm:text-4xl font-black text-white">$0</span>
              <span className="text-xs text-text-muted block">forever</span>
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Full access to the complete digital suite of image converters, developer utilities, cryptographic instruments, and text formatters.
          </p>

          <div className="space-y-3 pt-2 border-t border-white/[0.06]">
            <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider">What's Included</p>
            <ul className="grid gap-2.5 sm:grid-cols-1">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5 text-xs text-text-secondary">
                  <div className="w-4 h-4 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <Check size={10} />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <Link
              href="/tools"
              className="btn-primary flex-1 text-center text-xs font-bold py-3 shadow-md flex items-center justify-center gap-1.5"
            >
              <span>Explore All 42 Tools</span>
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/auth/signup"
              className="btn-secondary flex-1 text-center text-xs font-bold py-3 flex items-center justify-center gap-1.5"
            >
              <span>Create Free Account</span>
            </Link>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-6 pt-4">
          <h3 className="text-lg sm:text-xl font-bold text-white text-center">Frequently Asked Questions</h3>
          <div className="grid gap-3.5 sm:grid-cols-2">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/[0.06] bg-surface-card space-y-1.5 shadow-sm">
                <h4 className="text-xs sm:text-sm font-bold text-white">{faq.q}</h4>
                <p className="text-xs text-text-tertiary leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
