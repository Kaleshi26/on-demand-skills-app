import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-5 h-5 text-white/80 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

export default function ServiceCard({ s }) {
  // Fallback images if the service doesn't have one
  const getFallbackImage = (cat) => {
    const map = {
      'Cleaning': 'https://images.unsplash.com/photo-1581578731117-104f2a863ecc?q=80&w=600',
      'Moving': 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=600',
      'Mounting': 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=600',
      'Plumbing': 'https://images.unsplash.com/photo-1505798577917-a65157d3320a?q=80&w=600',
    };
    return map[cat] || 'https://images.unsplash.com/photo-1581539250439-c923cd277c80?q=80&w=600';
  };

  const imageUrl = s.image || getFallbackImage(s.category);
  const providerName = s.provider?.name || 'Verified Pro';
  const providerInitial = providerName.charAt(0);

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full"
    >
      {/* Image Section */}
      <Link to={`/services/${s._id}`} className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img 
          src={imageUrl} 
          alt={s.title}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-700 rounded-md shadow-sm">
            {s.category}
          </span>
        </div>

        {/* Favorite Button Overlay */}
        <button className="absolute top-3 right-3 p-2 bg-black/20 hover:bg-white rounded-full backdrop-blur-sm transition-all group/btn">
           <HeartIcon className="group-hover/btn:text-red-500" />
        </button>
      </Link>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1">
        {/* Header: Title & Rating */}
        <div className="flex justify-between items-start mb-2">
          <Link to={`/services/${s._id}`} className="flex-1 mr-2">
            <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
              {s.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
            <StarIcon />
            <span>{s.rating || '4.8'}</span>
            <span className="text-gray-400 font-normal">({s.reviewsCount || 12})</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {s.description}
        </p>

        {/* Footer: Price & Provider */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold ring-2 ring-white">
              {providerInitial}
            </div>
            <span className="text-xs text-gray-600 font-medium truncate max-w-[100px]">
              {providerName}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 uppercase font-semibold">Starting at</span>
            <div className="text-lg font-extrabold text-gray-900">
              ${s.price}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}