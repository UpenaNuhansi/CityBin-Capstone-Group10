const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create a single notification
exports.createNotification = async (notificationData) => {
  try {
    const notification = await Notification.create(notificationData);
    return notification;
  } catch (err) {
    console.error('Error creating notification:', err);
    throw err;
  }
};

// Get all notifications for a user
exports.getUserNotifications = async (req, res) => {
  const { userId } = req.params;
  const { sinceDate } = req.query;

  try {
    let query = { userId };
    if (sinceDate) {
      query.createdAt = { $gte: new Date(sinceDate) };
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get recent notifications for admin dashboard
exports.getRecentNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load notifications' });
  }
};

// Mark a specific notification as read
exports.markAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { status: 'Read' },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.status(200).json({ success: true, data: notification });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Send bulk/system-wide notifications
exports.sendBulkNotification = async (req, res) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can send notifications'
      });
    }

    const { message, target, specificIds } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    let users = [];
    const now = new Date();

    switch (target) {
      case 'AllUsers':
        users = await User.find({ role: 'User' });
        break;
      case 'AllOperators':
        users = await User.find({ role: 'Operator' });
        break;
      case 'SpecificUsers':
      case 'SpecificOperators':
        if (!specificIds || !Array.isArray(specificIds)) {
          return res.status(400).json({
            success: false,
            message: 'Specific IDs must be an array'
          });
        }
        users = await User.find({
          uniqueId: { $in: specificIds },
          role: target === 'SpecificUsers' ? 'User' : 'Operator'
        });
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid target type'
        });
    }

    const notifications = users.map(user => ({
      userId: user._id,
      message,
      type: 'AdminNotification',
      status: 'Unread',
      userRole: user.role,
      createdAt: now,
      createdBy: req.user._id,
      ...(target === 'AllOperators' ? { forAllOperators: true } : {})
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({
      success: true,
      message: 'Notifications sent successfully',
      count: notifications.length,
      data: {
        sentAt: now,
        recipients: users.map(u => u.uniqueId)
      }
    });
  } catch (error) {
    console.error('Notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get pending maintenance tasks for operator
exports.getOperatorTasks = async (req, res) => {
  try {
    const tasks = await Notification.find({
      userId: req.user.id,
      userRole: 'Operator',
      type: 'MaintenanceAssigned',
      status: 'Unread'
    }).sort({ createdAt: -1 });

    res.status(200).json({ notifications: tasks });
  } catch (err) {
    console.error('Error fetching operator tasks:', err);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// Mark a maintenance task as done and notify admin
exports.markTaskAsDone = async (req, res) => {
  const { id } = req.params;
  const { binId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid notification ID' });
  }

  if (!binId) {
    return res.status(400).json({ message: 'Missing binId in request' });
  }

  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      id,
      { status: 'Done' },
      { new: true }
    );

    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    const admin = await User.findOne({ role: 'Admin' });

    await Notification.create({
      userId: admin?._id || null,
      message: `Operator completed maintenance for Bin #${binId}`,
      userRole: 'Admin',
      type: 'MaintenanceDone',
      status: 'Unread',
      binId,
      createdAt: new Date()
    });

    res.status(200).json({ success: true, message: 'Task marked as done' });
  } catch (err) {
    console.error('Error in markTaskAsDone:', err);
    res.status(500).json({ message: 'Failed to mark as done', error: err.message });
  }
};

exports.getOperatorNotifications = async (req, res) => {
  try {
    const userId = req.user.id; // comes from token
    const notifications = await Notification.find({
      $or: [
        { userId: userId },              // specific to this operator
        { userRole: 'Operator', forAllOperators: true }      // sent to all operators
      ]
    }).sort({ createdAt: -1 });

    // ✅ Debugging
    console.log('🔔 Operator ID:', userId);
    console.log('🔔 Notifications returned:', notifications.length);
    notifications.forEach(n => console.log(`📨 ${n.message} → ${n.userId}`));

    res.status(200).json({ notifications });
  } catch (error) {
    console.error('Error fetching operator notifications:', error);
    res.status(500).json({ message: 'Failed to fetch operator notifications' });
  }
};


// Send general system notification to all operators
exports.sendCommonNotification = async (req, res) => {
  const { message } = req.body;

  try {
    const operators = await User.find({ role: 'Operator' });
    const now = new Date();

    const notifications = operators.map(op => ({
      userId: op._id,
      message,
      userRole: 'Operator',
      type: 'AdminNotification',
      status: 'Unread',
      createdAt: now,
      createdBy: req.user?._id || null
    }));

    await Notification.insertMany(notifications);

    res.status(200).json({ success: true, message: 'Notification sent to all operators.' });
  } catch (err) {
    console.error('Error sending common notification:', err);
    res.status(500).json({ message: 'Failed to send notification', error: err.message });
  }
};

// Get common (system-wide) notifications for all operators
exports.getCommonNotifications = async (req, res) => {
  try {
    // Assuming 'AdminNotification' type is used for common notifications
    const notifications = await Notification.find({
  type: 'AdminNotification',
  // userRole: 'Operator',
  userRole: req.user.role  // Use role from token
})
      .sort({ createdAt: -1 })
      .limit(20);  // limit results if needed

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error fetching common notifications:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Mark a notification as done (alternate handler)
exports.markNotificationDone = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const { binId } = req.body;

    await Notification.findByIdAndUpdate(notificationId, { done: true });

    const admin = await User.findOne({ role: 'Admin' });
    await Notification.create({
      userId: admin?._id || null,
      message: `Operator completed maintenance for Bin ${binId}`,
      type: 'OperatorTaskComplete',
      userRole: 'Admin',
      binId,
      status: 'Unread',
      createdAt: new Date()
    });

    res.status(200).json({ message: 'Task marked as done and admin notified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to mark task as done' });
  }
};

// Export
module.exports = {
  createNotification: exports.createNotification,
  getUserNotifications: exports.getUserNotifications,
  getRecentNotifications: exports.getRecentNotifications,
  markAsRead: exports.markAsRead,
  sendBulkNotification: exports.sendBulkNotification,
  getOperatorTasks: exports.getOperatorTasks,
  markTaskAsDone: exports.markTaskAsDone,
  sendCommonNotification: exports.sendCommonNotification,
  markNotificationDone: exports.markNotificationDone,
  getCommonNotifications: exports.getCommonNotifications,
  getOperatorNotifications: exports.getOperatorNotifications
};
