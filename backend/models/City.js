import mongoose from 'mongoose';

const citySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  image: {
    type: String,
    required: true
  },
  isNewCity: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  state: {
    type: String,
    required: true
  },
  description: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

// Index for faster queries
citySchema.index({ name: 1, isActive: 1 });

const City = mongoose.model('City', citySchema);

export default City;
