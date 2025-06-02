const db = require('../models');
const UserRole = db.UserRole;

/**
 * Middleware to check if the authenticated user has Admin role (role_id = 1)
 * This middleware should be used after the regular authentication middleware
 */
const adminAuthMiddleware = async (req, res, next) => {
  try {
    // Get user ID from the authenticated user (set by the auth middleware)
    const userId = req.user.id;
    console.log(userId)
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - User ID not found'
      });
    }
    
    // Check if the user has admin role (role_id = 1)
    const userRole = await UserRole.findOne({
      where: {
        user_id: userId,
        role_id: 1 // Admin role ID
      }
    });
    
    if (!userRole) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - Admin privileges required'
      });
    }
    
    // User has admin role, proceed to the next middleware/controller
    next();
  } catch (error) {
    console.error('Admin authorization error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization check',
      error: error.message
    });
  }
};

module.exports = adminAuthMiddleware;