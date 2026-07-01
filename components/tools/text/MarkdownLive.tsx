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

  // Configure marked options
  useMemo(() => {
    marked.use({
      breaks: true,
      gfm: true,
    });
  }, []);

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
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6 h-[800px]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/[0.02] p-4 rounded-md border border-white/[0.05]">
        <div className="flex bg-white/[0.02] p-1 rounded-md border border-white/[0.05]">
          {[
            { id: 'split', icon: <FileText size={14} />, label: 'Split' },
            { id: 'preview', icon: <Eye size={14} />, label: 'Preview' },
            { id: 'html', icon: <Code size={14} />, label: 'HTML' },
          ].map((view) => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all",
                activeView === view.id ? "bg-accent-blue text-white shadow-lg" : "text-white/20 hover:text-white"
              )}
            >
              {view.icon}
              <span>{view.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] rounded-md text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all"
          >
            {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
            {copied ? 'Copied' : activeView === 'html' ? 'Copy HTML' : 'Copy MD'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue text-white rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-accent-blue/90 transition-all"
          >
            <Download size={12} />
            Download
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        {/* Editor */}
        <div className={cn(
          "bg-white/[0.02] border border-white/[0.05] rounded-md overflow-hidden flex flex-col",
          activeView === 'preview' ? 'hidden' : activeView === 'html' ? 'hidden lg:flex' : 'flex'
        )}>
          <div className="bg-white/[0.02] px-6 py-3 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/20 font-inter">Source</span>
            <span className="text-[10px] text-white/10 font-mono uppercase">{markdown.length} chars</span>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-grow bg-black/40 p-6 text-white/90 font-mono text-sm outline-none resize-none custom-scrollbar font-inter leading-relaxed"
            placeholder="Type your markdown here..."
          />
        </div>

        {/* Preview */}
        <div className={cn(
          "bg-white/[0.02] border border-white/[0.05] rounded-md overflow-hidden flex flex-col",
          activeView === 'html' ? 'flex' : activeView === 'split' ? 'flex' : 'flex'
        )}>
          <div className="bg-white/[0.02] px-6 py-3 border-b border-white/[0.05] flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-widest font-bold text-white/20 font-inter">
              {activeView === 'html' ? 'HTML Output' : 'Live Preview'}
            </span>
            <div className="flex items-center gap-2 opacity-40">
              <ShieldCheck size={12} className="text-accent-blue" />
              <span className="text-[10px] text-white font-bold uppercase tracking-widest">Sanitized</span>
            </div>
          </div>
          
          <div className="flex-grow p-8 overflow-y-auto custom-scrollbar bg-black/40">
            {activeView === 'html' ? (
              <pre className="text-xs font-mono text-accent-blue/80 whitespace-pre-wrap break-all leading-loose">
                {renderedHTML}
              </pre>
            ) : (
              <div 
                className="prose prose-invert prose-blue max-w-none 
                  prose-headings:font-outfit prose-headings:font-bold prose-headings:tracking-tight
                  prose-p:text-white/70 prose-p:font-inter prose-p:leading-relaxed
                  prose-code:text-accent-blue prose-code:bg-accent-blue/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:font-mono
                  prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/[0.05] prose-pre:rounded-md
                  prose-blockquote:border-l-accent-blue prose-blockquote:bg-white/[0.02] prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-md
                  prose-a:text-accent-blue hover:prose-a:opacity-80 transition-opacity"
                dangerouslySetInnerHTML={{ __html: renderedHTML }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Security Info */}
      <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-md flex items-center gap-4">
        <div className="w-10 h-10 rounded-md bg-accent-blue/10 flex items-center justify-center text-accent-blue shrink-0">
          <ShieldCheck size={20} />
        </div>
        <div className="flex-grow">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-widest font-outfit">Sovereign Sanitization</h4>
          <p className="text-[10px] text-white/30 font-inter uppercase tracking-wide mt-1">Content is processed via DOMPurify to neutralize XSS vectors. Local-first execution for maximum privacy.</p>
        </div>
      </div>
    </div>
  );
}
