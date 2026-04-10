import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    serviceTitle: { type: String },
    category: { type: String },
    status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    date: { type: Date, required: true },
    timeSlot: { type: String },
    isUrgent: { type: Boolean, default: false },
    location: { type: String },
    fullAddress: { type: String },
    pincode: { type: String },
    customerName: { type: String },
    customerPhone: { type: String },
    customerEmail: { type: String },
    estimatedCost: { type: Number },
    notes: { type: String },
    declineNote: { type: String },
    cancelledAt: { type: Date }
  },
  { timestamps: true }
);

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
