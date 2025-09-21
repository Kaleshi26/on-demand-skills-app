// frontend/src/pages/NewService.jsx
import { useState } from 'react';
import api from '../lib/api';

export default function NewService() {
  const [form, setForm] = useState({ title: '', description: '', category: '', price: 0, tags: '' });
  const [msg, setMsg] = useState('');

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit() {
    try {
      const payload = { ...form, price: Number(form.price), tags: form.tags.split(',').map(t=>t.trim()).filter(Boolean) };
      await api.post('/services', payload);
      setMsg('Service posted!');
    } catch {
      setMsg('Please login as a provider first.');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Post a Service</h1>
      <div className="grid gap-3">
        <input name="title" placeholder="Title" className="border p-2 rounded" onChange={onChange} />
        <textarea name="description" placeholder="Description" className="border p-2 rounded" onChange={onChange} />
        <input name="category" placeholder="Category (e.g., Bike Repair)" className="border p-2 rounded" onChange={onChange} />
        <input name="price" type="number" placeholder="Price" className="border p-2 rounded" onChange={onChange} />
        <input name="tags" placeholder="Tags (comma separated)" className="border p-2 rounded" onChange={onChange} />
        <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
        {msg && <p className="text-green-700">{msg}</p>}
      </div>
    </div>
  );
}
