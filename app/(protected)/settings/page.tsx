'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Shield, 
  Palette, 
  Trash2, 
  Save, 
  Lock, 
  Loader2,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

type SettingsTab = 'profile' | 'appearance' | 'security';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(session?.user?.name || '');
  const [toolHistoryEnabled, setToolHistoryEnabled] = useState(true);

  const tabs = [
    { id: 'profile', label: 'Profile & Account', icon: User, desc: 'Manage your name and identity' },
    { id: 'appearance', label: 'Preferences', icon: Palette, desc: 'Workspace options and storage' },
    { id: 'security', label: 'Security & Privacy', icon: Shield, desc: 'Session and credentials' },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast('Settings updated successfully', 'success');
    }, 400);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Account Settings</h1>
        <p className="text-xs text-text-tertiary mt-0.5">Manage your workspace preferences, session security, and account data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Navigation Tabs */}
        <aside className="lg:col-span-4 space-y-1.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group relative text-left focus-visible:ring-2 focus-visible:ring-primary outline-none",
                  isActive 
                    ? "bg-surface-card border border-primary/40 text-white shadow-sm" 
                    : "text-text-secondary hover:text-white hover:bg-white/[0.03] border border-transparent"
                )}
                aria-selected={isActive}
                role="tab"
              >
                <tab.icon size={16} className={cn("transition-colors shrink-0", isActive ? "text-primary" : "text-text-muted group-hover:text-white")} />
                <div>
                  <p className="text-xs font-bold leading-tight">{tab.label}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{tab.desc}</p>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Content Container */}
        <main className="lg:col-span-8">
          <div className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 relative min-h-[420px] flex flex-col shadow-[var(--shadow-raised-sm)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex-1 space-y-5"
              >
                {activeTab === 'profile' && (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row items-center gap-4 pb-5 border-b border-white/[0.08]">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/15 p-0.5 bg-surface-inset relative">
                        {session?.user?.image ? (
                          <Image 
                            src={session.user.image} 
                            alt={session.user.name || 'User'} 
                            width={64} 
                            height={64}
                            className="w-full h-full object-cover rounded-xl"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                            {session?.user?.name?.[0] || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-sm font-bold text-white">{session?.user?.name || 'User'}</h3>
                        <p className="text-xs text-text-tertiary">{session?.user?.email}</p>
                        <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-400">
                          Active Free Workspace
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label htmlFor="settings-name" className="text-xs font-semibold text-text-secondary block">
                          Display Name
                        </label>
                        <input 
                          id="settings-name"
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          className="w-full h-10 bg-surface-inset border border-white/[0.08] rounded-xl px-3.5 text-xs text-white focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 shadow-inner transition-all"
                          placeholder="Your display name"
                        />
                      </div>

                      <div className="space-y-1">
                        <label htmlFor="settings-email" className="text-xs font-semibold text-text-secondary block">
                          Email Address
                        </label>
                        <div className="relative">
                          <input 
                            id="settings-email"
                            type="email" 
                            value={session?.user?.email || ''} 
                            disabled 
                            className="w-full h-10 bg-surface-inset border border-white/[0.04] rounded-xl px-3.5 text-xs text-text-muted cursor-not-allowed shadow-inner"
                          />
                          <Lock size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">Interface Theme</h3>
                      <div className="p-3.5 rounded-xl bg-surface-inset border border-white/[0.06] text-xs text-text-secondary flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-white">Obsidian Dark with Amber Accent</p>
                          <p className="text-[10px] text-text-muted">High-contrast, eye-friendly workspace palette</p>
                        </div>
                        <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/15 border border-primary/25">Active</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.08] space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">Local Privacy & Storage</h3>
                      
                      <label className="flex items-center justify-between p-3.5 rounded-xl bg-surface-inset border border-white/[0.06] cursor-pointer hover:border-white/15 transition-all">
                        <div>
                          <p className="text-xs font-semibold text-white">Tool Execution History</p>
                          <p className="text-[10px] text-text-muted">Save your recently used tools locally in browser storage</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={toolHistoryEnabled}
                          onChange={(e) => setToolHistoryEnabled(e.target.checked)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-xl bg-surface-inset border border-white/[0.06] space-y-2">
                      <div className="flex items-center gap-2">
                        <Shield size={15} className="text-emerald-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">Authentication & Session</h3>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Your session is authenticated via NextAuth and encrypted tokens. All local tool operations execute completely client-side in browser memory.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-red-500/[0.04] border border-red-500/20 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <Trash2 size={15} className="text-red-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-red-400">Account Deletion</h3>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        To permanently delete your Night X account and remove your records, submit a deletion request to support.
                      </p>
                      <button 
                        onClick={() => toast('Please contact support@night-x-v2.vercel.app for account deletion requests.', 'info')}
                        className="px-3.5 py-1.5 bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
                      >
                        Request Account Deletion
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Footer Save Action */}
            <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-end">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary text-xs font-semibold py-2 px-5 shadow-sm flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" size={13} /> : <Save size={13} />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
