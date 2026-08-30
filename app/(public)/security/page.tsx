import Link from 'next/link';
import { ShieldCheck, Lock, ArrowLeft, CheckCircle2, ShieldAlert } from 'lucide-react';

export const metadata = { title: 'Security Center | Night X' };

export default function SecurityPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@night-x-v2.vercel.app";

  return (
    <main className="min-h-screen text-white px-4 sm:px-6 pt-24 md:pt-28 pb-16 max-w-4xl mx-auto space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
          <ShieldCheck size={13} />
          <span>Security Protocol & Responsible Disclosure</span>
        </div>
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">Security Center</h1>
        <p className="text-xs sm:text-sm text-text-tertiary">
          How Night X guarantees memory safety, local data isolation, and cryptographic confidentiality.
        </p>
      </div>

      <div className="space-y-5">
        <section className="p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-surface-card shadow-[var(--shadow-raised-sm)] space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock size={16} className="text-primary" />
            <span>Client-Side Execution & Privacy Isolation</span>
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            Night X is architected from the ground up with a client-side first security model. All 42 non-AI tools (such as Image Compression, Password Generation, JSON Formatting, and Hash Calculation) execute directly within your browser's sandboxed JavaScript and WebAssembly runtime.
          </p>
          <ul className="space-y-2 pt-2">
            {[
              "Images and documents are processed in local memory and never uploaded to remote servers.",
              "Cryptographic hash and password generations are computed locally on your device.",
              "Zero behavioral tracking or advertising telemetry is collected during tool usage.",
              "Tokens and credentials for optional accounts are stored securely using NextAuth JWT with HTTP-only cookies."
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-text-secondary">
                <CheckCircle2 size={13} className="text-primary shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-surface-card shadow-[var(--shadow-raised-sm)] space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-400" />
            <span>Responsible Vulnerability Disclosure</span>
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed">
            We welcome responsible disclosure from security researchers. If you discover a potential vulnerability across any Night X service or interface, please contact us immediately:
          </p>
          <div className="p-3.5 rounded-xl bg-surface-inset border border-white/[0.06] text-xs">
            <p className="text-text-muted mb-1 text-[11px]">Security Response Contact:</p>
            <a href={`mailto:${supportEmail}`} className="text-primary hover:underline font-mono font-semibold">
              {supportEmail}
            </a>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Critical security disclosures are reviewed within 24 hours. Please do not publicly disclose vulnerabilities until our engineering team has verified and deployed a patch.
          </p>
        </section>
      </div>

      <div className="pt-2 flex items-center justify-between">
        <Link href="/" className="btn-secondary text-xs py-2 px-3.5 gap-1.5">
          <ArrowLeft size={13} /> Back to Home
        </Link>
        <Link href="/tools" className="btn-primary text-xs py-2 px-3.5">
          Explore Free Tools
        </Link>
      </div>
    </main>
  );
}
