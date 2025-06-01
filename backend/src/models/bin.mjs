// src/models/bin.mjs
import mongoose from 'mongoose';

const binSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: [true, 'Bin ID is required'],
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  wasteLevel: {
    type: Number,
    required: [true, 'Waste level is required'],
    min: [0, 'Waste level cannot be negative'],
    max: [100, 'Waste level cannot exceed 100'],
    default: 0
  },
  maintenance: {
    type: String,
    enum: ['OK', 'Required'],
    default: 'OK'
  },
  coordinates: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required']
    }
  },
  deviceStatus: {
    type: String,
    enum: ['online', 'offline'],
    default: 'online'
  },
  lastUpdate: {
    type: String,
    default: 'Just now'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AppUser', // Reference AppUser model
    default: null
  }
}, {
  timestamps: true
});

binSchema.index({ binId: 1 }, { unique: true });

export default mongoose.model('Bin', binSchema);
