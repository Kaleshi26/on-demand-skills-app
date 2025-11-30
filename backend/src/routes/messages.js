// backend/src/routes/messages.js
import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidationErrors, sanitizeBody } from '../middleware/validate.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import {
  getMessages,
  sendMessage,
  markAsRead
} from '../controllers/messageController.js';

const router = Router();

// Validation rules
const sendMessageValidation = [
  body('text').trim().isLength({ min: 1, max: 1000 }).withMessage('Message must be 1-1000 characters')
];

// Protected routes
router.use(protect);
router.use(sanitizeBody);

router.get('/conversation/:id', getMessages);
router.post('/conversation/:id',
  writeLimiter,
  sendMessageValidation,
  handleValidationErrors,
  sendMessage
);
router.patch('/conversation/:id/read', markAsRead);

export default router;
