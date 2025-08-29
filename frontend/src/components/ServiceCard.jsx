// frontend/src/components/ServiceCard.jsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import api from '../lib/api';

export default function ServiceCard({ s, onFavorited }) {
  const [fav, setFav] = useState(Boolean(s._favorited));

  async function toggleFavorite(e) {
    e.preventDefault();
    try {
      const { data } = await api.post(`/services/${s._id}/favorite`);
      setFav(data.favorited);
      onFavorited?.(s._id, data.favorited);
    } catch {
      // ignore
    }
  }

  return (
    <Link to={`/services/${s._id}`} className="block card overflow-hidden hover:shadow-lg transition shadow-soft">
      <div className="relative">
        <img
          src={s.cover || `https://images.unsplash.com/photo-1523419409543-8f8d3db2a5b1?q=80&w=1200&auto=format&fit=crop`}
          alt={s.title}
          className="h-44 w-full object-cover"
        />
        <button onClick={toggleFavorite} className="absolute top-3 right-3 bg-white/90 backdrop-blur rounded-full p-2">
          {fav ? <AiFillHeart className="text-brand-600" /> : <AiOutlineHeart className="text-slate-700" />}
        </button>
        <div className="absolute bottom-3 left-3 badge-brand">{s.category}</div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-lg line-clamp-1">{s.title}</h3>
        <p className="text-slate-600 text-sm line-clamp-2">{s.description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-brand-700 font-bold">${s.price}</span>
          <span className="text-xs text-slate-500">by {s.owner?.name || 'Provider'}</span>
        </div>
      </div>
    </Link>
  );
}