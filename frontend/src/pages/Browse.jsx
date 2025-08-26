import { useEffect, useState } from 'react';
import api from '../lib/api';
import ServiceCard from '../components/ServiceCard';

export default function Browse() {
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchItems() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    const { data } = await api.get(`/services?${params.toString()}`);
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-2 mb-4">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search 'fix bike tire'..." className="border p-2 rounded w-full" />
        <button onClick={fetchItems} className="px-4 py-2 bg-blue-600 text-white rounded">Search</button>
      </div>

      {loading ? <p>Loading…</p> : (
        items.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(s => <ServiceCard key={s._id} s={s} />)}
          </div>
        ) : <p>No services yet. Be the first to <a href="/new-service" className="text-blue-600 underline">post one</a>.</p>
      )}
    </div>
  );
}
