// backend/src/controllers/offerController.js
import Offer from '../models/Offer.js';
import Task from '../models/Task.js';
import User from '../models/User.js';

/**
 * Create a new offer for a task
 */
export const createOffer = async (req, res) => {
  try {
    const { message, proposedPrice, proposedTimeWindow } = req.body;
    const taskId = req.params.id;

    // Check if task exists and is open
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    if (task.status !== 'open') {
      return res.status(400).json({ message: 'Task is not open for offers' });
    }
    
    if (task.client.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot offer on your own task' });
    }

    // Check if user already has an offer for this task
    const existingOffer = await Offer.findOne({
      task: taskId,
      provider: req.user._id
    });
    
    if (existingOffer) {
      return res.status(400).json({ message: 'You already have an offer for this task' });
    }

    const offer = new Offer({
      task: taskId,
      provider: req.user._id,
      message,
      proposedPrice,
      proposedTimeWindow
    });

    await offer.save();
    await offer.populate('provider', 'name email avatar rating');

    // Update task offers count
    await Task.findByIdAndUpdate(taskId, { $inc: { offersCount: 1 } });

    res.status(201).json({ offer });
  } catch (error) {
    console.error('Create offer error:', error);
    res.status(500).json({ message: 'Failed to create offer' });
  }
};

/**
 * Get offers for a task
 */
export const getTaskOffers = async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Check if task exists
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    // Check permissions - only task owner or offer providers can see offers
    const isTaskOwner = task.client.toString() === req.user._id.toString();
    
    let query = { task: taskId };
    if (!isTaskOwner) {
      // If not task owner, only show their own offers
      query.provider = req.user._id;
    }

    const offers = await Offer.find(query)
      .populate('provider', 'name email avatar rating reviewCount')
      .sort({ createdAt: -1 });

    res.json({ offers });
  } catch (error) {
    console.error('Get task offers error:', error);
    res.status(500).json({ message: 'Failed to fetch offers' });
  }
};

/**
 * Update offer status (accept/decline)
 */
export const updateOfferStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const offerId = req.params.id;

    const offer = await Offer.findById(offerId)
      .populate('task', 'client status')
      .populate('provider', 'name email');
    
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    
    // Only task owner can accept/decline offers
    if (offer.task.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    if (offer.task.status !== 'open') {
      return res.status(400).json({ message: 'Task is not open' });
    }
    
    if (offer.status !== 'sent') {
      return res.status(400).json({ message: 'Offer has already been processed' });
    }

    offer.status = status;
    await offer.save();

    res.json({ offer });
  } catch (error) {
    console.error('Update offer status error:', error);
    res.status(500).json({ message: 'Failed to update offer status' });
  }
};

/**
 * Get user's offers (for providers)
 */
export const getMyOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ provider: req.user._id })
      .populate('task', 'title description category locationText budget status')
      .populate('provider', 'name email avatar')
      .sort({ createdAt: -1 });

    res.json({ offers });
  } catch (error) {
    console.error('Get my offers error:', error);
    res.status(500).json({ message: 'Failed to fetch offers' });
  }
};
