'use client';

import { useState } from "react";
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
    <div className="min-h-screen text-white pt-24 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <MessageSquarePlus size={13} />
            <span>Community Voice</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Help Us Improve Night X
          </h1>

          <p className="text-xs sm:text-sm text-text-tertiary">
            Night X is built for developers, designers, and creators. Tell us what tool we should build next or what can be improved.
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-sm)]">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 bg-primary/15 text-primary border border-primary/30 rounded-2xl flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Feedback Received!</h3>
              <p className="text-xs text-text-tertiary max-w-sm mx-auto leading-relaxed">
                Thank you for contributing to Night X. Our team reviews tool requests and suggestions weekly.
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider block">Feedback Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {types.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                        type === t.id
                          ? 'bg-primary/20 border-primary text-primary shadow-sm font-bold'
                          : 'bg-surface-inset border-white/10 hover:border-white/20 text-text-tertiary'
                      }`}
                    >
                      {t.icon}
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary">Your Feedback & Suggestions</label>
                <Textarea 
                  name="message"
                  required
                  rows={4}
                  placeholder={
                    type === 'feature' ? "I'd love to see a tool that supports converting..." :
                    type === 'bug' ? "I encountered an error when trying to process..." :
                    "What could be faster or more intuitive..."
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-text-secondary flex justify-between">
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
                className="w-full text-xs font-bold py-2.5 shadow-md"
              >
                <Send size={13} className="mr-1.5" />
                <span>Submit Feedback</span>
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
