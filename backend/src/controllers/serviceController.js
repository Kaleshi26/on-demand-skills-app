
// backend/src/controllers/serviceController.js
import Service from '../models/Service.js';
import User from '../models/User.js';

// Create a new service (provider/admin only)
export async function createService(req, res) {
  try {
    const { title, description, category, price, tags = [] } = req.body;

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map(t => t.trim()).filter(Boolean)
      : [];

    const svc = await Service.create({
      owner: req.user._id,
      title: title?.trim(),
      description: description?.trim(),
      category: category?.trim(),
      price: Number(price),
      tags: parsedTags
    });

    const populated = await svc.populate('owner', 'name role');
    res.status(201).json(populated);
  } catch (e) {
    console.error('Create service failed:', e);
    res.status(500).json({ message: 'Create service failed' });
  }
}

// List services with filters: q, category, min, max
export async function listServices(req, res) {
  try {
    const { q, category, min, max } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (min || max) {
      filter.price = {
        ...(min ? { $gte: Number(min) } : {}),
        ...(max ? { $lte: Number(max) } : {})
      };
    }
    if (q) {
      filter.$or = [
        { title:       { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { tags:        { $in: [new RegExp(q, 'i')] } }
      ];
    }

    const items = await Service.find(filter)
      .populate('owner', 'name role')
      .sort('-createdAt');

    res.json(items);
  } catch (e) {
    console.error('List services failed:', e);
    res.status(500).json({ message: 'List failed' });
  }
}

// Get a single service by id
export async function getService(req, res) {
  try {
    const item = await Service.findById(req.params.id).populate('owner', 'name role');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) {
    console.error('Get service failed:', e);
    res.status(500).json({ message: 'Get failed' });
  }
}

// Toggle favorite for current user on a service
export async function toggleFavorite(req, res) {
  try {
    const user = await User.findById(req.user._id);
    const id = req.params.id;

    // Optionally verify the service exists
    // const exists = await Service.exists({ _id: id });
    // if (!exists) return res.status(404).json({ message: 'Service not found' });

    const has = user.favorites.some(x => String(x) === String(id));

    if (has) {
      user.favorites = user.favorites.filter(x => String(x) !== String(id));
    } else {
      user.favorites.push(id);
    }

    await user.save();
    res.json({ favorited: !has });
  } catch (e) {
    console.error('Favorite toggle failed:', e);
    res.status(500).json({ message: 'Favorite toggle failed' });
  }
}