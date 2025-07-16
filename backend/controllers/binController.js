const Bin = require('../models/binModels');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Get all bins (Admin only)
const getAllBins = async (req, res) => {
  try {
    const bins = await Bin.find().populate('assignedOperator', 'username uniqueId email');
    // Standardize bin object fields
    const formattedBins = bins.map(bin => ({
      id: bin.binId,
      binId: bin.binId,
      location: bin.location,
      wasteLevel: Number(bin.wasteLevel),
      maintenance: bin.maintenance,
      coordinates: {
        lat: Number(bin.coordinates?.lat),
        lng: Number(bin.coordinates?.lng)
      },
      deviceStatus: bin.deviceStatus,
      lastUpdate: bin.lastUpdate || 'Just now',
      assignedOperator: bin.assignedOperator ? {
        _id: bin.assignedOperator._id,
        username: bin.assignedOperator.username,
        uniqueId: bin.assignedOperator.uniqueId,
        email: bin.assignedOperator.email || null
      } : null,
      status: bin.status || 'OK',
      _id: bin._id
    }));
    res.status(200).json({ status: 'success', data: formattedBins });
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

    // Standardize response
    const formattedBin = {
      id: newBin.binId,
      binId: newBin.binId,
      location: newBin.location,
      wasteLevel: Number(newBin.wasteLevel),
      maintenance: newBin.maintenance,
      coordinates: {
        lat: Number(newBin.coordinates?.lat),
        lng: Number(newBin.coordinates?.lng)
      },
      deviceStatus: newBin.deviceStatus,
      lastUpdate: newBin.lastUpdate || 'Just now',
      assignedOperator: null,
      status: newBin.status || 'OK',
      _id: newBin._id
    };
    console.log('Formatted bin response:', formattedBin);
    res.status(201).json({ status: 'success', data: formattedBin });
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
    ).populate('assignedOperator', 'username uniqueId email');

    if (!bin) {
      return res.status(404).json({ status: 'fail', message: 'Bin not found' });
    }

    // Standardize response
    const formattedBin = {
      id: bin.binId,
      binId: bin.binId,
      location: bin.location,
      wasteLevel: Number(bin.wasteLevel),
      maintenance: bin.maintenance,
      coordinates: {
        lat: Number(bin.coordinates?.lat),
        lng: Number(bin.coordinates?.lng)
      },
      deviceStatus: bin.deviceStatus,
      lastUpdate: bin.lastUpdate || 'Just now',
      assignedOperator: bin.assignedOperator ? {
        _id: bin.assignedOperator._id,
        username: bin.assignedOperator.username,
        uniqueId: bin.assignedOperator.uniqueId,
        email: bin.assignedOperator.email || null
      } : null,
      status: bin.status || 'OK',
      _id: bin._id
    };

    res.status(200).json({ status: 'success', data: formattedBin });
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

    // Standardize response
    const formattedBin = {
      id: bin.binId,
      binId: bin.binId,
      location: bin.location,
      wasteLevel: Number(bin.wasteLevel),
      maintenance: bin.maintenance,
      coordinates: {
        lat: Number(bin.coordinates?.lat),
        lng: Number(bin.coordinates?.lng)
      },
      deviceStatus: bin.deviceStatus,
      lastUpdate: bin.lastUpdate || 'Just now',
      assignedOperator: bin.assignedOperator ? {
        _id: bin.assignedOperator._id,
        username: bin.assignedOperator.username,
        uniqueId: bin.assignedOperator.uniqueId,
        email: bin.assignedOperator.email || null
      } : null,
      status: bin.status || 'OK',
      _id: bin._id
    };

    res.status(200).json({ success: true, data: formattedBin });
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
    let bin = await Bin.findOne({ binId }).populate('assignedOperator', 'username uniqueId email');

    if (!bin) return res.status(404).json({ message: 'Bin not found' });

    bin.maintenance = status;

    // If maintenance marked OK, unassign operator and notify
    if (status === 'OK' && bin.assignedOperator) {
      const operatorId = bin.assignedOperator._id;

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
    await bin.populate('assignedOperator', 'username uniqueId email');

    // Standardize response
    const formattedBin = {
      id: bin.binId,
      binId: bin.binId,
      location: bin.location,
      wasteLevel: Number(bin.wasteLevel),
      maintenance: bin.maintenance,
      coordinates: {
        lat: Number(bin.coordinates?.lat),
        lng: Number(bin.coordinates?.lng)
      },
      deviceStatus: bin.deviceStatus,
      lastUpdate: bin.lastUpdate || 'Just now',
      assignedOperator: bin.assignedOperator ? {
        _id: bin.assignedOperator._id,
        username: bin.assignedOperator.username,
        uniqueId: bin.assignedOperator.uniqueId,
        email: bin.assignedOperator.email || null
      } : null,
      status: bin.status || 'OK',
      _id: bin._id
    };

    res.status(200).json({ success: true, data: formattedBin });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update bin', error: err.message });
  }
};

