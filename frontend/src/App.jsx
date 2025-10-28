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
import Tasks from './pages/Tasks.jsx';
import NewTask from './pages/NewTask.jsx';
import TaskDetail from './pages/TaskDetail.jsx';
import Inbox from './pages/Inbox.jsx';
import Checkout from './pages/Checkout.jsx';
import Profile from './pages/Profile.jsx';
import Favorites from './pages/Favorites.jsx';

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
              <Link to="/tasks" className="hover:underline">Tasks</Link>
              {user.role === 'provider' && (
                <Link to="/new-service" className="hover:underline">Post Service</Link>
              )}
              <Link to="/tasks/new" className="hover:underline">Post Task</Link>
              <Link to="/inbox" className="hover:underline">Messages</Link>
              <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              <div className="relative group">
                <button className="flex items-center gap-2 hover:underline">
                  <span className="opacity-90">Hi, {user.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <Link to="/favorites" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Favorites</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/browse" className="hover:underline">Browse</Link>
              <Link to="/tasks" className="hover:underline">Tasks</Link>
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
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/new" element={<NewTask />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/inbox/:id" element={<Inbox />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      </main>

      <footer className="bg-gray-100 text-center py-4 text-sm">
        © {new Date().getFullYear()} On‑Demand Skills
      </footer>
    </div>
  );
}