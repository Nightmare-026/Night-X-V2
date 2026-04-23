'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  Copy, 
  Check, 
  Trash2, 
  Settings2,
  History,
  Fingerprint,
  Download
} from 'lucide-react';

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [allCopied, setAllCopied] = useState(false);

  const generateUuids = () => {
    const newUuids = Array.from({ length: Math.min(count, 100) }, () => uuidv4());
    setUuids(newUuids);
    setHistory(prev => [...newUuids, ...prev].slice(0, 50));
  };

  const handleCopy = (text: string, index: number | 'all') => {
    navigator.clipboard.writeText(text);
    if (index === 'all') {
      setAllCopied(true);
      setTimeout(() => setAllCopied(false), 2000);
    } else {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([uuids.join('\n')], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `uuids-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Generator Controls */}
      <div className="bg-white/5 rounded-3xl border border-white/10 p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-purple/10 rounded-2xl mb-2">
          <Fingerprint className="w-8 h-8 text-accent-purple" />
        </div>
        <div>
          <h2 className="text-2xl font-syne font-bold mb-2">Generate Unique IDs</h2>
          <p className="text-white/40 text-sm">Create cryptographically strong UUID v4 identifiers</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2 rounded-2xl">
            <span className="text-sm text-white/40">Quantity:</span>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-16 bg-transparent text-center font-mono focus:outline-none"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generateUuids}
            className="flex items-center gap-2 px-8 py-3 bg-accent-purple text-white rounded-2xl font-bold shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Generate
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Active UUIDs */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-accent-cyan" />
              Generated IDs
            </h3>
            {uuids.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(uuids.join('\n'), 'all')}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                  title="Copy All"
                >
                  {allCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={downloadTxt}
                  className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/40 hover:text-white"
                  title="Download TXT"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2 min-h-[300px] bg-black/40 border border-white/10 rounded-3xl p-4 overflow-y-auto">
            <AnimatePresence mode="popLayout">
              {uuids.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/10 py-20">
                  <Fingerprint className="w-12 h-12 mb-4 opacity-5" />
                  <p className="text-sm">Click generate to start</p>
                </div>
              ) : (
                uuids.map((uuid, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={`${uuid}-${index}`}
                    className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-all"
                  >
                    <code className="text-sm font-mono text-white/80">{uuid}</code>
                    <button
                      onClick={() => handleCopy(uuid, index)}
                      className={`p-2 rounded-xl transition-all ${
                        copiedIndex === index 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'opacity-0 group-hover:opacity-100 hover:bg-white/10 text-white/40 hover:text-white'
                      }`}
                    >
                      {copiedIndex === index ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <History className="w-4 h-4 text-accent-purple" />
              History
            </h3>
            <button 
              onClick={() => setHistory([])}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/20 hover:text-red-400"
              title="Clear History"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4 max-h-[400px] overflow-y-auto scrollbar-thin">
            {history.length === 0 ? (
              <p className="text-[10px] text-white/20 text-center py-10 italic">No history yet</p>
            ) : (
              history.map((h, i) => (
                <div key={i} className="py-2 border-b border-white/5 last:border-0 flex items-center justify-between group">
                  <span className="text-[10px] font-mono text-white/30 truncate max-w-[140px]">{h}</span>
                  <button 
                    onClick={() => navigator.clipboard.writeText(h)}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-accent-purple transition-all"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 p-5 rounded-3xl border border-white/10">
            <h4 className="text-xs font-bold mb-2 flex items-center gap-2">
              <Settings2 className="w-3 h-3 text-cyan-400" />
              UUID v4
            </h4>
            <p className="text-[10px] text-white/40 leading-relaxed">
              Standard v4 UUIDs are generated using a cryptographically secure random number generator, with 122 bits of randomness.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
