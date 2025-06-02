const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users/users.controller');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');

// Public route to get non-admin roles for frontend dropdown
router.get('/roles/non-admin', usersController.getNonAdminRoles);

// Protected routes - require authentication

// Get all users
router.get('/', authMiddleware, usersController.getAllUsers);

// Get user by ID
router.get('/:id', authMiddleware, usersController.getUserById);

// Admin-only routes

// Create user (admin creating users with role assignment)
router.post('/', authMiddleware, adminAuthMiddleware, usersController.createUser);

// Update user
router.put('/:id', authMiddleware, adminAuthMiddleware, usersController.updateUser);

// Delete user
router.delete('/:id', authMiddleware, adminAuthMiddleware, usersController.deleteUser);

module.exports = router;