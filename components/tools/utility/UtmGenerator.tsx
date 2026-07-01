'use client';
import { cn } from '@/lib/utils';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ExternalLink, RefreshCw, Share2, Info } from 'lucide-react';

export default function UtmGenerator() {
  const [form, setForm] = useState({
    url: '',
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  });
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (!form.url) {
      setGeneratedUrl('');
      return;
    }

    try {
      const urlObj = new URL(form.url.startsWith('http') ? form.url : `https://${form.url}`);
      const params = new URLSearchParams(urlObj.search);

      if (form.source) params.set('utm_source', form.source);
      if (form.medium) params.set('utm_medium', form.medium);
      if (form.campaign) params.set('utm_campaign', form.campaign);
      if (form.term) params.set('utm_term', form.term);
      if (form.content) params.set('utm_content', form.content);

      urlObj.search = params.toString();
      setGeneratedUrl(urlObj.toString());
    } catch (e) {
      setGeneratedUrl('Invalid URL');
    }
  }, [form]);

  const handleCopy = () => {
    if (generatedUrl && generatedUrl !== 'Invalid URL') {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const primaryFields = [
    { id: 'source', label: 'Campaign Source', placeholder: 'google, newsletter, twitter', required: true, hint: 'Referrer ID' },
    { id: 'medium', label: 'Campaign Medium', placeholder: 'cpc, email, social', required: true, hint: 'Marketing Medium' },
    { id: 'campaign', label: 'Campaign Name', placeholder: 'summer_sale, launch', required: true, hint: 'Product / Promo' },
  ];

  const secondaryFields = [
    { id: 'term', label: 'Campaign Term', placeholder: 'running+shoes', required: false, hint: 'Paid Keywords' },
    { id: 'content', label: 'Campaign Content', placeholder: 'logolink, textlink', required: false, hint: 'A/B Variant' }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Interface */}
        <div className="lg:col-span-8 order-2 lg:order-1 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-blue-500 uppercase mb-2">Architect</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest">Campaign Link Builder</h2>
                </div>
                <button
                  onClick={() => setForm({ url: '', source: '', medium: '', campaign: '', term: '', content: '' })}
                  className="p-3 bg-white/[0.02] hover:bg-white/[0.05] text-white/20 hover:text-white rounded-md border border-white/[0.05] transition-all"
                >
                  <RefreshCw size={16} />
                </button>
              </div>

              {/* Target Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-4 bg-blue-500 rounded-full" />
                  <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Primary Destination</h3>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-blue-500/20 blur opacity-0 group-focus-within:opacity-100 transition-opacity rounded-md" />
                  <input
                    type="text"
                    value={form.url}
                    onChange={(e) => updateField('url', e.target.value)}
                    placeholder="https://example.com"
                    className="relative w-full px-6 py-5 bg-black/40 border border-white/[0.1] rounded-md focus:outline-none focus:border-blue-500 transition-all text-white placeholder:text-white/10 font-inter text-base"
                  />
                </div>
              </div>

              {/* Parameters Grid */}
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {primaryFields.map((field) => (
                    <div key={field.id} className="space-y-3">
                      <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1 font-inter flex items-center justify-between">
                        {field.label}
                        <span className="text-blue-500/40">{field.hint}</span>
                      </label>
                      <input
                        type="text"
                        value={form[field.id as keyof typeof form]}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-md focus:outline-none focus:border-blue-500 transition-all text-sm text-white placeholder:text-white/5 font-inter"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/[0.05]">
                  {secondaryFields.map((field) => (
                    <div key={field.id} className="space-y-3">
                      <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest ml-1 font-inter flex items-center justify-between">
                        {field.label}
                        <span className="text-white/10">Optional</span>
                      </label>
                      <input
                        type="text"
                        value={form[field.id as keyof typeof form]}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 bg-white/[0.02] border border-white/[0.05] rounded-md focus:outline-none focus:border-blue-500 transition-all text-sm text-white placeholder:text-white/5 font-inter"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Output Area */}
              <div className="space-y-6 pt-12 border-t border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Share2 className="text-blue-500" size={16} />
                    <h3 className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Encoded Output</h3>
                  </div>
                  {generatedUrl && generatedUrl !== 'Invalid URL' && (
                    <div className="flex items-center gap-2 text-[10px] text-blue-500/60 font-bold uppercase tracking-widest">
                      <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                      Live Sync
                    </div>
                  )}
                </div>

                <div className="relative group/output">
                  <div className="absolute -inset-1 bg-blue-500/5 blur opacity-0 group-hover/output:opacity-100 transition-opacity rounded-md" />
                  <div className="relative p-6 bg-black/60 border border-white/[0.1] rounded-md space-y-6 group-hover:border-blue-500/30 transition-all">
                    <div className="p-4 bg-white/[0.02] rounded-md font-mono text-xs break-all text-white/40 min-h-[60px] flex items-center leading-relaxed">
                      {generatedUrl || "Awaiting destination data..."}
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={handleCopy}
                        disabled={!generatedUrl || generatedUrl === 'Invalid URL'}
                        className="flex-1 flex items-center justify-center gap-3 py-4 bg-white text-black disabled:opacity-30 rounded-md font-bold text-[10px] uppercase tracking-widest transition-all hover:bg-white/90 shadow-xl"
                      >
                        {copied ? (
                          <>
                            <Check size={14} />
                            Success
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Buffer Copy
                          </>
                        )}
                      </button>
                      
                      <a
                        href={generatedUrl && generatedUrl !== 'Invalid URL' ? generatedUrl : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "px-8 flex items-center justify-center gap-3 bg-white/[0.02] hover:bg-white/[0.05] text-white/60 hover:text-white rounded-md border border-white/[0.05] transition-all font-bold text-[10px] uppercase tracking-widest",
                          (!generatedUrl || generatedUrl === 'Invalid URL') && "pointer-events-none opacity-30"
                        )}
                      >
                        <ExternalLink size={14} />
                        Execute
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Info className="text-blue-500" size={16} />
              <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">UTM Protocol</h3>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] space-y-4">
                <div className="flex items-center gap-3 text-blue-500">
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Case Sensitivity</span>
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-wide leading-relaxed font-inter">
                  Parameters are case-sensitive. "Social" and "social" will appear as distinct channels in your analytics.
                </p>
              </div>

              <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] space-y-4">
                <div className="flex items-center gap-3 text-blue-500">
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">No Spaces</span>
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-wide leading-relaxed font-inter">
                  Avoid spaces in values. Use underscores or plus signs (e.g. summer_sale) for maximum compatibility.
                </p>
              </div>

              <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] space-y-4">
                <div className="flex items-center gap-3 text-blue-500">
                  <div className="w-1 h-1 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Standard IDs</span>
                </div>
                <p className="text-[10px] text-white/30 uppercase tracking-wide leading-relaxed font-inter">
                  Always include Source, Medium, and Campaign to ensure your data is correctly categorized by Google Analytics.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-blue-500/5 border border-blue-500/10 rounded-md">
            <div className="flex items-center gap-3 mb-3 text-blue-500">
              <RefreshCw size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Live Compiler</span>
            </div>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-inter">
              Synthesizing link structure in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
