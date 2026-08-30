'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Menu, 
  X, 
  ChevronDown, 
  LogOut, 
  User, 
  LayoutDashboard, 
  Settings,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearch } from '@/components/providers/SearchProvider';
import BrandWordmark from '@/components/ui/BrandWordmark';
import { CATEGORIES } from '@/lib/tools-registry';

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { openSearch } = useSearch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(navigator.userAgent.toUpperCase().indexOf('MAC') >= 0);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsProfileOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tools', href: '/tools' },
    { name: 'About', href: '/about' },
    ...(status === 'authenticated' ? [{ name: 'Dashboard', href: '/dashboard' }] : []),
  ];

  const isAuthPage = pathname?.startsWith('/auth');
  if (isAuthPage) return null;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[1000] h-16 transition-all duration-200 glass-navbar",
        isScrolled 
          ? "bg-[#080A0E]/95 border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.7)]" 
          : "bg-[#080A0E]/80 border-b border-white/[0.04]"
      )}
      role="banner"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <Link 
          href="/" 
          className="outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg transition-transform hover:scale-[1.02] shrink-0"
          aria-label="Night X Home"
        >
          <BrandWordmark size="md" />
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {navLinks.map((link) => {
            const isActive = link.href === '/' 
              ? pathname === '/' 
              : pathname === link.href || pathname?.startsWith(link.href + '/');
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary outline-none",
                  isActive 
                    ? "text-primary bg-primary/12 font-bold border border-primary/20 shadow-sm" 
                    : "text-text-secondary hover:text-white hover:bg-white/[0.05]"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Trigger */}
          <button 
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 sm:py-2 bg-surface-card border border-white/[0.08] rounded-xl group transition-all duration-150 hover:bg-surface-hover hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary outline-none w-[130px] sm:w-[180px] lg:w-[210px] shadow-[var(--shadow-raised-sm)]"
            aria-label="Open search dialog"
          >
            <Search className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors shrink-0" />
            <span className="text-xs text-text-muted group-hover:text-text-secondary flex-1 text-left truncate transition-colors">Search tools...</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.06] text-[10px] text-text-muted font-mono font-semibold">
              {isMac ? '⌘K' : 'Ctrl K'}
            </kbd>
          </button>

          {/* User Authentication Status */}
          {status === 'authenticated' && session?.user ? (
            <div className="relative" ref={profileDropdownRef}>
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-2 rounded-xl border border-white/[0.08] bg-surface-card hover:bg-surface-hover transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none shadow-[var(--shadow-raised-sm)]"
                aria-label="User account menu"
                aria-expanded={isProfileOpen}
                aria-haspopup="true"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs shadow-inner">
                  {session.user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="hidden lg:block text-xs font-semibold text-white/90 max-w-[100px] truncate">
                  {session.user.name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown className={cn("w-3.5 h-3.5 text-text-muted transition-transform duration-200", isProfileOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 rounded-2xl overflow-hidden p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] z-50 bg-[#0E1118] border border-white/10 backdrop-blur-2xl"
                    role="menu"
                  >
                    <div className="px-3.5 py-2.5 border-b border-white/[0.08] mb-1">
                      <p className="text-xs font-bold text-white truncate">{session.user.name}</p>
                      <p className="text-[11px] text-text-muted truncate mt-0.5">{session.user.email}</p>
                    </div>
                    <div className="space-y-0.5">
                      <Link 
                        href="/dashboard" 
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
                        role="menuitem"
                      >
                        <LayoutDashboard size={14} className="text-primary" />
                        <span>Workspace Overview</span>
                      </Link>
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
                        role="menuitem"
                      >
                        <User size={14} className="text-accent-cyan" />
                        <span>My Profile</span>
                      </Link>
                      <Link 
                        href="/settings" 
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-secondary hover:text-white hover:bg-white/[0.06] rounded-xl transition-colors"
                        role="menuitem"
                      >
                        <Settings size={14} className="text-accent-orange" />
                        <span>Settings</span>
                      </Link>
                    </div>
                    <div className="border-t border-white/[0.08] mt-1 pt-1">
                      <button 
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                        role="menuitem"
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link 
                href="/auth/signin" 
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-white hover:bg-white/[0.06] transition-all"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="btn-primary text-xs py-1.5 px-3.5 shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-white/[0.08] bg-surface-card text-text-secondary hover:text-white hover:bg-surface-hover transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-navigation-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#080A0E]/98 border-b border-white/10 px-4 py-5 overflow-hidden shadow-2xl backdrop-blur-2xl"
          >
            <nav className="flex flex-col space-y-1 mb-5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all",
                    pathname === link.href 
                      ? "bg-primary/15 text-primary border border-primary/25 font-bold" 
                      : "text-text-secondary hover:text-white hover:bg-white/[0.04]"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Category Quick Links */}
            <div className="pt-4 border-t border-white/[0.08] mb-5">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-2.5 px-1">Tool Ecosystems</p>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/tools?category=${cat.id}`}
                    className="px-3 py-2 rounded-lg bg-surface-card border border-white/[0.05] text-xs text-text-secondary hover:text-white hover:border-primary/30 flex items-center justify-between"
                  >
                    <span>{cat.label}</span>
                    <ArrowRight size={12} className="text-text-muted" />
                  </Link>
                ))}
              </div>
            </div>

            {status !== 'authenticated' && (
              <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
                <Link 
                  href="/auth/signin"
                  className="btn-secondary w-full text-center text-xs py-2"
                >
                  Sign In
                </Link>
                <Link 
                  href="/auth/signup"
                  className="btn-primary w-full text-center text-xs py-2"
                >
                  Create Free Account
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
