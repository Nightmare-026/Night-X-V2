'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Github, Twitter, Heart, Send, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState('');

  // Hide footer on auth pages or dashboard sub-pages if requested
  const isAuthPage = pathname?.startsWith('/auth');
  if (isAuthPage) return null;

  const quickTools = [
    { name: 'Image Tools', href: '/dashboard?category=image' },
    { name: 'Security Tools', href: '/dashboard?category=security' },
    { name: 'Text Tools', href: '/dashboard?category=text' },
    { name: 'Developer Tools', href: '/dashboard?category=developer' },
    { name: 'Utility Tools', href: '/dashboard?category=utility' },
    { name: 'Daily Life Tools', href: '/dashboard?category=life' },
    { name: 'AI Tools', href: '/dashboard?category=ai' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Contact', href: '/contact' },
    { name: 'Our Services', href: '/services' },
  ];

  const supportLinks = [
    { name: 'Feedback', href: '/feedback' },
    { name: 'Report a Bug', href: '/support?tab=bug' },
    { name: 'Support Us', href: '/support?tab=donate' },
    { name: 'FAQ', href: '/support?tab=faq' },
  ];

  return (
    <footer className="bg-black/40 border-t border-white/[0.05] pt-20 pb-10 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand & Newsletter Column */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-[28px] h-[28px] rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(139,92,246,0.4)]">
                  N
                </div>
                <span className="text-[1.25rem] font-bold bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent tracking-[-0.02em]">
                  Night X
                </span>
              </Link>
              <p className="text-[0.875rem] text-text-tertiary leading-[1.6] max-w-[240px]">
                Practical tools for creators, developers, and everyday digital work in one focused interface.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-[0.8125rem] font-bold text-white/90 uppercase tracking-[0.05em]">Stay Updated</h4>
              <div className="relative max-w-[240px] group">
                <input 
                  type="email" 
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[0.8125rem] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all"
                />
                <button className="absolute right-1.5 top-1.5 p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-md transition-colors">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="text-[0.8125rem] font-bold text-white/90 uppercase tracking-[0.05em] mb-6">Product</h4>
            <ul className="space-y-3.5">
              <li><Link href="/dashboard" className="text-[0.875rem] text-text-tertiary hover:text-primary-400 transition-colors">All Tools</Link></li>
              <li><Link href="/pricing" className="text-[0.875rem] text-text-tertiary hover:text-primary-400 transition-colors">Pricing</Link></li>
              <li><Link href="/api-docs" className="text-[0.875rem] text-text-tertiary hover:text-primary-400 transition-colors">API Docs</Link></li>
              <li><Link href="/changelog" className="text-[0.875rem] text-text-tertiary hover:text-primary-400 transition-colors">Changelog</Link></li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="text-[0.8125rem] font-bold text-white/90 uppercase tracking-[0.05em] mb-6">Company</h4>
            <ul className="space-y-3.5">
              {companyLinks.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-[0.875rem] text-text-tertiary hover:text-primary-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-[0.8125rem] font-bold text-white/90 uppercase tracking-[0.05em] mb-6">Support</h4>
            <ul className="space-y-3.5">
              <li><Link href="/support" className="text-[0.875rem] text-text-tertiary hover:text-primary-400 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-[0.875rem] text-text-tertiary hover:text-primary-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/status" className="text-[0.875rem] text-text-tertiary hover:text-primary-400 transition-colors">System Status</Link></li>
              <li className="flex items-center gap-4 pt-2">
                <a href="#" className="text-text-tertiary hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                <a href="#" className="text-text-tertiary hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[0.75rem] text-text-muted">
            © {new Date().getFullYear()} Night X. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
             <p className="text-[0.75rem] text-text-muted flex items-center gap-1.5">
              Made with <Heart className="w-3 h-3 text-accent-pink fill-accent-pink" /> in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
