'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Clock, 
  Zap, 
  Settings, 
  Trophy,
  Activity,
  ArrowRight,
  ChevronRight,
  Fingerprint,
  Layers,
  Cpu,
  Monitor,
  Info
, Sparkles} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/user/stats');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setIsLoading(false);
      }
    }
    if (session) fetchStats();
  }, [session]);

  if (!session) return null;

  const stats = [
    { label: 'Security Class', value: data?.stats?.securityLevel || 'ALPHA-04', icon: <Shield size={16} />, color: 'text-violet-400' },
    { label: 'Operations', value: data?.stats?.totalToolsUsed || '0', icon: <Zap size={16} />, color: 'text-cyan-400' },
    { label: 'Neural Assets', value: data?.stats?.activeTools || '0', icon: <Cpu size={16} />, color: 'text-emerald-400' },
    { label: 'Sync Status', value: data?.stats?.lastActivity ? new Date(data.stats.lastActivity).toLocaleDateString() : 'ONLINE', icon: <Activity size={16} />, color: 'text-blue-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 py-6">
      
      {/* Profile Manifest Header */}
      <section className="relative glass-card border-white/[0.05] bg-black/40 p-8 rounded-md overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-md overflow-hidden border border-white/10 p-1 bg-black/40 relative z-10">
              {session.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt={session.user.name || 'Agent'} 
                  width={160} 
                  height={160}
                  className="w-full h-full object-cover rounded-md opacity-90 group-hover:opacity-100 transition-opacity"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-white/[0.02] flex items-center justify-center text-white/10">
                  <Fingerprint size={64} strokeWidth={1} />
                </div>
              )}
            </div>
            <div className="absolute -inset-4 bg-violet-500/5 blur-2xl rounded-full z-0 group-hover:bg-violet-500/10 transition-all duration-1000" />
            <div className="absolute bottom-[-10px] right-[-10px] bg-violet-600 p-2 rounded-md shadow-xl z-20 border border-white/10">
              <Shield size={16} className="text-white" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 rounded text-[9px] font-bold text-violet-400 uppercase tracking-widest">Authorized_Agent</span>
                <span className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded text-[9px] font-bold text-cyan-400 uppercase tracking-widest">ID_Verified</span>
              </div>
              <h1 className="text-4xl font-black text-white font-outfit tracking-tighter">
                {session.user?.name}
              </h1>
              <p className="text-sm font-mono text-white/30 mt-1 uppercase tracking-tighter">{session.user?.email}</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <Link 
                href="/settings"
                className="flex items-center gap-2 px-6 py-2.5 bg-white text-black rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-violet-50 transition-all shadow-lg"
              >
                <Settings size={14} />
                Edit Parameters
              </Link>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                <Layers size={14} />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Manifest */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md hover:border-white/10 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              {stat.icon}
            </div>
            <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">{stat.label}</p>
            <div className="flex items-end gap-2">
              <span className={cn("text-2xl font-black font-outfit tracking-tighter", stat.color)}>{stat.value}</span>
              <div className="h-2 w-2 rounded-full bg-current mb-2 animate-pulse opacity-50" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lower Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Stream */}
        <section className="lg:col-span-8 glass-card border-white/[0.05] bg-black/40 p-8 rounded-md flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                <Activity size={16} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Operation Logs</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-mono">Telemetry // Activity Loop</p>
              </div>
            </div>
            <button className="text-[9px] font-bold text-white/20 hover:text-cyan-400 transition-colors uppercase tracking-widest">Refresh Stream</button>
          </div>

          <div className="flex-1 space-y-1">
            {(data?.activity || []).length > 0 ? data.activity.map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between py-4 px-4 hover:bg-white/[0.02] rounded-md transition-all group border-b border-white/[0.03] last:border-0">
                <div className="flex items-center gap-5">
                  <div className="w-10 h-10 rounded border border-white/5 bg-black/40 flex items-center justify-center text-white/20 group-hover:text-cyan-400 group-hover:border-cyan-400/20 transition-all">
                    <Zap size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-white/70 group-hover:text-white transition-colors uppercase tracking-widest">{item.action}</p>
                    <p className="text-[10px] font-mono text-white/20 uppercase tracking-tighter mt-0.5">{item.tool} // EXECUTED</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right hidden sm:block">
                    <p className="text-[9px] font-mono text-white/20 uppercase">{new Date(item.last_used).toLocaleDateString()}</p>
                    <p className="text-[8px] font-mono text-white/10 uppercase tracking-tighter">TIMESTAMP_ISO</p>
                  </div>
                  <ChevronRight size={14} className="text-white/10 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            )) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-20">
                <Activity size={40} strokeWidth={1} />
                <p className="text-[10px] font-mono uppercase tracking-widest">No operation logs detected in buffer</p>
              </div>
            )}
          </div>
        </section>

        {/* Upgrade / Account Meta */}
        <section className="lg:col-span-4 space-y-6">
          <div className="glass-card border-white/[0.05] bg-black/40 p-8 rounded-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/5 blur-[60px] rounded-full group-hover:bg-violet-600/10 transition-all" />
            
            <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-widest mb-4">Elite Protocol</h3>
            <p className="text-xs text-white/30 leading-relaxed mb-8 italic">
              Upgrade your identity matrix to unlock priority buffers and infinite AI operations.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                { label: 'Unlimited AI Flux', icon: <Sparkles size={12} /> },
                { label: 'Zero-Queue Priority', icon: <Zap size={12} /> },
                { label: 'White-Label Output', icon: <Monitor size={12} /> }
              ].map((item) => (
                <li key={item.label} className="flex items-center gap-3 text-[10px] font-bold text-white/60 uppercase tracking-widest">
                  <span className="text-violet-400">{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ul>

            <Link 
              href="/settings?tab=billing"
              className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-md text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-900/20"
            >
              Elevate Status
            </Link>
          </div>

          <div className="glass-card border-white/[0.05] bg-black/40 p-6 rounded-md">
            <div className="flex items-center gap-3 mb-4">
              <Info size={14} className="text-white/20" />
              <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Environment Info</h4>
            </div>
            <div className="space-y-2 font-mono text-[9px] uppercase tracking-tighter">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/20">Node_ID</span>
                <span className="text-white/60">NX-7782-AGENT</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-white/20">Cluster</span>
                <span className="text-white/60">US-EAST-1</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-white/20">Uptime</span>
                <span className="text-white/60">99.98%</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
