const bcrypt = require('bcryptjs');

const User = require('../models/User');

// admin authorization middleware
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Server error during authorization'
    });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Do not return password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role, status } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //let the model's pre-save hook handle password hashing
    const newUser = await User.create({ 
      username, 
      email, 
      password: hashedPassword, 
      role: role || 'User', 
      status: status || 'Active' 
    });
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      lastLogin: newUser.lastLogin
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      delete updates.password;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};