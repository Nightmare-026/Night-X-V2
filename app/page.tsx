'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  ChevronRight,
  Shield,
  Zap,
  Sparkles,
  Globe,
  Star
} from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/lib/tools-registry';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const featuredTools = [
    'image-compressor',
    'json-formatter',
    'password-generator',
    'qr-generator',
    'word-counter',
    'background-remover',
    'age-calculator',
    'ai-paraphraser',
  ]
    .map((slug) => TOOLS.find((tool) => tool.slug === slug))
    .filter(Boolean);

  const stats = [
    { value: "40+",    label: "Tools",      suffix: "Live" },
    { value: "7",      label: "Categories", suffix: "Organized" },
    { value: "AI",     label: "Tools",      suffix: "Optional" },
    { value: "100%",   "label": "Browser",  "suffix": "Practical" }
  ];

  const features = [
    { title: "Browser-first for many tools",    description: "Many utility workflows run directly in your browser, while AI and account features use secure server routes where needed.",           icon: "🌐", color: "primary" },
    { title: "AI-assisted workflows",           description: "Use AI tools for rewriting, bio generation, and guided help inside the dashboard when signed in.",                                   icon: "✨", color: "accent-cyan"   },
    { title: "Fast and focused",               description: "Night X is built to keep common utility tasks simple, polished, and easy to reach from one place.",                                   icon: "⚡", color: "accent-pink"   }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative pt-[160px] pb-24 overflow-hidden text-center min-h-[90vh] flex flex-col justify-center">
        <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
        
        {/* Center Glow Effect */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse,rgba(139,92,246,0.20)_0%,rgba(6,182,212,0.08)_40%,transparent_70%)] blur-[40px] pointer-events-none" />

        {/* Hero Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/30 rounded-full text-[13px] font-medium text-primary-400 mb-8 animate-fade-in-down">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-slow" />
            One Hub. Every Tool You Need.
          </div>

          <h1 className="reveal text-[clamp(3rem,6vw,5rem)] font-black leading-[1.05] tracking-tight mb-6 max-w-4xl mx-auto animate-fade-in-down delay-100">
            One Hub. <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_200%]">
              Every Tool
            </span> <br />
            You Need.
          </h1>

          <p className="reveal text-lg md:text-[1.125rem] text-text-tertiary max-w-2xl mx-auto mb-12 leading-[1.7] animate-fade-in-down delay-200">
            Use image, text, developer, calculator, security, and AI-assisted tools in one focused workspace. Sign in for the full dashboard experience and AI-powered features.
          </p>

          <div className="reveal flex flex-wrap items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
            <Link href="/auth/signup" className="btn-primary px-8 py-4 text-base font-bold">
              Create Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/dashboard" className="btn-secondary px-8 py-4 text-base font-semibold">
              Explore Tools
            </Link>
          </div>

          {/* Stats Row */}
          <div className="reveal flex flex-wrap items-center justify-center gap-8 md:gap-16 animate-fade-in-up delay-400">
            {stats.map((stat, idx) => (
              <React.Fragment key={stat.label}>
                <div className="flex flex-col items-center">
                  <span className="text-2xl md:text-3xl font-black bg-gradient-to-r from-primary-400 to-accent-cyan bg-clip-text text-transparent leading-none">
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.08em] mt-1">
                    {stat.label}
                  </span>
                  <span className="text-[11px] text-text-muted opacity-60">
                    {stat.suffix}
                  </span>
                </div>
                {idx < stats.length - 1 && (
                  <div className="hidden md:block w-px h-10 bg-white/10" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-24 px-6 relative">
        <div className="container mx-auto max-w-[1280px]">
          <div className="text-center mb-16 space-y-4">
            <span className="reveal text-[12px] font-bold text-primary-400 tracking-[0.12em] uppercase block">ORGANIZED</span>
            <h2 className="reveal text-[clamp(1.75rem,3vw,2.5rem)] font-black tracking-tight">Everything you need in one place</h2>
            <p className="reveal text-[1rem] text-text-tertiary max-w-xl mx-auto mt-3">
              Organized into intuitive categories so you can jump to the right tool quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORIES.filter(c => c.id !== 'all').map((category, idx) => (
              <Link key={category.id} href={`/dashboard?category=${category.id}`} className="reveal group relative">
                <div className="glass-card p-6 h-full flex flex-col gap-3 relative overflow-hidden group-hover:bg-[#1C1C28]/90 group-hover:border-primary/25 group-hover:-translate-y-1 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(139,92,246,0.15)] transition-all duration-300">
                  {/* Arrow Icon */}
                  <div className="absolute top-4 right-4 text-white/20 group-hover:text-primary-400/80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                  
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/5",
                    category.id === 'image' && "bg-primary/12 text-primary border-primary/20",
                    category.id === 'security' && "bg-red-500/12 text-red-500 border-red-500/20",
                    category.id === 'text' && "bg-emerald-500/12 text-emerald-500 border-emerald-500/20",
                    category.id === 'developer' && "bg-accent-cyan/12 text-accent-cyan border-accent-cyan/20",
                    category.id === 'utility' && "bg-accent-amber/12 text-accent-amber border-accent-amber/20",
                    category.id === 'life' && "bg-blue-500/12 text-blue-500 border-blue-500/20",
                    category.id === 'ai' && "bg-accent-pink/12 text-accent-pink border-accent-pink/20",
                  )}>
                    {category.icon}
                  </div>
                  
                  <h3 className="text-[1.0625rem] font-bold text-white tracking-[-0.01em] group-hover:text-primary-400 transition-colors">{category.label}</h3>
                  <p className="text-[0.8125rem] text-text-tertiary leading-[1.5] mb-4">
                    {category.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {['tools', 'utility', 'free'].map(tag => (
                      <span key={tag} className="bg-white/5 border border-white/10 rounded-md px-2 py-0.5 text-[11px] font-medium text-text-muted font-mono uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-24 px-6 bg-white/[0.01] border-y border-white/[0.04]">
        <div className="container mx-auto max-w-[1280px]">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <h2 className="reveal text-[clamp(1.5rem,2.5vw,2rem)] font-black tracking-tight">Most Popular Tools</h2>
              <p className="reveal text-[0.9375rem] text-text-tertiary mt-1.5">A few of the tools people reach for most often.</p>
            </div>
            <Link href="/dashboard" className="reveal inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-primary/30 rounded-lg text-sm font-medium text-primary-400 hover:bg-primary/10 hover:border-primary/55 transition-all duration-200">
              View All Tools <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredTools.map((tool: any, idx) => (
              <div key={tool.slug} className="reveal group h-full">
                <div className="glass-card p-5 flex flex-col gap-3 h-full relative overflow-hidden bg-[#16161F]/70 border-white/[0.06] group-hover:bg-[#1C1C28]/90 group-hover:border-primary/20 group-hover:-translate-y-[3px] group-hover:shadow-[0_16px_35px_rgba(0,0,0,0.4),0_0_0_1px_rgba(139,92,246,0.12)] transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div className="text-[1.75rem] leading-none mb-1 filter grayscale group-hover:grayscale-0 transition-all">{tool.icon}</div>
                    {tool.isAI && (
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-accent-pink/12 border border-accent-pink/25 rounded-md text-[9px] font-black text-accent-pink-light uppercase tracking-[0.05em]">
                        AI Enabled
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-[0.9375rem] font-bold text-white tracking-[-0.01em] group-hover:text-primary-400 transition-colors">{tool.name}</h4>
                  <p className="text-[0.8125rem] text-text-tertiary leading-[1.55] flex-1">
                    {tool.description}
                  </p>
                  
                  <Link 
                    href={tool.isPublic ? `/tools/${tool.slug}` : "/auth/signin"}
                    className={cn(
                      "w-full py-2 rounded-lg text-[0.8125rem] font-bold text-center transition-all flex items-center justify-center gap-1.5",
                      tool.isPublic 
                        ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40" 
                        : "bg-white/4 text-text-muted border border-white/8 hover:bg-white/8 hover:text-text-secondary"
                    )}
                  >
                    {tool.isPublic ? "Try it free" : "Sign in to use"}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>

                  {/* Corner Glow */}
                  <div className="absolute -top-[30px] -right-[30px] w-[100px] h-[100px] bg-[radial-gradient(circle,rgba(139,92,246,0.15),transparent_70%)] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-6">
        <div className="container mx-auto max-w-[1280px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div key={idx} className="reveal p-8 rounded-3xl border border-white/[0.06] bg-surface-base/50 group hover:bg-surface-elevated/50 transition-all">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-6",
                  feature.color === 'primary' && "bg-primary/15 text-primary-400",
                  feature.color === 'accent-cyan' && "bg-accent-cyan/15 text-accent-cyan",
                  feature.color === 'accent-pink' && "bg-accent-pink/15 text-accent-pink",
                )}>
                  {feature.icon === '🌐' ? <Globe className="w-6 h-6" /> : feature.icon === '✨' ? <Sparkles className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
                </div>
                <h3 className="text-lg font-bold mb-3 text-text-primary">{feature.title}</h3>
                <p className="text-sm text-text-tertiary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-[1280px]">
          <div className="reveal relative overflow-hidden rounded-[24px] border border-primary/20 bg-[#1C1C28]/60 p-12 md:p-16 text-center">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse,rgba(139,92,246,0.15)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="relative z-10 space-y-8">
              <h2 className="text-[clamp(1.75rem,3vw,2.5rem)] font-black tracking-tight max-w-2xl mx-auto text-white leading-tight">
                Ready to boost your productivity?
              </h2>
              <p className="text-text-tertiary text-[1rem] max-w-xl mx-auto mb-8">
                Create an account to unlock the full dashboard, saved access, and AI-assisted tools.
              </p>
              <Link href="/auth/signup" className="btn-primary px-10 py-4 text-base font-bold shadow-[0_0_30px_rgba(139,92,246,0.50)] inline-flex group transition-all duration-300 hover:shadow-[0_0_50px_rgba(139,92,246,0.70)] hover:scale-[1.03]">
                Start with Night X <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

