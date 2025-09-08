// frontend/src/pages/Browse.jsx

import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import ServiceCard from '../components/ServiceCard';
import SectionHeading from '../components/SectionHeading';
import Button from '../components/Button';

const CATS = ['Furniture Assembly','Moving Help','Mounting & Installation','Cleaning','Yardwork','Handyman','Delivery'];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Browse() {
  const q = useQuery();
  const nav = useNavigate();
  const [query, setQuery] = useState(q.get('q') || '');
  const [category, setCategory] = useState(q.get('category') || '');
  const [min, setMin] = useState(q.get('min') || '');
  const [max, setMax] = useState(q.get('max') || '');
  const [sort, setSort] = useState('recent');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function pushUrl() {
    const p = new URLSearchParams();
    if (query) p.set('q', query);
    if (category) p.set('category', category);
    if (min) p.set('min', min);
    if (max) p.set('max', max);
    nav(`/browse?${p.toString()}`, { replace: true });
  }

  async function fetchItems() {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (min) params.set('min', min);
    if (max) params.set('max', max);
    const { data } = await api.get(`/services?${params.toString()}`);
    let arr = data;
    if (sort === 'price-asc') arr = [...arr].sort((a,b)=>a.price-b.price);
    if (sort === 'price-desc') arr = [...arr].sort((a,b)=>b.price-a.price);
    setItems(arr);
    setLoading(false);
  }

  useEffect(() => { fetchItems(); }, [sort]); // eslint-disable-line

  return (
    <div className="container-max py-10">
      <SectionHeading title="Browse services" subtitle="Filter by category, price, and keywords." />
      <div className="mt-6 grid md:grid-cols-4 gap-6">
        {/* Filters */}
        <aside className="card p-4 space-y-4 h-fit">
          <div>
            <label className="text-sm text-slate-600">Search</label>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="e.g., 'mount tv'" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
          </div>
          <div>
            <label className="text-sm text-slate-600">Category</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATS.map(c => (
                <button
                  key={c}
                  onClick={()=>setCategory(c===category?'':c)}
                  className={`badge ${c===category?'bg-brand-600 text-white':'bg-slate-100 text-slate-700'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm text-slate-600">Min $</label>
              <input value={min} onChange={e=>setMin(e.target.value)} type="number" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
            <div>
              <label className="text-sm text-slate-600">Max $</label>
              <input value={max} onChange={e=>setMax(e.target.value)} type="number" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-600">Sort</label>
            <select value={sort} onChange={e=>setSort(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2">
              <option value="recent">Most recent</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => { pushUrl(); fetchItems(); }}>Apply</Button>
            <button className="btn-ghost" onClick={() => { setQuery(''); setCategory(''); setMin(''); setMax(''); setSort('recent'); nav('/browse'); fetchItems(); }}>Reset</button>
          </div>
        </aside>

        {/* Results */}
        <section className="md:col-span-3">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="card h-64 animate-pulse" />)}
            </div>
          ) : items.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(s => <ServiceCard key={s._id} s={s} />)}
            </div>
          ) : (
            <div className="card p-8">
              <p className="text-slate-600">No results. Try different filters.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}