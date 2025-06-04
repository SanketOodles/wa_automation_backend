const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/suppliers/supplier.controller');
const authMiddleware = require('../middleware/auth');
const adminAuthMiddleware = require('../middleware/adminAuth');

// Helper function to handle controller responses
const handleResponse = (res) => (result) => {
    if (result.success) {
        res.status(200).json(result);
    } else {
        res.status(400).json(result);
    }
};

// Get all suppliers - Authenticated users can view suppliers
router.get('/', authMiddleware, async (req, res) => {
    try {
        const result = await supplierController.getAllSuppliers(req);
        res.json(result);
    } catch (error) {
        res.status(400).json(error);
    }
});

// Get supplier by ID - Authenticated users can view suppliers
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const result = await supplierController.getSupplierById(req);
        res.json(result);
    } catch (error) {
        res.status(400).json(error);
    }
});

// The following routes are restricted to admin users only

// Create supplier - Admin only
router.post('/', authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const result = await supplierController.createSupplier(req);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json(error);
    }
});

// Update supplier - Admin only
router.put('/:id', authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const result = await supplierController.updateSupplier(req);
        res.json(result);
    } catch (error) {
        res.status(400).json(error);
    }
});

// Delete supplier - Admin only
router.delete('/:id', authMiddleware, adminAuthMiddleware, async (req, res) => {
    try {
        const result = await supplierController.deleteSupplier(req);
        res.json(result);
    } catch (error) {
        res.status(400).json(error);
    }
});

module.exports = router;
