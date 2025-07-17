const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');
const adminOnly = require('../middlewares/adminOnly');

router.get('/user/:userId', auth, notificationController.getUserNotifications);
router.put('/:notificationId/read', auth, notificationController.markAsRead);
router.post('/bulk', auth, adminOnly, notificationController.sendBulkNotification);
router.get('/operator-tasks', auth, notificationController.getOperatorTasks);
router.put('/:id/done', auth, notificationController.markTaskAsDone);
router.post('/common', auth, notificationController.sendCommonNotification);
router.get('/common', auth, notificationController.getCommonNotifications);
router.get('/operator', auth, notificationController.getOperatorNotifications);
router.put('/:id/read-status', auth, notificationController.updateReadStatus);




module.exports = router;