"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Mail, MapPin, MessageSquare, Send } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        const payload = await response.json().catch(() => null);
        setError(payload?.error || "We could not send your message right now. Please try again later.");
      }
    } catch (submissionError) {
      console.error("Failed to submit form", submissionError);
      setError("We could not connect to the contact service. Please email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-syne mb-4"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-lg max-w-2xl mx-auto"
          >
            Questions, bug reports, partnership requests, and tool suggestions all belong here. Email is the primary support channel.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold">Message Sent</h3>
                <p className="text-white/45">Thanks for reaching out. We review messages manually and reply as soon as possible.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all text-white placeholder:text-white/25"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/70">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all text-white placeholder:text-white/25"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all text-white placeholder:text-white/25"
                    placeholder="Bug report, feature request, partnership..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/70">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all text-white placeholder:text-white/25 resize-none"
                    placeholder="Tell us what happened, what page you were on, and how we can help."
                  />
                </div>

                <div className="hidden" aria-hidden="true">
                  <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-accent-cyan to-accent-purple hover:opacity-95 text-black font-semibold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h3 className="text-xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white/70">
                  <div className="p-3 bg-accent-cyan/10 rounded-lg text-accent-cyan">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Email Us</p>
                    <p>sunlight002614@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/70">
                  <div className="p-3 bg-accent-purple/10 rounded-lg text-accent-purple">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Location</p>
                    <p>Global / Remote</p>
                  </div>
                </div>
                <a href="https://instagram.com/nightmare_ff_26" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-white/70 hover:text-white transition-colors">
                  <div className="p-3 bg-pink-500/10 rounded-lg text-pink-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 0V5.5M12 18.5V17m5.5-5h1.5M5.5 12h-1.5M17.5 6.5L16.5 7.5M7.5 16.5l-1-1M17.5 17.5l-1-1M7.5 6.5l-1 1" /></svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">Instagram</p>
                    <p>@nightmare_ff_26 for updates and community messages</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent-cyan" />
                Frequently Asked
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-1">How fast do you reply?</h4>
                  <p className="text-sm text-white/45">Most replies happen within 1-3 business days. Critical bug reports are prioritized.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Can I request a new tool?</h4>
                  <p className="text-sm text-white/45">Yes. Use the contact form or the feedback page and include your use case.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
