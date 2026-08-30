'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Settings, 
  User, 
  LogOut, 
  Wrench, 
  Bot,
  History,
  Star,
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
  { icon: Wrench, label: 'All 42 Tools', href: '/tools' },
  { icon: Bot, label: 'AI Workspace', href: '/dashboard/ai' },
  { icon: Star, label: 'Favorites', href: '/dashboard/favorites' },
  { icon: History, label: 'Execution History', href: '/dashboard/history' },
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
      {/* Mobile Top Header Bar for Protected Routes */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#080A0E]/90 backdrop-blur-2xl border-b border-white/[0.08] z-50 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
          <BrandWordmark size="sm" />
        </Link>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
          aria-label="Open sidebar navigation"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
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
          "fixed left-0 top-0 z-[70] h-screen w-64 border-r border-white/[0.07] bg-[#0E1118] px-4 py-5 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Workspace Sidebar Navigation"
      >
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/[0.08]"
          aria-label="Close sidebar menu"
        >
          <X size={18} />
        </button>

        {/* Brand Wordmark */}
        <div className="mb-7 px-2">
          <Link href="/" className="inline-block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
            <BrandWordmark size="md" />
          </Link>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 space-y-5 overflow-y-auto no-scrollbar pb-4">
          {/* Main Workspace Navigation */}
          <div className="space-y-1">
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
              Workspace
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2 transition-all text-xs font-medium relative focus-visible:ring-2 focus-visible:ring-primary outline-none",
                    isActive 
                      ? "bg-primary/15 text-primary font-bold border border-primary/30 shadow-sm" 
                      : "text-text-secondary hover:bg-white/[0.05] hover:text-white border border-transparent"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-sidebar-pill"
                      className="absolute left-0 w-[3px] h-3/5 bg-primary rounded-r-full"
                    />
                  )}
                  <item.icon size={16} className={cn("transition-colors shrink-0", isActive ? "text-primary" : "text-text-muted group-hover:text-white")} />
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
                    "group flex items-center gap-3 rounded-xl px-3 py-2 transition-all text-xs font-medium relative focus-visible:ring-2 focus-visible:ring-primary outline-none",
                    isActive 
                      ? "bg-primary/15 text-primary font-bold border border-primary/30" 
                      : "text-text-secondary hover:bg-white/[0.05] hover:text-white border border-transparent"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon size={16} className={cn("transition-colors shrink-0", isActive ? "text-primary" : "text-text-muted group-hover:text-white")} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User Identity & Sign Out Footer */}
        <div className="mt-auto pt-4 border-t border-white/[0.08] space-y-2.5">
          <Link 
            href="/profile" 
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-xl bg-surface-inset border border-white/[0.06] hover:border-primary/30 transition-all flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-primary shadow-inner"
          >
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">
                {user?.image ? (
                  <img src={user.image} alt={user.name || 'User'} className="h-full w-full object-cover rounded-lg" />
                ) : (
                  <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-[#0E1118] rounded-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-white group-hover:text-primary transition-colors">{user?.name || 'User Account'}</p>
              <p className="truncate text-[10px] text-text-muted">{user?.email || 'Logged in'}</p>
            </div>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center justify-center gap-2 rounded-xl h-9 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold hover:bg-red-500 hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-red-500 outline-none"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
