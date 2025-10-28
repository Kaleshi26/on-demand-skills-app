// backend/src/controllers/paymentController.js
import Booking from '../models/Booking.js';
import { createCheckoutSession, verifyWebhookSignature } from '../utils/stripe.js';

/**
 * Create Stripe checkout session
 */
export const createCheckout = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    // Get booking details
    const booking = await Booking.findById(bookingId)
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title')
      .populate('task', 'title');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the customer
    if (booking.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if booking is already paid
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Booking is already paid' });
    }

    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/dashboard?payment=success`;
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout?bookingId=${bookingId}`;

    const session = await createCheckoutSession({
      bookingId,
      amount: Math.round(booking.totalPrice * 100), // Convert to cents
      successUrl,
      cancelUrl
    });

    // If it's a mock payment, mark as paid immediately
    if (session.mock) {
      booking.paymentStatus = 'paid';
      await booking.save();
    } else {
      // Store session ID for webhook verification
      booking.stripeSessionId = session.sessionId;
      await booking.save();
    }

    res.json({ 
      checkoutUrl: session.url,
      mock: session.mock || false
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({ message: 'Payment processing failed' });
  }
};

/**
 * Handle Stripe webhook
 */
export const handleWebhook = async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const payload = JSON.stringify(req.body);

    const event = verifyWebhookSignature(payload, signature);
    
    if (!event) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const bookingId = session.metadata.bookingId;

      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          paymentStatus: 'paid'
        });
        console.log(`Payment completed for booking ${bookingId}`);
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: 'Webhook processing failed' });
  }
};

/**
 * Get payment status for a booking
 */
export const getPaymentStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate('customer', 'name email')
      .populate('provider', 'name email')
      .populate('service', 'title')
      .populate('task', 'title');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is involved in the booking
    const isCustomer = booking.customer._id.toString() === req.user._id.toString();
    const isProvider = booking.provider._id.toString() === req.user._id.toString();

    if (!isCustomer && !isProvider) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ 
      booking,
      paymentStatus: booking.paymentStatus,
      isPaid: booking.paymentStatus === 'paid'
    });
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ message: 'Failed to get payment status' });
  }
};
