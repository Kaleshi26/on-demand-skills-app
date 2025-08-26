import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';

export default function ServiceDetail() {
  const { id } = useParams();
  const [s, setS] = useState(null);
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/services/${id}`);
      setS(data);
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

  if (!s) return <div className="max-w-3xl mx-auto p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">{s.title}</h1>
      <p className="text-gray-600 mt-1">{s.category} • by {s.owner?.name}</p>
      <p className="mt-4">{s.description}</p>
      <p className="mt-2 text-xl font-semibold">${s.price}</p>

      <div className="mt-6 space-y-2">
        <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} className="border p-2 rounded w-full" />
        <textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Notes" className="border p-2 rounded w-full" />
        <button onClick={book} className="px-4 py-2 bg-blue-600 text-white rounded">Book Now</button>
        {msg && <p className="text-green-700">{msg}</p>}
      </div>
    </div>
  );
}
