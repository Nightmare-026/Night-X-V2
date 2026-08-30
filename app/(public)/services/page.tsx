'use client';

import React from 'react';
import { ArrowRight, Cpu, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { CATEGORIES, TOOLS } from '@/lib/tools-registry';
import { ToolIcon } from '@/components/ui/ToolIcon';

export default function ServicesPage() {
  const categories = CATEGORIES.filter((category) => category.id !== 'all').map((category) => ({
    id: category.id,
    name: category.label,
    icon: category.icon,
    description: category.description,
    tools: TOOLS.filter((tool) => tool.category === category.id),
  }));

  return (
    <div className="min-h-screen px-4 pb-16 pt-24 md:pt-28 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <Cpu size={13} />
            <span>Architecture & Capabilities</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Tool Suites & Capabilities
          </h1>

          <p className="text-xs sm:text-sm text-text-tertiary">
            Organized into 7 dedicated tool ecosystems to streamline your daily engineering, creative, and data workflows.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-6 shadow-[var(--shadow-raised-sm)] flex flex-col justify-between hover:border-primary/40 hover:shadow-[var(--shadow-hover)] hover:-translate-y-1 transition-all"
            >
              <div>
                <div className="mb-3.5 flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-surface-inset border border-white/10 flex items-center justify-center text-primary">
                    <ToolIcon name={category.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-text-muted">
                    {category.tools.length} Tools
                  </span>
                </div>

                <h2 className="text-base font-bold text-white mb-1.5">{category.name}</h2>
                <p className="text-xs text-text-tertiary mb-4 leading-relaxed">{category.description}</p>

                <ul className="space-y-1.5 mb-5 border-t border-white/[0.04] pt-3">
                  {category.tools.slice(0, 4).map((tool) => (
                    <li key={tool.slug}>
                      <Link 
                        href={`/tools/${tool.slug}`}
                        className="flex items-center justify-between text-xs text-text-secondary hover:text-white transition-colors group/item py-0.5"
                      >
                        <span className="group-hover/item:text-primary transition-colors">{tool.name}</span>
                        <ChevronRight size={12} className="text-white/20 group-hover/item:text-primary transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/tools?category=${category.id}`}
                className="w-full py-2 rounded-xl text-xs font-semibold text-center bg-white/[0.04] border border-white/[0.08] hover:bg-primary/15 hover:border-primary/30 hover:text-primary transition-all flex items-center justify-center gap-1"
              >
                <span>View All {category.name}</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-surface-elevated to-surface-card p-6 sm:p-10 text-center shadow-[var(--shadow-raised-md)] space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Ready to streamline your daily workflow?</h2>
          <p className="mx-auto max-w-lg text-xs sm:text-sm text-text-secondary">
            Get instant access to 42 private in-browser tools with zero setup.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <Link href="/tools" className="btn-primary text-xs py-2.5 px-5 shadow-md flex items-center gap-1.5">
              <span>Browse All Tools</span>
              <ArrowRight size={13} />
            </Link>
            <Link href="/dashboard" className="btn-secondary text-xs py-2.5 px-5">
              Launch Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
