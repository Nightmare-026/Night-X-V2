'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Zap, Globe, Heart, Shield, Layers, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function AboutContent() {
  const principles = [
    {
      icon: <Zap className="w-6 h-6 text-primary-400" />,
      title: "Zero Latency Execution",
      description: "Built on high-performance browser APIs, WebAssembly, and WebWorkers for instant local tool responsiveness."
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      title: "Sovereign Privacy",
      description: "Your files, images, code, and cryptographic keys stay on your physical device. Zero background transmission."
    },
    {
      icon: <Layers className="w-6 h-6 text-accent-cyan" />,
      title: "Unified Ecosystem",
      description: "42+ curated utilities in a single cohesive workspace without ads, popups, or bloated dependencies."
    }
  ];

  const stats = [
    { label: "Client Tools", value: "42+" },
    { label: "Server Delay", value: "0ms" },
    { label: "Data Leakage", value: "0%" },
    { label: "Ecosystem Suites", value: "7" }
  ];

  return (
    <div className="min-h-screen text-white pt-16 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Hero Section */}
        <section className="text-center space-y-4 pt-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center justify-center p-3.5 bg-primary/10 rounded-2xl mb-4 border border-primary/20 text-primary-400 shadow-sm"
          >
            <Rocket className="w-8 h-8" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-5xl font-black text-white tracking-tight"
          >
            About <span className="text-primary-400">Night X</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm sm:text-base text-text-tertiary max-w-2xl mx-auto leading-relaxed"
          >
            Practical utility tools built for speed, privacy, and delightful simplicity. Night X empowers creators and engineers with sovereign in-browser productivity.
          </motion.p>
        </section>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="p-5 rounded-2xl border border-white/[0.08] bg-surface-card text-center shadow-[var(--shadow-raised-sm)]">
              <span className="text-2xl sm:text-3xl font-black text-primary-400 block font-mono">{s.value}</span>
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider mt-1 block">{s.label}</span>
            </div>
          ))}
        </div>

        {/* The Mission */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/[0.08] bg-surface-card p-8 sm:p-10 shadow-[var(--shadow-raised-md)] relative overflow-hidden space-y-4"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Our Mission & Engineering Philosophy</h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Every day, millions of people open cluttered, ad-ridden websites just to format a block of JSON, resize an image, generate a UUID, or calculate an EMI. Many of these websites compromise privacy by sending private user files to unverified backend servers.
          </p>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
            Night X was born out of a desire to build a sovereign, desktop-grade workspace that runs directly inside the modern web browser. With zero installations, instant keyboard search (⌘K), and local WebAssembly processing, Night X gives you full power over your digital workflow.
          </p>
        </motion.section>

        {/* Core Principles */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-center text-white tracking-tight">Core Architecture Principles</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {principles.map((p, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="p-6 rounded-2xl border border-white/[0.08] bg-surface-card shadow-[var(--shadow-raised-sm)] space-y-3 hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-surface-inset border border-white/10 flex items-center justify-center">
                  {p.icon}
                </div>
                <h3 className="text-base font-bold text-white">{p.title}</h3>
                <p className="text-xs text-text-tertiary leading-relaxed">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link href="/tools" className="btn-primary text-xs py-3 px-8 shadow-md inline-flex items-center gap-2">
            <span>Explore All 42 Tools</span>
            <ArrowRight size={14} />
          </Link>
        </div>

      </div>
    </div>
  );
}
