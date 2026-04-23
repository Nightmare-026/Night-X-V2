"use client";

import { motion } from "framer-motion";
import Link from "next/link";

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

        <div className="space-y-5">
          {items.map((item, index) => (
            <motion.div
              key={item.question}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
            >
              <h2 className="mb-3 text-xl font-semibold text-white">{item.question}</h2>
              <p className="leading-relaxed text-white/60">{item.answer}</p>
            </motion.div>
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
