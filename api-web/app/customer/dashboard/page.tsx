'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'CUSTOMER') {
      // Redirect non-customer users to 403 page
      router.push('/403');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'CUSTOMER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b-4 border-green-600">
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
                CUSTOMER
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
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
          <div className="bg-white rounded-lg shadow px-6 py-8 mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {session.user?.name}!
            </h2>
            <p className="text-gray-600">
              Your personal shopping dashboard
            </p>
          </div>

          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Active Orders</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
              <p className="mt-1 text-xs text-gray-500">In transit or processing</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Order History</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">0</p>
              <p className="mt-1 text-xs text-gray-500">Total orders placed</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Wishlist Items</h3>
              <p className="mt-2 text-3xl font-bold text-purple-600">0</p>
              <p className="mt-1 text-xs text-gray-500">Saved for later</p>
            </div>
          </div>

          {/* Active Orders Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Orders</h3>
            <div className="text-center py-8 text-gray-500">
              <p>No active orders</p>
              <p className="text-sm mt-2">Your current orders will appear here</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">
                Browse Products
              </button>
              <button className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Track Order
              </button>
              <button className="px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium">
                View Wishlist
              </button>
              <button className="px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-medium">
                My Addresses
              </button>
              <button className="px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium">
                Order History
              </button>
              <button className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium">
                My Profile
              </button>
            </div>
          </div>

          {/* Customer Modules */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Account</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-semibold text-gray-900">Shop Products</h4>
                <p className="text-sm text-gray-600 mt-1">Browse and search our catalog</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-semibold text-gray-900">My Orders</h4>
                <p className="text-sm text-gray-600 mt-1">Track and view order history</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-semibold text-gray-900">Wishlist</h4>
                <p className="text-sm text-gray-600 mt-1">Save items for later</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-semibold text-gray-900">Profile Settings</h4>
                <p className="text-sm text-gray-600 mt-1">Update your account details</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
