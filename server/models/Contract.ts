import mongoose from 'mongoose';

const ContractSchema = new mongoose.Schema({
  serviceType: { type: String, required: true },
  specificTask: { type: String },
  bhk: { type: String },
  floors: { type: String },
  area: { type: String },
  projectType: { type: String },
  scheduledDate: { type: Date },
  contactName: { type: String },
  mobile: { type: String },
  status: { type: String, enum: ['pending', 'viewed', 'accepted', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export const Contract = mongoose.models.Contract || mongoose.model('Contract', ContractSchema);
