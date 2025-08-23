import mongoose from 'mongoose';

// PG Model for Owner PG Management (Advanced Industry Level)
const pgSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  location: {
    lat: { type: Number },
    lng: { type: Number }
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  contactNumber: { type: String, required: true },
  email: { type: String },
  rooms: { type: Number, required: true },
  availableRooms: { type: Number, default: 0 },
  price: { type: Number, required: true },
  priceType: { type: String, enum: ['monthly', 'daily', 'weekly'], default: 'monthly' },
  pgType: { type: String, enum: ['Single', 'Double', 'Triple', 'Four'], default: 'Single' },
  deposit: { type: Number },
  status: { type: String, enum: ['active', 'inactive', 'pending', 'rejected'], default: 'pending' },
  images: [{ type: String }],
  amenities: [{ type: String }],
  rules: [{ type: String }],
  furnished: { type: Boolean, default: false },
  foodIncluded: { type: Boolean, default: false },
  genderAllowed: { type: String, enum: ['male', 'female', 'both'], default: 'both' },
  allowedVisitors: { type: Boolean, default: false },
  parkingAvailable: { type: Boolean, default: false },
  wifiAvailable: { type: Boolean, default: false },
  acAvailable: { type: Boolean, default: false },
  laundryAvailable: { type: Boolean, default: false },
  security: { type: String },
  cctv: { type: Boolean, default: false },
  fireSafety: { type: Boolean, default: false },
  petsAllowed: { type: Boolean, default: false },
  description: { type: String },
  nearby: [{ type: String }],
  documents: [{ type: String }], // URLs or file references
  verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
  approvalLogs: [{
    date: { type: Date, default: Date.now },
    status: { type: String },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    remarks: { type: String }
  }],
  softDelete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  electricityBill: {
    included: { type: Boolean, default: false },
    amount: { type: Number },
    perUnit: { type: Number }, // Electricity bill per unit
    type: { type: String, enum: ['fixed', 'metered', 'shared'], default: 'shared' },
    notes: { type: String }
  }
});

export default mongoose.model('PG', pgSchema);
