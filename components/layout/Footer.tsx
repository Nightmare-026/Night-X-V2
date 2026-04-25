'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Github, Heart, Instagram, Mail, MessageSquare, Send, Zap } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError('Failed to connect to the server');
      }
    } finally {
      setLoading(false);
    }
  };

  const toolLinks = [
    { name: 'Image Tools', slug: 'image' },
    { name: 'Security Tools', slug: 'security' },
    { name: 'Text Tools', slug: 'text' },
    { name: 'Developer Tools', slug: 'developer' },
    { name: 'Utility Tools', slug: 'utility' },
    { name: 'Daily Life Tools', slug: 'life' },
    { name: 'AI Tools', slug: 'ai' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms & Conditions', href: '/terms' },
    { name: 'Contact', href: '/contact' },
    { name: 'Our Services', href: '/services' },
  ];

  const supportLinks = [
    { name: 'Feedback', href: '/feedback', icon: <MessageSquare className="h-4 w-4" /> },
    { name: 'Report a Bug', href: `mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@night-x.app'}`, icon: <Mail className="h-4 w-4" /> },
    { name: 'Support Us', href: '/support', icon: <Heart className="h-4 w-4 text-red-500" />, subtext: 'Help us grow' },
    { name: 'FAQ', href: '/faq', icon: null },
  ];

  return (
    <footer className="border-t border-white/5 bg-[#0A0D18] pb-8 pt-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-16 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <Link href="/" className="group mb-4 flex items-center gap-2">
              <Zap className="h-6 w-6 fill-accent-purple/20 text-accent-purple" />
              <span className="font-syne text-xl font-bold text-white">Night X</span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-white/50">
              Practical tools for creators, developers, and everyday digital work in one focused interface.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/Nightmare-026/Night-X-V2" target="_blank" rel="noopener noreferrer" className="rounded-lg bg-white/5 p-2 text-white/40 transition-all hover:bg-white/10 hover:text-white" aria-label="Visit the GitHub repository">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-white">Quick Tools</h4>
            <ul className="space-y-4">
              {toolLinks.map((link) => (
                <li key={link.name}>
                  <Link href={`/dashboard?category=${link.slug}`} className="group flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-accent-purple">
                    {link.name}
                    <ArrowRight className="h-3 w-3 -translate-x-2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-white">Company</h4>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-white/40 transition-colors hover:text-accent-purple">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-white">Support</h4>
            <ul className="space-y-4">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="group flex flex-col gap-0.5">
                    <div className="flex items-center gap-2 text-sm text-white/40 transition-colors group-hover:text-accent-purple">
                      {link.icon}
                      <span>{link.name}</span>
                      {link.subtext && <span className="text-[10px] opacity-40 ml-1 group-hover:opacity-100 transition-opacity">— {link.subtext}</span>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <h4 className="mb-6 font-semibold text-white">Stay Updated</h4>
            <p className="mb-4 text-xs text-white/40">Get notified about new tools and feature updates.</p>
            <form onSubmit={handleSubscribe} className="relative">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-sm text-white transition-colors focus:border-accent-purple focus:outline-none"
                required
              />
              <button
                type="submit"
                disabled={loading || subscribed}
                className="absolute bottom-2 right-2 top-2 rounded-lg bg-accent-purple px-3 text-white shadow-lg shadow-accent-purple/20 transition-colors hover:bg-accent-purple/90 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Subscribe to updates"
              >
                {loading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : subscribed ? (
                  <Zap className="h-4 w-4 fill-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </form>
            {error && <p className="mt-2 text-[10px] font-medium text-red-400">{error}</p>}
            {subscribed && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-[10px] font-medium text-accent-cyan">
                Thanks for subscribing. You are on the list now.
              </motion.p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-6 border-t border-white/5 pt-10 text-center">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} <span className="font-medium text-white/50">Night X</span>. All rights reserved.
            </p>
            <p className="flex items-center gap-1.5 text-xs text-white/30">
              Made with ❤️ in India
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
