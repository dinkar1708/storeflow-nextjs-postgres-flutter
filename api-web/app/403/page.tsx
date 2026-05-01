'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function ForbiddenPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleGoBack = () => {
    // Redirect to role-specific dashboard
    const role = (session?.user as any)?.role;

    if (role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else if (role === 'STAFF') {
      router.push('/staff/dashboard');
    } else if (role === 'CUSTOMER') {
      router.push('/customer/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <svg
            className="h-10 w-10 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">403 Forbidden</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to access this page. This area is restricted to specific user roles.
        </p>

        {session?.user && (
          <div className="bg-gray-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              Your current role: <strong>{(session.user as any).role}</strong>
            </p>
          </div>
        )}

        <div className="flex flex-col space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Go to My Dashboard
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
