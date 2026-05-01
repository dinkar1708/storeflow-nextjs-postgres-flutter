'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/enums';
import { useCart } from '@/contexts/CartContext';

interface WishlistItem {
  id: string;
  productId: string;
  createdAt: string;
  product: {
    id: string;
    name: string;
    description: string | null;
    price: number | string;
    stock: number;
    isActive: boolean;
    category: { id: string; name: string };
  };
}

export default function CustomerWishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (
      status === 'authenticated' &&
      (session?.user as any)?.role !== UserRole.CUSTOMER
    ) {
      router.push('/403');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (
      status === 'authenticated' &&
      (session?.user as any)?.role === UserRole.CUSTOMER
    ) {
      fetchWishlist();
    }
  }, [status, session]);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/wishlist');
      if (res.ok) {
        const data = await res.json();
        setItems(data.items ?? []);
      } else {
        setItems([]);
      }
    } catch (e) {
      console.error('Error fetching wishlist:', e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId: string) => {
    if (!confirm('Remove this item from your wishlist?')) return;
    try {
      const res = await fetch(`/api/wishlist/${productId}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.productId !== productId));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to remove');
      }
    } catch (e) {
      console.error('Error removing wishlist item:', e);
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    if (item.product.stock <= 0) {
      alert('This product is out of stock');
      return;
    }
    addToCart({
      id: item.product.id,
      name: item.product.name,
      price: Number(item.product.price),
      quantity: 1,
      stock: item.product.stock,
    });
    router.push('/customer/cart');
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

  return (
    <div className="min-h-screen">
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
              <h1 className="text-xl font-bold text-gray-900">My Wishlist</h1>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                {items.length} item{items.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {items.length === 0 ? (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <p className="text-gray-500 mb-4">Your wishlist is empty.</p>
              <button
                onClick={() => router.push('/customer/products')}
                className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-md hover:brightness-110 shadow-md shadow-emerald-500/30 text-sm font-medium"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => {
                const p = item.product;
                const outOfStock = p.stock <= 0;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                          {p.category.name}
                        </span>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {p.description || 'No description available'}
                      </p>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            ${Number(p.price).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {outOfStock ? 'Out of stock' : `${p.stock} in stock`}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleAddToCart(item)}
                          disabled={outOfStock}
                          className={`flex-1 px-4 py-2 rounded-md font-medium text-sm ${
                            outOfStock
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {outOfStock ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                        <button
                          onClick={() => handleRemove(p.id)}
                          className="px-3 py-2 rounded-md font-medium text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
