'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Brand extends Model {
        static associate(models) {
            // A Brand has many ProductBrands
            Brand.hasMany(models.ProductBrand, { 
                foreignKey: 'brand_id',
                as: 'productBrands',
                onDelete: 'CASCADE',
                hooks: true
            });

            // A Brand can have many Products through ProductBrand
            Brand.belongsToMany(models.Product, {
                through: 'product_brands',
                foreignKey: 'brand_id',
                otherKey: 'product_id',
                as: 'products',
                onDelete: 'CASCADE'
            });

            // A Brand belongs to an Organisation
            Brand.belongsTo(models.Organisation, { 
                foreignKey: 'org_id',
                as: 'organisation',
                onDelete: 'CASCADE'
            });
        }
    }


    Brand.init({
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
                    msg: 'Brand name is required'
                },
                len: {
                    args: [1, 100],
                    msg: 'Brand name must be between 1 and 100 characters'
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
        modelName: 'Brand',
        tableName: 'brands',
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
            beforeCreate: (brand) => {
                // Ensure name is trimmed
                if (brand.name) {
                    brand.name = brand.name.trim();
                }
            },
            beforeUpdate: (brand) => {
                // Ensure name is trimmed on update
                if (brand.changed('name') && brand.name) {
                    brand.name = brand.name.trim();
                }
            }
        }
    });

    return Brand;
};