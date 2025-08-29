// frontend/src/pages/BecomeProvider.jsx
import { useState } from 'react';
import api from '../lib/api';
import Button from '../components/Button';

export default function BecomeProvider() {
  const [msg, setMsg] = useState('');

  async function submit() {
    try {
      await api.post('/auth/become-provider');
      setMsg('You are now a provider! Post your first service.');
    } catch {
      setMsg('Please login first.');
    }
  }

  return (
    <div className="container-max py-10 grid md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-extrabold">Become a provider</h1>
        <p className="text-slate-600">Set your rates, choose categories, and start earning.</p>
        <ul className="list-disc pl-5 text-slate-700">
          <li>Flexible schedule</li>
          <li>Instant payouts</li>
          <li>In‑app messaging and reviews</li>
        </ul>
        <Button onClick={submit} className="mt-2">Become a provider</Button>
        {msg && <p className="text-brand-700">{msg}</p>}
      </div>
      <img className="rounded-2xl shadow-soft border border-slate-100"
        src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop" alt="Provider" />
    </div>
  );
}