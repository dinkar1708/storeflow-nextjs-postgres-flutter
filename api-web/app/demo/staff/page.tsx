import Link from 'next/link';

export const metadata = {
  title: 'Staff view · StoreFlow Demo',
};

const queue = [
  { id: 'ORD-9421', customer: 'Alex Chen', items: 3, total: 189.97, age: '2h', status: 'PROCESSING' },
  { id: 'ORD-9420', customer: 'Priya Patel', items: 1, total: 45.00, age: '3h', status: 'PROCESSING' },
  { id: 'ORD-9418', customer: 'Marco Diaz', items: 5, total: 312.40, age: '5h', status: 'PACKED' },
  { id: 'ORD-9415', customer: 'Sara Johansson', items: 2, total: 99.50, age: '8h', status: 'PACKED' },
  { id: 'ORD-9410', customer: 'Liang Wei', items: 4, total: 220.00, age: '1d', status: 'SHIPPED' },
  { id: 'ORD-9402', customer: 'Yara Khalil', items: 1, total: 19.99, age: '1d', status: 'CONFIRMED' },
];

const lowStock = [
  { name: 'Stainless Bottle', sku: 'SB-001', stock: 0, threshold: 10 },
  { name: 'LED Desk Lamp', sku: 'LL-014', stock: 3, threshold: 10 },
  { name: 'Yoga Mat', sku: 'YM-220', stock: 5, threshold: 15 },
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

const counts = {
  pending: 4,
  processing: queue.filter((q) => q.status === 'PROCESSING').length,
  packed: queue.filter((q) => q.status === 'PACKED').length,
  shipped: queue.filter((q) => q.status === 'SHIPPED').length,
};

export default function StaffDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-amber-100 text-amber-900 text-center text-sm py-2 border-b border-amber-200">
        Demo · Sample data only.
      </div>

      <nav className="bg-white shadow-sm border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-gray-600 hover:text-gray-900">← Back to Demo</Link>
            <h1 className="text-xl font-bold text-gray-900">Staff view</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">STAFF</span>
            <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">Login</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900">Fulfillment dashboard</h2>
          <p className="text-gray-600 mt-1">Move orders through the pipeline. Update stock as you pick.</p>
        </section>

        {/* Pipeline counts */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Pending', count: counts.pending, color: 'gray', icon: '🕒' },
            { label: 'Processing', count: counts.processing, color: 'yellow', icon: '⚙️' },
            { label: 'Packed', count: counts.packed, color: 'purple', icon: '📦' },
            { label: 'Shipped today', count: counts.shipped, color: 'indigo', icon: '🚚' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-lg shadow p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm text-gray-500">{s.label}</div>
                  <div className="text-3xl font-bold text-gray-900 mt-1">{s.count}</div>
                </div>
                <div className="text-2xl">{s.icon}</div>
              </div>
            </div>
          ))}
        </section>

        {/* Order queue */}
        <section className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order queue</h2>
              <p className="text-sm text-gray-500">Click an order to step it forward.</p>
            </div>
            <div className="flex gap-2 text-sm">
              <button className="px-3 py-1.5 border rounded-md bg-white">All</button>
              <button className="px-3 py-1.5 border rounded-md bg-yellow-50 text-yellow-800 border-yellow-200">Processing</button>
              <button className="px-3 py-1.5 border rounded-md bg-purple-50 text-purple-800 border-purple-200">Packed</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Order</th>
                  <th className="text-left px-4 py-2 font-medium">Customer</th>
                  <th className="text-left px-4 py-2 font-medium">Items</th>
                  <th className="text-left px-4 py-2 font-medium">Total</th>
                  <th className="text-left px-4 py-2 font-medium">Age</th>
                  <th className="text-left px-4 py-2 font-medium">Status</th>
                  <th className="text-left px-4 py-2 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {queue.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono">{o.id}</td>
                    <td className="px-4 py-3 text-gray-700">{o.customer}</td>
                    <td className="px-4 py-3">{o.items}</td>
                    <td className="px-4 py-3 font-semibold">${o.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-gray-500">{o.age}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-xs font-medium">Advance →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Stock alerts */}
        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">⚠️ Low stock alerts</h2>
          <p className="text-sm text-gray-500 mb-4">Items at or below threshold.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lowStock.map((s) => (
              <div key={s.sku} className={`rounded-lg p-4 border ${s.stock === 0 ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-gray-900">{s.name}</div>
                    <div className="text-xs text-gray-500 font-mono">{s.sku}</div>
                  </div>
                  <span className={`text-2xl font-bold ${s.stock === 0 ? 'text-red-600' : 'text-yellow-700'}`}>{s.stock}</span>
                </div>
                <div className="mt-3 text-xs text-gray-600">Threshold: {s.threshold}</div>
                <button className="mt-3 w-full px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md">Update stock</button>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-link */}
        <section className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-3">Compare with the other roles:</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Link href="/demo/customer" className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700">Customer view →</Link>
            <Link href="/demo/admin" className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700">Admin view →</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
