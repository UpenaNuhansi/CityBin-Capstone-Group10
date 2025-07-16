const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log('Auth middleware: Decoded token:', decoded); // Debug log
    // if (!decoded.id || !decoded.role) {
    //   console.error('Auth middleware: Invalid token payload, missing id or role');
    //   return res.status(401).json({ success: false, message: 'Invalid token payload' });
    // }
    req.user = {
      id: decoded.id, // Standardize to _id for consistency
      role: decoded.role
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token has expired' });
    }
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

module.exports = auth;