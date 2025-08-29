// backend/src/controllers/reviewController.js
import Review from '../models/Review.js';

export async function createReview(req, res) {
  try {
    const { rating, text } = req.body;
    const r = await Review.create({
      service: req.params.id,
      author: req.user._id,
      rating: Number(rating),
      text: text || ''
    });
    const populated = await r.populate('author', 'name');
    res.status(201).json(populated);
  } catch {
    res.status(500).json({ message: 'Create review failed' });
  }
}

export async function listReviews(req, res) {
  try {
    const items = await Review.find({ service: req.params.id }).populate('author', 'name').sort('-createdAt');
    res.json(items);
  } catch {
    res.status(500).json({ message: 'List reviews failed' });
  }
}