// frontend/src/App.jsx
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Browse from './pages/Browse.jsx';
import ServiceDetail from './pages/ServiceDetail.jsx';
import NewService from './pages/NewService.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Dashboard from './pages/Dashboard.jsx';
import BecomeProvider from './pages/BecomeProvider.jsx';

export default function App() {
  const { user, ready, logout } = useAuth();
  const nav = useNavigate();

  function handleLogout() {
    logout();
    nav('/');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-bold">On‑Demand Skills</Link>

          {!ready ? (
            <div className="opacity-80">Loading…</div>
          ) : user ? (
            <div className="flex items-center gap-4">
              <Link to="/browse" className="hover:underline">Browse</Link>
              <Link to="/new-service" className="hover:underline">Post a Service</Link>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <span className="opacity-90">Hi, {user.name}</span>
              <button onClick={handleLogout} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded">
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/browse" className="hover:underline">Browse</Link>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/signup" className="hover:underline">Sign up</Link>
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/new-service" element={<NewService />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/become-a-provider" element={<BecomeProvider />} />
        </Routes>
      </main>

      <footer className="bg-gray-100 text-center py-4 text-sm">
        © {new Date().getFullYear()} On‑Demand Skills
      </footer>
    </div>
  );
}