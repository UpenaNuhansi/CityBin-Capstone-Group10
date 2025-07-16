const express = require('express');
const router = express.Router();
const {
  getAllBins,
  createBin,
  updateBin,
  assignMaintenance,
  getBinById,
  deleteBin,
  getUserBinStatus,
  updateBinStatus,
  getBinsAssignedToOperator,
  getBinStats
} = require('../controllers/binController');
const auth = require('../middlewares/auth');
const adminOnly = require('../middlewares/adminOnly');

// GET /api/bins/stats (accessible to both Admin and Operator)
router.get('/stats', auth, getBinStats);
// GET /api/bins/assigned-to-operator (accessible to both Admin and Operator)
router.get('/assigned-to-operator', auth, getBinsAssignedToOperator);

// Admin-protected routes
router.get('/', auth, adminOnly, getAllBins);
router.post('/', auth, adminOnly, createBin);
router.get('/:binId', auth, adminOnly, getBinById);
router.put('/:binId', auth, adminOnly, updateBin);
router.delete('/:binId', auth, adminOnly, deleteBin);

// Assign operator to bin for maintenance
router.post('/:binId/maintenance', auth, adminOnly, assignMaintenance);

// Update bin status (e.g., to OK)
router.put('/:binId/status', auth, updateBinStatus);

// Operator/user-specific route
router.get('/user-status', auth, getUserBinStatus);


module.exports = router;
