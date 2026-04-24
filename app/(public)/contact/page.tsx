import { Metadata } from "next";
import { Instagram, Mail, MapPin, MessageSquare } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us | Night X",
  description: "Get in touch with Night X support for bug reports, tool suggestions, or general inquiries. We prioritize your privacy and time.",
};

export default function ContactPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@night-x.app";

  return (
    <div className="min-h-screen bg-background text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-syne mb-4">
            Get in Touch
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-dm-sans">
            Questions, bug reports, and tool suggestions all belong here. 
            Email is our primary support channel for professional inquiries.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
            <ContactForm />
          </div>

          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h3 className="text-xl font-bold mb-6 font-syne">Contact Information</h3>
              <div className="space-y-6 font-dm-sans">
                <div className="flex items-center gap-4 text-white/70">
                  <div className="p-3 bg-accent-cyan/10 rounded-lg text-accent-cyan">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-white">Email Us</p>
                    <p className="truncate">{supportEmail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/70">
                  <div className="p-3 bg-accent-purple/10 rounded-lg text-accent-purple">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-medium text-white">Instagram</p>
                    <a href="https://instagram.com/nightmare_ff_26" target="_blank" rel="noopener noreferrer" className="truncate block hover:text-white transition-colors">
                      @nightmare_ff_26
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/70">
                  <div className="p-3 bg-accent-cyan/10 rounded-lg text-accent-cyan">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-white">Location</p>
                    <p>Global / Remote</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-syne">
                <MessageSquare className="w-5 h-5 text-accent-cyan" />
                Frequently Asked
              </h3>
              <div className="space-y-4 font-dm-sans">
                <div>
                  <h4 className="font-medium text-white mb-1">How fast do you reply?</h4>
                  <p className="text-sm text-white/45">Most replies happen within 1-3 business days. Critical bug reports are prioritized.</p>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Can I request a new tool?</h4>
                  <p className="text-sm text-white/45">Yes. Use this form or the feedback page and include your specific use case.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
