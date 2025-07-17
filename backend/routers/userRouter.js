const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const userController = require('../controllers/userController');
const upload = require('../middlewares/uploadAvatar');
const { uploadUserAvatar } = require('../controllers/userController');

// Middleware to ensure only admins can access these routes
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
};

// Route: GET all users
router.get('/',auth, adminOnly, userController.getAllUsers);

// Route: GET users, optionally filtered by role (e.g., ?role=operator)
router.get('/operators', auth, adminOnly, userController.getOperatorsOnly);


// Route: POST create user
router.post('/',auth, adminOnly, userController.createUser);

// Route: PUT update user by ID
router.put('/:userId',auth, adminOnly, userController.updateUser);

// Route: DELETE user by ID
router.delete('/:userId',auth, adminOnly, userController.deleteUser);

router.get('/rewards', auth, userController.getUserRewards);

// Route: PUT change password
router.put('/:userId/change-password', auth, userController.changeUserPassword);

// Route: PUT upload avatar
router.post('/:userId/upload-avatar', auth, upload.single('avatar'), userController.uploadUserAvatar);


module.exports = router;
