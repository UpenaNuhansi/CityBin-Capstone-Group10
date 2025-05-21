const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route: GET all users
router.get('/', userController.getAllUsers);

// Route: POST create user
router.post('/', userController.createUser);

// Route: PUT update user by ID
router.put('/:id', userController.updateUser);

// Route: DELETE user by ID
router.delete('/:id', userController.deleteUser);

module.exports = router;
