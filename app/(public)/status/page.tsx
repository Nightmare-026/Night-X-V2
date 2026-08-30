'use client';

import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

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
      type: "API Gateway"
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
      description: "Global edge network, optimized fonts, and WebAssembly binaries.",
      status: "Operational",
      uptime: "100.0%",
      latency: "12 ms",
      type: "Global CDN"
    }
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>All Systems Fully Operational</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            System & Engine Status
          </h1>

          <p className="text-xs sm:text-sm text-text-tertiary">
            Operational health, uptime statistics, and processing latency across the Night X platform.
          </p>
        </div>

        {/* Global Overview Card */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.08] to-surface-card p-5 sm:p-7 shadow-[var(--shadow-raised-sm)] flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">No Active Incidents</h2>
              <p className="text-xs text-text-secondary mt-0.5">All 42 tools and cloud interfaces are operating normally.</p>
            </div>
          </div>

          <div className="flex items-center gap-5 border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 sm:pl-5">
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">Uptime</span>
              <p className="text-lg font-bold text-emerald-400 font-mono">100%</p>
            </div>
            <div>
              <span className="text-[10px] text-text-muted uppercase tracking-wider block">Edge Latency</span>
              <p className="text-lg font-bold text-white font-mono">18 ms</p>
            </div>
          </div>
        </div>

        {/* Services Status List */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted">Component Statuses</h3>
          <div className="space-y-2.5">
            {services.map((service) => (
              <div 
                key={service.name}
                className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-surface-card shadow-[var(--shadow-raised-sm)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-white/15 transition-all"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">{service.name}</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-white/[0.04] border border-white/[0.06] text-text-muted font-mono">
                      {service.type}
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed">{service.description}</p>
                </div>

                <div className="flex items-center gap-3.5 shrink-0">
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] font-mono text-text-muted block">{service.latency}</span>
                    <span className="text-[9px] text-text-muted block">Uptime: {service.uptime}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={11} /> {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Privacy Guarantee */}
        <div className="p-5 rounded-2xl border border-white/[0.06] bg-surface-base text-center space-y-1">
          <h4 className="text-xs font-bold text-white">Sovereign Architecture Guarantee</h4>
          <p className="text-xs text-text-tertiary max-w-xl mx-auto leading-relaxed">
            Client-side tools operate independently of network connectivity once application assets are cached.
          </p>
        </div>

      </div>
    </div>
  );
}
