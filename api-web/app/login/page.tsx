'use client';

import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { DemoLoginAccount } from '@/lib/demo-login-accounts';
import { MarketingShell } from '@/components/MarketingShell';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoSelectValue, setDemoSelectValue] = useState('');
  const [demoAccounts, setDemoAccounts] = useState<DemoLoginAccount[]>([]);

  // Dev-only: dynamically load seed credentials so they never enter the
  // production bundle. The `process.env.NODE_ENV` check is statically
  // evaluated by Next.js, so the import() call is dead-code-eliminated
  // in production builds.
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/lib/demo-login-accounts')
        .then((mod) => setDemoAccounts(mod.DEMO_LOGIN_ACCOUNTS))
        .catch(() => {});
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/dashboard');
    }
  };

  const handleDemoSelect = (value: string) => {
    setDemoSelectValue(value);
    setError('');
    if (value === '') {
      setEmail('');
      setPassword('');
      return;
    }
    const account = demoAccounts.find((a) => a.email === value);
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
    }
  };

  return (
    <MarketingShell showAuthLinks={false} navExtras={
      <Link href="/register" className="hover:text-slate-900">
        Create an account →
      </Link>
    }>
      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: copy */}
          <div className="hidden lg:block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">
              Welcome back
            </span>
            <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-slate-900">
              Sign in to{' '}
              <span className="bg-gradient-to-r from-fuchsia-600 via-pink-500 to-sky-500 bg-clip-text text-transparent">
                StoreFlow
              </span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-md">
              Manage products, orders, customers and analytics — all from one place.
            </p>
            <ul className="mt-6 space-y-3 text-slate-700">
              {[
                'Three role-based dashboards (Admin / Staff / Customer)',
                'Real-time inventory & 7-stage order pipeline',
                'Web + Flutter mobile, one shared API',
              ].map((b) => (
                <li key={b} className="flex items-start">
                  <span className="mr-2 text-emerald-600">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-slate-500">
              Don’t have an account?{' '}
              <Link href="/register" className="font-semibold text-fuchsia-600 hover:text-fuchsia-700">
                Create one →
              </Link>
            </p>
          </div>

          {/* Right: card */}
          <div className="w-full max-w-md mx-auto">
            <div className="rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 overflow-hidden">
              <div className="px-7 py-6 bg-gradient-to-r from-slate-900 via-indigo-900 to-fuchsia-900 text-white">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur text-xl">
                    🔐
                  </span>
                  <div>
                    <div className="font-semibold text-lg">Login to your account</div>
                    <div className="text-xs text-white/70">Use your StoreFlow credentials.</div>
                  </div>
                </div>
              </div>

              <div className="p-7">
                {process.env.NODE_ENV === 'development' && demoAccounts.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mb-5">
                    <h3 className="text-sm font-semibold text-slate-900">Demo login (seed data)</h3>
                    <p className="mt-1 text-xs text-slate-600">
                      Pick an account to autofill — same as <code className="rounded bg-slate-200 px-1">TEST_LOGIN.md</code>.
                    </p>
                    <select
                      id="demo-credentials"
                      value={demoSelectValue}
                      onChange={(e) => handleDemoSelect(e.target.value)}
                      className="mt-3 w-full appearance-none rounded-xl border border-slate-300 bg-white py-2.5 px-3 text-sm text-slate-900 shadow-sm focus:border-fuchsia-500 focus:outline-none focus:ring-1 focus:ring-fuchsia-500"
                    >
                      <option value="">Custom — type below</option>
                      {demoAccounts.map((a) => (
                        <option key={a.email} value={a.email}>
                          {a.group} · {a.label} · {a.email} ({a.role})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        const v = e.target.value;
                        setEmail(v);
                        if (demoSelectValue && v !== demoSelectValue) setDemoSelectValue('');
                      }}
                      className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setDemoSelectValue('');
                      }}
                      className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <button type="button" className="text-sm text-fuchsia-600 hover:text-fuchsia-700 hover:underline">
                      Forgot password?
                    </button>
                  </div>

                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-fuchsia-600 via-pink-500 to-sky-500 hover:brightness-110 shadow-lg shadow-fuchsia-500/30 disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Signing in…' : 'Sign in →'}
                  </button>
                </form>

                <p className="mt-6 text-sm text-center text-slate-600">
                  Don’t have an account?{' '}
                  <Link href="/register" className="font-semibold text-fuchsia-600 hover:text-fuchsia-700">
                    Register
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </MarketingShell>
  );
}
