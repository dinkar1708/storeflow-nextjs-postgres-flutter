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
import type { ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface SalesData {
  summary: {
    totalSales: number;
    totalCost: number;
    totalProfit: number;
    profitMargin: number;
    totalOrders: number;
    averageOrderValue: number;
    todaySales: number;
    todayCost: number;
    todayProfit: number;
    todayOrders: number;
    thisMonthSales: number;
    thisMonthCost: number;
    thisMonthProfit: number;
    thisMonthOrders: number;
  };
  daily: Array<{ date: string; sales: number; orders: number; cost: number; profit: number }>;
  monthly: Array<{ month: string; sales: number; orders: number; cost: number; profit: number }>;
  yearly: Array<{ year: string; sales: number; orders: number; cost: number; profit: number }>;
}

function formatTooltipCurrency(value: ValueType | undefined) {
  const amount =
    typeof value === 'number'
      ? value
      : typeof value === 'string'
        ? Number(value)
        : NaN;

  return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : '$0.00';
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
          cost: item.cost,
          profit: item.profit,
          orders: item.orders,
        }));
      case 'monthly':
        return salesData.monthly.map(item => ({
          name: new Date(item.month + '-01').toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
          sales: item.sales,
          cost: item.cost,
          profit: item.profit,
          orders: item.orders,
        }));
      case 'yearly':
        return salesData.yearly.map(item => ({
          name: item.year,
          sales: item.sales,
          cost: item.cost,
          profit: item.profit,
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
              <p className="mt-2 text-3xl font-bold text-green-600">
                ${salesData.summary.totalSales.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-gray-500">All time sales</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Profit</h3>
              <p className="mt-2 text-3xl font-bold text-blue-600">
                ${salesData.summary.totalProfit.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {salesData.summary.profitMargin.toFixed(1)}% margin
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Cost</h3>
              <p className="mt-2 text-3xl font-bold text-orange-600">
                ${salesData.summary.totalCost.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-gray-500">Product costs</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
              <p className="mt-2 text-3xl font-bold text-purple-600">
                {salesData.summary.totalOrders}
              </p>
              <p className="mt-1 text-xs text-gray-500">
                ${salesData.summary.averageOrderValue.toFixed(2)} avg
              </p>
            </div>
          </div>

          {/* Today and This Month Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Today</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Sales</p>
                  <p className="text-xl font-bold text-green-600">
                    ${salesData.summary.todaySales.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profit</p>
                  <p className="text-xl font-bold text-blue-600">
                    ${salesData.summary.todayProfit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Orders</p>
                  <p className="text-xl font-bold text-purple-600">
                    {salesData.summary.todayOrders}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Sales</p>
                  <p className="text-xl font-bold text-green-600">
                    ${salesData.summary.thisMonthSales.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Profit</p>
                  <p className="text-xl font-bold text-blue-600">
                    ${salesData.summary.thisMonthProfit.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Orders</p>
                  <p className="text-xl font-bold text-purple-600">
                    {salesData.summary.thisMonthOrders}
                  </p>
                </div>
              </div>
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

            {/* Revenue and Profit Chart */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue and Profit</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={formatTooltipCurrency}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                    labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Cost Chart */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={formatTooltipCurrency}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                    labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="line"
                  />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    stroke="#f97316"
                    strokeWidth={3}
                    dot={{ fill: '#f97316', r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Cost"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue vs Cost vs Profit per Period */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue vs Cost vs Profit</h3>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    formatter={formatTooltipCurrency}
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                    labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Bar
                    dataKey="sales"
                    fill="#10b981"
                    name="Revenue"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="cost"
                    fill="#f97316"
                    name="Cost"
                    radius={[6, 6, 0, 0]}
                  />
                  <Bar
                    dataKey="profit"
                    fill="#3b82f6"
                    name="Profit"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Orders Bar Chart */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Volume</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={getChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '12px' }}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                    labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                    cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px' }}
                  />
                  <Bar
                    dataKey="orders"
                    fill="#8b5cf6"
                    name="Orders"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
