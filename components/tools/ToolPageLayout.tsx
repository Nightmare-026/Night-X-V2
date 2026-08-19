'use client';

import React, { useState } from 'react';
import { Tool, getRelatedTools } from '@/lib/tools-registry';
import { Share2, Info, ChevronRight, ShieldCheck, Zap, Sparkles, Check, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import AIChat from '@/components/dashboard/AIChat';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import ToolCard from '@/components/dashboard/ToolCard';
import { ToolIcon } from '@/components/ui/ToolIcon';
import { useToast } from '@/components/ui/Toast';

interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  howToUse?: string[];
  fullWidth?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4, 
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.08
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function ToolPageLayout({ tool, children, howToUse }: ToolPageLayoutProps) {
  const { toast } = useToast();
  const [copiedShare, setCopiedShare] = useState(false);
  const relatedTools = getRelatedTools(tool.slug);

  const processingLabel =
    tool.processingType === 'client'
      ? 'Client-Side (100% Private)'
      : tool.processingType === 'api'
        ? 'AI / Secure Cloud API'
        : 'Server Execution';

  const privacyLabel =
    tool.processingType === 'client'
      ? 'Files and data never leave your browser memory.'
      : 'Encrypted end-to-end HTTPS payload processing.';

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/tools/${tool.slug}` : '';

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} | Night X`,
          text: tool.description,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      toast('Tool link copied to clipboard!', 'success');
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <main className="flex-grow py-8 md:py-12">
        <motion.div 
          className="container mx-auto px-4 lg:px-8 max-w-[1280px]"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Breadcrumbs & Share Action */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-between gap-4 mb-6"
          >
            <nav className="flex items-center gap-2 text-xs font-medium" aria-label="Breadcrumb">
              <Link href="/" className="text-text-muted hover:text-white transition-colors">Home</Link>
              <ChevronRight size={13} className="text-white/20" />
              <Link href="/tools" className="text-text-muted hover:text-white transition-colors">Tools</Link>
              <ChevronRight size={13} className="text-white/20" />
              <Link href={`/tools?category=${tool.category.toLowerCase()}`} className="text-text-muted hover:text-white transition-colors capitalize">
                {tool.category}
              </Link>
              <ChevronRight size={13} className="text-white/20" />
              <span className="text-primary-400 font-bold">{tool.name}</span>
            </nav>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-surface-card border border-white/10 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:border-primary/40 transition-all shadow-[var(--shadow-raised-sm)]"
              aria-label="Share tool link"
            >
              {copiedShare ? <Check size={14} className="text-primary-400" /> : <Share2 size={14} />}
              <span>{copiedShare ? 'Copied' : 'Share Tool'}</span>
            </button>
          </motion.div>

          {/* Tool Header Section */}
          <motion.header 
            variants={itemVariants}
            className="mb-8 rounded-3xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-md)] relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-inset border border-white/10 text-primary-400 shadow-[var(--shadow-inset-sm)]">
                <ToolIcon name={tool.icon} className="w-8 h-8" />
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-none">
                    {tool.name}
                  </h1>
                  
                  {tool.processingType === 'client' && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      <ShieldCheck size={11} /> 100% In-Browser Privacy
                    </span>
                  )}
                  {tool.isAI && (
                    <span className="flex items-center gap-1 rounded-full bg-accent-pink/15 border border-accent-pink/30 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-accent-pink">
                      <Sparkles size={11} /> AI Assisted
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-text-tertiary max-w-3xl leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>
          </motion.header>

          {/* Tool Workbench Card Container */}
          <div className="space-y-10">
            <motion.div 
              variants={itemVariants}
              className="rounded-3xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-md)] relative overflow-hidden min-h-[300px]"
            >
              {children}
            </motion.div>

            {/* Information Grid: How to Use & Tech Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* How to Use Column */}
              <div className="md:col-span-2 rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-sm)] space-y-6">
                <h2 className="text-base font-bold text-white flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-primary-400" />
                  How to Use {tool.name}
                </h2>

                <div className="grid gap-4 sm:grid-cols-2">
                  {howToUse && howToUse.length > 0 ? (
                    howToUse.map((step, index) => (
                      <div key={index} className="flex gap-3.5">
                        <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary-400">
                          {index + 1}
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed pt-0.5">{step}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-text-muted italic">Follow the on-screen controls to use this tool.</p>
                  )}
                </div>
              </div>

              {/* Technical Specifications Sidebar */}
              <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-sm)] space-y-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                  <Zap size={14} className="text-primary-400" />
                  Technical Specifications
                </h3>
                
                <div className="space-y-4 text-xs">
                  <div className="p-3 rounded-xl bg-surface-inset border border-white/[0.04] space-y-1">
                    <p className="font-bold text-white">{processingLabel}</p>
                    <p className="text-text-muted leading-relaxed">{privacyLabel}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-surface-inset border border-white/[0.04] space-y-1">
                    <p className="font-bold text-white">Execution Latency</p>
                    <p className="text-text-muted font-mono">0ms (Local client engine)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Tools Recommendation Grid */}
            {relatedTools.length > 0 && (
              <section className="space-y-5 pt-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-bold text-white">Suggested & Related Utilities</h2>
                  <Link href="/tools" className="text-xs text-primary-400 font-bold hover:underline flex items-center gap-1">
                    <span>View All Tools</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedTools.slice(0, 4).map((related) => (
                    <ToolCard key={related.slug} tool={related} />
                  ))}
                </div>
              </section>
            )}
          </div>
        </motion.div>
      </main>
      <AIChat />
    </div>
  );
}
