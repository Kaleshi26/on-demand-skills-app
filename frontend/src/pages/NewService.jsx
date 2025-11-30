import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
// FIXED: Added explicit file extensions for resolution
import api from '../lib/api.js';
import { useAuth } from '../context/AuthContext.jsx';

// --- Icons ---
const Icons = {
  Image: () => <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Dollar: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Check: () => <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
};

const CATEGORIES = [
  'Cleaning', 'Moving', 'Mounting', 'Furniture Assembly', 
  'Plumbing', 'Electrical', 'Yardwork', 'Handyman'
];

export default function NewService() {
  const nav = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Cleaning',
    price: '',
    description: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (cat) => {
    setFormData(prev => ({ ...prev, category: cat }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      await api.post('/services', formData);
      toast.success('Service published successfully!');
      nav('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  // Live Preview Component
  const ServiceCardPreview = ({ data }) => {
    const fallbackImage = 'https://images.unsplash.com/photo-1581578731117-104f2a863ecc?q=80&w=600';
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden w-full max-w-sm mx-auto transform transition-all duration-300">
        <div className="relative aspect-[4/3] bg-gray-100">
          <img 
            src={data.image || fallbackImage} 
            alt="Preview" 
            className="w-full h-full object-cover"
            onError={(e) => e.target.src = fallbackImage}
          />
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-md shadow-sm">
              {data.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-base font-bold text-gray-900 line-clamp-1">
              {data.title || 'Your Service Title'}
            </h3>
            <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span>5.0</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 mb-4 h-10">
            {data.description || 'Your detailed description will appear here...'}
          </p>
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-xs text-gray-600 font-medium">{user?.name || 'Provider'}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 uppercase font-semibold">Starting at</span>
              <div className="text-lg font-extrabold text-gray-900">${data.price || '0'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Post a Service</h1>
          <p className="mt-2 text-gray-500">Create a new listing to start getting booked.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Service Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Professional Home Cleaning"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* Category Pills */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategorySelect(cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.category === cat
                          ? 'bg-blue-600 text-white shadow-md transform scale-105'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price & Image URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Price ($)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.Dollar />
                    </div>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="50"
                      min="0"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL (Optional)</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your service in detail. What's included? What should clients expect?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
                >
                  {loading ? 'Publishing...' : 'Publish Service'}
                </button>
              </div>

            </form>
          </motion.div>

          {/* Right Column: Live Preview */}
          <div className="hidden lg:block sticky top-24">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Live Preview</h3>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">What clients see</span>
            </div>
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <ServiceCardPreview data={formData} />
            </motion.div>

            {/* Tips Card */}
            <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <Icons.Check />
                Pro Tip
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Services with detailed descriptions and professional photos get booked <strong>3x more often</strong>. Make sure your title is clear and catchy!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}