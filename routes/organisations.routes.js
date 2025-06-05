const express = require('express');
const router = express.Router();
const organisationController = require('../controllers/organisations/organisation.controller');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');

// Public routes

// Get all organisations
router.get('/', organisationController.getAllOrganisations);

// Get organisation by ID
router.get('/:id', organisationController.getOrganisationById);

// Admin-only routes

// Create organisation (admin creating organisations)
router.post('/', organisationController.createOrganisation);

// Update organisation
router.put('/:id', [authMiddleware, adminAuthMiddleware], organisationController.updateOrganisation);

// Delete organisation
router.delete('/:id', [authMiddleware, adminAuthMiddleware], organisationController.deleteOrganisation);

module.exports = router;