'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Trash2, 
  Save, 
  ExternalLink,
  CreditCard,
  Smartphone,
  Cpu,
  Monitor,
  Lock,
  ChevronRight,
  Database,
  Cloud,
  Zap
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type SettingsTab = 'profile' | 'preferences' | 'security' | 'billing';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Identity', icon: User, desc: 'Personal parameters' },
    { id: 'preferences', label: 'Interface', icon: Palette, desc: 'UI personalization' },
    { id: 'security', label: 'Security', icon: Shield, desc: 'Access protocols' },
    { id: 'billing', label: 'Subsystem', icon: CreditCard, desc: 'Resource quotas' },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div>
          <h1 className="text-4xl font-black text-white font-outfit tracking-tighter">ENVIRONMENT<span className="text-violet-500">_CONFIG</span></h1>
          <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mt-2 italic">Global Node Settings // Agent Parameters</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Manifest */}
        <aside className="lg:col-span-3 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3.5 rounded-md transition-all group relative overflow-hidden",
                activeTab === tab.id 
                  ? "bg-violet-600/10 border border-violet-600/20 text-white" 
                  : "text-white/40 hover:text-white/60 hover:bg-white/[0.02] border border-transparent"
              )}
            >
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="active-tab-indicator"
                  className="absolute left-0 w-[2px] h-1/2 bg-violet-500 rounded-full"
                />
              )}
              <tab.icon size={18} className={cn("transition-colors", activeTab === tab.id ? "text-violet-500" : "text-white/20 group-hover:text-white/40")} />
              <div className="text-left">
                <p className="text-[11px] font-bold uppercase tracking-widest leading-none">{tab.label}</p>
                <p className="text-[8px] font-mono uppercase tracking-tighter text-white/20 mt-1">{tab.desc}</p>
              </div>
            </button>
          ))}
        </aside>

        {/* Configuration Module */}
        <main className="lg:col-span-9">
          <div className="glass-card bg-black/40 border-white/[0.05] p-8 md:p-10 rounded-md relative min-h-[600px] flex flex-col">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                {activeTab === 'profile' && (
                  <div className="space-y-10">
                    <div className="flex flex-col md:flex-row gap-10 items-start">
                      <div className="relative group">
                        <div className="w-28 h-28 rounded-md border border-white/10 p-1 bg-black/40 relative overflow-hidden">
                          {session?.user?.image ? (
                            <Image 
                              src={session.user.image} 
                              alt={session.user.name || 'User'} 
                              width={112} 
                              height={112}
                              className="w-full h-full object-cover rounded-md opacity-80 group-hover:opacity-100 transition-opacity"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-white/[0.02] text-white/10">
                              <User size={48} strokeWidth={1} />
                            </div>
                          )}
                        </div>
                        <button className="absolute -bottom-3 -right-3 bg-violet-600 p-2 rounded-md border border-white/10 text-white shadow-xl hover:bg-violet-500 transition-colors">
                          <Smartphone size={14} />
                        </button>
                      </div>
                      
                      <div className="flex-1 space-y-6 w-full">
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Entity Handle</label>
                          <input 
                            type="text" 
                            defaultValue={session?.user?.name || ''} 
                            className="w-full h-12 bg-white/[0.02] border border-white/10 rounded-md px-5 text-sm text-white focus:outline-none focus:border-violet-500/50 transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] ml-1">Identity Vector (Read-Only)</label>
                          <div className="relative">
                            <input 
                              type="email" 
                              value={session?.user?.email || ''} 
                              disabled 
                              className="w-full h-12 bg-white/[0.01] border border-white/5 rounded-md px-5 text-sm text-white/20 cursor-not-allowed font-mono"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10">
                              <Lock size={14} />
                            </div>
                          </div>
                          <p className="text-[8px] text-white/20 font-mono uppercase tracking-tighter ml-1">
                            Auth Method: {session?.user?.email?.includes('gmail.com') ? 'Google OAuth 2.0' : 'Internal Registry'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-md border border-white/[0.03] bg-white/[0.01] space-y-4">
                      <h4 className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Metadata Sync</h4>
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-[11px] text-white/60">Cloud Storage Sync</span>
                        <div className="w-10 h-5 bg-violet-600/20 border border-violet-600/30 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-violet-500 rounded-full" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-[11px] text-white/60">Real-time Telemetry</span>
                        <div className="w-10 h-5 bg-white/5 border border-white/10 rounded-full relative cursor-pointer">
                          <div className="absolute left-1 top-1 w-3 h-3 bg-white/20 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'preferences' && (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 rounded-md bg-white/[0.02] border border-white/[0.05] space-y-6">
                        <div className="flex items-center gap-3">
                          <Palette className="text-cyan-400" size={18} />
                          <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Kernel Theme</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          {['Neural Dark (Active)', 'Light Protocol', 'System Default'].map((t, i) => (
                            <button 
                              key={t}
                              className={cn(
                                "flex items-center justify-between px-4 py-3 rounded-md text-[10px] font-bold uppercase tracking-widest border transition-all",
                                i === 0 ? "bg-cyan-400/5 border-cyan-400/20 text-cyan-400" : "bg-black/20 border-white/5 text-white/20 hover:text-white/40"
                              )}
                            >
                              {t}
                              {i === 0 && <ChevronRight size={12} />}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="p-8 rounded-md bg-white/[0.02] border border-white/[0.05] space-y-6">
                        <div className="flex items-center gap-3">
                          <Cpu className="text-violet-400" size={18} />
                          <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Compute Hub</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-white/60 uppercase tracking-tighter">Auto-Deploy Dashboard</span>
                            <div className="w-10 h-5 bg-violet-600/20 border border-violet-600/30 rounded-full relative cursor-pointer">
                              <div className="absolute right-1 top-1 w-3 h-3 bg-violet-500 rounded-full" />
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-white/60 uppercase tracking-tighter">Show Neural Flux</span>
                            <div className="w-10 h-5 bg-white/5 border border-white/10 rounded-full relative cursor-pointer">
                              <div className="absolute left-1 top-1 w-3 h-3 bg-white/20 rounded-full" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8 rounded-md bg-white/[0.02] border border-white/[0.05]">
                      <div className="flex items-center gap-3 mb-8">
                        <Bell className="text-yellow-400" size={18} />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Signal Notifications</h3>
                      </div>
                      <div className="space-y-4 max-w-md">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-white/60 uppercase tracking-tighter">Major Protocol Updates</span>
                          <div className="w-10 h-5 bg-white/5 border border-white/10 rounded-full relative cursor-pointer" />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-white/60 uppercase tracking-tighter">System Health Alerts</span>
                          <div className="w-10 h-5 bg-white/5 border border-white/10 rounded-full relative cursor-pointer" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-8">
                    <div className="p-8 rounded-md bg-white/[0.02] border border-white/[0.05] space-y-6">
                      <div className="flex items-center gap-3">
                        <Shield className="text-emerald-400" size={18} />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-white/80">Access Shield</h3>
                      </div>
                      <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-md">
                        <p className="text-[10px] text-emerald-400/80 leading-relaxed uppercase tracking-tighter font-mono">
                          Identity verified via External Provider. Your credentials are encrypted and managed by your identity custodian.
                        </p>
                      </div>
                      <button className="text-[10px] font-black text-cyan-400 flex items-center gap-2 hover:underline uppercase tracking-widest">
                        Manage Identity Hub <ExternalLink size={12} />
                      </button>
                    </div>

                    <div className="p-8 rounded-md bg-red-500/5 border border-red-500/10 space-y-6">
                      <div className="flex items-center gap-3">
                        <Trash2 className="text-red-500" size={18} />
                        <h3 className="text-xs font-bold uppercase tracking-widest text-red-500">Hazardous Operations</h3>
                      </div>
                      <p className="text-[11px] text-white/30 leading-relaxed uppercase tracking-tighter">
                        Terminating your instance is an irreversible operation. All neural assets and logs will be purged from the global node.
                      </p>
                      <button className="px-6 py-3 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-md transition-all">
                        Purge Account Instance
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-violet-600/10 rounded-full flex items-center justify-center border border-violet-600/20 relative z-10">
                        <CreditCard className="w-10 h-10 text-violet-500" />
                      </div>
                      <div className="absolute inset-0 bg-violet-500/20 blur-3xl opacity-20" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-white font-outfit uppercase tracking-wider mb-2">Standard Protocol</h3>
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.2em] max-w-xs mx-auto">
                        Limited compute cycle allocation. Verified Agent status active.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                      <div className="p-4 rounded-md border border-white/5 bg-white/[0.01]">
                        <p className="text-[8px] text-white/20 uppercase tracking-widest mb-1">AI Flux</p>
                        <p className="text-xs font-bold text-white">50/Day</p>
                      </div>
                      <div className="p-4 rounded-md border border-white/5 bg-white/[0.01]">
                        <p className="text-[8px] text-white/20 uppercase tracking-widest mb-1">Storage</p>
                        <p className="text-xs font-bold text-white">500 MB</p>
                      </div>
                    </div>

                    <button className="px-10 py-4 bg-violet-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-md hover:bg-violet-500 transition-all shadow-xl shadow-violet-900/40 group">
                      Initialize Pro Flux 
                      <ChevronRight className="inline ml-2 group-hover:translate-x-1 transition-transform" size={12} />
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Global Footer Controls */}
            <div className="mt-auto pt-10 border-t border-white/[0.03] flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-white/20">
                  <Database size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">NX-SQL-V2</span>
                </div>
                <div className="flex items-center gap-2 text-white/20">
                  <Cloud size={12} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">Global CDN</span>
                </div>
              </div>
              
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3 bg-white text-black hover:bg-violet-50 disabled:opacity-50 text-[10px] font-black uppercase tracking-[0.2em] rounded-md transition-all shadow-xl"
              >
                {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                {isSaving ? 'Syncing...' : 'Sync Parameters'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Loader2({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={cn("animate-spin", className)} 
      width={size || 16} 
      height={size || 16} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
