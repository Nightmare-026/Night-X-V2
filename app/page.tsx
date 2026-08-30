'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  ChevronRight,
  Shield,
  Zap,
  Sparkles,
  Search,
  Lock,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Terminal,
  Activity,
  Wrench
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/lib/tools-registry';
import { cn } from '@/lib/utils';
import { ToolIcon } from '@/components/ui/ToolIcon';
import { useSearch } from '@/components/providers/SearchProvider';

export default function LandingPage() {
  const { openSearch } = useSearch();

  // Interactive Quick-Tool Workbench State
  const [quickInput, setQuickInput] = useState('Night X: Fast, Private, In-Browser Tools.');
  const [quickMode, setQuickMode] = useState<'upper' | 'lower' | 'clean' | 'reverse'>('upper');
  const [copied, setCopied] = useState(false);

  const getQuickOutput = () => {
    switch (quickMode) {
      case 'upper':
        return quickInput.toUpperCase();
      case 'lower':
        return quickInput.toLowerCase();
      case 'clean':
        return quickInput.replace(/\s+/g, ' ').trim();
      case 'reverse':
        return quickInput.split('').reverse().join('');
      default:
        return quickInput;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getQuickOutput());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  const featuredTools = [
    'image-compressor',
    'json-formatter',
    'password-generator',
    'qr-generator',
    'word-counter',
    'background-remover',
    'uuid-generator',
    'ai-paraphraser',
  ]
    .map((slug) => TOOLS.find((tool) => tool.slug === slug))
    .filter(Boolean);

  const stats = [
    { value: "42",     label: "Built-in Tools",  detail: "Client-Side First" },
    { value: "7",      label: "Tool Suites",     detail: "Structured Workspace" },
    { value: "0ms",    label: "Server Latency",  detail: "Local Browser Engine" },
    { value: "100%",   label: "Memory Safety",   detail: "Files Never Uploaded" }
  ];

  const architecturePillars = [
    { 
      title: "In-Browser Privacy Isolation",    
      description: "Images, files, and cryptographic keys execute locally in your browser memory using WebAssembly & Web Workers. Zero remote file storage.",           
      icon: ShieldCheck, 
      color: "emerald" 
    },
    { 
      title: "Zero Latency Execution",               
      description: "Instantaneous execution with zero server round-trips. Regex testing, JSON formatting, image compression, and hash generation run at native device speed.",                                   
      icon: Zap, 
      color: "amber"   
    },
    { 
      title: "AI-Augmented Workflows",           
      description: "Smart paraphrasing, structured social bio synthesis, and context-aware assistance designed to speed up routine engineering and writing tasks.",                                   
      icon: Sparkles, 
      color: "orange"   
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-[120px] md:pt-[150px] pb-16 overflow-hidden text-center min-h-[82vh] flex flex-col justify-center">
        {/* Luminous Ambient Background Glow */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[radial-gradient(ellipse,rgba(245,158,11,0.14)_0%,rgba(249,115,22,0.04)_50%,transparent_75%)] blur-[80px] pointer-events-none z-0" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 max-w-[1100px]">
          {/* Trust Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary/10 border border-primary/25 rounded-full text-xs font-semibold text-primary mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>42+ Private Browser Utilities & AI Assistant</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-5 max-w-4xl mx-auto text-white">
            The Workspace for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              Everyday Digital Work.
            </span>
          </h1>

          {/* Hero Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-text-secondary max-w-2xl mx-auto mb-9 leading-relaxed">
            Compress images, generate secure passwords, format code, and automate workflows with 100% private in-browser execution. Free forever with zero server delay.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link href="/tools" className="btn-primary px-7 py-3 text-xs sm:text-sm font-bold shadow-md inline-flex items-center gap-2">
              <span>Explore All 42 Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={openSearch}
              className="btn-secondary px-5 py-3 text-xs sm:text-sm font-semibold flex items-center gap-2 group"
            >
              <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors" />
              <span>Quick Search</span>
              <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-text-muted">⌘K</kbd>
            </button>
            <Link href="/dashboard" className="btn-secondary px-5 py-3 text-xs sm:text-sm font-semibold">
              Workspace Dashboard
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/[0.06] max-w-3xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-2xl sm:text-3xl font-black text-primary leading-none font-mono">
                  {stat.value}
                </span>
                <span className="text-[11px] font-bold text-white uppercase tracking-wider mt-1">
                  {stat.label}
                </span>
                <span className="text-[10px] text-text-muted">
                  {stat.detail}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Interactive Live Quick-Tool Workbench Demo */}
      <section className="py-10 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-7 shadow-[var(--shadow-raised-md)] space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary">
                <Zap size={18} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">Live In-Browser Workbench</h3>
                <p className="text-xs text-text-muted">Instant client-side text transformation preview</p>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-surface-inset p-1 rounded-xl border border-white/[0.06]">
              {[
                { id: 'upper', label: 'UPPERCASE' },
                { id: 'lower', label: 'lowercase' },
                { id: 'clean', label: 'Clean Spaces' },
                { id: 'reverse', label: 'Reverse' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setQuickMode(m.id as any)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                    quickMode === m.id
                      ? "bg-primary text-black font-bold shadow-sm"
                      : "text-text-secondary hover:text-white"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Workbench Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="workbench-input" className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Input Text</label>
              <input
                id="workbench-input"
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Type anything to transform..."
                className="w-full bg-surface-inset border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white outline-none focus:border-primary/60 font-mono shadow-[var(--shadow-inset-sm)] transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Transformed Output</span>
              <div className="relative flex items-center">
                <div className="w-full bg-surface-inset border border-white/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-primary font-mono shadow-[var(--shadow-inset-sm)] truncate pr-20">
                  {getQuickOutput() || <span className="text-text-muted">Type something to see output...</span>}
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute right-1.5 px-2.5 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-xs font-bold text-primary flex items-center gap-1 transition-all"
                  aria-label="Copy transformed text to clipboard"
                >
                  {copied ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore 7 Ecosystem Suites Section */}
      <section className="py-16 px-4 sm:px-6 relative">
        <div className="container mx-auto max-w-[1280px]">
          <div className="text-center mb-12 space-y-2">
            <span className="text-xs font-bold text-primary uppercase tracking-wider block">TOOL SUITES</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">Structured for Maximum Speed</h2>
            <p className="text-xs sm:text-sm text-text-tertiary max-w-md mx-auto">
              Organized into 7 dedicated domains to simplify your everyday digital tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {CATEGORIES.filter(c => c.id !== 'all').map((category) => (
              <Link key={category.id} href={`/tools?category=${category.id}`} className="group relative">
                <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 h-full flex flex-col gap-3 relative overflow-hidden shadow-[var(--shadow-raised-sm)] hover:border-primary/40 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-200">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-surface-inset border border-white/10 text-primary group-hover:scale-105 group-hover:border-primary/30 transition-all">
                    <ToolIcon name={category.icon} className="w-5 h-5" />
                  </div>
                  
                  <h3 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{category.label}</h3>
                  <p className="text-xs text-text-tertiary leading-relaxed flex-1">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-primary pt-1 group-hover:translate-x-1 transition-transform">
                    <span>Open Suite</span>
                    <ChevronRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Most Popular Tools Section */}
      <section className="py-16 px-4 sm:px-6 bg-white/[0.01] border-y border-white/[0.04]">
        <div className="container mx-auto max-w-[1280px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Frequently Used Tools</h2>
              <p className="text-xs text-text-tertiary mt-1">High-demand utilities across media, security, text, and code.</p>
            </div>
            <Link href="/tools" className="btn-secondary text-xs font-semibold py-2 px-3.5 flex items-center gap-1.5 shrink-0">
              <span>View All 42 Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {featuredTools.map((tool: any) => (
              <div key={tool.slug} className="group h-full flex flex-col">
                <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 flex flex-col gap-3 h-full relative overflow-hidden shadow-[var(--shadow-raised-sm)] hover:border-primary/40 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-surface-inset border border-white/[0.08] text-primary group-hover:scale-105 transition-transform">
                      <ToolIcon name={tool.icon} className="w-4 h-4" />
                    </div>
                    {tool.isAI && (
                      <span className="px-2 py-0.5 bg-accent-pink/15 border border-accent-pink/30 rounded-md text-[9px] font-bold text-accent-pink uppercase">
                        AI
                      </span>
                    )}
                    {tool.processingType === 'client' && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[9px] font-bold text-emerald-400 uppercase">
                        Local
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-bold text-white group-hover:text-primary transition-colors">{tool.name}</h4>
                  <p className="text-xs text-text-tertiary leading-relaxed flex-1">
                    {tool.description}
                  </p>
                  
                  <Link 
                    href={`/tools/${tool.slug}`}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-center transition-all flex items-center justify-center gap-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-black hover:border-primary mt-2"
                  >
                    <span>Launch Tool</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Privacy & Architecture Pillars */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-[1280px] space-y-10">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">ZERO CLOUD EXPOSURE</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">How Night X Protects Your Data</h2>
            <p className="text-xs sm:text-sm text-text-tertiary leading-relaxed">
              Standard web utilities transmit your sensitive images and credentials to untrusted cloud servers. Night X runs processing algorithms directly inside your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {architecturePillars.map((feature, idx) => (
              <div key={idx} className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-7 space-y-3 shadow-[var(--shadow-raised-sm)]">
                <div className="w-10 h-10 rounded-xl bg-surface-inset border border-white/10 flex items-center justify-center text-primary">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{feature.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-[1280px]">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-surface-elevated to-surface-card p-8 sm:p-14 text-center shadow-[var(--shadow-raised-lg)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-primary/8 blur-[80px] pointer-events-none" />
            
            <div className="relative z-10 space-y-5 max-w-xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-snug">
                Supercharge your everyday digital workflow.
              </h2>
              <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
                Enjoy 42+ private in-browser tools with zero installation, zero server lag, and zero cost.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link href="/tools" className="btn-primary px-7 py-3 text-xs sm:text-sm font-bold shadow-md inline-flex items-center gap-2 group">
                  <span>Browse All 42 Tools</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link href="/auth/signup" className="btn-secondary px-6 py-3 text-xs sm:text-sm font-bold">
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
