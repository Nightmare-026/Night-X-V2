'use client';

import React from "react";
import { LifeBuoy, Mail, MessageSquare, BookOpen, Activity, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@night-x-v2.vercel.app";

  const supportCards = [
    {
      icon: BookOpen,
      title: "Developer & Tool Documentation",
      description: "Step-by-step guidance on client-side algorithms, formats, and tool capabilities.",
      link: "/docs",
      linkText: "Read Documentation"
    },
    {
      icon: MessageSquare,
      title: "Frequently Asked Questions",
      description: "Quick answers to common questions about privacy, offline access, and AI limits.",
      link: "/faq",
      linkText: "View FAQ"
    },
    {
      icon: Activity,
      title: "System & Engine Status",
      description: "Real-time verification of local client-side engines and external API status.",
      link: "/status",
      linkText: "Check Health"
    },
    {
      icon: Mail,
      title: "Direct Engineering Contact",
      description: "Report bugs, request new utilities, or inquire about open-source collaboration.",
      link: "/contact",
      linkText: "Send Message"
    }
  ];

  return (
    <div className="min-h-screen text-white pt-24 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 p-2 px-3 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Help Desk & Troubleshooting</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">Support & Resources</h1>
          <p className="text-xs sm:text-sm text-text-tertiary max-w-xl mx-auto leading-relaxed">
            Need help using Night X or experiencing an unexpected behavior? Access our guides, system diagnostics, and communication channels.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {supportCards.map((card, i) => (
            <div key={i} className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 shadow-[var(--shadow-raised-sm)] space-y-3 flex flex-col justify-between hover:border-primary/30 transition-all">
              <div className="space-y-2">
                <div className="w-9 h-9 rounded-xl bg-surface-inset border border-white/10 flex items-center justify-center text-primary">
                  <card.icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">{card.title}</h3>
                <p className="text-xs text-text-tertiary leading-relaxed">{card.description}</p>
              </div>

              <div className="pt-2">
                <Link href={card.link} className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                  <span>{card.linkText}</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Sponsor & Open Source Note */}
        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 text-center space-y-3 shadow-sm">
          <div className="inline-flex p-2 bg-primary/10 text-primary rounded-xl">
            <Heart className="w-5 h-5 fill-primary" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white">Open Source & Free Sovereign Software</h3>
          <p className="text-xs text-text-tertiary max-w-md mx-auto leading-relaxed">
            Night X is free forever. If you want to contribute, submit a pull request, report issues, or sponsor domain infrastructure:
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://github.com/Nightmare-026/Night-X-V2"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs py-2 px-4"
            >
              GitHub Repository
            </a>
            <a
              href={`mailto:${supportEmail}`}
              className="btn-primary text-xs py-2 px-4"
            >
              Email Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
