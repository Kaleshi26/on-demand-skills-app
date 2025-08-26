import Service from '../models/Service.js';

export async function createService(req, res) {
  try {
    const { title, description, category, price, tags = [] } = req.body;
    const svc = await Service.create({ owner: req.user._id, title, description, category, price, tags });
    res.status(201).json(svc);
  } catch (e) {
    res.status(500).json({ message: 'Create service failed' });
  }
}

export async function listServices(req, res) {
  try {
    const { q, category, min, max } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (min || max) filter.price = { ...(min ? { $gte: Number(min) } : {}), ...(max ? { $lte: Number(max) } : {}) };
    if (q) filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { tags: { $in: [new RegExp(q, 'i')] } }
    ];
    const items = await Service.find(filter).populate('owner', 'name role');
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'List failed' });
  }
}

export async function getService(req, res) {
  try {
    const item = await Service.findById(req.params.id).populate('owner', 'name');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ message: 'Get failed' });
  }
}
