// backend/src/models/Task.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    locationText: { type: String, required: true },
    geo: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    photos: [{ type: String }],
    budgetType: { type: String, enum: ['fixed', 'hourly'], required: true },
    budget: { type: Number, required: true, min: 0 },
    scheduledAt: { type: Date },
    status: { 
      type: String, 
      enum: ['open', 'assigned', 'completed', 'cancelled'], 
      default: 'open' 
    },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedProvider: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    offersCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Create geospatial index for location-based queries
taskSchema.index({ geo: '2dsphere' });
taskSchema.index({ category: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ client: 1 });

export default mongoose.model('Task', taskSchema);
