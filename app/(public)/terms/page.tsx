'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, AlertTriangle, Scale, Mail } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <Shield className="w-5 h-5 text-primary-400" />,
      content: "By accessing or utilizing the Night X application, you agree to these Terms of Service. Night X provides browser-first utility tools, cryptographic processors, and AI-assisted workflows. Services are provided on an as-is and as-available basis."
    },
    {
      title: "2. Lawful & Permissible Use",
      icon: <AlertTriangle className="w-5 h-5 text-accent-amber" />,
      content: "You agree to use Night X tools responsibly and in compliance with all applicable laws. You may not use automated scripts to spam API endpoints, attempt to bypass rate limits, or process malicious payloads."
    },
    {
      title: "3. Local Execution & Data Ownership",
      icon: <FileText className="w-5 h-5 text-accent-cyan" />,
      content: "For all client-side tools, input data, files, and outputs remain exclusively within your device memory. Night X claims no intellectual property rights over any images, code, or documents processed through the platform."
    },
    {
      title: "4. Intellectual Property & Brand",
      icon: <Scale className="w-5 h-5 text-primary-400" />,
      content: "The Night X platform interface, custom algorithms, design systems, and brand assets are protected by copyright and intellectual property laws. Open-source components are subject to their respective licenses."
    }
  ];

  return (
    <div className="min-h-screen text-white pt-16 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary-400">
            <FileText size={14} />
            <span>Platform Agreement</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Terms of Service
          </h1>

          <p className="text-sm text-text-tertiary">
            Clear guidelines on service availability, responsible usage, and data ownership.
          </p>
        </div>

        <div className="grid gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-sm)] space-y-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-surface-inset border border-white/10 flex items-center justify-center">
                  {section.icon}
                </div>
                <h2 className="text-lg font-bold text-white">
                  {section.title}
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pl-13">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="p-6 rounded-2xl border border-white/[0.06] bg-surface-card text-center text-xs text-text-muted">
          For legal inquiries or enterprise questions, contact: <a href="mailto:support@night-x.app" className="text-primary-400 font-semibold hover:underline">support@night-x.app</a>
        </div>
      </div>
    </div>
  );
}
