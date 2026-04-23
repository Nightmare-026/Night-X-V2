"use client";

import { motion } from "framer-motion";
import { Shield, FileText, AlertTriangle, Scale } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      content: "By accessing or using Night X, you agree to these terms. Night X provides online utility tools, AI-assisted features, and account-based dashboards. The service is provided on an as-is and as-available basis."
    },
    {
      title: "2. User Conduct",
      icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
      content: "You must use the service lawfully and responsibly. Do not upload malware, abuse APIs, probe for vulnerabilities, automate excessive traffic, or use Night X to violate another person's privacy or intellectual property rights."
    },
    {
      title: "3. Privacy & Data Handling",
      icon: <FileText className="w-6 h-6 text-green-400" />,
      content: "Some tools work locally in the browser, while others require server processing or third-party providers. Your use of the service is also governed by the Privacy Policy, which explains how account data, support requests, payments, and AI requests are handled."
    },
    {
      title: "4. Intellectual Property",
      icon: <Scale className="w-6 h-6 text-purple-400" />,
      content: "Night X branding, site content, and original application code remain the property of the project owner or applicable licensors. You may not copy, resell, or redistribute protected parts of the service except where an open-source license explicitly allows it."
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
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-4">
            Terms of Service
          </h1>
          <p className="text-white/50 text-lg">
            Last updated: April 23, 2026
          </p>
        </motion.div>

        <div className="space-y-8">
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
          className="mt-12 text-center text-white/35"
        >
          <p>If you have questions about these terms, contact <a href="mailto:sunlight002614@gmail.com" className="text-accent-cyan hover:underline">sunlight002614@gmail.com</a>.</p>
        </motion.div>
      </div>
    </div>
  );
}
