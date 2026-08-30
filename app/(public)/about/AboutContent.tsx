'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Zap, Layers, ArrowRight, Lock } from 'lucide-react';
import Link from 'next/link';

export default function AboutContent() {
  const principles = [
    {
      icon: <Zap className="w-5 h-5 text-primary" />,
      title: "Zero Latency Execution",
      description: "Built on high-performance browser APIs, WebAssembly, and WebWorkers for instant local tool responsiveness without server delay."
    },
    {
      icon: <Lock className="w-5 h-5 text-emerald-400" />,
      title: "100% In-Browser Privacy",
      description: "Your files, images, code, and cryptographic payloads stay strictly on your physical device. Zero remote background logging."
    },
    {
      icon: <Layers className="w-5 h-5 text-accent-cyan" />,
      title: "Unified Ecosystem",
      description: "42+ curated instruments in a single cohesive workspace without intrusive ads, paywalls, or bloated dependencies."
    }
  ];

  const stats = [
    { label: "Client Tools", value: "42" },
    { label: "Server Delay", value: "0ms" },
    { label: "Data Leakage", value: "0%" },
    { label: "Tool Suites", value: "7" }
  ];

  return (
    <div className="min-h-screen text-white pt-24 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <section className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl border border-primary/20 text-primary shadow-sm">
            <Rocket className="w-6 h-6" />
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            About <span className="text-primary">Night X</span>
          </h1>

          <p className="text-xs sm:text-sm text-text-tertiary max-w-2xl mx-auto leading-relaxed">
            The workspace for everyday digital work. Practical utilities engineered for instant speed, guaranteed privacy, and delightful simplicity.
          </p>
        </section>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {stats.map((s, i) => (
            <div key={i} className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-surface-card text-center shadow-[var(--shadow-raised-sm)]">
              <span className="text-2xl sm:text-3xl font-black text-primary block font-mono">{s.value}</span>
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mt-1 block">{s.label}</span>
            </div>
          ))}
        </div>

        {/* The Mission */}
        <section className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-sm)] relative overflow-hidden space-y-3">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/4 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Our Mission & Engineering Philosophy</h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Every day, millions of creators and engineers open ad-ridden websites just to format a block of JSON, resize an image, generate a UUID, or calculate an EMI. Many of these services compromise privacy by sending private user files to unverified backend servers.
          </p>
          <p className="text-xs text-text-secondary leading-relaxed">
            Night X was created to provide a sovereign, desktop-grade workspace that runs directly inside the modern web browser. With zero installations, instant keyboard search (⌘K), and local WebAssembly processing, Night X puts privacy and speed first.
          </p>
        </section>

        {/* Core Principles */}
        <section className="space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-center text-white tracking-tight">Core Architecture Principles</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {principles.map((p, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border border-white/[0.08] bg-surface-card shadow-[var(--shadow-raised-sm)] space-y-2.5 hover:border-primary/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-surface-inset border border-white/10 flex items-center justify-center">
                  {p.icon}
                </div>
                <h3 className="text-sm font-bold text-white">{p.title}</h3>
                <p className="text-xs text-text-tertiary leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-2">
          <Link href="/tools" className="btn-primary text-xs py-3 px-8 shadow-md inline-flex items-center gap-2">
            <span>Explore All 42 Tools</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
}
