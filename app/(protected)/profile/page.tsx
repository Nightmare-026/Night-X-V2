'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Clock, 
  Zap, 
  Settings, 
  Star, 
  Activity, 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [statsData, setStatsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    }
    if (session) fetchStats();
  }, [session]);

  if (!session) return null;

  const stats = [
    { label: 'Tools Run', value: statsData?.stats?.totalToolsUsed || '24', icon: <Zap size={16} />, color: 'text-primary-400' },
    { label: 'AI Generations', value: statsData?.stats?.aiRuns || '18', icon: <Sparkles size={16} />, color: 'text-accent-pink' },
    { label: 'Saved Favorites', value: statsData?.stats?.favoritesCount || '5', icon: <Star size={16} />, color: 'text-accent-amber' },
    { label: 'Security Level', value: 'Protected', icon: <Shield size={16} />, color: 'text-emerald-400' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4 sm:px-6">
      
      {/* Profile Header Card */}
      <section className="relative rounded-3xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 shadow-[var(--shadow-raised-md)] overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
          <div className="relative">
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border border-white/15 p-1 bg-surface-inset relative z-10 shadow-lg">
              {session.user?.image ? (
                <Image 
                  src={session.user.image} 
                  alt={session.user.name || 'User Avatar'} 
                  width={112} 
                  height={112}
                  className="w-full h-full object-cover rounded-xl"
                  unoptimized
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary-400 font-bold text-3xl rounded-xl">
                  {session.user?.name?.[0] || 'U'}
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-lg shadow-lg z-20 border-2 border-[#0E1118]">
              <CheckCircle2 size={13} className="text-black stroke-[3]" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2.5">
            <div>
              <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 bg-primary/15 border border-primary/30 rounded-full text-[10px] font-bold text-primary-300 uppercase tracking-wider">
                  Community Member
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Verified Account
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {session.user?.name || 'Night X User'}
              </h1>
              <p className="text-xs text-text-tertiary mt-0.5">{session.user?.email}</p>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <Link 
                href="/settings"
                className="btn-primary text-xs font-semibold py-2 px-4 shadow-sm"
              >
                <Settings size={14} className="mr-1.5" /> Account Settings
              </Link>
              <Link 
                href="/dashboard"
                className="btn-secondary text-xs font-semibold py-2 px-4"
              >
                <Zap size={14} className="mr-1.5" /> Launch Dashboard
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
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 * i }}
            className="rounded-2xl border border-white/[0.08] bg-surface-card p-5 shadow-[var(--shadow-raised-sm)] space-y-2 hover:border-white/15 transition-all"
          >
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{stat.label}</p>
              <div className={cn("p-1.5 rounded-lg bg-surface-inset border border-white/[0.06]", stat.color)}>
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl font-black text-white tracking-tight font-mono">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Activity & Membership Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Activity Stream */}
        <section className="lg:col-span-8 rounded-3xl border border-white/[0.08] bg-surface-card p-6 sm:p-8 rounded-2xl flex flex-col min-h-[360px] shadow-[var(--shadow-raised-sm)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary-400">
                <Activity size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white tracking-wide">Recent Activity</h2>
                <p className="text-[11px] text-text-muted">Tools executed in your recent sessions</p>
              </div>
            </div>
            <Link href="/tools" className="text-xs font-semibold text-primary-400 hover:underline">
              Browse Tools
            </Link>
          </div>

          <div className="flex-1 space-y-2">
            {(statsData?.activity || []).length > 0 ? statsData.activity.slice(0, 5).map((item: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-inset hover:border-primary/30 border border-white/[0.04] transition-all group">
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-surface-card border border-white/[0.08] flex items-center justify-center text-primary-400">
                    <Zap size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-primary-300 transition-colors">{item.action || 'Tool Action'}</p>
                    <p className="text-[10px] text-text-muted">{item.tool || 'Utility'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-text-tertiary">
                    {new Date(item.last_used || Date.now()).toLocaleDateString()}
                  </span>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-white transition-colors" />
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3 text-text-muted">
                <Activity size={28} />
                <p className="text-xs">No recent activity logged yet.</p>
                <Link href="/tools" className="btn-secondary text-xs py-1.5 px-3">
                  Explore Tools
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Membership & Platform Benefits */}
        <section className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-b from-surface-elevated to-surface-card p-6 sm:p-8 rounded-2xl shadow-[var(--shadow-raised-sm)] relative overflow-hidden space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary-400" />
              <h3 className="text-sm font-bold text-white tracking-wide">Night X Pro Plan</h3>
            </div>
            
            <p className="text-xs text-text-secondary leading-relaxed">
              Unlock unlimited AI assistant generations, high-resolution batch image processing, and priority support.
            </p>
            
            <ul className="space-y-2.5">
              {[
                'Unlimited AI Assistant queries',
                'Advanced background removal',
                'High-speed batch operations',
                'Priority feature access'
              ].map((benefit) => (
                <li key={benefit} className="flex items-center gap-2.5 text-xs text-text-secondary">
                  <CheckCircle2 size={13} className="text-primary-400 shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <Link 
              href="/pricing"
              className="btn-primary w-full text-center text-xs font-semibold py-2.5 shadow-sm block"
            >
              View Pro Plans
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
