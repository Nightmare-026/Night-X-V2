'use client';

import React from 'react';
import { History, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function ChangelogPage() {
  const releases = [
    {
      version: "v2.5.0",
      date: "August 2026",
      title: "Night X Redesign & Warm Amber Visual System",
      badge: "Major Release",
      badgeVariant: "amber" as const,
      highlights: [
        "Complete visual identity overhaul with Warm Amber & Obsidian dark architecture.",
        "100% Free Workspace model with removal of payment paywalls and Pro badges.",
        "Re-engineered Tools Directory (/tools) with instant category filtering and quick search.",
        "Firestore-backed URL shortener, user favorites, and execution history persistence.",
        "Replaced heavy Three.js bundle with lightweight CSS ambient lighting for instant page loads.",
        "Enhanced WCAG 2.2 AA accessibility, keyboard navigation, and responsive touch targets."
      ]
    },
    {
      version: "v2.2.0",
      date: "June 2026",
      title: "AI Workflows Expansion & Image Processor Upgrades",
      badge: "Feature Release",
      badgeVariant: "cyan" as const,
      highlights: [
        "Introduced AI Paraphraser and AI Bio Generator utilities.",
        "Integrated client-side background removal with in-browser processing.",
        "Added real-time Markdown preview editor with DOMPurify XSS sanitization.",
        "Added JWT Decoder and UUID v4 bulk generation utilities."
      ]
    },
    {
      version: "v2.0.0",
      date: "March 2026",
      title: "Initial Launch of Night X Utility Platform",
      badge: "Platform Release",
      badgeVariant: "purple" as const,
      highlights: [
        "Launched core in-browser utilities across image, text, security, and developer domains.",
        "Integrated NextAuth session security and Firestore cloud storage.",
        "Added Command-K instant search palette with fuzzy tool indexing."
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-24 md:pt-28 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <History size={13} />
            <span>Platform Evolution</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Changelog & Releases
          </h1>

          <p className="text-xs sm:text-sm text-text-tertiary">
            Explore the latest features, engine updates, and architectural enhancements shipped to Night X.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:-translate-x-1/2 before:h-full before:w-0.5 before:bg-white/[0.08]">
          {releases.map((release) => (
            <div
              key={release.version}
              className="relative flex flex-col md:flex-row items-start gap-6 group"
            >
              {/* Card */}
              <div className="w-full rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-7 shadow-[var(--shadow-raised-sm)] space-y-4 hover:border-primary/30 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs sm:text-sm font-bold text-primary">{release.version}</span>
                    <Badge variant={release.badgeVariant}>
                      {release.badge}
                    </Badge>
                  </div>
                  <span className="text-xs text-text-muted">{release.date}</span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white mb-2.5">{release.title}</h3>
                  <ul className="space-y-2">
                    {release.highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-text-secondary leading-relaxed">
                        <CheckCircle2 size={13} className="text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
