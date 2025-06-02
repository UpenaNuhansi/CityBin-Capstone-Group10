const Bin = require('../models/binModels');
const AppUser = require('../models/User');
const validator = require('../validators/binValidator');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await AppUser.findById(req.user._id);
    if (!user || user.role !== 'Admin') {
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

// Get all bins
const getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find().populate('assignedTo', 'name email');
    res.status(200).json({
      status: 'success',
      data: bins
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch bins'
    });
  }
};

// Create a new bin
const createBin = async (req, res) => {
  try {
    const { binId, location, wasteLevel, maintenance, coordinates, deviceStatus } = req.body;
    if (!binId || !location || !coordinates || !coordinates.lat || !coordinates.lng) {
      return res.status(400).json({
        status: 'fail',
        message: 'Missing required fields'
      });
    }
    const newBin = await Bin.create({
      binId,
      location,
      wasteLevel: wasteLevel || 0,
      maintenance: maintenance || 'OK',
      coordinates,
      deviceStatus: deviceStatus || 'online',
      lastUpdate: 'Just now'
    });
    res.status(201).json({
      status: 'success',
      data: newBin
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Update a bin
const updateBin = async (req, res) => {
  try {
    const { binId, location, wasteLevel, maintenance, coordinates, deviceStatus } = req.body;
    const bin = await Bin.findOneAndUpdate(
      { binId: req.params.binId },
      {
        binId,
        location,
        wasteLevel,
        maintenance,
        coordinates,
        deviceStatus,
        lastUpdate: 'Just now'
      },
      { new: true, runValidators: true }
    );
    if (!bin) {
      return res.status(404).json({
        status: 'fail',
        message: 'Bin not found'
      });
    }
    res.status(200).json({
      status: 'success',
      data: bin
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Assign maintenance to a user
const assignMaintenance = async (req, res) => {
  try {
    const { userId } = req.body;
    const bin = await Bin.findOne({ binId: req.params.binId });
    if (!bin) {
      return res.status(404).json({
        status: 'fail',
        message: 'Bin not found'
      });
    }
    const user = await AppUser.findById(userId);
    if (!user || !['Operator', 'Manager'].includes(user.role)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid user or user role for maintenance'
      });
    }
    bin.assignedTo = userId;
    bin.maintenance = 'Required';
    bin.lastUpdate = 'Just now';
    await bin.save();
    res.status(200).json({
      status: 'success',
      data: bin
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Get bin by ID
const getBinById = async (req, res) => {
  try {
    const bin = await Bin.findOne({ binId: req.params.binId });
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }
    res.status(200).json(bin);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete bin
const deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findOneAndDelete({ binId: req.params.binId });
    if (!bin) {
      return res.status(404).json({ message: 'Bin not found' });
    }
    res.status(200).json({ message: 'Bin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  isAdmin,
  getAllBins,
  createBin,
  updateBin,
  assignMaintenance,
  getBinById,
  deleteBin
};

