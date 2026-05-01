import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Shared marketing chrome: gradient background, color blobs, dot grid,
 * brand nav. Used by public pages (/, /demo, /login, /register).
 */
export function MarketingShell({
  children,
  showAuthLinks = true,
  navExtras,
}: {
  children: ReactNode;
  showAuthLinks?: boolean;
  navExtras?: ReactNode;
}) {
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

      {/* Top nav */}
      <nav className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-fuchsia-500 to-sky-500 font-bold text-white shadow-md">
              S
            </span>
            <span className="text-xl font-bold tracking-tight">StoreFlow</span>
          </Link>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            {navExtras}
            {showAuthLinks && (
              <>
                <Link href="/demo" className="hover:text-slate-900 hidden sm:inline">
                  Demo
                </Link>
                <Link href="/login" className="hover:text-slate-900">
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-slate-900 text-white rounded-full font-medium hover:bg-black"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {children}

      <footer className="relative z-10 border-t border-slate-200 bg-white/60 backdrop-blur mt-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-slate-600">
          <div>© {new Date().getFullYear()} StoreFlow</div>
          <div className="flex gap-6">
            <Link href="/demo" className="hover:text-slate-900">
              Demo
            </Link>
            <Link href="/login" className="hover:text-slate-900">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
