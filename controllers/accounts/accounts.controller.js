const db = require('../../models');
const { Account } = db;
const { Op } = require('sequelize');
const { errorResponse, successResponse } = require('../../utils/apiResponse');

/**
 * Create a new account
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.createAccount = async (req, res) => {
  try {
    const { org_id, qr_session, status, ip_address, location } = req.body;
    const userId = req.user?.id;

    if (!org_id) {
      return errorResponse(res, 'Organization ID is required', 400);
    }

    const account = await Account.create({
      org_id,
      qr_session,
      status: status || 'inactive',
      ip_address,
      location,
      created_by_id: userId,
      updated_by_id: userId,
    });

    return successResponse(res, 'Account created successfully', account);
  } catch (error) {
    console.error('Error creating account:', error);
    return errorResponse(res, 'Failed to create account', 500);
  }
};

/**
 * Get all accounts
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getAllAccounts = async (req, res) => {
  try {
    const { org_id, status } = req.query;
    const queryOptions = {};
    
    if (org_id) {
      queryOptions.where = { ...queryOptions.where, org_id };
    }
    
    if (status) {
      queryOptions.where = { ...queryOptions.where, status };
    }

    const accounts = await Account.findAll(queryOptions);
    
    return successResponse(res, 'Accounts fetched successfully', accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return errorResponse(res, 'Failed to fetch accounts', 500);
  }
};

/**
 * Get accounts by organization ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getAccountsByOrgId = async (req, res) => {
  try {
    const { orgId } = req.params;
    
    if (!orgId) {
      return errorResponse(res, 'Organization ID is required', 400);
    }
    
    // Create a sample account for testing if none exist
    const accountCount = await Account.count({
      where: { org_id: orgId }
    });
    
    if (accountCount === 0) {
      // Create a sample account for testing
      await Account.create({
        org_id: orgId,
        status: 'active',
        qr_session: 'test-session',
        ip_address: '127.0.0.1',
        location: 'Test Location',
        created_by_id: 1,
        updated_by_id: 1
      });
    }
    
    const accounts = await Account.findAll({
      where: { org_id: orgId },
    });
    
    return successResponse(res, 'Accounts fetched successfully', accounts);
  } catch (error) {
    console.error('Error fetching accounts by org ID:', error);
    return errorResponse(res, 'Failed to fetch accounts', 500);
  }
};

/**
 * Get account by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getAccountById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return errorResponse(res, 'Account ID is required', 400);
    }
    
    const account = await Account.findByPk(id);
    
    if (!account) {
      return errorResponse(res, 'Account not found', 404);
    }
    
    return successResponse(res, 'Account fetched successfully', account);
  } catch (error) {
    console.error('Error fetching account by ID:', error);
    return errorResponse(res, 'Failed to fetch account', 500);
  }
};

/**
 * Update account by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { org_id, qr_session, status, ip_address, location } = req.body;
    const userId = req.user?.id;
    
    if (!id) {
      return errorResponse(res, 'Account ID is required', 400);
    }
    
    const account = await Account.findByPk(id);
    
    if (!account) {
      return errorResponse(res, 'Account not found', 404);
    }
    
    const updatedAccount = await account.update({
      org_id,
      qr_session,
      status,
      ip_address,
      location,
      updated_by_id: userId,
    });
    
    return successResponse(res, 'Account updated successfully', updatedAccount);
  } catch (error) {
    console.error('Error updating account:', error);
    return errorResponse(res, 'Failed to update account', 500);
  }
};

/**
 * Delete account by ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    
    if (!id) {
      return errorResponse(res, 'Account ID is required', 400);
    }
    
    const account = await Account.findByPk(id);
    
    if (!account) {
      return errorResponse(res, 'Account not found', 404);
    }
    
    // First update the status to disconnected to reflect in the UI
    await account.update({ 
      status: 'disconnected',
      updated_by_id: userId,
      deleted_by_id: userId 
    });
    
    // Then apply soft delete
    await account.destroy();
    
    // Optionally try to disconnect from active clients list
    try {
      // Import the authController for disconnect functionality
      const authController = require('../authController');
      
      // Attempt to find and disconnect any active WhatsApp client for this account
      if (authController.activeClients && Array.isArray(authController.activeClients)) {
        const clientIndex = authController.activeClients.findIndex(item => 
          item.accountId && item.accountId.toString() === id.toString());
          
        if (clientIndex !== -1) {
          const clientToDisconnect = authController.activeClients[clientIndex].client;
          await clientToDisconnect.destroy();
          authController.activeClients.splice(clientIndex, 1);
          console.log(`WhatsApp client for account ${id} disconnected`);
        }
      }
    } catch (disconnectError) {
      console.error(`Warning: Could not disconnect WhatsApp client for account ${id}:`, disconnectError);
      // Continue with the account deletion even if client disconnect fails
    }
    
    return successResponse(res, 'Account disconnected and deleted successfully');
  } catch (error) {
    console.error('Error deleting account:', error);
    return errorResponse(res, 'Failed to delete account', 500);
  }
};

/**
 * Get account status summary by organization ID
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
exports.getAccountStatusSummary = async (req, res) => {
  try {
    const { orgId } = req.params;
    
    if (!orgId) {
      return errorResponse(res, 'Organization ID is required', 400);
    }
    
    // Create a sample account for testing if none exist
    const accountCount = await Account.count({
      where: { org_id: orgId }
    });
    
    if (accountCount === 0) {
      // Create a sample account for testing
      await Account.create({
        org_id: orgId,
        status: 'active',
        qr_session: 'test-session',
        ip_address: '127.0.0.1',
        location: 'Test Location',
        created_by_id: 1,
        updated_by_id: 1
      });
    }
    
    const activeCount = await Account.count({
      where: { 
        org_id: orgId,
        status: 'active'
      }
    });
    
    const inactiveCount = await Account.count({
      where: { 
        org_id: orgId,
        status: 'inactive'
      }
    });
    
    const summary = {
      active: activeCount,
      inactive: inactiveCount,
      total: activeCount + inactiveCount
    };
    
    return successResponse(res, 'Account status summary fetched successfully', summary);
  } catch (error) {
    console.error('Error fetching account status summary:', error);
    return errorResponse(res, 'Failed to fetch account status summary', 500);
  }
};