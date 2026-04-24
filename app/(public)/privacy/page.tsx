"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, EyeOff, Database } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. What we collect",
      icon: <Database className="w-6 h-6 text-blue-400" />,
      content: "We collect account details such as name, email address, profile image, and authentication metadata when you sign in. Some server-backed tools also process the text, links, or files you submit so the requested feature can work."
    },
    {
      title: "2. How data is processed",
      icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
      content: "Many Night X tools run in the browser, but not every feature is fully client-side. AI tools, authentication, support forms, newsletter signup, and payment flows use server services or third-party providers to complete your request."
    },
    {
      title: "3. Third-party services",
      icon: <EyeOff className="w-6 h-6 text-purple-400" />,
      content: "Night X may rely on providers such as Google Authentication, Firebase, OpenRouter or Hugging Face for AI responses, Razorpay for payments, and Resend for email delivery. Those services may receive the minimum data needed to process the action you trigger."
    },
    {
      title: "4. Security and retention",
      icon: <Lock className="w-6 h-6 text-amber-400" />,
      content: "We use HTTPS in transit and store passwords using secure hashing where password login is enabled. We keep operational data only for as long as needed to run the service, prevent abuse, and investigate errors. You should avoid submitting highly sensitive secrets to tools unless you fully trust the deployment."
    },
    {
      title: "5. Sovereign Commitment: No Advertising",
      icon: <EyeOff className="w-6 h-6 text-cyan-400" />,
      content: "Night X is a sovereign utility hub. We do not use third-party advertising, nor do we sell your data to brokers. There are no marketing trackers or behavioral profiling scripts embedded in the core platform."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-600 mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/50 text-lg">
            Clear, product-accurate details about what Night X stores and what it sends to service providers.
          </p>
        </motion.div>

        <div className="grid gap-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-white/5 rounded-xl">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  {section.title}
                </h2>
              </div>
              <p className="text-white/55 leading-relaxed text-lg">
                {section.content}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-center"
        >
          <h3 className="text-xl font-semibold text-white mb-2">Data Requests</h3>
          <p className="text-white/55 mb-4">
            To request account deletion or ask a privacy question, contact the Night X support inbox from the email address tied to your account.
          </p>
          <a href="mailto:support@night-x.app" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            support@night-x.app
</a>
        </motion.div>
      </div>
    </div>
  );
}
