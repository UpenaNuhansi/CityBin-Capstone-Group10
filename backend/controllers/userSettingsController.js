const User = require('../models/User');
const UserSettings = require('../models/UserSettings');

// GET user settings by ID
const getUserSettings = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId).select('username email contactNo');
    const settings = await UserSettings.findOne({ userId });

    res.status(200).json({
      success: true,
      data: {
        user: {
          name: user.username,
          email: user.email,
          contactNo: user.contactNo || '',
        },
        reminders: settings?.reminders || {}
      }
    });
  } catch (err) {
    console.error('Failed to fetch user settings:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PUT update user info
const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, contactNo } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { username, email, contactNo },
      { new: true }
    );

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('Failed to update user profile:', err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

// PUT update notification settings
const updateReminders = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reminders } = req.body;

    const updated = await UserSettings.findOneAndUpdate(
      { userId },
      { reminders },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error('Failed to update reminders:', err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};

module.exports = {
  getUserSettings,
  updateUserProfile,
  updateReminders
};