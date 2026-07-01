'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Wrench,
  Shield,
  LifeBuoy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSearch } from '@/components/providers/SearchProvider';

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { openSearch } = useSearch();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Tools', href: '/dashboard?tab=all' },
    { name: 'AI Features', href: '/dashboard?category=ai' },
    { name: 'Support', href: '/support' },
  ];

  // Don't show header on auth pages or dashboard sub-pages if requested, 
  // but the spec says "Navbar" should be there. I'll keep it visible unless it's a specific full-screen tool.
  const isAuthPage = pathname?.startsWith('/auth');
  if (isAuthPage) return null;

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-[1000] h-16 transition-all duration-300 glass-navbar",
        isScrolled ? "bg-background/95 border-b-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "bg-background/80"
      )}
    >
      <div className="max-w-[1280px] mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-[28px] h-[28px] rounded-lg bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(139,92,246,0.4)]">
            N
          </div>
          <span className="text-[1.25rem] font-bold bg-gradient-to-r from-primary to-accent-cyan bg-clip-text text-transparent tracking-[-0.02em]">
            Night X
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "px-[14px] py-2 rounded-lg text-[0.875rem] font-medium transition-all duration-200",
                pathname === link.href 
                  ? "text-primary-400 bg-primary/12" 
                  : "text-white/65 hover:text-white hover:bg-white/6"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search Bar */}
          <div className="relative hidden sm:block">
            <button 
              onClick={openSearch}
              className="flex items-center gap-2 px-[14px] py-2 bg-white/5 border border-white/8 rounded-lg group transition-all duration-200 hover:bg-white/8 focus-within:border-primary/50 focus-within:shadow-[0_0_0_2px_rgba(139,92,246,0.15)] w-[220px] lg:focus-within:w-[280px]"
            >
              <Search className="w-4 h-4 text-white/30 group-hover:text-white/40" />
              <span className="text-[0.875rem] text-white/30 group-hover:text-white/40 flex-1 text-left">Search tools...</span>
              <span className="px-1.5 py-0.5 rounded-[4px] border border-white/10 bg-white/6 text-[0.7rem] text-white/40 font-mono">⌘K</span>
            </button>
          </div>

          {status === 'authenticated' ? (
            <div className="relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 pr-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center text-primary-400 font-bold text-xs">
                  {session.user?.name?.[0] || 'U'}
                </div>
                <ChevronDown className={cn("w-4 h-4 text-text-muted transition-transform", isProfileOpen && "rotate-180")} />
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 glass-modal rounded-xl overflow-hidden p-1 shadow-2xl z-50 bg-[#16161F]/95 backdrop-blur-[40px]"
                  >
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-semibold text-text-primary truncate">{session.user?.name}</p>
                      <p className="text-xs text-text-tertiary truncate">{session.user?.email}</p>
                    </div>
                    <div className="p-1">
                      <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors">
                        <Settings className="w-4 h-4" /> Settings
                      </Link>
                      <button 
                        onClick={() => signOut()}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-accent-pink hover:bg-accent-pink/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-3">
              <Link href="/auth/signin" className="px-4 py-2 text-[0.875rem] font-medium text-white/70 border border-white/10 rounded-lg hover:bg-white/6 hover:text-white hover:border-white/20 transition-all duration-200">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-primary px-5 py-2 text-[0.875rem] font-semibold shadow-[0_0_15px_rgba(139,92,246,0.35)] hover:shadow-[0_0_25px_rgba(139,92,246,0.55)]">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-modal border-b border-white/5 overflow-hidden"
          >
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-text-secondary hover:text-text-primary"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/5" />
              {status === 'authenticated' ? (
                <button 
                  onClick={() => signOut()}
                  className="flex items-center gap-3 text-lg font-medium text-accent-pink"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link href="/auth/signin" className="btn-secondary w-full" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                  <Link href="/auth/signup" className="btn-primary w-full" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

