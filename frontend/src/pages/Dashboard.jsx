// frontend/src/pages/Dashboard.jsx

import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function Dashboard() {
  const [me, setMe] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/auth/me');
        setMe(data.user);
        const mine = await api.get('/bookings/mine');
        setBookings(mine.data);
      } catch {
        setErr('Please login first.');
      }
    })();
  }, []);

  if (err) return <div className="max-w-3xl mx-auto p-6">{err}</div>;
  if (!me) return <div className="max-w-3xl mx-auto p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold">Welcome, {me.name}</h1>
      <p className="text-gray-600">Role: {me.role}</p>

      <h2 className="text-xl font-semibold mt-6">My Bookings</h2>
      <ul className="mt-2 space-y-2">
        {bookings.map(b => (
          <li key={b._id} className="border rounded p-3 bg-white">
            <div className="flex justify-between">
              <span>{b.service?.title} • {new Date(b.createdAt).toLocaleString()}</span>
              <span className="font-semibold">{b.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
