'use client';

import React from 'react';
import { Tool, getRelatedTools } from '@/lib/tools-registry';
import { Share2, Info, ChevronRight, ShieldCheck, Zap, Globe } from 'lucide-react';
import Link from 'next/link';
import ToolCard from '@/components/dashboard/ToolCard';
import AIChat from '@/components/dashboard/AIChat';
import { cn } from '@/lib/utils';

interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  howToUse?: string[];
  fullWidth?: boolean;
}

export default function ToolPageLayout({ tool, children, howToUse, fullWidth = false }: ToolPageLayoutProps) {
  const relatedTools = getRelatedTools(tool.slug);
  const processingLabel =
    tool.processingType === 'client'
      ? 'Runs in your browser'
      : tool.processingType === 'api'
        ? 'Uses server APIs'
        : 'Handled on the server';
  const privacyLabel =
    tool.processingType === 'client'
      ? 'Input stays on this device'
      : 'Data is sent to the app backend';

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
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-[10px] font-black text-white/20 mb-10 uppercase tracking-[0.2em]">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight size={10} className="text-white/10" />
            <span className="text-white/20">{tool.category}</span>
            <ChevronRight size={10} className="text-white/10" />
            <span className="text-accent-purple">{tool.name}</span>
          </nav>

          {/* Header Section */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-2xl relative group overflow-hidden">
                  <div className="absolute inset-0 bg-accent-purple/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 group-hover:scale-110 transition-transform duration-500">{tool.icon}</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-4xl font-syne font-black tracking-tight">{tool.name}</h1>
                    {tool.isAI && (
                      <span className="px-3 py-1 bg-accent-pink/10 border border-accent-pink/20 text-accent-pink text-[9px] font-black rounded-full uppercase tracking-widest">AI Enhanced</span>
                    )}
                  </div>
                  <p className="text-white/40 font-medium text-lg max-w-2xl leading-relaxed">{tool.description}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all font-bold text-xs uppercase tracking-widest shadow-xl"
              >
                <Share2 size={16} />
                Share Tool
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Main Content Area */}
            <div className={cn(
              "space-y-12",
              fullWidth ? "lg:col-span-12" : "lg:col-span-8"
            )}>
              {/* Tool Canvas */}
              <div className={cn(
                "relative",
                !fullWidth && "glass-card p-6 md:p-10 rounded-[40px] border-white/5 shadow-2xl"
              )}>
                {children}
              </div>

              {/* How to Use Section */}
              {howToUse && howToUse.length > 0 && (
                <div className="space-y-8 py-12 border-t border-white/5">
                  <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-black text-accent-cyan uppercase tracking-[0.2em]">Operational Guide</div>
                    <h2 className="text-2xl font-syne font-black flex items-center gap-3">
                      How to effectively use this tool
                    </h2>
                  </div>
                  <div className={cn(
                    "grid gap-6",
                    fullWidth ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-3"
                  )}>
                    {howToUse.map((step, index) => (
                      <div key={index} className="bg-white/5 border border-white/10 rounded-[32px] p-8 relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="absolute -top-4 -right-4 text-6xl font-black text-white/[0.03] group-hover:text-white/[0.06] transition-colors">
                          0{index + 1}
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-white/40 mb-6">
                          {index + 1}
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed font-medium">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar (Only shown if not fullWidth) */}
            {!fullWidth && (
              <div className="lg:col-span-4 space-y-8 sticky top-24">
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 space-y-8 shadow-2xl">
                  <h3 className="font-syne font-black text-sm uppercase tracking-[0.2em] text-white/40">Technical Specs</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-accent-cyan/10 text-accent-cyan">
                        <Zap size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Architecture</p>
                        <p className="text-xs font-bold text-white/80">{processingLabel}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                        <ShieldCheck size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Security & Privacy</p>
                        <p className="text-xs font-bold text-white/80">{privacyLabel}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-accent-purple/10 text-accent-purple">
                        <Globe size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Accessibility</p>
                        <p className="text-xs font-bold text-white/80">Available offline after loading</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-white/5">
                    <p className="text-[10px] text-white/20 font-medium leading-relaxed italic">
                      "Engineered for speed, privacy, and precision. Night X utilities are built using the latest web standards."
                    </p>
                  </div>
                </div>

                {relatedTools.length > 0 && (
                  <div className="space-y-6">
                    <h3 className="font-syne font-black text-sm uppercase tracking-[0.2em] text-white/40 ml-4">Next Up</h3>
                    <div className="space-y-4">
                      {relatedTools.slice(0, 3).map((related) => (
                        <ToolCard key={related.slug} tool={related} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <AIChat />
    </div>
  );
}
