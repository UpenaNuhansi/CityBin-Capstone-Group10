const mongoose = require('mongoose');

const binSchema = new mongoose.Schema({
  binId: {
    type: String,
    required: [true, 'Bin ID is required'],
    unique: true,
    // trim: true
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
  assignedOperator: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  default: null
},
status: {
  type: String,
  enum: ['OK', 'Full', 'Maintenance Required'],
  default: 'OK'
},

}, {
  timestamps: true
});

module.exports = mongoose.model('Bin', binSchema);
