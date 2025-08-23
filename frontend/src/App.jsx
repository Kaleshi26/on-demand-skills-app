export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="p-4 shadow bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">On‑Demand Skills</h1>
          <nav className="space-x-4">
            <a href="#" className="hover:underline">Browse</a>
            <a href="#" className="hover:underline">Login</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="rounded-2xl p-10 bg-white shadow">
          <h2 className="text-2xl font-semibold mb-4">Find local help fast</h2>
          <p className="mb-6">Search services like bike repair, guitar tuning, or pet grooming near you.</p>
          <input className="w-full border rounded-lg p-3" placeholder="Try 'fix bike tire'..." />
          <p className="text-sm mt-4 text-gray-500">Backend health: <code>/api/health</code></p>
        </div>
      </main>
    </div>
  );
}
