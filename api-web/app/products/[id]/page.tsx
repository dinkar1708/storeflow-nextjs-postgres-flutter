'use client';

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  sku: string;
  category: {
    id: string;
    name: string;
  };
  isActive: boolean;
  images: string[];
}

export default function ProductDetailPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const userRole = (session?.user as any)?.role;
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${productId}`);
      const data = await response.json();

      if (response.ok) {
        setProduct(data.product);
      } else {
        alert('Product not found');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: quantity,
      stock: product.stock,
    });

    alert(`Added ${quantity} ${product.name} to cart!`);
    router.push('/customer/cart');
  };

  const handleAddToWishlist = async () => {
    if (!product) return;
    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
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

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleEditProduct = () => {
    router.push(`/admin/products`);
  };

  const handleUpdateStock = () => {
    alert('Update stock feature coming soon');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Product not found</div>
      </div>
    );
  }

  // Determine header color based on role
  const getHeaderColor = () => {
    if (userRole === 'ADMIN') return 'border-red-600';
    if (userRole === 'STAFF') return 'border-blue-600';
    if (userRole === 'CUSTOMER') return 'border-green-600';
    return 'border-gray-600';
  };

  const getRoleBadge = () => {
    if (userRole === 'ADMIN') return 'bg-red-100 text-red-800';
    if (userRole === 'STAFF') return 'bg-blue-100 text-blue-800';
    if (userRole === 'CUSTOMER') return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getBackUrl = () => {
    if (userRole === 'ADMIN') return '/admin/dashboard';
    if (userRole === 'STAFF') return '/staff/dashboard';
    if (userRole === 'CUSTOMER') return '/customer/products';
    return '/';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className={`bg-white shadow-sm border-b-4 ${getHeaderColor()}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push(getBackUrl())}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back
              </button>
              <h1 className="text-xl font-bold text-gray-900">Product Details</h1>
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <span className="text-gray-700">
                    <strong>{session.user?.name}</strong>
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge()}`}>
                    {userRole || 'GUEST'}
                  </span>
                </>
              ) : (
                <button
                  onClick={() => router.push('/login')}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
              {/* Product Image */}
              <div className="bg-gray-100 rounded-lg flex items-center justify-center h-96">
                <div className="text-gray-400 text-6xl">📦</div>
              </div>

              {/* Product Info */}
              <div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    {product.category.name}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <p className="text-4xl font-bold text-green-600 mb-6">
                  ${Number(product.price).toFixed(2)}
                </p>

                <div className="mb-6">
                  <p className="text-gray-600 mb-2">
                    {product.description || 'No description available'}
                  </p>
                </div>

                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">SKU:</span>
                    <span className="font-medium">{product.sku || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Stock:</span>
                    <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                      {product.stock} units
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                {/* Role-Based Actions */}
                <div className="border-t pt-6">
                  {/* CUSTOMER: Add to Cart */}
                  {userRole === 'CUSTOMER' && product.isActive && product.stock > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">Quantity:</label>
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={decrementQuantity}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 font-bold text-xl"
                          >
                            −
                          </button>
                          <span className="px-6 py-2 font-medium text-lg">{quantity}</span>
                          <button
                            onClick={incrementQuantity}
                            disabled={quantity >= product.stock}
                            className={`px-4 py-2 font-bold text-xl ${
                              quantity >= product.stock
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm text-gray-500">
                          Max: {product.stock}
                        </span>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-lg"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={handleAddToWishlist}
                        className="w-full px-6 py-3 bg-white border border-purple-300 text-purple-700 rounded-md hover:bg-purple-50 font-medium text-lg"
                      >
                        ♥ Add to Wishlist
                      </button>
                    </div>
                  )}

                  {/* CUSTOMER: Out of Stock */}
                  {userRole === 'CUSTOMER' && product.stock === 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-red-800 font-medium">Out of Stock</p>
                    </div>
                  )}

                  {/* ADMIN: Edit Product */}
                  {userRole === 'ADMIN' && (
                    <div className="space-y-3">
                      <button
                        onClick={handleEditProduct}
                        className="w-full px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                      >
                        Edit Product
                      </button>
                      <button className="w-full px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium">
                        View Analytics
                      </button>
                    </div>
                  )}

                  {/* STAFF: Update Stock */}
                  {userRole === 'STAFF' && (
                    <div className="space-y-3">
                      <button
                        onClick={handleUpdateStock}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                      >
                        Update Stock
                      </button>
                      <button className="w-full px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-medium">
                        Process Orders
                      </button>
                    </div>
                  )}

                  {/* GUEST: Login to Purchase */}
                  {!session && product.isActive && (
                    <button
                      onClick={() => router.push('/login')}
                      className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium text-lg"
                    >
                      Login to Purchase
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
