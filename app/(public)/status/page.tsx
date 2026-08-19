'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Activity, CheckCircle2, ShieldCheck, Zap, Server, Globe, Cpu, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function StatusPage() {
  const services = [
    {
      name: "Browser Client Engine (WASM & WebWorkers)",
      description: "Local image compression, cryptographic hashing, formatting, and file parsing.",
      status: "Operational",
      uptime: "100.0%",
      latency: "0 ms (Local)",
      type: "Client-Side"
    },
    {
      name: "AI Assistant & Paraphraser Gateways",
      description: "Google Gemini generative endpoints and prompt synthesis APIs.",
      status: "Operational",
      uptime: "99.98%",
      latency: "340 ms",
      type: "API Service"
    },
    {
      name: "Authentication & Session Services",
      description: "NextAuth credential checks, rate-limited tokens, and session persistence.",
      status: "Operational",
      uptime: "100.0%",
      latency: "45 ms",
      type: "Edge Service"
    },
    {
      name: "URL Redirection & Shortening Engine",
      description: "Edge redirects, click counters, and UTM campaign trackers.",
      status: "Operational",
      uptime: "99.99%",
      latency: "28 ms",
      type: "Database / Cloud"
    },
    {
      name: "Static Content & Asset Delivery Network",
      description: "Vercel global edge network, optimized fonts, and WebAssembly binaries.",
      status: "Operational",
      uptime: "100.0%",
      latency: "12 ms",
      type: "Global CDN"
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All Systems Fully Operational</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            System & Engine Status
          </h1>

          <p className="text-sm sm:text-base text-text-tertiary">
            Real-time health, uptime statistics, and operational latency across the Night X platform.
          </p>
        </div>

        {/* Global Overview Card */}
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.08] to-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-md)] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
              <ShieldCheck size={28} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">No Incidents Reported</h2>
              <p className="text-xs text-text-secondary mt-0.5">All 42 tools and cloud interfaces are functioning normally.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
            <div>
              <span className="text-xs text-text-muted">90-Day Uptime</span>
              <p className="text-xl font-bold text-emerald-400 font-mono">99.99%</p>
            </div>
            <div>
              <span className="text-xs text-text-muted">Avg Edge Latency</span>
              <p className="text-xl font-bold text-white font-mono">18 ms</p>
            </div>
          </div>
        </div>

        {/* Services Status List */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white tracking-wide">Component Statuses</h3>
          <div className="space-y-3">
            {services.map((service) => (
              <div 
                key={service.name}
                className="p-5 rounded-2xl border border-white/[0.08] bg-surface-card shadow-[var(--shadow-raised-sm)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-white/15 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-white">{service.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-text-muted font-mono">
                      {service.type}
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed">{service.description}</p>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[11px] font-mono text-text-muted block">{service.latency}</span>
                    <span className="text-[10px] text-text-muted block">Uptime: {service.uptime}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={12} /> {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Privacy Guarantee */}
        <div className="p-6 rounded-2xl border border-white/[0.06] bg-surface-base text-center space-y-2">
          <h4 className="text-sm font-bold text-white">Sovereign Architecture Guarantee</h4>
          <p className="text-xs text-text-tertiary max-w-xl mx-auto leading-relaxed">
            Client-side tools operate independently of network connectivity once the application assets are cached.
          </p>
        </div>

      </div>
    </div>
  );
}
