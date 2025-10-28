// backend/src/models/Offer.js
import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    proposedPrice: { type: Number, required: true, min: 0 },
    proposedTimeWindow: { type: String }, // e.g., "2-4 hours", "Tomorrow morning"
    status: { 
      type: String, 
      enum: ['sent', 'accepted', 'declined'], 
      default: 'sent' 
    }
  },
  { timestamps: true }
);

// Indexes for efficient queries
offerSchema.index({ task: 1 });
offerSchema.index({ provider: 1 });
offerSchema.index({ status: 1 });

export default mongoose.model('Offer', offerSchema);
