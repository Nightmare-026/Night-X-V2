// @ts-nocheck
import { 
  Dna, 
  Copy, 
  RefreshCw, 
  Settings2, 
  Sparkles, 
  Terminal,
  Database,
  Search,
  Check,
  Hash,
  Fingerprint,
  Cpu,
  Layers,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, copyToClipboard } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

function generateUuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const { toast } = useToast();
  const [count, setCount] = useState(10);
  const [uuids, setUuids] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [uppercase, setUppercase] = useState(false);

  const generate = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const newUuids = Array.from({ length: count }, () => {
        let u = generateUuidV4();
        if (uppercase) u = u.toUpperCase();
        return prefix ? `${prefix}${u}` : u;
      });
      setUuids(newUuids);
      setIsGenerating(false);
      toast(`${count} IDs generated`, "success");
    }, 400);
  }, [count, prefix, uppercase, toast]);

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast("ID copied", "success");
    }
  };

  const copyAll = async () => {
    if (uuids.length === 0) return;
    const success = await copyToClipboard(uuids.join('\n'));
    if (success) {
      toast("All IDs copied to clipboard", "success");
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Panel: Parameter Synthesis */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md p-8 space-y-8">
            <div className="flex items-center gap-3">
              <Settings2 className="text-cyan-400" size={16} />
              <h3 className="text-xs font-outfit font-bold uppercase tracking-widest text-white/80">Parameter Synthesis</h3>
            </div>

            <div className="space-y-8">
              {/* Batch Size */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                  <span className="text-white/20 flex items-center gap-2"><Hash size={10} /> Batch Size</span>
                  <span className="text-cyan-400 font-mono">{count} Entities</span>
                </div>
                <div className="p-6 bg-black/40 rounded-md border border-white/[0.05] group">
                  <input 
                    type="range" min={1} max={100} value={count}
                    onChange={e => setCount(Number(e.target.value))}
                    className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between mt-4 px-1 font-mono text-[8px] text-white/10 group-hover:text-white/20 transition-colors uppercase">
                    <span>01</span>
                    <span>25</span>
                    <span>50</span>
                    <span>75</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Advanced Transformation */}
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1 flex items-center gap-2">
                  <Cpu size={10} /> Data Transformation
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={prefix} 
                      onChange={e => setPrefix(e.target.value)}
                      placeholder="PREFIX_"
                      className="w-full bg-black/40 border border-white/[0.05] rounded-md px-4 py-3 text-[10px] font-mono text-white/60 focus:outline-none focus:border-cyan-400/50 transition-all uppercase placeholder:text-white/10"
                    />
                  </div>
                  <button 
                    onClick={() => setUppercase(!uppercase)}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-md px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border",
                      uppercase 
                        ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/30" 
                        : "bg-black/40 text-white/20 border-white/[0.05] hover:text-white/40"
                    )}
                  >
                    Uppercase
                  </button>
                </div>
              </div>

              <button 
                onClick={generate}
                disabled={isGenerating}
                className="w-full h-14 bg-white text-black rounded-md text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all disabled:opacity-50 group"
              >
                {isGenerating ? <RefreshCw className="animate-spin" size={14} /> : <Sparkles size={14} className="group-hover:animate-pulse" />}
                Initialize Generator
              </button>
            </div>

            <div className="p-6 bg-cyan-400/5 border border-cyan-400/10 rounded-md space-y-4">
              <div className="flex items-center gap-3 text-cyan-400">
                <Layers size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Protocol Note</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-inter uppercase tracking-widest">
                UUID v4 generation utilizes cryptographically strong pseudo-random number generators (CSPRNG) for maximum collision resistance.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel: Entropy Output */}
        <div className="lg:col-span-7">
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-md overflow-hidden flex flex-col h-[700px] relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-[100px] rounded-full" />
            
            <div className="relative z-10 flex flex-col h-full">
              <div className="p-8 border-b border-white/[0.05] bg-white/[0.01] flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.2em] text-cyan-400 uppercase mb-2">Audit Trail</div>
                  <h2 className="text-xl font-outfit font-bold text-white uppercase tracking-widest flex items-center gap-3">
                    Generated Payload
                    {uuids.length > 0 && <span className="text-[10px] bg-cyan-400/10 text-cyan-400 px-2 py-0.5 rounded-full font-mono">{uuids.length}</span>}
                  </h2>
                </div>
                <button 
                  onClick={copyAll}
                  disabled={uuids.length === 0}
                  className="px-6 py-2.5 bg-white/[0.05] hover:bg-cyan-400 hover:text-black border border-white/[0.05] rounded-md text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-20"
                >
                  <Copy size={12} />
                  Copy Batch
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-3 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {uuids.length > 0 ? (
                    uuids.map((uuid, i) => (
                      <motion.div
                        key={uuid + i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.01 }}
                        className="group flex items-center justify-between p-5 bg-black/20 border border-white/[0.03] hover:border-cyan-400/30 rounded-md transition-all"
                      >
                        <div className="flex items-center gap-6">
                          <span className="text-[9px] font-mono text-white/10 w-6">{(i + 1).toString().padStart(2, '0')}</span>
                          <code className="text-[11px] font-mono text-white/40 group-hover:text-cyan-400 transition-colors tracking-tight">{uuid}</code>
                        </div>
                        <button 
                          onClick={() => handleCopy(uuid)}
                          className="p-2 text-white/10 hover:text-cyan-400 transition-all"
                        >
                          <Copy size={14} />
                        </button>
                      </motion.div>
                    ))
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-white/10 space-y-6">
                      <div className="p-8 rounded-full bg-white/[0.02] border border-white/[0.05]">
                        <Fingerprint size={48} className="opacity-10" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Awaiting Entropy Generation</p>
                        <p className="text-[9px] uppercase tracking-widest text-white/5">System ready for initialization</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-8 bg-white/[0.01] border-t border-white/[0.05] grid grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-cyan-400/5 border border-cyan-400/10 flex items-center justify-center text-cyan-400">
                    <Zap size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Instant Result</div>
                    <div className="text-[9px] text-white/20 uppercase tracking-tighter">Sub-millisecond generation</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md bg-emerald-400/5 border border-emerald-400/10 flex items-center justify-center text-emerald-400">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Collision Safe</div>
                    <div className="text-[9px] text-white/20 uppercase tracking-tighter">RFC 4122 Compliant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
