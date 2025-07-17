const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  binCategory: {
    type: String,
    required: true,
    enum: ['Home Bin', 'Office Bin', 'Community Bin'], // Match ReportPage options
  },
  problem: {
    type: String,
    required: true,
    enum: ['overflow', 'damage', 'gas', 'Other'], // Match ReportPage options
  },
  description: {
    type: String,
    required: true,
  },
  reviewed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
    uniqueId: {
    type: String,
    required: true, // e.g., CBU001
  },
  submittedAt: {
    type: Date,
    required: true,
  },
  reviewedAt: {
    type: Date,
    default: null, // Will be set when the report is reviewed
  },
  createdAt: {
    type: Date,
    default: Date.now}
  }, {versionKey:false});

module.exports = mongoose.model('Report', reportSchema);