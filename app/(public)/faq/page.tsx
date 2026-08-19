'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  {
    category: "General",
    question: "Do I need to create an account to use Night X?",
    answer: "No. All 40+ client-side utilities (image compression, conversion, hash calculations, regex testing, JSON formatting, etc.) are freely accessible without signing in. An account is only required if you want to sync preferences or use persistent AI assistant sessions."
  },
  {
    category: "Security",
    question: "Are my files, images, and text transmitted to remote servers?",
    answer: "No. For all standard utilities, everything executes directly in your browser's local JavaScript and WebAssembly memory. Files never touch our backend servers."
  },
  {
    category: "AI Features",
    question: "How do AI features work and what are the limits?",
    answer: "AI tools (such as AI Paraphraser and AI Bio Generator) use encrypted API connections to synthesize responses. Free accounts receive a generous daily quota, while Pro subscribers get unlimited queries."
  },
  {
    category: "Platform",
    question: "Can I use Night X tools offline?",
    answer: "Yes! Once you visit Night X, the application assets and client-side processing libraries are cached in your browser. You can use core tools even without an internet connection."
  },
  {
    category: "Billing",
    question: "How do I upgrade or cancel a subscription?",
    answer: "You can upgrade directly from the Pricing page or your Account Settings. Subscriptions can be managed or canceled anytime with zero hassle."
  }
];

function FaqItem({ item, index }: { item: typeof items[0], index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="rounded-2xl border border-white/[0.08] bg-surface-card shadow-[var(--shadow-raised-sm)] overflow-hidden transition-all"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left focus-visible:ring-2 focus-visible:ring-primary outline-none"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 pr-4">
          <span className="text-[10px] font-bold text-primary-400 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {item.category}
          </span>
          <h2 className="text-sm font-bold text-white leading-tight">{item.question}</h2>
        </div>
        <ChevronDown 
          className={cn("h-4 w-4 text-text-muted transition-transform duration-200 shrink-0", isOpen && "rotate-180 text-primary-400")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-t border-white/[0.04] p-5 pt-3 bg-surface-inset">
              <p className="text-xs sm:text-sm text-text-tertiary leading-relaxed">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen text-white pt-16 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary-400">
            <HelpCircle size={14} />
            <span>Frequently Asked Questions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Help & Knowledge Base
          </h1>

          <p className="text-sm text-text-tertiary">
            Everything you need to know about browser processing, security boundaries, and platform capabilities.
          </p>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <FaqItem key={item.question} item={item} index={index} />
          ))}
        </div>

        <div className="rounded-3xl border border-primary/30 bg-gradient-to-b from-surface-elevated to-surface-card p-8 text-center space-y-4 shadow-[var(--shadow-raised-md)]">
          <h3 className="text-lg font-bold text-white">Still have a question?</h3>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            Our engineering team is happy to assist. Send us a message and we'll reply promptly.
          </p>
          <div className="pt-2">
            <Link href="/contact" className="btn-primary text-xs py-2.5 px-6 shadow-md inline-flex items-center gap-2">
              <span>Contact Support</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
