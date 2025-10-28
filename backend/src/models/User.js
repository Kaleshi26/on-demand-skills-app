// backend/src/models/User.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
    location: String,
    skills: [{ type: String }],
    avatar: String,
    bio: String,
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
    // Extended provider fields
    hourlyRate: { type: Number, min: 0 },
    categories: [{ type: String }],
    address: String,
    availabilityText: String,
    verified: {
      idVerified: { type: Boolean, default: false },
      backgroundChecked: { type: Boolean, default: false }
    },
    portfolioImages: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);