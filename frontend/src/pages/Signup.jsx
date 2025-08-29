// frontend/src/pages/Signup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Signup() {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [msg, setMsg] = useState('');
  const nav = useNavigate();

  async function submit() {
    setMsg('');
    try {
      await signup({ name, email, password, role });
      nav('/');
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Signup failed';
      setMsg(message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sign up</h1>
      <div className="grid gap-3">
        <input placeholder="Name" className="border p-2 rounded" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Email" className="border p-2 rounded" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" className="border p-2 rounded" value={password} onChange={e=>setPassword(e.target.value)} />
        <select className="border p-2 rounded" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="customer">Customer</option>
          <option value="provider">Provider</option>
        </select>
        <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">Create account</button>
        {msg && <p className="text-red-600 mt-2">{msg}</p>}
      </div>
    </div>
  );
}