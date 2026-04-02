'use client';

import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { OrderStatus, UserRole } from '@/lib/enums';

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    sku: string;
    price: number;
    costPrice: number;
  };
};

type Order = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  items: OrderItem[];
};

export default function OrderDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const orderId = params?.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const userRole = (session?.user as any)?.role as UserRole | undefined;

  const getStatusColor = (s: string) => {
    const colors: Record<string, string> = {
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
      [OrderStatus.PROCESSING]: 'bg-purple-100 text-purple-800',
      [OrderStatus.PACKED]: 'bg-indigo-100 text-indigo-800',
      [OrderStatus.SHIPPED]: 'bg-orange-100 text-orange-800',
      [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return colors[s] || 'bg-gray-100 text-gray-800';
  };

  const getBackUrl = () => {
    if (userRole === UserRole.CUSTOMER) return '/customer/orders';
    return '/admin/orders';
  };

  const statusClass = useMemo(() => {
    return order ? getStatusColor(order.status) : 'bg-gray-100 text-gray-800';
  }, [order]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (!orderId) return;

    const run = async () => {
      setLoading(true);
      setErrorMsg(null);
      setOrder(null);
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load order');
        setOrder(data.order);
      } catch (e: any) {
        setErrorMsg(e?.message ?? 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow p-6 max-w-md w-full">
          <div className="text-red-600 font-medium mb-2">Error</div>
          <div className="text-gray-700">{errorMsg}</div>
          <button
            onClick={() => router.push(getBackUrl())}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <button onClick={() => router.push(getBackUrl())} className="text-gray-600 hover:text-gray-900">
              ← Back
            </button>
            <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-wrap gap-6 justify-between items-start">
            <div>
              <div className="text-sm text-gray-500">Order ID</div>
              <div className="text-gray-900 font-medium">{order.id}</div>

              <div className="mt-3 text-sm text-gray-500">Status</div>
              <div className={`mt-1 inline-flex px-3 py-1 rounded-full text-sm font-semibold ${statusClass}`}>
                {order.status}
              </div>

              <div className="mt-4 text-sm text-gray-500">Placed</div>
              <div className="text-gray-900">{new Date(order.createdAt).toLocaleString()}</div>
            </div>

            <div>
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-lg font-semibold text-gray-900">
                ${Number(order.total).toFixed(2)}
              </div>

              <div className="mt-4 text-sm text-gray-700">
                Customer: <span className="font-medium">{order.user?.name}</span>
                <div className="text-gray-500">{order.user?.email}</div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-medium text-gray-900 mb-3">Items</div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 border rounded-md p-3">
                  <div>
                    <div className="font-medium text-gray-900">{item.product.name}</div>
                    <div className="text-sm text-gray-500">SKU: {item.product.sku}</div>
                    <div className="text-sm text-gray-700">Qty: {item.quantity}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Line Total</div>
                    <div className="font-semibold text-gray-900">
                      ${(Number(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

