import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ToolGrid from '@/components/dashboard/ToolGrid';
import AIChat from '@/components/dashboard/AIChat';
import DashboardClient from '@/components/dashboard/DashboardClient';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';

export const metadata: Metadata = {
  title: 'Workspace Dashboard | Night X',
  description: 'Your private Night X dashboard for tools, execution history, and AI workflows.',
  robots: 'noindex, nofollow',
};

function ToolGridSkeleton() {
  return (
    <div className="w-full space-y-6">
      <div className="h-9 w-64 bg-white/5 animate-pulse rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-44 rounded-2xl bg-surface-card border border-white/[0.06] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  const firstName = session.user?.name?.split(' ')[0] || 'User';

  return (
    <main className="flex-grow p-5 sm:p-8 lg:p-10 space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/[0.06]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Welcome back, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-text-tertiary mt-1">
            Access your 42 in-browser utilities, saved favorites, and AI assistant.
          </p>
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-card border border-white/[0.06] text-xs text-text-muted w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Local Engine Ready</span>
        </div>
      </header>

      <Suspense fallback={null}>
        <WelcomeBanner />
      </Suspense>

      <DashboardClient>
        <Suspense fallback={<ToolGridSkeleton />}>
          <ToolGrid />
        </Suspense>
      </DashboardClient>

      <Suspense fallback={null}>
        <AIChat />
      </Suspense>
    </main>
  );
}
