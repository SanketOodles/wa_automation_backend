const { Supplier, Organisation } = require('../../models');
const { Op } = require('sequelize');

class SupplierController {
    // Get all suppliers with pagination and filtering
    static async getAllSuppliers(req) {
        try {
            const { org_id, status, page = 1, limit = 10, search } = req.query;
            const offset = (page - 1) * limit;

            const where = {};
            if (org_id) where.org_id = org_id;
            if (status) where.status = status;
            if (search) {
                where.name = {
                    [Op.iLike]: `%${search}%`
                };
            }

            const suppliers = await Supplier.findAndCountAll({
                where,
                limit,
                offset,
                order: [['created_at', 'DESC']],
                include: [
                    {
                        model: Organisation,
                        as: 'organisation',
                        attributes: ['id', 'name']
                    }
                ]
            });

            return {
                success: true,
                data: {
                    suppliers: suppliers.rows,
                    total: suppliers.count,
                    currentPage: page,
                    totalPages: Math.ceil(suppliers.count / limit)
                }
            };
        } catch (error) {
            console.error('Error in getAllSuppliers:', error);
            throw {
                success: false,
                message: error.message || 'Failed to fetch suppliers',
                error: error instanceof Error ? error.message : error
            };
        }
    }

    // Get single supplier by ID
    static async getSupplierById(req) {
        try {
            const supplier = await Supplier.findByPk(req.params.id, {
                include: [
                    {
                        model: Organisation,
                        as: 'organisation',
                        attributes: ['id', 'name']
                    }
                ]
            });

            if (!supplier) {
                throw new Error('Supplier not found');
            }

            return {
                success: true,
                data: supplier
            };
        } catch (error) {
            console.error('Error in getSupplierById:', error);
            throw {
                success: false,
                message: error.message || 'Failed to fetch supplier',
                error: error instanceof Error ? error.message : error
            };
        }
    }

    // Create new supplier (Admin only)
    static async createSupplier(req) {
        try {
            const { name, org_id, status } = req.body;
            
            if (!name || !org_id) {
                throw new Error('Name and org_id are required');
            }

            // Check if organisation exists
            const organisation = await Organisation.findByPk(org_id);
            if (!organisation) {
                throw new Error('Organisation not found');
            }

            const supplier = await Supplier.create({
                name,
                org_id,
                status: status || 'active',
                created_by_id: req.user?.id
            });

            return {
                success: true,
                data: supplier
            };
        } catch (error) {
            console.error('Error in createSupplier:', error);
            throw {
                success: false,
                message: error.message || 'Failed to create supplier',
                error: error instanceof Error ? error.message : error
            };
        }
    }

    // Update supplier (Admin only)
    static async updateSupplier(req) {
        try {
            const supplier = await Supplier.findByPk(req.params.id);
            if (!supplier) {
                throw new Error('Supplier not found');
            }

            const { name, org_id, status } = req.body;
            
            if (org_id) {
                // Check if organisation exists
                const organisation = await Organisation.findByPk(org_id);
                if (!organisation) {
                    throw new Error('Organisation not found');
                }
            }

            await supplier.update({
                name,
                org_id,
                status,
                updated_by_id: req.user?.id
            });

            return {
                success: true,
                data: supplier
            };
        } catch (error) {
            console.error('Error in updateSupplier:', error);
            throw {
                success: false,
                message: error.message || 'Failed to update supplier',
                error: error instanceof Error ? error.message : error
            };
        }
    }

    // Delete supplier (Admin only)
    static async deleteSupplier(req) {
        try {
            const supplier = await Supplier.findByPk(req.params.id);
            if (!supplier) {
                throw new Error('Supplier not found');
            }

            await supplier.update({
                status: 'deleted',
                deleted_at: new Date(),
                deleted_by_id: req.user?.id
            });

            return {
                success: true,
                message: 'Supplier deleted successfully'
            };
        } catch (error) {
            console.error('Error in deleteSupplier:', error);
            throw {
                success: false,
                message: error.message || 'Failed to delete supplier',
                error: error instanceof Error ? error.message : error
            };
        }
    }
}

module.exports = SupplierController;