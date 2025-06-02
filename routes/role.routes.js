const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role/role.controller');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');

// Get all roles - Authenticated users can view roles
router.get('/', authMiddleware, roleController.getAllRoles);

// Get role by ID - Authenticated users can view roles
router.get('/:id', authMiddleware, roleController.getRoleById);

// The following routes are restricted to admin users only

// Create role - Admin only
router.post('/', authMiddleware, adminAuthMiddleware, roleController.createRole);

// Update role - Admin only
router.put('/:id', authMiddleware, adminAuthMiddleware, roleController.updateRole);

// Delete role - Admin only
router.delete('/:id', authMiddleware, adminAuthMiddleware, roleController.deleteRole);

module.exports = router;