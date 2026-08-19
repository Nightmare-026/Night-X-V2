'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquarePlus, Bug, Lightbulb, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState("feature");

  const types = [
    { id: "feature", label: "Feature Request", icon: <Lightbulb className="w-4 h-4" /> },
    { id: "bug", label: "Report a Bug", icon: <Bug className="w-4 h-4" /> },
    { id: "general", label: "General Feedback", icon: <MessageCircle className="w-4 h-4" /> },
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
    <div className="min-h-screen text-white pt-16 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3 pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary-400">
            <MessageSquarePlus size={14} />
            <span>Community Voice</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Help Us Improve Night X
          </h1>

          <p className="text-sm text-text-tertiary">
            Night X is built for developers, designers, and creators. Tell us what tool we should build next or what can be improved.
          </p>
        </div>

        <div className="rounded-3xl border border-white/[0.08] bg-surface-card p-6 sm:p-10 shadow-[var(--shadow-raised-md)]">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 bg-primary/15 text-primary-400 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white">Feedback Received!</h3>
              <p className="text-xs text-text-tertiary max-w-sm mx-auto leading-relaxed">
                Thank you for contributing to Night X. Our team reads every submission and reviews tool requests weekly.
              </p>
              <div className="pt-2">
                <Button 
                  onClick={() => setSubmitted(false)}
                  variant="secondary"
                  size="sm"
                >
                  Submit Another Note
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Feedback Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {types.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-xs font-semibold transition-all ${
                        type === t.id
                          ? 'bg-primary/20 border-primary text-primary-300 shadow-[var(--shadow-raised-sm)]'
                          : 'bg-surface-inset border-white/10 hover:border-white/20 text-text-tertiary'
                      }`}
                    >
                      {t.icon}
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Your Feedback & Suggestions</label>
                <Textarea 
                  name="message"
                  required
                  rows={5}
                  placeholder={
                    type === 'feature' ? "I'd love to see a tool that supports converting..." :
                    type === 'bug' ? "I encountered an error when trying to upload a file in..." :
                    "What I like most and what could be faster..."
                  }
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex justify-between">
                  <span>Your Email <span className="text-text-muted font-normal lowercase">(optional - for follow-up)</span></span>
                </label>
                <Input 
                  type="email" 
                  name="email"
                  placeholder="you@example.com"
                />
              </div>

              <Button 
                type="submit"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                variant="primary"
                className="w-full text-xs font-bold py-3.5"
              >
                <Send size={14} className="mr-2" />
                Submit Feedback
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
