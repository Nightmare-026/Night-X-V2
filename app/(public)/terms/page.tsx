'use client';

import React from 'react';
import { Shield, FileText, AlertTriangle, Scale } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <Shield className="w-4 h-4 text-primary" />,
      content: "By accessing or utilizing the Night X application, you agree to these Terms of Service. Night X provides browser-first utility tools, cryptographic processors, and AI-assisted workflows. Services are provided on an as-is and as-available basis."
    },
    {
      title: "2. Lawful & Permissible Use",
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      content: "You agree to use Night X tools responsibly and in compliance with all applicable laws. You may not use automated scripts to spam API endpoints, attempt to bypass rate limits, or process malicious payloads."
    },
    {
      title: "3. Local Execution & Data Ownership",
      icon: <FileText className="w-4 h-4 text-accent-cyan" />,
      content: "For all client-side tools, input data, files, and outputs remain exclusively within your device memory. Night X claims no intellectual property rights over any images, code, or documents processed through the platform."
    },
    {
      title: "4. Intellectual Property & Brand",
      icon: <Scale className="w-4 h-4 text-primary" />,
      content: "The Night X platform interface, custom algorithms, design systems, and brand assets are protected by copyright and intellectual property laws. Open-source components are subject to their respective licenses."
    }
  ];

  return (
    <div className="min-h-screen text-white pt-24 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <FileText size={13} />
            <span>Platform Agreement</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Terms of Service
          </h1>

          <p className="text-xs sm:text-sm text-text-tertiary">
            Clear guidelines on service availability, responsible usage, and data ownership.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5">
          {sections.map((section, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-7 shadow-[var(--shadow-raised-sm)] space-y-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-surface-inset border border-white/10 flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  {section.title}
                </h2>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed pl-10">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="p-5 rounded-2xl border border-white/[0.06] bg-surface-card text-center text-xs text-text-muted">
          For legal inquiries or enterprise questions, contact: <a href="mailto:support@night-x-v2.vercel.app" className="text-primary font-semibold hover:underline">support@night-x-v2.vercel.app</a>
        </div>
      </div>
    </div>
  );
}
