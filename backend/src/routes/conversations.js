// backend/src/routes/conversations.js
import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/authMiddleware.js';
import { handleValidationErrors, sanitizeBody } from '../middleware/validate.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import {
  createOrGetConversation,
  getConversations,
  getConversation
} from '../controllers/conversationController.js';

const router = Router();

// Validation rules
const createConversationValidation = [
  body('otherUserId').isMongoId().withMessage('Valid user ID is required'),
  body('taskId').optional().isMongoId().withMessage('Valid task ID is required'),
  body('serviceId').optional().isMongoId().withMessage('Valid service ID is required')
];

// Protected routes
router.use(protect);
router.use(sanitizeBody);

router.get('/', getConversations);
router.get('/:id', getConversation);

router.post('/',
  writeLimiter,
  createConversationValidation,
  handleValidationErrors,
  createOrGetConversation
);

export default router;
