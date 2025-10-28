// frontend/src/pages/Favorites.jsx
import { useState, useEffect } from 'react';
import { FaHeart, FaStar } from 'react-icons/fa';
import api from '../lib/api';
import toast from 'react-hot-toast';
import ServiceCard from '../components/ServiceCard';
import SectionHeading from '../components/SectionHeading';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/auth/me/favorites');
      setFavorites(data);
    } catch (error) {
      console.error('Fetch favorites error:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (serviceId) => {
    try {
      await api.delete(`/services/${serviceId}/favorite`);
      setFavorites(prev => prev.filter(service => service._id !== serviceId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Remove favorite error:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  if (loading) {
    return (
      <div className="container-max py-10">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card h-64 animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-max py-10">
      <SectionHeading 
        title="My Favorites" 
        subtitle="Services you've saved for later."
      />

      {favorites.length === 0 ? (
        <EmptyState
          icon={FaHeart}
          title="No favorites yet"
          description="Start browsing services and save the ones you like to see them here."
          actionLabel="Browse Services"
          onAction={() => window.location.href = '/browse'}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map(service => (
            <div key={service._id} className="relative">
              <ServiceCard s={service} />
              <button
                onClick={() => handleRemoveFavorite(service._id)}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                title="Remove from favorites"
              >
                <FaHeart className="w-5 h-5 text-red-500 fill-current" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
