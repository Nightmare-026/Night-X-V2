'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, LogOut, Menu, Search, User, X, Zap, Command, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import AnnouncementBanner from '@/components/ui/AnnouncementBanner';
import { useSearch } from '@/components/providers/SearchProvider';
import styles from './Header.module.css';

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openSearch } = useSearch();
  const profileRef = useRef<HTMLDivElement>(null);

  // Search state is now handled globally via SearchProvider

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cmd+K listener is now handled in SearchProvider

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  // Body scroll lock
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Scroll height for header shimmer
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname?.startsWith('/auth')) return null;

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', protected: true },
    { name: 'Tools', href: '/services' },
    { name: 'AI Features', href: '/dashboard?category=ai' },
    { name: 'Support', href: '/support' },
  ];

  return (
    <>
      <AnnouncementBanner
        message="AI Bio Generator is now available"
        linkText="Try it now"
        link="/tools/ai-bio-generator"
      />
      <header className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled 
          ? "border-white/10 bg-[#06080F]/80 backdrop-blur-[20px] py-2" 
          : "border-transparent bg-transparent py-4"
      )}>
        {scrolled && (
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-1px] left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-accent-cyan/30 to-transparent"
          />
        )}
        <div className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="rounded-lg bg-accent-purple/20 p-1.5 transition-colors group-hover:bg-accent-purple/30">
              <Zap className="h-6 w-6 fill-accent-purple/20 text-accent-purple" />
            </div>
            <span className={cn('text-2xl font-bold font-syne tracking-tight', styles['logo-gradient'])}>
              Night X
            </span>
          </Link>

          <nav className="ml-8 hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-white/70 transition-colors hover:text-white">
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="relative mx-4 hidden max-w-[300px] flex-1 md:flex">
            <button
              onClick={openSearch}
              className="group flex w-full items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/40 transition-all hover:bg-white/10 hover:border-white/20"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Search 40+ tools...</span>
                <span className="lg:hidden">Search...</span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-white/10 bg-white/10 text-[10px] font-bold text-white/60">
                <Command size={10} />
                <span>K</span>
              </div>
            </button>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {status === 'authenticated' ? (
              <div className="relative" ref={profileRef}>
                <button
                  aria-label="User profile menu"
                  aria-expanded={isProfileOpen}
                  onClick={() => setIsProfileOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 pl-2 transition-colors hover:bg-white/10"
                >
                  <div className={cn(styles['profile-avatar'], "bg-accent-purple/20 flex items-center justify-center overflow-hidden")}>
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User avatar'}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement?.classList.add('fallback-active');
                        }}
                      />
                    ) : null}
                    <span className="fallback-initials text-[10px] font-bold text-accent-purple hidden [.fallback-active_&]:block [div:not(:has(img))_&]:block">
                      {import('@/lib/utils').then(u => u.getInitials(session.user?.name || '')) && session.user?.name ? 
                        session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                    </span>
                  </div>
                  <ChevronDown className={cn('h-4 w-4 text-white/40 transition-transform', isProfileOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 z-[100] mt-2 w-64 overflow-hidden border border-white/10 shadow-2xl glass-card"
                    >
                      <div className="bg-white/5 p-4">
                        <p className="truncate text-sm font-semibold text-white">{session.user?.name}</p>
                        <p className="truncate text-xs text-white/40">{session.user?.email}</p>
                      </div>
                      <div className="border-t border-white/5 p-2">
                        <button
                          onClick={() => {
                            router.push('/profile');
                            setIsProfileOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <User className="h-4 w-4" /> Profile
                        </button>
                        <button
                          onClick={() => {
                            router.push('/dashboard');
                            setIsProfileOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <Zap className="h-4 w-4" /> Dashboard
                        </button>
                        <button
                          onClick={() => {
                            router.push('/settings');
                            setIsProfileOpen(false);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                        >
                          <Settings size={14} className="h-4 w-4" /> Settings
                        </button>
                      </div>
                      <div className="border-t border-white/5 p-2">
                        <button
                          onClick={() => signOut()}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                        >
                          <LogOut className="h-4 w-4" /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/auth/signin" className="px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white">
                  Sign In
                </Link>
                <Link href="/auth/signup" className="rounded-full bg-accent-purple px-5 py-2 text-sm font-medium text-white shadow-lg shadow-accent-purple/20 transition-all hover:bg-accent-purple/90">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
            className="p-4 text-white/70 md:hidden relative z-[210]"
            onClick={() => setIsMobileMenuOpen((value) => !value)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              className={cn(
                "fixed inset-0 z-[200] flex flex-col bg-[#06080F] px-8 pt-24 pb-12 overflow-y-auto",
                styles['mobile-menu-container']
              )}
            >
              {/* Internal Close Button for Mobile Drawer */}
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 text-white/60 hover:text-white border border-white/10"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="mb-10">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openSearch();
                  }}
                  className="flex w-full items-center rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition-all hover:bg-white/10"
                >
                  <Search className="mr-3 h-5 w-5 text-white/40" aria-hidden="true" />
                  <span className="text-lg text-white/20">Search 40+ tools...</span>
                </button>
              </div>

              <nav className="flex flex-col gap-6 mb-12">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "text-3xl font-bold transition-all duration-300",
                        isActive ? "text-accent-cyan translate-x-2" : "text-white/60 hover:text-white"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-4">
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(0,229,255,0.8)]" />}
                        {link.name}
                      </div>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-10">
                {status === 'authenticated' ? (
                  <>
                    <div className="mb-6 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <div className={cn(styles['profile-avatar'], "w-12 h-12 bg-accent-purple/20 flex items-center justify-center overflow-hidden")}>
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || 'User avatar'}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover"
                            unoptimized
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.parentElement?.classList.add('fallback-active-mobile');
                            }}
                          />
                        ) : null}
                        <span className="fallback-initials text-xs font-bold text-accent-purple hidden [.fallback-active-mobile_&]:block [div:not(:has(img))_&]:block">
                          {session.user?.name ? 
                            session.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                        </span>
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-white truncate text-base">{session.user?.name}</p>
                        <p className="text-xs text-white/40 truncate">{session.user?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <button
                        onClick={() => {
                          router.push('/dashboard');
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-white/5 py-4 font-bold text-white border border-white/10"
                      >
                        <Zap size={18} /> Hub
                      </button>
                      <button
                        onClick={() => {
                          router.push('/settings');
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 rounded-xl bg-white/5 py-4 font-bold text-white border border-white/10"
                      >
                        <Settings size={18} /> Settings
                      </button>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500/10 py-5 font-bold text-red-400 border border-red-500/20"
                    >
                      <LogOut className="h-5 w-5" /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-4">
                    <Link 
                      href="/auth/signin" 
                      className="flex w-full items-center justify-center rounded-2xl bg-white/5 py-5 text-lg font-bold text-white border border-white/10" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      href="/auth/signup" 
                      className="flex w-full items-center justify-center rounded-2xl bg-accent-purple py-5 text-lg font-bold text-white shadow-2xl shadow-accent-purple/20" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up Now
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  </>
);
}
