const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

// GET settings
router.get('/',settingsController.getSettings);

// PUT settings
router.put('/', settingsController.updateSettings);

module.exports = router;


// router.delete("/", resetSettings); // Uncomment if you want to allow resetting settings via DELETE request
//     }    