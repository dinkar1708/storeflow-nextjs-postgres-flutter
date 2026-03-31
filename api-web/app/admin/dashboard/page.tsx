'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      // Redirect non-admin users to 403 page
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

  if (!session || session.user?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">StoreFlow Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, <strong>{session.user?.name}</strong>
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                ADMIN
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
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
              Admin Dashboard
            </h2>
            <p className="text-gray-600">
              Full system access and control
            </p>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">$0.00</p>
              <p className="mt-1 text-xs text-gray-500">This month</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
              <p className="mt-1 text-xs text-gray-500">All time</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
              <p className="mt-2 text-3xl font-bold text-purple-600">7</p>
              <p className="mt-1 text-xs text-gray-500">All roles</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
              <p className="mt-2 text-3xl font-bold text-orange-600">2</p>
              <p className="mt-1 text-xs text-gray-500">Active products</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium">
                Manage Users
              </button>
              <button className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium">
                Add New Product
              </button>
              <button className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium">
                View All Orders
              </button>
              <button className="px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium">
                System Settings
              </button>
              <button className="px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-medium">
                Analytics Reports
              </button>
              <button className="px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium">
                Audit Logs
              </button>
            </div>
          </div>

          {/* Admin Navigation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-semibold text-gray-900">Users Management</h4>
                <p className="text-sm text-gray-600 mt-1">View, edit, assign roles, approve accounts</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-semibold text-gray-900">Products Management</h4>
                <p className="text-sm text-gray-600 mt-1">Add, edit, delete products and inventory</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-semibold text-gray-900">Orders Management</h4>
                <p className="text-sm text-gray-600 mt-1">View, process, cancel orders</p>
              </div>
              <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <h4 className="font-semibold text-gray-900">Reports & Analytics</h4>
                <p className="text-sm text-gray-600 mt-1">Sales reports, user growth, revenue analytics</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