// Get bins assigned to the currently logged-in operator
// const getBinsAssignedToOperator = async (req, res) => {
//   try {
//     const userRole = req.user.role;

//     if (userRole === 'Operator') {
//       const operatorId = req.user.id;
//       const bins = await Bin.find({ assignedOperator: operatorId });
//       return res.status(200).json({ data: bins });
//     }

//     if (userRole === 'Admin') {
//       const bins = await Bin.find({ assignedOperator: { $ne: null } });
//       return res.status(200).json({ data: bins });
//     }

//     return res.status(403).json({ message: 'Access denied: Operators or Admins only.' });
//   } catch (error) {
//     console.error('Error getting bins for operator:', error);
//     res.status(500).json({ message: 'Failed to fetch assigned bins' });
//   }
// };

// const getBinsAssignedToOperator = async (req, res) => {
//   try {
//     const userRole = req.user.role;
//     const operatorId = req.user.id;

//     let bins;
//     if (userRole === 'Operator') {
//       bins = await Bin.find({ assignedOperator: operatorId }).populate('assignedOperator', 'username uniqueId email');
//       return res.status(200).json({ data: bins });
//     }

//     if (userRole === 'Admin') {
//       bins = await Bin.find({ assignedOperator: { $ne: null } }).populate('assignedOperator', 'username uniqueId email');
//       return res.status(200).json({ data: bins });
//     }

//     return res.status(403).json({ message: 'Access denied: Operators or Admins only.' });
//   } catch (error) {
//     console.error('Error getting bins for operator:', error);
//     res.status(500).json({ message: 'Failed to fetch assigned bins' });
//   }
// };


const getBinsAssignedToOperator = async (req, res) => {
  try {
    const userRole = req.user.role;
    const operatorId = req.user.id;

    console.log('getBinsAssignedToOperator called for user:', req.user); // Debug log
    let bins;
    if (userRole === 'Operator') {
      bins = await Bin.find({ assignedOperator: operatorId }).populate('assignedOperator', 'username uniqueId email');
    } else if (userRole === 'Admin') {
      bins = await Bin.find({ assignedOperator: { $ne: null } }).populate('assignedOperator', 'username uniqueId email');
    } else {
      console.error('Access denied: Invalid role', userRole);
      return res.status(403).json({ message: 'Access denied: Operators or Admins only.' });
    }

    console.log('Assigned bins:', bins.length); // Debug log
    // Standardize bin object fields
    const formattedBins = bins.map(bin => ({
      id: bin.binId,
      binId: bin.binId,
      location: bin.location,
      wasteLevel: Number(bin.wasteLevel),
      maintenance: bin.maintenance,
      coordinates: {
        lat: Number(bin.coordinates?.lat),
        lng: Number(bin.coordinates?.lng)
      },
      deviceStatus: bin.deviceStatus,
      lastUpdate: bin.lastUpdate || 'Just now',
      assignedOperator: bin.assignedOperator ? {
        _id: bin.assignedOperator._id,
        username: bin.assignedOperator.username,
        uniqueId: bin.assignedOperator.uniqueId,
        email: bin.assignedOperator.email || null
      } : null,
      status: bin.status || 'OK',
      _id: bin._id
    }));
    res.status(200).json({ data: formattedBins });
  } catch (error) {
    console.error('Error getting bins for operator:', error.message, error.stack);
    res.status(500).json({ message: 'Failed to fetch assigned bins' });
  }
};




