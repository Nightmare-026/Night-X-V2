'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  ShieldCheck, 
  Zap, 
  Cpu, 
  ExternalLink, 
  KeyRound, 
  BookOpen, 
  Layers,
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
      auth: 'Session Token / API Key',
      rateLimit: '20 req / min (Free), 120 req / min (Pro)',
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
      path: '/api/ai/paraphrase',
      description: 'Rewrite, summarize, or tone-adjust text payloads for documentation, communications, and copy.',
      auth: 'Session Token',
      rateLimit: '15 req / min (Free), 60 req / min (Pro)',
      curl: `curl -X POST https://night-x-v2.vercel.app/api/ai/paraphrase \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "The utility workspace simplifies daily operations without latency.",
    "tone": "professional"
  }'`,
      js: `const response = await fetch("https://night-x-v2.vercel.app/api/ai/paraphrase", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    text: "The utility workspace simplifies daily operations without latency.",
    tone: "professional"
  })
});
const data = await response.json();`,
      python: `import requests

response = requests.post(
    "https://night-x-v2.vercel.app/api/ai/paraphrase",
    json={
        "text": "The utility workspace simplifies daily operations without latency.",
        "tone": "professional"
    }
)
print(response.json())`
    },
    {
      method: 'POST',
      path: '/api/ai/bio',
      description: 'Synthesize structured professional biographies across multiple platforms (Twitter, LinkedIn, GitHub).',
      auth: 'Session Token',
      rateLimit: '10 req / min (Free), 40 req / min (Pro)',
      curl: `curl -X POST https://night-x-v2.vercel.app/api/ai/bio \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Alex",
    "role": "Distributed Systems Engineer",
    "skills": ["Rust", "WASM", "Next.js"]
  }'`,
      js: `const response = await fetch("https://night-x-v2.vercel.app/api/ai/bio", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Alex",
    role: "Distributed Systems Engineer",
    skills: ["Rust", "WASM", "Next.js"]
  })
});
const data = await response.json();`,
      python: `import requests

response = requests.post(
    "https://night-x-v2.vercel.app/api/ai/bio",
    json={
        "name": "Alex",
        "role": "Distributed Systems Engineer",
        "skills": ["Rust", "WASM", "Next.js"]
    }
)
print(response.json())`
    }
  ];

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-12 py-12">
      <div className="max-w-[1280px] mx-auto space-y-12">
        {/* Header Hero */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-xs font-bold text-primary-400 uppercase tracking-widest shadow-[var(--shadow-raised-sm)]">
            <Terminal size={14} /> Developer Platform & API
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Developer Documentation
          </h1>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
            Integrate Night X AI endpoints directly into your pipelines, or utilize our open client-side WebAssembly architecture for sovereign zero-retention data operations.
          </p>
        </div>

        {/* Architecture Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 space-y-3 shadow-[var(--shadow-raised-sm)]">
            <div className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary-400">
              <Cpu size={20} />
            </div>
            <h3 className="text-base font-bold text-white">WASM Client Runtime</h3>
            <p className="text-xs text-text-tertiary leading-relaxed">
              39 of 42 utilities run in-browser using WebAssembly, Web Workers, and SubtleCrypto. No API keys or remote calls required for pure client tools.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 space-y-3 shadow-[var(--shadow-raised-sm)]">
            <div className="w-10 h-10 rounded-xl bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
              <Zap size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Edge AI Gateways</h3>
            <p className="text-xs text-text-tertiary leading-relaxed">
              AI endpoints run on Next.js Edge Runtime with server-side validation, rate limiting, and encrypted model transmission.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 space-y-3 shadow-[var(--shadow-raised-sm)]">
            <div className="w-10 h-10 rounded-xl bg-accent-pink/15 border border-accent-pink/30 flex items-center justify-center text-accent-pink">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-white">Zero Telemetry Policy</h3>
            <p className="text-xs text-text-tertiary leading-relaxed">
              Request payloads are never retained, logged to disk, or used for model training. Memory buffers are wiped upon response completion.
            </p>
          </div>
        </div>

        {/* Language Tabs & Endpoints List */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Available Endpoints</h2>
              <p className="text-xs text-text-muted">Live REST endpoints with interactive code examples</p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 bg-surface-inset p-1 rounded-xl border border-white/10">
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
                      ? 'bg-primary text-black shadow-sm'
                      : 'text-text-tertiary hover:text-white'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {endpoints.map((ep, idx) => {
              const codeSnippet = ep[activeTab];

              return (
                <div 
                  key={ep.path}
                  className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 space-y-6 shadow-[var(--shadow-raised-sm)]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-lg bg-primary/15 border border-primary/30 text-xs font-mono font-bold text-primary-400">
                        {ep.method}
                      </span>
                      <span className="text-base font-mono font-bold text-white tracking-wide">
                        {ep.path}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-text-tertiary">
                      <span>Rate Limit: <strong className="text-text-secondary">{ep.rateLimit}</strong></span>
                    </div>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed">
                    {ep.description}
                  </p>

                  {/* Code Box */}
                  <div className="rounded-xl border border-white/10 bg-surface-inset overflow-hidden shadow-[var(--shadow-inset-sm)]">
                    <div className="flex items-center justify-between px-4 py-2.5 bg-black/40 border-b border-white/[0.06]">
                      <span className="text-[11px] font-mono text-text-muted uppercase">
                        Request Example ({activeTab.toUpperCase()})
                      </span>
                      <button
                        onClick={() => handleCopy(codeSnippet, idx)}
                        className="flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors"
                      >
                        {copiedIndex === idx ? <Check size={13} className="text-primary-400" /> : <Copy size={13} />}
                        <span className="text-[11px] font-semibold">{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>

                    <pre className="p-4 text-xs font-mono text-primary-300 overflow-x-auto leading-relaxed">
                      <code>{codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Roadmap & Developer Access */}
        <div className="rounded-3xl border border-primary/30 bg-gradient-to-b from-surface-elevated to-surface-card p-8 sm:p-12 shadow-[var(--shadow-raised-lg)] space-y-6">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-2xl font-bold text-white">Custom Tool SDK & Headless Engine</h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              We are finalizing the <code>@night-x/engine</code> npm package allowing developers to embed client-side WASM image processing and cryptographic generators directly into their own applications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/contact" className="btn-primary inline-flex text-xs py-3 px-6">
              <span>Request Early SDK Access</span>
              <ArrowRight size={14} className="ml-2" />
            </Link>
            <Link href="/tools" className="btn-secondary inline-flex text-xs py-3 px-6">
              Browse Client Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
