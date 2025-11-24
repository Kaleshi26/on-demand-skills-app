import express from 'express';
import {
  register,
  login,
  me,
  updateMe,
  becomeProvider,
  myFavorites,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.put('/me', authMiddleware, updateMe);
router.post('/become-provider', authMiddleware, becomeProvider);
router.get('/favorites', authMiddleware, myFavorites);

export default router;
