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


router.get('/user/:binId', auth, getBinById);  // <--- Added this line


router.get('/stats', auth, getBinStats);
router.get('/assigned-to-operator', auth, getBinsAssignedToOperator);


router.get('/', auth, adminOnly, getAllBins);
router.post('/', auth, adminOnly, createBin);
router.get('/:binId', auth, adminOnly, getBinById);
router.put('/:binId', auth, adminOnly, updateBin);
router.delete('/:binId', auth, adminOnly, deleteBin);
router.post('/:binId/maintenance', auth, adminOnly, assignMaintenance);


router.post('/update-device', updateBinStatus);
router.post('/:binId/update', updateBinStatus);
router.put('/:binId/status', auth, updateBinStatus);


router.get('/user-status', auth, getUserBinStatus);

module.exports = router;
