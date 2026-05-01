'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/enums';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && session?.user?.role !== UserRole.CUSTOMER) {
      router.push('/403');
    }
  }, [status, session, router]);

  // Fetch profile data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfile();
    }
  }, [status]);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/user/profile');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.user);
        setName(data.user.name);
        setPhone(data.user.phone || '');
        setAddress(data.user.address || '');
      } else {
        setError('Failed to load profile');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate phone number (must be exactly 10 digits)
    if (phone && !/^\d{10}$/.test(phone)) {
      setError('Phone number must be exactly 10 digits');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, address }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Profile updated successfully!');
        setProfile(data.user);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 5) {
      setError('New password must be at least 5 characters');
      return;
    }

    setSaving(true);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session || session.user?.role !== UserRole.CUSTOMER) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-white/70 backdrop-blur shadow-sm border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/customer/dashboard')}
                className="text-xl font-bold text-gray-900 hover:text-green-600"
              >
                StoreFlow
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {session.user?.name}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {UserRole.CUSTOMER}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          {/* Back Button */}
          <button
            onClick={() => router.push('/customer/dashboard')}
            className="mb-4 text-green-600 hover:text-green-700 flex items-center text-sm font-medium"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

          {/* Success/Error Messages */}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl">
              {success}
            </div>
          )}

          {/* Profile Information Form */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm bg-gray-100 cursor-not-allowed"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                    if (value.length <= 10) {
                      setPhone(value);
                    }
                  }}
                  maxLength={10}
                  pattern="[0-9]{10}"
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="10 digit phone number"
                />
                {phone && phone.length > 0 && phone.length < 10 && (
                  <p className="mt-1 text-xs text-red-600">Phone number must be exactly 10 digits</p>
                )}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Enter your full address"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-green-600 text-white py-3 rounded-xl text-base font-bold hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Min. 5 characters"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-300 rounded-xl text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  placeholder="Re-enter new password"
                />
              </div>

              <button
                type="submit"
                disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                className="w-full bg-orange-600 text-white py-3 rounded-xl text-base font-bold hover:bg-orange-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Account Info */}
          {profile && (
            <div className="mt-6 bg-gray-100 rounded-xl p-4 text-sm text-gray-600">
              <p><strong>Account Created:</strong> {new Date(profile.createdAt).toLocaleDateString()}</p>
              <p className="mt-1"><strong>Account ID:</strong> {profile.id}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
