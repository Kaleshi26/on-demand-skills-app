// backend/src/routes/offers.js
import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors, sanitizeBody } from '../middleware/validate.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import {
  createOffer,
  getTaskOffers,
  updateOfferStatus,
  getMyOffers
} from '../controllers/offerController.js';

const router = Router();

// Validation rules
const createOfferValidation = [
  body('message').trim().isLength({ min: 10, max: 500 }).withMessage('Message must be 10-500 characters'),
  body('proposedPrice').isFloat({ min: 1 }).withMessage('Proposed price must be at least $1'),
  body('proposedTimeWindow').optional().trim().isLength({ max: 100 }).withMessage('Time window must be less than 100 characters')
];

const updateOfferStatusValidation = [
  body('status').isIn(['sent', 'accepted', 'declined']).withMessage('Invalid status')
];

// Protected routes
router.use(protect);
router.use(sanitizeBody);

router.get('/my', getMyOffers);
router.get('/task/:id', getTaskOffers);

router.post('/task/:id',
  writeLimiter,
  createOfferValidation,
  handleValidationErrors,
  createOffer
);

router.patch('/:id/status',
  writeLimiter,
  updateOfferStatusValidation,  // Validation middleware
  handleValidationErrors,
  updateOfferStatus
);

export default router;
