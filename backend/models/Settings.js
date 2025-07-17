const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  wasteThresholds: {
    type: Object,
    default: {
      Organic: 75,
      Recyclable: 75,
      General: 75,
      Hazardous: 75,
    },
  },
  reminders: {
    type: Object,
    default: {
      enabled: true,
      time: '09:00',
      email: true,
      sms: true,
      appNotification: true,
    },
  },
  features: {
    type: Object,
    default: {
      overflowAlerts: true,
      smartRoute: true,
    },
  },
  devices: {
    type: Map,
    of: {
      status: { type: String, enum: ['Connected', 'Disconnected'], default: 'Connected' },
      lastSync: { type: Date, default: Date.now },
    },
    default: {},
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Middleware to update updatedAt on save
settingsSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Settings', settingsSchema); 