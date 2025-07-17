const mongoose = require('mongoose');

const UserSettingsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  reminders: {
    binStatus: { type: Boolean, default: true },
    collectionReminders: { type: Boolean, default: true },
    maintenanceAlerts: { type: Boolean, default: true },
    rewardsAchievements: { type: Boolean, default: true },
    systemUpdates: { type: Boolean, default: true },
  },
});

module.exports = mongoose.model('UserSettings', UserSettingsSchema);