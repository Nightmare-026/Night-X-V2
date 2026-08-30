'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, ShieldCheck, Heart } from 'lucide-react';
import BrandWordmark from '@/components/ui/BrandWordmark';

export default function Footer() {
  const pathname = usePathname();

  const isAuthPage = pathname?.startsWith('/auth');
  if (isAuthPage) return null;

  const toolCategories = [
    { name: 'Image Processing', href: '/tools?category=image' },
    { name: 'Security & Cryptography', href: '/tools?category=security' },
    { name: 'Text & Markdown', href: '/tools?category=text' },
    { name: 'Developer Utilities', href: '/tools?category=developer' },
    { name: 'Everyday Life Helpers', href: '/tools?category=life' },
    { name: 'AI Workflows', href: '/dashboard/ai' },
  ];

  const platformLinks = [
    { name: 'All 42 Tools Catalog', href: '/tools' },
    { name: 'Why 100% Free?', href: '/pricing' },
    { name: 'Developer & API Docs', href: '/docs' },
    { name: 'System Status', href: '/status' },
    { name: 'Release Changelog', href: '/changelog' },
  ];

  const resourceLinks = [
    { name: 'About Night X', href: '/about' },
    { name: 'Security Architecture', href: '/security' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Help & Support', href: '/support' },
    { name: 'Product Feedback', href: '/feedback' },
  ];

  return (
    <footer className="bg-[#06080C] border-t border-white/[0.06] pt-14 pb-10 px-4 sm:px-6 relative overflow-hidden" role="contentinfo">
      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-primary/4 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="space-y-2.5">
              <Link href="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg" aria-label="Night X Home">
                <BrandWordmark size="md" />
              </Link>
              <p className="text-xs text-text-tertiary leading-[1.7] max-w-[320px]">
                High-performance developer utilities, image processors, cryptographic instruments, and AI workflows running locally in your browser.
              </p>
            </div>

            {/* Privacy Promise Pill */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-white/[0.06] text-xs text-text-secondary w-fit">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>100% In-Browser Memory Safety</span>
              </div>

              <Link 
                href="/status"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-white/[0.06] text-xs text-text-secondary hover:border-primary/40 hover:text-white transition-all w-fit"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Client Engines Operational</span>
              </Link>
            </div>
          </div>

          {/* Ecosystem Column */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.1em] mb-3.5">Tool Suites</h4>
            <ul className="space-y-2">
              {toolCategories.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-xs text-text-tertiary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none rounded">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.1em] mb-3.5">Platform</h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-text-tertiary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none rounded">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-[11px] font-bold text-white uppercase tracking-[0.1em] mb-3.5">Resources & Trust</h4>
            <ul className="space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-xs text-text-tertiary hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none rounded">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <a 
                  href="https://github.com/Nightmare-026/Night-X-V2" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-2 p-2 rounded-lg bg-surface-card border border-white/[0.06] text-xs text-text-secondary hover:text-white hover:border-primary/30 transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
                  aria-label="Night X on GitHub"
                >
                  <Github className="w-3.5 h-3.5 text-primary" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-text-muted">
          <p>
            © {new Date().getFullYear()} Night X. Free sovereign client-side architecture.
          </p>
          <p className="flex items-center gap-1.5">
            Crafted for speed and privacy <Heart className="w-3 h-3 text-primary fill-primary" />
          </p>
        </div>
      </div>
    </footer>
  );
}
