// backend/src/routes/payments.js
import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidationErrors, sanitizeBody } from '../middleware/validate.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import {
  createCheckout,
  handleWebhook,
  getPaymentStatus
} from '../controllers/paymentController.js';

const router = Router();

// Validation rules
const createCheckoutValidation = [
  body('bookingId').isMongoId().withMessage('Valid booking ID is required')
];

// Webhook route (no auth required)
router.post('/webhooks/stripe', handleWebhook);

// Protected routes
router.use(protect);
router.use(sanitizeBody);

router.post('/checkout',
  writeLimiter,
  createCheckoutValidation,
  handleValidationErrors,
  createCheckout
);

router.get('/status/:bookingId', getPaymentStatus);

export default router;
