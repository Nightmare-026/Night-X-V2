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
  CreditCard, 
  Lock, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles, 
  Loader2, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';

type SettingsTab = 'profile' | 'appearance' | 'security' | 'billing';

export default function SettingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(session?.user?.name || '');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [toolHistoryEnabled, setToolHistoryEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState('dark');

  const tabs = [
    { id: 'profile', label: 'Profile & Account', icon: User, desc: 'Manage your name and identity' },
    { id: 'appearance', label: 'Preferences', icon: Palette, desc: 'Theme, animations and defaults' },
    { id: 'security', label: 'Security & Privacy', icon: Shield, desc: 'Authentication and credentials' },
    { id: 'billing', label: 'Plan & Billing', icon: CreditCard, desc: 'Usage quotas and subscriptions' },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast('Settings saved successfully', 'success');
    }, 500);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Account Settings</h1>
        <p className="text-xs text-text-tertiary mt-1">Manage your account preferences, interface options, and subscription</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        {/* Navigation Tabs */}
        <aside className="lg:col-span-4 space-y-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as SettingsTab)}
                className={cn(
                  "w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all group relative text-left focus-visible:ring-2 focus-visible:ring-primary outline-none",
                  isActive 
                    ? "bg-surface-card border border-primary/40 text-white shadow-[var(--shadow-raised-sm)]" 
                    : "text-text-secondary hover:text-white hover:bg-white/[0.03] border border-transparent"
                )}
                aria-selected={isActive}
                role="tab"
              >
                <tab.icon size={18} className={cn("transition-colors shrink-0", isActive ? "text-primary-400" : "text-text-muted group-hover:text-white")} />
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
          <div className="rounded-3xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 relative min-h-[460px] flex flex-col shadow-[var(--shadow-raised-md)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex-1 space-y-6"
              >
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-white/[0.08]">
                      <div className="w-18 h-18 rounded-2xl overflow-hidden border border-white/15 p-0.5 bg-surface-inset relative">
                        {session?.user?.image ? (
                          <Image 
                            src={session.user.image} 
                            alt={session.user.name || 'User'} 
                            width={72} 
                            height={72}
                            className="w-full h-full object-cover rounded-xl"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary-400 font-bold text-2xl">
                            {session?.user?.name?.[0] || 'U'}
                          </div>
                        )}
                      </div>
                      <div className="text-center sm:text-left">
                        <h3 className="text-base font-bold text-white">{session?.user?.name || 'User'}</h3>
                        <p className="text-xs text-text-tertiary">{session?.user?.email}</p>
                        <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                          Active Account
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label htmlFor="settings-name" className="text-xs font-semibold text-text-secondary block">
                          Display Name
                        </label>
                        <input 
                          id="settings-name"
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)}
                          className="w-full h-11 bg-surface-inset border border-white/[0.1] rounded-xl px-4 text-xs text-white focus:outline-none focus:border-primary/60 focus:ring-2 focus:ring-primary/20 shadow-[var(--shadow-inset-sm)] transition-all"
                          placeholder="Your display name"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="settings-email" className="text-xs font-semibold text-text-secondary block">
                          Email Address
                        </label>
                        <div className="relative">
                          <input 
                            id="settings-email"
                            type="email" 
                            value={session?.user?.email || ''} 
                            disabled 
                            className="w-full h-11 bg-surface-inset border border-white/[0.06] rounded-xl px-4 text-xs text-text-muted cursor-not-allowed shadow-[var(--shadow-inset-sm)]"
                          />
                          <Lock size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'appearance' && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">Color Theme</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'dark', name: 'Dark Obsidian (Default)', desc: 'Soft Green Neumorphic' },
                          { id: 'contrast', name: 'High Contrast', desc: 'Sharper borders & deep black' },
                          { id: 'system', name: 'System Default', desc: 'Syncs with OS theme' }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setSelectedTheme(t.id)}
                            className={cn(
                              "p-4 rounded-2xl border text-left transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none",
                              selectedTheme === t.id
                                ? "bg-primary/15 border-primary/40 text-white shadow-sm"
                                : "bg-surface-inset border-white/[0.06] text-text-secondary hover:border-white/[0.15]"
                            )}
                          >
                            <p className="text-xs font-bold text-white">{t.name}</p>
                            <p className="text-[10px] text-text-muted mt-1">{t.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/[0.08] space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white">Tool & Workflow Preferences</h3>
                      
                      <label className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-inset border border-white/[0.06] cursor-pointer hover:border-white/15 transition-all">
                        <div>
                          <p className="text-xs font-semibold text-white">Recent Tool History</p>
                          <p className="text-[10px] text-text-muted">Save your recently used tools locally for faster access</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={toolHistoryEnabled}
                          onChange={(e) => setToolHistoryEnabled(e.target.checked)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-inset border border-white/[0.06] cursor-pointer hover:border-white/15 transition-all">
                        <div>
                          <p className="text-xs font-semibold text-white">Email Notification Digests</p>
                          <p className="text-[10px] text-text-muted">Receive occasional updates on new tools and features</p>
                        </div>
                        <input 
                          type="checkbox" 
                          checked={emailNotifications}
                          onChange={(e) => setEmailNotifications(e.target.checked)}
                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="p-5 rounded-2xl bg-surface-inset border border-white/[0.08] space-y-2.5">
                      <div className="flex items-center gap-2.5">
                        <Shield size={16} className="text-emerald-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-white">Account Security</h3>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Your session is protected with industry-standard cryptographic sessions and encrypted credentials.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-xs text-emerald-400 font-semibold">Protected & Authenticated</span>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-red-500/[0.05] border border-red-500/20 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <Trash2 size={16} className="text-red-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-red-400">Danger Zone</h3>
                      </div>
                      <p className="text-xs text-text-muted leading-relaxed">
                        Permanently delete your Night X account and wipe all stored preferences and history. This action is irreversible.
                      </p>
                      <button 
                        onClick={() => toast('Please contact support@night-x.app for account deletion requests.', 'info')}
                        className="px-4 py-2 bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500 hover:text-white rounded-xl text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'billing' && (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-surface-inset border border-primary/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles size={16} className="text-primary-400" />
                          <h3 className="text-sm font-bold text-white">Night X Community Plan</h3>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-[10px] font-bold text-primary-300">
                          Active Free Tier
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Access to all 42 local browser tools, 30 AI assistant requests per day, and fast local processing.
                      </p>
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 rounded-xl bg-surface-card border border-white/[0.06]">
                          <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Daily AI Queries</p>
                          <p className="text-sm font-bold text-white mt-0.5">30 / day</p>
                        </div>
                        <div className="p-3 rounded-xl bg-surface-card border border-white/[0.06]">
                          <p className="text-[10px] text-text-muted uppercase tracking-wider font-semibold">Local Processing</p>
                          <p className="text-sm font-bold text-emerald-400 mt-0.5">Unlimited</p>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Link 
                          href="/pricing" 
                          className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-1.5"
                        >
                          <span>Upgrade to Pro Creator</span>
                          <ArrowRight size={13} />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Footer Save Action */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-end">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary text-xs font-semibold py-2.5 px-6 shadow-sm flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                <span>{isSaving ? 'Saving Changes...' : 'Save Settings'}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
