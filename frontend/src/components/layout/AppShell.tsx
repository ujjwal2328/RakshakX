'use client';

import React, { type ReactNode } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function AppShell({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Login page — no shell
  if (pathname === '/login' || pathname === '/') {
    return <>{children}</>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.replace('/login');
    }
    return null;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <TopBar />
        <div className="app-content">
          {children}
        </div>
      </main>
    </div>
  );
}
