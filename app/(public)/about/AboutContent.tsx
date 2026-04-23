'use client';

import { motion } from "framer-motion";
import { Rocket, Zap, Globe, Heart } from "lucide-react";

export default function AboutContent() {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Lightning Fast",
      description: "Built on modern web technologies ensuring rapid execution of tasks."
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-400" />,
      title: "Accessible Everywhere",
      description: "A cloud-first approach means your tools are ready wherever you are."
    },
    {
      icon: <Heart className="w-6 h-6 text-red-400" />,
      title: "User Centric",
      description: "Designed with an uncompromising focus on user experience and aesthetics."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-20">
        
        {/* Hero Section */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center p-4 bg-white/5 rounded-full mb-8 border border-white/10"
          >
            <Rocket className="w-12 h-12 text-blue-500" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold mb-6 font-syne"
          >
            About <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-purple to-accent-cyan">Night X</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-dm-sans"
          >
            Practical utility tools built for speed. Night X focuses on browser-first workflows that value your time and privacy.
          </motion.p>
        </section>

        {/* The Mission */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-purple/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
          <h2 className="text-3xl font-bold mb-6 font-syne">Our Mission</h2>
          <p className="text-lg text-gray-300 leading-relaxed mb-6 font-dm-sans">
            We believe that powerful tools should be beautiful, fast, and accessible. We are building a unified workspace where you can handle image processing, data transformation, and AI-assisted tasks within a seamless environment.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed font-dm-sans">
            Night X brings desktop-grade utility directly to your browser. No installations, no heavy sign-ups required for basic tools—just pure productivity.
          </p>
        </motion.section>

        {/* Core Values */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12 font-syne">Core Principles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 font-syne">{feature.title}</h3>
                <p className="text-gray-400 font-dm-sans">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
