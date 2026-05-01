import Link from 'next/link';

export const metadata = {
  title: 'Customer view · StoreFlow Demo',
};

const products = [
  { id: 'p1', name: 'Wireless Headphones', category: 'Electronics', price: 149.99, stock: 24, blurb: 'Noise-cancelling, 30h battery' },
  { id: 'p2', name: 'Cotton Tee', category: 'Apparel', price: 19.99, stock: 120, blurb: '100% organic, unisex' },
  { id: 'p3', name: 'Stainless Bottle', category: 'Home', price: 24.50, stock: 0, blurb: 'Keeps cold for 24h' },
  { id: 'p4', name: 'Yoga Mat', category: 'Fitness', price: 39.00, stock: 17, blurb: '6mm, non-slip' },
  { id: 'p5', name: 'LED Desk Lamp', category: 'Home', price: 45.00, stock: 8, blurb: '5 brightness levels' },
  { id: 'p6', name: 'Bluetooth Speaker', category: 'Electronics', price: 79.00, stock: 32, blurb: 'IPX7 waterproof' },
];

const cart = [
  { name: 'Wireless Headphones', qty: 1, price: 149.99 },
  { name: 'Cotton Tee', qty: 2, price: 19.99 },
];

const wishlist = [
  { name: 'LED Desk Lamp', price: 45.00, category: 'Home' },
  { name: 'Yoga Mat', price: 39.00, category: 'Fitness' },
];

const orders = [
  { id: 'ORD-9421', date: '2026-04-28', total: 189.97, status: 'SHIPPED' },
  { id: 'ORD-9389', date: '2026-04-21', total: 79.00, status: 'DELIVERED' },
  { id: 'ORD-9355', date: '2026-04-12', total: 264.49, status: 'DELIVERED' },
];

const statusColor: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-yellow-100 text-yellow-800',
  PACKED: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-indigo-100 text-indigo-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const cartSubtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);

export default function CustomerDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo banner */}
      <div className="bg-amber-100 text-amber-900 text-center text-sm py-2 border-b border-amber-200">
        Demo · Sample data only — no real account, no real orders.
      </div>

      {/* Top nav */}
      <nav className="bg-white shadow-sm border-b-4 border-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-gray-600 hover:text-gray-900">← Back to Demo</Link>
            <h1 className="text-xl font-bold text-gray-900">Customer view</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">CUSTOMER</span>
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md">Login</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Welcome */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, Alex 👋</h2>
          <p className="text-gray-600 mt-1">Here’s what your dashboard looks like.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded p-4">
              <div className="text-sm text-gray-600">Active orders</div>
              <div className="text-3xl font-bold text-blue-600 mt-1">1</div>
            </div>
            <div className="bg-green-50 rounded p-4">
              <div className="text-sm text-gray-600">Lifetime orders</div>
              <div className="text-3xl font-bold text-green-600 mt-1">14</div>
            </div>
            <div className="bg-purple-50 rounded p-4">
              <div className="text-sm text-gray-600">Wishlist items</div>
              <div className="text-3xl font-bold text-purple-600 mt-1">{wishlist.length}</div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section>
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Browse products</h2>
              <p className="text-gray-600 text-sm">Search, filter by category, view stock in real time.</p>
            </div>
            <div className="hidden sm:flex gap-2">
              <input disabled placeholder="Search products…" className="px-3 py-2 border rounded-md bg-white text-sm w-48" />
              <select disabled className="px-3 py-2 border rounded-md bg-white text-sm">
                <option>All Categories</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{p.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">{p.category}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{p.blurb}</p>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <p className="text-2xl font-bold text-green-600">${p.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-2 rounded-md font-medium bg-white border border-purple-300 text-purple-700">♥</button>
                      <button className={`px-4 py-2 rounded-md font-medium ${p.stock > 0 ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-500'}`}>{p.stock > 0 ? 'View' : 'Out of Stock'}</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Cart + Wishlist */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🛒 Your cart</h2>
            <div className="divide-y">
              {cart.map((i) => (
                <div key={i.name} className="py-3 flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900">{i.name}</div>
                    <div className="text-sm text-gray-500">Qty {i.qty} × ${i.price.toFixed(2)}</div>
                  </div>
                  <div className="font-semibold text-gray-900">${(i.qty * i.price).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <div className="border-t mt-4 pt-4 flex justify-between items-center">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-2xl font-bold text-green-600">${cartSubtotal.toFixed(2)}</span>
            </div>
            <button className="mt-4 w-full px-4 py-3 bg-green-600 text-white rounded-md font-medium">Checkout</button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">♥ Your wishlist</h2>
            <div className="space-y-3">
              {wishlist.map((w) => (
                <div key={w.name} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <div className="font-medium text-gray-900">{w.name}</div>
                    <div className="text-xs text-gray-500">{w.category}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-green-600">${w.price.toFixed(2)}</div>
                    <button className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md">Add to cart</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Orders */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📜 Recent orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Order #</th>
                  <th className="text-left px-4 py-2 font-medium">Date</th>
                  <th className="text-left px-4 py-2 font-medium">Total</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td className="px-4 py-3 font-mono">{o.id}</td>
                    <td className="px-4 py-3 text-gray-600">{o.date}</td>
                    <td className="px-4 py-3 font-semibold">${o.total.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Cross-link */}
        <section className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-3">Want to see what staff & admins see?</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/demo/staff" className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700">Staff view →</Link>
            <Link href="/demo/admin" className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700">Admin view →</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
