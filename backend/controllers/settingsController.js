const Settings = require('../models/Settings');
const Notification = require('../models/Notification');

const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ success: false, message: 'Failed to load settings' });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    const { wasteThresholds, reminders, features, devices } = req.body;

    if (wasteThresholds) {
      settings.wasteThresholds = {
        Organic: wasteThresholds.Organic || settings.wasteThresholds.Organic,
        Recyclable: wasteThresholds.Recyclable || settings.wasteThresholds.Recyclable,
        General: wasteThresholds.General || settings.wasteThresholds.General,
        Hazardous: wasteThresholds.Hazardous || settings.wasteThresholds.Hazardous,
      };
    }

    if (reminders) {
      settings.reminders = {
        enabled: reminders.enabled ?? settings.reminders.enabled,
        time: reminders.time || settings.reminders.time,
        email: reminders.email ?? settings.reminders.email,
        sms: reminders.sms ?? settings.reminders.sms,
        appNotification: reminders.appNotification ?? settings.reminders.appNotification,
      };
    }

    if (features) {
      settings.features = {
        overflowAlerts: features.overflowAlerts ?? settings.features.overflowAlerts,
        smartRoute: features.smartRoute ?? settings.features.smartRoute,
      };
    }

    if (devices) {
      for (const [deviceId, newStatus] of Object.entries(devices)) {
        const oldStatus = settings.devices.get(deviceId)?.status;
        if (newStatus.status === 'Disconnected' && oldStatus !== 'Disconnected') {
          await Notification.create({
            message: `Device ${deviceId} is disconnected`,
            userRole: 'Admin',
            type: 'device',
            status: 'Unread',
          });
        }
        settings.devices.set(deviceId, {
          status: newStatus.status,
          lastSync: newStatus.lastSync || Date.now(),
        });
      }
    }

    await settings.save();
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    console.error('Error updating settings:', err);
    res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

const getDeviceStatuses = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.status(200).json({ success: true, data: settings?.devices || new Map() });
  } catch (err) {
    console.error('Error fetching device statuses:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
  getDeviceStatuses,
};