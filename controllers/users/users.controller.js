const db = require('../../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

// Get model references
const User = db.User;
const Role = db.Role;
const UserRole = db.UserRole;

/**
 * Get all non-admin roles for the frontend dropdown
 * This endpoint specifically excludes the Admin role (id=1)
 */
exports.getNonAdminRoles = async (req, res) => {
  try {
    // Get all roles except Admin (id=1)
    const roles = await Role.findAll({
      where: {
        id: { [Op.gt]: 1 } // Greater than 1 (excludes Admin role)
      }
    });
    
    return res.status(200).json({
      success: true,
      data: roles,
      message: 'Non-admin roles retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving non-admin roles:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during role retrieval',
      error: error.message
    });
  }
};

/**
 * Helper function to check if user exists
 */
async function getUserIfExists(userId, res) {
  const user = await User.findByPk(userId, {
    attributes: { exclude: ['hash_password'] }
  });
  
  if (!user) {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
    return null;
  }
  
  return user;
}

/**
 * Create user with role assignment
 * This endpoint is used for admin creating users
 */
exports.createUser = async (req, res) => {
  try {
    const { 
      first_name, 
      last_name, 
      email, 
      phone, 
      password, 
      org_id,
      role_id, // This will come from the dropdown selection (non-admin roles only)
      acc_limit
    } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email || !password || !role_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if the selected role exists and is not Admin
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Selected role not found'
      });
    }
    
    // Prevent assigning Admin role via this endpoint
    if (role_id === 1) {
      return res.status(403).json({
        success: false,
        message: 'Cannot assign Admin role through this endpoint'
      });
    }

    // Hash the password
    const saltRounds = 10;
    const hash_password = await bcrypt.hash(password, saltRounds);

    // Create the user
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      phone: phone || null,
      hash_password,
      org_id: org_id || null,
      status: 'active',
      acc_limit: acc_limit || 0,
      created_at: new Date(),
      created_by_id: req.user.id // Set created_by_id to current admin user's ID
    });

    // Assign the selected role to the user
    await UserRole.create({
      user_id: newUser.id,
      role_id,
      status: 'active',
      created_at: new Date(),
      created_by_id: req.user.id // Set created_by_id to current admin user's ID
    });

    // Return success response without sensitive information
    return res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        role_id
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during user creation',
      error: error.message
    });
  }
};

/**
 * Get all users - Protected route
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['hash_password'] },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] }
      }]
    });
    
    return res.status(200).json({
      success: true,
      data: users,
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during user retrieval',
      error: error.message
    });
  }
};

/**
 * Get user by ID - Protected route
 */
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['hash_password'] },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] }
      }]
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: user,
      message: 'User retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during user retrieval',
      error: error.message
    });
  }
};

/**
 * Update user - Admin only route
 * Updates user info and tracks which admin performed the update
 */
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { first_name, last_name, email, phone, status, org_id, role_id, acc_limit } = req.body;
    
    // Check if user exists
    const user = await getUserIfExists(userId, res);
    if (!user) return;
    
    // If email is being changed, check if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email is already in use by another user'
        });
      }
    }
    
    // Update user fields
    const updatedData = {
      first_name: first_name || user.first_name,
      last_name: last_name || user.last_name,
      email: email || user.email,
      phone: phone || user.phone,
      status: status || user.status,
      org_id: org_id || user.org_id,
      acc_limit: acc_limit !== undefined ? acc_limit : user.acc_limit,
      updated_at: new Date(),
      updated_by_id: req.user.id // Set updated_by_id to current admin user's ID
    };
    
    // Update the user
    await user.update(updatedData);
    
    // If role_id is provided, update user's role
    if (role_id) {
      // Check if the role exists
      const role = await Role.findByPk(role_id);
      if (!role) {
        return res.status(404).json({
          success: false,
          message: 'Selected role not found'
        });
      }
      
      // Find the user's current role
      const userRole = await UserRole.findOne({
        where: { user_id: userId }
      });
      
      if (userRole) {
        // Update existing role
        await userRole.update({
          role_id,
          updated_at: new Date(),
          updated_by_id: req.user.id // Set updated_by_id to current admin user's ID
        });
      } else {
        // Create new role assignment
        await UserRole.create({
          user_id: userId,
          role_id,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date(),
          created_by_id: req.user.id // Set created_by_id to current admin user's ID
        });
      }
    }
    
    // Get updated user with roles
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ['hash_password'] },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] }
      }]
    });
    
    return res.status(200).json({
      success: true,
      data: updatedUser,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during user update',
      error: error.message
    });
  }
};

/**
 * Delete user - Admin only route
 * Soft deletes a user and tracks which admin performed the deletion
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user exists
    const user = await getUserIfExists(userId, res);
    if (!user) return;
    
    // Set deletion metadata before soft delete
    await user.update({
      deleted_at: new Date(),
      deleted_by_id: req.user.id // Set deleted_by_id to current admin user's ID
    });
    
    // Soft delete the user
    await user.destroy();
    
    // Also soft delete related user roles
    await UserRole.update(
      { 
        deleted_at: new Date(),
        deleted_by_id: req.user.id // Set deleted_by_id to current admin user's ID
      },
      { where: { user_id: userId } }
    );
    
    return res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during user deletion',
      error: error.message
    });
  }
};