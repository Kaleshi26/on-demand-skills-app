import { Router } from 'express';
import { createService, listServices, getService } from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();
router.get('/', listServices);
router.get('/:id', getService);
router.post('/', protect, authorize('provider', 'admin'), createService);
export default router;
