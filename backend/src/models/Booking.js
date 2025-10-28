
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    provider: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    scheduledAt: { type: Date },
    notes: String,
    totalPrice: { type: Number, required: true },
    source: { type: String, enum: ['service', 'task'], required: true },
    paymentStatus: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
    stripeSessionId: String
  },
  { timestamps: true }
);

export default mongoose.model('Booking', bookingSchema);
