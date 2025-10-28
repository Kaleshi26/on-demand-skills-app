// backend/src/controllers/taskController.js
import Task from '../models/Task.js';
import Offer from '../models/Offer.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import { geocodeLocation, calculateDistance } from '../utils/geocode.js';
import { getFileUrl } from '../utils/upload.js';

/**
 * Create a new task
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, category, locationText, budgetType, budget, scheduledAt } = req.body;
    
    // Geocode location if provided
    let geo = { type: 'Point', coordinates: [0, 0] };
    if (locationText) {
      const geocoded = await geocodeLocation(locationText);
      if (geocoded) {
        geo.coordinates = [geocoded.lng, geocoded.lat];
      }
    }

    // Handle photo uploads
    const photos = req.files ? req.files.map(file => getFileUrl(file.filename)) : [];

    const task = new Task({
      title,
      description,
      category,
      locationText,
      geo,
      photos,
      budgetType,
      budget,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      client: req.user._id
    });

    await task.save();
    await task.populate('client', 'name email avatar');

    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Failed to create task' });
  }
};

/**
 * Get tasks with filters
 */
export const getTasks = async (req, res) => {
  try {
    const { q, category, min, max, near, status = 'open' } = req.query;
    
    let query = { status };
    
    // Text search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category) {
      query.category = category;
    }
    
    // Budget range
    if (min || max) {
      query.budget = {};
      if (min) query.budget.$gte = parseFloat(min);
      if (max) query.budget.$lte = parseFloat(max);
    }
    
    // Location-based search
    if (near) {
      const [lat, lng, km = 10] = near.split(',').map(Number);
      query.geo = {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: km * 1000 // Convert km to meters
        }
      };
    }

    const tasks = await Task.find(query)
      .populate('client', 'name avatar rating')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

/**
 * Get task by ID
 */
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('client', 'name email avatar rating reviewCount')
      .populate('assignedProvider', 'name email avatar rating');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Get offers count
    const offersCount = await Offer.countDocuments({ task: task._id });
    task.offersCount = offersCount;

    res.json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Failed to fetch task' });
  }
};

/**
 * Update task (only by client while open)
 */
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (task.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (task.status !== 'open') {
      return res.status(400).json({ message: 'Can only update open tasks' });
    }

    const updates = req.body;
    
    // Handle location update with geocoding
    if (updates.locationText && updates.locationText !== task.locationText) {
      const geocoded = await geocodeLocation(updates.locationText);
      if (geocoded) {
        updates.geo = {
          type: 'Point',
          coordinates: [geocoded.lng, geocoded.lat]
        };
      }
    }

    // Handle photo uploads
    if (req.files && req.files.length > 0) {
      const newPhotos = req.files.map(file => getFileUrl(file.filename));
      updates.photos = [...(task.photos || []), ...newPhotos];
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).populate('client', 'name email avatar');

    res.json({ task: updatedTask });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Failed to update task' });
  }
};

/**
 * Assign task to a provider (accept an offer)
 */
export const assignTask = async (req, res) => {
  try {
    const { offerId } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (task.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (task.status !== 'open') {
      return res.status(400).json({ message: 'Task is not open for assignment' });
    }

    const offer = await Offer.findById(offerId)
      .populate('provider', 'name email');
    
    if (!offer || offer.task.toString() !== task._id.toString()) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    // Update offer status
    offer.status = 'accepted';
    await offer.save();

    // Update task
    task.status = 'assigned';
    task.assignedProvider = offer.provider._id;
    await task.save();

    // Create booking
    const booking = new Booking({
      task: task._id,
      customer: task.client,
      provider: offer.provider._id,
      totalPrice: offer.proposedPrice,
      source: 'task',
      status: 'confirmed',
      scheduledAt: task.scheduledAt
    });
    await booking.save();

    res.json({ 
      message: 'Task assigned successfully',
      booking,
      task: await Task.findById(task._id).populate('assignedProvider', 'name email avatar')
    });
  } catch (error) {
    console.error('Assign task error:', error);
    res.status(500).json({ message: 'Failed to assign task' });
  }
};

/**
 * Update task status
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check permissions
    const isClient = task.client.toString() === req.user._id.toString();
    const isProvider = task.assignedProvider && task.assignedProvider.toString() === req.user._id.toString();
    
    if (!isClient && !isProvider) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    // Validate status transitions
    const validTransitions = {
      'open': ['assigned', 'cancelled'],
      'assigned': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': []
    };
    
    if (!validTransitions[task.status]?.includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    task.status = status;
    await task.save();

    res.json({ task });
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Failed to update task status' });
  }
};
