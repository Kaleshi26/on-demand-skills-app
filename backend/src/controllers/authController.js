// backend/src/controllers/authController.js (append functions)
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function genToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
}

// existing register, login, me ...

export async function updateMe(req, res) {
  try {
    const updates = (({ name, location, bio, skills, avatar }) => ({ name, location, bio, skills, avatar }))(req.body);
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json({ user });
  } catch {
    res.status(500).json({ message: 'Update failed' });
  }
}

export async function becomeProvider(req, res) {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { role: 'provider' }, { new: true }).select('-password');
    res.json({ user });
  } catch {
    res.status(500).json({ message: 'Failed to update role' });
  }
}

export async function myFavorites(req, res) {
  try {
    const me = await User.findById(req.user._id).populate('favorites');
    res.json(me.favorites || []);
  } catch {
    res.status(500).json({ message: 'Failed to fetch favorites' });
  }
}