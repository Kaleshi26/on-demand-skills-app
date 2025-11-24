// backend/src/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function genToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
}

export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.create({ name, email, password, role: role || 'client' });
    const token = genToken(user._id);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    const token = genToken(user._id);
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        avatar: user.avatar
      } 
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user', error: error.message });
  }
}

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
}// backend/src/controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

function genToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
}

// REGISTER
export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'client',
    });

    const token = genToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res
      .status(500)
      .json({ message: 'Registration failed', error: error.message });
  }
}

// LOGIN
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = genToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
}

// ME
export async function me(req, res) {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch user', error: error.message });
  }
}

// UPDATE ME
export async function updateMe(req, res) {
  try {
    const { name, location, bio, skills, avatar } = req.body;

    const updates = {
      ...(name && { name }),
      ...(location && { location }),
      ...(bio && { bio }),
      ...(skills && { skills }),
      ...(avatar && { avatar }),
    };

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    }).select('-password');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
}

// BECOME PROVIDER
export async function becomeProvider(req, res) {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { role: 'provider' },
      { new: true }
    ).select('-password');

    res.json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update role', error: error.message });
  }
}

// MY FAVORITES
export async function myFavorites(req, res) {
  try {
    const me = await User.findById(req.user._id).populate('favorites');
    res.json(me.favorites || []);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch favorites', error: error.message });
  }
}
