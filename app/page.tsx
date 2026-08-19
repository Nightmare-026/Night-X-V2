'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight,
  Shield,
  Zap,
  Sparkles,
  Globe,
  Star,
  Search,
  Lock,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Layers,
  Terminal,
  Activity
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/lib/tools-registry';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { ToolIcon } from '@/components/ui/ToolIcon';
import { useSearch } from '@/components/providers/SearchProvider';

const Hero3D = dynamic(() => import('@/components/ui/Hero3D'), { ssr: false });

export default function LandingPage() {
  const { openSearch } = useSearch();

  // Interactive Quick-Tool State (Live Demo)
  const [quickInput, setQuickInput] = useState('Night X: Fast, Private, Sovereign.');
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
    await navigator.clipboard.writeText(getQuickOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
    { value: "42+",    label: "Local Tools",      suffix: "Client-Side First" },
    { value: "7",      label: "Tool Suites",      suffix: "Organized Hub" },
    { value: "0ms",    label: "Server Delay",     suffix: "Instant Browser Execution" },
    { value: "100%",   label: "Privacy",          suffix: "Files Stay on Device" }
  ];

  const architecturePillars = [
    { 
      title: "Client-Side Privacy Isolation",    
      description: "Images, files, and credentials execute entirely in browser memory using WebAssembly & WebWorkers without remote telemetry.",           
      icon: ShieldCheck, 
      color: "emerald" 
    },
    { 
      title: "AI-Augmented Workflows",           
      description: "Intelligent paraphrasing, structured social bio synthesis, and context-aware assistant for creators and engineers.",                                   
      icon: Sparkles, 
      color: "pink"   
    },
    { 
      title: "Zero Latency Utilities",               
      description: "42+ unified utilities built for maximum speed: Regex testing, JSON formatting, UUID generation, Diff analysis, and Image compression.",                                   
      icon: Zap, 
      color: "cyan"   
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative pt-[130px] md:pt-[160px] pb-16 overflow-hidden text-center min-h-[88vh] flex flex-col justify-center">
        <Hero3D />
        
        {/* Luminous Center Ambient Radial Glow */}
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[650px] h-[400px] bg-[radial-gradient(ellipse,rgba(34,197,94,0.18)_0%,rgba(6,182,212,0.05)_50%,transparent_75%)] blur-[70px] pointer-events-none z-0" />

        {/* Hero Content Container */}
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-xs font-semibold text-primary-300 mb-6 shadow-[var(--shadow-raised-sm)] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>42+ Private Browser & AI Utilities</span>
          </div>

          <h1 className="text-[clamp(2.5rem,5.5vw,4.75rem)] font-black leading-[1.08] tracking-tight mb-6 max-w-4xl mx-auto text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)]">
            The Sovereign Workspace for <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-primary via-emerald-300 to-accent-cyan bg-clip-text text-transparent drop-shadow-sm">
              Everyday Digital Work.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-[1.7] drop-shadow-sm">
            Compress images, generate secure passwords, format code, and automate workflows with private client-side processing and AI assistance. Zero server latency.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
            <Link href="/tools" className="btn-primary px-8 py-3.5 text-sm font-bold shadow-[0_4px_24px_rgba(34,197,94,0.45)]">
              Explore All 42 Tools <ArrowRight className="w-4 h-4" />
            </Link>
            <button 
              onClick={openSearch}
              className="btn-secondary px-6 py-3.5 text-sm font-semibold flex items-center gap-2 group backdrop-blur-md"
            >
              <Search className="w-4 h-4 text-text-muted group-hover:text-primary-400 transition-colors" />
              <span>Search Tools</span>
              <kbd className="px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-mono text-text-muted">⌘K</kbd>
            </button>
            <Link href="/dashboard" className="btn-secondary px-6 py-3.5 text-sm font-semibold backdrop-blur-md">
              Dashboard
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 pt-6 border-t border-white/[0.06] max-w-4xl mx-auto backdrop-blur-sm">
            {stats.map((stat, idx) => (
              <React.Fragment key={stat.label}>
                <div className="flex flex-col items-center">
                  <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-primary-300 to-accent-cyan bg-clip-text text-transparent leading-none font-mono">
                    {stat.value}
                  </span>
                  <span className="text-[11px] font-bold text-white/90 uppercase tracking-wider mt-1.5">
                    {stat.label}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {stat.suffix}
                  </span>
                </div>
                {idx < stats.length - 1 && (
                  <div className="hidden md:block w-px h-8 bg-white/10" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Interactive Live Quick-Tool Workbench Demo */}
      <section className="py-12 px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl border border-primary/30 bg-gradient-to-b from-surface-elevated to-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-lg)] space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-400">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Live Instant Browser Workbench</h3>
                <p className="text-xs text-text-muted">Experience zero-lag, client-side execution right now</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-surface-inset p-1 rounded-xl border border-white/10">
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
                    "px-3 py-1 rounded-lg text-xs font-semibold transition-all",
                    quickMode === m.id
                      ? "bg-primary text-black shadow-sm"
                      : "text-text-tertiary hover:text-white"
                  )}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Workbench Split Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Input Text</span>
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="Type anything here..."
                className="w-full bg-surface-inset border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-primary/60 shadow-[var(--shadow-inset-sm)] font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">Transformed Output</span>
              <div className="relative flex items-center">
                <div className="w-full bg-surface-inset border border-white/10 rounded-xl px-4 py-3 text-sm text-primary-300 font-mono shadow-[var(--shadow-inset-sm)] truncate pr-16">
                  {getQuickOutput() || <span className="text-text-muted">Waiting for input...</span>}
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute right-2 px-3 py-1.5 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-xs font-bold text-primary-300 flex items-center gap-1.5 transition-all"
                  aria-label="Copy transformed text"
                >
                  {copied ? <Check size={13} className="text-primary-400" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Explore 7 Ecosystem Suites Section */}
      <section className="py-20 px-4 sm:px-6 relative">
        <div className="container mx-auto max-w-[1280px]">
          <div className="text-center mb-14 space-y-2">
            <span className="text-xs font-bold text-primary-400 tracking-wider uppercase block">ECOSYSTEM SUITES</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">Structured for Maximum Output</h2>
            <p className="text-sm text-text-tertiary max-w-lg mx-auto">
              Organized into 7 dedicated tool ecosystems to streamline your daily workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CATEGORIES.filter(c => c.id !== 'all').map((category) => (
              <Link key={category.id} href={`/tools?category=${category.id}`} className="group relative">
                <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 h-full flex flex-col gap-3 relative overflow-hidden shadow-[var(--shadow-raised-sm)] hover:border-primary/40 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-300">
                  <div className="absolute top-4 right-4 text-white/20 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all duration-200">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                  
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-surface-inset border border-white/10 text-primary-400 group-hover:scale-105 group-hover:border-primary/30 transition-all">
                    <ToolIcon name={category.icon} className="w-5 h-5" />
                  </div>
                  
                  <h3 className="text-base font-bold text-white group-hover:text-primary-300 transition-colors">{category.label}</h3>
                  <p className="text-xs text-text-tertiary leading-[1.6] flex-1">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-primary-400 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
      <section className="py-20 px-4 sm:px-6 bg-white/[0.01] border-y border-white/[0.05]">
        <div className="container mx-auto max-w-[1280px]">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Most Popular Tools</h2>
              <p className="text-xs text-text-tertiary mt-1">Frequently accessed utilities across development, security, and media.</p>
            </div>
            <Link href="/tools" className="btn-secondary text-xs font-semibold py-2 px-4 flex items-center gap-2 shrink-0">
              View All 42 Tools <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredTools.map((tool: any) => (
              <div key={tool.slug} className="group h-full">
                <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 flex flex-col gap-3 h-full relative overflow-hidden shadow-[var(--shadow-raised-sm)] hover:border-primary/40 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-surface-inset border border-white/[0.08] text-primary-400 group-hover:scale-105 transition-transform">
                      <ToolIcon name={tool.icon} className="w-5 h-5" />
                    </div>
                    {tool.isAI && (
                      <span className="px-2 py-0.5 bg-accent-pink/15 border border-accent-pink/30 rounded-md text-[9px] font-bold text-accent-pink uppercase tracking-wider">
                        AI
                      </span>
                    )}
                    {tool.processingType === 'client' && (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[9px] font-bold text-emerald-400 uppercase tracking-wider">
                        Local
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-bold text-white group-hover:text-primary-300 transition-colors">{tool.name}</h4>
                  <p className="text-xs text-text-tertiary leading-[1.6] flex-1">
                    {tool.description}
                  </p>
                  
                  <Link 
                    href={`/tools/${tool.slug}`}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-center transition-all flex items-center justify-center gap-1.5 bg-primary/10 text-primary-300 border border-primary/20 hover:bg-primary hover:text-black hover:border-primary mt-2"
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

      {/* 5. Sovereign Privacy Architecture Pillars */}
      <section className="py-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-[1280px] space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">PRIVACY BY DESIGN</span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">How Night X Protects Your Data</h2>
            <p className="text-xs sm:text-sm text-text-tertiary leading-relaxed">
              Traditional online converters upload your private documents and photos to random cloud servers. Night X runs processing algorithms directly on your local device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {architecturePillars.map((feature, idx) => (
              <div key={idx} className="rounded-2xl border border-white/[0.08] bg-surface-card p-8 space-y-4 hover:border-white/[0.15] shadow-[var(--shadow-raised-sm)] transition-all">
                <div className="w-12 h-12 rounded-xl bg-surface-inset border border-white/10 flex items-center justify-center text-primary-400">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. High Conversion Bottom CTA */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="container mx-auto max-w-[1280px]">
          <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-b from-surface-elevated to-surface-card p-10 sm:p-16 text-center shadow-[var(--shadow-raised-lg)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
                Supercharge your digital workspace with Night X.
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                Join thousands of developers, designers, and creators who rely on instant client-side tools and AI workflows.
              </p>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link href="/tools" className="btn-primary px-8 py-3.5 text-sm font-bold shadow-[0_4px_20px_rgba(34,197,94,0.45)] inline-flex items-center gap-2 group">
                  <span>Browse All 42 Tools</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/auth/signup" className="btn-secondary px-8 py-3.5 text-sm font-bold">
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
