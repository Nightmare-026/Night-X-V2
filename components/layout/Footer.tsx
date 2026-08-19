'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Twitter, Heart, Send, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import BrandWordmark from '@/components/ui/BrandWordmark';
import { useToast } from '@/components/ui/Toast';

export default function Footer() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const isAuthPage = pathname?.startsWith('/auth');
  if (isAuthPage) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast('Please enter a valid email address', 'error');
      return;
    }

    setIsSubscribing(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setIsSubscribed(true);
        toast('Subscribed to Night X updates!', 'success');
        setEmail('');
      } else {
        const data = await res.json();
        toast(data.error || 'Failed to subscribe', 'error');
      }
    } catch {
      toast('Failed to subscribe. Please try again.', 'error');
    } finally {
      setIsSubscribing(false);
    }
  };

  const toolCategories = [
    { name: 'Image Processing', href: '/tools?category=image' },
    { name: 'Security & Crypto', href: '/tools?category=security' },
    { name: 'Text & Markdown', href: '/tools?category=text' },
    { name: 'Developer Utilities', href: '/tools?category=developer' },
    { name: 'Everyday Life', href: '/tools?category=life' },
    { name: 'AI Workflows', href: '/dashboard/ai' },
  ];

  const platformLinks = [
    { name: 'All Tools Catalog', href: '/tools' },
    { name: 'Developer & API Docs', href: '/docs' },
    { name: 'Pricing & Plans', href: '/pricing' },
    { name: 'System Status', href: '/status' },
    { name: 'Changelog & Updates', href: '/changelog' },
  ];

  const companyLinks = [
    { name: 'About Night X', href: '/about' },
    { name: 'Security Center', href: '/security' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  const supportLinks = [
    { name: 'Help & Support', href: '/support' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Product Feedback', href: '/feedback' },
    { name: 'Frequently Asked Questions', href: '/faq' },
  ];

  return (
    <footer className="bg-[#06080C] border-t border-white/[0.06] pt-16 pb-12 px-4 sm:px-6 relative overflow-hidden" role="contentinfo">
      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand & Newsletter Column (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <Link href="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg" aria-label="Night X Home">
                <BrandWordmark size="md" />
              </Link>
              <p className="text-[0.875rem] text-text-tertiary leading-[1.6] max-w-[340px]">
                High-performance developer utilities, image processors, cryptographic keys, and AI workflows running locally in your browser.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-[0.75rem] font-bold text-white/90 uppercase tracking-[0.1em]">Stay Updated</h4>
              <form onSubmit={handleSubscribe} className="relative max-w-[320px] group" aria-label="Newsletter Subscription Form">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isSubscribed || isSubscribing}
                  required
                  aria-label="Email address for newsletter"
                  className="w-full bg-surface-inset border border-white/[0.1] rounded-xl px-4 py-2.5 text-[0.8125rem] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60 shadow-[var(--shadow-inset-sm)]"
                />
                <button 
                  type="submit" 
                  disabled={isSubscribed || isSubscribing}
                  aria-label="Submit newsletter subscription"
                  className="absolute right-1.5 top-1.5 p-2 bg-primary/20 text-primary-300 hover:bg-primary/30 rounded-lg transition-colors disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary outline-none"
                >
                  {isSubscribed ? <CheckCircle2 className="w-3.5 h-3.5 text-primary-400" /> : <Send className="w-3.5 h-3.5" />}
                </button>
              </form>
            </div>

            {/* System Status Pill */}
            <div>
              <Link 
                href="/status"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card border border-white/[0.08] text-xs font-semibold text-text-secondary hover:border-primary/40 hover:text-white transition-all shadow-[var(--shadow-raised-sm)]"
              >
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span>All Systems Operational</span>
              </Link>
            </div>
          </div>

          {/* Tools Column */}
          <div>
            <h4 className="text-[0.75rem] font-bold text-white/90 uppercase tracking-[0.1em] mb-4">Ecosystem</h4>
            <ul className="space-y-2.5">
              {toolCategories.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-[0.8125rem] text-text-tertiary hover:text-primary-300 transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none rounded">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Column */}
          <div>
            <h4 className="text-[0.75rem] font-bold text-white/90 uppercase tracking-[0.1em] mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[0.8125rem] text-text-tertiary hover:text-primary-300 transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none rounded">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-[0.75rem] font-bold text-white/90 uppercase tracking-[0.1em] mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[0.8125rem] text-text-tertiary hover:text-primary-300 transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none rounded">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-[0.75rem] font-bold text-white/90 uppercase tracking-[0.1em] mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[0.8125rem] text-text-tertiary hover:text-primary-300 transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none rounded">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-3 pt-3">
                <a 
                  href="https://github.com/Nightmare-026/Night-X-V2" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 rounded-lg bg-surface-card border border-white/[0.06] text-text-tertiary hover:text-white hover:border-primary/30 transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
                  aria-label="Night X on GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2 rounded-lg bg-surface-card border border-white/[0.06] text-text-tertiary hover:text-white hover:border-primary/30 transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
                  aria-label="Night X on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.75rem] text-text-muted">
            © {new Date().getFullYear()} Night X. All rights reserved. Sovereign client-side first architecture.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-[0.75rem] text-text-muted flex items-center gap-1.5">
              Built with precision and care <Heart className="w-3 h-3 text-primary-400 fill-primary-400" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
