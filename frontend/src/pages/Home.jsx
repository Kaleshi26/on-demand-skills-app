// frontend/src/pages/Home.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import ServiceCard from '../components/ServiceCard';
import CategoryCard from '../components/CategoryCard';
import Testimonials from '../components/Testimonials';

const CATEGORIES = [
  { name: 'Furniture Assembly', image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Moving Help', image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Mounting & Installation', image: 'https://images.unsplash.com/photo-1519558260268-cde7e03a0153?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Cleaning', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1200&auto=format&fit=crop' },
];

export default function Home() {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchPopular() {
    setLoading(true);
    const { data } = await api.get('/services');
    setItems(data.slice(0, 6));
    setLoading(false);
  }

  useEffect(() => { fetchPopular(); }, []);

  function submitSearch(e) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    nav(`/browse?q=${encodeURIComponent(query)}`);
  }

  const stats = useMemo(() => ([
    { label: 'Tasks completed', value: '890k+' },
    { label: 'Active providers', value: '65k+' },
    { label: 'Avg. rating', value: '4.8/5' },
    { label: 'Cities served', value: '120+' },
  ]), []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white" />
        <div className="container-max relative py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1 shadow-soft">
                <span className="h-2 w-2 rounded-full bg-brand-500"></span>
                <span className="text-sm font-medium text-slate-700">Book trusted local help</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                Get things done, today.
              </h1>
              <p className="text-lg text-slate-600 max-w-xl">
                From bike repair to TV mounting—find rated pros near you, compare prices, and book in minutes.
              </p>

              <form onSubmit={submitSearch} className="flex gap-2">
                <input
                  value={q}
                  onChange={e => setQ(e.target.value)}
                  placeholder="What do you need help with? e.g., 'Fix bike tire'"
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 shadow-soft focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <Button type="submit">Search</Button>
              </form>

              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="text-slate-500">Popular:</span>
                {['Furniture Assembly', 'Mount TV', 'Cleaning'].map((t) => (
                  <button
                    key={t}
                    onClick={() => nav(`/browse?q=${encodeURIComponent(t)}`)}
                    className="badge-brand"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                className="rounded-3xl shadow-soft border border-slate-100"
                src="https://images.unsplash.com/photo-1604881991720-f91add269bed?q=80&w=1200&auto=format&fit=crop"
                alt="Hero"
              />
              <div className="absolute -bottom-6 -left-6 card p-4">
                <p className="text-sm text-slate-600">Same‑day availability in most cities</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {stats.map((s, i) => (
              <div key={i} className="card p-5 text-center">
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-sm text-slate-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-max py-12">
        <SectionHeading
          eyebrow="Browse categories"
          title="What do you need help with?"
          subtitle="Pick a category to see Taskers nearby."
          center
        />
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          {CATEGORIES.map((c) => (
            <CategoryCard key={c.name} name={c.name} image={c.image} />
          ))}
        </div>
      </section>

      {/* Popular services */}
      <section className="container-max py-12">
        <SectionHeading eyebrow="Popular now" title="Top rated services near you" center />
        <div className="mt-8">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((s) => <ServiceCard key={s._id} s={s} />)}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="container-max py-12">
        <SectionHeading eyebrow="How it works" title="Book help in 3 easy steps" center />
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            { step: 1, title: 'Tell us what you need', text: 'Describe your task and choose a time.' },
            { step: 2, title: 'Pick your Tasker', text: 'Compare prices and reviews, then book.' },
            { step: 3, title: 'Get it done', text: 'Your Tasker arrives and finishes the job.' },
          ].map((x) => (
            <div key={x.step} className="card p-6">
              <div className="h-10 w-10 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold">{x.step}</div>
              <h3 className="mt-4 font-semibold text-lg">{x.title}</h3>
              <p className="text-slate-600">{x.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="container-max py-12">
        <SectionHeading eyebrow="Loved by users" title="What people are saying" center />
        <div className="mt-8">
          <Testimonials />
        </div>
      </section>

      {/* Provider CTA */}
      <section className="container-max py-14">
        <div className="card p-8 md:p-12 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-extrabold">Got skills? Earn as a provider.</h3>
            <p className="text-slate-600 mt-2">Set your rates, choose your schedule, and get paid for helping in your community.</p>
          </div>
          <Button onClick={() => nav('/become-a-provider')} className="w-full md:w-auto">Become a provider</Button>
        </div>
      </section>
    </div>
  );
}