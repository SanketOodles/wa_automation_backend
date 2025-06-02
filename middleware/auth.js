const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

/**
 * Middleware to verify JWT token and authenticate users
 * This will set req.user with the authenticated user details if successful
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from request header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - No token provided'
      });
    }
    
    // Extract token from header
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid token format'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by ID from token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] } // Don't include password in the returned user object
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User not found'
      });
    }
    
    // Set user in request object for use in subsequent middleware/controllers
    req.user = user;
    
    // Proceed to next middleware/controller
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid or expired token'
      });
    }
    
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: error.message
    });
  }
};

module.exports = authMiddleware;