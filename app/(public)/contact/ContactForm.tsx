'use client';

import { useState } from "react";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

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
      <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="w-16 h-16 bg-primary/15 text-primary-400 border border-primary/30 rounded-2xl flex items-center justify-center shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-white">Message Sent Successfully</h3>
        <p className="text-xs text-text-tertiary max-w-xs leading-relaxed">
          Thanks for reaching out. Our engineering team reviews inquiries manually and will reply to your email.
        </p>
        <Button
          onClick={() => setSubmitted(false)}
          variant="secondary"
          size="sm"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary">Your Name</label>
          <Input
            type="text"
            name="name"
            required
            placeholder="Jane Doe"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-text-secondary">Email Address</label>
          <Input
            type="email"
            name="email"
            required
            placeholder="jane@example.com"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-secondary">Subject</label>
        <Input
          type="text"
          name="subject"
          required
          placeholder="Bug report, tool request, partnership inquiry..."
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-text-secondary">Message Details</label>
        <Textarea
          name="message"
          required
          rows={4}
          placeholder="Provide details about what happened, what browser you are using, or your specific suggestion."
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        isLoading={isSubmitting}
        variant="primary"
        className="w-full text-xs font-bold py-3"
      >
        <Send size={14} className="mr-2" />
        Send Message
      </Button>
    </form>
  );
}
