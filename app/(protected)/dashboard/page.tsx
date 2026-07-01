import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ToolGrid from '@/components/dashboard/ToolGrid';
import AIChat from '@/components/dashboard/AIChat';
import DashboardClient from '@/components/dashboard/DashboardClient';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';


export const metadata: Metadata = {
  title: 'Dashboard | Night X',
  description: 'Your private Night X dashboard for tools, search, and AI-assisted workflows.',
  robots: 'noindex, nofollow',
};

function ToolGridSkeleton() {
  return (
    <div className="w-full">
      <div className="h-10 w-64 bg-white/5 animate-pulse rounded-full mb-8" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="glass-card h-64 w-full animate-pulse opacity-50" />
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

  return (
    <main className="flex-grow p-6 lg:p-10">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-outfit font-bold text-white tracking-tight mb-2">
            Welcome back, {session.user?.name?.split(' ')[0]}
          </h1>
          <p className="text-white/40 text-sm font-inter">
            Explore your tools and AI assisted workflows.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden md:flex h-10 items-center gap-2 rounded-md border border-white/[0.05] bg-white/[0.02] px-3 text-xs text-white/30">
            <span className="flex h-2 w-2 rounded-full bg-green-500" />
            System Online
          </div>
        </div>
      </header>

      <Suspense fallback={null}>
        <div className="mb-8">
          <WelcomeBanner />
        </div>
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
