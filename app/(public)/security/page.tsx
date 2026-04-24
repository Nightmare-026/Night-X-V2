import Link from 'next/link';

export const metadata = { title: 'Security | Night X' };

export default function SecurityPage() {
  const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@night-x.app";

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-6 py-20 max-w-3xl mx-auto pt-32">
      <p className="text-accent-purple text-xs tracking-widest uppercase mb-4 font-syne">Security Disclosure · v1.0</p>
      <h1 className="text-4xl font-bold mb-8 font-syne">Security Audit</h1>

      <section className="mb-10 font-dm-sans">
        <h2 className="text-lg font-semibold text-accent-purple mb-3">Architecture</h2>
        <ul className="list-disc list-inside text-white/60 space-y-2">
          <li>All tool processing happens client-side — no user input is transmitted to any server.</li>
          <li>TLS enforced in transit via Vercel Edge Network.</li>
          <li>No persistent storage of user data or tool outputs for non-AI tools.</li>
          <li>NextAuth used only for optional account sync — no behavioral tracking.</li>
        </ul>
      </section>

      <section className="mb-10 font-dm-sans">
        <h2 className="text-lg font-semibold text-accent-purple mb-3">Responsible Disclosure</h2>
        <p className="text-white/60">If you discover a security vulnerability, report it privately to <a href={`mailto:${supportEmail}`} className="text-accent-cyan underline">{supportEmail}</a>. Critical reports are reviewed within 24 hours.</p>
      </section>

      <section className="mb-10 font-dm-sans">
        <h2 className="text-lg font-semibold text-accent-purple mb-3">Scope</h2>
        <p className="text-white/60">In-scope: All tools at night-x-v2.vercel.app, API routes, and authentication flow. Out of scope: Third-party infrastructure (Vercel, Google).</p>
      </section>

      <Link href="/" className="inline-block mt-4 px-8 py-3 bg-accent-purple hover:bg-accent-purple/80 rounded-xl text-sm font-bold transition-all">Return to Hub</Link>
    </main>
  );
}
