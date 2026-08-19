'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, Shield, CheckCircle2, History, Package, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function ChangelogPage() {
  const releases = [
    {
      version: "v2.4.0",
      date: "August 2026",
      title: "Night X 2.0 Product Transformation & Soft Green Architecture",
      badge: "Major Release",
      badgeVariant: "emerald" as const,
      highlights: [
        "Complete visual identity redesign with Soft Green Neumorphic framework.",
        "Overhauled Universal Tool Runner with responsive workbenches and live tech specifications.",
        "New full-featured Tools Directory (/tools) with instant search, category filtering, and tag exploration.",
        "Brand-new Pricing & Status monitoring hubs with operational transparency.",
        "Enhanced WebAssembly client-side memory safety and zero data leakage guarantees."
      ]
    },
    {
      version: "v2.2.0",
      date: "June 2026",
      title: "AI Workflows Expansion & Image Processor Upgrades",
      badge: "Feature Release",
      badgeVariant: "cyan" as const,
      highlights: [
        "Introduced AI Paraphraser and AI Bio Generator with multi-platform templates.",
        "Integrated client-side background removal with WebAssembly ONNX engine.",
        "Added real-time Markdown preview editor with DOMPurify XSS sanitization.",
        "Added JWT Decoder and UUID v4 bulk generation utilities."
      ]
    },
    {
      version: "v2.0.0",
      date: "March 2026",
      title: "Initial Launch of Night X Utility Platform",
      badge: "Platform Release",
      badgeVariant: "purple" as const,
      highlights: [
        "Launched 35 core browser utilities across image, text, security, and developer domains.",
        "Integrated NextAuth session security and Firestore cloud storage.",
        "Added Command-K instant search palette with fuzzy tool indexing."
      ]
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary-400">
            <History size={13} />
            <span>Platform Evolution</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Changelog & Updates
          </h1>

          <p className="text-sm sm:text-base text-text-tertiary">
            Explore the latest features, engine updates, and architectural enhancements shipped to Night X.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:-translate-x-1/2 before:h-full before:w-0.5 before:bg-white/[0.08]">
          {releases.map((release, i) => (
            <motion.div
              key={release.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative flex flex-col md:flex-row items-start gap-8 group"
            >
              {/* Card */}
              <div className="w-full rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-sm)] space-y-5 hover:border-primary/30 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-primary-400">{release.version}</span>
                    <Badge variant={release.badgeVariant}>
                      {release.badge}
                    </Badge>
                  </div>
                  <span className="text-xs text-text-muted">{release.date}</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white mb-3">{release.title}</h3>
                  <ul className="space-y-2.5">
                    {release.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                        <CheckCircle2 size={13} className="text-primary-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
