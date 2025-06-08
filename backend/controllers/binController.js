const Bin = require('../models/binModels');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Get all bins (Admin only)
const getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find().populate('assignedOperator', 'username uniqueId');
    res.status(200).json({ status: 'success', data: bins });
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Failed to fetch bins' });
  }
};

// Create a new bin
const createBin = async (req, res) => {
  try {
    const { binId, location, wasteLevel, maintenance, coordinates, deviceStatus } = req.body;
    if (!binId || !location || !coordinates?.lat || !coordinates?.lng) {
      return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
    }

    const newBin = await Bin.create({
      binId,
      location,
      wasteLevel: wasteLevel || 0,
      maintenance: maintenance || 'OK',
      coordinates,
      deviceStatus: deviceStatus || 'online',
      lastUpdate: 'Just now',
    });

    res.status(201).json({ status: 'success', data: newBin });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Update bin details
const updateBin = async (req, res) => {
  try {
    const { binId, location, wasteLevel, maintenance, coordinates, deviceStatus } = req.body;

    if (coordinates && (
      typeof coordinates.lat !== 'number' || typeof coordinates.lng !== 'number' ||
      coordinates.lat < -90 || coordinates.lat > 90 || coordinates.lng < -180 || coordinates.lng > 180
    )) {
      return res.status(400).json({ status: 'fail', message: 'Invalid coordinates' });
    }

    const bin = await Bin.findOneAndUpdate(
      { binId: req.params.binId },
      { binId, location, wasteLevel, maintenance, coordinates, deviceStatus, lastUpdate: 'Just now' },
      { new: true, runValidators: true }
    );

    if (!bin) {
      return res.status(404).json({ status: 'fail', message: 'Bin not found' });
    }

    res.status(200).json({ status: 'success', data: bin });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Assign operator to bin
const assignMaintenance = async (req, res) => {
  try {
    const { operatorId } = req.body;
    const { binId } = req.params;

    const bin = await Bin.findOneAndUpdate(
      { binId },
      {
        assignedOperator: operatorId,
        maintenance: 'Required',
        lastUpdate: new Date(),
      },
      { new: true }
    ).populate('assignedOperator', 'username uniqueId email');

    if (!bin) {
      return res.status(404).json({ success: false, message: 'Bin not found' });
    }

    await Notification.create({
      userId: operatorId,
      userRole: 'Operator',
      type: 'MaintenanceAssigned',
      message: `You have been assigned to maintain Bin ${bin.binId} at ${bin.location}.`,
      status: 'Unread',
      binId: bin.binId,
    });

    res.status(200).json({ success: true, data: bin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to assign maintenance', error: err.message });
  }
};

// Get bin by binId
const getBinById = async (req, res) => {
  try {
    const bin = await Bin.findOne({ binId: req.params.binId });
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    res.status(200).json(bin);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete bin
const deleteBin = async (req, res) => {
  try {
    const bin = await Bin.findOneAndDelete({ binId: req.params.binId });
    if (!bin) return res.status(404).json({ message: 'Bin not found' });
    res.status(200).json({ message: 'Bin deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// For operator/mobile usage (stub)
const getUserBinStatus = async (req, res) => {
  try {
    const status = { fillLevel: 70 }; // Replace with real logic
    res.status(200).json({ success: true, data: status });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update bin status (e.g. to OK and unassign operator)
const updateBinStatus = async (req, res) => {
  const { binId } = req.params;
  const { status } = req.body;

  try {
    const bin = await Bin.findOne({ binId });

    if (!bin) return res.status(404).json({ message: 'Bin not found' });

    bin.maintenance = status;

    // If maintenance marked OK, unassign operator and notify
    if (status === 'OK' && bin.assignedOperator) {
      const operatorId = bin.assignedOperator;

      await Notification.create({
        userId: operatorId,
        binId: bin.binId,
        message: `Maintenance for Bin #${bin.binId} marked as OK by Admin.`,
        userRole: 'Operator',
        type: 'MaintenanceCleared',
        status: 'Unread',
      });

      bin.assignedOperator = null;
    }

    await bin.save();

    res.status(200).json({ success: true, bin });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update bin', error: err.message });
  }
};

// Get bins assigned to the currently logged-in operator
const getBinsAssignedToOperator = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole === 'Operator') {
      const operatorId = req.user.id;
      const bins = await Bin.find({ assignedOperator: operatorId });
      return res.status(200).json({ data: bins });
    }

    if (userRole === 'Admin') {
      const bins = await Bin.find({ assignedOperator: { $ne: null } });
      return res.status(200).json({ data: bins });
    }

    return res.status(403).json({ message: 'Access denied: Operators or Admins only.' });
  } catch (error) {
    console.error('Error getting bins for operator:', error);
    res.status(500).json({ message: 'Failed to fetch assigned bins' });
  }
};

// New: Get Bin Statistics
const getBinStats = async (req, res) => {
  try {
    const total = await Bin.countDocuments();
    const active = await Bin.countDocuments({ status: 'OK' });
    const full = await Bin.countDocuments({ status: 'Full' });
    const maintenance = await Bin.countDocuments({ status: 'Maintenance Required' });

    res.status(200).json({ total, active, full, maintenance });
  } catch (error) {
    console.error('Error fetching bin stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




module.exports = {
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
};
