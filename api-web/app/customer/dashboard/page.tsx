'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/enums';

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== UserRole.CUSTOMER) {
      // Redirect non-customer users to 403 page
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

  if (!session || session.user?.role !== UserRole.CUSTOMER) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-white/70 backdrop-blur shadow-sm border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">StoreFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, <strong>{session.user?.name}</strong>
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {UserRole.CUSTOMER}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-4 py-2 text-sm font-semibold text-white rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-110 shadow-md shadow-emerald-500/30"
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
          <div className="relative overflow-hidden rounded-2xl px-6 py-7 mb-6 text-white bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 shadow-xl shadow-emerald-500/30">
            <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_55%)]" />
            <div className="relative">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">Shopping</span>
              <h2 className="mt-1 text-3xl font-bold">Welcome back, {session.user?.name} 🛍️</h2>
              <p className="text-white/80 mt-1">Your personal shopping dashboard.</p>

              <div className="flex flex-wrap gap-3 mt-5">
                <button
                  onClick={() => router.push('/customer/products')}
                  className="px-4 py-2 bg-white text-emerald-700 rounded-full text-sm font-semibold shadow hover:bg-slate-100"
                >
                  Browse Products →
                </button>
                <button
                  onClick={() => router.push('/customer/cart')}
                  className="px-4 py-2 bg-white/15 backdrop-blur border border-white/25 text-white rounded-full text-sm font-medium hover:bg-white/20"
                >
                  🛒 My Cart
                </button>
                <button
                  onClick={() => router.push('/customer/orders')}
                  className="px-4 py-2 bg-white/15 backdrop-blur border border-white/25 text-white rounded-full text-sm font-medium hover:bg-white/20"
                >
                  📜 My Orders
                </button>
                <button
                  onClick={() => router.push('/customer/wishlist')}
                  className="px-4 py-2 bg-white/15 backdrop-blur border border-white/25 text-white rounded-full text-sm font-medium hover:bg-white/20"
                >
                  ♥ Wishlist
                </button>
                <button
                  onClick={() => router.push('/customer/profile')}
                  className="px-4 py-2 bg-white/15 backdrop-blur border border-white/25 text-white rounded-full text-sm font-medium hover:bg-white/20"
                >
                  Profile
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Active Orders</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
              <p className="mt-1 text-xs text-gray-500">In transit or processing</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Order History</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">0</p>
              <p className="mt-1 text-xs text-gray-500">Total orders placed</p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Wishlist Items</h3>
              <p className="mt-2 text-3xl font-bold text-purple-600">0</p>
              <p className="mt-1 text-xs text-gray-500">Saved for later</p>
            </div>
          </div>

          {/* Active Orders Section */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Orders</h3>
            <div className="text-center py-8 text-gray-500">
              <p>No active orders</p>
              <p className="text-sm mt-2">Your current orders will appear here</p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
