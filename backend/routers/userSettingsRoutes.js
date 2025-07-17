const express = require('express');
const router = express.Router();
const {
  getUserSettings,
  updateUserProfile,
  updateReminders
} = require('../controllers/userSettingsController');

// /api/user-settings
router.get('/:userId', getUserSettings);
router.put('/:userId/profile', updateUserProfile);
router.put('/:userId/reminders', updateReminders);

module.exports = router;