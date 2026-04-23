import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ToolGrid from '@/components/dashboard/ToolGrid';
import AIChat from '@/components/dashboard/AIChat';
import DashboardClient from '@/components/dashboard/DashboardClient';
import { ToastProvider } from '@/components/ui/Toast';

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
    <ToastProvider>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow container mx-auto px-4 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-syne font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
              Welcome back, {session.user?.name?.split(' ')[0]}
            </h1>
            <p className="text-white/60 text-lg max-w-2xl font-dm-sans">
              Explore the Night X dashboard, search across tools, and open the features that fit your workflow.
            </p>
          </div>

          <DashboardClient>
            <Suspense fallback={<ToolGridSkeleton />}>
              <ToolGrid />
            </Suspense>
          </DashboardClient>
        </main>

        <Suspense fallback={null}>
          <AIChat />
        </Suspense>
      </div>
    </ToastProvider>
  );
}
