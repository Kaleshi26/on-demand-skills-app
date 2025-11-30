// backend/src/routes/bookings.js
import { Router } from 'express';
import { createBooking, myBookings, updateStatus } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', protect, createBooking);
router.get('/mine', protect, myBookings);
router.patch('/:id/status', protect, updateStatus);
export default router;
