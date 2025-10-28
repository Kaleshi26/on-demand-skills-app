// backend/src/controllers/conversationController.js
import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Task from '../models/Task.js';
import Service from '../models/Service.js';

/**
 * Create or get existing conversation
 */
export const createOrGetConversation = async (req, res) => {
  try {
    const { taskId, serviceId, otherUserId } = req.body;
    
    if (!otherUserId) {
      return res.status(400).json({ message: 'otherUserId is required' });
    }
    
    if (otherUserId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot create conversation with yourself' });
    }

    // Check if conversation already exists
    let conversation = await Conversation.findOne({
      members: { $all: [req.user._id, otherUserId] },
      ...(taskId && { taskId }),
      ...(serviceId && { serviceId })
    }).populate('members', 'name email avatar');

    if (conversation) {
      return res.json({ conversation });
    }

    // Validate that the other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate task/service if provided
    if (taskId) {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      // Check if user is involved in the task
      if (task.client.toString() !== req.user._id.toString() && 
          task.assignedProvider?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to create conversation for this task' });
      }
    }

    if (serviceId) {
      const service = await Service.findById(serviceId);
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
    }

    // Create new conversation
    conversation = new Conversation({
      members: [req.user._id, otherUserId],
      ...(taskId && { taskId }),
      ...(serviceId && { serviceId })
    });

    await conversation.save();
    await conversation.populate('members', 'name email avatar');

    res.status(201).json({ conversation });
  } catch (error) {
    console.error('Create conversation error:', error);
    res.status(500).json({ message: 'Failed to create conversation' });
  }
};

/**
 * Get user's conversations
 */
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: req.user._id
    })
    .populate('members', 'name email avatar')
    .populate('taskId', 'title status')
    .populate('serviceId', 'title')
    .populate('lastMessageSender', 'name')
    .sort({ lastMessageAt: -1 });

    res.json({ conversations });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
};

/**
 * Get conversation by ID
 */
export const getConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('members', 'name email avatar')
      .populate('taskId', 'title status')
      .populate('serviceId', 'title');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Check if user is a member
    const isMember = conversation.members.some(
      member => member._id.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({ conversation });
  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
};
