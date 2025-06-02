'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Supplier extends Model {
        static associate(models) {
            // A Supplier belongs to an Organisation
            Supplier.belongsTo(models.Organisation, {
                foreignKey: 'org_id',
                as: 'organisation',
                onDelete: 'CASCADE'
            });

            // A Supplier can have many Products
            Supplier.belongsToMany(models.Product, {
                through: 'supplier_products',
                foreignKey: 'supplier_id',
                otherKey: 'product_id',
                as: 'products'
            });
        }
    }

    Supplier.init({
        id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Supplier name is required'
                },
                len: {
                    args: [1, 100],
                    msg: 'Supplier name must be between 1 and 100 characters'
                }
            }
        },
        org_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'organisations',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        status: {
            type: DataTypes.ENUM('active', 'inactive', 'deleted'),
            defaultValue: 'active',
            allowNull: false,
            validate: {
                isIn: {
                    args: [['active', 'inactive', 'deleted']],
                    msg: 'Status must be either active, inactive, or deleted'
                }
            }
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        deleted_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        created_by_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'SET NULL'
        },
        updated_by_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'SET NULL'
        },
        deleted_by_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            },
            onDelete: 'SET NULL'
        }
    }, {
        sequelize,
        modelName: 'Supplier',
        tableName: 'suppliers',
        timestamps: true,
        underscored: true,
        paranoid: true,
        defaultScope: {
            attributes: { 
                exclude: ['deleted_at'] 
            }
        },
        scopes: {
            withDeleted: {
                paranoid: false
            }
        },
        hooks: {
            beforeCreate: (supplier) => {
                // Ensure name is trimmed
                if (supplier.name) {
                    supplier.name = supplier.name.trim();
                }
            },
            beforeUpdate: (supplier) => {
                // Ensure name is trimmed on update
                if (supplier.changed('name') && supplier.name) {
                    supplier.name = supplier.name.trim();
                }
            }
        }
    });

    return Supplier;
};