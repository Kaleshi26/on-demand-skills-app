import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
// FIXED: Added explicit file extensions
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

// --- Icons ---
const Icons = {
  Star: () => <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>,
  Shield: () => <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  MapPin: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Check: () => <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  Share: () => <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>,
  Heart: () => <svg className="w-5 h-5 text-gray-600 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  User: () => <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
};

export default function ServiceDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const { data } = await api.get(`/services/${id}`);
        setService(data);
      } catch (err) {
        toast.error('Service not found');
        nav('/browse');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, nav]);

  const handleBook = () => {
    if (!user) {
      toast.error('Please login to book this service');
      nav('/login', { state: { from: `/services/${id}` } });
      return;
    }
    if (user._id === service.provider?._id) {
      toast.error("You can't book your own service");
      return;
    }
    // Navigate to checkout with service details
    nav('/checkout', { state: { service } });
  };

  // Safe fallback image logic
  const getFallbackImage = (cat) => {
    const map = {
      'Cleaning': 'https://images.unsplash.com/photo-1581578731117-104f2a863ecc?q=80&w=1200',
      'Moving': 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1200',
      'Mounting': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=1200',
      'Plumbing': 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=1200',
    };
    return map[cat] || 'https://images.unsplash.com/photo-1581539250439-c923cd277c80?q=80&w=1200';
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-96 bg-gray-200 rounded-xl w-full mb-8" />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-40 bg-gray-200 rounded w-full" />
        </div>
        <div className="h-64 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );

  if (!service) return null;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* 1. Header Section (Title & Meta) */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  {service.category}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <Icons.MapPin />
                  <span className="ml-1">Available in your area</span>
                </div>
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {service.title}
              </h1>
              <div className="flex items-center mt-3 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Icons.Star />
                  <span className="font-bold text-gray-900">{service.rating || '4.9'}</span>
                  <span className="text-gray-500 underline decoration-gray-300 underline-offset-4 decoration-1">
                    (24 reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-500">
                  <Icons.Shield />
                  <span>Identity Verified</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                <Icons.Share />
              </button>
              <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                <Icons.Heart />
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* 2. Left Column: Images & Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <div className="rounded-2xl overflow-hidden shadow-sm aspect-video bg-gray-100">
              <img 
                src={service.image || getFallbackImage(service.category)} 
                alt={service.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Provider Mini-Profile */}
            <div className="flex items-center justify-between py-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                  {service.provider?.avatar ? (
                    <img src={service.provider.avatar} alt="Provider" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 text-xl font-bold">
                      {service.provider?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Hosted by {service.provider?.name || 'Verified Provider'}
                  </h3>
                  <p className="text-sm text-gray-500">Member since 2023 • Fast responder</p>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div>
              <div className="flex gap-8 border-b border-gray-200 mb-6">
                {['about', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                      activeTab === tab 
                        ? 'border-blue-600 text-blue-600' 
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'about' ? (
                <div className="prose prose-blue max-w-none text-gray-600">
                  <p className="whitespace-pre-line text-lg leading-relaxed">
                    {service.description}
                  </p>
                  
                  <h4 className="text-gray-900 font-bold mt-8 mb-4">What's included</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <Icons.Check />
                      <span>Professional tools and equipment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icons.Check />
                      <span>Cleanup after the job</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Icons.Check />
                      <span>Satisfaction guarantee</span>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Mock Reviews for Visuals */}
                  {[1, 2].map((_, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700">
                            {i === 0 ? 'A' : 'J'}
                          </div>
                          <span className="font-semibold text-sm">
                            {i === 0 ? 'Alice M.' : 'John D.'}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400">2 weeks ago</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {i === 0 
                          ? "Absolutely fantastic service! Arrived on time and did a perfect job. Highly recommended." 
                          : "Great communication and very professional. Will definitely hire again."}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 3. Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <span className="text-sm text-gray-500 line-through mr-2">${Math.round(service.price * 1.2)}</span>
                    <span className="text-3xl font-extrabold text-gray-900">${service.price}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold text-gray-500 uppercase">Per Project</span>
                    <div className="flex items-center gap-1 mt-1 bg-green-50 px-2 py-1 rounded text-xs font-bold text-green-700">
                      <Icons.Shield />
                      <span>Insured</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleBook}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl text-lg shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  Book Now
                </button>

                <p className="text-center text-xs text-gray-400 mt-4">
                  You won't be charged yet
                </p>

                <div className="mt-6 space-y-4 pt-6 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Service Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-gray-900">
                    <span>Total</span>
                    <span>${service.price}</span>
                  </div>
                </div>
              </div>

              {/* Trust Box */}
              <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-100 flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <Icons.Shield />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900">100% Satisfaction Guarantee</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    If you’re not satisfied, we’ll make it right. Verified by SkillsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}