'use client';

import Link from 'next/link';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const salesByDay = [
  { d: 'Mon', revenue: 1240 },
  { d: 'Tue', revenue: 1980 },
  { d: 'Wed', revenue: 1610 },
  { d: 'Thu', revenue: 2240 },
  { d: 'Fri', revenue: 2890 },
  { d: 'Sat', revenue: 3410 },
  { d: 'Sun', revenue: 2150 },
];

const topProducts = [
  { name: 'Headphones', units: 142 },
  { name: 'Speaker', units: 98 },
  { name: 'Tee', units: 86 },
  { name: 'Yoga Mat', units: 64 },
  { name: 'Lamp', units: 41 },
];

const ordersByStatus = [
  { name: 'PENDING', value: 12 },
  { name: 'PROCESSING', value: 8 },
  { name: 'PACKED', value: 5 },
  { name: 'SHIPPED', value: 14 },
  { name: 'DELIVERED', value: 220 },
];

const pieColors = ['#9CA3AF', '#FBBF24', '#A78BFA', '#6366F1', '#10B981'];

const productRows = [
  { sku: 'WH-220', name: 'Wireless Headphones', cat: 'Electronics', price: 149.99, stock: 24, active: true },
  { sku: 'TS-001', name: 'Cotton Tee', cat: 'Apparel', price: 19.99, stock: 120, active: true },
  { sku: 'SB-001', name: 'Stainless Bottle', cat: 'Home', price: 24.50, stock: 0, active: true },
  { sku: 'YM-220', name: 'Yoga Mat', cat: 'Fitness', price: 39.00, stock: 17, active: true },
  { sku: 'LL-014', name: 'LED Desk Lamp', cat: 'Home', price: 45.00, stock: 8, active: false },
];

const userRows = [
  { name: 'Alex Chen', email: 'alex@example.com', role: 'CUSTOMER', orders: 14, joined: '2025-08-12' },
  { name: 'Priya Patel', email: 'priya@example.com', role: 'CUSTOMER', orders: 6, joined: '2025-11-03' },
  { name: 'Marco Diaz', email: 'marco@example.com', role: 'STAFF', orders: 0, joined: '2025-02-19' },
  { name: 'Sara Johansson', email: 'sara@example.com', role: 'ADMIN', orders: 0, joined: '2024-09-04' },
];

const roleBadge: Record<string, string> = {
  CUSTOMER: 'bg-green-100 text-green-800',
  STAFF: 'bg-blue-100 text-blue-800',
  ADMIN: 'bg-red-100 text-red-800',
};

export default function AdminDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-100 text-amber-900 text-center text-sm py-2 border-b border-amber-200">
        Demo · Sample data only.
      </div>

      <nav className="bg-white shadow-sm border-b-4 border-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-gray-600 hover:text-gray-900">← Back to Demo</Link>
            <h1 className="text-xl font-bold text-gray-900">Admin view</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">ADMIN</span>
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md">Login</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* KPI cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Revenue (7d)', value: '$15,520', sub: '+18% vs prev', color: 'text-green-600' },
            { label: 'Orders (7d)', value: '167', sub: '+9%', color: 'text-blue-600' },
            { label: 'Avg order value', value: '$92.93', sub: '+4%', color: 'text-purple-600' },
            { label: 'Active users', value: '1,284', sub: '+22 new', color: 'text-orange-600' },
          ].map((k) => (
            <div key={k.label} className="bg-white rounded-lg shadow p-5">
              <div className="text-sm text-gray-500">{k.label}</div>
              <div className={`text-3xl font-bold mt-1 ${k.color}`}>{k.value}</div>
              <div className="text-xs text-gray-400 mt-1">{k.sub}</div>
            </div>
          ))}
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue · last 7 days</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="d" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#DC2626" strokeWidth={3} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Orders by status</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={ordersByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}>
                    {ordersByStatus.map((_, i) => (
                      <Cell key={i} fill={pieColors[i]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Top products by units sold</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip />
                <Bar dataKey="units" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Products table */}
        <section className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Products</h2>
              <p className="text-sm text-gray-500">CRUD with categories, stock, pricing.</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium">+ New product</button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">SKU</th>
                  <th className="text-left px-4 py-2 font-medium">Name</th>
                  <th className="text-left px-4 py-2 font-medium">Category</th>
                  <th className="text-left px-4 py-2 font-medium">Price</th>
                  <th className="text-left px-4 py-2 font-medium">Stock</th>
                  <th className="text-left px-4 py-2 font-medium">Active</th>
                  <th className="text-left px-4 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {productRows.map((p) => (
                  <tr key={p.sku} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{p.sku}</td>
                    <td className="px-4 py-3 font-medium">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.cat}</td>
                    <td className="px-4 py-3 font-semibold">${p.price.toFixed(2)}</td>
                    <td className={`px-4 py-3 font-semibold ${p.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>{p.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${p.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-red-600 hover:underline text-xs mr-3">Edit</button>
                      <button className="text-gray-400 hover:underline text-xs">Archive</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Users table */}
        <section className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Users</h2>
            <p className="text-sm text-gray-500">Manage roles and access.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Name</th>
                  <th className="text-left px-4 py-2 font-medium">Email</th>
                  <th className="text-left px-4 py-2 font-medium">Role</th>
                  <th className="text-left px-4 py-2 font-medium">Orders</th>
                  <th className="text-left px-4 py-2 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {userRows.map((u) => (
                  <tr key={u.email} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge[u.role]}`}>{u.role}</span>
                    </td>
                    <td className="px-4 py-3">{u.orders}</td>
                    <td className="px-4 py-3 text-gray-500">{u.joined}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Cross-link */}
        <section className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-3">See it from the other side:</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/demo/customer" className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700">Customer view →</Link>
            <Link href="/demo/staff" className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">Staff view →</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
