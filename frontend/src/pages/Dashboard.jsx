import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import clsx from 'clsx';
// FIXED: Removed explicit file extensions to match Home.jsx
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

// --- Icons ---
const Icons = {
  Calendar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Briefcase: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Dollar: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Clock: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  CheckCircle: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  XCircle: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
};

const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
  };
  
  return (
    <span className={clsx('px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wide', styles[status] || styles.pending)}>
      {status}
    </span>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data based on role
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Fetch Bookings (for everyone)
        const bookingsRes = await api.get('/bookings');
        setBookings(bookingsRes.data);

        // 2. Fetch Services (only if provider)
        if (user.role === 'provider') {
          // Adjust endpoint if needed, e.g., /services?provider=me
          const servicesRes = await api.get('/services'); 
          // Client-side filter for demo if backend doesn't support /my-services
          const myOwn = servicesRes.data.filter(s => s.provider?._id === user._id);
          setMyServices(myOwn);
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  // Stats Calculations
  const stats = [
    { 
      label: user.role === 'provider' ? 'Total Earnings' : 'Total Spent', 
      value: `$${bookings.reduce((acc, b) => acc + (b.price || 0), 0)}`, 
      icon: <Icons.Dollar />,
      color: 'bg-green-500'
    },
    { 
      label: 'Active Bookings', 
      value: bookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length, 
      icon: <Icons.Calendar />,
      color: 'bg-blue-500'
    },
    { 
      label: user.role === 'provider' ? 'Active Services' : 'Tasks Completed', 
      value: user.role === 'provider' ? myServices.length : bookings.filter(b => b.status === 'completed').length, 
      icon: <Icons.Briefcase />,
      color: 'bg-purple-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user.name}!</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center"
            >
              <div className={`p-3 rounded-lg ${stat.color} text-white mr-4 shadow-md`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
          
          {/* Tabs */}
          <div className="border-b border-gray-200 px-6 pt-4 flex gap-6">
            <button
              onClick={() => setActiveTab('bookings')}
              className={clsx(
                "pb-4 text-sm font-medium border-b-2 transition-colors",
                activeTab === 'bookings' 
                  ? "border-blue-600 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              My Bookings
            </button>
            
            {user.role === 'provider' && (
              <button
                onClick={() => setActiveTab('services')}
                className={clsx(
                  "pb-4 text-sm font-medium border-b-2 transition-colors",
                  activeTab === 'services' 
                    ? "border-blue-600 text-blue-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                My Services
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              
              {/* BOOKINGS TAB */}
              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
                    <Link to="/browse" className="text-sm text-blue-600 hover:underline">Find new services</Link>
                  </div>

                  {bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left">
                        <thead>
                          <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <th className="pb-3 pl-2">Service</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Amount</th>
                            <th className="pb-3 text-right pr-2">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {bookings.map((booking) => (
                            <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-4 pl-2">
                                <div className="font-medium text-gray-900">{booking.service?.title || 'Unknown Service'}</div>
                                <div className="text-xs text-gray-500">Provider: {booking.service?.provider?.name || 'N/A'}</div>
                              </td>
                              <td className="py-4 text-sm text-gray-600">
                                {new Date(booking.date || Date.now()).toLocaleDateString()}
                              </td>
                              <td className="py-4">
                                <StatusBadge status={booking.status || 'pending'} />
                              </td>
                              <td className="py-4 text-right font-medium text-gray-900">
                                ${booking.price || 0}
                              </td>
                              <td className="py-4 text-right pr-2">
                                <Link to={`/inbox`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                  Message
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.Calendar />
                      </div>
                      <h3 className="text-gray-900 font-medium">No bookings yet</h3>
                      <p className="text-gray-500 text-sm mt-1">Book your first service today!</p>
                      <Link to="/browse" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        Browse Services
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

              {/* SERVICES TAB (Provider Only) */}
              {activeTab === 'services' && (
                <motion.div
                  key="services"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">My Listings</h2>
                    <Link 
                      to="/new-service" 
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm"
                    >
                      <Icons.Plus />
                      Create New Service
                    </Link>
                  </div>

                  {myServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myServices.map((s) => (
                        <div key={s._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <span className="px-2 py-1 bg-gray-100 text-xs font-semibold text-gray-600 rounded">
                              {s.category}
                            </span>
                            <span className="font-bold text-gray-900">${s.price}</span>
                          </div>
                          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{s.title}</h3>
                          <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10">{s.description}</p>
                          <div className="flex gap-2">
                            <Link to={`/services/${s._id}`} className="flex-1 text-center py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                              View
                            </Link>
                            {/* In a real app, wire up delete logic here */}
                            <button className="p-2 border border-red-100 text-red-600 rounded-lg hover:bg-red-50">
                              <Icons.Trash />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                      <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.Briefcase />
                      </div>
                      <h3 className="text-gray-900 font-medium">No active services</h3>
                      <p className="text-gray-500 text-sm mt-1">Start earning by posting your first service.</p>
                      <Link to="/new-service" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                        Create Service
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}