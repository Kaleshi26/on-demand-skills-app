import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
// FIXED: Removing extensions to let the bundler resolve them
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

// --- Icons ---
const Icons = {
  Lock: () => <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  CreditCard: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Shield: () => <svg className="w-12 h-12 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Calendar: () => <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
};

export default function Checkout() {
  const { state } = useLocation();
  const { user } = useAuth();
  const nav = useNavigate();
  const service = state?.service;

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('review'); // 'review' | 'processing' | 'success'
  const [note, setNote] = useState('');

  // Redirect if no service data (direct access protection)
  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">No service selected</h2>
          <button onClick={() => nav('/browse')} className="mt-4 text-blue-600 hover:underline">
            Go to Browse
          </button>
        </div>
      </div>
    );
  }

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Actual API call
      await api.post('/bookings', {
        serviceId: service._id,
        notes: note
      });

      setStep('success');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Payment failed');
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icons.Shield />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-8">
            Your request has been sent to <strong>{service.provider?.name}</strong>. You can chat with them in your inbox.
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => nav('/dashboard')}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
            >
              Go to Dashboard
            </button>
            <button 
              onClick={() => nav('/browse')}
              className="w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
            >
              Book Another Service
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Secure Checkout</h1>
          <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
            <Icons.Lock />
            <span className="font-medium">256-bit SSL Encrypted Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Left Column: Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Service Details Review */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Name</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{user.name}</div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
                  <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium truncate">{user.email}</div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Note to Provider (Optional)</label>
                  <textarea 
                    rows={2}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Describe your task requirements..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method (Mock) */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h3>
              
              <form onSubmit={handlePay} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="4242 4242 4242 4242"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                      required
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Icons.CreditCard />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM / YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>Processing Payment...</>
                    ) : (
                      <>Pay ${service.price}</>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-3">
                    Payments are secure and encrypted.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  <img 
                    src={service.image || "https://images.unsplash.com/photo-1581578731117-104f2a863ecc?q=80&w=200"} 
                    alt={service.title}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 line-clamp-2">{service.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{service.category}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Price per project</span>
                  <span className="font-medium">${service.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span className="font-medium">$5.00</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (Estimated)</span>
                  <span className="font-medium">$2.50</span>
                </div>
                
                <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between text-lg font-extrabold text-gray-900">
                  <span>Total</span>
                  <span>${(service.price + 7.50).toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 p-4 rounded-lg flex gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <Icons.Shield />
                </div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  <strong>Buyer Protection Guarantee.</strong> Your payment is held in escrow until the task is marked complete.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}