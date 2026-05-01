import Link from 'next/link';

export const metadata = {
  title: 'StoreFlow — Explore the Demo',
  description: 'Tour every module in StoreFlow without signing up.',
};

const modules = [
  { icon: '📦', name: 'Products', blurb: 'Catalog with categories, SKUs, stock & images' },
  { icon: '🛒', name: 'Cart', blurb: 'Persistent cart with quantity controls' },
  { icon: '♥', name: 'Wishlist', blurb: 'Save for later, click to add to cart' },
  { icon: '📜', name: 'Orders', blurb: '7-stage lifecycle from PENDING → DELIVERED' },
  { icon: '📊', name: 'Analytics', blurb: 'Sales charts, revenue, top products' },
  { icon: '🗂️', name: 'Categories', blurb: 'Slug-based, sortable, scoped to admin' },
  { icon: '👥', name: 'Users & Roles', blurb: 'Admin / Staff / Customer with RBAC' },
  { icon: '🔐', name: 'Auth', blurb: 'NextAuth (web) + JWT (mobile / Swagger)' },
  { icon: '📱', name: 'Flutter App', blurb: 'iOS/Android client sharing the same API' },
  { icon: '📚', name: 'Swagger Docs', blurb: 'OpenAPI for every endpoint' },
];

const roles = [
  {
    href: '/demo/customer',
    title: 'Customer',
    color: 'green',
    border: 'border-green-600',
    badge: 'bg-green-100 text-green-800',
    btn: 'bg-green-600 hover:bg-green-700',
    accent: 'text-green-700',
    icon: '🛍️',
    summary: 'Browse, buy, save — the shopper experience.',
    bullets: [
      'Search & filter the catalog',
      'Add to cart with stock-aware qty',
      'Save items to a wishlist',
      'Track order status end-to-end',
      'Edit profile & shipping info',
    ],
  },
  {
    href: '/demo/staff',
    title: 'Staff',
    color: 'blue',
    border: 'border-blue-600',
    badge: 'bg-blue-100 text-blue-800',
    btn: 'bg-blue-600 hover:bg-blue-700',
    accent: 'text-blue-700',
    icon: '🚚',
    summary: 'Move orders through fulfillment.',
    bullets: [
      'Order queue grouped by status',
      'Update status: PROCESSING → PACKED → SHIPPED',
      'Adjust stock as items are picked',
      'View order details & customer info',
      'Read-only access to all customers',
    ],
  },
  {
    href: '/demo/admin',
    title: 'Admin',
    color: 'red',
    border: 'border-red-600',
    badge: 'bg-red-100 text-red-800',
    btn: 'bg-red-600 hover:bg-red-700',
    accent: 'text-red-700',
    icon: '🛠️',
    summary: 'Run the store. Everything, everywhere.',
    bullets: [
      'Analytics dashboard with charts',
      'CRUD products & categories',
      'Manage users & assign roles',
      'View revenue, top products, AOV',
      'Full audit log access',
    ],
  },
];

export default function DemoLanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo banner */}
      <div className="bg-amber-100 text-amber-900 text-center text-sm py-2 border-b border-amber-200">
        You’re viewing the demo — sample data only, no login required.
      </div>

      {/* Top nav */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            StoreFlow
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 hover:bg-black rounded-md"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
          Explore everything StoreFlow can do
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Pick a role below to walk through the screens. No signup, no API calls — just a
          static tour of every module shipped today.
        </p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Link
            href="#roles"
            className="px-6 py-3 bg-gray-900 text-white rounded-md font-medium hover:bg-black"
          >
            Start the tour ↓
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 bg-white border border-gray-300 text-gray-800 rounded-md font-medium hover:bg-gray-50"
          >
            Try it for real
          </Link>
        </div>
      </section>

      {/* Module strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 text-center">
          What’s in the box
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {modules.map((m) => (
            <div
              key={m.name}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="text-2xl mb-1">{m.icon}</div>
              <div className="font-semibold text-gray-900 text-sm">{m.name}</div>
              <div className="text-xs text-gray-500 mt-1">{m.blurb}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Role tiles */}
      <section id="roles" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
          Pick a role to explore
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Each role sees a different StoreFlow.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r) => (
            <Link
              key={r.title}
              href={r.href}
              className={`bg-white rounded-lg shadow hover:shadow-xl transition-shadow border-t-4 ${r.border} overflow-hidden`}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{r.icon}</div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${r.badge}`}
                  >
                    {r.title.toUpperCase()}
                  </span>
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${r.accent}`}>{r.title}</h3>
                <p className="text-gray-600 mb-4">{r.summary}</p>
                <ul className="space-y-2 mb-6">
                  {r.bullets.map((b) => (
                    <li key={b} className="text-sm text-gray-700 flex items-start">
                      <span className={`mr-2 ${r.accent}`}>✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div
                  className={`text-white text-center px-4 py-2 rounded-md text-sm font-medium ${r.btn}`}
                >
                  Explore the {r.title} view →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-gray-500">
          StoreFlow demo · Sample data, no backend calls.
          <Link href="/login" className="ml-2 text-gray-900 underline">
            Login to use the real app
          </Link>
        </div>
      </footer>
    </div>
  );
}
