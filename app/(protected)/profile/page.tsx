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
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session) return null; // Middleware handles this, but safety first

  const stats = [
    { label: 'Security Level', value: 'Alpha-04', icon: <Shield size={18} />, color: 'text-accent-cyan' },
    { label: 'Tools Used', value: '12', icon: <Zap size={18} />, color: 'text-accent-purple' },
    { label: 'Agent Status', value: 'Verified', icon: <Trophy size={18} />, color: 'text-accent-gold' },
    { label: 'Session Time', value: '2h 15m', icon: <Clock size={18} />, color: 'text-accent-pink' },
  ];

  return (
    <div className="container mx-auto px-4 py-20 lg:px-8 max-w-5xl">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-end mb-12">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden border-4 border-white/10 ring-8 ring-accent-purple/5 shadow-2xl">
            {session.user?.image ? (
              <Image 
                src={session.user.image} 
                alt={session.user.name || 'Agent'} 
                width={160} 
                height={160}
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full bg-accent-purple/20 flex items-center justify-center text-accent-purple">
                <User size={64} />
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-accent-purple rounded-2xl flex items-center justify-center shadow-lg border-4 border-[#0a0a0f]">
            <Zap size={16} className="text-white fill-white" />
          </div>
        </motion.div>

        <div className="text-center md:text-left space-y-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-accent-purple text-xs font-bold tracking-[0.2em] uppercase mb-1">Authenticated Agent</p>
            <h1 className="text-4xl md:text-5xl font-syne font-bold text-white tracking-tight">
              {session.user?.name}
            </h1>
            <p className="text-white/40 font-dm-sans">{session.user?.email}</p>
          </motion.div>
        </div>

        <div className="md:ml-auto flex gap-3">
          <Link 
            href="/settings"
            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all"
          >
            <Settings size={18} />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="glass-card p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-all group"
          >
            <div className={`mb-4 p-2 rounded-xl bg-white/5 w-fit ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-syne font-bold text-white mb-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</p>
            <p className="text-xs text-white/30 uppercase tracking-widest font-bold">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Activity Feed / Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 glass-card p-8 rounded-[2rem] border border-white/5"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-syne font-bold text-white flex items-center gap-3">
              <Activity className="text-accent-cyan" size={20} />
              Recent Activity
            </h3>
            <span className="text-xs text-white/30 font-mono">Last 7 Days</span>
          </div>

          <div className="space-y-6">
            {[
              { action: 'Optimized 4 images', tool: 'Image Compressor', time: '2 hours ago' },
              { action: 'Generated 12 passwords', tool: 'Strong Password', time: 'Yesterday' },
              { action: 'Converted PDF to JPG', tool: 'PDF to Image', time: '2 days ago' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:bg-accent-purple/20 group-hover:text-accent-purple transition-all">
                    <Zap size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{item.action}</p>
                    <p className="text-xs text-white/30">{item.tool}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-white/20 font-mono">{item.time}</p>
                  <ArrowRight size={14} className="ml-auto mt-1 text-white/0 group-hover:text-accent-purple transition-all -translate-x-2 group-hover:translate-x-0" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="glass-card p-8 rounded-[2rem] border border-white/5 bg-gradient-to-br from-accent-purple/5 to-transparent"
        >
          <h3 className="text-xl font-syne font-bold text-white mb-6">Upgrade to Pro</h3>
          <p className="text-white/50 text-sm mb-8 leading-relaxed">
            Get unlimited access to AI tools, advanced video processing, and secure cloud storage for your results.
          </p>
          <ul className="space-y-4 mb-8">
            {['Unlimited AI Usage', 'Priority Processing', 'Custom Branding', 'Advanced Analytics'].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-xs text-white/70">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-purple" />
                {feature}
              </li>
            ))}
          </ul>
          <Link 
            href="/settings?tab=billing"
            className="block w-full py-4 bg-accent-purple hover:bg-accent-purple/80 text-white text-center font-bold rounded-2xl transition-all shadow-lg shadow-accent-purple/20"
          >
            Go Pro
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
