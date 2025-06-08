const bcrypt = require('bcryptjs');
const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username email role uniqueId status lastLogin');
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getOperatorsOnly = async (req, res) => {
  try {
    const operators = await User.find({ role: 'Operator' }).select('-password');
    res.status(200).json({ success: true, data: operators });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch operators' });
  }
};


const createUser = async (req, res) => {
  try {
    const { username, email, password, role, status } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!['User', 'Admin', 'Operator'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ 
      username, 
      email, 
      password: hashedPassword, 
      role, 
      status: status || 'Active' 
    });

    res.status(201).json({
      success: true,
      data: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        uniqueId: newUser.uniqueId,
        status: newUser.status,
        lastLogin: newUser.lastLogin
      }
    });
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, role, status } = req.body;

  try {
    if (!username || !role || !status) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!['User', 'Admin', 'Operator'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { username, role, status },
      { new: true, select: 'username email role uniqueId status lastLogin' }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getUserRewards = async (req, res) => {
  try {
    // Mock rewards data (replace with actual logic)
    const rewards = {
      points: 100,
      stars: 3
    };
    res.status(200).json({ success: true, data: rewards });
  } catch (err) {
    console.error('Error fetching rewards:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserRewards,
  getOperatorsOnly
};