const express = require('express');
const router = express.Router();
const {
  getUserBins,
  updateFillLevel
} = require('../controllers/userBinController');

// GET bins for specific user
router.get('/user/:userId', getUserBins);

// PUT update bin fill level
router.put('/:binId/fill-level', updateFillLevel);

module.exports = router;