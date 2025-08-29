// frontend/src/pages/Login.jsx
import { useState } from 'react';
import api, { setAuth } from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  async function submit() {
    setMsg('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data.token);
      setMsg('Logged in!');
      nav('/');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setMsg(message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="grid gap-3">
        <input placeholder="Email" className="border p-2 rounded" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" className="border p-2 rounded" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">Login</button>
        {msg && <p className="text-red-600 mt-2">{msg}</p>}
      </div>
    </div>
  );
}