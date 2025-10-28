// backend/src/utils/stripe.js
import Stripe from 'stripe';

let stripe = null;

// Initialize Stripe if secret key is provided
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

/**
 * Create a Stripe checkout session
 * @param {Object} params - Checkout session parameters
 * @param {string} params.bookingId - The booking ID
 * @param {number} params.amount - Amount in cents
 * @param {string} params.currency - Currency code (default: 'usd')
 * @param {string} params.successUrl - Success redirect URL
 * @param {string} params.cancelUrl - Cancel redirect URL
 * @returns {Promise<Object>} Checkout session or mock response
 */
export async function createCheckoutSession({ bookingId, amount, currency = 'usd', successUrl, cancelUrl }) {
  if (!stripe) {
    // Mock payment for development
    console.log('Stripe not configured, using mock payment');
    return {
      url: `${successUrl}?bookingId=${bookingId}&mock=true`,
      mock: true
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Service Booking',
              description: `Booking #${bookingId}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        bookingId: bookingId.toString(),
      },
    });

    return { url: session.url, sessionId: session.id };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw new Error('Payment processing failed');
  }
}

/**
 * Verify Stripe webhook signature
 * @param {string} payload - Raw request body
 * @param {string} signature - Stripe signature header
 * @returns {Object|null} Event object or null if invalid
 */
export function verifyWebhookSignature(payload, signature) {
  if (!stripe || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.log('Stripe webhook verification skipped (not configured)');
    return JSON.parse(payload); // Return parsed payload for development
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}

export { stripe };
