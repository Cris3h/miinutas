'use client';

import { useEffect } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  useEffect(() => {
    if (pathname === '/admin/login') return;
    if (!hasHydrated) return;

    if (!isAuthenticated) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, pathname, router, hasHydrated]);

  if (pathname === '/admin/login') {
    return <div className="min-h-screen bg-dark-900">{children}</div>;
  }

  if (!hasHydrated || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <AdminNav />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
