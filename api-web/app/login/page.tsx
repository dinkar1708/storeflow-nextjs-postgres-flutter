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
  /** Email of the selected demo row, if any (only one checkbox “on” at a time). */
  const [selectedDemoEmail, setSelectedDemoEmail] = useState<string | null>(null);

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

  const handleDemoCheck = (accountEmail: string, accountPassword: string, checked: boolean) => {
    if (!checked) {
      if (selectedDemoEmail === accountEmail) {
        setSelectedDemoEmail(null);
        setEmail('');
        setPassword('');
        setError('');
      }
      return;
    }
    setSelectedDemoEmail(accountEmail);
    setEmail(accountEmail);
    setPassword(accountPassword);
    setError('');
  };

  const groups = ['Admin', 'Staff', 'Customer'] as const;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Login to StoreFlow</h2>

        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-800">Demo accounts</h3>
          <p className="mt-1 text-xs text-gray-600">
            Check one row to fill email and password below (same as{' '}
            <code className="rounded bg-gray-200 px-1">TEST_LOGIN.md</code> after{' '}
            <code className="rounded bg-gray-200 px-1">npm run db:seed</code>).
          </p>
          <div className="mt-3 max-h-56 space-y-3 overflow-y-auto pr-1">
            {groups.map((g) => (
              <div key={g}>
                <div className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {g}
                </div>
                <ul className="mt-1 space-y-1">
                  {DEMO_LOGIN_ACCOUNTS.filter((a) => a.group === g).map((a) => (
                    <li key={a.email}>
                      <label className="flex cursor-pointer items-start gap-2 rounded-md px-1 py-1 hover:bg-gray-100">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={selectedDemoEmail === a.email}
                          onChange={(e) =>
                            handleDemoCheck(a.email, a.password, e.target.checked)
                          }
                        />
                        <span className="min-w-0 text-sm text-gray-800">
                          <span className="font-medium">{a.label}</span>
                          <span className="block truncate text-xs text-gray-500">
                            {a.email} · {a.role}
                          </span>
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (selectedDemoEmail && e.target.value !== selectedDemoEmail) {
                  setSelectedDemoEmail(null);
                }
              }}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setSelectedDemoEmail(null);
              }}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
