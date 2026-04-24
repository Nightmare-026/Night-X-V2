"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const items = [
  {
    question: "Do I need an account to use Night X?",
    answer:
      "Some public pages are visible without signing in, but the main tools dashboard and AI features require an account.",
  },
  {
    question: "Are all tools processed locally?",
    answer:
      "No. Several tools work in the browser, while AI, authentication, support, payments, and some utility features rely on server services.",
  },
  {
    question: "What happens when I sign in with Google?",
    answer:
      "Night X stores the account details needed to identify your profile, such as name, email, image, and provider metadata.",
  },
  {
    question: "Can I request a new tool or report a bug?",
    answer:
      "Yes. Use the contact page or feedback page and include the page name, steps to reproduce, and your request.",
  },
  {
    question: "Is password reset available?",
    answer:
      "Manual support is available, but a self-serve password reset flow is not enabled on this deployment yet.",
  },
];
function FaqItem({ item, index }: { item: any, index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-6 text-left"
      >
        <h2 className="pr-8 text-lg font-semibold text-white">{item.question}</h2>
        <ChevronDown 
          className={`h-5 w-5 text-white/30 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="border-t border-white/5 p-6 pt-0">
              <p className="leading-relaxed text-white/60">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-background px-4 pb-12 pt-24 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-14 text-center"
        >
          <h1 className="mb-4 font-syne text-4xl font-bold md:text-5xl">Frequently Asked Questions</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/50">
            Short answers to the questions users usually ask before trusting a tools platform.
          </p>
        </motion.div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <FaqItem key={item.question} item={item} index={index} />
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-br from-accent-purple/10 to-accent-cyan/10 p-8 text-center">
          <h3 className="mb-2 text-2xl font-bold">Still need help?</h3>
          <p className="mb-5 text-white/55">Use the contact page for account issues, bug reports, and feature requests.</p>
          <Link href="/contact" className="inline-flex rounded-xl bg-accent-cyan px-5 py-3 font-semibold text-black transition-opacity hover:opacity-90">
            Contact Night X
          </Link>
        </div>
      </div>
    </div>
  );
}
