'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/enums';

export default function StaffDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== UserRole.STAFF) {
      // Redirect non-staff users to 403 page
      router.push('/403');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== UserRole.STAFF) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-white/70 backdrop-blur shadow-sm border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">StoreFlow Staff</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, <strong>{session.user?.name}</strong>
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {UserRole.STAFF}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:brightness-110 shadow-md shadow-sky-500/30"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="relative overflow-hidden rounded-2xl px-6 py-7 mb-6 text-white bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 shadow-xl shadow-sky-500/30">
            <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_55%)]" />
            <div className="relative">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">Fulfillment</span>
              <h2 className="mt-1 text-3xl font-bold">Welcome, {session.user?.name} 🚚</h2>
              <p className="text-white/80 mt-1">Inventory and order management workspace.</p>

              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  onClick={() => router.push('/admin/orders')}
                  className="px-4 py-2 bg-white text-sky-700 rounded-full text-sm font-semibold shadow hover:bg-slate-100"
                >
                  Manage Orders →
                </button>
                <button className="px-4 py-2 bg-white/15 backdrop-blur border border-white/25 text-white rounded-full text-sm font-medium hover:bg-white/20">
                  My Activity
                </button>
                <button className="px-4 py-2 bg-white/15 backdrop-blur border border-white/25 text-white rounded-full text-sm font-medium hover:bg-white/20">
                  Profile
                </button>
              </div>
            </div>
          </div>

          {/* Daily Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Today's Sales</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">$0.00</p>
              <p className="mt-1 text-xs text-gray-500">Last 24 hours</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
              <p className="mt-2 text-3xl font-bold text-orange-600">0</p>
              <p className="mt-1 text-xs text-gray-500">Needs processing</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">My Assigned Orders</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
              <p className="mt-1 text-xs text-gray-500">Assigned to me</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Low Stock Alerts</h3>
              <p className="mt-2 text-3xl font-bold text-red-600">0</p>
              <p className="mt-1 text-xs text-gray-500">Below 10 items</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
