'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { copyToClipboard } from '@/lib/utils';

export default function ApiDocsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'curl' | 'js' | 'python'>('curl');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (code: string, index: number) => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopiedIndex(index);
      toast('Code snippet copied to clipboard', 'success');
      setTimeout(() => setCopiedIndex(null), 1500);
    }
  };

  const endpoints = [
    {
      method: 'POST',
      path: '/api/ai/chat',
      description: 'Stream or generate contextual AI assistant responses for technical tasks and code troubleshooting.',
      rateLimit: '30 requests / day (Free Workspace)',
      curl: `curl -X POST https://night-x-v2.vercel.app/api/ai/chat \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      { "role": "user", "content": "How do I optimize WebAssembly memory?" }
    ]
  }'`,
      js: `const response = await fetch("https://night-x-v2.vercel.app/api/ai/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    messages: [{ role: "user", content: "How do I optimize WebAssembly memory?" }]
  })
});
const data = await response.json();
console.log(data);`,
      python: `import requests

response = requests.post(
    "https://night-x-v2.vercel.app/api/ai/chat",
    json={
        "messages": [
            {"role": "user", "content": "How do I optimize WebAssembly memory?"}
        ]
    }
)
print(response.json())`
    },
    {
      method: 'POST',
      path: '/api/shorten',
      description: 'Create private shortened links with custom aliases and click tracking.',
      rateLimit: 'Standard Rate Limit',
      curl: `curl -X POST https://night-x-v2.vercel.app/api/shorten \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/very-long-url-path",
    "customCode": "my-alias"
  }'`,
      js: `const response = await fetch("https://night-x-v2.vercel.app/api/shorten", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: "https://example.com/very-long-url-path",
    customCode: "my-alias"
  })
});
const data = await response.json();`,
      python: `import requests

response = requests.post(
    "https://night-x-v2.vercel.app/api/shorten",
    json={
        "url": "https://example.com/very-long-url-path",
        "customCode": "my-alias"
    }
)
print(response.json())`
    }
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-12 pt-24 md:pt-28 pb-16">
      <div className="max-w-[1200px] mx-auto space-y-10">
        {/* Header Hero */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
            <Terminal size={13} /> <span>Developer Platform & Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Developer Documentation
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm leading-relaxed">
            Understand Night X client-side WebAssembly architecture and available edge endpoints for programmatic operations.
          </p>
        </div>

        {/* Architecture Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-6 space-y-2.5 shadow-[var(--shadow-raised-sm)]">
            <div className="w-9 h-9 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
              <Cpu size={18} />
            </div>
            <h3 className="text-sm font-bold text-white">WASM Client Runtime</h3>
            <p className="text-xs text-text-tertiary leading-relaxed">
              39 of 42 utilities run entirely in-browser using WebAssembly, Web Workers, and SubtleCrypto with zero remote server hops.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-6 space-y-2.5 shadow-[var(--shadow-raised-sm)]">
            <div className="w-9 h-9 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
              <Zap size={18} />
            </div>
            <h3 className="text-sm font-bold text-white">Edge Handlers</h3>
            <p className="text-xs text-text-tertiary leading-relaxed">
              API routes execute on Next.js Edge Runtime with server-side validation and rate limiting.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-6 space-y-2.5 shadow-[var(--shadow-raised-sm)]">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={18} />
            </div>
            <h3 className="text-sm font-bold text-white">Zero Telemetry Policy</h3>
            <p className="text-xs text-text-tertiary leading-relaxed">
              Payloads are never stored or logged to disk. Local tool operations remain in transient browser memory.
            </p>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">Available Endpoints</h2>
              <p className="text-xs text-text-muted">Edge endpoints with code examples</p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1 bg-surface-inset p-1 rounded-xl border border-white/10">
              {[
                { id: 'curl', label: 'cURL' },
                { id: 'js', label: 'JavaScript' },
                { id: 'python', label: 'Python' },
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setActiveTab(lang.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === lang.id
                      ? 'bg-primary text-black font-bold shadow-sm'
                      : 'text-text-tertiary hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {endpoints.map((ep, idx) => {
              const codeSnippet = (ep as any)[activeTab];

              return (
                <div 
                  key={ep.path}
                  className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 sm:p-7 space-y-4 shadow-[var(--shadow-raised-sm)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-md bg-primary/15 border border-primary/30 text-xs font-mono font-bold text-primary">
                        {ep.method}
                      </span>
                      <span className="text-sm font-mono font-bold text-white">
                        {ep.path}
                      </span>
                    </div>

                    <span className="text-xs text-text-muted">Rate Limit: <strong className="text-text-secondary">{ep.rateLimit}</strong></span>
                  </div>

                  <p className="text-xs text-text-secondary leading-relaxed">
                    {ep.description}
                  </p>

                  {/* Code Box */}
                  <div className="rounded-xl border border-white/10 bg-surface-inset overflow-hidden shadow-inner">
                    <div className="flex items-center justify-between px-3.5 py-2 bg-black/40 border-b border-white/[0.06]">
                      <span className="text-[10px] font-mono text-text-muted uppercase">
                        Request Example ({activeTab.toUpperCase()})
                      </span>
                      <button
                        onClick={() => handleCopy(codeSnippet, idx)}
                        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors"
                      >
                        {copiedIndex === idx ? <Check size={12} className="text-primary" /> : <Copy size={12} />}
                        <span className="text-[11px] font-semibold">{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <pre className="p-3.5 text-xs font-mono text-amber-300 overflow-x-auto leading-relaxed">
                      <code>{codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-surface-elevated to-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-md)] space-y-4">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-lg font-bold text-white">Explore Client-Side Tools</h2>
            <p className="text-xs text-text-secondary leading-relaxed">
              Explore 42 in-browser utilities without remote network overhead or complex setup.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href="/tools" className="btn-primary text-xs py-2 px-4 shadow-sm inline-flex items-center gap-1.5">
              <span>Browse All Tools</span>
              <ArrowRight size={13} />
            </Link>
            <Link href="/dashboard" className="btn-secondary text-xs py-2 px-4">
              Open Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
