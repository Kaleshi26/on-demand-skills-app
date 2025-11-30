import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
// FIXED: Added explicit file extensions to resolve build errors
import api from '../lib/api.js'; 
import ServiceCard from '../components/ServiceCard.jsx';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      setLoading(true);
      try {
        const { data } = await api.get('/auth/favorites');
        // Ensure we handle the response correctly (whether it's the user obj or list)
        const list = Array.isArray(data) ? data : (data.favorites || []);
        setFavorites(list);
      } catch (err) {
        console.error("Failed to load favorites", err);
        toast.error("Could not load your saved items");
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Saved Services</h1>
          <p className="text-gray-500 mt-1">Keep track of the professionals you love.</p>
        </div>

        {loading ? (
           // Loading Skeleton
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {[1, 2, 3, 4].map(n => (
               <div key={n} className="bg-white rounded-xl h-80 animate-pulse border border-gray-100 shadow-sm">
                 <div className="h-48 bg-gray-200 rounded-t-xl" />
                 <div className="p-4 space-y-3">
                   <div className="h-4 bg-gray-200 rounded w-3/4" />
                   <div className="h-4 bg-gray-200 rounded w-1/2" />
                 </div>
               </div>
             ))}
           </div>
        ) : favorites.length > 0 ? (
          // Favorites Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {favorites.map(service => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  layout
                >
                  <ServiceCard s={service} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">No favorites yet</h3>
            <p className="text-gray-500 mt-2 mb-8 max-w-sm mx-auto">
              You haven't saved any services yet. Browse our marketplace to find professionals you'd like to hire later.
            </p>
            <Link 
              to="/browse" 
              className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
            >
              Find Professionals
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}