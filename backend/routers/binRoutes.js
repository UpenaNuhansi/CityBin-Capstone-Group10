const express = require('express');
const {
  getAllBins,
  createBin,
  updateBin,
  assignMaintenance,
  deleteBin,
  getBinById,
  isAdmin,
} = require('../controllers/binController');
const { authenticate } = require('../controllers/authController');

// Optional: Validators and Middleware
const { binValidationRules } = require('../validators/binValidator');
const validate = require('../middlewares/validate');

const router = express.Router();

// Middleware to check authentication and admin access
router.use(authenticate, isAdmin);

// Routes
router.get('/', getAllBins);
router.post('/', binValidationRules, validate, createBin);
router.get('/:binId', getBinById);
router.put('/:binId', binValidationRules, validate, updateBin);
router.post('/:binId/maintenance', assignMaintenance);
router.delete('/:binId', deleteBin);

module.exports = router;
