import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({

  title: { type: String, required: true },

  description: { type: String, required: true },

  category: { type: String, required: true },

  subcategory: { type: String },

  price: { type: String, required: true },

  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  image: { type: String },

  areasCovered: {
    type: [String],
    default: []
  },

  duration: { type: String },

  rating: {
    type: Number,
    default: 0
  },

  reviews: {
    type: Number,
    default: 0
  },

  features: {
    type: [String],
    default: []
  },

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },

  /* SOFT DELETE FIELD */
  isDeleted: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

export const Service =
  mongoose.models.Service ||
  mongoose.model("Service", serviceSchema);