'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  {
    category: "General",
    question: "Do I need to create an account to use Night X tools?",
    answer: "No. 12 core tools (including Image Compressor, Hash Generator, Regex Tester, Word Counter, JSON Formatter, etc.) are instantly accessible without signing in. Creating a free account gives you access to the AI Assistant, saved favorites, and local history tracking."
  },
  {
    category: "Security",
    question: "Are my files, images, or passwords sent to remote servers?",
    answer: "No. For all standard utilities, processing happens directly inside your browser using WebAssembly and Web Crypto API. Files, images, and keys never touch our servers."
  },
  {
    category: "AI Workflows",
    question: "How do AI features work and what are the limits?",
    answer: "AI tools (AI Paraphraser, AI Bio Generator, and Workspace Assistant) communicate with secure AI endpoints using encrypted HTTPS payloads. Each free user receives 30 queries per day."
  },
  {
    category: "Offline",
    question: "Can I use Night X tools without an active internet connection?",
    answer: "Yes! Once you visit Night X, the application assets and client-side processing engines are cached in your browser. All local tools continue to work even when offline."
  },
  {
    category: "Pricing",
    question: "Is Night X really 100% free?",
    answer: "Yes. Night X is completely free forever. There are no subscriptions, no credit card requirements, no paywalls, and no ads."
  }
];

function FaqItem({ item, index }: { item: typeof items[0], index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-surface-card shadow-[var(--shadow-raised-sm)] overflow-hidden transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 sm:p-5 text-left focus-visible:ring-2 focus-visible:ring-primary outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5 pr-4">
          <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {item.category}
          </span>
          <h2 className="text-xs sm:text-sm font-bold text-white leading-tight">{item.question}</h2>
        </div>
        <ChevronDown 
          className={cn("h-4 w-4 text-text-muted transition-transform duration-200 shrink-0", isOpen && "rotate-180 text-primary")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="border-t border-white/[0.04] p-4 sm:p-5 pt-3 bg-surface-inset">
              <p className="text-xs text-text-tertiary leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen text-white pt-24 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <HelpCircle size={13} />
            <span>Knowledge Base</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Frequently Asked Questions
          </h1>

          <p className="text-xs sm:text-sm text-text-tertiary">
            Everything you need to know about browser execution, privacy guarantees, and tool capabilities.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <FaqItem key={item.question} item={item} index={index} />
          ))}
        </div>

        <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-surface-elevated to-surface-card p-6 sm:p-8 text-center space-y-3 shadow-[var(--shadow-raised-md)]">
          <h3 className="text-base sm:text-lg font-bold text-white">Have a different question?</h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            Our engineering team is here to help. Reach out directly and we will get back to you promptly.
          </p>
          <div className="pt-2">
            <Link href="/contact" className="btn-primary text-xs py-2.5 px-6 shadow-md inline-flex items-center gap-2">
              <span>Contact Support</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
