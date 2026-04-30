'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserRole } from '@/lib/enums';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: {
    id: string;
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
}

export default function CustomerProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== UserRole.CUSTOMER) {
      router.push('/403');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && (session?.user as any)?.role === UserRole.CUSTOMER) {
      fetchProducts();
      fetchCategories();
    }
  }, [status, session]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();

      if (response.ok) {
        setProducts(data.products);
      } else {
        alert('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error fetching products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message || 'Added to wishlist');
      } else {
        alert(data.error || 'Failed to add to wishlist');
      }
    } catch (e) {
      console.error('Error adding to wishlist:', e);
      alert('Error adding to wishlist');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();

      if (response.ok) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
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

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === '' || product.category.id === filterCategory;

    return matchesSearch && matchesCategory;
  });

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
              <h1 className="text-xl font-bold text-gray-900">Products</h1>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                CUSTOMER
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Search products by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {(searchQuery || filterCategory) && (
              <div className="mt-2 text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            )}
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500">
                {products.length === 0
                  ? 'No products available at the moment.'
                  : 'No products match your search.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        {product.category.name}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description || 'No description available'}
                    </p>

                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          ${Number(product.price).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToWishlist(product.id)}
                          title="Add to Wishlist"
                          className="px-3 py-2 rounded-md font-medium bg-white border border-purple-300 text-purple-700 hover:bg-purple-50"
                        >
                          ♥
                        </button>
                        <button
                          onClick={() => router.push(`/products/${product.id}`)}
                          disabled={product.stock === 0}
                          className={`px-4 py-2 rounded-md font-medium ${
                            product.stock > 0
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {product.stock > 0 ? 'View Details' : 'Out of Stock'}
                        </button>
                      </div>
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
