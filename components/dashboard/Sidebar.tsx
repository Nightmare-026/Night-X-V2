'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  User, 
  LogOut, 
  Zap, 
  Search,
  MessageSquare,
  History,
  Star,
  ExternalLink,
  ChevronRight,
  Shield,
  Cpu,
  Monitor,
  X,
  Menu,
  Fingerprint,
  Activity
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard', desc: 'System Core' },
  { icon: Zap, label: 'All Tools', href: '/dashboard?category=all', desc: 'Utility Matrix' },
  { icon: Star, label: 'Favorites', href: '/dashboard/favorites', desc: 'Priority Buffers' },
  { icon: History, label: 'History', href: '/dashboard/history', desc: 'Process Logs' },
  { icon: MessageSquare, label: 'Neural Chat', href: '/dashboard/ai', desc: 'AI Interface' },
];

const secondaryItems = [
  { icon: User, label: 'Identity', href: '/profile', desc: 'Agent Profile' },
  { icon: Settings, label: 'Parameters', href: '/settings', desc: 'System Config' },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // For mobile

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/[0.05] z-50 px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-violet-500 fill-violet-500" />
          <span className="text-sm font-black tracking-tighter text-white uppercase">Night<span className="text-violet-500">X</span></span>
        </Link>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-white/40 hover:text-white"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Component */}
      <aside className={cn(
        "fixed left-0 top-0 z-[70] h-screen w-64 border-r border-white/[0.05] bg-[#030303] px-4 py-8 flex flex-col transition-transform duration-500 ease-in-out lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        {/* Branding Hub */}
        <div className="mb-12 px-2">
          <Link href="/" className="group flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black border border-white/10 rounded-md flex items-center justify-center shadow-lg group-hover:border-violet-500/50 transition-all">
                <Zap className="h-4 w-4 text-violet-500 fill-violet-500" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase font-outfit">
                Night<span className="text-violet-500">X</span>
              </span>
            </div>
            <p className="text-[8px] font-bold text-white/10 uppercase tracking-[0.4em] ml-11 italic">Sovereign_OS</p>
          </Link>
        </div>

        {/* Navigation Manifest */}
        <nav className="flex-1 space-y-8 overflow-y-auto no-scrollbar pb-8">
          {/* Section: Core */}
          <div className="space-y-1">
            <div className="px-3 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center justify-between">
              <span>Main_Matrix</span>
              <Activity size={10} className="opacity-50" />
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-3 transition-all relative overflow-hidden",
                    isActive 
                      ? "bg-violet-600/10 border border-violet-600/20 text-white shadow-[inset_0_0_20px_rgba(139,92,246,0.05)]" 
                      : "text-white/40 hover:bg-white/[0.02] hover:text-white/60 border border-transparent"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill"
                      className="absolute left-0 w-[2px] h-1/2 bg-violet-500 rounded-full"
                    />
                  )}
                  <item.icon size={18} className={cn("transition-colors shrink-0", isActive ? "text-violet-500" : "text-white/20 group-hover:text-white/40")} />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-widest leading-none">{item.label}</span>
                    <span className="text-[7px] font-mono uppercase tracking-tighter text-white/10 mt-1.5">{item.desc}</span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Section: Secondary */}
          <div className="space-y-1">
            <div className="px-3 mb-4 text-[9px] font-black uppercase tracking-[0.2em] text-white/20 flex items-center justify-between">
              <span>Agent_Parameters</span>
              <Shield size={10} className="opacity-50" />
            </div>
            {secondaryItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-md px-3 py-3 transition-all relative overflow-hidden",
                    isActive 
                      ? "bg-cyan-600/10 border border-cyan-600/20 text-white shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]" 
                      : "text-white/40 hover:bg-white/[0.02] hover:text-white/60 border border-transparent"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-pill-sec"
                      className="absolute left-0 w-[2px] h-1/2 bg-cyan-500 rounded-full"
                    />
                  )}
                  <item.icon size={18} className={cn("transition-colors shrink-0", isActive ? "text-cyan-500" : "text-white/20 group-hover:text-white/40")} />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold uppercase tracking-widest leading-none">{item.label}</span>
                    <span className="text-[7px] font-mono uppercase tracking-tighter text-white/10 mt-1.5">{item.desc}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Agent Profile Footer */}
        <div className="mt-auto pt-6 border-t border-white/[0.03] space-y-4">
          <div className="p-3 rounded-md bg-white/[0.01] border border-white/[0.03] flex items-center gap-3 group/profile">
            <div className="relative">
              <div className="w-10 h-10 rounded-md border border-white/10 p-0.5 bg-black/40 overflow-hidden relative z-10">
                {user?.image ? (
                  <img src={user.image} alt={user.name || 'Agent'} className="h-full w-full object-cover rounded-md opacity-80 group-hover/profile:opacity-100 transition-opacity" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white/20">
                    <Fingerprint size={18} strokeWidth={1} />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-[#030303] rounded-full z-20 shadow-lg" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-[11px] font-bold text-white tracking-wide uppercase">{user?.name || 'Authorized Agent'}</p>
              <p className="truncate text-[9px] font-mono text-white/20 uppercase tracking-tighter mt-0.5">{user?.email || 'telemetry_node'}</p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="group flex w-full items-center justify-center gap-3 rounded-md h-12 bg-red-500/5 border border-red-500/10 text-red-500/40 transition-all hover:bg-red-500 hover:text-white hover:border-red-500"
          >
            <LogOut size={16} className="transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Terminate</span>
          </button>
        </div>
      </aside>
    </>
  );
}
