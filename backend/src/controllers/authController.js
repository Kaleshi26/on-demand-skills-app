import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function genToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
}

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
    const user = await User.create({ name, email, password, role });
    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: genToken(user._id)
    });
  } catch (e) {
    res.status(500).json({ message: 'Register failed' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    return res.json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: genToken(user._id)
    });
  } catch (e) {
    res.status(500).json({ message: 'Login failed' });
  }
}

export async function me(req, res) {
  res.json({ user: req.user });
}
