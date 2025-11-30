// backend/src/routes/uploads.js
import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import {
  uploadSingle,
  handleSingleUpload,
  uploadMultiple,
  handleMultipleUpload,
  deleteUploadedFile
} from '../controllers/uploadController.js';

const router = Router();

// Protected routes
router.use(protect);

// Single file upload
router.post('/single',
  writeLimiter,
  uploadSingle,
  handleSingleUpload
);

// Multiple files upload
router.post('/multiple',
  writeLimiter,
  uploadMultiple,
  handleMultipleUpload
);

// Delete file
router.delete('/:filename', deleteUploadedFile);

export default router;
