// frontend/src/pages/TaskDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FaHome, FaClock, FaDollarSign, FaUsers, FaComment, FaCheckCircle } from 'react-icons/fa';
import api from '../lib/api';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import Modal from '../components/Modal';
import RatingStars from '../components/RatingStars';
import { useAuth } from '../context/AuthContext';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showOffers, setShowOffers] = useState(false);
  const [offerMessage, setOfferMessage] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [offerTimeWindow, setOfferTimeWindow] = useState('');
  const [submittingOffer, setSubmittingOffer] = useState(false);

  useEffect(() => {
    fetchTask();
    fetchOffers();
  }, [id]);

  const fetchTask = async () => {
    try {
      const { data } = await api.get(`/tasks/${id}`);
      setTask(data.task);
    } catch (error) {
      console.error('Fetch task error:', error);
      toast.error('Failed to load task');
    }
  };

  const fetchOffers = async () => {
    try {
      const { data } = await api.get(`/offers/task/${id}`);
      setOffers(data.offers);
    } catch (error) {
      console.error('Fetch offers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitOffer = async () => {
    if (!offerMessage.trim() || !offerPrice) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmittingOffer(true);
    try {
      await api.post(`/offers/task/${id}`, {
        message: offerMessage,
        proposedPrice: parseFloat(offerPrice),
        proposedTimeWindow: offerTimeWindow
      });

      toast.success('Offer submitted successfully!');
      setShowOfferModal(false);
      setOfferMessage('');
      setOfferPrice('');
      setOfferTimeWindow('');
      fetchOffers();
    } catch (error) {
      console.error('Submit offer error:', error);
      toast.error('Failed to submit offer');
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await api.post(`/tasks/${id}/assign`, { offerId });
      toast.success('Task assigned successfully!');
      fetchTask();
      fetchOffers();
    } catch (error) {
      console.error('Accept offer error:', error);
      toast.error('Failed to assign task');
    }
  };

  const handleDeclineOffer = async (offerId) => {
    try {
      await api.patch(`/offers/${offerId}/status`, { status: 'declined' });
      toast.success('Offer declined');
      fetchOffers();
    } catch (error) {
      console.error('Decline offer error:', error);
      toast.error('Failed to decline offer');
    }
  };

  if (loading) {
    return (
      <div className="container-max py-10">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="container-max py-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Task not found</h1>
          <Button onClick={() => navigate('/tasks')}>Back to Tasks</Button>
        </div>
      </div>
    );
  }

  const isTaskOwner = user && task.client._id === user._id;
  const isProvider = user && user.role === 'provider';
  const canSubmitOffer = isProvider && !isTaskOwner && task.status === 'open';

  return (
    <div className="container-max py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  task.status === 'open' ? 'bg-green-100 text-green-800' :
                  task.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                  task.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {task.status}
                </span>
                <span>{task.category}</span>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/tasks')}>
              Back to Tasks
            </Button>
          </div>

          <p className="text-gray-700 text-lg leading-relaxed">{task.description}</p>
        </div>

        {/* Task Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            {/* Location */}
            <div className="flex items-start gap-3">
              <FaHome className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Location</h3>
                <p className="text-gray-600">{task.locationText}</p>
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-start gap-3">
              <FaDollarSign className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Budget</h3>
                <p className="text-gray-600">${task.budget} {task.budgetType}</p>
              </div>
            </div>

            {/* Scheduled Time */}
            {task.scheduledAt && (
              <div className="flex items-start gap-3">
                <FaClock className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Scheduled</h3>
                  <p className="text-gray-600">
                    {format(new Date(task.scheduledAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            )}

            {/* Client Info */}
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <h3 className="font-medium text-gray-900">Posted by</h3>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {task.client.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{task.client.name}</p>
                    {task.client.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <RatingStars rating={task.client.rating} size="sm" />
                        <span className="text-xs text-gray-500">({task.client.reviewCount} reviews)</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photos */}
          {task.photos && task.photos.length > 0 && (
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Photos</h3>
              <div className="grid grid-cols-2 gap-3">
                {task.photos.map((photo, index) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`Task photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 mb-8">
          {canSubmitOffer && (
            <Button onClick={() => setShowOfferModal(true)}>
              Submit Offer
            </Button>
          )}
          
          {isTaskOwner && task.status === 'open' && offers.length > 0 && (
            <Button onClick={() => setShowOffers(true)}>
              View Offers ({offers.length})
            </Button>
          )}

          {isTaskOwner && task.status === 'assigned' && (
            <Button onClick={() => navigate(`/inbox?task=${task._id}`)}>
              <MessageCircle className="w-4 h-4 mr-2" />
              Message Provider
            </Button>
          )}
        </div>

        {/* Offers Modal */}
        <Modal
          isOpen={showOffers}
          onClose={() => setShowOffers(false)}
          title="Offers"
          size="lg"
        >
          <div className="space-y-4">
            {offers.map(offer => (
              <div key={offer._id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {offer.provider.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{offer.provider.name}</h4>
                      <div className="flex items-center gap-1">
                        <RatingStars rating={offer.provider.rating} size="sm" />
                        <span className="text-xs text-gray-500">({offer.provider.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    offer.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {offer.status}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-3">{offer.message}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p><strong>Proposed Price:</strong> ${offer.proposedPrice}</p>
                    {offer.proposedTimeWindow && (
                      <p><strong>Time Window:</strong> {offer.proposedTimeWindow}</p>
                    )}
                  </div>
                  
                  {offer.status === 'sent' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeclineOffer(offer._id)}
                      >
                        Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptOffer(offer._id)}
                      >
                        Accept
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Modal>

        {/* Submit Offer Modal */}
        <Modal
          isOpen={showOfferModal}
          onClose={() => setShowOfferModal(false)}
          title="Submit Offer"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                rows={4}
                placeholder="Tell the client why you're the right person for this job..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proposed Price ($) *
              </label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                min="1"
                step="0.01"
                placeholder="Enter your proposed price"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Window (Optional)
              </label>
              <input
                type="text"
                value={offerTimeWindow}
                onChange={(e) => setOfferTimeWindow(e.target.value)}
                placeholder="e.g., 2-4 hours, Tomorrow morning"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowOfferModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitOffer}
                disabled={submittingOffer}
                className="flex-1"
              >
                {submittingOffer ? 'Submitting...' : 'Submit Offer'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
