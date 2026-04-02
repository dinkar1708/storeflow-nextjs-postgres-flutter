'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/enums';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SalesData {
  summary: {
    totalSales: number;
    totalOrders: number;
    averageOrderValue: number;
    todaySales: number;
    todayOrders: number;
    thisMonthSales: number;
    thisMonthOrders: number;
  };
  daily: Array<{ date: string; sales: number; orders: number }>;
  monthly: Array<{ month: string; sales: number; orders: number }>;
  yearly: Array<{ year: string; sales: number; orders: number }>;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [salesData, setSalesData] = useState<SalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'daily' | 'monthly' | 'yearly'>('daily');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== UserRole.ADMIN) {
      router.push('/403');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && (session?.user as any)?.role === UserRole.ADMIN) {
      fetchAnalytics();
    }
  }, [status, session]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/sales');
      const data = await response.json();

      if (response.ok) {
        setSalesData(data);
      } else {
        alert('Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      alert('Error fetching analytics');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading analytics...</div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== UserRole.ADMIN) {
    return null;
  }

  if (!salesData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">No data available</div>
      </div>
    );
  }

  const getChartData = () => {
    switch (viewMode) {
      case 'daily':
        return salesData.daily.map(item => ({
          name: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          sales: item.sales,
          orders: item.orders,
        }));
      case 'monthly':
        return salesData.monthly.map(item => ({
          name: new Date(item.month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
          sales: item.sales,
          orders: item.orders,
        }));
      case 'yearly':
        return salesData.yearly.map(item => ({
          name: item.year,
          sales: item.sales,
          orders: item.orders,
        }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-bold text-gray-900">Sales Analytics</h1>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                {UserRole.ADMIN}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">
                ${salesData.summary.totalSales.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-gray-500">All time</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                {salesData.summary.totalOrders}
              </p>
              <p className="mt-1 text-xs text-gray-500">Delivered orders</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
              <p className="mt-2 text-3xl font-bold text-purple-600">
                ${salesData.summary.averageOrderValue.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-gray-500">Per order</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Today's Sales</h3>
              <p className="mt-2 text-3xl font-bold text-orange-600">
                ${salesData.summary.todaySales.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-gray-500">{salesData.summary.todayOrders} orders</p>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('daily')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    viewMode === 'daily'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Daily (30 days)
                </button>
                <button
                  onClick={() => setViewMode('monthly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    viewMode === 'monthly'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Monthly (12 months)
                </button>
                <button
                  onClick={() => setViewMode('yearly')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    viewMode === 'yearly'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Yearly
                </button>
              </div>
            </div>

            {/* Sales Line Chart */}
            <div className="mb-8">
              <h3 className="text-md font-medium text-gray-700 mb-4">Sales Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                    labelStyle={{ color: '#000' }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Sales ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Bar Chart */}
            <div>
              <h3 className="text-md font-medium text-gray-700 mb-4">Order Count</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip labelStyle={{ color: '#000' }} />
                  <Legend />
                  <Bar dataKey="orders" fill="#3b82f6" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Performance */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">This Month</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  ${salesData.summary.thisMonthSales.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Orders</p>
                <p className="text-2xl font-bold text-blue-600">
                  {salesData.summary.thisMonthOrders}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
