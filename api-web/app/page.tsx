export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-gray-900">StoreFlow</h1>
        <p className="text-xl text-gray-600 mb-8">
          Universal Inventory & Order Management Platform
        </p>
        <a
          href="/login"
          className="inline-block px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          Get Started
        </a>
      </div>
    </main>
  );
}
