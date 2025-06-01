const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  wasteThresholds: { type: Object },
  reminders: { type: Object },
  features: { type: Object },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Setting', settingsSchema);


