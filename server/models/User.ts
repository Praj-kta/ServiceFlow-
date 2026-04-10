import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'provider', 'admin'], default: 'user' },
  phone: { type: String },
  address: { type: String },
  // fields for password reset flow
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  providerProfile: {
    companyName: String,
    // Allow either a single category (legacy) or an array of categories so providers can offer multiple service types.
    category: String,
    categories: [String],
    experience: String,
    pincode: String,
    skills: [String],
    rating: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
    bio: String,
  },
  createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.models.User || mongoose.model('User', userSchema);
