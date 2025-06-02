'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Organisation extends Model {
    static associate(models) {
      // Accounts relationship
      // Define associations only if the model exists
      if (models.Account) {
        Organisation.hasMany(models.Account, {
          foreignKey: 'org_id',
          as: 'accounts',
          onDelete: 'CASCADE'
        });
      }

      if (models.User) {
        Organisation.hasMany(models.User, {
          foreignKey: 'org_id',
          as: 'users',
          onDelete: 'CASCADE'
        });
      }

      if (models.Product) {
        Organisation.hasMany(models.Product, {
          foreignKey: 'org_id',
          as: 'products',
          onDelete: 'CASCADE'
        });
      }

      if (models.Brand) {
        Organisation.hasMany(models.Brand, {
          foreignKey: 'org_id',
          as: 'brands',
          onDelete: 'CASCADE'
        });
      }

      if (models.Supplier) {
        Organisation.hasMany(models.Supplier, {
          foreignKey: 'org_id',
          as: 'suppliers',
          onDelete: 'CASCADE'
        });
      }

      if (models.Chat) {
        Organisation.hasMany(models.Chat, {
          foreignKey: 'org_id',
          as: 'chats',
          onDelete: 'CASCADE'
        });
      }

      if (models.Channel) {
        Organisation.hasMany(models.Channel, {
          foreignKey: 'org_id',
          as: 'channels',
          onDelete: 'CASCADE'
        });
      }
    }
  }

  Organisation.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: DataTypes.STRING,
      status: DataTypes.STRING,
      type_of_organisation: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      deleted_at: DataTypes.DATE,
      created_by_id: DataTypes.INTEGER,
      updated_by_id: DataTypes.INTEGER,
      deleted_by_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Organisation',
      tableName: 'organisations',
      timestamps: true,
      underscored: true,
      paranoid: true,
    }
  );

  return Organisation;
};



