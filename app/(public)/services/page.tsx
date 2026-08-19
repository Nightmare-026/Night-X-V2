'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Lock, Sparkles, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CATEGORIES, TOOLS } from '@/lib/tools-registry';
import { ToolIcon } from '@/components/ui/ToolIcon';
import { Badge } from '@/components/ui/Badge';

export default function ServicesPage() {
  const categories = CATEGORIES.filter((category) => category.id !== 'all').map((category) => ({
    id: category.id,
    name: category.label,
    icon: category.icon,
    description: category.description,
    tools: TOOLS.filter((tool) => tool.category === category.id),
  }));

  return (
    <div className="min-h-screen px-4 pb-16 pt-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary-400">
            <Cpu size={14} />
            <span>Architecture & Capabilities</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Services & Tool Suites
          </h1>

          <p className="text-sm sm:text-base text-text-tertiary">
            Organized into 7 dedicated tool ecosystems to streamline your daily engineering, creative, and data workflows.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 shadow-[var(--shadow-raised-sm)] flex flex-col justify-between hover:border-primary/40 hover:shadow-[var(--shadow-hover)] transition-all"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-surface-inset border border-white/10 flex items-center justify-center text-primary-400">
                    <ToolIcon name={category.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-text-muted">
                    {category.tools.length} Tools
                  </span>
                </div>

                <h2 className="text-lg font-bold text-white mb-2">{category.name}</h2>
                <p className="text-xs text-text-tertiary mb-5 leading-relaxed">{category.description}</p>

                <ul className="space-y-2 mb-6">
                  {category.tools.slice(0, 5).map((tool) => (
                    <li key={tool.slug}>
                      <Link 
                        href={`/tools/${tool.slug}`}
                        className="flex items-center justify-between text-xs text-text-secondary hover:text-white transition-colors group/item py-1"
                      >
                        <span className="group-hover/item:text-primary-300 transition-colors">{tool.name}</span>
                        <ChevronRight size={12} className="text-white/20 group-hover/item:text-primary-400 group-hover/item:translate-x-0.5 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/tools?category=${category.id}`}
                className="w-full py-2 rounded-xl text-xs font-semibold text-center bg-white/[0.04] border border-white/[0.08] hover:bg-primary/15 hover:border-primary/30 hover:text-primary-300 transition-all flex items-center justify-center gap-1.5"
              >
                <span>View All {category.name}</span>
                <ChevronRight size={13} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-b from-surface-elevated to-surface-card p-10 text-center shadow-[var(--shadow-raised-md)] space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Ready to streamline your daily workflow?</h2>
          <p className="mx-auto max-w-xl text-xs sm:text-sm text-text-secondary">
            Join thousands of developers, designers, and creators who rely on instant client-side tools and AI workflows.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link href="/tools" className="btn-primary text-xs py-3 px-6 shadow-md">
              Browse All Tools <ArrowRight size={14} />
            </Link>
            <Link href="/dashboard" className="btn-secondary text-xs py-3 px-6">
              Launch Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
