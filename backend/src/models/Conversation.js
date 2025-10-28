// backend/src/models/Conversation.js
import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessage: { type: String },
    lastMessageSender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

// Indexes for efficient queries
conversationSchema.index({ members: 1 });
conversationSchema.index({ taskId: 1 });
conversationSchema.index({ serviceId: 1 });
conversationSchema.index({ lastMessageAt: -1 });

export default mongoose.model('Conversation', conversationSchema);
