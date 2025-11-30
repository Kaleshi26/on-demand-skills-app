// backend/src/routes/services.js
import { Router } from 'express';
import { createService, listServices, getService, } from '../controllers/serviceController.js';
import { toggleFavorite } from '../controllers/serviceController.js';
import { createReview, listReviews } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', listServices);
router.get('/:id', getService);
router.post('/', protect, authorize('provider', 'admin'), createService);

// favorites
router.post('/:id/favorite', protect, toggleFavorite);

// reviews
router.get('/:id/reviews', listReviews);
router.post('/:id/reviews', protect, createReview);

export default router;