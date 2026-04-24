"use client";

import { motion } from "framer-motion";
import { ArrowRight, Cpu, Lock } from "lucide-react";
import Link from "next/link";
import { CATEGORIES, TOOLS } from "@/lib/tools-registry";

export default function ServicesPage() {
  const categories = CATEGORIES.filter((category) => category.id !== "all").map((category) => ({
    id: category.id,
    name: category.label,
    icon: category.icon,
    description: category.description,
    tools: TOOLS.filter((tool) => tool.category === category.id),
  }));

  return (
    <div className="min-h-screen bg-background px-4 pb-12 pt-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-flex items-center justify-center rounded-full border border-accent-cyan/20 bg-accent-cyan/10 p-4 text-accent-cyan"
          >
            <Cpu className="h-8 w-8" />
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4 text-4xl font-bold md:text-5xl">
            Services & Tool Categories
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto max-w-2xl text-lg text-gray-400">
            This page reflects the current Night X tool registry so the public catalog stays aligned with the actual product.
          </motion.p>
        </div>

        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-colors hover:bg-white/10"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="rounded-xl bg-black/50 p-3 text-2xl">{category.icon}</div>
                <h2 className="text-xl font-bold text-white">{category.name}</h2>
              </div>
              <p className="mb-4 text-sm text-white/50">{category.description}</p>
              <ul className="space-y-3 font-dm-sans">
                {category.tools.slice(0, 8).map((tool) => {
                  const isPublic = ['word-counter', 'password-generator', 'age-calculator', 'qr-generator', 'image-compressor', 'json-formatter', 'unit-converter', 'text-obfuscator', 'markdown-live'].includes(tool.slug);
                  return (
                    <li key={tool.slug}>
                      <Link 
                        href={isPublic ? `/tools/${tool.slug}` : "/auth/signin"}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group/tool"
                      >
                        <div className="h-1 w-1 rounded-full bg-white/20 group-hover/tool:bg-accent-cyan group-hover/tool:scale-125 transition-all" />
                        <span className="text-sm">{tool.name}</span>
                        {!isPublic && <Lock size={10} className="opacity-20 group-hover/tool:opacity-50" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/10 bg-gradient-to-r from-accent-cyan/10 to-accent-purple/10 p-12 text-center backdrop-blur-xl"
        >
          <h2 className="mb-4 text-3xl font-bold">Ready to open the full workspace?</h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-300">
            Sign in to access the dashboard, browse tools by category, and use AI-assisted features where available.
          </p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-black transition-colors hover:bg-gray-200">
            Go to Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
