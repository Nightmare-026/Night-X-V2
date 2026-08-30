'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Settings, 
  Star, 
  Activity, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [statsData, setStatsData] = useState<any>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/user/stats');
        if (res.ok) {
          const json = await res.json();
          setStatsData(json);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    }
    if (session) fetchStats();
  }, [session]);

  if (!session) return null;

  const stats = [
    { label: 'Tools Executed', value: statsData?.stats?.totalToolsUsed || '24', icon: <Zap size={15} />, color: 'text-primary' },
    { label: 'AI Assistance', value: statsData?.stats?.aiRuns || '18', icon: <Sparkles size={15} />, color: 'text-accent-orange' },
    { label: 'Saved Favorites', value: statsData?.stats?.favoritesCount || '5', icon: <Star size={15} />, color: 'text-amber-400' },
    { label: 'Privacy Status', value: '100% In-Browser', icon: <Shield size={15} />, color: 'text-emerald-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-6 px-4 sm:px-6">
      
      {/* Profile Header Card */}
      <section className="relative rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-sm)] overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-white/15 p-1 bg-surface-inset relative z-10 shadow-md">
              {session.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt={session.user.name || 'User Avatar'} 
                  width={96} 
                  height={96}
                  className="w-full h-full object-cover rounded-xl"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl rounded-xl">
                  {session.user?.name?.[0] || 'U'}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1 rounded-md shadow z-20 border-2 border-[#0E1118]">
              <CheckCircle2 size={12} className="text-black stroke-[3]" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                <span className="px-2.5 py-0.5 bg-primary/15 border border-primary/30 rounded-full text-[10px] font-bold text-primary uppercase tracking-wider">
                  Workspace Member
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Active Account
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {session.user?.name || 'Night X User'}
              </h1>
              <p className="text-xs text-text-tertiary">{session.user?.email}</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
              <Link 
                href="/settings"
                className="btn-primary text-xs font-semibold py-2 px-3.5 shadow-sm"
              >
                <Settings size={13} className="mr-1.5" /> Account Settings
              </Link>
              <Link 
                href="/dashboard"
                className="btn-secondary text-xs font-semibold py-2 px-3.5"
              >
                <Zap size={13} className="mr-1.5" /> Launch Tools
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 * i }}
            className="rounded-2xl border border-white/[0.08] bg-surface-card p-4 sm:p-5 shadow-[var(--shadow-raised-sm)] space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
              <div className={cn("p-1.5 rounded-lg bg-surface-inset border border-white/[0.06]", stat.color)}>
                {stat.icon}
              </div>
            </div>
            <div className="text-xl font-black text-white tracking-tight font-mono">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity Section */}
      <section className="rounded-2xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 flex flex-col min-h-[320px] shadow-[var(--shadow-raised-sm)]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary">
              <Activity size={15} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Recent Activity Log</h2>
              <p className="text-[11px] text-text-muted">Locally executed tools and workflows</p>
            </div>
          </div>
          <Link href="/tools" className="text-xs font-semibold text-primary hover:underline">
            Browse Catalog
          </Link>
        </div>

        <div className="flex-1 space-y-2">
          {(statsData?.activity || []).length > 0 ? statsData.activity.slice(0, 5).map((item: any, i: number) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-inset hover:border-primary/30 border border-white/[0.04] transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-surface-card border border-white/[0.08] flex items-center justify-center text-primary">
                  <Zap size={13} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white group-hover:text-primary transition-colors">{item.action || 'Tool Action'}</p>
                  <p className="text-[10px] text-text-muted">{item.tool || 'Utility'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-text-tertiary">
                  {new Date(item.last_used || Date.now()).toLocaleDateString()}
                </span>
                <ChevronRight size={13} className="text-white/20 group-hover:text-white transition-colors" />
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-2.5 text-text-muted">
              <Activity size={24} />
              <p className="text-xs">No recent activity logged yet.</p>
              <Link href="/tools" className="btn-secondary text-xs py-1.5 px-3">
                Explore All 42 Tools
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
