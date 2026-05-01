'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole, OrderStatus, STATUS_FILTER_ALL } from '@/lib/enums';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(STATUS_FILTER_ALL);

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!session || (session.user as any)?.role !== UserRole.CUSTOMER) {
    return null;
  }

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      searchQuery === '' ||
      order.items.some(item => item.product.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === STATUS_FILTER_ALL || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <nav className="bg-white/70 backdrop-blur shadow-sm border-b-4 border-green-600">
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
          {/* Search and Filter */}
          {orders.length > 0 && (
            <div className="bg-white rounded-xl shadow p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="Search by product name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                  >
                    <option value={STATUS_FILTER_ALL}>All Status</option>
                    <option value={OrderStatus.PENDING}>Pending</option>
                    <option value={OrderStatus.CONFIRMED}>Confirmed</option>
                    <option value={OrderStatus.PROCESSING}>Processing</option>
                    <option value={OrderStatus.PACKED}>Packed</option>
                    <option value={OrderStatus.SHIPPED}>Shipped</option>
                    <option value={OrderStatus.DELIVERED}>Delivered</option>
                    <option value={OrderStatus.CANCELLED}>Cancelled</option>
                  </select>
                </div>
              </div>
              {(searchQuery || statusFilter !== STATUS_FILTER_ALL) && (
                <div className="mt-2 text-sm text-gray-600">
                  Showing {filteredOrders.length} of {orders.length} orders
                </div>
              )}
            </div>
          )}

          {filteredOrders.length === 0 && orders.length > 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <p className="text-gray-500">No orders match your search criteria.</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No orders yet</p>
              <button
                onClick={() => router.push('/customer/products')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-md hover:brightness-110 shadow-md shadow-emerald-500/30 font-medium"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl shadow hover:bg-gray-50 hover:shadow-md cursor-pointer transition-shadow"
                  onClick={() => router.push(`/orders/${order.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      router.push(`/orders/${order.id}`);
                    }
                  }}
                >
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
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">Items</p>
                        <p className="text-sm font-medium text-gray-900">
                          {order.items.length} item(s)
                        </p>
                      </div>

                      {order.items[0] ? (
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{order.items[0].product.name}</p>
                            <p className="text-sm text-gray-600">Qty: {order.items[0].quantity}</p>
                          </div>
                          <p className="font-medium text-gray-900">
                            ${(Number(order.items[0].price) * order.items[0].quantity).toFixed(2)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600">No items</p>
                      )}
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
