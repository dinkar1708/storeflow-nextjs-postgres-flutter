'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { UserRole, PaymentMethod } from '@/lib/enums';

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethod.CASH);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== UserRole.CUSTOMER) {
      router.push('/403');
    }
  }, [status, session, router]);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      setPlacing(true);

      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        total: getCartTotal(),
        paymentMethod,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Order placed successfully!\nOrder ID: ${data.order.id}\nTotal: $${getCartTotal().toFixed(2)}\n\nPayment Method: ${paymentMethod.toUpperCase()}`);
        clearCart();
        router.push('/customer/orders');
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (status === 'loading') {
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
                onClick={() => router.push('/customer/products')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Continue Shopping
              </button>
              <h1 className="text-xl font-bold text-gray-900">Shopping Cart</h1>
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
          {cart.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
              <button
                onClick={() => router.push('/customer/products')}
                className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                      </div>

                      <div className="flex items-center space-x-6">
                        {/* Quantity Controls */}
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-700 hover:bg-gray-100 font-bold"
                          >
                            −
                          </button>
                          <span className="px-4 py-1 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className={`px-3 py-1 font-bold ${
                              item.quantity >= item.stock
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            +
                          </button>
                        </div>

                        {/* Subtotal */}
                        <div className="text-right min-w-[100px]">
                          <p className="font-bold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                      <span>${getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">${getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
                    >
                      <option value={PaymentMethod.CASH}>Cash on Delivery</option>
                      <option value={PaymentMethod.CARD}>Credit/Debit Card</option>
                      <option value={PaymentMethod.UPI}>UPI Payment</option>
                      <option value={PaymentMethod.NET_BANKING}>Net Banking</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">
                      Payment will be processed on delivery (Demo mode)
                    </p>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    className={`w-full px-6 py-3 rounded-md font-medium text-lg mb-3 ${
                      placing
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    } text-white`}
                  >
                    {placing ? 'Placing Order...' : 'Place Order'}
                  </button>

                  <button
                    onClick={() => router.push('/customer/products')}
                    className="w-full px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
