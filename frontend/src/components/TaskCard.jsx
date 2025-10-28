// frontend/src/components/TaskCard.jsx
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FaHome, FaClock, FaDollarSign, FaUsers } from 'react-icons/fa';

export default function TaskCard({ task }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link 
              to={`/tasks/${task._id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              {task.title}
            </Link>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {task.description}
            </p>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <FaHome className="w-4 h-4" />
            <span className="truncate">{task.locationText}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaDollarSign className="w-4 h-4" />
            <span>${task.budget} {task.budgetType}</span>
          </div>
        </div>

        {task.scheduledAt && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
            <FaClock className="w-4 h-4" />
            <span>{format(new Date(task.scheduledAt), 'MMM d, yyyy h:mm a')}</span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {task.client?.name?.charAt(0) || 'C'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{task.client?.name}</p>
              <p className="text-xs text-gray-500">{task.category}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <FaUsers className="w-4 h-4" />
            <span>{task.offersCount || 0} offers</span>
          </div>
        </div>

        {task.photos && task.photos.length > 0 && (
          <div className="mt-4">
            <img 
              src={task.photos[0]} 
              alt="Task photo"
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
