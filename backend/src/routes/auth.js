// backend/src/routes/auth.js
import { Router } from 'express';
import { register, login, me, updateMe, becomeProvider, myFavorites } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, me);
router.put('/me', protect, updateMe);
router.post('/become-provider', protect, becomeProvider);
router.get('/me/favorites', protect, myFavorites);
export default router;