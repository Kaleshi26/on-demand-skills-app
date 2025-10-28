// backend/src/middleware/validate.js
import { validationResult } from 'express-validator';

/**
 * Middleware to handle validation errors from express-validator
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Sanitize request body to prevent NoSQL injection
 */
export const sanitizeBody = (req, res, next) => {
  if (req.body) {
    // Remove any keys that start with $ or contain .
    const sanitized = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (!key.startsWith('$') && !key.includes('.')) {
        sanitized[key] = value;
      }
    }
    req.body = sanitized;
  }
  next();
};
