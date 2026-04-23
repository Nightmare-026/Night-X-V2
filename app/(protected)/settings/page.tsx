'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
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
  Cpu
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

type SettingsTab = 'profile' | 'preferences' | 'security' | 'billing';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // In a real app, we would call an API here
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-12 lg:px-8">
      <div className="mb-12">
        <h1 className="text-4xl font-syne font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
          Settings
        </h1>
        <p className="text-white/50 font-dm-sans">
          Manage your account settings, preferences, and security.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium",
                activeTab === tab.id 
                  ? "bg-accent-purple/20 text-accent-purple border border-accent-purple/30" 
                  : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow">
          <div className="glass-card p-8 min-h-[500px] border-white/10 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />
            
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-3xl overflow-hidden glass-effect border-2 border-white/10 ring-4 ring-accent-purple/10">
                        {session?.user?.image ? (
                          <Image 
                            src={session.user.image} 
                            alt={session.user.name || 'User'} 
                            width={96} 
                            height={96}
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-accent-purple/20 text-accent-purple">
                            <User size={40} />
                          </div>
                        )}
                      </div>
                      <button className="absolute -bottom-2 -right-2 bg-accent-purple p-2 rounded-xl text-white shadow-lg hover:scale-110 transition-transform">
                        <Smartphone size={14} />
                      </button>
                    </div>
                    
                    <div className="flex-grow space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Display Name</label>
                        <input 
                          type="text" 
                          defaultValue={session?.user?.name || ''} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent-purple/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Email Address</label>
                        <input 
                          type="email" 
                          value={session?.user?.email || ''} 
                          disabled 
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/40 cursor-not-allowed"
                        />
                        <p className="text-[10px] text-white/30 mt-2">Logged in via {session?.user?.email?.includes('gmail.com') ? 'Google' : 'SSO'}. Email cannot be changed.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-accent-purple hover:bg-accent-purple/90 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-lg shadow-accent-purple/20"
                    >
                      {isSaving ? <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" /> : <Save size={18} />}
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <Palette className="text-accent-cyan" size={20} />
                        <h3 className="font-bold">Theme</h3>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {['Dark', 'Light', 'System'].map((t) => (
                          <button 
                            key={t}
                            className={cn(
                              "px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                              t === 'Dark' ? "bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan" : "bg-white/5 border-white/5 text-white/40 hover:text-white"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3 mb-4">
                        <Cpu className="text-accent-pink" size={20} />
                        <h3 className="font-bold">AI Assistant</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">Auto-show chat on dashboard</span>
                        <div className="w-10 h-5 bg-accent-pink/40 rounded-full relative cursor-pointer">
                          <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-lg" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                      <Bell size={18} className="text-accent-gold" />
                      Notifications
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/60">Email for major tool updates</span>
                        <div className="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <Shield size={18} className="text-accent-red" />
                      Password
                    </h3>
                    <p className="text-sm text-white/40">Since you use Google Auth, your password is managed by Google.</p>
                    <button className="text-xs font-bold text-accent-cyan flex items-center gap-1 hover:underline">
                      Manage Google Account <ExternalLink size={12} />
                    </button>
                  </div>

                  <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/20">
                    <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2">
                      <Trash2 size={18} />
                      Danger Zone
                    </h3>
                    <p className="text-sm text-white/40 mb-6">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button className="px-6 py-3 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-bold rounded-xl transition-all">
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'billing' && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center mb-6">
                    <CreditCard className="w-10 h-10 text-accent-gold" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Free Plan</h3>
                  <p className="text-white/40 max-w-xs mb-8">
                    You are currently on the Night X Free plan. Upgrade to unlock premium tools and higher AI limits.
                  </p>
                  <button className="px-8 py-3 bg-accent-gold text-black font-bold rounded-xl hover:scale-105 transition-transform shadow-lg shadow-accent-gold/20">
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
