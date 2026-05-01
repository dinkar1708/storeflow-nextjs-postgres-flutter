import Link from 'next/link';
import { MarketingShell } from '@/components/MarketingShell';

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
    icon: '🛍️',
    summary: 'Browse, buy, save — the shopper experience.',
    bullets: [
      'Search & filter the catalog',
      'Add to cart with stock-aware qty',
      'Save items to a wishlist',
      'Track order status end-to-end',
    ],
    cardBg: 'bg-gradient-to-br from-emerald-700 via-emerald-800 to-teal-900',
    shadow: 'shadow-emerald-500/30',
    chip: 'bg-emerald-300/20 text-emerald-100 border-emerald-300/30',
  },
  {
    href: '/demo/staff',
    title: 'Staff',
    icon: '🚚',
    summary: 'Move orders through fulfillment.',
    bullets: [
      'Order queue grouped by status',
      'Update PROCESSING → PACKED → SHIPPED',
      'Adjust stock as items are picked',
      'View order details & customer info',
    ],
    cardBg: 'bg-gradient-to-br from-sky-700 via-blue-800 to-indigo-900',
    shadow: 'shadow-sky-500/30',
    chip: 'bg-sky-300/20 text-sky-100 border-sky-300/30',
  },
  {
    href: '/demo/admin',
    title: 'Admin',
    icon: '🛠️',
    summary: 'Run the store. Everything, everywhere.',
    bullets: [
      'Analytics dashboard with charts',
      'CRUD products & categories',
      'Manage users & assign roles',
      'View revenue, top products, AOV',
    ],
    cardBg: 'bg-gradient-to-br from-fuchsia-700 via-purple-800 to-indigo-900',
    shadow: 'shadow-fuchsia-500/30',
    chip: 'bg-fuchsia-300/20 text-fuchsia-100 border-fuchsia-300/30',
  },
];

export default function DemoLanding() {
  return (
    <MarketingShell>
      {/* Demo banner */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
        <div className="rounded-full border border-amber-200 bg-amber-50 text-amber-900 text-sm py-2 text-center shadow-sm">
          Demo mode — sample data only, no API calls, no signup.
        </div>
      </div>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-12 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">
          Self-guided tour
        </span>
        <h1 className="mt-3 text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900">
          Explore every{' '}
          <span className="bg-gradient-to-r from-fuchsia-600 via-pink-500 to-sky-500 bg-clip-text text-transparent">
            corner
          </span>{' '}
          of StoreFlow.
        </h1>
        <p className="mt-5 text-lg text-slate-600 max-w-2xl mx-auto">
          Pick a role below to walk through the screens. Every page is a static preview
          of what the real product looks like in production.
        </p>
        <div className="mt-8 flex justify-center gap-3 flex-wrap">
          <Link
            href="#roles"
            className="px-7 py-3.5 rounded-full font-semibold text-white bg-slate-900 hover:bg-black shadow-xl shadow-slate-900/20 transition-all"
          >
            Start the tour ↓
          </Link>
          <Link
            href="/login"
            className="px-7 py-3.5 rounded-full font-semibold text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
          >
            Try the real app
          </Link>
        </div>
      </section>

      {/* Module strip */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-16">
        <h2 className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 mb-6">
          What’s in the box
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {modules.map((m) => (
            <div
              key={m.name}
              className="rounded-xl border border-slate-200 bg-white/80 backdrop-blur p-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className="text-2xl mb-1">{m.icon}</div>
              <div className="font-semibold text-slate-900 text-sm">{m.name}</div>
              <div className="text-xs text-slate-500 mt-1">{m.blurb}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Role tiles */}
      <section id="roles" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-2">Pick a role to explore</h2>
        <p className="text-center text-slate-600 mb-10">Each role sees a different StoreFlow.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {roles.map((r) => (
            <Link
              key={r.title}
              href={r.href}
              className={`group relative overflow-hidden rounded-2xl ${r.cardBg} p-6 text-white shadow-xl ${r.shadow} hover:shadow-2xl hover:-translate-y-1 transition-all`}
            >
              <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_60%)]" />
              <div className="relative flex items-center justify-between">
                <div className="text-3xl">{r.icon}</div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${r.chip}`}>
                  {r.title.toUpperCase()}
                </span>
              </div>
              <h3 className="relative mt-4 text-3xl font-bold">{r.title}</h3>
              <p className="relative mt-1 text-white/80">{r.summary}</p>
              <ul className="relative mt-5 space-y-2">
                {r.bullets.map((b) => (
                  <li key={b} className="flex items-start text-sm text-white/85">
                    <span className="mr-2">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="relative mt-6 inline-flex items-center text-sm font-semibold text-white/95 group-hover:text-white">
                Open the {r.title} demo
                <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
