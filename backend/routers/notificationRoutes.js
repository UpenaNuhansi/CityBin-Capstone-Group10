const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middlewares/auth');
const adminOnly = require('../middlewares/adminOnly');

router.get('/user/:userId', auth, notificationController.getUserNotifications);
router.put('/:notificationId/read', auth, notificationController.markAsRead);
router.post('/bulk', auth, adminOnly, notificationController.sendBulkNotification);
//router.get('/recent', auth, notificationController.getRecentNotifications);
router.get('/operator-tasks', auth, notificationController.getOperatorTasks);
router.put('/:id/done', auth, notificationController.markTaskAsDone);
router.post('/common', auth, notificationController.sendCommonNotification);
router.get('/common', auth, notificationController.getCommonNotifications);
router.get('/operator', auth, notificationController.getOperatorNotifications);



module.exports = router;