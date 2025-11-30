import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
// FIXED: Added explicit file extensions
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

// --- Icons ---
const Icons = {
  Check: () => <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Money: () => <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Clock: () => <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Shield: () => <svg className="w-12 h-12 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

export default function BecomeProvider() {
  const { user, login } = useAuth(); // We might need to refresh user context
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [rate, setRate] = useState(50); // For earnings calculator

  const handleBecomeProvider = async () => {
    if (!user) {
      toast.error("Please login to become a provider");
      nav('/login');
      return;
    }

    if (user.role === 'provider') {
      nav('/dashboard');
      return;
    }

    setLoading(true);
    try {
      // Call the API to update role
      const { data } = await api.post('/auth/become-provider');
      
      // Update local storage token if a new one is returned, or just force reload
      // Ideally, AuthContext should expose a 'refreshUser' method. 
      // For this demo, we'll force a reload to pick up the new role.
      toast.success("Congratulations! You are now a Provider.");
      
      // Quick way to refresh app state for role change
      window.location.href = '/new-service'; 
      
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative bg-blue-900 py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1581578731117-104f2a863ecc?q=80&w=1600"
            alt="Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-900/90 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
            >
              Turn your skills into <span className="text-blue-400">income</span>.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-xl text-blue-100 max-w-lg"
            >
              Join thousands of skilled professionals who are building their business on SkillsApp. Flexible schedule, secure payments, and zero upfront fees.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8"
            >
              <button 
                onClick={handleBecomeProvider}
                disabled={loading}
                className="px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg disabled:opacity-75"
              >
                {loading ? 'Processing...' : user?.role === 'provider' ? 'Go to Dashboard' : 'Get Started'}
              </button>
              <p className="mt-3 text-sm text-blue-300">
                Already have an account? No need to sign up again.
              </p>
            </motion.div>
          </div>
          
          {/* Earnings Calculator Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="md:w-1/2 mt-12 md:mt-0 flex justify-end"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-gray-900">
              <h3 className="text-xl font-bold mb-6">Estimate your earnings</h3>
              
              <div className="mb-8">
                <div className="flex justify-between mb-2 text-sm font-medium text-gray-600">
                  <span>Hourly Rate</span>
                  <span>${rate}/hr</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="200" 
                  value={rate} 
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">If you work</p>
                  <p className="font-bold">10 hrs/week</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">You could earn</p>
                  <p className="text-3xl font-extrabold text-blue-600">${rate * 10 * 4}</p>
                  <p className="text-xs text-gray-400">per month</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Benefits Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">Why partner with us?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-center"><Icons.Money /></div>
              <h3 className="text-xl font-bold mb-2">Earn what you're worth</h3>
              <p className="text-gray-500">Set your own hourly rates and keep 100% of your tips. We charge a small service fee to clients.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-center"><Icons.Clock /></div>
              <h3 className="text-xl font-bold mb-2">Be your own boss</h3>
              <p className="text-gray-500">Work when you want, where you want. Manage your schedule directly from our app.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-center"><Icons.Shield /></div>
              <h3 className="text-xl font-bold mb-2">We've got your back</h3>
              <p className="text-gray-500">Every job is insured. We handle the payments, marketing, and support so you can focus on the work.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Steps to Join */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">How to get started</h2>
          
          <div className="space-y-8">
            {[
              { title: "Create your profile", desc: "Sign up and build a professional profile highlighting your skills and experience." },
              { title: "Set your preferences", desc: "Choose the services you offer, your work area, and your schedule availability." },
              { title: "Start getting booked", desc: "Clients will browse your profile and book you. Get paid instantly upon completion." }
            ].map((step, i) => (
              <div key={i} className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {i + 1}
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button 
              onClick={handleBecomeProvider}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg"
            >
              Join the Team
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}