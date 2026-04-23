'use client';

import React, { useState } from 'react';
import { Copy, RefreshCw } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Controls */}
      <div className="glass-card rounded-2xl border border-white/10 p-6 space-y-5">
        {/* Type selector */}
        <div className="space-y-2">
          <label className="text-sm text-white/60 font-medium">Generate by</label>
          <div className="flex gap-2 flex-wrap">
            {(['paragraphs', 'sentences', 'words'] as const).map(t => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                  type === t
                    ? 'bg-violet-600 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="space-y-2">
          <label className="text-sm text-white/60 font-medium">Count: <span className="text-violet-400 font-bold">{count}</span></label>
          <input
            type="range"
            min={1}
            max={type === 'words' ? 500 : 20}
            value={count}
            onChange={e => setCount(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
          <div className="flex justify-between text-xs text-white/30">
            <span>1</span><span>{type === 'words' ? 500 : 20}</span>
          </div>
        </div>

        {/* HTML toggle */}
        {type === 'paragraphs' && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIncludeHtml(!includeHtml)}
              className={`w-11 h-6 rounded-full relative transition-all ${includeHtml ? 'bg-violet-600' : 'bg-white/10'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${includeHtml ? 'left-6' : 'left-1'}`} />
            </button>
            <span className="text-sm text-white/60">Wrap in <code className="text-violet-400">&lt;p&gt;</code> tags</span>
          </div>
        )}

        <button
          onClick={generate}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold transition-all flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} />
          Generate Lorem Ipsum
        </button>
      </div>

      {/* Result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-sm font-medium text-white/70">Generated Text</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition-all"
            >
              <Copy size={13} />
              {copied ? 'Copied!' : 'Copy All'}
            </button>
          </div>
          <pre className="p-4 text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-sans">{result}</pre>
        </motion.div>
      )}
    </div>
  );
}
