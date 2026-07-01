'use client';
import { cn } from '@/lib/utils';

import React, { useState } from 'react';
import { Copy, RefreshCw , Type, Check} from 'lucide-react';
import { motion } from 'framer-motion';

const LOREM_WORDS = `lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum sed perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo`.split(' ');

function generateParagraph(wordCount: number): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
  }
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(' ') + '.';
}

export default function LoremIpsum() {
  const [type, setType] = useState<'paragraphs' | 'words' | 'sentences'>('paragraphs');
  const [count, setCount] = useState(3);
  const [includeHtml, setIncludeHtml] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let text = '';
    if (type === 'paragraphs') {
      const paras = Array.from({ length: count }, () => generateParagraph(40 + Math.floor(Math.random() * 40)));
      text = includeHtml ? paras.map(p => `<p>${p}</p>`).join('\n\n') : paras.join('\n\n');
    } else if (type === 'words') {
      text = generateParagraph(count);
    } else {
      const sentences = Array.from({ length: count }, () => {
        const wc = 8 + Math.floor(Math.random() * 12);
        return generateParagraph(wc);
      });
      text = sentences.join(' ');
    }
    setResult(text);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Result Display */}
      <div className="lg:col-span-8 space-y-4">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.05]">
            <div className="flex items-center gap-2">
              <Type className="text-accent-blue" size={16} />
              <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Generated Output</h2>
            </div>
            {result && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors"
              >
                {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                <span className="text-[10px] font-bold uppercase tracking-widest font-inter">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          <div className="p-8 min-h-[400px]">
            {result ? (
              <pre className="text-white/90 text-base leading-relaxed whitespace-pre-wrap font-inter">{result}</pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-20 py-20">
                <RefreshCw size={48} className="animate-spin-slow" />
                <p className="text-sm font-outfit uppercase tracking-widest font-bold">Press generate to start</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Sidebar */}
      <div className="lg:col-span-4 space-y-6">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.02] p-6 space-y-6">
          <div className="flex items-center gap-2">
            <RefreshCw className="text-accent-blue" size={16} />
            <h2 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Generator</h2>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-inter">Format</label>
              <div className="grid grid-cols-1 gap-2">
                {(['paragraphs', 'sentences', 'words'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={cn(
                      "px-4 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all text-left font-inter border",
                      type === t
                        ? "bg-accent-blue/10 border-accent-blue/30 text-white"
                        : "bg-white/[0.02] border-white/[0.05] text-white/40 hover:border-white/10"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-inter">Quantity</label>
                <span className="text-xl font-bold text-accent-blue font-inter">{count}</span>
              </div>
              <input
                type="range"
                min={1}
                max={type === 'words' ? 500 : 20}
                value={count}
                onChange={e => setCount(Number(e.target.value))}
                className="w-full accent-accent-blue bg-white/5 h-1 rounded-full appearance-none cursor-pointer"
              />
            </div>

            {type === 'paragraphs' && (
              <button
                onClick={() => setIncludeHtml(!includeHtml)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md border transition-all w-full mt-4",
                  includeHtml ? "bg-accent-blue/5 border-accent-blue/30 text-white" : "bg-white/[0.01] border-white/[0.05] text-white/20 hover:border-white/10"
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest font-inter">Include &lt;p&gt; tags</span>
                <div className={cn(
                  "w-6 h-3 rounded-full relative transition-colors",
                  includeHtml ? "bg-accent-blue" : "bg-white/10"
                )}>
                  <div className={cn(
                    "absolute top-0.5 w-2 h-2 rounded-full bg-white transition-all",
                    includeHtml ? "left-3.5" : "left-0.5"
                  )} />
                </div>
              </button>
            )}

            <button
              onClick={generate}
              className="w-full py-4 bg-accent-blue text-white rounded-md font-bold text-xs uppercase tracking-widest hover:bg-accent-blue/90 transition-all font-inter mt-6 shadow-lg shadow-accent-blue/20"
            >
              Generate Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
