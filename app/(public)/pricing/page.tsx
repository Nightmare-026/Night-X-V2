'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, Shield, ArrowRight, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: "Community",
      badge: "Free Forever",
      price: "$0",
      period: "forever",
      description: "Everything you need for everyday developer utilities, image conversion, and cryptographic tasks.",
      features: [
        "All 40+ Browser-First Client Tools",
        "100% Private, Zero Cloud Logging",
        "Unlimited Offline Execution",
        "Standard JSON/CSV Converters",
        "QR Code & Barcode Generation",
        "Community Support",
      ],
      cta: "Start Using Free",
      href: "/tools",
      popular: false,
      buttonVariant: "btn-secondary"
    },
    {
      name: "Pro Creator",
      badge: "Most Popular",
      price: billingCycle === 'monthly' ? "$9" : "$7",
      period: billingCycle === 'monthly' ? "per month" : "per month, billed annually",
      description: "Supercharge your workflows with unlimited AI assistant queries and high-resolution media operations.",
      features: [
        "Everything in Community Plan",
        "Unlimited AI Assistant Queries",
        "AI Bio & Paraphrasing Engine",
        "Advanced AI Background Removal",
        "Batch Image & PDF Processing",
        "Custom Regex & Code Snippet Cloud Sync",
        "Priority Feature Requests & Support",
      ],
      cta: "Upgrade to Pro",
      href: "/auth/signup?plan=pro",
      popular: true,
      buttonVariant: "btn-primary"
    }
  ];

  const faqs = [
    {
      q: "Are the basic tools really free forever?",
      a: "Yes. All client-side tools (Image Compressor, Hash Generator, Regex Tester, Word Counter, JSON Formatter, etc.) run locally in your browser and will always remain completely free."
    },
    {
      q: "Where does my data go when I use a tool?",
      a: "For all 40+ client-side tools, your data never leaves your browser memory. We use WebAssembly and WebWorkers for zero-leakage security."
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes. You can manage or cancel your subscription at any time with a single click from your Account Settings."
    },
    {
      q: "Do you offer team or enterprise licenses?",
      a: "Yes, for custom enterprise needs, dedicated cloud instances, or high-volume API access, contact us at support@night-x.app."
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6">
      <div className="max-w-[1140px] mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary-400">
            <Sparkles size={13} />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Predictable Plans for Creators & Engineers
          </h1>

          <p className="text-sm sm:text-base text-text-tertiary">
            Use 40+ tools completely free with zero friction, or unlock unlimited AI workflows with Pro.
          </p>

          {/* Billing Switch */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={cn(
                "px-4 py-1.5 rounded-xl text-xs font-semibold transition-all",
                billingCycle === 'monthly'
                  ? "bg-primary text-black shadow-sm font-bold"
                  : "text-text-secondary hover:text-white"
              )}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={cn(
                "flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all",
                billingCycle === 'yearly'
                  ? "bg-primary text-black shadow-sm font-bold"
                  : "text-text-secondary hover:text-white"
              )}
            >
              <span>Yearly Billing</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/20 font-bold uppercase">Save 20%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "rounded-3xl p-8 flex flex-col justify-between border relative overflow-hidden transition-all shadow-[var(--shadow-raised-md)]",
                plan.popular 
                  ? "bg-gradient-to-b from-surface-elevated to-surface-card border-primary/40 shadow-[0_20px_50px_rgba(34,197,94,0.12)]" 
                  : "bg-surface-card border-white/[0.08]"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-primary to-green-400 text-black text-[10px] font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider">
                  Recommended
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                    <Badge variant={plan.popular ? "default" : "secondary"}>
                      {plan.badge}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-tertiary leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1.5 pb-4 border-b border-white/[0.08]">
                  <span className="text-4xl sm:text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-text-muted font-medium">{plan.period}</span>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold text-text-secondary uppercase tracking-wider">What's Included</p>
                  <ul className="space-y-2.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs text-text-secondary">
                        <div className="w-4 h-4 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-400 shrink-0 mt-0.5">
                          <Check size={10} />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8 mt-auto">
                <Link
                  href={plan.href}
                  className={cn(plan.buttonVariant, "w-full text-center text-xs font-bold py-3 shadow-md flex items-center justify-center gap-2")}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-4xl mx-auto rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-sm)] space-y-6">
          <h3 className="text-lg font-bold text-white tracking-tight">Feature Matrix Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/[0.08] text-text-muted">
                  <th className="py-3 font-semibold">Capability</th>
                  <th className="py-3 font-semibold">Community (Free)</th>
                  <th className="py-3 font-semibold text-primary-400">Pro Creator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-text-secondary">
                <tr>
                  <td className="py-3 font-medium text-white">40+ Client-Side Tools</td>
                  <td className="py-3">Unlimited</td>
                  <td className="py-3 font-bold text-primary-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">Local Privacy Engine</td>
                  <td className="py-3">Included (Zero logs)</td>
                  <td className="py-3 font-bold text-primary-400">Included (Zero logs)</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">AI Assistant Chat Queries</td>
                  <td className="py-3">5 / day</td>
                  <td className="py-3 font-bold text-primary-400">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">AI Background Removal</td>
                  <td className="py-3">Standard</td>
                  <td className="py-3 font-bold text-primary-400">High-Res HD</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">Batch Image Compression</td>
                  <td className="py-3">1 by 1</td>
                  <td className="py-3 font-bold text-primary-400">Up to 50 files</td>
                </tr>
                <tr>
                  <td className="py-3 font-medium text-white">Support SLA</td>
                  <td className="py-3">Community</td>
                  <td className="py-3 font-bold text-primary-400">Priority 24/7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing FAQs */}
        <div className="max-w-3xl mx-auto space-y-6">
          <h3 className="text-xl font-bold text-white text-center">Frequently Asked Questions</h3>
          <div className="grid gap-4">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/[0.06] bg-surface-card space-y-1.5 shadow-sm">
                <h4 className="text-sm font-bold text-white">{faq.q}</h4>
                <p className="text-xs text-text-tertiary leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
