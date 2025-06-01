const Settings = require("../models/Settings");


// GET /api/settings
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Failed to load settings.' });
  }
};

// PUT /api/settings
const updateSettings = async (req, res) => {
  try {

    console.log("PUT /settings body:", req.body); //debug log 

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    if (req.body.wasteThresholds) {
      settings.wasteThresholds = {
        ...settings.wasteThresholds,
        ...req.body.wasteThresholds,
      };
    }

    if (req.body.reminders) {
      settings.reminders = {
        ...settings.reminders,
        ...req.body.reminders,
      };
    }

    if (req.body.features) {
      settings.features = {
        ...settings.features,
        ...req.body.features,
      };
    }

    await settings.save();
    res.json({ success: true, settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};

// RESET settings to default
// export const resetSettings = async (req, res) => {
//   try {
//     const defaultSettings = {
//       wasteThresholds: {
//         Organic: 75,
//         Recyclable: 75,
//         General: 75,
//         Hazardous: 75,
//       },
//       reminders: {
//         enabled: true,
//         time: "09:00",
//         email: true,
//         sms: true,
//         appNotification: true,
//       },
//       features: {
//         overflowAlerts: true,
//         smartRoute: true,
//       },
//     };

//     let settings = await Settings.findOne();
//     if (!settings) {
//       settings = await Settings.create(defaultSettings);
//     } else {
//       Object.assign(settings, defaultSettings);
//       await settings.save();
//     }

//     res.json(settings);
//   } catch (err) {
//     res.status(500).json({ message: "Error resetting settings", error: err.message });
//   }
// };