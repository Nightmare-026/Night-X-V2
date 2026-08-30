'use client';

import React, { useState } from 'react';
import { Tool, getRelatedTools } from '@/lib/tools-registry';
import { Share2, Info, ChevronRight, ShieldCheck, Zap, Sparkles, Check } from 'lucide-react';
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

export default function ToolPageLayout({ tool, children, howToUse }: ToolPageLayoutProps) {
  const { toast } = useToast();
  const [copiedShare, setCopiedShare] = useState(false);
  const relatedTools = getRelatedTools(tool.slug);

  const processingLabel =
    tool.processingType === 'client'
      ? 'In-Browser Execution (100% Private)'
      : tool.processingType === 'api'
        ? 'AI / Secure API Endpoint'
        : 'Serverless Handler';

  const privacyLabel =
    tool.processingType === 'client'
      ? 'Payloads and files execute entirely in your local browser memory.'
      : 'Processed via encrypted end-to-end TLS payload with zero data retention.';

  const latencyLabel =
    tool.processingType === 'client'
      ? '0ms (Instantaneous local engine)'
      : 'Sub-second API response';

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
    <div className="flex flex-col min-h-screen relative overflow-hidden pt-20 md:pt-24 pb-16">
      <main className="flex-grow">
        <div className="container mx-auto px-4 lg:px-8 max-w-[1280px] space-y-6">
          {/* Breadcrumbs & Share Action */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="flex items-center gap-1.5 text-xs font-medium text-text-tertiary" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight size={12} className="text-white/20" />
              <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
              <ChevronRight size={12} className="text-white/20" />
              <Link href={`/tools?category=${tool.category.toLowerCase()}`} className="hover:text-white transition-colors capitalize">
                {tool.category}
              </Link>
              <ChevronRight size={12} className="text-white/20" />
              <span className="text-primary font-bold">{tool.name}</span>
            </nav>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-card border border-white/10 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:border-primary/40 transition-all shadow-sm"
              aria-label="Share tool link"
            >
              {copiedShare ? <Check size={13} className="text-primary" /> : <Share2 size={13} />}
              <span>{copiedShare ? 'Copied' : 'Share'}</span>
            </button>
          </div>

          {/* Tool Header Section */}
          <header className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-7 shadow-[var(--shadow-raised-sm)] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 relative z-10">
              <div className="flex h-13 w-13 p-3 shrink-0 items-center justify-center rounded-xl bg-surface-inset border border-white/10 text-primary shadow-inner">
                <ToolIcon name={tool.icon} className="w-7 h-7" />
              </div>

              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {tool.name}
                  </h1>
                  
                  {tool.processingType === 'client' && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400">
                      <ShieldCheck size={10} /> 100% In-Browser Privacy
                    </span>
                  )}
                  {tool.isAI && (
                    <span className="flex items-center gap-1 rounded-full bg-accent-pink/15 border border-accent-pink/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-pink">
                      <Sparkles size={10} /> AI Assisted
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-text-tertiary max-w-3xl leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>
          </header>

          {/* Tool Workbench Card Container */}
          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-7 shadow-[var(--shadow-raised-md)] relative overflow-hidden min-h-[300px]">
            {children}
          </div>

          {/* Information Grid: How to Use & Tech Specs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* How to Use Column */}
            <div className="md:col-span-2 rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-7 shadow-[var(--shadow-raised-sm)] space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                <span>How to Use {tool.name}</span>
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {howToUse && howToUse.length > 0 ? (
                  howToUse.map((step, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
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
            <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-7 shadow-[var(--shadow-raised-sm)] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted flex items-center gap-2">
                <Zap size={13} className="text-primary" />
                <span>Engine Specifications</span>
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-surface-inset border border-white/[0.04] space-y-1">
                  <p className="font-bold text-white">{processingLabel}</p>
                  <p className="text-[11px] text-text-muted leading-relaxed">{privacyLabel}</p>
                </div>

                <div className="p-3 rounded-xl bg-surface-inset border border-white/[0.04] space-y-0.5">
                  <p className="font-bold text-white">Execution Latency</p>
                  <p className="text-[11px] text-text-muted font-mono">{latencyLabel}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Related Tools Recommendation Grid */}
          {relatedTools.length > 0 && (
            <section className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-white">Suggested & Related Utilities</h2>
                <Link href="/tools" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                  <span>View All 42 Tools</span>
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
      </main>
      <AIChat />
    </div>
  );
}
