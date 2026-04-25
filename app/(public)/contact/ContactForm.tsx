'use client';

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export default function ContactForm() {
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

  if (submitted) {
    return (
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
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all text-white placeholder:text-white/50"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white/70">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all text-white placeholder:text-white/50"
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
          className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all text-white placeholder:text-white/50"
          placeholder="Bug report, feature request, partnership..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-white/70">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-cyan transition-all text-white placeholder:text-white/50 resize-none"
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
  );
}
