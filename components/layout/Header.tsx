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
import SearchModal from '@/components/SearchModal';
import styles from './Header.module.css';

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('tool-search', { detail: searchQuery }));
    }, 300);

    return () => window.clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const handleSearchReset = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSearchQuery(customEvent.detail || '');
    };

    window.addEventListener('tool-search-sync', handleSearchReset as EventListener);
    return () => window.removeEventListener('tool-search-sync', handleSearchReset as EventListener);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(false);
  }, [pathname]);

  if (pathname?.startsWith('/auth')) return null;

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard', protected: true },
    { name: 'Tools', href: '/tools' },
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
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#06080F]/85 backdrop-blur-[20px]">
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

          <div className="relative mx-8 hidden max-w-[240px] flex-1 md:flex">
            <button
              onClick={() => setIsSearchModalOpen(true)}
              className="flex w-full items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/40 transition-all hover:bg-white/10 hover:border-white/20"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Protocol Search...</span>
              </div>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px]">
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
                  <div className={styles['profile-avatar']}>
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User avatar'}
                        width={32}
                        height={32}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="h-full w-full p-1 text-white" />
                    )}
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
            className="p-2 text-white/70 md:hidden"
            onClick={() => setIsMobileMenuOpen((value) => !value)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
          </button>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={styles['mobile-overlay']}
            >
              <div className="mb-8">
                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 px-4 py-3" role="search">
                  <Search className="mr-3 h-5 w-5 text-white/40" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Search tools..."
                    className="w-full border-none bg-transparent text-white outline-none"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />
                </div>
              </div>

              <nav className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-2xl font-semibold text-white/70 transition-colors hover:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col gap-4 border-t border-white/10 pt-8">
                {status === 'authenticated' ? (
                  <>
                    <div className="mb-4 flex items-center gap-4">
                      <div className={styles['profile-avatar']}>
                        {session.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name || 'User avatar'}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                            unoptimized
                          />
                        ) : (
                          <User className="h-full w-full p-1 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{session.user?.name}</p>
                        <p className="text-sm text-white/40">{session.user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center justify-center gap-3 rounded-xl bg-red-500/10 py-4 font-medium text-red-400"
                    >
                      <LogOut className="h-5 w-5" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" className="flex w-full items-center justify-center rounded-xl bg-white/5 py-4 font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                    <Link href="/auth/signup" className="flex w-full items-center justify-center rounded-xl bg-accent-purple py-4 font-medium text-white shadow-lg shadow-accent-purple/20" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={() => setIsSearchModalOpen(false)} 
      />
    </>
  );
}
