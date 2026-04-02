'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole, OrderStatus } from '@/lib/enums';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    sku: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function CustomerOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== UserRole.CUSTOMER) {
      router.push('/403');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && (session?.user as any)?.role === UserRole.CUSTOMER) {
      fetchOrders();
    }
  }, [status, session]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      const data = await response.json();

      if (response.ok) {
        setOrders(data.orders);
      } else {
        alert('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [OrderStatus.CONFIRMED]: 'bg-blue-100 text-blue-800',
      [OrderStatus.PROCESSING]: 'bg-purple-100 text-purple-800',
      [OrderStatus.PACKED]: 'bg-indigo-100 text-indigo-800',
      [OrderStatus.SHIPPED]: 'bg-orange-100 text-orange-800',
      [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
      [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== UserRole.CUSTOMER) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/customer/dashboard')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-xl font-bold text-gray-900">My Orders</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                <strong>{session.user?.name}</strong>
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                {UserRole.CUSTOMER}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No orders yet</p>
              <button
                onClick={() => router.push('/customer/products')}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow">
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Order ID: {order.id.slice(0, 8)}</p>
                        <p className="text-sm text-gray-600">
                          Placed on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          ${Number(order.total).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="px-6 py-4">
                    <div className="space-y-3">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{item.product.name}</p>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <p className="font-medium text-gray-900">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
