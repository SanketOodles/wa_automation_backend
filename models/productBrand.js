'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ProductBrand extends Model {
        static associate(models) {
            // One ProductBrand belongs to a Brand
            ProductBrand.belongsTo(models.Brand, { 
                foreignKey: 'brand_id', 
                as: 'brand' 
            });
            
            // One ProductBrand belongs to a Product
            ProductBrand.belongsTo(models.Product, { 
                foreignKey: 'product_id', 
                as: 'product' 
            });

            // ProductBrand belongs to an Organisation
            ProductBrand.belongsTo(models.Organisation, {
                foreignKey: 'org_id',
                as: 'organisation'
            });
        }
    }

    ProductBrand.init({
        id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'products',
                key: 'id'
            }
        },
        brand_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'brands',
                key: 'id'
            }
        },
        org_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'organisations',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'active',
            allowNull: false
        },
        created_by_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        updated_by_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        deleted_by_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'users',
                key: 'id'
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
    }, {
        sequelize,
        modelName: 'ProductBrand',
        tableName: 'product_brands',
        timestamps: true,
        underscored: true,
        paranoid: true,
    });

    return ProductBrand;
};