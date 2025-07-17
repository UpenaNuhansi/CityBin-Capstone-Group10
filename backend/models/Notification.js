const mongoose = require('mongoose');


const notificationSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  reportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Report',
    default: null, // Reference to the report, if applicable
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false, // User who receives the notification
  },
  userRole: {
    type: String,
    enum: ['Admin', 'Operator', 'User'],
    required: true,
  },
  type: {
    type: String,
    enum: ['ReportSubmission', 'AdminNotification', 'ReportStatus','MaintenanceAssigned', 'MaintenanceDone', 'MaintenanceCleared',  'OperatorTaskComplete', 'ReportReviewed'],
    required: true, // Type of notification
  },
  binId: {
  type: String,
  required: false,
  default: null
  },

  status: {
    type: String,
    enum: ['Unread', 'Read'],
    default: 'Unread',
  },
  done: {
    type: Boolean,
    default: false
  },
  forAllOperators: {
  type: Boolean,
  default: false
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);