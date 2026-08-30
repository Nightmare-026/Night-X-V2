import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="flex min-h-screen bg-[#080A0E] text-white">
      <Sidebar user={session.user} />
      <div className="flex-1 lg:pl-64 pt-16 lg:pt-0 min-w-0">
        {children}
      </div>
    </div>
  );
}
