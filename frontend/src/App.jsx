// Main application component
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Notification system

// Components
import Navbar from './components/Navbar.jsx';

// Pages
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
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      {/* 1. Global Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* 2. Professional Navbar */}
      <Navbar />

      {/* 3. Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:px-6 lg:px-8 py-8">
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

      {/* 4. Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} On‑Demand Skills. Built for Modern Web.
          </p>
        </div>
      </footer>
    </div>
  );
}