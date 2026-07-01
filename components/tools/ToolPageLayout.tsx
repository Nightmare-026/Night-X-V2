'use client';

import React from 'react';
import { Tool, getRelatedTools } from '@/lib/tools-registry';
import { Share2, Info, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';
import AIChat from '@/components/dashboard/AIChat';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import ToolCard from '@/components/dashboard/ToolCard';

interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  howToUse?: string[];
  fullWidth?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export default function ToolPageLayout({ tool, children, howToUse }: ToolPageLayoutProps) {
  const relatedTools = getRelatedTools(tool.slug);
  const processingLabel =
    tool.processingType === 'client'
      ? 'Client-side (Private)'
      : tool.processingType === 'api'
        ? 'API-based (Secure)'
        : 'Server-side';
  const privacyLabel =
    tool.processingType === 'client'
      ? 'Data never leaves your browser'
      : 'Secure processing on encrypted servers';

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/tools/${tool.slug}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} | Night X`,
          text: tool.description,
          url: shareUrl,
        });
        return;
      } catch (e) {
        console.log('Share failed', e);
      }
    }

    await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#0A0A0F]">
      <main className="flex-grow py-8 md:py-12">
        <motion.div 
          className="container mx-auto px-4 lg:px-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Breadcrumbs & Actions */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8"
          >
            <nav className="flex items-center gap-2.5 text-[0.8125rem] font-medium">
              <Link href="/dashboard" className="text-text-tertiary hover:text-white transition-colors">Dashboard</Link>
              <ChevronRight size={14} className="text-white/10" />
              <Link href={`/dashboard?category=${tool.category.toLowerCase()}`} className="text-text-tertiary hover:text-white transition-colors capitalize">
                {tool.category}
              </Link>
              <ChevronRight size={14} className="text-white/10" />
              <span className="text-primary-400 font-bold">{tool.name}</span>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[0.8125rem] font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                <Share2 size={16} />
                Share Tool
              </button>
            </div>
          </motion.div>

          {/* Tool Header Section */}
          <motion.header 
            variants={itemVariants}
            className="mb-10 space-y-4"
          >
            <div className="flex items-start gap-6">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#16161F] border border-white/5 text-[2.5rem] shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
                {tool.icon}
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-4">
                  <h1 className="text-[2rem] font-black text-white tracking-tight leading-none">{tool.name}</h1>
                  {tool.isAI && (
                    <span className="flex items-center gap-1.5 rounded-full bg-accent-pink/10 border border-accent-pink/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent-pink-light">
                      <Zap size={10} fill="currentColor" /> AI Powered
                    </span>
                  )}
                </div>
                <p className="text-text-tertiary text-[1rem] max-w-3xl leading-relaxed">{tool.description}</p>
              </div>
            </div>
          </motion.header>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12 items-start">
            {/* Main Content Area */}
            <motion.div 
              variants={itemVariants}
              className="space-y-12 relative"
            >
              <div className="relative z-10">
                {children}
              </div>

              {/* Background Glow for Tool Area */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10" />

              {/* Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* How to Use Column */}
                <div className="md:col-span-2 glass-card p-8 border-white/5 bg-white/[0.01]">
                   <h2 className="text-[1.125rem] font-bold text-white mb-8 flex items-center gap-3">
                    <Info className="w-5 h-5 text-primary-400" />
                    How to use {tool.name}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {howToUse && howToUse.length > 0 ? (
                      howToUse.map((step, index) => (
                        <div key={index} className="flex gap-4 group/step">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-[0.875rem] font-black text-primary-400 group-hover/step:bg-primary group-hover/step:text-black transition-all">
                            {index + 1}
                          </div>
                          <p className="text-[0.875rem] text-text-tertiary leading-relaxed pt-1">{step}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-text-muted italic">No instructions provided for this tool.</p>
                    )}
                  </div>
                </div>

                {/* Technical Sidebar */}
                <div className="glass-card p-8 border-white/5 bg-white/[0.01] space-y-8">
                   <h3 className="text-[0.8125rem] font-black uppercase tracking-[0.15em] text-white/30 flex items-center gap-2">
                    Technical Specifications
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                        <Zap size={18} className="text-primary-400" />
                      </div>
                      <div>
                        <p className="text-[0.875rem] font-bold text-white/90">{processingLabel}</p>
                        <p className="text-[0.75rem] text-text-tertiary mt-1">Status: Fully Operational</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center shrink-0">
                        <ShieldCheck size={18} className="text-accent-cyan" />
                      </div>
                      <div>
                        <p className="text-[0.875rem] font-bold text-white/90">Privacy Secured</p>
                        <p className="text-[0.75rem] text-text-tertiary mt-1">{privacyLabel}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Tools */}
              {relatedTools.length > 0 && (
                <section className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-[1.25rem] font-black text-white">Suggested Tools</h2>
                    <Link href="/dashboard" className="text-sm text-primary-400 font-bold hover:underline">View All</Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {relatedTools.slice(0, 4).map((related) => (
                      <ToolCard key={related.slug} tool={related} />
                    ))}
                  </div>
                </section>
              )}
            </motion.div>
          </div>
        </motion.div>
      </main>
      <AIChat />
    </div>
  );
}
