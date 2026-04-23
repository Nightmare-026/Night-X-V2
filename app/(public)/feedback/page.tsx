"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus, Bug, Lightbulb, MessageCircle, Send, Loader2 } from "lucide-react";

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState("feature");

  const types = [
    { id: "feature", label: "Feature Request", icon: <Lightbulb className="w-5 h-5" /> },
    { id: "bug", label: "Report a Bug", icon: <Bug className="w-5 h-5" /> },
    { id: "general", label: "General Feedback", icon: <MessageCircle className="w-5 h-5" /> },
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      type,
      message: formData.get("message"),
      email: formData.get("email"),
    };

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Failed to submit feedback", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center justify-center p-4 bg-purple-500/10 text-purple-400 rounded-full mb-6"
          >
            <MessageSquarePlus className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Help Us Improve
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Night X is built for you. Tell us what you love, what&apos;s broken, or what tool we should build next.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl"
        >
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Feedback Sent!</h3>
              <p className="text-gray-400 text-lg mb-8">
                Thank you for helping us make Night X better. We read every single message.
              </p>
              <button 
                onClick={() => setSubmitted(false)}
                className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-medium"
              >
                Send More Feedback
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              <div className="space-y-4">
                <label className="text-lg font-medium text-white block">What kind of feedback is this?</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {types.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        type === t.id
                          ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                          : 'bg-black/50 border-white/10 hover:bg-white/5 text-gray-400'
                      }`}
                    >
                      {t.icon}
                      <span className="font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium text-white block">Your Feedback</label>
                <textarea 
                  name="message"
                  required
                  rows={6}
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white placeholder-gray-600 resize-none"
                  placeholder={
                    type === 'feature' ? "I'd love to see a tool that..." :
                    type === 'bug' ? "I encountered an issue when..." :
                    "I just wanted to say..."
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-lg font-medium text-white block flex justify-between">
                  <span>Email <span className="text-gray-500 text-sm font-normal">(Optional)</span></span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-white placeholder-gray-600"
                  placeholder="So we can follow up with you"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
