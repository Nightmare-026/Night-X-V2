'use client';

import React from 'react';
import { Tool, getRelatedTools } from '@/lib/tools-registry';
import { Share2, Info, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ToolCard from '@/components/dashboard/ToolCard';
import AIChat from '@/components/dashboard/AIChat';

interface ToolPageLayoutProps {
  tool: Tool;
  children: React.ReactNode;
  howToUse?: string[];
}

export default function ToolPageLayout({ tool, children, howToUse }: ToolPageLayoutProps) {
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
      await navigator.share({
        title: `${tool.name} | Night X`,
        text: tool.description,
        url: shareUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-2 text-xs font-medium text-white/40 mb-8 uppercase tracking-widest">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-white/20">{tool.category}</span>
            <ChevronRight size={12} />
            <span className="text-accent-purple">{tool.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-2xl">
                      {tool.icon}
                    </div>
                    <h1 className="text-3xl font-syne font-bold">{tool.name}</h1>
                  </div>
                  <p className="text-white/60 font-dm-sans">{tool.description}</p>
                </div>

                <button
                  type="button"
                  onClick={handleShare}
                  className="w-fit p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                  aria-label={`Share ${tool.name}`}
                >
                  <Share2 size={20} />
                </button>
              </div>

              <div className="glass-card p-6 md:p-8 min-h-[400px]">
                {children}
              </div>

              {howToUse && howToUse.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-syne font-bold flex items-center gap-2">
                    <Info size={20} className="text-accent-cyan" />
                    How to Use
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {howToUse.map((step, index) => (
                      <div key={index} className="glass-card p-4 border-white/5 bg-white/[0.02]">
                        <div className="text-2xl font-bold text-white/10 mb-2">0{index + 1}</div>
                        <p className="text-sm text-white/70">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="glass-card p-6 space-y-6">
                <h3 className="font-syne font-bold text-lg">Tool Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-white/40">Processing</span>
                    <span className="text-white font-medium text-right">{processingLabel}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-white/40">Privacy</span>
                    <span className="text-green-400 font-medium text-right">{privacyLabel}</span>
                  </div>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-white/40">AI Powered</span>
                    <span className={tool.isAI ? "text-accent-pink font-bold" : "text-white/20"}>
                      {tool.isAI ? "YES" : "NO"}
                    </span>
                  </div>
                </div>
              </div>

              {relatedTools.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-syne font-bold text-lg">Related Tools</h3>
                  <div className="space-y-4">
                    {relatedTools.slice(0, 3).map((related) => (
                      <ToolCard key={related.slug} tool={related} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <AIChat />
    </div>
  );
}
