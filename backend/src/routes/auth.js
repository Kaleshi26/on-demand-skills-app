import express from 'express';
import {
  register,
  login,
  me,
  updateMe,
  becomeProvider,
  myFavorites,
} from '../controllers/authController.js';
// 1. We import 'protect' here
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// 2. We must USE 'protect' here (instead of 'authMiddleware')
router.get('/me', protect, me);
router.put('/me', protect, updateMe);
router.post('/become-provider', protect, becomeProvider);
router.get('/favorites', protect, myFavorites);

export default router;