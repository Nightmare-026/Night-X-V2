import { Metadata } from "next";
import { Mail, MapPin, MessageSquare } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact & Support | Night X",
  description: "Get in touch with the Night X engineering team for bug reports, tool suggestions, or general inquiries.",
};

export default function ContactPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@night-x-v2.vercel.app";

  return (
    <div className="min-h-screen text-white pt-24 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
            <MessageSquare size={13} />
            <span>Support & Communications</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Get in Touch
          </h1>

          <p className="text-xs sm:text-sm text-text-tertiary">
            Bug reports, tool suggestions, or general feedback. We review inquiries directly and iterate rapidly.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-6 items-start">
          <div className="md:col-span-7 rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-sm)] space-y-5">
            <div>
              <h2 className="text-base font-bold text-white mb-1">Send a Direct Message</h2>
              <p className="text-xs text-text-tertiary">Fill out the form below and our team will respond to your email.</p>
            </div>
            <ContactForm />
          </div>

          <div className="md:col-span-5 space-y-5">
            <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 shadow-[var(--shadow-raised-sm)] space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Direct Contacts</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-surface-inset border border-white/10 text-primary shrink-0">
                    <Mail size={15} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Engineering Support</p>
                    <a href={`mailto:${supportEmail}`} className="text-primary hover:underline font-mono text-xs">
                      {supportEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-surface-inset border border-white/10 text-accent-cyan shrink-0">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Operations</p>
                    <p className="text-text-tertiary">Global / Remote Distributed</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 shadow-[var(--shadow-raised-sm)] space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <MessageSquare size={14} className="text-primary" />
                <span>Response Expectation</span>
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <h4 className="font-semibold text-white">Turnaround Time</h4>
                  <p className="text-text-tertiary leading-relaxed">Inquiries receive a response within 1-2 business days.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Feature Requests</h4>
                  <p className="text-text-tertiary leading-relaxed">Tell us what utility or workflow you would like added to the catalog.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
