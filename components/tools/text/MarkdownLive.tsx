'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, 
  Eye, 
  Code, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  AlertTriangle 
} from 'lucide-react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const DEFAULT_MARKDOWN = `# Welcome to Night X Markdown Live

Secure, local-first markdown preview with XSS protection.

## Features
- **Real-time Preview**
- **XSS Sanitization** via DOMPurify
- **Github Flavored Markdown**
- **Copy as HTML**

### Code Example
\`\`\`javascript
function secure() {
  console.log("Sovereign Grade Security");
}
\`\`\`

> Try pasting some malicious scripts here to see the sanitization in action!
<script>alert('XSS Blocked!')</script>
`;

export default function MarkdownLive() {
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);
  const [activeView, setActiveView] = useState<'preview' | 'html' | 'split'>('split');
  const [copied, setCopied] = useState(false);
  const [sanitizedCount, setSanitizedCount] = useState(0);

  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  const renderedHTML = useMemo(() => {
    try {
      const rawHtml = marked.parse(markdown) as string;
      // Sanitize the HTML to prevent XSS
      const cleanHtml = DOMPurify.sanitize(rawHtml);
      return cleanHtml;
    } catch (e) {
      return '<p class="text-red-500">Error rendering markdown</p>';
    }
  }, [markdown]);

  const handleCopy = () => {
    const textToCopy = activeView === 'html' ? renderedHTML : markdown;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'night-x-document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto h-[700px]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-white/10">
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
          {[
            { id: 'split', icon: <FileText size={16} />, label: 'Split View' },
            { id: 'preview', icon: <Eye size={16} />, label: 'Preview' },
            { id: 'html', icon: <Code size={16} />, label: 'HTML Output' },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                activeView === view.id ? "bg-accent-purple text-white shadow-lg" : "text-white/40 hover:text-white"
              )}
            >
              {view.icon}
              <span className="hidden sm:inline">{view.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
            {copied ? 'Copied!' : activeView === 'html' ? 'Copy HTML' : 'Copy MD'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Download .md</span>
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
        {/* Editor */}
        <div className={cn(
          "glass-card border border-white/10 rounded-3xl overflow-hidden flex flex-col",
          activeView === 'preview' ? 'hidden' : activeView === 'html' ? 'hidden lg:flex' : 'flex'
        )}>
          <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 font-syne">Markdown Source</span>
            <span className="text-[10px] text-white/20 font-mono">{markdown.length} chars</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-grow bg-black/20 p-6 text-white/80 font-mono text-sm outline-none resize-none custom-scrollbar"
            placeholder="Type your markdown here..."
          />
        </div>

        {/* Preview */}
        <div className={cn(
          "glass-card border border-white/10 rounded-3xl overflow-hidden flex flex-col bg-white/[0.02]",
          activeView === 'html' ? 'hidden lg:flex' : activeView === 'split' ? 'flex' : 'flex'
        )}>
          <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/40 font-syne">
              {activeView === 'html' ? 'HTML Output' : 'Live Preview'}
            </span>
            <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-accent-cyan" />
              <span className="text-[10px] text-accent-cyan/60 font-bold uppercase tracking-wider">Sanitized</span>
            </div>
          </div>
          
          <div className="flex-grow p-8 overflow-y-auto custom-scrollbar bg-[#0a0a0f]">
            {activeView === 'html' ? (
              <pre className="text-xs font-mono text-accent-cyan/80 whitespace-pre-wrap break-all">
                {renderedHTML}
              </pre>
            ) : (
              <div 
                className="prose prose-invert prose-purple max-w-none 
                  prose-headings:font-syne prose-headings:font-bold 
                  prose-p:text-white/70 prose-p:font-dm-sans
                  prose-code:text-accent-purple prose-code:bg-white/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                  prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/5
                  prose-blockquote:border-l-accent-purple prose-blockquote:bg-white/5 prose-blockquote:py-1 prose-blockquote:px-4
                  prose-a:text-accent-cyan hover:prose-a:text-accent-cyan/80 transition-colors"
                dangerouslySetInnerHTML={{ __html: renderedHTML }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="glass-card p-4 rounded-2xl border border-accent-cyan/20 bg-accent-cyan/5 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-accent-cyan/20 flex items-center justify-center text-accent-cyan">
          <ShieldCheck size={20} />
        </div>
        <div className="flex-grow">
          <h4 className="text-sm font-bold text-white font-syne">XSS Protection Active</h4>
          <p className="text-xs text-white/50 font-dm-sans">All rendered content is sanitized through DOMPurify before execution. Scripts and malicious attributes are automatically stripped.</p>
        </div>
        <div className="hidden sm:block">
          <div className="px-3 py-1 bg-accent-cyan/20 rounded-lg border border-accent-cyan/30">
            <span className="text-[10px] font-bold text-accent-cyan uppercase tracking-widest">Sovereign Grade</span>
          </div>
        </div>
      </div>
    </div>
  );
}
