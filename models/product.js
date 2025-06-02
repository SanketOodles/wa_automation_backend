'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            // A Product can have many ProductBrands
            Product.hasMany(models.ProductBrand, { 
                foreignKey: 'product_id',
                as: 'productBrands',
                onDelete: 'CASCADE'
            });

            // A Product can have many Brands through ProductBrand
            Product.belongsToMany(models.Brand, {
                through: 'product_brands',
                foreignKey: 'product_id',
                otherKey: 'brand_id',
                as: 'brands',
                onDelete: 'CASCADE'
            });

            // A Product belongs to an Organisation
            Product.belongsTo(models.Organisation, {
                foreignKey: 'org_id',
                as: 'organisation',
                onDelete: 'CASCADE'
            });

            // A Product can be associated with multiple Chats
            Product.hasMany(models.Chat, {
                foreignKey: 'product_id',
                as: 'chats',
                onDelete: 'SET NULL'
            });

            // A Product can be associated with multiple Chat Templates
            Product.hasMany(models.ChatTemplate, {
                foreignKey: 'product_id',
                as: 'chatTemplates',
                onDelete: 'SET NULL'
            });

            // A Product can have many Suppliers
            Product.belongsToMany(models.Supplier, {
                through: 'supplier_products',
                foreignKey: 'product_id',
                otherKey: 'supplier_id',
                as: 'suppliers'
            });
        }
    }


    Product.init({
        id: { 
            type: DataTypes.INTEGER, 
            autoIncrement: true, 
            primaryKey: true 
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        color_name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
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
        }
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
        underscored: true,
        paranoid: true,
    });

    return Product;
};