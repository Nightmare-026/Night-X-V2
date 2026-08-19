'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Lock, EyeOff, Database, Mail } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. What We Collect",
      icon: <Database className="w-5 h-5 text-primary-400" />,
      content: "When using Night X in public mode, no personal information or files are collected. If you choose to create an optional account, we store minimal identity details (name, email address, profile image) for authentication."
    },
    {
      title: "2. Client-Side Processing Architecture",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      content: "All 40+ non-AI tools (including image compressors, converters, hash calculators, and code beautifiers) execute entirely within your browser memory. Your files are not uploaded to remote servers or logged."
    },
    {
      title: "3. AI Features & Server Communication",
      icon: <Lock className="w-5 h-5 text-accent-cyan" />,
      content: "When you explicitly use an AI feature (such as AI Paraphraser or AI Assistant), your prompt is sent via encrypted HTTPS to our AI gateway to generate responses. We do not use your inputs to train public foundational models."
    },
    {
      title: "4. No Advertising & No Data Brokers",
      icon: <EyeOff className="w-5 h-5 text-accent-amber" />,
      content: "Night X is a sovereign utility platform. We do not display third-party ads, nor do we sell, rent, or trade your data with analytics brokers or advertising networks."
    }
  ];

  return (
    <div className="min-h-screen text-white pt-16 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <ShieldCheck size={14} />
            <span>Privacy Standard & Data Protection</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>

          <p className="text-sm text-text-tertiary">
            Clear, transparent commitments regarding data processing, client-side isolation, and account confidentiality.
          </p>
        </div>

        <div className="grid gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-sm)] space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-inset border border-white/10 flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-lg font-bold text-white">
                  {section.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-13">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="p-8 rounded-2xl border border-primary/20 bg-surface-card text-center space-y-3 shadow-[var(--shadow-raised-sm)]">
          <h3 className="text-base font-bold text-white">Data Requests & Account Inquiries</h3>
          <p className="text-xs text-text-tertiary max-w-xl mx-auto leading-relaxed">
            To request account deletion or submit a privacy inquiry, contact the Night X engineering team:
          </p>
          <a href="mailto:support@night-x.app" className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary-400 hover:underline">
            <Mail size={14} /> support@night-x.app
          </a>
        </div>
      </div>
    </div>
  );
}
