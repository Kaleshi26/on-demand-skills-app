// frontend/src/components/ProviderCard.jsx
import { Link } from 'react-router-dom';
import { FaStar, FaHome, FaClock, FaShieldAlt } from 'react-icons/fa';

export default function ProviderCard({ provider }) {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<FaStar key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }

    return stars;
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            {provider.avatar ? (
              <img 
                src={provider.avatar} 
                alt={provider.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <span className="text-xl font-semibold text-gray-600">
                {provider.name?.charAt(0) || 'P'}
              </span>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <Link 
              to={`/providers/${provider._id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {provider.name}
            </Link>
            
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {renderStars(provider.rating || 0)}
              </div>
              <span className="text-sm text-gray-600">
                {provider.rating?.toFixed(1) || '0.0'} ({provider.reviewCount || 0} reviews)
              </span>
            </div>

            {provider.location && (
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <FaHome className="w-4 h-4" />
                <span>{provider.location}</span>
              </div>
            )}
          </div>
        </div>

        {provider.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {provider.bio}
          </p>
        )}

        {provider.categories && provider.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {provider.categories.slice(0, 3).map((category, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {category}
              </span>
            ))}
            {provider.categories.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{provider.categories.length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            {provider.hourlyRate && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>${provider.hourlyRate}/hr</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {provider.verified?.idVerified && (
              <div className="flex items-center gap-1 text-green-600" title="ID Verified">
                <Shield className="w-4 h-4" />
              </div>
            )}
            {provider.verified?.backgroundChecked && (
              <div className="flex items-center gap-1 text-blue-600" title="Background Checked">
                <Shield className="w-4 h-4" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
