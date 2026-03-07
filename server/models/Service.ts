import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // Home, Vehicle, Machine
  subcategory: { type: String }, // Plumbing, Electrical, Cleaning, etc.
  price: { type: Number, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // If mapped to a provider
  image: { type: String },
  areasCovered: { type: [String], default: [] }, // ["Brooklyn", "Manhattan", "Queens"] for location-based filtering
  duration: { type: String }, // "2-3 hours", "30 mins", etc.
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  features: { type: [String], default: [] }, // ["24/7 Service", "Free Consultation", "Warranty"]
  createdAt: { type: Date, default: Date.now }
});

export const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
