const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middlewares/auth');
const adminOnly = require('../middlewares/adminOnly');
const Report = require('../models/Report');

router.get('/', auth, adminOnly, reportController.getReports);
router.post('/', auth, reportController.submitReport);
router.put('/:reportId/review', auth, adminOnly, reportController.markAsReviewed);



module.exports = router;