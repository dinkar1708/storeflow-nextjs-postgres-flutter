import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-white via-sky-50 to-violet-50 text-slate-900">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full bg-fuchsia-200 opacity-60 blur-[140px]" />
        <div className="absolute top-1/4 -right-40 h-[40rem] w-[40rem] rounded-full bg-sky-200 opacity-70 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-[40rem] w-[40rem] rounded-full bg-emerald-200 opacity-60 blur-[140px]" />
      </div>

      {/* Subtle dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(#0f172a 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top nav (compact) */}
      <nav className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-sky-500 font-bold text-white shadow-md">
              S
            </span>
            <span className="text-xl font-bold tracking-tight">StoreFlow</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link href="/demo" className="hover:text-slate-900 hidden sm:inline">Demo</Link>
            <Link href="#features" className="hover:text-slate-900 hidden sm:inline">Features</Link>
            <Link href="#stack" className="hover:text-slate-900 hidden sm:inline">Stack</Link>
          </div>
        </div>
      </nav>

      {/* Wide login band (right under header) */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 mt-2">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-900 to-fuchsia-900 text-white shadow-2xl shadow-indigo-500/20 overflow-hidden">
          <div className="relative px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_white,_transparent_50%)]" />
            <div className="relative flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur text-xl">🔐</span>
              <div>
                <div className="font-semibold text-lg">Already have an account?</div>
                <div className="text-sm text-white/70">Sign in to manage your store, orders, and team.</div>
              </div>
            </div>
            <div className="relative flex items-center gap-3">
              <Link
                href="/login"
                className="px-6 py-3 rounded-full bg-white text-slate-900 font-semibold shadow-lg hover:bg-slate-100 transition-all"
              >
                Login →
              </Link>
              <Link
                href="/register"
                className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold border border-white/20 backdrop-blur transition-all"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: copy */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 backdrop-blur px-4 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              v1.0 — built for small retailers
            </span>

            <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.05] text-slate-900">
              The store OS that{' '}
              <span className="bg-gradient-to-r from-fuchsia-600 via-pink-500 to-sky-500 bg-clip-text text-transparent">
                ships itself.
              </span>
            </h1>

            <p className="mt-6 text-lg text-slate-600 max-w-xl">
              From the moment a customer adds to cart to the moment a courier picks it up —
              StoreFlow handles inventory, fulfillment, analytics, and the mobile app, all
              from one codebase.
            </p>

            <div className="mt-8 flex gap-3 flex-wrap">
              <Link
                href="/demo"
                className="group px-7 py-3.5 rounded-full font-semibold text-white bg-slate-900 hover:bg-black shadow-xl shadow-slate-900/20 transition-all"
              >
                Take the tour
                <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="#features"
                className="px-7 py-3.5 rounded-full font-semibold text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
              >
                See what’s inside
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
              {[
                { n: '3', l: 'roles' },
                { n: '20+', l: 'API routes' },
                { n: '2', l: 'platforms' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-600 to-sky-500 bg-clip-text text-transparent">
                    {s.n}
                  </div>
                  <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: stylised dashboard mock */}
          <div className="relative">
            <div className="absolute -inset-6 bg-gradient-to-tr from-fuchsia-300/40 via-pink-200/40 to-sky-200/40 rounded-[2.5rem] blur-2xl" />
            <div className="relative rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 overflow-hidden">
              {/* fake window chrome */}
              <div className="flex items-center gap-1.5 px-4 py-3 border-b bg-slate-50">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-slate-500 font-mono">storeflow.app/admin</span>
              </div>
              <div className="p-5 space-y-4">
                {/* KPI row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { l: 'Revenue', v: '$15.5k', c: 'from-emerald-500 to-teal-500' },
                    { l: 'Orders', v: '167', c: 'from-sky-500 to-indigo-500' },
                    { l: 'AOV', v: '$92', c: 'from-fuchsia-500 to-pink-500' },
                  ].map((k) => (
                    <div key={k.l} className="rounded-xl border border-slate-200 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">{k.l}</div>
                      <div className={`text-xl font-bold bg-gradient-to-r ${k.c} bg-clip-text text-transparent`}>
                        {k.v}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Sparkline */}
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-2">Revenue · 7d</div>
                  <svg viewBox="0 0 220 70" className="w-full h-16">
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#d946ef" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#d946ef" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,50 L30,42 L60,46 L90,30 L120,34 L150,18 L180,22 L220,8 L220,70 L0,70 Z"
                      fill="url(#g)"
                    />
                    <path
                      d="M0,50 L30,42 L60,46 L90,30 L120,34 L150,18 L180,22 L220,8"
                      fill="none"
                      stroke="#d946ef"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>
                {/* Order list */}
                <div className="rounded-xl border border-slate-200 divide-y">
                  {[
                    { id: 'ORD-9421', s: 'PROCESSING', c: 'bg-yellow-100 text-yellow-800' },
                    { id: 'ORD-9420', s: 'PACKED', c: 'bg-purple-100 text-purple-800' },
                    { id: 'ORD-9418', s: 'SHIPPED', c: 'bg-indigo-100 text-indigo-800' },
                  ].map((o) => (
                    <div key={o.id} className="flex justify-between items-center px-3 py-2 text-sm">
                      <span className="font-mono text-slate-700">{o.id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${o.c}`}>{o.s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">Features</span>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">Built for retail. Made to scale.</h2>
          <p className="mt-2 text-slate-600 max-w-xl mx-auto">
            Six pillars that turn StoreFlow from a project into a platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { i: '⚡', t: 'Real-time stock', d: 'Inventory updates as orders flow through PROCESSING → SHIPPED.', c: 'from-amber-100 to-orange-50', a: 'text-amber-700' },
            { i: '🔐', t: 'Three-tier RBAC', d: 'Admin / Staff / Customer — each gets a tailored dashboard.', c: 'from-rose-100 to-pink-50', a: 'text-rose-700' },
            { i: '📱', t: 'Web + Flutter', d: 'Same Postgres, same API, native mobile + responsive web.', c: 'from-sky-100 to-blue-50', a: 'text-sky-700' },
            { i: '📊', t: 'Live analytics', d: 'Revenue, AOV, top products, charts powered by recharts.', c: 'from-violet-100 to-fuchsia-50', a: 'text-violet-700' },
            { i: '🛒', t: 'Cart + Wishlist', d: 'Persistent cart, save-for-later, one-click reorder.', c: 'from-emerald-100 to-teal-50', a: 'text-emerald-700' },
            { i: '📚', t: 'Swagger inside', d: 'Every route documented, ready for partners and integrators.', c: 'from-indigo-100 to-blue-50', a: 'text-indigo-700' },
          ].map((f) => (
            <div
              key={f.t}
              className={`group rounded-2xl border border-slate-200 bg-gradient-to-br ${f.c} p-6 hover:shadow-xl hover:-translate-y-1 transition-all`}
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm text-2xl">
                  {f.i}
                </span>
                <h3 className={`text-lg font-bold ${f.a}`}>{f.t}</h3>
              </div>
              <p className="mt-3 text-slate-700">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stack ribbon */}
      <section id="stack" className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-10 sm:p-14 shadow-2xl shadow-indigo-900/20 overflow-hidden relative">
          <div className="pointer-events-none absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_bottom_left,_#a855f7,_transparent_50%)]" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold">Modern stack, no surprises.</h2>
              <p className="mt-3 text-white/80 max-w-md">
                A clean slice of Next.js, Postgres, Prisma and Flutter — every piece replaceable,
                every choice documented.
              </p>
              <Link
                href="/demo"
                className="mt-6 inline-block px-6 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-100"
              >
                Walk through the demo →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {['Next.js 14', 'Postgres 14', 'Prisma 5', 'Flutter', 'Tailwind', 'NextAuth + JWT', 'Recharts', 'Vitest', 'Docker'].map((s) => (
                <div
                  key={s}
                  className="rounded-xl border border-white/15 bg-white/5 backdrop-blur px-3 py-2 text-center text-white/90"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pb-24">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900">Ready in minutes.</h2>
          <p className="mt-2 text-slate-600">Pick a path:</p>
          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <Link
              href="/demo"
              className="px-7 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-fuchsia-600 via-pink-500 to-sky-500 hover:brightness-110 shadow-xl shadow-fuchsia-500/30 transition-all"
            >
              Tour the demo
            </Link>
            <Link
              href="/login"
              className="px-7 py-3.5 rounded-full font-semibold text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/60 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-600">
          <div>© {new Date().getFullYear()} StoreFlow</div>
          <div className="flex gap-6">
            <Link href="/demo" className="hover:text-slate-900">Demo</Link>
            <Link href="/login" className="hover:text-slate-900">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
