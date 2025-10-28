// backend/src/utils/upload.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists
import fs from 'fs';
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allow images only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Multer configuration
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

/**
 * Generate public URL for uploaded file
 * @param {string} filename - The uploaded filename
 * @returns {string} Public URL
 */
export function getFileUrl(filename) {
  return `/uploads/${filename}`;
}

/**
 * Delete uploaded file
 * @param {string} filename - The filename to delete
 * @returns {Promise<boolean>} Success status
 */
export async function deleteFile(filename) {
  try {
    const filePath = path.join(uploadsDir, filename);
    await fs.promises.unlink(filePath);
    return true;
  } catch (error) {
    console.error('File deletion error:', error);
    return false;
  }
}
