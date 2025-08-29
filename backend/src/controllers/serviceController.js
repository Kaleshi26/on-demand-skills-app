// backend/src/controllers/serviceController.js (append)
import Service from '../models/Service.js';
import User from '../models/User.js';

export async function toggleFavorite(req, res) {
  try {
    const user = await User.findById(req.user._id);
    const id = req.params.id;
    const has = user.favorites.some(x => String(x) === id);
    if (has) {
      user.favorites = user.favorites.filter(x => String(x) !== id);
    } else {
      user.favorites.push(id);
    }
    await user.save();
    res.json({ favorited: !has });
  } catch {
    res.status(500).json({ message: 'Favorite toggle failed' });
  }
}