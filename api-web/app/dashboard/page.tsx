'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user) {
      // Redirect to role-specific dashboard
      const role = (session.user as any).role;

      if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else if (role === 'STAFF') {
        router.push('/staff/dashboard');
      } else if (role === 'CUSTOMER') {
        router.push('/customer/dashboard');
      } else {
        // Fallback for unknown roles
        router.push('/customer/dashboard');
      }
    }
  }, [status, session, router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
