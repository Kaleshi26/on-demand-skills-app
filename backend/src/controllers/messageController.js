// backend/src/controllers/messageController.js
import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import User from '../models/User.js';

/**
 * Get messages for a conversation
 */
export const getMessages = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const conversationId = req.params.id;

    // Check if conversation exists and user is a member
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isMember = conversation.members.some(
      member => member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get messages with pagination
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Mark messages as seen by current user
    await Message.updateMany(
      { 
        conversation: conversationId,
        sender: { $ne: req.user._id },
        seenBy: { $ne: req.user._id }
      },
      { $addToSet: { seenBy: req.user._id } }
    );

    res.json({ 
      messages: messages.reverse(), // Reverse to show oldest first
      hasMore: messages.length === limit
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Failed to fetch messages' });
  }
};

/**
 * Send a message
 */
export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const conversationId = req.params.id;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Message text is required' });
    }

    // Check if conversation exists and user is a member
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isMember = conversation.members.some(
      member => member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create message
    const message = new Message({
      conversation: conversationId,
      sender: req.user._id,
      text: text.trim(),
      seenBy: [req.user._id] // Sender has seen their own message
    });

    await message.save();
    await message.populate('sender', 'name email avatar');

    // Update conversation with last message info
    conversation.lastMessage = text.trim();
    conversation.lastMessageAt = new Date();
    conversation.lastMessageSender = req.user._id;
    await conversation.save();

    // Emit real-time event via Socket.IO
    const io = req.app.get('io');
    if (io) {
      const recipients = conversation.members.filter(
        member => member.toString() !== req.user._id.toString()
      );
      
      io.to(`conversation:${conversationId}`).emit('message-received', {
        message,
        conversationId
      });

      // Notify other users
      recipients.forEach(recipientId => {
        io.to(`user:${recipientId}`).emit('new-message-notification', {
          conversationId,
          message: {
            text: message.text,
            sender: message.sender,
            createdAt: message.createdAt
          }
        });
      });
    }

    res.status(201).json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};

/**
 * Mark messages as read
 */
export const markAsRead = async (req, res) => {
  try {
    const conversationId = req.params.id;

    // Check if conversation exists and user is a member
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    const isMember = conversation.members.some(
      member => member.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mark all unread messages in this conversation as read
    await Message.updateMany(
      { 
        conversation: conversationId,
        sender: { $ne: req.user._id },
        seenBy: { $ne: req.user._id }
      },
      { $addToSet: { seenBy: req.user._id } }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark messages as read' });
  }
};
