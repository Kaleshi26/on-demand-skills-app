// frontend/src/pages/Checkout.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { FaCreditCard, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import api from '../lib/api';
import toast from 'react-hot-toast';
import Button from '../components/Button';
import SectionHeading from '../components/SectionHeading';
import { useAuth } from '../context/AuthContext';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const bookingId = searchParams.get('bookingId');
  const paymentSuccess = searchParams.get('payment') === 'success';
  const mockPayment = searchParams.get('mock') === 'true';

  useEffect(() => {
    if (bookingId) {
      fetchBooking();
    } else {
      navigate('/dashboard');
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    if (paymentSuccess) {
      toast.success('Payment successful!');
      navigate('/dashboard?payment=success');
    }
  }, [paymentSuccess, navigate]);

  const fetchBooking = async () => {
    try {
      const { data } = await api.get(`/payments/status/${bookingId}`);
      setBooking(data.booking);
    } catch (error) {
      console.error('Fetch booking error:', error);
      toast.error('Failed to load booking details');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;

    setProcessing(true);
    try {
      const { data } = await api.post('/payments/checkout', {
        bookingId: booking._id
      });

      if (data.mock) {
        // Mock payment - redirect to success
        window.location.href = data.checkoutUrl;
      } else {
        // Real Stripe payment
        window.location.href = data.checkoutUrl;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to process payment');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="container-max py-10">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="container-max py-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h1>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const isPaid = booking.paymentStatus === 'paid';
  const isCustomer = user && booking.customer._id === user._id;

  if (!isCustomer) {
    return (
      <div className="container-max py-10">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access denied</h1>
          <Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-max py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            <FaArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <SectionHeading 
            title="Checkout" 
            subtitle="Complete your payment to confirm the booking."
          />
        </div>

        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="card p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium">
                  {booking.service?.title || booking.task?.title}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Provider:</span>
                <span className="font-medium">{booking.provider.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>
              
              {booking.scheduledAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Scheduled:</span>
                  <span className="font-medium">
                    {format(new Date(booking.scheduledAt), 'MMM d, yyyy h:mm a')}
                  </span>
                </div>
              )}
              
              {booking.notes && (
                <div>
                  <span className="text-gray-600">Notes:</span>
                  <p className="text-sm text-gray-700 mt-1">{booking.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Section */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaCreditCard className="w-6 h-6 text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-lg">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-gray-900">${booking.totalPrice}</span>
              </div>

              {isPaid ? (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                  <FaCheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Payment Completed</p>
                    <p className="text-sm text-green-700">
                      Your booking has been confirmed and payment processed.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Click the button below to proceed with payment. You'll be redirected to a secure payment page.
                  </p>
                  
                  <Button
                    onClick={handlePayment}
                    disabled={processing}
                    className="w-full"
                  >
                    {processing ? 'Processing...' : `Pay $${booking.totalPrice}`}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Secure payment powered by Stripe
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          {isPaid && (
            <div className="card p-6 bg-blue-50">
              <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• You'll receive a confirmation email shortly</li>
                <li>• Your provider will contact you to confirm details</li>
                <li>• You can message your provider anytime from your dashboard</li>
                <li>• After completion, you can leave a review</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
