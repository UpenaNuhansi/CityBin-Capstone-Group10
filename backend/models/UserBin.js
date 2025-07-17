const mongoose = require('mongoose');

const userBinSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  binId: { type: String, required: true, unique: true },
  location: String,
  binType: String, // Home / Office / Community
  fillLevel: { type: Number, default: 0 }, // percentage
  lastUpdated: { type: Date, default: Date.now },
  rewardPoints: { type: Number, default: 0 }
});

module.exports = mongoose.model('UserBin', userBinSchema);