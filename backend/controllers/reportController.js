const Report = require('../models/Report');
const Notification = require('../models/Notification');
const User = require('../models/User');

const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('userId', 'uniqueId')
      .sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      reports: reports 
    });
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reports',
      error: err.message 
    });
  }
};

// console.log('📩 Incoming report data:', req.body);
const submitReport = async (req, res) => {
  try {
    const { binCategory, problem, description, userId, uniqueId, submittedAt } = req.body;

    if (!binCategory || !problem || !description || !userId || !uniqueId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bin category, problem, description, userId, and uniqueId are required' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const report = await Report.create({
      binCategory,
      problem,
      description,
      userId,
      uniqueId,
      submittedAt: submittedAt || new Date()
    });


    // Notify admin
    await Notification.create({
      message: `New report: ${problem} issue with ${binCategory} (${uniqueId})`,
      userRole: 'Admin',
      type: 'ReportSubmission',
      binId: uniqueId, // Replace with actual bin ID if needed
    });

    // Notify user
    await Notification.create({
      userId: user._id,
      message: `Your ${binCategory} report (${problem}) has been submitted`,
      type: 'ReportSubmission',
      userRole: user.role
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Report submitted successfully',
      data: report 
    });
  } catch (err) {
    console.error('Error submitting report:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit report',
      error: err.message 
    });
  }
};

const markAsReviewed = async (req, res) => {
  try {
    const { reportId } = req.params;
    const adminId = req.user._id;

    const updated = await Report.findByIdAndUpdate(
      reportId,
      {
        reviewed: true,
        reviewedBy: adminId,
        reviewedAt: new Date()
      },
      { new: true, runValidators: false }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Notify user
    await Notification.create({
      userId: updated.userId,
      message: `Your ${updated.binCategory} report has been reviewed`,
      type: 'ReportReviewed',
      userRole: 'User'
    });

    return res.status(200).json({
      success: true,
      message: 'Report marked as reviewed',
      data: updated
    });
  } catch (error) {
    console.error('Review error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to review report',
      error: error.message
    });
  }
};


module.exports = {
  getReports,
  submitReport,
  markAsReviewed
};