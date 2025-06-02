const db = require('../../models');
const { Op } = require('sequelize');

// Get model references
const Role = db.Role;

/**
 * Initialize default roles if they don't exist
 * This should be called when the application starts
 */
exports.initializeDefaultRoles = async () => {
  try {
    console.log('Checking for default roles...');
    
    // Default roles configuration
    const defaultRoles = [
      { 
        id: 1, 
        name: 'Admin', 
        status: 'active',
        created_at: new Date(),
        updated_at: new Date(),
        created_by_id: 1,  // Admin is self-created
      },
      { 
        id: 2, 
        name: 'Manager', 
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
        // Note: created_by_id is intentionally left null for non-Admin roles
      },
      { 
        id: 3, 
        name: 'Manager 2', 
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
        // Note: created_by_id is intentionally left null for non-Admin roles
      },
      { 
        id: 4, 
        name: 'User', 
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
        // Note: created_by_id is intentionally left null for non-Admin roles
      }
    ];
    
    // Check which roles already exist
    const existingRoles = await Role.findAll({
      where: {
        id: {
          [Op.in]: defaultRoles.map(role => role.id)
        }
      }
    });
    
    const existingRoleIds = existingRoles.map(role => role.id);
    
    // Filter out roles that need to be created
    const rolesToCreate = defaultRoles.filter(role => !existingRoleIds.includes(role.id));
    
    if (rolesToCreate.length > 0) {
      console.log(`Creating ${rolesToCreate.length} default roles...`);
      await Role.bulkCreate(rolesToCreate);
      console.log('Default roles created successfully');
    } else {
      console.log('All default roles already exist. No new roles created.');
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing default roles:', error);
    return false;
  }
};

/**
 * Get all roles - Protected route
 */
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    
    return res.status(200).json({
      success: true,
      data: roles,
      message: 'Roles retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving roles:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during role retrieval',
      error: error.message
    });
  }
};

/**
 * Get role by ID - Protected route
 */
exports.getRoleById = async (req, res) => {
  try {
    const roleId = req.params.id;
    
    const role = await Role.findByPk(roleId);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: role,
      message: 'Role retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving role:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during role retrieval',
      error: error.message
    });
  }
};

/**
 * Update role - Admin only route
 * Only allows updating non-admin roles (role_id > 1)
 */
exports.updateRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    const { name, status } = req.body;
    
    // Find the role
    const role = await Role.findByPk(roleId);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Check if attempting to modify the Admin role
    if (role.id === 1) {
      return res.status(403).json({
        success: false,
        message: 'Cannot modify the Admin role'
      });
    }
    
    // Check if updating to a name that already exists
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ where: { name } });
      if (existingRole) {
        return res.status(409).json({
          success: false,
          message: 'Role with this name already exists'
        });
      }
    }
    
    // Update the role
    const updatedData = {
      name: name || role.name,
      status: status || role.status,
      updated_at: new Date(),
      updated_by_id: req.user.id  // Set updated_by_id to current admin user's ID
    };
    
    await role.update(updatedData);
    
    return res.status(200).json({
      success: true,
      data: role,
      message: 'Role updated successfully'
    });
  } catch (error) {
    console.error('Error updating role:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during role update',
      error: error.message
    });
  }
};

/**
 * Delete role - Admin only route
 * Only allows deleting custom roles (role_id > 1)
 */
exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;
    
    // Check for protected roles (cannot delete default roles)
    if (roleId <= 1) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete default system roles'
      });
    }
    
    // Find the role
    const role = await Role.findByPk(roleId);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }
    
    // Set deletion metadata before soft delete
    await role.update({
      deleted_at: new Date(),
      deleted_by_id: req.user.id  // Set deleted_by_id to current admin user's ID
    });
    
    // Soft delete the role
    await role.destroy();
    
    return res.status(200).json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during role deletion',
      error: error.message
    });
  }
};

/**
 * Create role - Admin only route
 */
exports.createRole = async (req, res) => {
  try {
    const { name, status } = req.body;
    
    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Role name is required'
      });
    }
    
    // Check if role with this name already exists
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(409).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }
    console.log(req.body)
    // Create the role
    
    const newRole = await Role.create({
      name,
      status: status || 'active',
      created_at: new Date(),
      created_by_id: req.user.id  // Set created_by_id to current admin user's ID
    });
    
    return res.status(201).json({
      success: true,
      data: newRole,
      message: 'Role created successfully'
    });
  } catch (error) {
    console.error('Error creating role:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during role creation',
      error: error.message
    });
  }
};