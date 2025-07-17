const UserBin = require('../models/UserBin');

// @desc Get all bins for a specific user
exports.getUserBins = async (req, res) => {
  try {
    const bins = await UserBin.find({ userId: req.params.userId });
    res.json({ success: true, data: bins });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch bins' });
  }
};

// @desc Update a bin's fill level and reward
exports.updateFillLevel = async (req, res) => {
  const { fillLevel } = req.body;
  const { binId } = req.params;

  try {
    const updatedBin = await UserBin.findOneAndUpdate(
      { binId },
      {
        fillLevel,
        lastUpdated: new Date(),
        $inc: { rewardPoints: fillLevel > 70 ? 5 : 1 },
      },
      { new: true }
    );

    if (!updatedBin) {
      return res.status(404).json({ success: false, message: 'Bin not found' });
    }

    res.json({ success: true, data: updatedBin });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};