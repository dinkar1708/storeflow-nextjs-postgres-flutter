'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { MarketingShell } from '@/components/MarketingShell';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 5) {
      setError('Password must be at least 5 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Registration successful but login failed. Please login manually.');
          setTimeout(() => router.push('/login'), 2000);
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <MarketingShell showAuthLinks={false} navExtras={
      <Link href="/login" className="hover:text-slate-900">
        Already have an account? Sign in →
      </Link>
    }>
      <main className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: copy */}
          <div className="hidden lg:block">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-600">
              Get started
            </span>
            <h1 className="mt-3 text-5xl font-extrabold tracking-tight text-slate-900">
              Create your{' '}
              <span className="bg-gradient-to-r from-fuchsia-600 via-pink-500 to-sky-500 bg-clip-text text-transparent">
                StoreFlow
              </span>{' '}
              account
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-md">
              Free to try. No credit card. Built for retailers who want one place to run everything.
            </p>
            <ul className="mt-6 space-y-3 text-slate-700">
              {[
                'Start as a Customer — upgrade roles anytime',
                'Real-time orders, cart, wishlist',
                'Mobile app included (Flutter)',
              ].map((b) => (
                <li key={b} className="flex items-start">
                  <span className="mr-2 text-emerald-600">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-fuchsia-600 hover:text-fuchsia-700">
                Sign in →
              </Link>
            </p>
          </div>

          {/* Right: card */}
          <div className="w-full max-w-md mx-auto">
            <div className="rounded-3xl bg-white border border-slate-200 shadow-2xl shadow-slate-900/10 overflow-hidden">
              <div className="px-7 py-6 bg-gradient-to-r from-slate-900 via-indigo-900 to-fuchsia-900 text-white">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur text-xl">
                    ✨
                  </span>
                  <div>
                    <div className="font-semibold text-lg">Create your account</div>
                    <div className="text-xs text-white/70">Takes less than 30 seconds.</div>
                  </div>
                </div>
              </div>

              <div className="p-7">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                      placeholder="Min. 5 characters"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                      Confirm password
                    </label>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3.5 py-3 border border-slate-300 rounded-xl text-sm focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-200"
                      placeholder="Re-enter password"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-fuchsia-600 via-pink-500 to-sky-500 hover:brightness-110 shadow-lg shadow-fuchsia-500/30 disabled:opacity-50 transition-all"
                  >
                    {loading ? 'Creating account…' : 'Create account →'}
                  </button>
                </form>

                <p className="mt-6 text-sm text-center text-slate-600">
                  Already have an account?{' '}
                  <Link href="/login" className="font-semibold text-fuchsia-600 hover:text-fuchsia-700">
                    Sign in
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
