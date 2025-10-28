// backend/src/routes/tasks.js
import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { handleValidationErrors, sanitizeBody } from '../middleware/validate.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  assignTask,
  updateTaskStatus
} from '../controllers/taskController.js';

const router = Router();

// Validation rules
const createTaskValidation = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category').trim().notEmpty().withMessage('Category is required'),
  body('locationText').trim().isLength({ min: 3, max: 200 }).withMessage('Location must be 3-200 characters'),
  body('budgetType').isIn(['fixed', 'hourly']).withMessage('Budget type must be fixed or hourly'),
  body('budget').isFloat({ min: 1 }).withMessage('Budget must be at least $1'),
  body('scheduledAt').optional().isISO8601().withMessage('Invalid date format')
];

const updateTaskValidation = [
  body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters'),
  body('category').optional().trim().notEmpty().withMessage('Category is required'),
  body('locationText').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Location must be 3-200 characters'),
  body('budgetType').optional().isIn(['fixed', 'hourly']).withMessage('Budget type must be fixed or hourly'),
  body('budget').optional().isFloat({ min: 1 }).withMessage('Budget must be at least $1'),
  body('scheduledAt').optional().isISO8601().withMessage('Invalid date format')
];

const assignTaskValidation = [
  body('offerId').isMongoId().withMessage('Valid offer ID is required')
];

const updateStatusValidation = [
  body('status').isIn(['open', 'assigned', 'completed', 'cancelled']).withMessage('Invalid status')
];

// Routes
router.get('/', getTasks);
router.get('/:id', getTask);

// Protected routes
router.use(protect);
router.use(sanitizeBody);

router.post('/', 
  writeLimiter,
  createTaskValidation,
  handleValidationErrors,
  createTask
);

router.patch('/:id',
  writeLimiter,
  updateTaskValidation,
  handleValidationErrors,
  updateTask
);

router.post('/:id/assign',
  writeLimiter,
  assignTaskValidation,
  handleValidationErrors,
  assignTask
);

router.patch('/:id/status',
  writeLimiter,
  updateStatusValidation,
  handleValidationErrors,
  updateTaskStatus
);

export default router;