// New: Get Bin Statistics
// const getBinStats = async (req, res) => {
//   try {
//     const total = await Bin.countDocuments();
//     const active = await Bin.countDocuments({ status: 'OK' });
//     const full = await Bin.countDocuments({ status: 'Full' });
//     const maintenance = await Bin.countDocuments({ status: 'Maintenance Required' });

//     res.status(200).json({ total, active, full, maintenance });
//   } catch (error) {
//     console.error('Error fetching bin stats:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// const getBinStats = async (req, res) => {
//   try {
//     const bins = await Bin.find(); // No filtering — show all to both roles

//     const total = bins.length;
//     const active = bins.filter(bin => bin.deviceStatus === 'online').length;
//     const full = bins.filter(bin => bin.wasteLevel >= 90).length;
//     const maintenance = bins.filter(bin => bin.maintenance === 'Required').length;

//     res.status(200).json({
//       total,
//       active,
//       full,
//       maintenance
//     });
//     // New: Allow both Admin and Operator
// // if (req.user.role !== 'Admin' && req.user.role !== 'Operator') {
// //   return res.status(403).json({ message: 'Access denied.' });
// // }

//   } catch (error) {
//     console.error('Error fetching bin stats:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// const getBinStats = async (req, res) => {
//   try {
//     const total = await Bin.countDocuments();
//     const active = await Bin.countDocuments({ status: 'OK' });
//     const full = await Bin.countDocuments({ status: 'Full' });
//     const maintenance = await Bin.countDocuments({ status: 'Maintenance' });

//     res.status(200).json({
//       total,
//       active,
//       full,
//       maintenance,
//     });
//   } catch (error) {
//     console.error('Failed to get bin stats:', error.message);
//     res.status(500).json({ message: 'Error fetching bin statistics' });
//   }
// };


// const getBinStats = async (req, res) => {
//   try {
//     const user = req.user; // Populated by auth middleware
//     let query = {};

//     // If Operator, optionally filter by assigned bins 
//     // if (user.role === 'Operator') {
//     //   query.assignedOperator = user.id;
//     // }

//     const total = await Bin.countDocuments(query);
//     const active = await Bin.countDocuments({ ...query, deviceStatus: 'online' });
//     const full = await Bin.countDocuments({ ...query, wasteLevel: { $gte: 90 } });
//     const maintenance = await Bin.countDocuments({ ...query, maintenance: 'Required' });

//     res.status(200).json({
//       total,
//       active,
//       full,
//       maintenance,
//     });
//   } catch (error) {
//     console.error('Failed to get bin stats:', error.message);
//     res.status(500).json({ message: 'Error fetching bin statistics' });
//   }
// };


const getBinStats = async (req, res) => {
  try {
    const total = await Bin.countDocuments();
    const active = await Bin.countDocuments({ deviceStatus: 'online' });
    const full = await Bin.countDocuments({ wasteLevel: { $gte: 90 } });
    const maintenance = await Bin.countDocuments({ maintenance: 'Required' });
    res.status(200).json({ total, active, full, maintenance });
  } catch (error) {
    res.status(200).json({ total: 0, active: 0, full: 0, maintenance: 0, error: 'Failed to fetch bin statistics' });
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
