// frontend/src/pages/ServiceDetail.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';
import Button from '../components/Button';

export default function ServiceDetail() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/services/${id}`);
      setS(data);
      try {
        const r = await api.get(`/services/${id}/reviews`);
        setReviews(r.data);
      } catch {}
    })();
  }, [id]);

  async function book() {
    try {
      await api.post('/bookings', { serviceId: id, scheduledAt: date, notes });
      setMsg('Booking requested!');
    } catch {
      setMsg('Please login as a customer first.');
    }
  }

  async function submitReview() {
    try {
      const { data } = await api.post(`/services/${id}/reviews`, { rating: Number(rating), text });
      setReviews([data, ...reviews]);
      setRating(5);
      setText('');
    } catch {
      // ignore
    }
  }

  if (!s) return <div className="container-max p-6">Loading…</div>;

  return (
    <div className="container-max py-8 grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        <img src={s.cover || `https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop`} className="w-full h-72 object-cover rounded-2xl card" />
        <div className="card p-6 space-y-2">
          <h1 className="text-2xl font-bold">{s.title}</h1>
          <p className="text-slate-600">{s.category} • by {s.owner?.name}</p>
          <p className="mt-2">{s.description}</p>
          <p className="text-xl font-semibold mt-2">${s.price}</p>
        </div>

        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-3">Reviews</h2>
          <div className="space-y-3">
            {reviews.length ? reviews.map(r => (
              <div key={r._id} className="border-b last:border-none pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{r.author?.name || 'User'}</span>
                  <span className="text-sm text-slate-500">★ {r.rating}/5</span>
                </div>
                <p className="text-slate-700">{r.text}</p>
              </div>
            )) : <p className="text-slate-600">No reviews yet.</p>}
          </div>

          <div className="mt-4 grid md:grid-cols-4 gap-2">
            <select value={rating} onChange={e=>setRating(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
              {[5,4,3,2,1].map(n=> <option key={n} value={n}>{n} stars</option>)}
            </select>
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a short review…" className="md:col-span-2 rounded-lg border border-slate-300 px-3 py-2" />
            <Button onClick={submitReview}>Submit</Button>
          </div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="card p-6">
          <h3 className="font-semibold text-lg">Book this service</h3>
          <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2" />
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes" className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2" />
          <Button onClick={book} className="mt-3 w-full">Book Now</Button>
          {msg && <p className="text-brand-700 mt-2">{msg}</p>}
        </div>
        <div className="card p-6">
          <p className="text-slate-600 text-sm">Safe, cashless payments • Verified providers • Rebooking made easy</p>
        </div>
      </aside>
    </div>
  );
}