'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, Database, Mail } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. What We Collect",
      icon: <Database className="w-4 h-4 text-primary" />,
      content: "When using Night X in public mode, no personal information or files are collected. If you choose to create an optional account, we store minimal identity details (name, email address, profile image) for session personalization."
    },
    {
      title: "2. Client-Side Processing Architecture",
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      content: "All 42 non-AI tools (including image compressors, converters, hash calculators, and code beautifiers) execute entirely within your local browser memory. Your files are not uploaded to remote servers or logged."
    },
    {
      title: "3. AI Features & Server Communication",
      icon: <Lock className="w-4 h-4 text-accent-cyan" />,
      content: "When you explicitly use an AI feature (such as AI Paraphraser or AI Assistant), your prompt is sent via encrypted HTTPS to our AI gateway to generate responses. We do not use your inputs to train public foundational models."
    },
    {
      title: "4. Zero Advertising & Zero Data Brokers",
      icon: <EyeOff className="w-4 h-4 text-amber-400" />,
      content: "Night X is a sovereign utility platform. We do not display third-party ads, nor do we sell, rent, or trade your data with analytics brokers or advertising networks."
    }
  ];

  return (
    <div className="min-h-screen text-white pt-24 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <ShieldCheck size={13} />
            <span>Privacy Standard & Data Protection</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm text-text-tertiary">
            Clear, transparent commitments regarding data processing, client-side isolation, and account confidentiality.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5">
          {sections.map((section, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-7 shadow-[var(--shadow-raised-sm)] space-y-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-surface-inset border border-white/10 flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {section.title}
                </h2>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed pl-10">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="p-6 sm:p-7 rounded-2xl border border-primary/20 bg-surface-card text-center space-y-2.5 shadow-[var(--shadow-raised-sm)]">
          <h3 className="text-sm sm:text-base font-bold text-white">Data Requests & Inquiries</h3>
          <p className="text-xs text-text-tertiary max-w-xl mx-auto leading-relaxed">
            To request account deletion or submit a privacy inquiry, contact the Night X engineering team:
          </p>
          <a href="mailto:support@night-x-v2.vercel.app" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary hover:underline">
            <Mail size={13} /> support@night-x-v2.vercel.app
          </a>
        </div>
      </div>
    </div>
  );
}
