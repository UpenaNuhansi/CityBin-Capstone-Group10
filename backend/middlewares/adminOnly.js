module.exports = function adminOnly(req, res, next) {
  try {
    if (req.user && req.user.role === 'Admin') {
      next(); // user is admin, continue
    } else {
      return res.status(403).json({ message: 'Access denied: Admins only.' });
    }
  } catch (err) {
    console.error('adminOnly middleware error:', err);
    return res.status(500).json({ message: 'Server error in admin check.' });
  }
};
