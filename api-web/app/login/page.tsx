'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DEMO_LOGIN_ACCOUNTS } from '@/lib/demo-login-accounts';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  /** Empty string = custom; otherwise selected demo account email. */
  const [demoSelectValue, setDemoSelectValue] = useState('');

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
    const account = DEMO_LOGIN_ACCOUNTS.find((a) => a.email === value);
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-blue-50 p-4 text-blue-600">
            <svg
              className="h-14 w-14"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015V21m-9-9h.008v.008H9V12z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-900">Welcome to StoreFlow</h1>
        <p className="mt-2 text-center text-base text-gray-600">
          Sign in to manage your inventory and orders
        </p>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          {/* Demo credentials selector - only show in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900">Demo login (seed data)</h3>
              <p className="mt-1 text-xs text-gray-600">
                Pick an account to fill email & password — same as{' '}
                <code className="rounded bg-gray-200 px-1">TEST_LOGIN.md</code> after{' '}
                <code className="rounded bg-gray-200 px-1">npm run db:seed</code>.
              </p>
              <label htmlFor="demo-credentials" className="sr-only">
                Demo credentials
              </label>
              <div className="mt-3 relative">
                <span className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </span>
                <select
                  id="demo-credentials"
                  value={demoSelectValue}
                  onChange={(e) => handleDemoSelect(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-10 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Custom — type email & password below</option>
                  {DEMO_LOGIN_ACCOUNTS.map((a) => (
                    <option key={a.email} value={a.email}>
                      {a.group} · {a.label} · {a.email} ({a.role})
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmail(v);
                  if (demoSelectValue && v !== demoSelectValue) {
                    setDemoSelectValue('');
                  }
                }}
                className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
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
                className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl text-base font-bold hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="mt-6 text-sm text-center text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="font-medium text-blue-600 hover:text-blue-800 hover:underline">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
