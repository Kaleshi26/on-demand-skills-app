
import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, default: 0 },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
