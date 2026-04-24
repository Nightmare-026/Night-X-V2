'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/ui/Toast';

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthSessionProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </NextAuthSessionProvider>
  );
}
