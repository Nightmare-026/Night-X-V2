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
  MessageSquare,
  History,
  Star,
  Shield,
  X,
  Menu
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import BrandWordmark from '@/components/ui/BrandWordmark';

interface SidebarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: Zap, label: 'All 42 Tools', href: '/tools' },
  { icon: MessageSquare, label: 'AI Workspace', href: '/dashboard/ai' },
  { icon: Shield, label: 'Security Center', href: '/security' },
];

const secondaryItems = [
  { icon: User, label: 'My Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#080A0E]/90 backdrop-blur-2xl border-b border-white/[0.08] z-50 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
          <BrandWordmark size="sm" />
        </Link>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
          aria-label="Open sidebar menu"
        >
          <Menu size={22} />
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
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      {/* Main Sidebar Aside */}
      <aside 
        className={cn(
          "fixed left-0 top-0 z-[70] h-screen w-64 border-r border-white/[0.07] bg-[#0E1118] px-4 py-6 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Sidebar Navigation"
      >
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-5 right-5 text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.08]"
          aria-label="Close sidebar menu"
        >
          <X size={20} />
        </button>

        {/* Brand Wordmark */}
        <div className="mb-8 px-2">
          <Link href="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
            <BrandWordmark size="md" />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-6 overflow-y-auto no-scrollbar pb-6">
          {/* Main Navigation Group */}
          <div className="space-y-1">
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
              Workspace
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href.includes('?') && pathname === item.href.split('?')[0]);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all text-xs font-medium relative focus-visible:ring-2 focus-visible:ring-primary outline-none",
                    isActive 
                      ? "bg-primary/15 text-primary-300 font-bold border border-primary/30 shadow-[var(--shadow-raised-sm)]" 
                      : "text-text-secondary hover:bg-white/[0.05] hover:text-white border border-transparent"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-pill"
                      className="absolute left-0 w-[3px] h-3/5 bg-primary rounded-r-full"
                    />
                  )}
                  <item.icon size={17} className={cn("transition-colors shrink-0", isActive ? "text-primary-400" : "text-text-muted group-hover:text-white")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Preferences Group */}
          <div className="space-y-1">
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
              Account
            </div>
            {secondaryItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all text-xs font-medium relative focus-visible:ring-2 focus-visible:ring-primary outline-none",
                    isActive 
                      ? "bg-primary/15 text-primary-300 font-bold border border-primary/30" 
                      : "text-text-secondary hover:bg-white/[0.05] hover:text-white border border-transparent"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={17} className={cn("transition-colors shrink-0", isActive ? "text-primary-400" : "text-text-muted group-hover:text-white")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Profile & Sign Out Footer */}
        <div className="mt-auto pt-4 border-t border-white/[0.08] space-y-3">
          <Link 
            href="/profile" 
            onClick={() => setIsOpen(false)}
            className="p-2.5 rounded-xl bg-surface-inset border border-white/[0.06] hover:border-primary/30 transition-all flex items-center gap-3 group outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-[var(--shadow-inset-sm)]"
          >
            <div className="relative">
              <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-400 font-bold text-xs">
                {user?.image ? (
                  <img src={user.image} alt={user.name || 'User'} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <span>{user?.name?.[0] || 'U'}</span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0E1118] rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-white group-hover:text-primary-300 transition-colors">{user?.name || 'User Account'}</p>
              <p className="truncate text-[10px] text-text-muted">{user?.email || 'Logged in'}</p>
            </div>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center justify-center gap-2 rounded-xl h-10 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
