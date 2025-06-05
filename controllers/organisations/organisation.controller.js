const db = require('../../models');
const { Op } = require('sequelize');

// Get model references
const Organisation = db.Organisation;
const User = db.User;

/**
 * Initialize default organization
 */
exports.initializeDefaultOrganization = async () => {
  try {
    // Check if organization already exists
    const existingOrg = await Organisation.findOne({
      where: { name: 'Oodles' }
    });

    if (existingOrg) {
      console.log('Default organization already exists');
      return;
    }

    // Create default organization
    await Organisation.create({
      name: 'Oodles',
      type_of_organisation: 'Tech',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date(),
      created_by_id: 1
    });

    console.log('Default organization created successfully');
  } catch (error) {
    console.error('Error creating default organization:', error);
    throw error;
  }
};

/**
 * Get all organisations with pagination and filtering
 */
exports.getAllOrganisations = async (req, res) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (status) where.status = status;
    if (search) {
      where.name = {
        [Op.iLike]: `%${search}%`
      };
    }

    const organisations = await Organisation.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });

    return res.status(200).json({
      success: true,
      data: {
        organisations: organisations.rows,
        total: organisations.count,
        currentPage: page,
        totalPages: Math.ceil(organisations.count / limit)
      },
      message: 'Organisations retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving organisations:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during organisation retrieval',
      error: error.message
    });
  }
};

/**
 * Helper function to check if organisation exists
 */
async function getOrganisationIfExists(orgId, res) {
  const organisation = await Organisation.findByPk(orgId, {
    include: [
      {
        model: User,
        as: 'users',
        attributes: ['id', 'first_name', 'last_name', 'email']
      }
    ]
  });
  
  if (!organisation) {
    return res.status(404).json({
      success: false,
      message: 'Organisation not found'
    });
  }
  
  return organisation;
}

/**
 * Create new organisation (Admin only)
 */
exports.createOrganisation = async (req, res) => {
  try {
    const { name, type_of_organisation, status } = req.body;

    // Validate required fields
    if (!name || !type_of_organisation) {
      return res.status(400).json({
        success: false,
        message: 'Name and type_of_organisation are required'
      });
    }

    // Create the organisation
    const newOrganisation = await Organisation.create({
      name,
      type_of_organisation,
      status: status || 'active',
      created_at: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Organisation created successfully',
      data: {
        id: newOrganisation.id,
        name: newOrganisation.name,
        type_of_organisation: newOrganisation.type_of_organisation
      }
    });
  } catch (error) {
    console.error('Error creating organisation:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during organisation creation',
      error: error.message
    });
  }
};

/**
 * Get organisation by ID
 */
exports.getOrganisationById = async (req, res) => {
  try {
    const orgId = req.params.id;
    
    const organisation = await getOrganisationIfExists(orgId, res);
    if (!organisation) return;
    
    return res.status(200).json({
      success: true,
      data: organisation,
      message: 'Organisation retrieved successfully'
    });
  } catch (error) {
    console.error('Error retrieving organisation:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during organisation retrieval',
      error: error.message
    });
  }
};

/**
 * Update organisation (Admin only)
 */
exports.updateOrganisation = async (req, res) => {
  try {
    const orgId = req.params.id;
    const { name, type_of_organisation, status } = req.body;
    
    // Check if organisation exists
    const organisation = await getOrganisationIfExists(orgId, res);
    if (!organisation) return;

    // Update organisation fields
    const updatedData = {
      name: name || organisation.name,
      type_of_organisation: type_of_organisation || organisation.type_of_organisation,
      status: status || organisation.status,
      updated_at: new Date(),
      updated_by_id: req.user.id
    };
    
    // Update the organisation
    await organisation.update(updatedData);
    
    // Get updated organisation with related data
    const updatedOrganisation = await Organisation.findByPk(orgId, {
      include: [
        {
          model: User,
          as: 'users',
          attributes: ['id', 'first_name', 'last_name', 'email']
        }
      ]
    });
    
    return res.status(200).json({
      success: true,
      data: updatedOrganisation,
      message: 'Organisation updated successfully'
    });
  } catch (error) {
    console.error('Error updating organisation:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during organisation update',
      error: error.message
    });
  }
};

/**
 * Delete organisation (Admin only)
 */
exports.deleteOrganisation = async (req, res) => {
  try {
    const orgId = req.params.id;
    
    // Check if organisation exists
    const organisation = await getOrganisationIfExists(orgId, res);
    if (!organisation) return;
    
    // Set deletion metadata before soft delete
    await organisation.update({
      status: 'deleted',
      deleted_at: new Date(),
      deleted_by_id: req.user.id
    });
    
    return res.status(200).json({
      success: true,
      message: 'Organisation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting organisation:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during organisation deletion',
      error: error.message
    });
  }
};

module.exports = exports;
