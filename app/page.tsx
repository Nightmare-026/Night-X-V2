'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Brain, ChevronDown, Grid, Lock, Shield, Star, Zap } from 'lucide-react';
import { CATEGORIES, TOOLS } from '@/lib/tools-registry';

export default function LandingPage() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

  const featuredTools = [
    'image-compressor',
    'json-formatter',
    'password-generator',
    'qr-generator',
    'word-counter',
    'background-remover',
    'age-calculator',
    'ai-paraphraser',
  ]
    .map((slug) => TOOLS.find((tool) => tool.slug === slug))
    .filter(Boolean);

  return (
    <div className="flex w-full flex-col">
      <section className="relative flex h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="h-full w-full opacity-50"
            style={{
              background:
                'radial-gradient(ellipse at 20% 50%, rgba(124,110,250,0.3) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,229,255,0.2) 0%, transparent 50%), #06080F',
              backgroundSize: '200% 200%',
              animation: 'meshMove 8s ease-in-out infinite alternate',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#06080F]/80 via-[#06080F]/60 to-[#06080F]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,110,250,0.1),transparent_50%)]" />
        </div>

        <motion.div style={{ opacity, scale }} className="container relative z-10 mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">
              Free tools • Account unlocks dashboard and AI features
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl font-syne">
            One Hub.
            <br />
            <span className="bg-gradient-to-r from-accent-purple to-accent-cyan bg-clip-text text-transparent">
              Every Tool You Need.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/50 md:text-xl font-dm-sans">
            Use image, text, developer, calculator, security, and AI-assisted tools in one focused workspace.
            Sign in for the full dashboard experience and AI-powered features.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/auth/signup" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent-purple px-8 py-4 font-bold text-white shadow-xl shadow-accent-purple/20 transition-all hover:scale-105 sm:w-auto">
              Create Account <ArrowRight className="h-5 w-5" />
            </Link>
            <button
              onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-8 py-4 font-bold text-white transition-all hover:bg-white/10 sm:w-auto backdrop-blur-md"
            >
              Explore Tools
            </button>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20">
          <ChevronDown className="h-8 w-8" />
        </motion.div>
      </section>

      <section className="border-y border-white/5 bg-[#0A0D18] py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: '40+ Tools', icon: <Zap className="h-5 w-5" />, value: 'Live' },
              { label: '7 Categories', icon: <Grid className="h-5 w-5" />, value: 'Organized' },
              { label: 'AI Tools', icon: <Brain className="h-5 w-5" />, value: 'Optional' },
              { label: 'Browser-first', icon: <Shield className="h-5 w-5" />, value: 'Practical' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1">
                <div className="mb-2 text-accent-purple">{stat.icon}</div>
                <span className="font-syne text-2xl font-bold text-white">{stat.label}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-white/20">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tools" className="bg-background py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl font-syne">Everything you need in one place</h2>
            <p className="mx-auto max-w-xl text-white/40">
              Organized into intuitive categories so you can jump to the right tool quickly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.filter((category) => category.id !== 'all').map((category) => (
              <Link key={category.id} href={`/dashboard?category=${category.id}`}>
                <motion.div whileHover={{ y: -5 }} className="group relative h-full cursor-pointer overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-8 transition-all hover:border-accent-purple/50">
                  <div className="relative z-10">
                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-purple/10 text-2xl" aria-hidden="true">
                      {category.icon}
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-white">{category.label}</h3>
                    <p className="mb-6 text-sm text-white/40">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const categoryTools = TOOLS.filter((tool) => tool.category === category.id);
                        const uniqueTags = Array.from(new Set(categoryTools.map((t) => t.tags[0])));
                        return uniqueTags.slice(0, 3).map((tag) => (
                          <span key={tag} className="rounded-md border border-white/5 bg-white/5 px-2 py-1 text-[10px] font-bold uppercase text-white/30">
                            {tag}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0A0D18] py-24">
        <div className="container mx-auto px-4">
          <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-white md:text-5xl font-syne">Most Popular Tools</h2>
              <p className="text-white/40">A few of the tools people reach for most often.</p>
            </div>
            <Link href="/dashboard" className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-accent-cyan transition-colors hover:text-white">
              View All Tools <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTools.map((tool: any, index) => {
              const isPublic = tool.isPublic;
              return (
                <motion.div
                  key={tool.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-2xl border border-white/5 bg-background p-6 transition-all hover:border-accent-cyan/30"
                >
                  <Link 
                    href={isPublic ? `/tools/${tool.slug}` : "/auth/signin"} 
                    className="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 backdrop-blur-[2px]"
                  >
                    {isPublic ? (
                      <ArrowRight className="mb-2 h-8 w-8 text-white" />
                    ) : (
                      <Lock className="mb-2 h-8 w-8 text-white" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-widest text-white">
                      {isPublic ? 'Try it free' : 'Sign in to use'}
                    </span>
                  </Link>

                  <div className="mb-4 inline-block text-3xl transition-transform duration-300 group-hover:scale-110" aria-hidden="true">{tool.icon}</div>
                  <h4 className="mb-2 text-lg font-bold text-white">{tool.name}</h4>
                  <p className="line-clamp-2 text-xs leading-relaxed text-white/30">{tool.description}</p>
                  {tool.isAI && (
                    <span className="absolute right-4 top-4 rounded-full bg-accent-purple/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-accent-purple">
                      AI Powered
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {[
              {
                icon: <Shield className="h-10 w-10 text-accent-cyan" />,
                title: 'Browser-first for many tools',
                desc: 'Many utility workflows run directly in your browser, while AI and account features use secure server routes where needed.',
              },
              {
                icon: <Brain className="h-10 w-10 text-accent-purple" />,
                title: 'AI-assisted workflows',
                desc: 'Use AI tools for rewriting, bio generation, and guided help inside the dashboard when signed in.',
              },
              {
                icon: <Zap className="h-10 w-10 text-yellow-500" />,
                title: 'Fast and focused',
                desc: 'Night X is built to keep common utility tasks simple, polished, and easy to reach from one place.',
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center md:text-left">
                <div className="mb-6 inline-block">{feature.icon}</div>
                <h3 className="mb-4 text-2xl font-bold text-white font-syne">{feature.title}</h3>
                <p className="leading-relaxed text-white/40">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-r from-accent-purple to-accent-cyan p-12 text-center md:p-20">
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />
            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="mb-6 text-4xl font-bold text-white md:text-6xl font-syne">Ready to boost your productivity?</h2>
              <p className="mb-10 text-lg text-white/80 md:text-xl">
                Create an account to unlock the full dashboard, saved access, and AI-assisted tools.
              </p>
              <Link href="/auth/signup" className="inline-flex rounded-2xl bg-white px-10 py-5 font-bold text-black shadow-2xl transition-all hover:scale-105">
                Start with Night X
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
