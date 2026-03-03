import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'provider', 'admin'], default: 'user' },
  phone: { type: String },
  address: { type: String },
  providerProfile: {
    companyName: String,
    category: String,
    experience: String,
    skills: [String],
    rating: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    bio: String,
  },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
