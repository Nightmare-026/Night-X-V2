'use client';

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

  const fields = [
    { id: 'source', label: 'Campaign Source', placeholder: 'google, newsletter, twitter', required: true, hint: 'Referrer: (e.g. google, facebook)' },
    { id: 'medium', label: 'Campaign Medium', placeholder: 'cpc, email, social', required: true, hint: 'Marketing medium: (e.g. cpc, banner, email)' },
    { id: 'campaign', label: 'Campaign Name', placeholder: 'summer_sale, product_launch', required: true, hint: 'Product, promo code, or slogan' },
    { id: 'term', label: 'Campaign Term', placeholder: 'running+shoes, marketing+tips', required: false, hint: 'Identify paid keywords' },
    { id: 'content', label: 'Campaign Content', placeholder: 'logolink, textlink', required: false, hint: 'Use to differentiate ads' }
  ];

  return (
    <div className="space-y-8">
      <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-white/80">Website URL *</label>
          <input
            type="text"
            value={form.url}
            onChange={(e) => updateField('url', e.target.value)}
            placeholder="https://example.com"
            className="w-full px-5 py-3 bg-black/40 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder:text-white/20 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-2">
                {field.label} {field.required && <span className="text-purple-400">*</span>}
              </label>
              <input
                type="text"
                value={form[field.id as keyof typeof form]}
                onChange={(e) => updateField(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-white placeholder:text-white/10 transition-all"
              />
              <p className="text-[10px] text-white/30 px-2">{field.hint}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-syne font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-400" />
            Generated Campaign URL
          </h3>
          {generatedUrl && generatedUrl !== 'Invalid URL' && (
            <span className="text-xs text-white/40 flex items-center gap-1">
              <Info className="w-3 h-3" />
              Auto-updates as you type
            </span>
          )}
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-3xl blur-xl group-hover:opacity-100 opacity-0 transition-opacity" />
          <div className="relative p-6 bg-black/60 border border-white/10 rounded-3xl space-y-6">
            <div className="p-4 bg-white/5 rounded-2xl font-mono text-sm break-all text-white/80 min-h-[60px] flex items-center">
              {generatedUrl || <span className="text-white/20">Fill in the fields above to generate a URL...</span>}
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleCopy}
                disabled={!generatedUrl || generatedUrl === 'Invalid URL'}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:hover:bg-purple-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-purple-900/20"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied URL
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy Campaign URL
                  </>
                )}
              </button>
              
              <a
                href={generatedUrl && generatedUrl !== 'Invalid URL' ? generatedUrl : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-8 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all font-bold ${(!generatedUrl || generatedUrl === 'Invalid URL') ? 'pointer-events-none opacity-50' : ''}`}
              >
                <ExternalLink className="w-5 h-5" />
                Open Link
              </a>

              <button
                onClick={() => setForm({ url: '', source: '', medium: '', campaign: '', term: '', content: '' })}
                className="px-6 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                title="Reset form"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
